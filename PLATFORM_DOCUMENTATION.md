---
title: "BePro AI/ML Mentorship Platform — Complete Documentation"
subtitle: "System architecture, workflows, and how to use it"
author: "UN AI/ML Mentorship Program (Saidazam, Mentor)"
date: "2026"
---

# BePro AI/ML Mentorship Platform — Complete Documentation

> **Audience.** Mentors, teaching assistants, students, and program partners who need a single reference covering *what* the platform is, *how* it is structured, and *how to use it day-to-day.*
>
> **Companion document.** A more code-level reference (`PLATFORM_GUIDE.md`) describes the website's internal JavaScript architecture. This document focuses on the *system as a whole*: the website, the student repos, the documentation flow, the lab scenarios system, and the GitHub-based workflow that ties everything together.

---

## Table of Contents

1. [What the platform is](#1-what-the-platform-is)
2. [Big picture — system architecture](#2-big-picture--system-architecture)
3. [Course structure (8 modules, 17 weeks)](#3-course-structure)
4. [The 5 GitHub repositories](#4-the-5-github-repositories)
5. [Roles — Mentor, Student, Assistant](#5-roles)
6. [The student journey](#6-the-student-journey)
7. [The mentor journey](#7-the-mentor-journey)
8. [Submission & PR workflow](#8-submission--pr-workflow)
9. [The PR validator (`validate-pr.yml`)](#9-the-pr-validator)
10. [Lab Scenarios system (Module 2 capstone, Class 6)](#10-lab-scenarios-system)
11. [Content authoring (lecture pages on the website)](#11-content-authoring)
12. [Deployment (GitHub Pages auto-publish)](#12-deployment)
13. [Tech stack](#13-tech-stack)
14. [File layout per repo](#14-file-layout-per-repo)
15. [Common tasks — quick recipes](#15-common-tasks)
16. [Troubleshooting](#16-troubleshooting)
17. [Roadmap & known limitations](#17-roadmap)

---

## 1. What the platform is

The **BePro AI/ML Mentorship Platform** is a lightweight, visual-first AI/ML learning platform for beginners, focusing on clear diagrams and high-quality interactive quizzes. It serves three jobs:

1. **Deliver lecture content.** A static website hosts every class — text, embedded YouTube videos, code examples, click-to-reveal quizzes, and final-lab scenarios.
2. **Collect student work.** Each cohort has its own GitHub group repository. Students submit assignments via Pull Requests against a strictly enforced folder structure.
3. **Document the program.** Per-module content files, slides, resources, and capstone scenarios are all stored as Markdown / DOCX / PDF in version control, so a future mentor can pick up the course exactly as it was left.

The platform is **opinionated about three things**:

- **Static site, no backend.** The website is plain HTML + JS + per-module data files served from GitHub Pages. There is no database to manage and no server to deploy.
- **GitHub is the LMS.** Submissions are PRs, comments are GitHub comments, the gradebook is the merge log. No Moodle / Google Classroom required.
- **Content is plain Markdown.** Every assignment, every resource, every scenario is a `.md` or `.docx` file — readable on GitHub, exportable to PDF, copy-pasteable to email, easily reviewed.

---

## 2. Big picture — system architecture

```
                       ┌────────────────────────────────────┐
                       │  bepro-aiml/aiml-platform          │
                       │  (website + lab-scenario docs)     │
                       │  https://bepro-aiml.github.io/...  │
                       └────────────┬───────────────────────┘
                                    │  reads on every page load
                                    │
              ┌─────────────────────┴───────────────────────┐
              │                                              │
              ▼                                              ▼
  Students browse the website                Mentor edits data/moduleN.js
  → read lectures, quizzes,                  → commits to main → GitHub
    final lab scenarios                        Pages auto-redeploys

       Each student belongs to exactly ONE group repo:

   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
   │ bepro-aiml/     │  │ bepro-aiml/     │  │ bepro-aiml/     │  │ bepro-aiml/     │
   │ burgut          │  │ lochin          │  │ boraq           │  │ semurq          │
   │                 │  │                 │  │                 │  │                 │
   │ /module-1/      │  │ /module-1/      │  │ /module-1/      │  │ /module-1/      │
   │ /module-2/      │  │ /module-2/      │  │ /module-2/      │  │ /module-2/      │
   │   /class_4/     │  │   /class_4/     │  │   /class_4/     │  │   /class_4/     │
   │     submissions/│  │     submissions/│  │     submissions/│  │     submissions/│
   │       <Name>/   │  │       <Name>/   │  │       <Name>/   │  │       <Name>/   │
   │   /class_6/     │  │   /class_6/     │  │   /class_6/     │  │   /class_6/     │
   │     lab-        │  │     lab-        │  │     lab-        │  │     lab-        │
   │     scenarios/  │  │     scenarios/  │  │     scenarios/  │  │     scenarios/  │
   │ ...             │  │ ...             │  │ ...             │  │ ...             │
   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
            │                    │                    │                    │
            └────────────────────┴────────────────────┴────────────────────┘
                                  │
                                  ▼
                  Each PR triggers .github/workflows/validate-pr.yml
                  → posts a comment with a hygiene check
                  → blocks merge until checks pass + 1 approving review
                  → mentor approves and merges
```

**Key idea.** The website is a *static page* served from GitHub. Student work flows through GitHub Pull Requests on group repos. Both worlds are powered by the same GitHub identity and authentication — no separate user accounts.

---

## 3. Course structure

The program covers **8 modules**, runs for **17 weeks** (16 teaching weeks + a final-exam week), and totals approximately **94 contact hours**.

### Weekly cadence

- **3 classes per week**, **2 hours each** = 6 contact hours/week
- **Each module = 2 weeks** = 12 contact hours = 5 lectures + 1 lab
- *Module 1 is 5 classes (10 hours)* — slightly shorter as it's the introduction

### Module map

| # | Module | Weeks | Contact hours | Topics |
|---|---|---|---|---|
| 1 | Intro to AI & ML | 1–2 | 10 | What is AI, foundations (probability, gradient descent), ITES applications, ethics, problem-framing lab |
| 2 | Python and Data Foundations | 3–4 | 12 | Python basics, functions/data structures, NumPy, Pandas, visualization, EDA lab |
| 3 | Data Preparation & Feature Engineering | 5–6 | 12 | Cleaning, encoding, feature engineering, feature selection, pipelines, end-to-end prep lab |
| 4 | Supervised Learning | 7–8 | 12 | Linear & logistic regression, decision trees & random forests, evaluation, regularization, classifier lab |
| — | **Midterm** | 9 | exam | Mixed format (theory + practical) |
| 5 | Unsupervised Learning | 9–10 | 12 | Clustering intro, K-Means, hierarchical, dimensionality reduction, anomaly detection, segmentation lab |
| 6 | Neural Networks & Deep Learning | 11–12 | 12 | Perceptrons, backprop, CNNs, RNNs, transfer learning, image-classifier lab |
| 7 | NLP & Computer Vision | 13–14 | 12 | Text preprocessing, embeddings, transformers, computer vision, working with LLMs, sentiment/object lab |
| 8 | Capstone Project & Deployment | 15–16 | 12 | Project planning, model dev sprint, Flask/FastAPI deployment, MLOps, demo prep, final presentations |
| — | **Final** | 17 | exam | Mixed format |

Every class on the website is identified by `M-C` (e.g. `2-4` = Module 2, Class 4). The same notation is used in the student repos: `module-2/class_4/submissions/`.

---

## 4. The 5 GitHub repositories

The platform lives in **one organisation** on GitHub: `bepro-aiml`.

### 4.1 `bepro-aiml/aiml-platform` — the website

The single source of truth for *what* is taught.

- Hosts the public-facing course site at `https://bepro-aiml.github.io/aiml-platform/`
- Contains the per-module content files (`data/moduleN.js`)
- Hosts the lab-scenario documents (`lab-scenarios/module-2/docs/`)
- Auto-publishes on every push to `main` via GitHub Pages

### 4.2 `bepro-aiml/burgut`, `lochin`, `boraq`, `semurq` — student group repos

Four separate cohorts. Each repo has the **same folder structure**:

```
module-1/
  class_1/
    submissions/
      <StudentName>/
        Class1_<Name>.ipynb         ← student's submitted notebook / DOCX / PDF
  class_2/
    submissions/...
  ...
module-2/
  ...
.github/
  workflows/
    validate-pr.yml                  ← runs on every PR; checks hygiene
README.md
```

Students of cohort *Lochin* push to `bepro-aiml/lochin`. They never touch the other cohort repos.

---

## 5. Roles

There are three roles, each with a clear scope.

### 5.1 Mentor (Saidazam)

- Owns the curriculum and pace
- Edits website content (`data/moduleN.js`)
- Reviews and approves PRs in all four group repos
- Runs the live classes
- Pushes lab scenarios, slide decks, and DOCX templates

### 5.2 Assistant Mentor

- Reviews PRs alongside the mentor
- Helps students debug submissions
- May run a class when the mentor is unavailable

### 5.3 Student

- Has admin/write rights to **only their cohort's repo**
- Reads website content, watches embedded videos
- Submits assignments via PR following the path convention
- Receives feedback as PR comments

---

## 6. The student journey

A typical week from a student's perspective:

```
Monday — Lecture 1
  1. Open https://bepro-aiml.github.io/aiml-platform/
  2. Click the current module → click the current class
  3. Read the lecture sections
  4. Watch the embedded YouTube video
  5. Try the click-to-reveal Quick Check quiz at the bottom

Tuesday/Wednesday — Practice
  6. Open the assignment PDF / DOCX (linked from the class page)
  7. Solve it in a Jupyter notebook
  8. Push to a new branch in their cohort repo:
     git checkout -b <Name>-m2c4
     git add module-2/class_4/submissions/<Name>/Class4_<Name>.ipynb
     git commit -m "M2C4 submission — <Name>"
     git push origin <Name>-m2c4
  9. Open a Pull Request to main

Thursday — Friday — Review cycle
  10. The PR validator (validate-pr.yml) auto-comments hygiene check
  11. Mentor reviews the notebook, leaves comments
  12. Student fixes issues, pushes another commit
  13. Validator re-runs automatically
  14. Mentor approves + merges
  15. The student's notebook is now part of the cohort's main branch
```

For Module 2 Class 6 (the final lab), the workflow is different — see Section 10.

---

## 7. The mentor journey

The mentor's responsibilities cluster into three categories:

### 7.1 Authoring content

- Edit `data/moduleN.js` for lecture-page changes (text, code examples, quizzes)
- Generate / regenerate PDFs from Markdown using the project's `pdf_header.tex` and `regenerate_all_pdfs.sh`
- Convert phase-doc templates from `.md` to `.docx` using `pandoc`
- Push to `bepro-aiml/aiml-platform/main` — GitHub Pages auto-deploys in ≤2 minutes

### 7.2 Reviewing submissions

- Open `https://github.com/bepro-aiml/<cohort>/pulls`
- Read the PR validator's auto-comment first
- Open the notebook, run it locally if needed
- Leave inline comments on specific cells
- Approve + merge OR request changes

### 7.3 Running ops

- Onboarding new students (give write access to the right cohort repo)
- Adjusting branch protection (e.g. relaxing review count when running short on time)
- Bulk-merging end-of-week submissions
- Pushing weekly reports / final-lab scenario updates

---

## 8. Submission & PR workflow

### 8.1 Path convention (strictly enforced)

Every submission must live under:

```
module-<N>/class_<X>/submissions/<StudentName>/<file>
```

- `module-1` through `module-8` (always lowercase, underscore-free)
- `class_1` through `class_6` (always **underscore**, never dash)
- `submissions/<Name>/` — one folder per student
- File extensions allowed: `.pdf`, `.docx`, `.ipynb`, `.md`, `.txt`, `.py`, `.png`, `.jpg`, `.jpeg`, `.zip`, `.csv`

The validator enforces this. A submission outside this path fails the check and the PR is blocked.

### 8.2 Branch protection

The `main` branch on every group repo is protected with:

- **1 approving review** required before merge
- **No force pushes**
- **No direct commits to main** — everything goes through a PR

### 8.3 Mentor merge

When the mentor approves and clicks "Merge pull request":

- The merge commit goes onto `main`
- The submission becomes immutable (in version-control history)
- The merge timestamp is the official "submitted at" record

---

## 9. The PR validator

Every group repo has `.github/workflows/validate-pr.yml`. This workflow runs on every `pull_request` event (open, synchronize, reopen).

### 9.1 What it checks

- The submission path matches `module-N/class_X/submissions/<Name>/...`
- The file extension is in the allow-list
- The filename isn't a placeholder (`Untitled`, `New Document`, `Новый документ`)
- Whether the PR modifies an existing file (warning only — students CAN update their own previous submission)

### 9.2 What it does

- Posts an auto-comment on the PR with a checklist (what passed, what failed)
- Sets the check status to ✅ pass or ❌ fail
- Re-runs automatically when the student pushes new commits

### 9.3 The relaxed configuration

The validator was originally strict — any modification of an existing file was treated as an error, blocking PR creation entirely. It was relaxed to:

- Accept `class-1` (dash) AND `class_1` (underscore) — though only the underscore form is recommended
- Allow modifications (downgraded from error to info)
- Accept additional file types (`.py`, `.png`, `.jpg`, `.zip`, `.csv`) on top of the original allow-list
- Treat placeholder names as warnings (not blocking)

### 9.4 Locating the workflow

```
bepro-aiml/<cohort>/.github/workflows/validate-pr.yml
```

To change validation rules, edit this file and push. It is the **same file in all 4 cohort repos**, so changes should be propagated to all four.

---

## 10. Lab Scenarios system

### 10.1 What it is

The Module 2 capstone (Class 6) replaces the EDA lab notebook with a richer **team project**. Students:

1. Form a 3-person team
2. Pick **one** of 10 industry-grade scenarios from the website
3. Download the dataset and clean it according to the platform's hygiene rules
4. Write **two design documents** in DOCX:
   - **Phase 1 — WHAT** (proposed tools, libraries, methods, logic map)
   - **Phase 2 — WHY** (justification of every choice over alternatives)
5. Submit both to their cohort repo
6. The mentor approves the docs **before** any code is written

### 10.2 Where the scenarios live

The 10 scenarios are documented in **3 places**, all kept in sync:

- **Website (canonical):** `bepro-aiml/aiml-platform` →
  `lab-scenarios/module-2/docs/<NN_slug>/problem_statement.md`
  + `documentation_phase_1_what.docx`
  + `documentation_phase_2_why.docx`

- **Module 2 Class 6 page on the website:** an interactive section with 10 expandable cards, each with three buttons:
  - 📥 **Dataset** — opens Kaggle / UCI in a new tab
  - 📝 **Doc 1: WHAT** — downloads the Phase 1 .docx template (raw.githubusercontent.com)
  - 📝 **Doc 2: WHY** — downloads the Phase 2 .docx template

- **Each cohort repo:** mirrors of the same files at
  `module-2/class_6/lab-scenarios/docs/<NN_slug>/...`

### 10.3 The 10 scenarios

| # | Scenario | Industry |
|---|---|---|
| 1 | Renewable Energy Grid Optimization | Energy / Smart Grid |
| 2 | Logistics & Last-Mile Delivery | E-commerce / Logistics |
| 3 | Hospital Readmission Risk | Healthcare |
| 4 | Algorithmic Trading Backtest | Financial Markets |
| 5 | Telecom Churn & Network Quality | Telecommunications |
| 6 | Customer Lifetime Value (RFM) | Retail / E-commerce |
| 7 | Smart City Air Quality & Traffic | IoT / Public Sector |
| 8 | Football Match Performance | Sports Analytics |
| 9 | Crop Yield from Soil & Weather | AgriTech |
| 10 | U.S. Flight Delay Network | Aviation / Operations |

Every scenario has a real, downloadable, 100k+-row dataset.

### 10.4 What a scenario card contains

- **Business problem** — 2–3 sentence narrative
- **Dataset** — source URL, size
- **Keep / Drop** — exact column lists
- **Hygiene challenges** — what's broken in the data
- **Deliverable** — the team's required output

The student's job is *not* to implement on the lab day. It is to **define** how they would approach the problem (Phase 1) and **defend** their choices (Phase 2). Implementation happens later, after mentor sign-off.

---

## 11. Content authoring

### 11.1 Editing a lecture page

Lecture content for class `N-C` lives at `data/moduleN.js`, inside the `"N-C"` block:

```javascript
"2-4": {
  title: "Pandas for Data Analysis",
  subtitle: "Module 2, Class 4 — DataFrames, filtering, groupby, merging",
  brokenState: { ... },
  sections: [
    { icon: "🐼", title: "Series and DataFrames", content: `<p>HTML here...</p>` },
    { icon: "📂", title: "Loading and Exploring", content: `<pre>...code...</pre>` },
    ...
  ]
}
```

To edit:

1. Open `data/module2.js` in any editor
2. Find the relevant `"N-C"` key
3. Edit the section's `content:` template literal — pure HTML allowed
4. Run `node --check data/module2.js` to verify no syntax errors
5. Push to `main` — GitHub Pages redeploys in ≤2 minutes

### 11.2 Adding a new class

Add a new `"N-C"` entry to the `MODULE_N_CONTENT` object. Update the module's class list in `courseData.js` (the lightweight metadata file always loaded on first page load).

### 11.3 Embedding YouTube videos

A section with a `video: "https://..."` field automatically renders an embedded player at the top of the section.

### 11.4 Click-to-reveal quiz

Each Quick Check question uses this HTML pattern (the `app.js` runtime handles the toggle behavior):

```html
<div class="quiz-item">
  <div class="quiz-q">1. ...</div>
  <ol class="quiz-options" type="A"><li>A</li><li>B</li><li>C</li><li>D</li></ol>
  <button class="quiz-reveal">Show Answer</button>
  <div class="quiz-answer">
    <p><strong>✅ B. ...</strong> ...</p>
    <ul class="quiz-why">
      <li><strong>A.</strong> Why A is wrong.</li>
      ...
    </ul>
  </div>
</div>
```

---

## 12. Deployment

The website deploys via **GitHub Pages**.

- Source branch: `main`
- Source path: repository root
- Custom domain: not configured (uses default `bepro-aiml.github.io/aiml-platform/`)
- Build process: **none** — static files served as-is
- Cache: GitHub's CDN caches aggressively. Students should hard-refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`) to see updates immediately. Otherwise updates appear within 1–2 minutes.

**Rollback:** revert the offending commit with `git revert`. GitHub Pages will redeploy with the reverted state.

---

## 13. Tech stack

| Layer | Tool |
|---|---|
| Hosting | GitHub Pages (free static hosting) |
| Frontend | Vanilla HTML, CSS, JavaScript — no framework |
| Module loading | Lazy `import()` of `data/moduleN.js` only when its module is opened |
| Theming | CSS custom properties (`--bg`, `--text`, `--accent`) — light / dark / midnight modes |
| Math rendering | KaTeX (auto-detected by `app.js`) |
| Content format | HTML strings inside JS template literals; `.md` and `.docx` for student-facing templates; PDFs generated via `pandoc + xelatex` |
| Source control | Git + GitHub |
| CI / Validation | GitHub Actions (`validate-pr.yml`) |
| Authoring tools | Pandoc (Markdown → DOCX / PDF), Python scripts (`regenerate_all_pdfs.sh`, `_generate_scenarios.py`) |
| Persistence (browser) | `localStorage` for theme + completed-class progress |

---

## 14. File layout per repo

### 14.1 `bepro-aiml/aiml-platform`

```
aiml-platform/
├── index.html                     ← markup + global CSS + theme bootstrap
├── app.js                         ← runtime: router, renderers, theme, search
├── courseData.js                  ← lightweight module metadata (always loaded)
├── data/
│   ├── module1.js                 ← Module 1 lecture content
│   ├── module2.js                 ← Module 2 lecture content
│   ├── ...
│   └── module8.js
├── lab-scenarios/
│   └── module-2/
│       └── docs/
│           ├── README.md
│           ├── 01_renewable_energy_grid/
│           │   ├── problem_statement.md
│           │   ├── documentation_phase_1_what.docx
│           │   └── documentation_phase_2_why.docx
│           └── ... (10 scenarios)
├── assets/                        ← images, icons, downloadable docs
├── make_env_js.py                 ← injects environment vars into a runtime config file
├── RemoteComputeService.js        ← optional: bridges the site to a remote compute backend
├── PLATFORM_GUIDE.md              ← code-level technical reference
├── PLATFORM_DOCUMENTATION.md      ← THIS document
├── README.md
└── .gitignore
```

### 14.2 `bepro-aiml/<cohort>`

```
<cohort>/
├── module-1/
│   ├── class_1/
│   │   ├── m1_quick_win_demo.ipynb
│   │   └── submissions/
│   │       ├── .gitkeep
│   │       └── <StudentName>/...
│   ├── class_2/...
│   └── ...
├── module-2/
│   ├── class_1/
│   │   ├── m2_c1_python_warmup.ipynb
│   │   └── submissions/
│   ├── class_4/
│   │   ├── m2_c4_pandas.ipynb
│   │   ├── m2_c4_classwork_missions.ipynb
│   │   ├── assignment.pdf
│   │   └── submissions/
│   ├── class_5/...
│   ├── class_6/
│   │   ├── lab-scenarios/docs/...   ← copies of the 10 scenarios + DOCX templates
│   │   └── submissions/
│   ├── content.pdf
│   └── resources.pdf
├── module-3/...
├── ...
├── .github/workflows/validate-pr.yml
└── README.md
```

---

## 15. Common tasks

### 15.1 Push a new lecture page edit

```bash
cd ~/Desktop/un_aiml/course_website
# edit data/module2.js
node --check data/module2.js   # syntax check
git add data/module2.js
git commit -m "M2C4: clarify groupby return type"
git push origin main
# website live in ≤2 min
```

### 15.2 Regenerate all module PDFs

```bash
cd ~/Desktop/un_aiml
./regenerate_all_pdfs.sh
# uses pdf_header.tex; outputs to module_*/*.pdf and course_ready/module_*/...
```

### 15.3 Generate fresh DOCX scenario templates

```bash
cd ~/Desktop/un_aiml/lab-scenarios/module-2
python3 _generate_scenarios.py
# regenerates docs/*/*.md
cd docs
for d in */; do
  for f in documentation_phase_1_what.md documentation_phase_2_why.md; do
    pandoc "$d$f" -o "$d${f%.md}.docx"
  done
done
```

### 15.4 Bulk merge end-of-week submissions

```bash
GH=/usr/local/bin/gh
for repo in burgut lochin boraq semurq; do
  for pr in $($GH pr list --repo bepro-aiml/$repo --state open --json number --jq '.[].number'); do
    $GH pr merge $pr --repo bepro-aiml/$repo --merge
  done
done
```

> Note: requires write access and an approving review per branch-protection rules.

### 15.5 Push a file to all 4 cohort repos

```python
# scripts pattern used in lab-scenarios/module-2/_push_clean.py
import base64, subprocess, json
GH = "/usr/local/bin/gh"
def put(repo, path, content_bytes, msg):
    b64 = base64.b64encode(content_bytes).decode()
    sha = json.loads(subprocess.run(
        [GH, "api", f"repos/bepro-aiml/{repo}/contents/{path}"],
        capture_output=True, text=True).stdout or "{}").get("sha")
    body = {"message": msg, "content": b64}
    if sha: body["sha"] = sha
    subprocess.run([GH, "api", "-X", "PUT",
                    f"repos/bepro-aiml/{repo}/contents/{path}",
                    "--input", "-"], input=json.dumps(body), text=True)
```

---

## 16. Troubleshooting

### 16.1 "Website still shows the old content after I push"

GitHub Pages CDN caches aggressively. Hard-refresh:
- macOS: `Cmd + Shift + R`
- Windows / Linux: `Ctrl + Shift + R` or `Ctrl + F5`

If still stale after 2 minutes, check the **Actions** tab on the repo — Pages deploys appear there.

### 16.2 "Doc download button gives a 404"

The button must use `raw.githubusercontent.com/<user>/<repo>/<branch>/<path>` for binary files like `.docx`. Using `github.com/.../blob/...?raw=true` works for text but is unreliable for binaries.

### 16.3 "Student says PR validator is blocking them"

1. Open the PR's auto-comment from `Validate submission PR`
2. Read which rule failed
3. The relaxed validator now uses warnings for most issues — only path mismatches and disallowed extensions are blocking
4. If the rule is wrong, edit `.github/workflows/validate-pr.yml` and re-push

### 16.4 "Branch protection is blocking my own merge"

Branch protection requires 1 approving review. The mentor cannot self-approve. Either:
- Have the assistant mentor approve the PR
- Temporarily disable the rule (Settings → Branches → main → Edit), merge, re-enable
- Use `gh pr merge --admin` (requires explicit org-owner authorisation)

### 16.5 "JS syntax error after editing a moduleN.js"

Always run `node --check data/moduleN.js` before pushing. The most common errors are:

- Unclosed template literal — a stray backtick inside an HTML `content:` block
- Unescaped `${` inside a template literal — escape with `\${`
- Missing comma between section objects

### 16.6 "PDF rendering shows missing characters"

The fallback fonts don't ship Greek letters or some symbols. The project's `pdf_header.tex` works around this by setting `\sloppy` and `\emergencystretch`, but for symbols like `χ` or `≥` either:

- Install `xurl` and `fvextra` LaTeX packages (`tlmgr install xurl fvextra`)
- Or replace the symbol with an ASCII equivalent (`Chi-square`, `at least`)

---

## 17. Roadmap

### Done

- ✅ 8 modules with lecture content
- ✅ 10 lab scenarios for Module 2
- ✅ DOCX phase-doc templates per scenario
- ✅ PR validator across 4 cohort repos
- ✅ Click-to-reveal quizzes on every class
- ✅ Embedded YouTube videos linked to specific classes
- ✅ Lab scenarios cards on the website with download buttons

### Active / next 4 weeks

- 🟡 Refresh Modules 3, 4 content.md (currently uses old curriculum draft)
- 🟡 Add lab scenarios for Modules 4, 5, 6 (similar 10-scenario pack per module)
- 🟡 Refactor Module 1 content.md from narrative format to class-by-class format
- 🟡 Add Uzbek-context examples to Modules 3, 4 (currently sparse)

### Backlog

- 🔵 Telegram guide bot integration (`@lossfunction_bot`) wiring into the website chat overlay
- 🔵 Submission auto-grading for objective questions (Module 4 metrics, Module 6 model accuracy)
- 🔵 Student dashboard showing per-module completion across the cohort
- 🔵 Polished branded reference.docx for nicer-looking phase-doc downloads

### Known limitations

- The site is single-page client-only — no analytics on which classes are viewed most
- No automatic plagiarism / similarity check across student submissions
- All four cohort repos are currently kept in sync manually — small risk of drift over time
- Lecture content is in HTML strings inside JS files — requires careful editing (no live editor)
- DOCX templates use Pandoc default styling — functional but plain

---

## Appendix A — Useful URLs

| What | URL |
|---|---|
| Live website | https://bepro-aiml.github.io/aiml-platform/ |
| Website repo | https://github.com/bepro-aiml/aiml-platform |
| Burgut cohort | https://github.com/bepro-aiml/burgut |
| Lochin cohort | https://github.com/bepro-aiml/lochin |
| Boraq cohort | https://github.com/bepro-aiml/boraq |
| Semurq cohort | https://github.com/bepro-aiml/semurq |
| Lab-scenarios on website | https://bepro-aiml.github.io/aiml-platform/#/module/2/class/6 |
| Lab-scenarios markdown source | https://github.com/bepro-aiml/aiml-platform/tree/main/lab-scenarios/module-2/docs |

## Appendix B — Glossary

- **Cohort** — one of 4 student groups: Burgut, Lochin, Boraq, Semurq.
- **Class N-C** — Module N, Class C. Total of 47 classes (5 in M1, 6 in M2–M8).
- **Phase 1 doc** — student template describing WHAT tools/methods they propose for a chosen scenario.
- **Phase 2 doc** — student template defending WHY each choice is the right one.
- **PR validator** — `validate-pr.yml` GitHub Action that checks submission hygiene on every Pull Request.
- **Submission folder** — `module-N/class_X/submissions/<StudentName>/` — the only allowed location for student work.
- **Hygiene rules** — the platform's data-cleaning conventions: lowercase columns, ISO timestamps, explicit `NaN`, no silent row drops.

---

*Last updated: 2026 — UN AI/ML Mentorship Program. Maintained by Saidazam.*
