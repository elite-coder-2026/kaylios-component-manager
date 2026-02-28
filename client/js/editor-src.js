import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

const editorRoot = document.getElementById("editor");
const sidebarRoot = document.querySelector(".left-sidebar");
const rightSidebarRoot = document.querySelector(".right-sidebar");
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
const editorThemePicker = document.getElementById("editor-theme-picker");
const editorThemeButton = document.getElementById("editor-theme-button");
const editorThemeMenu = document.getElementById("editor-theme-menu");
const PREVIEW_FRAME_ID = "component-preview-frame";
const editorThemeLabel = document.getElementById("editor-theme-label");
const previewFrame = document.getElementById(PREVIEW_FRAME_ID);
const previewRefreshButton = document.getElementById("preview-refresh");

const API_BASE_URL = "http://localhost:4173/api";
const AUTH_TOKEN_STORAGE_KEYS = ["kcm_token", "authToken", "token"];
const EDITOR_THEME_STORAGE_KEY = "kcm_editor_theme";
const DEFAULT_EDITOR_THEME = "midnight";

const extensionByLang = {
  html: html(),
  javascript: javascript({ jsx: true, typescript: true }),
  scss: css()
};

const midnightEditorTheme = EditorView.theme(
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

const lightEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#0f172a",
      backgroundColor: "#f8fafc"
    },
    ".cm-content": {
      caretColor: "#0b3aa9"
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#0b3aa9"
    },
    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#dbeafe"
    },
    ".cm-panels": {
      backgroundColor: "#f1f5f9",
      color: "#0f172a"
    },
    ".cm-gutters": {
      backgroundColor: "#eef2f7",
      color: "#475569",
      borderRight: "1px solid #d6deea"
    },
    ".cm-activeLine": {
      backgroundColor: "#eaf1ff"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#dfe9ff",
      color: "#1d4ed8"
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 10px 0 6px"
    }
  },
  { dark: false }
);

const draculaEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#f8f8f2",
      backgroundColor: "#282a36"
    },
    ".cm-content": {
      caretColor: "#ff79c6"
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#ff79c6"
    },
    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#44475a"
    },
    ".cm-panels": {
      backgroundColor: "#21222c",
      color: "#f8f8f2"
    },
    ".cm-gutters": {
      backgroundColor: "#21222c",
      color: "#8b93a8",
      borderRight: "1px solid #3a3d4b"
    },
    ".cm-activeLine": {
      backgroundColor: "#303341"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#3a3d4b",
      color: "#bd93f9"
    }
  },
  { dark: true }
);

const nordEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#d8dee9",
      backgroundColor: "#2e3440"
    },
    ".cm-content": {
      caretColor: "#88c0d0"
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#88c0d0"
    },
    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#434c5e"
    },
    ".cm-panels": {
      backgroundColor: "#3b4252",
      color: "#e5e9f0"
    },
    ".cm-gutters": {
      backgroundColor: "#3b4252",
      color: "#81a1c1",
      borderRight: "1px solid #4c566a"
    },
    ".cm-activeLine": {
      backgroundColor: "#434c5e"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#4c566a",
      color: "#eceff4"
    }
  },
  { dark: true }
);

const solarizedDarkEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#93a1a1",
      backgroundColor: "#002b36"
    },
    ".cm-content": {
      caretColor: "#2aa198"
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#2aa198"
    },
    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#073642"
    },
    ".cm-panels": {
      backgroundColor: "#073642",
      color: "#93a1a1"
    },
    ".cm-gutters": {
      backgroundColor: "#073642",
      color: "#839496",
      borderRight: "1px solid #0f4451"
    },
    ".cm-activeLine": {
      backgroundColor: "#0a3944"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#114552",
      color: "#b6c7c7"
    }
  },
  { dark: true }
);

const solarizedLightEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#586e75",
      backgroundColor: "#fdf6e3"
    },
    ".cm-content": {
      caretColor: "#268bd2"
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#268bd2"
    },
    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#eee8d5"
    },
    ".cm-panels": {
      backgroundColor: "#eee8d5",
      color: "#586e75"
    },
    ".cm-gutters": {
      backgroundColor: "#eee8d5",
      color: "#657b83",
      borderRight: "1px solid #e2dbc7"
    },
    ".cm-activeLine": {
      backgroundColor: "#f5efdd"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#e8e0cc",
      color: "#445b61"
    }
  },
  { dark: false }
);

const highContrastEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#ffffff",
      backgroundColor: "#000000"
    },
    ".cm-content": {
      caretColor: "#ffff00"
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#ffff00"
    },
    ".cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#333333"
    },
    ".cm-panels": {
      backgroundColor: "#000000",
      color: "#ffffff"
    },
    ".cm-gutters": {
      backgroundColor: "#000000",
      color: "#ffffff",
      borderRight: "1px solid #666666"
    },
    ".cm-activeLine": {
      backgroundColor: "#1a1a1a"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#262626",
      color: "#ffffff"
    }
  },
  { dark: true }
);

const themeConfigByName = {
  midnight: { extension: midnightEditorTheme, dark: true },
  light: { extension: lightEditorTheme, dark: false },
  dracula: { extension: draculaEditorTheme, dark: true },
  nord: { extension: nordEditorTheme, dark: true },
  "solarized-dark": { extension: solarizedDarkEditorTheme, dark: true },
  "solarized-light": { extension: solarizedLightEditorTheme, dark: false },
  "high-contrast": { extension: highContrastEditorTheme, dark: true }
};
const themeLabelByName = {
  midnight: "Midnight",
  light: "Light",
  dracula: "Dracula",
  nord: "Nord",
  "solarized-dark": "Solarized Dark",
  "solarized-light": "Solarized Light",
  "high-contrast": "High Contrast"
};
const themePaletteByName = {
  midnight: {
    bg: "#0f1724",
    fg: "#d6deeb",
    gutterBg: "#111a2a",
    gutterFg: "#7f8ea3",
    gutterBorder: "#1f2a3a"
  },
  light: {
    bg: "#f8fafc",
    fg: "#0f172a",
    gutterBg: "#eef2f7",
    gutterFg: "#475569",
    gutterBorder: "#d6deea"
  },
  dracula: {
    bg: "#282a36",
    fg: "#f8f8f2",
    gutterBg: "#21222c",
    gutterFg: "#8b93a8",
    gutterBorder: "#3a3d4b"
  },
  nord: {
    bg: "#2e3440",
    fg: "#d8dee9",
    gutterBg: "#3b4252",
    gutterFg: "#81a1c1",
    gutterBorder: "#4c566a"
  },
  "solarized-dark": {
    bg: "#002b36",
    fg: "#93a1a1",
    gutterBg: "#073642",
    gutterFg: "#839496",
    gutterBorder: "#0f4451"
  },
  "solarized-light": {
    bg: "#fdf6e3",
    fg: "#586e75",
    gutterBg: "#eee8d5",
    gutterFg: "#657b83",
    gutterBorder: "#e2dbc7"
  },
  "high-contrast": {
    bg: "#000000",
    fg: "#ffffff",
    gutterBg: "#000000",
    gutterFg: "#ffffff",
    gutterBorder: "#666666"
  }
};

function createHighlightStyle({
  keyword,
  atom,
  number,
  string,
  variable,
  property,
  functionName,
  typeName,
  comment,
  punctuation,
  operator
}) {
  return HighlightStyle.define([
    { tag: [t.keyword, t.modifier], color: keyword, fontWeight: "600" },
    { tag: [t.atom, t.bool, t.null], color: atom },
    { tag: [t.number, t.integer, t.float], color: number },
    { tag: [t.string, t.special(t.string), t.regexp], color: string },
    { tag: [t.variableName, t.labelName], color: variable },
    { tag: [t.propertyName, t.attributeName], color: property },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: functionName },
    { tag: [t.typeName, t.className], color: typeName },
    { tag: [t.comment, t.lineComment, t.blockComment], color: comment, fontStyle: "italic" },
    { tag: [t.punctuation, t.bracket], color: punctuation },
    { tag: [t.operator, t.compareOperator, t.arithmeticOperator], color: operator }
  ]);
}

