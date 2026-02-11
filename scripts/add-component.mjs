#!/usr/bin/env node
import { access, constants, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const VALID_FRAMEWORKS = ["react", "angular", "vue", "vanilla"];

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

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
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
}

function parseArgs(argv) {
  const args = { force: false };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];

    if (token === "--framework" || token === "-f") {
      if (i + 1 >= argv.length) fail(`Missing value for ${token}`);
      args.framework = argv[++i];
      continue;
    }

    if (token === "--name" || token === "-n") {
      if (i + 1 >= argv.length) fail(`Missing value for ${token}`);
      args.name = argv[++i];
      continue;
    }

    if (token === "--force") {
      args.force = true;
      continue;
    }

    if (token === "--help" || token === "-h") {
      args.help = true;
    }
  }
  return args;
}

function helpText() {
  return [
    "Usage:",
    "  npm run component:add -- --framework <react|angular|vue|vanilla> --name <component-name> [--force]",
    "",
    "Examples:",
    "  npm run component:add -- --framework react --name alert-banner",
    "  npm run component:add -- --framework angular --name user-card",
    ""
  ].join("\n");
}

function createAngularTemplates(componentName) {
  const className = `${toPascalCase(componentName)}Component`;
  return {
    [`${componentName}.component.ts`]:
        `import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-${componentName}",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./${componentName}.component.html",
  styleUrl: "./${componentName}.component.scss"
})
export class ${className} {}
`,
    [`${componentName}.component.html`]:
        `<section class="${componentName}">
  <h2>${componentName}</h2>
  <p>Angular component scaffold.</p>
</section>
`,
    [`${componentName}.component.scss`]:
        `.${componentName} {
  display: grid;
  gap: 0.5rem;
}
`,
    [`${componentName}.component.spec.ts`]:
        `import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ${className} } from "./${componentName}.component";

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
`
  };
}

function createWebTemplates(framework, componentName) {
  const fnName = componentName.replace(/-/g, "_");
  return {
    [`${componentName}.html`]:
        `<!-- ${framework}/${componentName} -->
<section class="${componentName}">
  <h2>${componentName}</h2>
  <p>${framework} component scaffold.</p>
</section>
`,
    [`${componentName}.js`]:
        `// ${framework}/${componentName}
export function ${fnName}() {
  return "${framework}:${componentName}";
}
`,
    [`${componentName}.scss`]:
        `.${componentName} {
  display: grid;
  gap: 0.5rem;
}
`
  };
}

async function writeTemplates(componentDir, templates, force) {
  for (const [filename] of Object.entries(templates)) {
    const filePath = path.join(componentDir, filename);

    try {
      await access(filePath, constants.F_OK);
      if (!force) {
        fail(`File already exists: ${filePath}. Use --force to overwrite.`);
      }
    } catch {
      // File doesn't exist, safe to proceed
    }

    await writeFile(filePath, "utf8");
  }
}

function getSidebarFiles(framework, componentName) {
  if (framework === "angular") {
    return [
      { lang: "html", file: `${componentName}.component.html` },
      { lang: "javascript", file: `${componentName}.component.ts` },
      { lang: "javascript", fileRole: "spec", file: `${componentName}.component.spec.ts` },
      { lang: "scss", file: `${componentName}.component.scss` }
    ];
  }
  return [
    { lang: "html", file: `${componentName}.html` },
    { lang: "javascript", file: `${componentName}.js` },
    { lang: "scss", file: `${componentName}.scss` }
  ];
}

function sidebarSnippet(framework, componentName) {
  const files = getSidebarFiles(framework, componentName);
  const fileLinks = files.map(({ lang, fileRole, file }) => {
    const roleAttr = fileRole ? ` data-file-role="${fileRole}"` : "";
    return `      <li><a class="file-item" href="#" data-framework="${framework}" data-component="${componentName}" data-lang="${lang}"${roleAttr}>${file}</a></li>`;
  }).join("\n");

  return [
    `<li class="component-tree-list__item">`,
    `  <details class="component-tree">`,
    `    <summary class="component-tree__summary">${toPascalCase(componentName)}</summary>`,
    `    <ul class="component-tree__files">`,
    fileLinks,
    `    </ul>`,
    `  </details>`,
    `</li>`
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(helpText());
    return;
  }

  if (!args.framework || !args.name) {
    console.log(helpText());
    fail("Missing required args.");
  }

  const framework = args.framework.toLowerCase();
  if (!VALID_FRAMEWORKS.includes(framework)) {
    fail(`Invalid framework '${framework}'. Valid: ${VALID_FRAMEWORKS.join(", ")}`);
  }

  const originalName = args.name;
  const componentName = toKebabCase(originalName);

  if (!componentName) {
    fail("Invalid component name.");
  }

  if (componentName !== toKebabCase(originalName) || originalName.trim() !== originalName) {
    console.warn(`Note: "${originalName}" normalized to "${componentName}"`);
  }

  const root = process.cwd();
  const componentDir = path.join(root, "components", framework);

  try {
    await mkdir(componentDir, { recursive: true });
  } catch (error) {
    fail(`Failed to create directory ${componentDir}: ${error.message}`);
  }

  const templates = framework === "angular"
      ? createAngularTemplates(componentName)
      : createWebTemplates(framework, componentName);

  await writeTemplates(componentDir, templates, args.force);

  console.log(`Created ${Object.keys(templates).length} files in ${componentDir}`);
  console.log("");
  console.log("Sidebar snippet:");
  console.log(sidebarSnippet(framework, componentName));
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error));
});