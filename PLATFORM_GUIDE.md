# AI/ML Fundamentals — Platform Guide

Complete documentation for the mentorship course platform: what it is, how every file fits together, how to run it, how to edit content, and how every feature is wired up.

---

## 1. What this project is

This is the **course website for the UN AI/ML Mentorship Program** — a 16-week, 8-module curriculum for university students in Tashkent, Uzbekistan. The program delivers:

- **8 modules**, **47 classes total** (Module 1 has 5 classes; Modules 2-8 have 6 classes each).
- Lecture content, embedded YouTube tutorials, click-to-reveal quizzes, and a research-driven lab per module.
- A **Telegram guide bot** (`@lossfunction_bot`) that answers concept questions using RAG over the course materials.

The website is a **single-page client-side application** written in vanilla HTML, CSS, and JavaScript. No build step, no framework, no server required for production. Content lives in per-module JavaScript files that are **lazy-loaded** only when a student opens that module.

### Design principles

- **Zero build tooling** — edit a `.js` file, refresh, see changes.
- **Works offline or on any static host** — no backend dependency.
- **Iconic AI aesthetic** — minimalist, high-contrast, CSS-variable-driven theme with Light / Dark / forced-Midnight-for-Presentation modes.
- **Progress persists** in the browser (localStorage), so students don't lose completion badges between sessions.

---

## 2. Top-level project layout

```
/Users/muje/Desktop/un_aiml/                    ← project root
├── course_website/                             ← the deployed site (everything below this is what students see)
├── course_ready/                               ← source lecture content (docx, PDFs, Jupyter notebooks)
│   ├── module_1/  … module_8/
│   │   ├── class_1/  class_2/  …               ← per-class lab.txt, notes.md, etc
│   │   ├── content.docx                        ← full lecture doc for the module
│   │   ├── resources.pdf                       ← resource list and reading guide
│   │   └── m1_quick_win_demo.ipynb             ← hands-on notebook
├── final_course/                               ← rendered/packaged version of course_ready for distribution
├── student_bot/                                ← Telegram guide bot (Python)
│   ├── bot.py                                  ← Telegram conversation handler
│   ├── rag.py                                  ← hybrid retrieval (FAISS + BM25) + LLM guide prompt
│   ├── ingest.py                               ← builds FAISS index from course materials
│   ├── chunks.pkl                              ← serialized text chunks used at retrieval time
│   ├── faiss_db/                               ← FAISS vector store files
│   ├── requirements.txt
│   └── .env                                    ← OpenAI + Telegram tokens (not in git)
├── module_1/ … module_8/                       ← legacy per-module content dirs (raw markdown)
├── share_ready/                                ← zipped distribution packages for students
├── source_files/                               ← original docx + pptx originals
├── notebooks/                                  ← Colab-ready hands-on notebooks
├── all_assignments/                            ← per-class assignment PDFs
├── chunks/                                     ← slide chunks for Gamma AI generation
├── curriculum_map.md, curriculum_revised.md    ← curriculum planning docs
├── tracker.html                                ← standalone progress tracker used during course dev
└── build_pptx.py, split_slides.py, etc.        ← one-off Python scripts used while authoring
```

Only `course_website/` is what a student visits in a browser. Everything else is behind-the-scenes authoring material.

---

## 3. The website (course_website/) — file-by-file

```
course_website/
├── index.html              ← markup, full CSS, theme init script (1213 lines)
├── app.js                  ← all runtime logic — router, renderers, theme, sidebar, search, presentation, progress (1127 lines)
├── courseData.js           ← module metadata only (titles, class lists, keywords, status) — small and always loaded (147 lines)
├── data/                   ← per-module content, lazy-loaded on demand
│   ├── module1.js          ← Module 1 content (5 classes, 80 KB)
│   ├── module2.js          ← Module 2 content (6 classes, 28 KB)
│   ├── module3.js          ← 6 classes, 24 KB
│   ├── module4.js          ← 6 classes, 24 KB
│   ├── module5.js          ← 6 classes, 25 KB
│   ├── module6.js          ← 6 classes, 27 KB
│   ├── module7.js          ← 6 classes, 26 KB
│   └── module8.js          ← 6 classes, 28 KB
├── assets/                 ← static files (images, docs, icons) — referenced via asset() helper
│   ├── img/                ← photos, diagrams, screenshots (empty — add as needed)
│   ├── docs/                ← PDFs, slide decks, handouts
│   └── icons/               ← SVG/PNG icons
└── PLATFORM_GUIDE.md       ← this file
```

