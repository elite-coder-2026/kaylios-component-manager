const DATA_SCRIPT_ID = "portfolioData";
const THEME_KEY = "portfolio.theme";

function getData() {
  const el = document.getElementById(DATA_SCRIPT_ID);
  if (!el) throw new Error(`Missing #${DATA_SCRIPT_ID} data script.`);
  return JSON.parse(el.textContent || "{}");
}

function getInitials(text) {
  const cleaned = String(text || "").trim();
  if (!cleaned) return "PR";
  const parts = cleaned.split(/\s+/).slice(0, 2);
  const letters = parts.map((p) => p[0]).join("");
  return letters.toUpperCase();
}

function hashToHue(input) {
  const str = String(input || "");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % 360;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
}

function setHref(id, href) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!href || href === "#") {
    el.setAttribute("href", "#");
    el.setAttribute("aria-disabled", "true");
    el.addEventListener("click", (event) => event.preventDefault(), { passive: false });
    el.style.opacity = "0.7";
    return;
  }
  el.setAttribute("href", href);
}

function renderProjects(projects) {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  grid.innerHTML = "";
  for (const project of projects || []) {
    const card = document.createElement("article");
    card.className = "card project";

    const preview = document.createElement("div");
    preview.className = "project-preview";
    if (project.image) {
      const img = document.createElement("img");
      img.src = project.image;
      img.alt = project.imageAlt || `${project.title || "Project"} preview`;
      img.loading = "lazy";
      preview.appendChild(img);
    } else {
      preview.classList.add("project-preview--placeholder");
      const hue = hashToHue(project.title || "");
      preview.style.background = `linear-gradient(135deg, hsl(${hue} 85% 55% / 0.25), hsl(${(hue + 55) % 360} 85% 55% / 0.18))`;
      const label = document.createElement("span");
      label.className = "project-preview__text";
      label.textContent = getInitials(project.title);
      preview.appendChild(label);
    }

    const titleRow = document.createElement("div");
    titleRow.className = "project-title";

    const h3 = document.createElement("h3");
    h3.textContent = project.title || "Project";

    const cta = document.createElement("a");
    cta.className = "link";
    cta.textContent = project.cta || "Open";
    cta.href = project.href || "#";
    cta.rel = "noreferrer";
    cta.target = project.href && project.href !== "#" ? "_blank" : "";
    if (!project.href || project.href === "#") {
      cta.setAttribute("aria-disabled", "true");
      cta.addEventListener("click", (event) => event.preventDefault(), { passive: false });
      cta.style.opacity = "0.7";
    }

    titleRow.append(h3, cta);

    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = project.description || "";

    const tags = document.createElement("div");
    tags.className = "tag-row";
    for (const tag of project.tags || []) {
      const chip = document.createElement("span");
      chip.className = "tag";
      chip.textContent = tag;
      tags.appendChild(chip);
    }

    card.append(preview, titleRow, desc, tags);
    grid.appendChild(card);
  }
}

function renderSkills(groups) {
  const grid = document.getElementById("skillsGrid");
  if (!grid) return;

  grid.innerHTML = "";
  for (const group of groups || []) {
    const card = document.createElement("section");
    card.className = "card skill-group";

    const h3 = document.createElement("h3");
    h3.textContent = group.group || "Skills";

    const items = document.createElement("div");
    items.className = "skill-items";
    for (const item of group.items || []) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = item;
      items.appendChild(chip);
    }

    card.append(h3, items);
    grid.appendChild(card);
  }
}

function renderList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  for (const item of items || []) {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  }
}

function renderPills(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  for (const item of items || []) {
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.textContent = item;
    el.appendChild(pill);
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
}

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

function initThemeToggle() {
  const button = document.getElementById("themeToggle");
  if (!button) return;

  let theme = getPreferredTheme();
  applyTheme(theme);

  button.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  });
}

function initCopyEmail(email) {
  const button = document.getElementById("copyEmail");
  const status = document.getElementById("copyStatus");
  if (!button || !status) return;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = "Copied to clipboard.";
    } catch {
      status.textContent = "Copy failed. You can select the email above.";
    }
    setTimeout(() => {
      status.textContent = "";
    }, 2000);
  });
}

function initContactForm(email) {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fd = new FormData(form);

    const name = String(fd.get("name") || "").trim();
    const from = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const subject = encodeURIComponent(`Portfolio inquiry from ${name || "someone"}`);
    const body = encodeURIComponent(`From: ${name}\nEmail: ${from}\n\n${message}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });
}

function main() {
  const data = getData();

  setText("brandName", data.name || "Your Name");
  setText("heroName", data.name || "Your Name");
  setText("footerName", data.name || "Your Name");
  setText("heroRole", data.role || "modern web experiences");
  setText("heroBio", data.bio || "");
  setText("location", data.location || "");

  const email = data.email || "you@example.com";
  setText("emailLink", email);
  setHref("emailLink", `mailto:${email}`);
  setHref("emailButton", `mailto:${email}`);

  setHref("githubLink", data.links?.github || "#");
  setHref("linkedinLink", data.links?.linkedin || "#");
  setHref("resumeLink", data.links?.resume || "#");

  renderList("highlights", data.highlights || []);
  renderPills("focusPills", data.focus || []);
  renderProjects(data.projects || []);
  renderSkills(data.skills || []);

  setText("year", String(new Date().getFullYear()));

  initThemeToggle();
  initCopyEmail(email);
  initContactForm(email);
}

main();