const highlightByThemeName = {
  midnight: createHighlightStyle({
    keyword: "#c792ea",
    atom: "#f78c6c",
    number: "#f78c6c",
    string: "#c3e88d",
    variable: "#d6deeb",
    property: "#82aaff",
    functionName: "#82aaff",
    typeName: "#ffcb6b",
    comment: "#637777",
    punctuation: "#89a0b6",
    operator: "#89ddff"
  }),
  light: createHighlightStyle({
    keyword: "#6f42c1",
    atom: "#b54708",
    number: "#b54708",
    string: "#0f766e",
    variable: "#0f172a",
    property: "#1d4ed8",
    functionName: "#1d4ed8",
    typeName: "#7c3aed",
    comment: "#64748b",
    punctuation: "#475569",
    operator: "#0369a1"
  }),
  dracula: createHighlightStyle({
    keyword: "#ff79c6",
    atom: "#bd93f9",
    number: "#bd93f9",
    string: "#f1fa8c",
    variable: "#f8f8f2",
    property: "#8be9fd",
    functionName: "#50fa7b",
    typeName: "#ffb86c",
    comment: "#6272a4",
    punctuation: "#f8f8f2",
    operator: "#ff79c6"
  }),
  nord: createHighlightStyle({
    keyword: "#b48ead",
    atom: "#d08770",
    number: "#d08770",
    string: "#a3be8c",
    variable: "#d8dee9",
    property: "#88c0d0",
    functionName: "#8fbcbb",
    typeName: "#81a1c1",
    comment: "#616e88",
    punctuation: "#c0c8d8",
    operator: "#81a1c1"
  }),
  "solarized-dark": createHighlightStyle({
    keyword: "#859900",
    atom: "#d33682",
    number: "#cb4b16",
    string: "#2aa198",
    variable: "#93a1a1",
    property: "#268bd2",
    functionName: "#b58900",
    typeName: "#6c71c4",
    comment: "#586e75",
    punctuation: "#839496",
    operator: "#268bd2"
  }),
  "solarized-light": createHighlightStyle({
    keyword: "#859900",
    atom: "#d33682",
    number: "#cb4b16",
    string: "#2aa198",
    variable: "#586e75",
    property: "#268bd2",
    functionName: "#b58900",
    typeName: "#6c71c4",
    comment: "#93a1a1",
    punctuation: "#657b83",
    operator: "#268bd2"
  }),
  "high-contrast": createHighlightStyle({
    keyword: "#00ffff",
    atom: "#ffff00",
    number: "#ffff00",
    string: "#00ff00",
    variable: "#ffffff",
    property: "#00ffff",
    functionName: "#00ff00",
    typeName: "#ff00ff",
    comment: "#999999",
    punctuation: "#ffffff",
    operator: "#ffff00"
  })
};

const emptyContent = {
  html: "<!-- select a component -->",
  javascript: "// select a component",
  scss: "// select a component"
};

let activeLang = "html";
let activeTheme = DEFAULT_EDITOR_THEME;
let currentContent = { ...emptyContent };
const generatedComponents = new Map();
let activeComponentInfo = null;
let lineTotals = null;
let previewUpdateTimer = null;

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

function getApiAuthToken() {
  if (typeof window !== "undefined" && typeof window.KCM_API_TOKEN === "string" && window.KCM_API_TOKEN.trim()) {
    return window.KCM_API_TOKEN.trim();
  }

  if (typeof window === "undefined") return "";

  for (const key of AUTH_TOKEN_STORAGE_KEYS) {
    const localValue = window.localStorage.getItem(key);
    if (typeof localValue === "string" && localValue.trim()) return localValue.trim();

    const sessionValue = window.sessionStorage.getItem(key);
    if (typeof sessionValue === "string" && sessionValue.trim()) return sessionValue.trim();
  }

  return "";
}