### 3.1 `index.html` — 1213 lines

One HTML document, three concerns:

1. **`<head>`**
   - Loads Bricolage Grotesque (variable) + JetBrains Mono from Google Fonts.
   - **Theme init script** (inline, blocking): reads `localStorage['aiml-theme']`, falls back to `prefers-color-scheme: dark`, sets `data-theme="dark"` or `"light"` on `<html>` **before** first paint. Prevents the white-flash on dark-mode reload.
   - Massive `<style>` block containing the entire visual system.

2. **`<body>`**
   - `<nav class="navbar">` — hamburger, brand, search box, breadcrumb, theme toggle, presentation toggle.
   - `<aside id="sidebar">` — left drawer with module tree (filled by JS).
   - `<div id="sidebar-overlay">` — dimming scrim behind the sidebar on mobile.
   - `<div class="main"><div class="container" id="app-container"></div></div>` — **the only element whose innerHTML changes** during navigation. Everything rendered by `app.js` goes here.
   - `<button id="present-exit">` — floating × shown only in presentation mode.

3. **Script tags at end of body** (order matters):
   ```html
   <script src="courseData.js"></script>      ← sets global COURSE_DATA with metadata
   <script src="app.js"></script>             ← wires everything up, calls onReady()
   ```

### 3.2 `courseData.js` — 147 lines

A single JavaScript file declaring one constant:

```js
const COURSE_DATA = {
  courseTitle: "AI/ML Fundamentals",
  courseSubtitle: "From zero to building real ML projects in 16 weeks",
  mentors: ["Saidazam Saidov", "Ergashbaev Durbek"],
  botLink: "https://t.me/lossfunction_bot",
  modules: [ … 8 module metadata objects … ],
  classContent: {}   // EMPTY — populated at runtime by data/moduleN.js files
};
```

Each module object has:
```js
{
  id: 2,
  title: "Python and Data Foundations",
  classes: 6,                                  ← count for display
  weeks: "3-4",
  status: "available",                         ← "available" | "soon"
  description: "…",
  classList: [
    { id: 1, title: "Python Basics", desc: "…", status: "available",
      keywords: [ "python", "variables", … ] },
    …
  ]
}
```

**Why this split?** This file is ~10 KB and loads on every page visit so the home page and module cards can render instantly. The heavy per-class content lives in separate files that are only fetched when that module is opened.

### 3.3 `data/moduleN.js` files — lazy-loaded content

Each module file is an **IIFE** (Immediately Invoked Function Expression) with identical shape:

```js
(function () {
  if (typeof COURSE_DATA === 'undefined') {
    console.error('moduleN.js: COURSE_DATA not found. Load courseData.js first.');
    return;
  }

  const MODULE_N_CONTENT = {
    "N-1": {
      title: "Class display title",
      subtitle: "Module N, Class 1 — short summary",
      sections: [ …section objects… ]
    },
    "N-2": { … },
    …
  };

  Object.assign(COURSE_DATA.classContent, MODULE_N_CONTENT);
  COURSE_DATA._loadedModules = COURSE_DATA._loadedModules || {};
  COURSE_DATA._loadedModules[N] = true;
})();
```

When `loadModule(N)` (in `app.js`) injects `<script src="data/moduleN.js">` into the DOM, the IIFE fires and writes its classes into `COURSE_DATA.classContent`. The `_loadedModules` flag tells `isModuleLoaded()` not to re-fetch.

