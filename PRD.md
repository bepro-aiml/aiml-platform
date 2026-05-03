---
title: "BePro AI/ML Mentorship Platform — Product Requirements Document"
subtitle: "v1.0 · 2026-Q2 release"
author: "Saidazam — Mentor & Product Owner"
date: "2026-05-03"
---

# BePro AI/ML Mentorship Platform — PRD v1.0

> **One-line product summary.** A static-site course platform plus four GitHub cohort repos that delivers a 17-week AI/ML curriculum to university students in Uzbekistan, collects their assignments via Pull Requests, and gives the mentor a single integrated workflow for content authoring, submission review, and progress tracking.

---

## 0. Document control

| | |
|---|---|
| Version | 1.0 |
| Status | **Active** — describes current product state and v1 goals |
| Owner | Saidazam (Mentor & Product Owner) |
| Engineering | 1 mentor + 1 assistant + Claude Code agent |
| Stakeholders | UN Mentorship Program, BePro Academy, Prof. Md Manirul Islam (curriculum source) |
| Last updated | 2026-05-03 |
| Companion docs | `PLATFORM_DOCUMENTATION.md` (system architecture), `PLATFORM_GUIDE.md` (code-level reference) |

---

## 1. Problem statement

### 1.1 Why this platform exists

Junior university students in Uzbekistan want to learn AI / ML. Existing options either (a) cost money, (b) are taught entirely in English at a graduate level, (c) are MOOC-style with zero feedback, or (d) require infrastructure (Moodle, Google Classroom, paid LMS) that the program cannot afford or maintain.

### 1.2 Who is hurting today

- **Students** — read disorganised PDFs from a Telegram channel, submit notebooks to a chat that no one tracks, get no consistent feedback, no progress visibility, no reusable record of work.
- **Mentor** — one person teaching three classes per week to 4 cohorts (~80 students). Reviews submissions in WhatsApp / Telegram, manages content in scattered .docx files, has no automated hygiene check on what students upload, no way to bulk-merge approved work.
- **Program partners** — UN, BePro Academy, the World Bank — need evidence of coverage, completion, and quality. Today there's no audit trail.

### 1.3 What the platform replaces

| Old way | New way |
|---|---|
| Telegram messages with attached PDFs | Versioned static site + Markdown source |
| Chat-based "submit your homework" | GitHub PR per submission, validated by CI |
| Mentor opens DMs to grade | Mentor reviews in PR, leaves inline comments, merges on approval |
| No record of completion | Merge log + localStorage progress tracker |
| Different files for different cohorts | One website, 4 mirrored cohort repos |
| Word-of-mouth "did you submit?" | PR validator auto-comments hygiene status |

---

## 2. Goals & non-goals

### 2.1 Goals (v1)

1. **One canonical source of curriculum** — every class viewable on the web, every assignment downloadable, every scenario documented in DOCX.
2. **Frictionless submission** — students push to GitHub, validator auto-checks, mentor approves & merges.
3. **Zero-cost infrastructure** — GitHub Pages + GitHub Actions only. No paid SaaS.
4. **Self-service onboarding** — a new student opens the site, follows a README, and submits their first assignment in under 30 minutes.
5. **Mentor leverage** — the mentor can review and merge a week's submissions in under 1 hour using bulk scripts.
6. **Reproducible by design** — a future mentor takes over by reading 2 markdown files (`PLATFORM_DOCUMENTATION.md` + `PRD.md`).

### 2.2 Non-goals (explicitly *out of scope* for v1)

- Real-time collaboration (Google Docs–style editing). PRs are the unit of collaboration.
- Live chat / forum. Telegram + GitHub Issues are sufficient.
- Auto-grading of code. Mentor judgement is the grading function.
- Plagiarism detection. Trust + small cohort make this unnecessary.
- Mobile-first authoring (mentor edits on desktop only).
- Multi-language UI (English only for the technical course; Uzbek/Russian context examples appear inline in content where useful).
- A 3D-rendered "Lab" environment. Currently scaffolded but not v1 scope. *(Decision: keep scaffolding behind lazy-load; remove fully if not used by Module 6.)*

