import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

const editorRoot = document.getElementById("editor");
const sidebarRoot = document.querySelector(".left-sidebar");
const tabs = Array.from(document.querySelectorAll(".editor__tab"));
const addComponentModal = document.getElementById("add-component-modal");
const addComponentButton = document.getElementById("add-component-button");
const addComponentForm = document.getElementById("add-component-form");
const addComponentFramework = document.getElementById("add-component-framework");
const addComponentName = document.getElementById("add-component-name");
const addComponentVersion = document.getElementById("add-component-version");
const addComponentAuthor = document.getElementById("add-component-author");
const addComponentNumber = document.getElementById("add-component-number");
const addComponentCancel = document.getElementById("add-component-cancel");
const addComponentBackdropClose = document.querySelector("[data-component-modal-close]");

const API_BASE_URL = "http://localhost:4173/api";

const extensionByLang = {
  html: html(),
  javascript: javascript({ jsx: true, typescript: true }),
  scss: css()
};

const darkEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#d6deeb",
      backgroundColor: "#0f1724"
    },
    ".cm-content": {
      caretColor: "#8ab4ff"
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#8ab4ff"
    },
    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#1f3556"
    },
    ".cm-panels": {
      backgroundColor: "#0b1220",
      color: "#d6deeb"
    },
    ".cm-gutters": {
      backgroundColor: "#111a2a",
      color: "#7f8ea3",
      borderRight: "1px solid #1f2a3a"
    },
    ".cm-activeLine": {
      backgroundColor: "#111f33"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#16263d",
      color: "#a8c4f0"
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 10px 0 6px"
    }
  },
  { dark: true }
);

const emptyContent = {
  html: "<!-- select a component -->",
  javascript: "// select a component",
  scss: "// select a component"
};

let activeLang = "html";
let currentContent = { ...emptyContent };
const generatedComponents = new Map();

function componentKey(framework, component) {
  return `${framework}:${component}`;
}