**Section object shape** (what appears in `sections: [ … ]`):

```js
{
  icon: "🐍",                           // emoji glyph
  title: "Why Python for ML?",
  video: "https://youtube.com/…",       // OPTIONAL — renders as clickable card
  videoTitle: "freeCodeCamp — Python",  // OPTIONAL — video subtitle
  content: `…raw HTML string…`          // template literal, allowed HTML classes below
}
```

**Utility CSS classes usable inside `content`:**

| Class | Purpose |
|---|---|
| `.info-box` | Blue callout — "note," "heads up" |
| `.example-box` | Green callout — code example |
| `.case-study` | Red callout — real-world scenario |
| `.discussion-box` | Blue tinted — discussion prompts |
| `.scenario-card` | Lab scenario card |
| `.principle-grid` + `.principle-card` | Grid of concept cards |
| `.tool-grid` + `.tool-card` | Grid of clickable tool links |
| `.timeline` + `.timeline-item` | Vertical timeline |
| `.quiz-item` + `.quiz-q` + `.quiz-options` + `.quiz-reveal` + `.quiz-answer` | Quiz row — progress tracker counts `.quiz-item` for the Completed badge |

**⚠️ Quiz rule:** `.quiz-reveal` buttons must **not** have inline `onclick` attributes. Clicks are handled via event delegation in `app.js`. Any leftover inline handlers are stripped at render time by a regex.

### 3.4 `app.js` — 1127 lines, organized into sections

```
1.  ASSET PATHS            — asset('img' | 'docs' | 'icons', filename) helper
2.  ROUTE PARSING          — parseRoute() reads window.location.hash → {page, moduleId, classId}
3.  DYNAMIC MODULE LOADING — loadModule(N) injects <script src="data/moduleN.js">
4.  MAIN RENDER FUNCTION   — async renderContent(), shows spinner while a module loads
5.  VIEW: HOME             — renderHome() builds module-card grid from COURSE_DATA.modules
6.  VIEW: MODULE           — renderModule(mod) builds class-card list for one module
7.  VIEW: CLASS            — renderClass(mod, cls) builds a page from sections[]
8.  CLASS NAVIGATION       — renderClassNav() with cross-module prev/next fallback
9.  FOOTER / QUIZ TOGGLE   — renderFooter(), historical toggleAnswer (replaced by delegation)
10. PROGRESS TRACKER       — load/save/mark, countQuizzesInClass, renderProgressBar, restoreQuizProgress
11. EVENT DELEGATION       — one click listener on #app-container handles .section-header + .quiz-reveal
12. THEME TOGGLE           — light/dark flip + localStorage persist
13. PRESENTATION MODE      — vertical scroll deck, focus fade, keyboard nav
14. SEARCH                 — searchClasses() over title/desc/keywords across all 47 classes
15. SIDEBAR                — renderSidebar() + expand/collapse + active class highlight
16. EVENT LISTENERS        — hashchange → onRender, DOMContentLoaded → onReady
```

---

## 4. How a page load flows (step by step)

1. **Browser parses `index.html`**.
2. **Inline theme script in `<head>` fires** — sets `data-theme` on `<html>` from localStorage or OS preference. No white-flash.
3. **CSS applies** — navbar, hidden sidebar, empty `#app-container`.
4. **`courseData.js` loads** — creates global `COURSE_DATA` with module metadata.
5. **`app.js` loads** — defines every function. On `DOMContentLoaded` it calls `onReady()`.
6. **`onReady()` runs:**
   - `attachThemeToggle()` — wires the sun/moon button.
   - `attachPresentationToggle()` — wires the monitor button + exit × button.
   - `attachPresentationKeyboard()` — single keydown listener for Space/Arrows/Esc.
   - `attachSearchHandlers()` — wires search input (debounced), keyboard nav within dropdown, outside-click close.
   - `initSidebar()` — builds `#sidebar-nav` tree from `COURSE_DATA.modules`, applies saved open/closed preference.
   - `onRender()` — runs the initial render for the current hash.
