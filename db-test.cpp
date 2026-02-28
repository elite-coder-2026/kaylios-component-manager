// db-test.cpp
//
// Postgres interaction example using libpq (the C client library).
// This is intended as a "backend in C++ talks to the same DB" demo.
//
// It expects the same env var used by this repo's Node server:
//   - DATABASE_URL (required unless you pass --url)
// Optional:
//   - DATABASE_SSL=true|false (if true, uses sslmode=require)
//
// Build (macOS/Linux, if libpq + pkg-config are installed):
//   c++ -std=c++20 -O2 -Wall -Wextra -pedantic db-test.cpp $(pkg-config --cflags --libs libpq) -o db-test
//
// If pkg-config isn't available, you'll need something like:
//   c++ -std=c++20 -O2 -Wall -Wextra -pedantic db-test.cpp -lpq -o db-test
// ...plus include/library paths depending on how Postgres is installed.
//
// Run examples (from repo root):
//   ./db-test --ping
//   ./db-test --list-components
//   ./db-test --search "dialog" --limit 10
//   ./db-test --component react alert-banner --files
//   ./db-test --component react confirm-dialog --content --max-bytes 800
//
// Notes:
// - This code avoids destructive queries (no INSERT/DELETE).
// - Schema is inferred from the Node service in `server/src/services/components.service.js`:
//     tables: components, component_files
//     key: component_files.component_id -> components.id
//
// Not production-ready: no pooling, no retries, no migrations, no TLS verification control.

#include <libpq-fe.h>

#include <cstdlib>
#include <cstring>
#include <fstream>
#include <iostream>
#include <map>
#include <optional>
#include <sstream>
#include <string>
#include <string_view>
#include <utility>
#include <vector>

namespace {

struct Options {
  std::string url;                 // libpq conninfo or postgres:// URL
  bool ssl_required = false;       // maps to sslmode=require
  bool ping = false;
  bool list_components = false;
  std::optional<std::string> search_q;
  std::optional<std::string> search_framework;
  int search_limit = 10;
  std::optional<std::pair<std::string, std::string>> component; // (framework, component)
  bool show_files = false;
  bool show_content = false;
  size_t max_bytes = 1200;         // when --content, truncate output per file
  std::optional<std::string> env_file; // optional .env-style file to load before reading env vars
};

[[noreturn]] void die(const std::string& msg, int code = 1) {
  std::cerr << "Error: " << msg << "\n";
  std::exit(code);
}

bool is_truthy(std::string_view s) {
  auto lower = [](unsigned char c) { return static_cast<unsigned char>(std::tolower(c)); };
  std::string v;
  v.reserve(s.size());
  for (unsigned char c : std::string(s)) v.push_back(static_cast<char>(lower(c)));
  return v == "1" || v == "true" || v == "yes" || v == "on";
}

std::string trim(std::string s) {
  const auto is_space = [](unsigned char c) { return std::isspace(c) != 0; };
  while (!s.empty() && is_space(static_cast<unsigned char>(s.front()))) s.erase(s.begin());
  while (!s.empty() && is_space(static_cast<unsigned char>(s.back()))) s.pop_back();
  return s;
}

// Minimal .env loader (key=value per line, ignores comments), modeled after `server/src/config/load-env.js`.
void load_env_file(const std::string& path) {
  std::ifstream in(path);
  if (!in.is_open()) die("Unable to open env file: " + path);

  std::string line;
  while (std::getline(in, line)) {
    line = trim(line);
    if (line.empty() || line[0] == '#') continue;

    const auto eq = line.find('=');
    if (eq == std::string::npos || eq == 0) continue;

    std::string key = trim(line.substr(0, eq));
    std::string val = trim(line.substr(eq + 1));
    if (key.empty()) continue;

    if (!val.empty() && ((val.front() == '"' && val.back() == '"') || (val.front() == '\'' && val.back() == '\''))) {
      val = val.substr(1, val.size() - 2);
    }

    // Do not override existing environment variables.
    if (std::getenv(key.c_str()) != nullptr) continue;

    // setenv is POSIX. This example targets macOS/Linux like the socket demo.
    ::setenv(key.c_str(), val.c_str(), 0);
  }
}

std::string getenv_str(const char* key) {
  const char* v = std::getenv(key);
  return v ? std::string(v) : std::string();
}

std::string build_conninfo(const Options& opt) {
  // libpq accepts either a URL or "conninfo" string. We'll pass the URL and append sslmode if requested.
  // If the user already passed a conninfo string with sslmode, libpq should handle it.
  if (!opt.ssl_required) return opt.url;
  if (opt.url.find("sslmode=") != std::string::npos) return opt.url;

  // If it's a URL, appending "?sslmode=require" could conflict with existing query params.
  // libpq also supports "postgresql://...?...". We'll do a best-effort append for URLs, otherwise append as conninfo.
  const bool looks_like_url = opt.url.rfind("postgres://", 0) == 0 || opt.url.rfind("postgresql://", 0) == 0;
  if (looks_like_url) {
    const char join = (opt.url.find('?') == std::string::npos) ? '?' : '&';
    return opt.url + join + "sslmode=require";
  }

  return opt.url + " sslmode=require";
}

class PgResult {
 public:
  explicit PgResult(PGresult* r) : r_(r) {}
  PgResult(const PgResult&) = delete;
  PgResult& operator=(const PgResult&) = delete;
  PgResult(PgResult&& other) noexcept : r_(other.r_) { other.r_ = nullptr; }
  PgResult& operator=(PgResult&& other) noexcept {
    if (this == &other) return *this;
    clear();
    r_ = other.r_;
    other.r_ = nullptr;
    return *this;
  }
  ~PgResult() { clear(); }