function toKebabCase(input) {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function toTitleCase(input) {
  return toKebabCase(input)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getFileItems() {
  return Array.from(document.querySelectorAll(".file-item"));
}

function createGeneratedContent(framework, component, metadata = {}) {
  const title = toTitleCase(component);
  const version = (metadata.version || "1.0.0").trim();
  const author = (metadata.author || "Unknown").trim();
  const number = (metadata.number || "N/A").trim();
  const htmlMeta = `<!-- ${framework}/${component} | version: ${version} | author: ${author} | number: ${number} -->`;
  const jsMeta = `// ${framework}/${component} | version: ${version} | author: ${author} | number: ${number}`;

  if (framework === "angular") {
    return {
      html: `${htmlMeta}\n<section class="${component}">\n  <h2>${title}</h2>\n  <p>Angular ${title} template.</p>\n  <small>v${version} - ${author} - ${number}</small>\n</section>\n`,
      javascript: `${jsMeta}\nimport { Component } from "@angular/core";\n\n@Component({\n  selector: "app-${component}",\n  standalone: true,\n  templateUrl: "./${component}.component.html",\n  styleUrl: "./${component}.component.scss"\n})\nexport class ${toTitleCase(component).replace(/\s+/g, "")}Component {}\n`,
      javascriptSpec: `${jsMeta} (spec)\nimport { ComponentFixture, TestBed } from "@angular/core/testing";\nimport { ${toTitleCase(component).replace(/\s+/g, "")}Component } from "./${component}.component";\n\ndescribe("${toTitleCase(component).replace(/\s+/g, "")}Component", () => {\n  let component: ${toTitleCase(component).replace(/\s+/g, "")}Component;\n  let fixture: ComponentFixture<${toTitleCase(component).replace(/\s+/g, "")}Component>;\n\n  beforeEach(async () => {\n    await TestBed.configureTestingModule({\n      imports: [${toTitleCase(component).replace(/\s+/g, "")}Component]\n    }).compileComponents();\n\n    fixture = TestBed.createComponent(${toTitleCase(component).replace(/\s+/g, "")}Component);\n    component = fixture.componentInstance;\n    fixture.detectChanges();\n  });\n\n  it("creates", () => {\n    expect(component).toBeTruthy();\n  });\n});\n`,
      scss: `.${component} {\n  display: grid;\n  gap: 0.5rem;\n}\n`
    };
  }

  if (framework === "react") {
    const componentName = `${toTitleCase(component).replace(/\s+/g, "")}Component`;
    return {
      html: `<!-- ${framework}/${component} rendered from ${component}.jsx -->\n`,
      javascript: `${jsMeta}\nimport React from "react";\n\nexport default function ${componentName}() {\n  return (\n    <section className="${component}">\n      <h2>${title}</h2>\n      <p>React ${title} scaffold.</p>\n      <small>v${version} - ${author} - ${number}</small>\n    </section>\n  );\n}\n`,
      scss: `.${component} {\n  display: grid;\n  gap: 0.5rem;\n}\n`
    };
  }

  return {
    html: `${htmlMeta}\n<section class="${component}">\n  <h2>${title}</h2>\n  <p>${framework} ${title} scaffold.</p>\n  <small>v${version} - ${author} - ${number}</small>\n</section>\n`,
    javascript: `${jsMeta}\nexport function ${component.replace(/-/g, "_")}() {\n  return "${framework}:${component}";\n}\n`,
    scss: `.${component} {\n  display: grid;\n  gap: 0.5rem;\n}\n`
  };
}

function createFileItemLink(framework, component, lang, label, fileRole = "") {
  const listItem = document.createElement("li");
  const link = document.createElement("a");
  link.className = "file-item";
  link.href = "#";
  link.dataset.framework = framework;
  link.dataset.component = component;
  link.dataset.lang = lang;
  if (fileRole) link.dataset.fileRole = fileRole;
  link.textContent = label;
  listItem.appendChild(link);
  return listItem;
}

function createComponentTreeNode(framework, component) {
  const listItem = document.createElement("li");
  listItem.className = "component-tree-list__item";

  const details = document.createElement("details");
  details.className = "component-tree";
  details.open = true;

  const summary = document.createElement("summary");
  summary.className = "component-tree__summary";
  summary.textContent = toTitleCase(component);

  const files = document.createElement("ul");
  files.className = "component-tree__files";

  if (framework === "angular") {
    files.appendChild(createFileItemLink(framework, component, "html", `${component}.component.html`));
    files.appendChild(createFileItemLink(framework, component, "javascript", `${component}.component.ts`));
    files.appendChild(createFileItemLink(framework, component, "javascript", `${component}.component.spec.ts`, "spec"));
    files.appendChild(createFileItemLink(framework, component, "scss", `${component}.component.scss`));
  } else if (framework === "react") {
    files.appendChild(createFileItemLink(framework, component, "javascript", `${component}.jsx`));
    files.appendChild(createFileItemLink(framework, component, "scss", `${component}.scss`));
  } else {
    files.appendChild(createFileItemLink(framework, component, "html", `${component}.html`));
    files.appendChild(createFileItemLink(framework, component, "javascript", `${component}.js`));
    files.appendChild(createFileItemLink(framework, component, "scss", `${component}.scss`));
  }

  details.appendChild(summary);
  details.appendChild(files);
  listItem.appendChild(details);
  return listItem;
}

function setActiveTab(nextLang) {
  activeLang = nextLang;
  tabs.forEach((tab) => {
    tab.setAttribute("aria-selected", tab.dataset.lang === nextLang ? "true" : "false");
  });
}

function replaceDoc(view, text) {
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: text }
  });
}

function closeAddComponentModal() {
  if (!addComponentModal || !addComponentForm) return;
  addComponentModal.hidden = true;
  addComponentForm.reset();
}

async function createComponentOnApi(payload) {
  const response = await fetch(`${API_BASE_URL}/components`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

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

async function listComponentsOnApi() {
  const response = await fetch(`${API_BASE_URL}/components`);

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || !body?.ok || typeof body.components !== "object") {
    const reason = body?.error || `Request failed (${response.status})`;
    throw new Error(reason);
  }

  return body.components;
}

function getFrameworkItemByName(framework) {
  return Array.from(document.querySelectorAll(".framework-list__item")).find((item) => {
    const title = item.querySelector(".framework-list__title");
    return title && title.textContent.trim().toLowerCase() === framework;
  });
}

function ensureComponentTreeList(frameworkItem) {
  let list = frameworkItem.querySelector(".component-tree-list");
  if (!list) {
    list = document.createElement("ul");
    list.className = "component-tree-list";
    frameworkItem.appendChild(list);
  }
  return list;
}

async function syncSidebarFromApi() {
  const componentsByFramework = await listComponentsOnApi();

  Object.entries(componentsByFramework).forEach(([framework, names]) => {
    const frameworkItem = getFrameworkItemByName(framework);
    if (!frameworkItem) return;

    const list = ensureComponentTreeList(frameworkItem);
    list.textContent = "";

    names.forEach((name) => {
      list.appendChild(createComponentTreeNode(framework, name));
    });
  });
}

async function fetchTextFirstOk(paths) {
  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (!response.ok) continue;
      return { ok: true, path, text: await response.text() };
    } catch {
      // ignore, try next
    }
  }
  return { ok: false, path: paths[0], text: "" };
}

