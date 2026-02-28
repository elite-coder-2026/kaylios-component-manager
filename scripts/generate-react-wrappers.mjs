#!/usr/bin/env node
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { Command } from "commander";

function toKebabCase(input) {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function toPascalCase(kebabStr) {
  return kebabStr
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function escapeJsBlockComment(input) {
  return input.replaceAll("*/", "* /");
}

function escapeTemplateLiteral(input) {
  return input.replaceAll("\\", "\\\\").replaceAll("`", "\\`").replaceAll("${", "\\${");
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
  const trimmed = prop.trim().toLowerCase();
  if (!trimmed) return "";
  if (trimmed.startsWith("--")) return trimmed;
  return trimmed.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function cssTextToJsStyleObject(cssText) {
  const parts = cssText
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
  let out = html;

  out = out.replace(/<!doctype[\s\S]*?>/gi, "");

  out = out.replace(/<!--([\s\S]*?)-->/g, (_, inner) => `{/* ${escapeJsBlockComment(inner.trim())} */}`);

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
      const tagName = tagNameRaw.toLowerCase();
      if (!VOID_TAGS.has(tagName)) return match;
      if (match.endsWith("/>")) return match;
      if (attrs.includes("</")) return match;
      return `<${tagNameRaw}${attrs} />`;
    }
  );

  return out.trim();
}

async function listVanillaHtmlFiles(vanillaDir) {
  const results = [];
  const entries = await readdir(vanillaDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(vanillaDir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".html")) {
      results.push(fullPath);
      continue;
    }
    if (entry.isDirectory()) {
      const inner = await readdir(fullPath, { withFileTypes: true });
      for (const innerEntry of inner) {
        if (!innerEntry.isFile()) continue;
        if (!innerEntry.name.endsWith(".html")) continue;
        results.push(path.join(fullPath, innerEntry.name));
      }
    }
  }

  return results.sort();
}

async function fileExists(filePath) {
  try {
    const s = await stat(filePath);
    return s.isFile();
  } catch {
    return false;
  }
}

function resolveSiblingFile(htmlFilePath, ext) {
  const dir = path.dirname(htmlFilePath);
  const base = path.basename(htmlFilePath, ".html");
  return path.join(dir, `${base}.${ext}`);
}

function componentNameFromHtmlPath(vanillaDir, htmlFilePath) {
  const relative = path.relative(vanillaDir, htmlFilePath);
  const base = path.basename(relative, ".html");
  return toKebabCase(base);
}

function reactOutputDir(outDir, componentName) {
  return path.join(outDir, componentName);
}

function renderReactWrapper({ componentName, componentClass, jsxMarkup, useDangerousHtml, htmlString }) {
  const header = `// GENERATED FILE — source of truth is components/vanilla/${componentName}.*\n`;

  if (useDangerousHtml) {
    return (
      header +
      `import React from "react";\n` +
      `import "./styles.scss";\n\n` +
      `const __html = \`${escapeTemplateLiteral(htmlString)}\`;\n\n` +
      `export default function ${componentClass}(props) {\n` +
      `  return <div {...props} dangerouslySetInnerHTML={{ __html }} />;\n` +
      `}\n`
    );
  }

  return (
    header +
    `import React from "react";\n` +
    `import "./styles.scss";\n\n` +
    `export default function ${componentClass}() {\n` +
    `  return (\n` +
    `    <>\n` +
    indentLines(jsxMarkup, 6) +
    `\n` +
    `    </>\n` +
    `  );\n` +
    `}\n`
  );
}

function indentLines(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}

async function generateOne({ vanillaDir, htmlFilePath, outDir, force }) {
  const componentName = componentNameFromHtmlPath(vanillaDir, htmlFilePath);
  const componentClass = toPascalCase(componentName);

  const scssPath = resolveSiblingFile(htmlFilePath, "scss");
  const scssExists = await fileExists(scssPath);
  const scssContent = scssExists ? await readFile(scssPath, "utf8") : "";

  const htmlContent = await readFile(htmlFilePath, "utf8");

  const shouldFallback =
    htmlContent.includes("{") ||
    htmlContent.includes("}") ||
    /<script[\s>]/i.test(htmlContent) ||
    /<style[\s>]/i.test(htmlContent);

  const jsxMarkup = shouldFallback ? "" : convertHtmlToJsx(htmlContent);
  const wrapper = renderReactWrapper({
    componentName,
    componentClass,
    jsxMarkup,
    useDangerousHtml: shouldFallback,
    htmlString: htmlContent
  });

  const componentOutDir = reactOutputDir(outDir, componentName);
  await mkdir(componentOutDir, { recursive: true });

  const wrapperPath = path.join(componentOutDir, "index.jsx");
  const stylesPath = path.join(componentOutDir, "styles.scss");

  if (!force) {
    const existingWrapper = await fileExists(wrapperPath);
    const existingStyles = await fileExists(stylesPath);
    if (existingWrapper || existingStyles) {
      throw new Error(
        `Output already exists for '${componentName}'. Use --force to overwrite: ${componentOutDir}`
      );
    }
  }

  await writeFile(wrapperPath, wrapper, "utf8");
  await writeFile(stylesPath, scssContent, "utf8");

  return { componentName, componentClass, wrapperPath, stylesPath, usedFallback: shouldFallback };
}

async function main() {
  const program = new Command();

  program
    .name("generate-react-wrappers")
    .description("Generate React wrappers from components/vanilla HTML + SCSS.")
    .option("-n, --name <component>", "Generate only a single component (kebab-case or any name)")
    .option("--vanilla-dir <dir>", "Input vanilla components dir", "components/vanilla")
    .option("--out-dir <dir>", "Output dir for generated React wrappers", "generated/react")
    .option("--force", "Overwrite existing generated output", false);

  program.parse(process.argv);
  const opts = program.opts();

  const vanillaDir = path.resolve(process.cwd(), opts.vanillaDir);
  const outDir = path.resolve(process.cwd(), opts.outDir);
  const filterName = opts.name ? toKebabCase(opts.name) : null;

  const htmlFiles = await listVanillaHtmlFiles(vanillaDir);
  const filtered = filterName
    ? htmlFiles.filter((p) => componentNameFromHtmlPath(vanillaDir, p) === filterName)
    : htmlFiles;

  if (filterName && filtered.length === 0) {
    throw new Error(`No vanilla HTML found for component '${filterName}' under ${vanillaDir}`);
  }

  const results = [];
  for (const htmlFilePath of filtered) {
    const r = await generateOne({ vanillaDir, htmlFilePath, outDir, force: Boolean(opts.force) });
    results.push(r);
  }

  for (const r of results) {
    const fallbackNote = r.usedFallback ? " (fallback: dangerouslySetInnerHTML)" : "";
    console.log(`Generated ${r.componentClass}${fallbackNote}:`);
    console.log(`  ${r.wrapperPath}`);
    console.log(`  ${r.stylesPath}`);
  }
}

main().catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
