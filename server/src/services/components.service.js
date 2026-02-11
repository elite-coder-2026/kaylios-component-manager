const fs = require("node:fs/promises");
const path = require("node:path");
const { query, withTransaction } = require("../db/client");

const ROOT = path.resolve(__dirname, "..", "..", "..");
const COMPONENTS_ROOT = path.join(ROOT, "components");
const FRAMEWORKS = ["react", "angular", "vue", "vanilla"];

function toPascalCase(input) {
  return input
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function ensureSafePath(base, target) {
  const normalized = path.normalize(path.join(base, target));
  if (!normalized.startsWith(base)) {
    const error = new Error("Invalid path.");
    error.statusCode = 400;
    throw error;
  }
  return normalized;
}

function toConflictError(message) {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
}

function createTemplates(framework, component, metadata) {
  const version = (metadata.version || "1.0.0").trim();
  const author = (metadata.author || "Unknown").trim() || "Unknown";
  const number = (metadata.number || "N/A").trim() || "N/A";
  const title = component
    .split("-")
    .map((v) => v[0].toUpperCase() + v.slice(1))
    .join(" ");
  const metaHtml = `<!-- ${framework}/${component} | version: ${version} | author: ${author} | number: ${number} -->\n`;
  const metaJs = `// ${framework}/${component} | version: ${version} | author: ${author} | number: ${number}\n`;

  if (framework === "angular") {
    const className = `${toPascalCase(component)}Component`;
    return {
      [`${component}.component.html`]:
`${metaHtml}<section class="${component}">
  <h2>${title}</h2>
  <p>Angular ${title} template.</p>
  <small>v${version} - ${author} - ${number}</small>
</section>
`,
      [`${component}.component.ts`]:
`${metaJs}import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-${component}",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./${component}.component.html",
  styleUrl: "./${component}.component.scss"
})
export class ${className} {}
`,
      [`${component}.component.spec.ts`]:
`${metaJs}import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ${className} } from "./${component}.component";

describe("${className}", () => {
  let component: ${className};
  let fixture: ComponentFixture<${className}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${className}]
    }).compileComponents();

    fixture = TestBed.createComponent(${className});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("creates", () => {
    expect(component).toBeTruthy();
  });
});
`,
      [`${component}.component.scss`]:
`.${component} {
  display: grid;
  gap: 0.5rem;
}
`
    };
  }

  if (framework === "react") {
    const componentName = `${toPascalCase(component)}Component`;
    return {
      [`${component}.jsx`]:
`${metaJs}import React from "react";

export default function ${componentName}() {
  return (
    <section className="${component}">
      <h2>${title}</h2>
      <p>React ${title} scaffold.</p>
      <small>v${version} - ${author} - ${number}</small>
    </section>
  );
}
`,
      [`${component}.scss`]:
`.${component} {
  display: grid;
  gap: 0.5rem;
}
`
    };
  }

  return {
    [`${component}.html`]:
`${metaHtml}<section class="${component}">
  <h2>${title}</h2>
  <p>${framework} ${title} scaffold.</p>
  <small>v${version} - ${author} - ${number}</small>
</section>
`,
    [`${component}.js`]:
`${metaJs}export function ${component.replace(/-/g, "_")}() {
  return "${framework}:${component}";
}
`,
    [`${component}.scss`]:
`.${component} {
  display: grid;
  gap: 0.5rem;
}
`
  };
}

async function createComponent({ framework, component, version, author, number }) {
  const frameworkDir = ensureSafePath(COMPONENTS_ROOT, framework);
  const componentDir = ensureSafePath(frameworkDir, component);
  await fs.mkdir(componentDir, { recursive: true });

  const templates = createTemplates(framework, component, { version, author, number });
  const fileEntries = Object.entries(templates);

  for (const [filename] of fileEntries) {
    const fullPath = ensureSafePath(componentDir, filename);
    try {
      await fs.access(fullPath);
      throw toConflictError(`Component file already exists: ${filename}`);
    } catch (accessError) {
      if (accessError.statusCode) throw accessError;
    }
  }

  const writtenPaths = [];
  try {
    await withTransaction(async (client) => {
      let row;
      try {
        const result = await client.query(
          `INSERT INTO components (framework, component, version, author_name, component_number)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [framework, component, version || "1.0.0", author || "Unknown", number || "N/A"]
        );
        row = result.rows[0];
      } catch (error) {
        if (error && error.code === "23505") {
          throw toConflictError(`Component already exists: ${framework}/${component}`);
        }
        throw error;
      }

      for (const [filename, content] of fileEntries) {
        await client.query(
          `INSERT INTO component_files (component_id, filename, content)
           VALUES ($1, $2, $3)`,
          [row.id, filename, content]
        );

        const fullPath = ensureSafePath(componentDir, filename);
        await fs.writeFile(fullPath, content, "utf8");
        writtenPaths.push(fullPath);
      }
    });
  } catch (error) {
    await Promise.all(writtenPaths.map((filePath) => fs.unlink(filePath).catch(() => null)));
    throw error;
  }

  return {
    framework,
    component,
    files: fileEntries.map(([filename]) => filename)
  };
}

async function listComponents() {
  const out = Object.fromEntries(FRAMEWORKS.map((framework) => [framework, []]));

  const result = await query(
    `SELECT framework, component
     FROM components
     ORDER BY framework, component`
  );

  for (const row of result.rows) {
    if (!out[row.framework]) out[row.framework] = [];
    out[row.framework].push(row.component);
  }

  return out;
}

async function searchComponents({ q, framework, limit }) {
  const params = [`%${q}%`];
  const filters = [`c.component ILIKE $1`];

  if (framework) {
    params.push(framework);
    filters.push(`c.framework = $2`);
  }

  params.push(limit);
  const limitParamIndex = framework ? 3 : 2;

  const result = await query(
    `SELECT
       c.framework,
       c.component,
       c.version,
       c.author_name AS author,
       c.component_number AS number,
       COUNT(f.id)::INT AS file_count,
       COALESCE(
         SUM(
           CASE
             WHEN f.content IS NULL OR f.content = '' THEN 0
             ELSE LENGTH(f.content) - LENGTH(REPLACE(f.content, E'\n', '')) + 1
           END
         ),
         0
       )::BIGINT AS total_lines
     FROM components c
     LEFT JOIN component_files f ON f.component_id = c.id
     WHERE ${filters.join(' AND ')}
     GROUP BY c.id
     ORDER BY c.framework, c.component
     LIMIT $${limitParamIndex}`,
    params
  );

  return {
    query: q,
    framework: framework || null,
    count: result.rows.length,
    results: result.rows.map((row) => ({
      framework: row.framework,
      component: row.component,
      version: row.version,
      author: row.author,
      number: row.number,
      fileCount: Number(row.file_count || 0),
      totalLines: Number(row.total_lines || 0)
    }))
  };
}

async function getComponentFiles(framework, component) {
  const result = await query(
    `SELECT f.filename
     FROM components c
     JOIN component_files f ON f.component_id = c.id
     WHERE c.framework = $1 AND c.component = $2
     ORDER BY f.filename`,
    [framework, component]
  );

  if (!result.rows.length) {
    const error = new Error("Component not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    framework,
    component,
    files: result.rows.map((row) => row.filename)
  };
}

async function getComponentContent(framework, component) {
  const result = await query(
    `SELECT f.filename, f.content
     FROM components c
     JOIN component_files f ON f.component_id = c.id
     WHERE c.framework = $1 AND c.component = $2
     ORDER BY f.filename`,
    [framework, component]
  );

  if (!result.rows.length) {
    const error = new Error("Component not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    framework,
    component,
    files: result.rows.map((row) => ({
      filename: row.filename,
      content: row.content
    }))
  };
}

async function countComponentLines(framework, component) {
  const result = await query(
    `SELECT f.filename, f.content
     FROM components c
     JOIN component_files f ON f.component_id = c.id
     WHERE c.framework = $1 AND c.component = $2
     ORDER BY f.filename`,
    [framework, component]
  );

  if (!result.rows.length) {
    const error = new Error("Component not found.");
    error.statusCode = 404;
    throw error;
  }

  const fileCounts = result.rows.map((row) => {
    const text = row.content || "";
    const lineCount = text.length ? text.split(/\r?\n/).length : 0;
    return { filename: row.filename, lines: lineCount };
  });

  const totalLines = fileCounts.reduce((sum, file) => sum + file.lines, 0);

  return {
    framework,
    component,
    totalLines,
    files: fileCounts
  };
}

async function countAllComponentLines() {
  const totalResult = await query(
    `SELECT
       COALESCE(
         SUM(
           CASE
             WHEN f.content IS NULL OR f.content = '' THEN 0
             ELSE LENGTH(f.content) - LENGTH(REPLACE(f.content, E'\n', '')) + 1
           END
         ),
         0
       )::BIGINT AS total_lines,
       COUNT(DISTINCT c.id)::INT AS total_components,
       COUNT(f.id)::INT AS total_files
     FROM components c
     LEFT JOIN component_files f ON f.component_id = c.id`
  );

  const frameworkResult = await query(
    `SELECT
       c.framework,
       COALESCE(
         SUM(
           CASE
             WHEN f.content IS NULL OR f.content = '' THEN 0
             ELSE LENGTH(f.content) - LENGTH(REPLACE(f.content, E'\n', '')) + 1
           END
         ),
         0
       )::BIGINT AS total_lines,
       COUNT(DISTINCT c.id)::INT AS total_components,
       COUNT(f.id)::INT AS total_files
     FROM components c
     LEFT JOIN component_files f ON f.component_id = c.id
     GROUP BY c.framework
     ORDER BY c.framework`
  );

  const totals = totalResult.rows[0] || {
    total_lines: 0,
    total_components: 0,
    total_files: 0
  };

  const byFramework = Object.fromEntries(
    FRAMEWORKS.map((framework) => [
      framework,
      { totalLines: 0, totalComponents: 0, totalFiles: 0 }
    ])
  );

  for (const row of frameworkResult.rows) {
    byFramework[row.framework] = {
      totalLines: Number(row.total_lines || 0),
      totalComponents: Number(row.total_components || 0),
      totalFiles: Number(row.total_files || 0)
    };
  }

  return {
    totalLines: Number(totals.total_lines || 0),
    totalComponents: Number(totals.total_components || 0),
    totalFiles: Number(totals.total_files || 0),
    byFramework
  };
}

async function deleteComponent(framework, component) {
  const frameworkDir = ensureSafePath(COMPONENTS_ROOT, framework);
  const componentDir = ensureSafePath(frameworkDir, component);

  const existing = await query(
    `SELECT c.id, f.filename
     FROM components c
     LEFT JOIN component_files f ON f.component_id = c.id
     WHERE c.framework = $1 AND c.component = $2`,
    [framework, component]
  );

  if (!existing.rows.length) {
    const error = new Error("Component not found.");
    error.statusCode = 404;
    throw error;
  }

  const files = existing.rows.map((row) => row.filename).filter(Boolean);

  await withTransaction(async (client) => {
    await client.query(
      `DELETE FROM components
       WHERE framework = $1 AND component = $2`,
      [framework, component]
    );
  });

  await Promise.all(
    files.map((filename) => {
      const fullPath = ensureSafePath(componentDir, filename);
      return fs.unlink(fullPath).catch(() => null);
    })
  );
  await fs.rmdir(componentDir).catch(() => null);

  return {
    framework,
    component,
    deleted: files.length
  };
}

module.exports = {
  createComponent,
  listComponents,
  searchComponents,
  getComponentFiles,
  getComponentContent,
  countComponentLines,
  countAllComponentLines,
  deleteComponent
};