  PGresult* get() const { return r_; }

  ExecStatusType status() const { return r_ ? PQresultStatus(r_) : PGRES_FATAL_ERROR; }
  std::string status_text() const { return r_ ? std::string(PQresStatus(PQresultStatus(r_))) : "null-result"; }
  std::string error_message() const { return r_ ? std::string(PQresultErrorMessage(r_)) : "No result."; }

  int rows() const { return r_ ? PQntuples(r_) : 0; }
  int cols() const { return r_ ? PQnfields(r_) : 0; }

  std::string col_name(int col) const { return r_ ? std::string(PQfname(r_, col)) : std::string(); }

  // Returns empty string for NULL. Use is_null() if you need to distinguish.
  std::string value(int row, int col) const {
    if (!r_) return {};
    if (PQgetisnull(r_, row, col)) return {};
    const char* v = PQgetvalue(r_, row, col);
    return v ? std::string(v) : std::string();
  }

  bool is_null(int row, int col) const { return r_ ? (PQgetisnull(r_, row, col) != 0) : true; }

 private:
  void clear() {
    if (r_) PQclear(r_);
    r_ = nullptr;
  }

  PGresult* r_ = nullptr;
};

class PgConn {
 public:
  explicit PgConn(const std::string& conninfo) {
    conn_ = PQconnectdb(conninfo.c_str());
    if (!conn_) die("PQconnectdb returned null connection.");
    if (PQstatus(conn_) != CONNECTION_OK) {
      const std::string msg = PQerrorMessage(conn_) ? std::string(PQerrorMessage(conn_)) : "Unknown connection error.";
      PQfinish(conn_);
      conn_ = nullptr;
      die("DB connection failed: " + msg);
    }
  }

  PgConn(const PgConn&) = delete;
  PgConn& operator=(const PgConn&) = delete;

  PgConn(PgConn&& other) noexcept : conn_(other.conn_) { other.conn_ = nullptr; }
  PgConn& operator=(PgConn&& other) noexcept {
    if (this == &other) return *this;
    close();
    conn_ = other.conn_;
    other.conn_ = nullptr;
    return *this;
  }

  ~PgConn() { close(); }

  PgResult exec(const std::string& sql) {
    PGresult* r = PQexec(conn_, sql.c_str());
    return PgResult(r);
  }

  PgResult exec_params(const std::string& sql, const std::vector<std::string>& params) {
    std::vector<const char*> values;
    values.reserve(params.size());
    for (const auto& p : params) values.push_back(p.c_str());

    PGresult* r = PQexecParams(
      conn_,
      sql.c_str(),
      static_cast<int>(params.size()),
      nullptr,                // let server infer types
      values.data(),
      nullptr,                // param lengths (text)
      nullptr,                // param formats (text)
      0                       // result format (text)
    );
    return PgResult(r);
  }

  std::string server_version() const {
    const int v = PQserverVersion(conn_);
    if (v <= 0) return "unknown";
    // e.g. 150003 -> 15.3
    const int major = v / 10000;
    const int minor = (v / 100) % 100;
    return std::to_string(major) + "." + std::to_string(minor);
  }

 private:
  void close() {
    if (conn_) PQfinish(conn_);
    conn_ = nullptr;
  }

