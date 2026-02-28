// test-file.cpp
//
// Minimal dependency-free HTTP server example (POSIX/BSD sockets).
// Listens on http://127.0.0.1:8080 and responds to:
//   - GET /health  -> 200 {"ok":true}
//   - anything else -> 404 {"ok":false,"error":"Not found"}
//
// Build (macOS/Linux):
//   c++ -std=c++20 -O2 -Wall -Wextra -pedantic test-file.cpp -o test-file
// Run:
//   ./test-file
//
// This is a teaching example, not production-ready (no TLS, no robust parsing, no concurrency).

#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

#include <cerrno>
#include <cstring>
#include <iostream>
#include <string>

namespace {

constexpr int kPort = 8080;
constexpr int kBacklog = 64;

bool starts_with(const std::string& s, const char* prefix) {
  const size_t n = std::strlen(prefix);
  return s.size() >= n && s.compare(0, n, prefix) == 0;
}

std::string http_response(int status, const std::string& status_text, const std::string& body_json) {
  std::string out;
  out += "HTTP/1.1 " + std::to_string(status) + " " + status_text + "\r\n";
  out += "Content-Type: application/json; charset=utf-8\r\n";
  out += "Content-Length: " + std::to_string(body_json.size()) + "\r\n";
  out += "Connection: close\r\n";
  out += "\r\n";
  out += body_json;
  return out;
}

int create_listen_socket() {
  const int fd = ::socket(AF_INET, SOCK_STREAM, 0);
  if (fd < 0) {
    std::cerr << "socket() failed: " << std::strerror(errno) << "\n";
    return -1;
  }

  int yes = 1;
  (void)::setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));

  sockaddr_in addr{};
  addr.sin_family = AF_INET;
  addr.sin_port = htons(static_cast<uint16_t>(kPort));
  addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);  // 127.0.0.1

  if (::bind(fd, reinterpret_cast<sockaddr*>(&addr), sizeof(addr)) < 0) {
    std::cerr << "bind() failed: " << std::strerror(errno) << "\n";
    ::close(fd);
    return -1;
  }

  if (::listen(fd, kBacklog) < 0) {
    std::cerr << "listen() failed: " << std::strerror(errno) << "\n";
    ::close(fd);
    return -1;
  }

  return fd;
}

std::string read_request_head(int client_fd) {
  std::string buf;
  buf.reserve(4096);

  char tmp[1024];
  while (buf.find("\r\n\r\n") == std::string::npos) {
    const ssize_t n = ::recv(client_fd, tmp, sizeof(tmp), 0);
    if (n == 0) break;          // client closed
    if (n < 0) return std::string();
    buf.append(tmp, static_cast<size_t>(n));
    if (buf.size() > 64 * 1024) break;  // hard cap for this example
  }
  return buf;
}

void handle_client(int client_fd) {
  const std::string head = read_request_head(client_fd);
  if (head.empty()) return;

  // Extremely small parser: only looks at request line.
  const size_t line_end = head.find("\r\n");
  const std::string request_line = (line_end == std::string::npos) ? head : head.substr(0, line_end);

  std::string response;
  if (starts_with(request_line, "GET /health ")) {
    response = http_response(200, "OK", R"({"ok":true})");
  } else {
    response = http_response(404, "Not Found", R"({"ok":false,"error":"Not found"})");
  }

  const char* p = response.data();
  size_t left = response.size();
  while (left > 0) {
    const ssize_t n = ::send(client_fd, p, left, 0);
    if (n <= 0) break;
    p += static_cast<size_t>(n);
    left -= static_cast<size_t>(n);
  }
}

}  // namespace

int main() {
  const int server_fd = create_listen_socket();
  if (server_fd < 0) return 1;

  std::cout << "Listening on http://127.0.0.1:" << kPort << "\n";
  std::cout << "Try: curl http://127.0.0.1:" << kPort << "/health\n";

  while (true) {
    sockaddr_in client_addr{};
    socklen_t client_len = sizeof(client_addr);
    const int client_fd =
      ::accept(server_fd, reinterpret_cast<sockaddr*>(&client_addr), &client_len);
    if (client_fd < 0) {
      std::cerr << "accept() failed: " << std::strerror(errno) << "\n";
      continue;
    }

    handle_client(client_fd);
    ::close(client_fd);
  }

  ::close(server_fd);
  return 0;
}

