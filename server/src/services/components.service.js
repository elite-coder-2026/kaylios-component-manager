const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..", "..", "..");
const COMPONENTS_ROOT = path.join(ROOT, "components");

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
  const componentDir = ensureSafePath(COMPONENTS_ROOT, framework);
  await fs.mkdir(componentDir, { recursive: true });

  const templates = createTemplates(framework, component, { version, author, number });
  for (const filename of Object.keys(templates)) {
    const fullPath = ensureSafePath(componentDir, filename);
    try {
      await fs.access(fullPath);
      const error = new Error(`Component file already exists: ${filename}`);
      error.statusCode = 409;
      throw error;
    } catch (accessError) {
      if (accessError.statusCode) throw accessError;
    }
  }

  for (const [filename, content] of Object.entries(templates)) {
    const fullPath = ensureSafePath(componentDir, filename);
    await fs.writeFile(fullPath, content, "utf8");
  }

  return {
    framework,
    component,
    files: Object.keys(templates)
  };
}

async function listComponents() {
  await fs.mkdir(COMPONENTS_ROOT, { recursive: true });
  const frameworks = await fs.readdir(COMPONENTS_ROOT, { withFileTypes: true });
  const out = {};

  for (const dirent of frameworks) {
    if (!dirent.isDirectory()) continue;
    const fw = dirent.name;
    const folder = ensureSafePath(COMPONENTS_ROOT, fw);
    const files = await fs.readdir(folder, { withFileTypes: true });
    const names = new Set();

    for (const entry of files) {
      if (!entry.isFile()) continue;
      const name = entry.name;
      const componentName = name
        .replace(/\.component\.(html|ts|spec\.ts|scss)$/i, "")
        .replace(/\.(html|js|scss)$/i, "");
      if (componentName) names.add(componentName);
    }

    out[fw] = Array.from(names).sort();
  }

  return out;
}

async function getComponentFiles(framework, component) {
  const folder = ensureSafePath(COMPONENTS_ROOT, framework);
  await fs.mkdir(folder, { recursive: true });
  const files = await fs.readdir(folder, { withFileTypes: true });
  const matches = files
    .filter((entry) => entry.isFile() && entry.name.startsWith(component))
    .map((entry) => entry.name)
    .sort();

  if (!matches.length) {
    const error = new Error("Component not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    framework,
    component,
    files: matches
  };
}

async function deleteComponent(framework, component) {
  const folder = ensureSafePath(COMPONENTS_ROOT, framework);
  await fs.mkdir(folder, { recursive: true });
  const files = await fs.readdir(folder, { withFileTypes: true });
  const targets = files
    .filter((entry) => entry.isFile() && entry.name.startsWith(component))
    .map((entry) => ensureSafePath(folder, entry.name));

  if (!targets.length) {
    const error = new Error("Component not found.");
    error.statusCode = 404;
    throw error;
  }

  await Promise.all(targets.map((file) => fs.unlink(file)));
  return {
    framework,
    component,
    deleted: targets.length
  };
}

module.exports = {
  createComponent,
  listComponents,
  getComponentFiles,
  deleteComponent
};