7. **`onRender()` → `renderContent()`** — reads hash:
   - `#/` → `renderHome()` → `#app-container.innerHTML = <module cards>`.
   - `#/module/N` → `loadModule(N)` if not loaded, show spinner, then `renderModule()`.
   - `#/module/N/class/C` → same pattern, then `renderClass()`.
8. **After render**: `attachDelegatedListener()` (idempotent — guarded with `container._delegated`), `restoreQuizProgress()` (re-opens previously revealed answers), `updateSidebarActive()` (highlights current class in sidebar).
9. **User clicks a class card** → `onclick="navigate('/module/N/class/C')"` → `window.location.hash = …` → browser fires `hashchange` → `onRender()` loop repeats.

---

## 5. Features (every toggle, shortcut, and state)

### 5.1 Theme system

- Button: sun/moon icon in navbar.
- Variables: `--bg-color`, `--surface`, `--text-main`, `--text-heading`, `--text-muted`, `--accent-color`, `--border`, plus shadows/radius/transition tokens. Backward-compat aliases (`--bg`, `--card`, `--muted`, etc.) map to the new tokens so older content classes keep working.
- **Light** (`:root` default): `#f8fafc` bg, `#0f172a` text, `#6366f1` indigo accent.
- **Dark** (`[data-theme='dark']`): `#0a0a0f` bg with radial-gradient "mesh" overlay, `#f8fafc` text, `#818cf8` brighter accent. Subtle SVG noise grain at 5% opacity.
- Persisted in `localStorage['aiml-theme']`.

### 5.2 Sidebar

- **Button:** hamburger icon (leftmost in navbar).
- **On desktop (≥1024px):** opens to the left, pushes main content right by 288px. Both visible.
- **On mobile (<1024px):** overlays content with a blurred black scrim. Click scrim or press Esc to close.
- **Module tree:** click a module header → expand/collapse its classes. Auto-expands the module you're currently viewing. Current class gets accent background + left border.
- **Locked modules** (status `"soon"`): rendered at 50% opacity, don't expand, class links are non-clickable.
- Persisted in `localStorage['aiml-sidebar']` as `"open"` or `"closed"`.

### 5.3 Search

- **Box** in navbar with 80ms debounce on input.
- **Haystack per class**: class title + desc + keywords + module title + description, all lowercased.
- **Scoring:** title matches weight 10, keyword matches 5, desc matches 3, module-level match 1. Top 12 results shown.
- **Dropdown:** click any row to navigate. Keyboard: ↑/↓ to move, Enter to open, Esc to clear. Outside-click closes.
- **Highlights:** matching substrings wrapped in `<mark>` with accent color.

### 5.4 Progress tracker

- **Storage key:** `localStorage['aiml-progress-v1']`.
- **Shape:** `{ "M-C": { quizzes: { "0": true, "1": true, … }, completed: bool } }`.
- **Detection:** regex counts `class="quiz-item"` inside each class's section HTML → that's the target. When a student reveals all of them, `completed: true` flips on.
- **On render:** `restoreQuizProgress()` re-opens previously revealed answers and the progress bar reflects `X / N quizzes`.
- **Badge:** on home page module cards (`3 / 5 completed`) and on class cards (`Completed` badge with a 2.4s glow pulse animation).
- **Important:** localStorage on `file://` URLs is blocked by Chrome. Serve over HTTP (see §7) for progress to persist.

### 5.5 Presentation Mode