async function loadComponent(framework, component, fileRole = "main") {
  const generated = generatedComponents.get(componentKey(framework, component));
  if (generated) {
    currentContent = {
      html: generated.html,
      javascript: fileRole === "spec" && generated.javascriptSpec ? generated.javascriptSpec : generated.javascript,
      scss: generated.scss
    };
    return;
  }

  // Files live in project root `components/`, while the UI is served from `client/`.
  // Preferred layout: components/<framework>/<component>/<component>.<ext>
  // Legacy fallback: components/<framework>/<component>.<ext>
  const nestedBaseA = `../components/${framework}/${component}/${component}`;
  const nestedBaseB = `components/${framework}/${component}/${component}`;
  const legacyBaseA = `../components/${framework}/${component}`;
  const legacyBaseB = `components/${framework}/${component}`;
  const nestedAngularBaseA = `../components/${framework}/${component}/${component}.component`;
  const nestedAngularBaseB = `components/${framework}/${component}/${component}.component`;
  const legacyAngularBaseA = `../components/${framework}/${component}.component`;
  const legacyAngularBaseB = `components/${framework}/${component}.component`;

  const fileMap = framework === "angular"
    ? {
        html: [
          `${nestedAngularBaseA}.html`,
          `${nestedAngularBaseB}.html`,
          `${legacyAngularBaseA}.html`,
          `${legacyAngularBaseB}.html`,
          `${nestedBaseA}.html`,
          `${nestedBaseB}.html`,
          `${legacyBaseA}.html`,
          `${legacyBaseB}.html`
        ],
        javascript: fileRole === "spec"
          ? [
              `${nestedAngularBaseA}.spec.ts`,
              `${nestedAngularBaseB}.spec.ts`,
              `${legacyAngularBaseA}.spec.ts`,
              `${legacyAngularBaseB}.spec.ts`,
              `${nestedAngularBaseA}.ts`,
              `${nestedAngularBaseB}.ts`,
              `${legacyAngularBaseA}.ts`,
              `${legacyAngularBaseB}.ts`,
              `${nestedBaseA}.spec.ts`,
              `${nestedBaseB}.spec.ts`,
              `${legacyBaseA}.spec.ts`,
              `${legacyBaseB}.spec.ts`,
              `${nestedBaseA}.ts`,
              `${nestedBaseB}.ts`,
              `${legacyBaseA}.ts`,
              `${legacyBaseB}.ts`,
              `${nestedBaseA}.js`,
              `${nestedBaseB}.js`,
              `${legacyBaseA}.js`,
              `${legacyBaseB}.js`
            ]
          : [
              `${nestedAngularBaseA}.ts`,
              `${nestedAngularBaseB}.ts`,
              `${legacyAngularBaseA}.ts`,
              `${legacyAngularBaseB}.ts`,
              `${nestedBaseA}.ts`,
              `${nestedBaseB}.ts`,
              `${legacyBaseA}.ts`,
              `${legacyBaseB}.ts`,
              `${nestedBaseA}.js`,
              `${nestedBaseB}.js`,
              `${legacyBaseA}.js`,
              `${legacyBaseB}.js`
            ],
        scss: [
          `${nestedAngularBaseA}.scss`,
          `${nestedAngularBaseB}.scss`,
          `${legacyAngularBaseA}.scss`,
          `${legacyAngularBaseB}.scss`,
          `${nestedBaseA}.scss`,
          `${nestedBaseB}.scss`,
          `${legacyBaseA}.scss`,
          `${legacyBaseB}.scss`
        ]
      }
    : framework === "react"
      ? {
          html: [
            `${nestedBaseA}.jsx`,
            `${nestedBaseB}.jsx`,
            `${legacyBaseA}.jsx`,
            `${legacyBaseB}.jsx`,
            `${nestedBaseA}.tsx`,
            `${nestedBaseB}.tsx`,
            `${legacyBaseA}.tsx`,
            `${legacyBaseB}.tsx`,
            `${nestedBaseA}.js`,
            `${nestedBaseB}.js`,
            `${legacyBaseA}.js`,
            `${legacyBaseB}.js`
          ],
          javascript: [
            `${nestedBaseA}.jsx`,
            `${nestedBaseB}.jsx`,
            `${legacyBaseA}.jsx`,
            `${legacyBaseB}.jsx`,
            `${nestedBaseA}.tsx`,
            `${nestedBaseB}.tsx`,
            `${legacyBaseA}.tsx`,
            `${legacyBaseB}.tsx`,
            `${nestedBaseA}.js`,
            `${nestedBaseB}.js`,
            `${legacyBaseA}.js`,
            `${legacyBaseB}.js`
          ],
          scss: [`${nestedBaseA}.scss`, `${nestedBaseB}.scss`, `${legacyBaseA}.scss`, `${legacyBaseB}.scss`]
        }
    : {
        html: [`${nestedBaseA}.html`, `${nestedBaseB}.html`, `${legacyBaseA}.html`, `${legacyBaseB}.html`],
        javascript: [`${nestedBaseA}.js`, `${nestedBaseB}.js`, `${legacyBaseA}.js`, `${legacyBaseB}.js`],
        scss: [`${nestedBaseA}.scss`, `${nestedBaseB}.scss`, `${legacyBaseA}.scss`, `${legacyBaseB}.scss`]
      };

  const nextContent = {};

  for (const lang of Object.keys(fileMap)) {
    const result = await fetchTextFirstOk(fileMap[lang]);
    if (result.ok) {
      nextContent[lang] = result.text;
      continue;
    }

    const missingPath = fileMap[lang][0];
    if (lang === "html") nextContent[lang] = `<!-- Missing ${missingPath} -->`;
    if (lang === "javascript") nextContent[lang] = `// Missing ${missingPath}`;
    if (lang === "scss") nextContent[lang] = `// Missing ${missingPath}`;
  }

  currentContent = nextContent;
}

