#!/usr/bin/env node
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { Command } from "commander";

const FRAMEWORKS = ["react", "vue", "vanilla"];

function toKebabCase(input) {
  return String(input || "")
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function toPascalCase(kebabStr) {
  return String(kebabStr || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function escapeJsBlockComment(input) {
  return String(input || "").replaceAll("*/", "* /");
}

function escapeTemplateLiteral(input) {
  return String(input || "").replaceAll("\\", "\\\\").replaceAll("`", "\\`").replaceAll("${", "\\${");
}

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);

function cssPropToJs(prop) {
  const trimmed = String(prop || "").trim().toLowerCase();
  if (!trimmed) return "";
  if (trimmed.startsWith("--")) return trimmed;
  return trimmed.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function cssTextToJsStyleObject(cssText) {
  const parts = String(cssText || "")
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  const entries = [];
  for (const part of parts) {
    const colonIndex = part.indexOf(":");
    if (colonIndex === -1) continue;
    const rawKey = part.slice(0, colonIndex).trim();
    const rawValue = part.slice(colonIndex + 1).trim();
    if (!rawKey || !rawValue) continue;

    const jsKey = cssPropToJs(rawKey);
    if (!jsKey) continue;

    if (jsKey.startsWith("--")) {
      entries.push(`"${jsKey}": "${rawValue.replaceAll("\"", "\\\"")}"`);
    } else {
      entries.push(`${jsKey}: "${rawValue.replaceAll("\"", "\\\"")}"`);
    }
  }

  return entries.length ? `{ ${entries.join(", ")} }` : "{}";
}

function convertHtmlToJsx(html) {
  let out = String(html || "");

  out = out.replace(/<!doctype[\s\S]*?>/gi, "");
  out = out.replace(/<!--([\s\S]*?)-->/g, (_, inner) => `{/* ${escapeJsBlockComment(String(inner).trim())} */}`);

  out = out.replace(/\bclass=/g, "className=");
  out = out.replace(/\bfor=/g, "htmlFor=");
  out = out.replace(/\btabindex=/g, "tabIndex=");
  out = out.replace(/\bautocomplete=/g, "autoComplete=");
  out = out.replace(/\bmaxlength=/g, "maxLength=");
  out = out.replace(/\bminlength=/g, "minLength=");
  out = out.replace(/\breadonly=/g, "readOnly=");
  out = out.replace(/\bcolspan=/g, "colSpan=");
  out = out.replace(/\browspan=/g, "rowSpan=");

  out = out.replace(/\sstyle="([^"]*)"/g, (_, cssText) => {
    const jsObj = cssTextToJsStyleObject(cssText);
    return ` style={{${jsObj.slice(1, -1)}}}`;
  });
  out = out.replace(/\sstyle='([^']*)'/g, (_, cssText) => {
    const jsObj = cssTextToJsStyleObject(cssText);
    return ` style={{${jsObj.slice(1, -1)}}}`;
  });

  out = out.replace(
    /<([a-zA-Z][a-zA-Z0-9:-]*)([^>]*?)>/g,
    (match, tagNameRaw, attrs) => {
      const tagName = String(tagNameRaw || "").toLowerCase();
      if (!VOID_TAGS.has(tagName)) return match;
      if (match.endsWith("/>")) return match;
      if (attrs.includes("</")) return match;
      return `<${tagNameRaw}${attrs} />`;
    }
  );

  return out.trim();
}

async function fileExists(filePath) {
  try {
    const s = await stat(filePath);
    return s.isFile();
  } catch {
    return false;
  }
}

async function resolveVanillaSource(vanillaDir, componentName) {
  const nested = path.join(vanillaDir, componentName, `${componentName}.html`);
  const legacy = path.join(vanillaDir, `${componentName}.html`);
  const htmlPath = (await fileExists(nested)) ? nested : legacy;

  if (!(await fileExists(htmlPath))) {
    throw new Error(`Missing vanilla HTML. Expected ${nested} or ${legacy}`);
  }

  const nestedScss = path.join(vanillaDir, componentName, `${componentName}.scss`);
  const legacyScss = path.join(vanillaDir, `${componentName}.scss`);
  const scssPath = (await fileExists(nestedScss)) ? nestedScss : legacyScss;

  const html = await readFile(htmlPath, "utf8");
  const scss = (await fileExists(scssPath)) ? await readFile(scssPath, "utf8") : "";

  return { html, scss };
}