- **Button:** monitor icon in navbar. Click → adds `body.presentation-mode`. Session-scoped (not persisted — next reload starts normal).
- **Layout:** vertical scroll deck. Each `.section` and the `.class-header` become full-viewport slides with `scroll-snap-type: y mandatory; min-height: 100vh`. The section closest to the top-30% gets `.is-focus` (full brightness); others fade to 22% opacity with 0.4px blur.
- **Midnight theme forced** (overrides light/dark): `#000` bg, `#fff` text, `#a5b4fc` accent. Projector-proof.
- **Hidden:** navbar, sidebar, overlay, footer, search, breadcrumb, class-nav, resources section, progress bar.
- **Visible:** content + floating × exit button (top-right).
- **Typography:** 80px titles, 52px sub-heads, 40px body.
- **Keyboard:**
  - `→` / `Space` / `PageDown` → next section (crosses classes at boundaries).
  - `←` / `Backspace` / `PageUp` → previous section.
  - `Esc` → exit.

### 5.6 Dynamic module loading

- **`loadModule(moduleId)`** checks `COURSE_DATA._loadedModules[id]`. If loaded, returns a resolved Promise. Otherwise injects `<script src="data/moduleN.js">` and waits for `onload`.
- **Cache:** `_moduleLoadPromises[id]` stores in-flight promises so rapid nav clicks don't fetch twice.
- **Spinner** (`renderLoading(msg)`) shows `Loading: <class title>...` while the module fetches.
- **Error fallback** (`renderLoadError(id)`) shows if the script 404s.
- **Race guard** inside `renderContent()`: if the user navigates away during an `await loadModule()`, the stale continuation bails via `parseRoute()` check before overwriting `#app-container`.

### 5.7 Cross-module navigation

`renderClassNav()` at the bottom of every class page:

- **Previous**: try previous class in same module; fall back to last class of previous available module.
- **Next**: try next class in same module; fall back to first class of next available module.
- So at Module 1 Class 5, the "Next" button jumps to `#/module/2/class/1`. At Module 8 Class 6, "Next" falls through to the module overview (no Module 9).

### 5.8 Event delegation

One `click` listener on `#app-container` handles both:
- `.section-header` → toggle `.section.open` for collapse/expand (only relevant in non-presentation mode).
- `.quiz-reveal` → toggle `.quiz-answer.visible` + update button text + call `markQuizRevealed()` + update progress bar in place.

Attached once via `container._delegated = true` guard so repeated renders don't stack listeners.

### 5.9 Quiz slide-down animation

`.quiz-answer` uses `max-height` + `opacity` + `translateY` transitions (not `display: none/block`). When `.visible` is added, it slides down in 0.5s with `cubic-bezier(0.22, 1, 0.36, 1)` easing. In presentation mode, the max-height budget expands to 1800px to fit larger content.

### 5.10 Assets helper

`asset('img', 'foo.png')` → `"assets/img/foo.png"`.
`asset('docs', 'slides.pdf')` → `"assets/docs/slides.pdf"`.
`asset('icons', 'bot.svg')` → `"assets/icons/bot.svg"`.

One source of truth for static file paths — rename or move the `assets/` folder and only update `app.js`'s `ASSETS` map.

---

## 6. Editing content

### 6.1 Update module metadata (titles, status, keywords)

Edit **`/Users/muje/Desktop/un_aiml/course_website/courseData.js`**. Change the `classList[]` entry for the class you want:

```js
{ id: 2, title: "Python Basics", desc: "Variables, data types, control flow",
  status: "available",                         ← "soon" to lock, "available" to release
  keywords: ["python", "variables", "loops"] }  ← used by search scoring
```

Module-level `status` also needs flipping for the module card to be clickable on the home page.

### 6.2 Add or edit class content

Edit **`/Users/muje/Desktop/un_aiml/course_website/data/moduleN.js`**. Find the `"N-C"` entry and update its `sections: [ … ]` array. See §3.3 for the section object shape and utility classes.