---

## 3. Users & personas

### 3.1 Primary persona — *Sevara, the student*

- 19, university junior in Tashkent, comfortable in English at B2 level.
- Has a laptop, an Android phone, intermittent home Wi-Fi, fast Wi-Fi at university.
- Knows GitHub *barely* — has a profile, has never opened a PR before this course.
- Goals: pass the course, build a portfolio piece for her CV, understand "what AI is" beyond TikTok hype.
- Frustrations: lost in advanced math notation; needs concrete examples and clear deadlines.

### 3.2 Primary persona — *Saidazam, the mentor*

- Data engineer at Uztelecom, ~1 year in profession, MLOps trajectory.
- Side-running this course for ~80 students across 4 cohorts.
- Limited evening hours: ~6 hrs/week for review, ~4 hrs/week for content updates.
- Goals: produce graduates who can pass a real entry-level ML interview; build his teaching portfolio.
- Frustrations: doing everything manually; PR review is the time sink; can't easily see who is falling behind.

### 3.3 Secondary persona — *Durbek, the assistant*

- Former student of Saidazam's earlier cohort.
- Helps students debug; runs a class when Saidazam is unavailable.
- Has approval rights on PRs but not write rights to the website repo.
- Goal: become a co-mentor next year.

### 3.4 Stakeholder — *Program partner*

- UN / BePro / World Bank rep.
- Cares about: number of students enrolled, completion rate, sample of student work, attendance.
- Wants a single URL to share with sponsors that shows the course is real and active.

---

## 4. User journeys

### 4.1 Student — first day

1. Receives an invitation link to their cohort's GitHub repo.
2. Opens the website at `https://bepro-aiml.github.io/aiml-platform/`.
3. Clicks Module 1 → Class 1.1 ("What is AI?").
4. Reads sections, watches the embedded YouTube video, plays the click-to-reveal Quick Check.
5. Sees the assignment link at the bottom of the class page; downloads the PDF.
6. Solves it in Google Colab.
7. Pushes to a new branch in their cohort repo at `module-1/class_1/submissions/<Name>/`.
8. Opens a PR. Within 60 seconds, the validator auto-comments hygiene status.
9. Within 24-48 hours, mentor leaves comments; student fixes; mentor merges.

### 4.2 Mentor — week-end PR sweep

1. Sunday 7pm — mentor opens 4 cohort repos in browser tabs.
2. Skims auto-comments on each open PR (the validator already filtered junk).
3. Opens each notebook in GitHub viewer; checks completeness; leaves 1-3 inline comments.
4. Approves & merges any PRs that pass.
5. Tags students who need to fix something with `@<github-handle>` in a PR comment.
6. Total time: 60-90 min for ~30 PRs.

### 4.3 Student — Module 2 capstone (lab scenarios)

1. Forms a 3-person team during Class 2.6.
2. Visits the website's M2C6 page; expands all 10 scenario cards.
3. Picks one (e.g. *Telecom Churn & Network Quality*).
4. Clicks **📥 Dataset** → opens Kaggle in new tab; downloads.
5. Clicks **📝 Doc 1: WHAT** → downloads the Phase 1 DOCX template.
6. Clicks **📝 Doc 2: WHY** → downloads Phase 2 DOCX template.
7. Team fills both documents collaboratively in Google Docs / Word.
8. Saves as DOCX, pushes both to `module-2/class_6/submissions/<TeamName>/`.
9. Opens PR; validator approves; mentor reviews and signs off **before** team writes any code.
10. Implementation week: team builds the model, attaches notebook, pushes again.

---

## 5. Functional requirements

### 5.1 Website (must-have, all live in v1)