function indentLines(text, spaces) {
  const pad = " ".repeat(spaces);
  return String(text || "")
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}

function renderReact({ componentName, html, scss }) {
  const componentClass = toPascalCase(componentName);

  const shouldFallback =
    html.includes("{") ||
    html.includes("}") ||
    /<script[\s>]/i.test(html) ||
    /<style[\s>]/i.test(html);

  if (shouldFallback) {
    return {
      "index.jsx":
        `// GENERATED FILE — source of truth is components/vanilla/${componentName}.*\n` +
        `import React from "react";\n` +
        `import "./styles.scss";\n\n` +
        `const __html = \`${escapeTemplateLiteral(html)}\`;\n\n` +
        `export default function ${componentClass}(props) {\n` +
        `  return <div {...props} dangerouslySetInnerHTML={{ __html }} />;\n` +
        `}\n`,
      "styles.scss": scss
    };
  }

  const jsx = convertHtmlToJsx(html);
  return {
    "index.jsx":
      `// GENERATED FILE — source of truth is components/vanilla/${componentName}.*\n` +
      `import React from "react";\n` +
      `import "./styles.scss";\n\n` +
      `export default function ${componentClass}() {\n` +
      `  return (\n` +
      `    <>\n` +
      indentLines(jsx, 6) +
      `\n` +
      `    </>\n` +
      `  );\n` +
      `}\n`,
    "styles.scss": scss
  };
}

function renderVue({ componentName, html, scss }) {
  return {
    "index.vue":
      `<!-- GENERATED FILE — source of truth is components/vanilla/${componentName}.* -->\n` +
      `<template>\n` +
      indentLines(html.trim(), 2) +
      `\n</template>\n\n` +
      `<style src="./styles.scss" lang="scss" scoped></style>\n`,
    "styles.scss": scss
  };
}

function renderVanilla({ componentName, html, scss }) {
  return {
    "index.html":
      `<!-- GENERATED FILE — source of truth is components/vanilla/${componentName}.* -->\n` +
      html.trim() +
      `\n`,
    "styles.scss": scss
  };
}

async function writeOutputDir(targetDir, filesByName, { force }) {
  await mkdir(targetDir, { recursive: true });

  for (const [name, content] of Object.entries(filesByName)) {
    const outPath = path.join(targetDir, name);
    if (!force && (await fileExists(outPath))) {
      throw new Error(`File already exists: ${outPath} (use --force to overwrite)`);
    }
    await writeFile(outPath, content, "utf8");
  }
}

async function main() {
  const program = new Command();
  program
    .name("export-component")
    .description("Export presentational components from components/vanilla into framework-specific output.")
    .requiredOption("-n, --name <component>", "component name (kebab-case)")
    .requiredOption("-f, --framework <framework>", `one of: ${FRAMEWORKS.join(", ")}`)
    .option("--vanilla-dir <dir>", "Input vanilla dir", "components/vanilla")
    .option("--out-dir <dir>", "Output root dir", "exports")
    .option("--force", "Overwrite existing files", false);

  program.parse(process.argv);
  const opts = program.opts();

  const framework = String(opts.framework || "").trim().toLowerCase();
  if (!FRAMEWORKS.includes(framework)) {
    throw new Error(`Invalid framework '${framework}'. Use: ${FRAMEWORKS.join(", ")}`);
  }

  const componentName = toKebabCase(opts.name);
  if (!componentName) throw new Error("Component name is required.");

  const vanillaDir = path.resolve(process.cwd(), String(opts.vanillaDir || "components/vanilla"));
  const outDir = path.resolve(process.cwd(), String(opts.outDir || "exports"));

  const source = await resolveVanillaSource(vanillaDir, componentName);

  const filesByName =
    framework === "react"
      ? renderReact({ componentName, ...source })
      : framework === "vue"
        ? renderVue({ componentName, ...source })
        : renderVanilla({ componentName, ...source });

  const targetDir = path.join(outDir, framework, componentName);
  await writeOutputDir(targetDir, filesByName, { force: Boolean(opts.force) });

  console.log(`Exported ${componentName} -> ${framework}: ${targetDir}`);
  Object.keys(filesByName)
    .sort()
    .forEach((filename) => console.log(`  ${path.join(targetDir, filename)}`));
}

main().catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