```js
"4-1": {
  title: "Linear Regression",
  subtitle: "Module 4, Class 1 — Predicting continuous values",
  sections: [
    {
      icon: "📏",
      title: "Your New Section",
      content: `<p>Lecture prose…</p>
      <div class="info-box"><strong>Heads up:</strong> …</div>`
    },
    // Add a video section:
    {
      icon: "📺",
      title: "Watch: StatQuest Linear Regression",
      video: "https://www.youtube.com/watch?v=nk2CQITm_eo",
      videoTitle: "StatQuest — Linear Regression",
      content: `<p>Optional framing before/after the video.</p>`
    },
    // Add a quiz section:
    {
      icon: "📋",
      title: "Quick Check",
      content: `
<div class="quiz-item">
<div class="quiz-q">1. Your question?</div>
<ol class="quiz-options" type="A">
<li>Option A</li><li>Option B</li><li>Option C</li><li>Option D</li>
</ol>
<button class="quiz-reveal">Show Answer</button>
<div class="quiz-answer"><strong>B.</strong> Explanation here.</div>
</div>
      `
    }
  ]
}
```

Reload the page — the lazy loader re-fetches on next navigation.

### 6.3 Adding a new class

1. Add a new object to `classList[]` in `courseData.js` with a unique `id`.
2. Bump `classes: N+1` for the module.
3. Add the `"N-newId"` entry to `MODULE_N_CONTENT` in `data/moduleN.js`.

### 6.4 Assets

Drop images in `assets/img/`, PDFs in `assets/docs/`. Reference them in content strings as:
```html
<img src="assets/img/module4-chart.png" />
<a href="assets/docs/module4-slides.pdf">Download slides</a>
```
Or via the `asset()` helper when building strings in JavaScript.

---

## 7. Running locally

**Serve over HTTP**, not `file://`, so localStorage (progress, theme, sidebar prefs) and dynamic `<script>` loading work reliably:

```bash
cd /Users/muje/Desktop/un_aiml/course_website
python3 -m http.server 8000
```

Open **http://localhost:8000** in Chrome/Safari/Firefox.

**Why not double-click `index.html`?** Chrome blocks localStorage on `file://` by default. Progress tracker silently returns `{}` on every read. Theme still kind of works but won't persist. HTTP fixes it.

---

## 8. localStorage keys reference

| Key | Written by | Shape | Purpose |
|---|---|---|---|
| `aiml-theme` | `applyTheme()` | `"light"` or `"dark"` | Theme preference |
| `aiml-progress-v1` | `saveProgress()` | `{ "M-C": { quizzes: {…}, completed: bool } }` | Quiz reveals + Completed badges |
| `aiml-sidebar` | `saveSidebarPref()` | `"open"` or `"closed"` | Sidebar drawer state |

To **reset progress**, open browser devtools → Application → Local Storage → delete `aiml-progress-v1`.

---

## 9. Student bot (student_bot/)

Separate Python app, deployed on Oracle Cloud Free Tier (VM IP: `140.238.63.252`). Not part of the website but referenced by it (the footer and Module 1 Class 5 link to `@lossfunction_bot`).

```
student_bot/
├── bot.py              ← python-telegram-bot ConversationHandler, menu navigation, module/class selection
├── rag.py              ← hybrid retrieval: FAISS vector + BM25 keyword with Reciprocal Rank Fusion
│                        + question rewriting, programmatic video matcher, GUIDE_PROMPT (B2 English)
├── ingest.py           ← processes course materials, builds FAISS index
├── chunks.pkl          ← serialized text chunks (loaded at runtime)
├── faiss_db/           ← FAISS vector store
├── requirements.txt    ← python-telegram-bot==21.3, langchain, faiss-cpu, openai, rank-bm25
└── .env                ← OPENAI_API_KEY, TELEGRAM_BOT_TOKEN (not in git)
```

**How it works:** student sends a message → bot retrieves top-K course chunks via FAISS + BM25 → passes to GPT-4o-mini with a **guide prompt** (never gives answers, only hints and references to which class explains the concept).

**Deployment:** scp files to Oracle VM, `nohup python3 bot.py &`.

---

## 10. Extending the platform

### 10.1 Add a new module (if the curriculum expands)