| ID | Requirement | Status |
|---|---|---|
| FR-1.1 | Single-page client-only website served from GitHub Pages | ✅ live |
| FR-1.2 | 8 modules, 47 classes addressable by `#/class/<M-C>` URL | ✅ live |
| FR-1.3 | Lazy-load module content on first visit (initial bundle ≤ 200KB) | ✅ live |
| FR-1.4 | Click-to-reveal Quick Check quizzes per class | ✅ live |
| FR-1.5 | Embedded YouTube videos per class | ✅ live |
| FR-1.6 | Dark / light / midnight theme, persisted in localStorage | ✅ live |
| FR-1.7 | Per-student progress tracker (localStorage) | ✅ live |
| FR-1.8 | Sidebar navigation listing all modules + classes | ✅ live |
| FR-1.9 | Search across all loaded class titles | ✅ live |
| FR-1.10 | Inline-SVG visuals for beginner-friendly classes | 🟡 partial — only M1C1 |
| FR-1.11 | Module 2 Capstone scenario cards with dataset + doc downloads | ✅ live |
| FR-1.12 | Theme-aware visual rendering (dark + light both readable) | ✅ live (filter-based) |
| FR-1.13 | Lazy-load 3D libraries (Three.js, GSAP) only when entering `/lab` route | ✅ live (saved ~500KB) |

### 5.2 Cohort repos (must-have)

| ID | Requirement | Status |
|---|---|---|
| FR-2.1 | 4 mirror-structured repos: `burgut`, `lochin`, `boraq`, `semurq` | ✅ |
| FR-2.2 | Identical `module-N/class_X/submissions/<Name>/` skeleton in every repo | ✅ |
| FR-2.3 | `.github/workflows/validate-pr.yml` identical across all 4 repos | ✅ |
| FR-2.4 | Branch protection: `main` requires 1 approving review, no force push | ✅ |
| FR-2.5 | PR validator allows `.pdf .docx .ipynb .md .txt .py .png .jpg .jpeg .zip .csv` | ✅ |
| FR-2.6 | Validator treats edits to existing submissions as warnings (not errors) | ✅ |
| FR-2.7 | Each scenario folder mirrored to all 4 repos at `module-2/class_6/lab-scenarios/docs/` | ✅ |

### 5.3 Lab scenarios (must-have for Module 2 capstone)

| ID | Requirement | Status |
|---|---|---|
| FR-3.1 | 10 industry-grade scenarios with 100k+ row datasets | ✅ |
| FR-3.2 | Each scenario has a `problem_statement.md` documenting business problem, dataset, hygiene rules, deliverable | ✅ |
| FR-3.3 | Each scenario provides a `documentation_phase_1_what.docx` (proposed solution) template | ✅ |
| FR-3.4 | Each scenario provides a `documentation_phase_2_why.docx` (justification) template | ✅ |
| FR-3.5 | Website Class 2-6 page shows expandable cards, 3 download buttons each | ✅ |
| FR-3.6 | Doc URLs use `raw.githubusercontent.com` for direct binary download | ✅ |
| FR-3.7 | Mentor can sign off on phase docs before any code is written | ✅ workflow |

### 5.4 Documentation (must-have)

| ID | Requirement | Status |
|---|---|---|
| FR-4.1 | `PLATFORM_DOCUMENTATION.md` — user-oriented system guide (17 sections) | ✅ |
| FR-4.2 | `PLATFORM_GUIDE.md` — code-level technical reference | ✅ |
| FR-4.3 | `PRD.md` — this document, describing requirements + roadmap | ✅ (this) |
| FR-4.4 | Cohort `README.md` explaining submission workflow (one per repo) | 🟡 boilerplate exists; needs unified content |

### 5.5 Should-have (v1.1, by end of Module 4)

