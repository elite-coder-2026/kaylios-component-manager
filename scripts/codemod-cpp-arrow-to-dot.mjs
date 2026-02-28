#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
    dryRun: false,
    exts: [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"],
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root") args.root = argv[++i];
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--ext") args.exts.push(normalizeExt(argv[++i]));
    else if (a === "--help" || a === "-h") {
      console.log(
        "Usage: node scripts/codemod-cpp-arrow-to-dot.mjs [--root DIR] [--dry-run] [--ext EXT]\n" +
          "Rewrites C/C++-style '->' into '.' in code (skips strings and comments)."
      );
      process.exit(0);
    }
  }
  args.exts = [...new Set(args.exts.map((e) => normalizeExt(e)))];
  return args;
}

function normalizeExt(ext) {
  if (!ext) return ext;
  return ext.startsWith(".") ? ext : `.${ext}`;
}

function isBinaryPath(filePath) {
  const lower = filePath.toLowerCase();
  return (
    lower.includes(`${path.sep}.git${path.sep}`) ||
    lower.includes(`${path.sep}node_modules${path.sep}`) ||
    lower.includes(`${path.sep}dist${path.sep}`) ||
    lower.includes(`${path.sep}build${path.sep}`) ||
    lower.includes(`${path.sep}coverage${path.sep}`)
  );
}

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (isBinaryPath(full)) continue;
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

function rewriteCppArrowToDot(source) {
  let out = "";
  let i = 0;

  const stack = [];
  let state = "code"; // code | line_comment | block_comment | sq | dq | template | template_expr
  let templateExprBraceDepth = 0;

  const pushState = () => stack.push({ state, templateExprBraceDepth });
  const popState = () => {
    const prev = stack.pop();
    state = prev?.state ?? "code";
    templateExprBraceDepth = prev?.templateExprBraceDepth ?? 0;
  };

  const isIdentChar = (c) => /[A-Za-z0-9_$]/.test(c);
  const isExprEndChar = (c) => isIdentChar(c) || c === ")" || c === "]" || c === "}";
  const isMemberStartChar = (c) => /[A-Za-z_$]/.test(c);
  const prevNonWsChar = (idx) => {
    for (let j = idx; j >= 0; j--) {
      const c = source[j];
      if (!/\s/.test(c)) return c;
    }
    return "";
  };
  const nextNonWsChar = (idx) => {
    for (let j = idx; j < source.length; j++) {
      const c = source[j];
      if (!/\s/.test(c)) return c;
    }
    return "";
  };

  while (i < source.length) {
    const ch = source[i];
    const next = i + 1 < source.length ? source[i + 1] : "";

    if (state === "code" || state === "template_expr") {
      if (ch === "/" && next === "/") {
        out += ch + next;
        i += 2;
        pushState();
        state = "line_comment";
        continue;
      }
      if (ch === "/" && next === "*") {
        out += ch + next;
        i += 2;
        pushState();
        state = "block_comment";
        continue;
      }
      if (ch === "'") {
        out += ch;
        i += 1;
        pushState();
        state = "sq";
        continue;
      }
      if (ch === '"') {
        out += ch;
        i += 1;
        pushState();
        state = "dq";
        continue;
      }
      if (ch === "`") {
        out += ch;
        i += 1;
        pushState();
        state = "template";
        continue;
      }

      if (state === "template_expr") {
        if (ch === "{") templateExprBraceDepth += 1;
        else if (ch === "}") {
          templateExprBraceDepth -= 1;
          if (templateExprBraceDepth === 0) {
            out += ch;
            i += 1;
            popState();
            continue;
          }
        }
      }

      if (
        ch === "-" &&
        next === ">" &&
        isExprEndChar(prevNonWsChar(i - 1)) &&
        isMemberStartChar(nextNonWsChar(i + 2))
      ) {
        out += ".";
        i += 2;
        continue;
      }

      out += ch;
      i += 1;
      continue;
    }

    if (state === "line_comment") {
      out += ch;
      i += 1;
      if (ch === "\n") popState();
      continue;
    }

    if (state === "block_comment") {
      out += ch;
      i += 1;
      if (ch === "*" && next === "/") {
        out += next;
        i += 1;
        popState();
      }
      continue;
    }

    if (state === "sq") {
      out += ch;
      i += 1;
      if (ch === "\\" && i < source.length) {
        out += source[i];
        i += 1;
        continue;
      }
      if (ch === "'") popState();
      continue;
    }

    if (state === "dq") {
      out += ch;
      i += 1;
      if (ch === "\\" && i < source.length) {
        out += source[i];
        i += 1;
        continue;
      }
      if (ch === '"') popState();
      continue;
    }

    if (state === "template") {
      if (ch === "$" && next === "{") {
        out += ch + next;
        i += 2;
        pushState();
        state = "template_expr";
        templateExprBraceDepth = 1;
        continue;
      }
      out += ch;
      i += 1;
      if (ch === "\\" && i < source.length) {
        out += source[i];
        i += 1;
        continue;
      }
      if (ch === "`") popState();
      continue;
    }
  }

  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.resolve(args.root);

  let changedFiles = 0;
  for (const filePath of walk(root)) {
    if (!args.exts.includes(path.extname(filePath))) continue;
    let src;
    try {
      src = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }

    const out = rewriteCppArrowToDot(src);
    if (out !== src) {
      changedFiles += 1;
      console.log(`${args.dryRun ? "Would change" : "Changed"}: ${filePath}`);
      if (!args.dryRun) fs.writeFileSync(filePath, out, "utf8");
    }
  }

  if (args.dryRun) {
    console.log(`Files that would change: ${changedFiles}`);
  } else {
    console.log(`Files changed: ${changedFiles}`);
  }
}

main();