function buildAuthHeaders(baseHeaders = {}) {
  const token = getApiAuthToken();
  if (!token) return baseHeaders;
  return {
    ...baseHeaders,
    Authorization: `Bearer ${token}`
  };
}

function normalizeThemeName(value) {
  if (typeof value === "string" && Object.prototype.hasOwnProperty.call(themeConfigByName, value)) {
    return value;
  }
  return DEFAULT_EDITOR_THEME;
}

function getStoredThemeName() {
  if (typeof window === "undefined") return DEFAULT_EDITOR_THEME;
  const raw = window.localStorage.getItem(EDITOR_THEME_STORAGE_KEY);
  return normalizeThemeName(raw || DEFAULT_EDITOR_THEME);
}

function openThemeMenu() {
  if (!editorThemeButton || !editorThemeMenu) return;
  editorThemeMenu.hidden = false;
  editorThemeButton.setAttribute("aria-expanded", "true");
}

function closeThemeMenu() {
  if (!editorThemeButton || !editorThemeMenu) return;
  editorThemeMenu.hidden = true;
  editorThemeButton.setAttribute("aria-expanded", "false");
}

function saveThemeName(themeName) {
  try {
    window.localStorage.setItem(EDITOR_THEME_STORAGE_KEY, themeName);
  } catch {
    // ignore storage failures
  }
}

function applyEditorTheme(view, themeCompartment, syntaxCompartment, themeName) {
  const nextTheme = normalizeThemeName(themeName);
  activeTheme = nextTheme;

  if (editorThemeLabel) {
    editorThemeLabel.textContent = themeLabelByName[nextTheme] || themeLabelByName[DEFAULT_EDITOR_THEME];
  }

  saveThemeName(nextTheme);

  view.dispatch({
    effects: [
      themeCompartment.reconfigure(themeConfigByName[nextTheme].extension),
      syntaxCompartment.reconfigure(syntaxHighlighting(highlightByThemeName[nextTheme]))
    ]
  });

  const palette = themePaletteByName[nextTheme] || themePaletteByName[DEFAULT_EDITOR_THEME];
  view.dom.style.backgroundColor = palette.bg;
  view.dom.style.color = palette.fg;

  const gutters = view.dom.querySelector(".cm-gutters");
  if (gutters) {
    gutters.style.backgroundColor = palette.gutterBg;
    gutters.style.color = palette.gutterFg;
    gutters.style.borderRightColor = palette.gutterBorder;
  }
}

function getFileItems() {
  return Array.from(document.querySelectorAll(".file-item"));
}