function setActiveFile(activeLink) {
  getFileItems().forEach((link) => {
    if (link === activeLink) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

if (editorRoot) {
  const language = new Compartment();

  const state = EditorState.create({
    doc: currentContent[activeLang],
    extensions: [
      lineNumbers(),
      highlightActiveLineGutter(),
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.lineWrapping,
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      darkEditorTheme,
      language.of(extensionByLang[activeLang])
    ]
  });

  const view = new EditorView({
    state,
    parent: editorRoot
  });
  void syncSidebarFromApi().catch(() => {});


  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const nextLang = tab.dataset.lang;
      setActiveTab(nextLang);
      view.dispatch({ effects: language.reconfigure(extensionByLang[nextLang]) });
      replaceDoc(view, currentContent[nextLang]);
    });
  });

  if (sidebarRoot) {
    sidebarRoot.addEventListener("click", async (event) => {
      const link = event.target.closest(".file-item");
      if (!link) return;

      event.preventDefault();
      setActiveFile(link);

      const framework = link.dataset.framework;
      const component = link.dataset.component;
      const nextLang = link.dataset.lang || "html";
      const fileRole = link.dataset.fileRole || "main";

      await loadComponent(framework, component, fileRole);

      setActiveTab(nextLang);
      view.dispatch({ effects: language.reconfigure(extensionByLang[nextLang]) });
      replaceDoc(view, currentContent[nextLang]);
    });
  }

  if (
    addComponentModal &&
    addComponentButton &&
    addComponentForm &&
    addComponentFramework &&
    addComponentName &&
    addComponentVersion &&
    addComponentAuthor &&
    addComponentNumber &&
    addComponentCancel
  ) {
    addComponentButton.addEventListener("click", () => {
      addComponentModal.hidden = false;
      addComponentName.focus();
    });

    addComponentCancel.addEventListener("click", closeAddComponentModal);

    if (addComponentBackdropClose) {
      addComponentBackdropClose.addEventListener("click", closeAddComponentModal);
    }

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !addComponentModal.hidden) {
        closeAddComponentModal();
      }
    });

    addComponentForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const framework = addComponentFramework.value;
      const component = toKebabCase(addComponentName.value);
      const metadata = {
        version: addComponentVersion.value,
        author: addComponentAuthor.value,
        number: addComponentNumber.value
      };
      if (!component) return;

      const frameworkItem = getFrameworkItemByName(framework);
      if (!frameworkItem) return;

      const existing = frameworkItem.querySelector(`.file-item[data-component="${component}"]`);
      if (existing) {
        existing.click();
        closeAddComponentModal();
        return;
      }

      try {
        await createComponentOnApi({ framework, component, ...metadata });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        window.alert(`Failed to create component: ${message}`);
        return;
      }

      generatedComponents.set(componentKey(framework, component), createGeneratedContent(framework, component, metadata));

      try {
        await syncSidebarFromApi();
      } catch {
        const list = ensureComponentTreeList(frameworkItem);
        const node = createComponentTreeNode(framework, component);
        list.appendChild(node);
      }

      const firstFile = document.querySelector(`.file-item[data-framework="${framework}"][data-component="${component}"]`);
      if (firstFile) firstFile.click();

      closeAddComponentModal();
    });
  }
}