1. Add a module object (id: 9) to `COURSE_DATA.modules` in `courseData.js`.
2. Create `data/module9.js` following the IIFE pattern in §3.3.
3. That's it — `loadModule(9)` already handles any numeric ID.

### 10.2 Add a new utility callout class

1. Define a CSS rule in `index.html` with color tokens (e.g., `.tip-box` using `--info-soft` and `--accent-color`).
2. Reference `<div class="tip-box">…</div>` in any `content` template literal.

### 10.3 Add a new visual theme

1. Add a new `[data-theme='twilight']` block in `index.html` overriding the token variables.
2. Update the theme toggle in `app.js` to cycle through or add a selector.

### 10.4 Add a new interactive component

The existing quiz reveal pattern uses HTML classes + event delegation in `app.js:attachDelegatedListener`. To add (for example) numeric-answer challenges:

1. Design HTML: `<div class="numeric-challenge"><input …><button class="check">…</button><div class="feedback"></div></div>`.
2. Extend the delegated click listener in `app.js` to match `.check`, read the input value, compare against a `data-answer` attribute, show feedback.
3. Author exercises inside `content` strings in `data/moduleN.js`.

---

## 11. File-by-file quick reference card

| Path | Purpose | Edit when |
|---|---|---|
| `course_website/index.html` | HTML skeleton + all CSS | Theme tweaks, new UI components, navbar changes |
| `course_website/app.js` | All runtime logic | New features, router tweaks, search scoring |
| `course_website/courseData.js` | Module metadata | Launching a module, renaming classes, adding keywords |
| `course_website/data/moduleN.js` | Per-module class content | Writing/editing lecture material |
| `course_website/assets/img/` | Images | Adding diagrams/screenshots |
| `course_website/assets/docs/` | PDFs, slide decks | Distributing handouts |
| `course_website/PLATFORM_GUIDE.md` | This file | Update as the platform evolves |
| `course_ready/module_N/` | Source lecture docs | Authoring (feeds into the bot's knowledge base) |
| `student_bot/rag.py` | Retrieval + guide prompt | Tuning bot tone or retrieval quality |
| `student_bot/ingest.py` | Index builder | After updating course materials, re-ingest |

---

## 12. Conventions and gotchas

- **No build step.** Vanilla JS, vanilla HTML, vanilla CSS. Any modern browser runs it.
- **`const COURSE_DATA`** is declared in `courseData.js` as a classic-script global. It's NOT on `window.COURSE_DATA` in strict-mode/module contexts, but any classic `<script>` loaded in the same document can reference it — including the IIFEs in `data/moduleN.js`.
- **Template literals in content strings** — backticks. If your prose contains a literal backtick, escape it: `\``.
- **No inline `onclick="toggleAnswer(this)"`** on quiz-reveal buttons. Event delegation handles clicks. Legacy inline handlers from earlier drafts are stripped at render time by a regex in `renderClass()`.
- **Presentation mode is session-scoped** (not persisted). A reload always starts in normal mode.
- **Sidebar default** is open on desktop, closed on mobile — explicit user choice overrides defaults thereafter.

---

## 13. The platform at a glance

| Metric | Value |
|---|---|
| Total classes | 47 (5 + 6×7) |
| Total quiz items | ~221 (5 per class in M2-M8, plus M1's 11) |
| YouTube video cards | 39 (19 in M1, 20 across M2-M8) |
| Total site size | ~310 KB (index 44 KB + app 40 KB + courseData 10 KB + 8 × ~25-80 KB module files) |
| Initial download | ~95 KB (index + courseData + app — module files load on demand) |
| Dependencies | Three.js r160, GSAP 3, Bricolage Grotesque + JetBrains Mono fonts (all CDN) |
| Supported browsers | Chrome, Safari, Firefox, Edge (any modern version with `color-mix()`, `backdrop-filter`, CSS variables) |

---

*Generated 2026-04-19. Update this file as the platform evolves.*
