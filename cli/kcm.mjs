#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";

let apiBase = process.env.KCM_API_URL || "http://127.0.0.1:4173/api";
const FRAMEWORKS = ["react", "angular", "vue", "vanilla"];

async function request(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, options);
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || !body?.ok) {
    const reason = body?.error || `Request failed (${response.status})`;
    throw new Error(reason);
  }
  return body;
}

async function createComponent({ framework, component, version, author, number }) {
  const body = await request("/components", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ framework, component, version, author, number })
  });
  console.log(`Created ${framework}/${component}`);
  console.log(`Files: ${body.files.join(", ")}`);
}

async function listComponents() {
  const body = await request("/components");
  const frameworks = Object.keys(body.components);
  for (const fw of frameworks) {
    const items = body.components[fw] || [];
    console.log(`${fw}: ${items.length ? items.join(", ") : "(none)"}`);
  }
}

async function deleteComponent(framework, component) {
  await request(`/components/${framework}/${component}`, { method: "DELETE" });
  console.log(`Deleted ${framework}/${component}`);
}

async function interactiveMode() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: [
        { name: "Create component", value: "create" },
        { name: "List components", value: "list" },
        { name: "Delete component", value: "delete" }
      ]
    }
  ]);

  if (action === "list") {
    await listComponents();
    return;
  }

  if (action === "create") {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "framework",
        message: "Framework",
        choices: FRAMEWORKS
      },
      {
        type: "input",
        name: "component",
        message: "Component name (kebab-case)",
        validate: (v) => (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) ? true : "Use kebab-case")
      },
      {
        type: "input",
        name: "version",
        message: "Version",
        default: "1.0.0"
      },
      {
        type: "input",
        name: "author",
        message: "Author",
        default: "Unknown"
      },
      {
        type: "input",
        name: "number",
        message: "Number",
        default: "N/A"
      }
    ]);

    await createComponent(answers);
    return;
  }

  const listBody = await request("/components");
  const componentChoices = Object.entries(listBody.components).flatMap(([framework, items]) =>
    (items || []).map((component) => ({
      name: `${framework}/${component}`,
      value: { framework, component }
    }))
  );

  if (!componentChoices.length) {
    console.log("No components available to delete.");
    return;
  }

  const { target } = await inquirer.prompt([
    {
      type: "list",
      name: "target",
      message: "Select component to delete",
      choices: componentChoices
    }
  ]);

  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message: `Delete ${target.framework}/${target.component}?`,
      default: false
    }
  ]);

  if (!confirmed) {
    console.log("Cancelled.");
    return;
  }

  await deleteComponent(target.framework, target.component);
}

const program = new Command();
program
  .name("kcm")
  .description("Kaylios Component Manager CLI")
  .option("--api <url>", "API base URL override");

program
  .command("create")
  .requiredOption("-f, --framework <framework>", "framework", (v) => v.toLowerCase())
  .requiredOption("-n, --name <component>", "component name (kebab-case)")
  .option("-v, --version <version>", "version", "1.0.0")
  .option("-a, --author <author>", "author", "Unknown")
  .option("--number <number>", "component number", "N/A")
  .action(async (options) => {
    if (!FRAMEWORKS.includes(options.framework)) {
      throw new Error(`Invalid framework '${options.framework}'. Use: ${FRAMEWORKS.join(", ")}`);
    }
    await createComponent({
      framework: options.framework,
      component: options.name,
      version: options.version,
      author: options.author,
      number: options.number
    });
  });

program
  .command("list")
  .description("List components")
  .action(async () => {
    await listComponents();
  });

program
  .command("delete")
  .requiredOption("-f, --framework <framework>", "framework")
  .requiredOption("-n, --name <component>", "component name")
  .action(async (options) => {
    await deleteComponent(options.framework, options.name);
  });

program
  .command("interactive")
  .description("Interactive mode (inquirer)")
  .action(async () => {
    await interactiveMode();
  });

program.hook("preAction", (thisCommand) => {
  const opts = thisCommand.opts();
  if (opts.api) apiBase = opts.api;
});

(async () => {
  try {
    program.parse(process.argv);
    if (!process.argv.slice(2).length) {
      await interactiveMode();
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
})();