function buildPreviewDoc(state) {
  const htmlContent = (currentContent.html || "").trim();
  const scssContent = (currentContent.scss || "").trim();
  const jsContent = (currentContent.javascript || "").trim();

  if (state.framework === "react") {
    const baseStyles = `
      body { margin: 0; padding: 12px; font-family: "Inter", system-ui, sans-serif; color: #0f172a; }
      #root { min-height: 32px; }
      .kcm-preview-empty {
        padding: 12px;
        border: 1px dashed #cbd5e1;
        border-radius: 8px;
        background: #f8fafc;
        font-size: 12px;
        color: #64748b;
      }
      .kcm-preview-error {
        padding: 12px;
        border: 1px solid #fecaca;
        border-radius: 8px;
        background: #fef2f2;
        font-size: 12px;
        color: #b91c1c;
        white-space: pre-wrap;
      }
    `;
    const safeSource = JSON.stringify(jsContent);
    const safeStyles = JSON.stringify(scssContent);
    const hooksPrelude = `
      const {
        useState,
        useEffect,
        useRef,
        useMemo,
        useCallback,
        useLayoutEffect,
        useReducer,
        useContext
      } = React || {};
    `;
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${baseStyles}</style>
  </head>
  <body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js" onerror="window.__kcmReactLoadError = 'Failed to load React';"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" onerror="window.__kcmReactLoadError = 'Failed to load ReactDOM';"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js" onerror="window.__kcmReactLoadError = 'Failed to load Babel';"></script>
    <script>
      (function () {
        if (window.__kcmReactLoadError) {
          document.getElementById("root").innerHTML =
            '<div class="kcm-preview-error">' + window.__kcmReactLoadError + '</div>';
          return;
        }
        if (!window.React || !window.ReactDOM || !window.Babel) {
          document.getElementById("root").innerHTML =
            '<div class="kcm-preview-error">React runtime not available. Check network access to unpkg.com.</div>';
          return;
        }
        var source = ${safeSource} || "";
        var styleText = ${safeStyles} || "";
        if (styleText) {
          var style = document.createElement("style");
          style.textContent = styleText;
          document.head.appendChild(style);
        }
        if (!source.trim()) {
          document.getElementById("root").innerHTML =
            '<div class="kcm-preview-empty">No React source to preview.</div>';
          return;
        }
        try {
          var functionMatch = source.match(/export\\s+default\\s+function\\s+([A-Za-z0-9_]+)/);
          if (functionMatch && functionMatch[1]) {
            source = source.replace(/export\\s+default\\s+function\\s+([A-Za-z0-9_]+)/, 'function ' + functionMatch[1]);
            source += \"\\nwindow.__KCM_COMPONENT__ = \" + functionMatch[1] + \";\\n\";
          } else if (/export\\s+default\\s+\\(/.test(source) || /export\\s+default\\s+function\\s*\\(/.test(source)) {
            source = source.replace(/export\\s+default\\s+/, \"const __KCM_COMPONENT__ = \");
            source += \"\\nwindow.__KCM_COMPONENT__ = __KCM_COMPONENT__;\\n\";
          }

          source = source.replace(/^\\s*import[^;]*;?\\s*$/gm, \"\");
          source = ${JSON.stringify(hooksPrelude)} + \"\\n\" + source;

          var transformed = Babel.transform(source, { presets: [\"react\"] }).code;
          var renderFn = new Function(\"React\", \"ReactDOM\", transformed + \"\\nreturn window.__KCM_COMPONENT__;\");\n          var Component = renderFn(React, ReactDOM);
          if (!Component) {
            document.getElementById(\"root\").innerHTML =
              '<div class=\"kcm-preview-empty\">Unable to locate a default export.</div>';
            return;
          }
          var root = ReactDOM.createRoot(document.getElementById(\"root\"));
          root.render(React.createElement(Component));
        } catch (error) {
          document.getElementById(\"root\").innerHTML =
            '<div class=\"kcm-preview-error\">Preview error:\\n' + (error && error.message ? error.message : error) + '</div>';
        }
      })();
    </script>
  </body>
</html>`;
  }

  const hasHtml =
    htmlContent &&
    !/<!--\s*Missing/i.test(htmlContent) &&
    !/select a component/i.test(htmlContent);

  const bodyContent = hasHtml
    ? htmlContent
    : `<div class="kcm-preview-empty">No preview available for this component.</div>`;

  const baseStyles = `
    body { margin: 0; padding: 12px; font-family: "Inter", system-ui, sans-serif; color: #0f172a; }
    .kcm-preview-empty {
      padding: 12px;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      background: #f8fafc;
      font-size: 12px;
      color: #64748b;
    }
  `;

  const styleTag = `<style>${baseStyles}${scssContent}</style>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${styleTag}
  </head>
  <body>
    ${bodyContent}
  </body>
</html>`;
}

function updatePreviewFrame(state = activeComponentInfo) {
  if (!previewFrame) return;
  if (!state) {
    previewFrame.srcdoc = buildPreviewDoc({ framework: "vanilla" });
    return;
  }
  previewFrame.srcdoc = buildPreviewDoc(state);
}

function schedulePreviewUpdate() {
  if (!activeComponentInfo) return;
  if (previewUpdateTimer) {
    window.clearTimeout(previewUpdateTimer);
  }
  previewUpdateTimer = window.setTimeout(() => {
    updatePreviewFrame(activeComponentInfo);
  }, 200);
}

function renderComponentInfo(state = activeComponentInfo) {
  if (!rightSidebarRoot) return;

  const totalsSection = lineTotals
    ? `
      <section class="component-info component-info--totals">
        <h2 class="component-info__title">Project Totals</h2>
        <p class="component-info__meta"><strong>Lines:</strong> ${lineTotals.totalLines}</p>
        <p class="component-info__meta"><strong>Components:</strong> ${lineTotals.totalComponents}</p>
      </section>
    `
    : `
      <section class="component-info component-info--totals">
        <h2 class="component-info__title">Project Totals</h2>
        <p class="component-info__empty">Totals unavailable.</p>
      </section>
    `;

  if (!state) {
    rightSidebarRoot.innerHTML = `
      ${totalsSection}
      <section class="component-info">
        <h2 class="component-info__title">Component Info</h2>
        <p class="component-info__empty">Select a component file to view details.</p>
      </section>
    `;
    updatePreviewFrame(null);
    return;
  }

  const filesHtml = (state.files || [])
    .map((file) => {
      const lineText = typeof file.lines === "number" ? ` (${file.lines} lines)` : "";
      return `<li>${file.filename}${lineText}</li>`;
    })
    .join("");

  const totalLinesHtml = Number.isFinite(state.totalLines)
    ? `<p class="component-info__meta"><strong>Total lines:</strong> ${state.totalLines}</p>`
    : "";

  const activeFileHtml = state.activeFile
    ? `<p class="component-info__meta"><strong>Active file:</strong> ${state.activeFile}</p>`
    : "";
  const versionHtml = state.version
    ? `<p class="component-info__meta"><strong>Version:</strong> ${state.version}</p>`
    : "";
  const authorHtml = state.author
    ? `<p class="component-info__meta"><strong>Author:</strong> ${state.author}</p>`
    : "";
  const numberHtml = state.number
    ? `<p class="component-info__meta"><strong>Number:</strong> ${state.number}</p>`
    : "";

  const deleteActionHtml = `
    <div class="component-info__actions">
      <button
        type="button"
        class="component-info__delete-button"
        data-delete-component="true"
        data-framework="${state.framework}"
        data-component="${state.component}"
      >
        Delete Component
      </button>
    </div>
  `;

  rightSidebarRoot.innerHTML = `
    ${totalsSection}
    <section class="component-info">
      <h2 class="component-info__title">Component Info</h2>
      <p class="component-info__meta"><strong>Framework:</strong> ${state.framework}</p>
      <p class="component-info__meta"><strong>Component:</strong> ${state.component}</p>
      ${versionHtml}
      ${authorHtml}
      ${numberHtml}
      ${activeFileHtml}
      ${totalLinesHtml}
      <h3 class="component-info__subtitle">Files</h3>
      <ul class="component-info__files">${filesHtml}</ul>
      ${deleteActionHtml}
    </section>
  `;
  updatePreviewFrame(state);
}

async function refreshLineTotals() {
  try {
    const response = await fetch(`${API_BASE_URL}/components/line-count-total`);
    const body = await response.json();
    if (!response.ok || !body?.ok) throw new Error(body?.error || `Request failed (${response.status})`);
    lineTotals = {
      totalLines: Number(body.totalLines || 0),
      totalComponents: Number(body.totalComponents || 0)
    };
  } catch {
    lineTotals = null;
  }
  renderComponentInfo();
}

function createGeneratedContent(framework, component, metadata = {}) {
  const title = toTitleCase(component);
  const version = (metadata.version || "1.0.0").trim();
  const author = (metadata.author || "Unknown").trim();
  const number = (metadata.number || "N/A").trim();
  const htmlMeta = `<!-- ${framework}/${component} | version: ${version} | author: ${author} | number: ${number} -->`;
  const jsMeta = `// ${framework}/${component} | version: ${version} | author: ${author} | number: ${number}`;

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

function extractComponentMetadata(content = "") {
  const lines = content.split(/\r?\n/, 3);
  const headerLine = lines.find((line) => /version:\s*/i.test(line) && /author:\s*/i.test(line) && /number:\s*/i.test(line));
  if (!headerLine) return null;

  const versionMatch = headerLine.match(/version:\s*([^|]+)/i);
  const authorMatch = headerLine.match(/author:\s*([^|]+)/i);
  const numberMatch = headerLine.match(/number:\s*(.*?)(?:\s*-->|$)/i);

  return {
    version: (versionMatch?.[1] || "").trim(),
    author: (authorMatch?.[1] || "").trim(),
    number: (numberMatch?.[1] || "").trim()
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

  if (framework === "react") {
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
    headers: buildAuthHeaders({
      "Content-Type": "application/json"
    }),
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

async function deleteComponentOnApi(framework, component) {
  const response = await fetch(`${API_BASE_URL}/components/${framework}/${component}`, {
    method: "DELETE",
    headers: buildAuthHeaders()
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

async function getComponentInfoOnApi(framework, component) {
  const response = await fetch(`${API_BASE_URL}/components/${framework}/${component}/line-count`);

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

async function getComponentContentOnApi(framework, component) {
  const response = await fetch(`${API_BASE_URL}/components/${framework}/${component}/content`);

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || !body?.framework || !body?.component || !Array.isArray(body?.files)) {
    const reason = body?.error || `Request failed (${response.status})`;
    throw new Error(reason);
  }

  return body;
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
  void refreshLineTotals();
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

function pickContentByExtension(files, candidates) {
  if (!Array.isArray(files)) return "";
  for (const candidate of candidates) {
    const match = files.find((file) => file.filename && file.filename.endsWith(candidate));
    if (match && typeof match.content === "string") return match.content;
  }
  return "";
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

  try {
    const response = await getComponentContentOnApi(framework, component);
    const files = response.files || [];
    const htmlCandidates = framework === "react"
      ? [`${component}.jsx`, `${component}.tsx`, `${component}.js`]
      : [`${component}.html`];
    const jsCandidates = framework === "react"
      ? [`${component}.jsx`, `${component}.tsx`, `${component}.js`]
      : [`${component}.js`];
    const styleCandidates = framework === "react"
      ? [`${component}.scss`, `${component}.css`]
      : [`${component}.scss`, `${component}.css`];

    const html = pickContentByExtension(files, htmlCandidates);
    const javascript = pickContentByExtension(files, jsCandidates);
    const scss = pickContentByExtension(files, styleCandidates);

    if (html || javascript || scss) {
      currentContent = {
        html: html || `<!-- Missing ${htmlCandidates[0]} -->`,
        javascript: javascript || `// Missing ${jsCandidates[0]}`,
        scss: scss || `// Missing ${styleCandidates[0]}`
      };
      return;
    }
  } catch {
    // ignore and try file system fetch
  }

  // Files live in project root `components/`, while the UI is served from `client/`.
  // Preferred layout: components/<framework>/<component>/<component>.<ext>
  // Legacy fallback: components/<framework>/<component>.<ext>
  const nestedBaseA = `../components/${framework}/${component}/${component}`;
  const nestedBaseB = `components/${framework}/${component}/${component}`;
  const legacyBaseA = `../components/${framework}/${component}`;
  const legacyBaseB = `components/${framework}/${component}`;

  const fileMap = framework === "react"
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
  const theme = new Compartment();
  const syntaxTheme = new Compartment();
  activeTheme = getStoredThemeName();

  const state = EditorState.create({
    doc: currentContent[activeLang],
    extensions: [
      lineNumbers(),
      highlightActiveLineGutter(),
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (!update.docChanged) return;
        currentContent[activeLang] = update.state.doc.toString();
        schedulePreviewUpdate();
      }),
      syntaxTheme.of(syntaxHighlighting(highlightByThemeName[activeTheme])),
      theme.of(themeConfigByName[activeTheme].extension),
      language.of(extensionByLang[activeLang])
    ]
  });

  const view = new EditorView({
    state,
    parent: editorRoot
  });
  void syncSidebarFromApi().catch(() => {});
  void refreshLineTotals();
  renderComponentInfo();

  if (editorThemeLabel) {
    editorThemeLabel.textContent = themeLabelByName[activeTheme] || themeLabelByName[DEFAULT_EDITOR_THEME];
  }
  applyEditorTheme(view, theme, syntaxTheme, activeTheme);

  if (editorThemePicker && editorThemeButton && editorThemeMenu) {
    editorThemeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (editorThemeMenu.hidden) openThemeMenu();
      else closeThemeMenu();
    });

    editorThemeMenu.addEventListener("click", (event) => {
      const option = event.target.closest("[data-theme-value]");
      if (!option) return;

      const nextTheme = option.dataset.themeValue || "";
      applyEditorTheme(view, theme, syntaxTheme, nextTheme);
      closeThemeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!editorThemePicker.contains(event.target)) closeThemeMenu();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeThemeMenu();
    });
  }

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
      const summary = event.target.closest(".component-tree__summary");
      if (summary) {
        const details = summary.closest(".component-tree");
        const firstFile = details ? details.querySelector(".file-item") : null;
        if (firstFile) {
          event.preventDefault();
          firstFile.click();
        }
        return;
      }

      const link = event.target.closest(".file-item");
      if (!link) return;

      event.preventDefault();
      setActiveFile(link);

      const framework = link.dataset.framework;
      const component = link.dataset.component;
      const nextLang = link.dataset.lang || "html";
      const fileRole = link.dataset.fileRole || "main";
      const activeFile = link.textContent || "";

      await loadComponent(framework, component, fileRole);
      const metadata =
        extractComponentMetadata(currentContent.html) ||
        extractComponentMetadata(currentContent.javascript) ||
        null;

      setActiveTab(nextLang);
      view.dispatch({ effects: language.reconfigure(extensionByLang[nextLang]) });
      replaceDoc(view, currentContent[nextLang]);

      try {
        const info = await getComponentInfoOnApi(framework, component);
        activeComponentInfo = {
          framework: info.framework,
          component: info.component,
          files: info.files,
          totalLines: info.totalLines,
          version: metadata?.version || null,
          author: metadata?.author || null,
          number: metadata?.number || null,
          activeFile
        };
        renderComponentInfo();
      } catch {
        const files = getFileItems()
          .filter((item) => item.dataset.framework === framework && item.dataset.component === component)
          .map((item) => ({ filename: item.textContent || "", lines: null }));
        activeComponentInfo = {
          framework,
          component,
          files,
          totalLines: null,
          version: metadata?.version || null,
          author: metadata?.author || null,
          number: metadata?.number || null,
          activeFile
        };
        renderComponentInfo();
      }
    });
  }

  if (rightSidebarRoot) {
    rightSidebarRoot.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-delete-component]");
      if (!button) return;

      const framework = button.dataset.framework;
      const component = button.dataset.component;
      if (!framework || !component) return;

      const confirmed = window.confirm(`Delete component "${component}" from ${framework}?`);
      if (!confirmed) return;

      try {
        await deleteComponentOnApi(framework, component);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        window.alert(`Failed to delete component: ${message}`);
        return;
      }

      generatedComponents.delete(componentKey(framework, component));
      activeComponentInfo = null;
      currentContent = { ...emptyContent };
      setActiveFile(null);
      replaceDoc(view, currentContent[activeLang]);

      await syncSidebarFromApi().catch(() => {});
      await refreshLineTotals();
      renderComponentInfo();
    });
  }

  if (previewRefreshButton) {
    previewRefreshButton.addEventListener("click", () => {
      updatePreviewFrame(activeComponentInfo);
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
        void refreshLineTotals();
      }

      const firstFile = document.querySelector(`.file-item[data-framework="${framework}"][data-component="${component}"]`);
      if (firstFile) firstFile.click();

      closeAddComponentModal();
    });
  }
}