| ID | Requirement | Target |
|---|---|---|
| FR-5.1 | Inline-SVG visuals for M1C2-M1C5 and M2C1-M2C5 | by 2026-05-31 |
| FR-5.2 | Capstone scenario packs for Module 4 (supervised learning) | by 2026-06-30 |
| FR-5.3 | Pre-commit hook validating module JS syntax (`node --check`) | by 2026-05-15 |
| FR-5.4 | Broken-link checker in CI for `raw.githubusercontent.com` doc URLs | by 2026-05-15 |
| FR-5.5 | Co-reviewer permission: assistant Durbek can approve PRs in absence of Saidazam | by 2026-05-10 |

### 5.6 Nice-to-have (v2, future)

- Telegram guide bot integration (`@lossfunction_bot`) inside the website chat overlay
- Mentor dashboard showing per-cohort completion + at-risk students
- Auto-grading for objective questions (Module 4 metrics, Module 6 model accuracy)
- Capstone scenarios for Modules 5, 6, 7, 8
- Branded `reference.docx` for polished phase-doc downloads
- LMS export endpoint (LTI-compatible) for partner programs

---

## 6. Non-functional requirements

### 6.1 Performance

- **Initial page load** — under 2 seconds on a 4G connection. Initial JS bundle (`courseData.js` + `app.js`) under 200KB gzipped.
- **Module page navigation** — under 500ms after first cache fill.
- **Total per-class payload** — under 80KB for any single class.
- **Heavy 3D libs** (Three.js, GSAP) — lazy-loaded only on `#/lab` entry. Default page load does not include them.

### 6.2 Reliability

- **Static site** — uptime is whatever GitHub Pages provides (publicly stated 99.95%).
- **No backend** — therefore no database, no server, no scheduler — therefore no production outages from our code.
- **Failure mode** — if GitHub is down, the entire program is down. Acceptable for a free educational program.

### 6.3 Accessibility

- **Keyboard navigation** — all menus, click-to-reveal quizzes, and scenario cards work without a mouse.
- **Color contrast** — WCAG AA for body text in both dark and light modes. Verified via the Lighthouse audit.
- **Screen reader** — semantic HTML (`<nav>`, `<main>`, `<article>`); not formally tested with NVDA/JAWS but no obvious blockers.
- **Mobile** — `@media` rules cover tablet and phone breakpoints. Mentor authoring is desktop-only by design.

### 6.4 Security & privacy

- **No personal data collected** — no analytics, no cookies, no email collection on the site.
- **GitHub identities** — only data persisted in GitHub (commits, comments, PRs). Standard GitHub privacy applies.
- **Branch protection** — direct pushes to `main` blocked; only via PR + approval.
- **No secrets in repo** — `.env.example` only; real credentials never committed.

### 6.5 Maintainability

- **Vanilla HTML/CSS/JS** — anyone with web fundamentals can edit. No build tooling required.
- **Module content authoring** — edit `data/module<N>.js`, run `node --check`, push.
- **PDFs and DOCX** generated via a single `pandoc + xelatex` pipeline using `pdf_header.tex`.
- **Cross-repo updates** — Python script (`_push_clean.py`) propagates changes to all 4 cohort repos.

### 6.6 Cost

- **$0/month** — GitHub free tier covers everything (Pages, Actions, repo storage). No paid services.

---

## 7. Success metrics

| Metric | Target | How measured |
|---|---|---|
| Active students | ≥ 60 of ~80 enrolled across 4 cohorts | Count of unique GitHub authors with ≥ 1 merged PR per module |
| Module completion rate | ≥ 70% of active students complete each module | Per-module merged-PR count vs roster |
| PR review SLA | Median ≤ 48 hours from open to first comment | `gh pr list` timestamps |
| Time-to-first-submission | < 5 days from cohort start | First merged PR per student |
| Mentor authoring throughput | New class on the website in ≤ 90 minutes | Manual log |
| Page load (4G) | p95 < 2.5s | WebPageTest / Lighthouse on the live site |
| Unique scenario adoption | All 10 M2C6 scenarios chosen by ≥ 1 team across 4 cohorts | Submission folder count under each scenario name |
| Final / midterm pass rate | ≥ 80% of students who reach the exam pass | Manual gradebook |