  PGconn* conn_ = nullptr;
};

void expect_ok(const PgResult& r, const std::string& context) {
  const auto st = r.status();
  if (st == PGRES_COMMAND_OK || st == PGRES_TUPLES_OK) return;
  die(context + " failed (" + r.status_text() + "): " + r.error_message());
}

void print_table(const PgResult& r) {
  const int rows = r.rows();
  const int cols = r.cols();

  // Compute simple column widths.
  std::vector<size_t> widths(static_cast<size_t>(cols), 0);
  for (int c = 0; c < cols; c++) widths[static_cast<size_t>(c)] = r.col_name(c).size();
  for (int i = 0; i < rows; i++) {
    for (int c = 0; c < cols; c++) {
      const std::string v = r.value(i, c);
      widths[static_cast<size_t>(c)] = std::max(widths[static_cast<size_t>(c)], v.size());
    }
  }

  auto print_row = [&](const std::vector<std::string>& cells) {
    for (int c = 0; c < cols; c++) {
      const auto& cell = cells[static_cast<size_t>(c)];
      std::cout << cell;
      if (c + 1 < cols) {
        const size_t pad = widths[static_cast<size_t>(c)] > cell.size() ? (widths[static_cast<size_t>(c)] - cell.size()) : 0;
        std::cout << std::string(pad + 2, ' ');
      }
    }
    std::cout << "\n";
  };

  // Header
  {
    std::vector<std::string> header;
    header.reserve(static_cast<size_t>(cols));
    for (int c = 0; c < cols; c++) header.push_back(r.col_name(c));
    print_row(header);
    // separator
    std::vector<std::string> sep;
    sep.reserve(static_cast<size_t>(cols));
    for (int c = 0; c < cols; c++) sep.push_back(std::string(widths[static_cast<size_t>(c)], '-'));
    print_row(sep);
  }

  // Rows
  for (int i = 0; i < rows; i++) {
    std::vector<std::string> cells;
    cells.reserve(static_cast<size_t>(cols));
    for (int c = 0; c < cols; c++) {
      if (r.is_null(i, c)) cells.emplace_back("NULL");
      else cells.push_back(r.value(i, c));
    }
    print_row(cells);
  }
}

void usage() {
  std::cout
    << "Usage:\n"
    << "  ./db-test [--env server/.env] [--url <DATABASE_URL>] [--ssl]\n"
    << "           [--ping]\n"
    << "           [--list-components]\n"
    << "           [--search <q> [--framework <fw>] [--limit <n>]]\n"
    << "           [--component <framework> <component> [--files] [--content] [--max-bytes <n>]]\n"
    << "\n"
    << "Notes:\n"
    << "  - If --url is not provided, DATABASE_URL is read from the environment.\n"
    << "  - If DATABASE_SSL=true in the environment, sslmode=require is used.\n"
    << "\n";
}

Options parse_args(int argc, char** argv) {
  Options opt;
  for (int i = 1; i < argc; i++) {
    const std::string a = argv[i] ? std::string(argv[i]) : "";

    auto require_value = [&](const char* flag) -> std::string {
      if (i + 1 >= argc) die(std::string("Missing value for ") + flag);
      return std::string(argv[++i]);
    };

    if (a == "--help" || a == "-h") {
      usage();
      std::exit(0);
    } else if (a == "--env") {
      opt.env_file = require_value("--env");
    } else if (a == "--url") {
      opt.url = require_value("--url");
    } else if (a == "--ssl") {
      opt.ssl_required = true;
    } else if (a == "--ping") {
      opt.ping = true;
    } else if (a == "--list-components") {
      opt.list_components = true;
    } else if (a == "--search") {
      opt.search_q = require_value("--search");
    } else if (a == "--framework") {
      opt.search_framework = require_value("--framework");
    } else if (a == "--limit") {
      opt.search_limit = std::stoi(require_value("--limit"));
      if (opt.search_limit < 1) opt.search_limit = 1;
      if (opt.search_limit > 50) opt.search_limit = 50;
    } else if (a == "--component") {
      const std::string fw = require_value("--component");
      const std::string name = require_value("--component");
      opt.component = std::make_pair(fw, name);
    } else if (a == "--files") {
      opt.show_files = true;
    } else if (a == "--content") {
      opt.show_content = true;
    } else if (a == "--max-bytes") {
      const int v = std::stoi(require_value("--max-bytes"));
      opt.max_bytes = v > 0 ? static_cast<size_t>(v) : opt.max_bytes;
    } else {
      die("Unknown argument: " + a);
    }
  }

  // Default behavior if no action flags were passed.
  if (!opt.ping && !opt.list_components && !opt.search_q && !opt.component) {
    opt.ping = true;
    opt.list_components = true;
  }

  return opt;
}

std::string truncate_bytes(const std::string& s, size_t max_bytes) {
  if (s.size() <= max_bytes) return s;
  std::ostringstream out;
  out << s.substr(0, max_bytes) << "\n... (truncated, " << s.size() << " bytes total)";
  return out.str();
}

void do_ping(PgConn& db) {
  auto r = db.exec("SELECT 1 AS ok");
  expect_ok(r, "ping");
  std::cout << "DB ok. Server version: " << db.server_version() << "\n";
}

void do_list_components(PgConn& db) {
  auto r = db.exec(
    "SELECT framework, component, version, author_name AS author, component_number AS number\n"
    "FROM components\n"
    "ORDER BY framework, component"
  );
  expect_ok(r, "list-components");
  print_table(r);
}

void do_search(PgConn& db, const Options& opt) {
  if (!opt.search_q) return;

  // Mirrors the service behavior in `server/src/services/components.service.js` (ILIKE search).
  std::string sql =
    "SELECT\n"
    "  c.framework,\n"
    "  c.component,\n"
    "  c.version,\n"
    "  c.author_name AS author,\n"
    "  c.component_number AS number,\n"
    "  COUNT(f.id)::INT AS file_count,\n"
    "  COALESCE(\n"
    "    SUM(\n"
    "      CASE\n"
    "        WHEN f.content IS NULL OR f.content = '' THEN 0\n"
    "        ELSE LENGTH(f.content) - LENGTH(REPLACE(f.content, E'\\n', '')) + 1\n"
    "      END\n"
    "    ),\n"
    "    0\n"
    "  )::BIGINT AS total_lines\n"
    "FROM components c\n"
    "LEFT JOIN component_files f ON f.component_id = c.id\n"
    "WHERE c.component ILIKE $1\n";

  std::vector<std::string> params;
  params.push_back("%" + *opt.search_q + "%");

  if (opt.search_framework && !opt.search_framework->empty()) {
    sql += "  AND c.framework = $2\n";
    params.push_back(*opt.search_framework);
    sql += "GROUP BY c.id\n"
           "ORDER BY c.framework, c.component\n"
           "LIMIT $3";
    params.push_back(std::to_string(opt.search_limit));
  } else {
    sql += "GROUP BY c.id\n"
           "ORDER BY c.framework, c.component\n"
           "LIMIT $2";
    params.push_back(std::to_string(opt.search_limit));
  }

  auto r = db.exec_params(sql, params);
  expect_ok(r, "search");
  print_table(r);
}

void do_component_files(PgConn& db, const Options& opt) {
  if (!opt.component) return;
  const auto& [fw, name] = *opt.component;

  auto r = db.exec_params(
    "SELECT f.filename\n"
    "FROM components c\n"
    "JOIN component_files f ON f.component_id = c.id\n"
    "WHERE c.framework = $1 AND c.component = $2\n"
    "ORDER BY f.filename",
    { fw, name }
  );

  expect_ok(r, "component-files");
  if (r.rows() == 0) {
    std::cout << "No rows found for " << fw << "/" << name << " (component missing, or no files).\n";
    return;
  }

  print_table(r);
}

void do_component_content(PgConn& db, const Options& opt) {
  if (!opt.component) return;
  const auto& [fw, name] = *opt.component;

  auto r = db.exec_params(
    "SELECT f.filename, f.content\n"
    "FROM components c\n"
    "JOIN component_files f ON f.component_id = c.id\n"
    "WHERE c.framework = $1 AND c.component = $2\n"
    "ORDER BY f.filename",
    { fw, name }
  );

  expect_ok(r, "component-content");
  if (r.rows() == 0) {
    std::cout << "No rows found for " << fw << "/" << name << " (component missing, or no files).\n";
    return;
  }

  // Custom output: show filename + a truncated content preview.
  for (int i = 0; i < r.rows(); i++) {
    const std::string filename = r.value(i, 0);
    const std::string content = r.value(i, 1);

    std::cout << "== " << filename << " ==\n";
    std::cout << truncate_bytes(content, opt.max_bytes) << "\n\n";
  }
}

}  // namespace