---

## 8. Roadmap

### v1.0 — current state (2026-Q2)

✅ All FR-1.* (website), FR-2.* (cohort repos), FR-3.* (lab scenarios), and FR-4.1-4.3 (documentation) **delivered**. Currently teaching Module 2.

### v1.1 — by end of Module 4 (~2026-06-30)

- Unify cohort `README.md` files (FR-4.4)
- Inline-SVG visuals for M1C2-M1C5 and M2C1-M2C5 (FR-5.1)
- Capstone scenarios for Module 4 (FR-5.2)
- Pre-commit syntax check (FR-5.3)
- CI broken-link checker (FR-5.4)
- Co-reviewer permission (FR-5.5)
- **Decision point on Lab feature** — complete or remove

### v1.2 — by end of Module 6 (~2026-08-31)

- Capstone scenarios for Modules 5, 6
- Mentor dashboard (cohort completion view)
- Branded `reference.docx` for nicer phase-doc exports
- Telegram bot integration on the website (chat overlay)

### v2.0 — by end of program (~2026-12)

- All 8 modules with full inline-SVG visuals
- Capstone scenarios for Modules 7, 8
- Auto-grading prototype for Module 4 evaluation metrics
- LTI export endpoint for partner LMS integration

### Future / aspirational

- Multi-cohort generalisation (cohort #5+ added without code changes)
- Open-source the platform under MIT (other educators can fork it)
- Localised UI (Uzbek, Russian content overlays)

---

## 9. Risks & open questions

### 9.1 Technical risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| GitHub Pages outage during a class | Low | High (live class blocked) | Mentor keeps a local copy of the site in `/Users/muje/Desktop/un_aiml/course_website/`; can serve via `python -m http.server` |
| Module JS file corrupted by a stray backtick | Medium | High (whole module breaks) | Pre-commit hook (FR-5.3) — planned for v1.1 |
| Cohort repos drift out of sync (e.g. validator differs) | Medium | Medium | `_push_clean.py`-style script run weekly; documented in PLATFORM_DOCUMENTATION § 15.5 |
| 500KB Three.js cost for unused Lab feature | (was) High | (was) Medium | ✅ Resolved 2026-05-03 — libs now lazy-load on `/lab` only |
| SVG visuals unreadable in light mode | (was) High | (was) Medium | ✅ Resolved 2026-05-03 — `filter: contrast() saturate() brightness()` in light mode |
| PR backlog grows beyond mentor's capacity | High | High (student morale) | Co-reviewer permission (FR-5.5) — planned for v1.1; weekly Sunday triage ritual |

### 9.2 Process risks

| Risk | Mitigation |
|---|---|
| Modules 3-7 content stale (old curriculum draft) | Rewrite in M2's class-by-class format, one module at a time, before each module's start date |
| Mentor burns out (sole content + reviewer + ops owner) | Escalate to program partners; recruit a second mentor by Module 5 |
| Student drops the course mid-module — no early-warning system | v1.2 mentor dashboard surfaces "no submission for ≥ 7 days" |

### 9.3 Open questions

- **Q1:** Do we keep or remove the 3D Lab feature? Currently lazy-loaded but `_buildScene()` is incomplete. Decision deadline: end of Module 4.
- **Q2:** Should phase-doc templates be DOCX or Google Docs links? DOCX wins on offline access; Docs wins on collaboration. Currently DOCX.
- **Q3:** Do we support additional cohorts (cohort #5, #6) on the same infrastructure? Likely yes — just add a new repo to the `bepro-aiml` org and run the propagation script.
- **Q4:** Is the program planning to enroll a paid cohort post-pilot? If yes, we need a $0 → paid migration plan (LMS, auth, payment gateway).
- **Q5:** Who owns the curriculum after Saidazam? Documented in `PLATFORM_DOCUMENTATION.md` § 17 but no specific successor named.

---

## 10. Architecture summary

```
                            ┌────────────────────────────────────┐
                            │  bepro-aiml/aiml-platform          │
                            │  static site + scenario docs       │
                            │  https://bepro-aiml.github.io/...  │
                            └────────┬───────────────────────────┘
                                     │  read on every page load
                                     │
              ┌──────────────────────┴──────────────────────┐
              ▼                                              ▼
    Students browse the website              Mentor edits data/moduleN.js
    (read lectures, watch videos,            → commit to main
     do quizzes, download                    → GitHub Pages auto-deploys
     scenario docs)

         Students belong to ONE cohort repo each:
   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
   │ bepro-aiml/     │  │ bepro-aiml/     │  │ bepro-aiml/     │  │ bepro-aiml/     │
   │ burgut          │  │ lochin          │  │ boraq           │  │ semurq          │
   │  module-N/      │  │  module-N/      │  │  module-N/      │  │  module-N/      │
   │   class_X/      │  │   class_X/      │  │   class_X/      │  │   class_X/      │
   │     submissions/│  │     submissions/│  │     submissions/│  │     submissions/│
   │       <Name>/…  │  │       <Name>/…  │  │       <Name>/…  │  │       <Name>/…  │
   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
            └────────────────────┴────────────────────┴────────────────────┘
                                  │
                                  ▼
                  Each PR triggers .github/workflows/validate-pr.yml
                  → posts hygiene-check comment
                  → blocks merge until 1 approving review + checks pass
                  → mentor approves and merges
```

See `PLATFORM_DOCUMENTATION.md` § 2 for the full architecture description.

---

## 11. Glossary

- **Cohort** — one of the 4 student groups: Burgut, Lochin, Boraq, Semurq.
- **Class N-C** — Module N, Class C. The 47-class index.
- **Phase 1 doc** — student template for *what* tools/methods they propose for a chosen lab scenario.
- **Phase 2 doc** — student template defending *why* each choice is right.
- **Submission folder** — `module-N/class_X/submissions/<StudentName>/` — only allowed location for student work.
- **PR validator** — `validate-pr.yml` GitHub Action that auto-comments hygiene status.
- **Sign-off** — mentor's approval comment on a PR; required before code work begins on a lab scenario.
- **Hygiene rules** — platform's data-cleaning conventions (lowercase columns, ISO timestamps, explicit `NaN`).

---

## 12. Acceptance criteria (v1 — as of this PRD)

This PRD describes the v1 product as already shipped. Acceptance criteria for v1 are met when:

- [x] Website is live at `bepro-aiml.github.io/aiml-platform/`
- [x] All 8 modules are addressable; Modules 1, 2 have full lecture content
- [x] All 4 cohort repos exist with identical structure
- [x] PR validator runs on every PR in every cohort repo
- [x] Module 2 Class 6 capstone has 10 scenarios with downloadable docs
- [x] Mentor can authorise a student in 1 click (add as collaborator) and have them push their first PR within an hour
- [x] `PLATFORM_DOCUMENTATION.md` accurately describes the system
- [x] Three.js and GSAP do not load on non-lab pages (verified by network tab)
- [x] Visuals on M1C1 are readable in both dark and light themes

All checkboxes ticked → **v1 is considered shipped**.

---

*This PRD is itself versioned in `bepro-aiml/aiml-platform/PRD.md`. Future revisions append a changelog at the bottom.*

## Changelog

- **v1.0 (2026-05-03)** — initial PRD authored by Saidazam after the post-Module-2 platform audit. Ratifies what is already live and locks the v1.1 / v1.2 / v2.0 roadmap.