int main(int argc, char** argv) {
  Options opt = parse_args(argc, argv);

  if (opt.env_file) load_env_file(*opt.env_file);

  if (opt.url.empty()) opt.url = getenv_str("DATABASE_URL");
  if (opt.url.empty()) {
    usage();
    die("DATABASE_URL is required (set env var or pass --url).");
  }

  // Mirror the Node server's `DATABASE_SSL` behavior (`server/src/db/client.js`) unless user forced --ssl.
  if (!opt.ssl_required) {
    const std::string ssl = getenv_str("DATABASE_SSL");
    if (!ssl.empty() && is_truthy(ssl)) opt.ssl_required = true;
  }

  const std::string conninfo = build_conninfo(opt);

  try {
    PgConn db(conninfo);

    if (opt.ping) do_ping(db);
    if (opt.list_components) do_list_components(db);
    if (opt.search_q) do_search(db, opt);

    if (opt.component) {
      // If the user asked for component-specific actions, default to showing files.
      const bool wants_any = opt.show_files || opt.show_content;
      const bool show_files = wants_any ? opt.show_files : true;

      if (show_files) do_component_files(db, opt);
      if (opt.show_content) do_component_content(db, opt);
    }
  } catch (const std::exception& e) {
    die(std::string("Unhandled exception: ") + e.what());
  }

  return 0;
}
