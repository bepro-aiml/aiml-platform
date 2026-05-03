// ============================================================
// APP.JS — Router and view renderers
// Reads COURSE_DATA (from courseData.js) and injects HTML into #app-container
// ============================================================

// ============================================================
// ASSET PATHS
// Central reference for all static files. Use asset(kind, filename)
// anywhere you build an <img>, <a href=...>, or URL string so there
// is one place to change paths if the folder layout moves.
//
// Layout:
//   assets/
//     img/    - photos, screenshots, diagrams
//     docs/   - PDFs, slide decks, handouts
//     icons/  - SVG/PNG icons referenced inline or in CSS
//
// Examples:
//   asset('img', 'module1-hero.png')        -> "assets/img/module1-hero.png"
//   asset('docs', 'module1-slides.pdf')     -> "assets/docs/module1-slides.pdf"
//   asset('icons', 'bot.svg')               -> "assets/icons/bot.svg"
// ============================================================
const ASSETS = {
  img:   'assets/img/',
  docs:  'assets/docs/',
  icons: 'assets/icons/'
};

function asset(kind, filename) {
  const base = ASSETS[kind];
  if (!base) {
    console.warn(`asset(): unknown kind "${kind}" — use one of: ${Object.keys(ASSETS).join(', ')}`);
    return filename;
  }
  return base + filename;
}

// ------------------------------------------------------------
// ROUTE PARSING
// ------------------------------------------------------------
function parseRoute() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace('#', '').split('/').filter(Boolean);
  if (parts.length === 0) return { page: 'home' };
  if (parts[0] === 'lab') return { page: 'lab' };
  if (parts[0] === 'module' && parts.length === 2) {
    return { page: 'module', moduleId: parseInt(parts[1], 10) };
  }
  if (parts[0] === 'module' && parts[2] === 'class' && parts.length === 4) {
    return {
      page: 'class',
      moduleId: parseInt(parts[1], 10),
      classId: parseInt(parts[3], 10)
    };
  }
  return { page: 'home' };
}

function navigate(path) {
  window.location.hash = path;
}

// ============================================================
// LAB — WORKFLOW STATE MACHINE
//   IDLE       → default, awaiting input
//   VALIDATING → running validatePipeline() before a Train attempt
//   TRAINING   → particle stream flowing (valid pipeline)
//   FAILED     → validation failed or a pulse hit a gap; auto-recovers to IDLE
// ============================================================
// ============================================================
// 3D Lab/Foundry was removed in v1.1 (2026-05-03).
// The platform pivoted to a lightweight visual-first approach.
// LabState / LabDatasets / Lab object: deleted (~3500 lines).
// Three.js + GSAP CDN scripts: removed from index.html.
// History preserved in git — see commits before this date.
// ============================================================


// ============================================================
// DYNAMIC MODULE LOADING
// Per-module content lives in /data/moduleN.js and is fetched
// only when the student opens that module.
// ============================================================
const _moduleLoadPromises = {};

function isModuleLoaded(moduleId) {
  return !!(COURSE_DATA._loadedModules && COURSE_DATA._loadedModules[moduleId]);
}

function loadModule(moduleId) {
  if (isModuleLoaded(moduleId)) return Promise.resolve();
  if (_moduleLoadPromises[moduleId]) return _moduleLoadPromises[moduleId];

  _moduleLoadPromises[moduleId] = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `data/module${moduleId}.js`;
    script.async = true;
    script.onload = () => {
      if (isModuleLoaded(moduleId)) {
        resolve();
      } else {
        reject(new Error(`module${moduleId}.js loaded but did not register content`));
      }
    };
    script.onerror = () => {
      delete _moduleLoadPromises[moduleId];
      reject(new Error(`Failed to fetch data/module${moduleId}.js`));
    };
    document.head.appendChild(script);
  });

  return _moduleLoadPromises[moduleId];
}

function renderLoading(msg) {
  return `
    <div class="loading-wrap">
      <div class="spinner" role="status" aria-label="Loading"></div>
      <p class="loading-msg">${msg || 'Loading module content...'}</p>
    </div>
  `;
}

function renderLoadError(moduleId) {
  return `
    <div class="page-header">
      <a class="back" href="#/">&#8592; All Modules</a>
      <h1>Could not load Module ${moduleId}</h1>
      <p>There was a problem loading the class content. Check your connection and try again.</p>
    </div>
    ${renderFooter()}
  `;
}

// ------------------------------------------------------------
// MAIN RENDER FUNCTION
// Reads window.location.hash, finds matching COURSE_DATA,
// loads the module file if needed, injects HTML into #app-container
// ------------------------------------------------------------
async function renderContent() {
  const route = parseRoute();
  const container = document.getElementById('app-container');
  const bc = document.getElementById('breadcrumb');

  if (!container) {
    console.error('#app-container not found in DOM');
    return;
  }

  // Lab route was removed in v1.1. If a stale link points to #/lab,
  // just send the user home rather than 404-ing.
  if (route.page === 'lab') { navigate('/'); return; }


  window.scrollTo(0, 0);

  if (route.page === 'home') {
    if (bc) bc.innerHTML = '';
    container.innerHTML = renderHome();
    attachModuleSpotlight(container);
    return;
  }

  if (route.page === 'module') {
    const mod = COURSE_DATA.modules.find(m => m.id === route.moduleId);
    if (!mod) { navigate('/'); return; }
    if (bc) {
      bc.innerHTML =
        `<a href="#/">Home</a><span class="sep">/</span><span>Module ${mod.id}</span>`;
    }
    // Module overview doesn't strictly need class content, but we load it so
    // class cards can reflect accurate quiz counts and completion state.
    if (!isModuleLoaded(mod.id)) {
      container.innerHTML = renderLoading(`Loading Module ${mod.id}...`);
      try {
        await loadModule(mod.id);
      } catch (e) {
        container.innerHTML = renderLoadError(mod.id);
        return;
      }
      // If the user navigated away while loading, bail.
      if (parseRoute().page !== 'module' || parseRoute().moduleId !== mod.id) return;
    }
    container.innerHTML = renderModule(mod);
    return;
  }

  if (route.page === 'class') {
    const mod = COURSE_DATA.modules.find(m => m.id === route.moduleId);
    const cls = mod ? mod.classList.find(c => c.id === route.classId) : null;
    if (!mod || !cls) { navigate('/'); return; }
    if (bc) {
      bc.innerHTML =
        `<a href="#/">Home</a><span class="sep">/</span>` +
        `<a href="#/module/${mod.id}">Module ${mod.id}</a>` +
        `<span class="sep">/</span><span>Class ${cls.id}</span>`;
    }
    if (!isModuleLoaded(mod.id)) {
      container.innerHTML = renderLoading(`Loading: ${cls.title}...`);
      try {
        await loadModule(mod.id);
      } catch (e) {
        container.innerHTML = renderLoadError(mod.id);
        return;
      }
      const now = parseRoute();
      if (now.page !== 'class' || now.moduleId !== mod.id || now.classId !== cls.id) return;
    }
    container.innerHTML = renderClass(mod, cls);
    document.querySelectorAll('.section').forEach(s => s.classList.add('open'));
    enhanceClassContent(container);
    // load the scenario the moment the student clicks into the lab.
    try {
      const content = COURSE_DATA.classContent && COURSE_DATA.classContent[`${mod.id}-${cls.id}`];
    } catch {}
    return;
  }

  // Fallback
  navigate('/');
}

// ------------------------------------------------------------
// VIEW: HOME
// ------------------------------------------------------------
// ------------------------------------------------------------
// Class-content post-processing:
//   1. Python syntax highlight every <pre> block (idempotent).
//   2. Wrap each line in <span class="code-line"> for click-to-focus.
//   3. Clicking a line dims the rest of the block (toggle off on same line).
// Regex-based; safe for mixed text. Does not alter the authored HTML —
// only walks <pre> elements after they're in the DOM.
// ------------------------------------------------------------
const PY_KEYWORDS = /\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g;
const PY_BUILTINS = /\b(print|len|range|int|float|str|bool|list|dict|tuple|set|type|isinstance|input|open|map|filter|sum|min|max|abs|round|sorted|enumerate|zip|any|all)\b/g;
function pyHighlight(line) {
  // Escape HTML first so we don't collide with the spans we'll inject.
  let s = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const placeholders = [];
  const ph = (cls, text) => {
    placeholders.push(`<span class="tok ${cls}">${text}</span>`);
    return ` x${placeholders.length - 1}x `;
  };
  // Order matters: comments > strings > numbers > keywords > builtins
  s = s.replace(/#.*$/g, (m) => ph('cmt', m));
  s = s.replace(/(&#39;|&quot;|'|")([\s\S]*?)\1/g, (m) => ph('str', m));
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) => ph('num', m));
  s = s.replace(PY_KEYWORDS, (m) => ph('kw', m));
  s = s.replace(PY_BUILTINS, (m) => ph('bi', m));
  // Restore placeholders.
  return s.replace(/ x(\d+)x /g, (_, i) => placeholders[Number(i)]);
}

function enhanceClassContent(root) {
  const blocks = root.querySelectorAll('.section-body pre, .example-box pre');
  blocks.forEach((pre) => {
    if (pre.dataset.hl === '1') return;
    const raw = pre.textContent;
    const lines = raw.replace(/\s+$/, '').split('\n');
    pre.innerHTML = lines.map((ln, i) =>
      `<span class="code-line" data-line="${i + 1}">${pyHighlight(ln) || '&nbsp;'}</span>`
    ).join('\n');
    pre.dataset.hl = '1';
    pre.classList.add('code-block');
    // production. When the lab is ready, re-enable by restoring the
    // button wiring here.
  });

  // CV Labeler task (Module 2 Class 2 scenario recovery): student labels
  // surface a success note.
  root.querySelectorAll('.cv-labeler:not([data-wired])').forEach((wrap) => {
    wrap.dataset.wired = '1';
    const doneEl = wrap.querySelector('.cv-done');
    const statusEl = wrap.querySelector('.cv-labeler-status');
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.cv-choices button');
      if (!btn) return;
      const sample = btn.closest('.cv-sample');
      if (!sample || sample.classList.contains('is-done')) return;
      const pick = btn.dataset.pick;
      const truth = sample.dataset.truth;
      sample.classList.add('is-done', pick === truth ? 'is-right' : 'is-wrong');
      sample.querySelectorAll('button').forEach(b => b.disabled = true);
      const done = wrap.querySelectorAll('.cv-sample.is-done').length;
      if (doneEl) doneEl.textContent = String(done);
      if (done === wrap.querySelectorAll('.cv-sample').length) {
        if (statusEl) statusEl.textContent = '✓ Sensors recalibrated — colour restored.';
        wrap.classList.add('is-complete');
        // Clear any active grayscale scenario right now if the lab is open,
        try {
        } catch {}
      }
    });
  });

  // Click-to-focus line (delegated once per container).
  if (!root.dataset.codeFocusBound) {
    root.addEventListener('click', (e) => {
      const line = e.target.closest('.code-line');
      if (!line) return;
      const block = line.closest('.code-block');
      if (!block) return;
      const already = line.classList.contains('is-active');
      block.querySelectorAll('.code-line.is-active').forEach(l => l.classList.remove('is-active'));
      if (already) {
        block.classList.remove('has-active');
      } else {
        line.classList.add('is-active');
        block.classList.add('has-active');
      }
    });
    root.dataset.codeFocusBound = '1';
  }
}

// Cursor-following violet spotlight on module cards. Event-delegated on the
// grid so we add one listener, not one per card. Updates CSS custom props
// --mx / --my that the card's radial-gradient reads.
function attachModuleSpotlight(root) {
  const grid = root.querySelector('.module-grid');
  if (!grid) return;
  grid.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.module-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

function renderHome() {
  const moduleCards = COURSE_DATA.modules.map(m => {
    const isAvailable = m.status === 'available';
    const badgeClass = isAvailable ? 'badge-available' : 'badge-soon';
    const badgeText = isAvailable ? 'Available' : 'Coming Soon';
    const cardClass = isAvailable ? '' : 'locked';
    const onclick = isAvailable ? `onclick="navigate('/module/${m.id}')"` : '';
    const completedCount = m.classList.filter(c => getClassProgress(m.id, c.id).completed).length;
    const pct = m.classes ? Math.round((completedCount / m.classes) * 100) : 0;
    return `
      <div class="module-card ${cardClass}" ${onclick} data-module="${m.id}">
        <div class="module-card-ring" aria-hidden="true"></div>
        <div class="module-card-spot" aria-hidden="true"></div>
        <div class="module-card-inner">
          <div class="module-num kicker">Module ${String(m.id).padStart(2, '0')}</div>
          <h3>${m.title}</h3>
          <p class="module-desc">${m.description}</p>
          ${isAvailable ? `
            <div class="module-progress">
              <div class="module-progress-track"><div class="module-progress-fill" style="--w:${pct}%"></div></div>
              <div class="module-progress-text"><b>${completedCount}</b>/${m.classes} classes <span class="dot">·</span> ${pct}%</div>
            </div>
          ` : `<div class="module-progress module-progress-locked"></div>`}
          <div class="meta">
            <span>Weeks ${m.weeks}</span>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Build the team dossier from the canonical team array (falls back to legacy mentors).
  const team = COURSE_DATA.team || (COURSE_DATA.mentors || []).map(name => ({
    name,
    role: 'Mentor',
    initials: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }));
  const teamHtml = team.map(p => {
    const cls = (p.role || '').toLowerCase() === 'assistant' ? 'asst' : 'lead';
    return `
      <div class="team-row">
        <div class="team-avatar ${cls}">${p.initials}</div>
        <div class="team-info">
          <div class="team-name">${p.name}</div>
          <div class="team-role">${p.role}</div>
        </div>
      </div>
    `;
  }).join('');

  // Live stats derived from the data model — no hardcoded numbers.
  const totalClasses = COURSE_DATA.modules.reduce((n, m) => n + (m.classes || 0), 0);
  const totalWeeks   = COURSE_DATA.modules.reduce((n, m) => {
    const [a, b] = String(m.weeks || '').split('-').map(Number);
    return n + (Number.isFinite(b) ? (b - a + 1) : 0);
  }, 0);
  const cohortSize   = COURSE_DATA.cohortSize || team.length;

  // Iridescent shine on the emphasis word in the subtitle.
  const subtitleWithShine = (COURSE_DATA.courseSubtitle || '')
    .replace(/\breal\b/, '<em class="shine">real</em>');

  return `
    <section class="hero hero-aurora">
      <div class="hero-dossier glass">
        <div class="hero-kicker kicker">UN AI/ML Mentorship Program · Cohort ${new Date().getFullYear()}</div>
        <h1 class="hero-title">${COURSE_DATA.courseTitle}</h1>
        <p class="hero-subtitle">${subtitleWithShine}</p>

        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-num">${cohortSize}</div>
            <div class="hero-stat-lbl kicker">Students</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">${COURSE_DATA.modules.length}</div>
            <div class="hero-stat-lbl kicker">Modules</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">${totalClasses}</div>
            <div class="hero-stat-lbl kicker">Classes</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">${totalWeeks}</div>
            <div class="hero-stat-lbl kicker">Weeks</div>
          </div>
        </div>

        <div class="hero-divider"></div>

        <div class="team-grid">
          ${teamHtml}
        </div>
      </div>
    </section>
    <div class="module-grid">
      ${moduleCards}
    </div>
    ${renderFooter()}
  `;
}

// ------------------------------------------------------------
// VIEW: MODULE
// ------------------------------------------------------------
function renderModule(mod) {
  const classCards = mod.classList.map(c => {
    const isAvailable = c.status === 'available';
    const cardClass = isAvailable ? '' : 'locked';
    const onclick = isAvailable ? `onclick="navigate('/module/${mod.id}/class/${c.id}')"` : '';
    const prog = getClassProgress(mod.id, c.id);
    const completed = prog.completed;
    const badgeClass = completed ? 'badge-completed' : (isAvailable ? 'badge-available' : 'badge-soon');
    const badgeText = completed ? 'Completed' : (isAvailable ? 'Available' : 'Coming Soon');
    return `
      <div class="class-card ${cardClass}" ${onclick}>
        <div class="class-card-left">
          <div class="class-number">${c.id}</div>
          <div>
            <h4>${c.title}</h4>
            <div class="class-desc">${c.desc}</div>
          </div>
        </div>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="page-header">
      <a class="back" href="#/">&#8592; All Modules</a>
      <h1>Module ${mod.id}: ${mod.title}</h1>
      <p>${mod.description}</p>
      <div class="page-meta">
        <div class="page-meta-item"><span>Classes:</span> ${mod.classes}</div>
        <div class="page-meta-item"><span>Weeks:</span> ${mod.weeks}</div>
        <div class="page-meta-item"><span>Status:</span> <span class="badge ${mod.status === 'available' ? 'badge-available' : 'badge-soon'}">${mod.status === 'available' ? 'Available' : 'Coming Soon'}</span></div>
      </div>
    </div>
    <h2 style="font-size:1.3rem;color:var(--heading);margin-bottom:16px;">Classes</h2>
    <div class="class-list">
      ${classCards}
    </div>
    <div class="resources-section">
      <h2>Resources</h2>
      <a href="#" class="resource-link" onclick="event.preventDefault()">
        <span class="resource-icon">&#128196;</span>
        <span class="resource-text">Module ${mod.id} Content Document (PDF)</span>
      </a>
      <a href="#" class="resource-link" onclick="event.preventDefault()">
        <span class="resource-icon">&#128218;</span>
        <span class="resource-text">Module ${mod.id} Resource Guide and Reading List</span>
      </a>
    </div>
    ${renderFooter()}
  `;
}

// ------------------------------------------------------------
// VIEW: CLASS
// ------------------------------------------------------------
function renderClass(mod, cls) {
  const key = `${mod.id}-${cls.id}`;
  const content = COURSE_DATA.classContent[key];

  if (!content) {
    return `
      <div class="page-header">
        <a class="back" href="#/module/${mod.id}">&#8592; Module ${mod.id}</a>
        <h1>Class ${cls.id}: ${cls.title}</h1>
        <p>Content coming soon.</p>
      </div>
      ${renderClassNav(mod, cls)}
      ${renderFooter()}
    `;
  }

  const sections = content.sections.map(s => {
    const videoUrl = s.video
      ? (s.video.length > 15 ? s.video : `https://www.youtube.com/watch?v=${s.video}`)
      : '';
    const videoHtml = s.video ? `
      <div style="margin:20px 0;">
        <a href="${videoUrl}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:14px;padding:16px 20px;background:var(--card);border:1px solid var(--card-border);border-radius:12px;text-decoration:none;transition:background 0.2s;" onmouseover="this.style.background='var(--card-hover)'" onmouseout="this.style.background='var(--card)'">
          <span style="font-size:2rem;">&#9654;&#65039;</span>
          <div>
            <div style="color:var(--heading);font-weight:600;font-size:1rem;">Watch Video</div>
            <div style="color:var(--muted);font-size:0.9rem;">${s.videoTitle || 'YouTube'}</div>
          </div>
          <span style="margin-left:auto;color:var(--link);font-size:0.85rem;">Open on YouTube &#8599;</span>
        </a>
      </div>
    ` : '';
    // Strip inline onclick from quiz buttons — event delegation handles clicks now
    const cleanContent = s.content.replace(/\s*onclick="toggleAnswer\(this\)"/g, '');
    return `
      <div class="section open">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">${s.icon}</span>
            ${s.title}
          </div>
          <span class="section-toggle">&#9662;</span>
        </div>
        <div class="section-body">
          ${cleanContent}
          ${videoHtml}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="class-header">
      <a class="back" href="#/module/${mod.id}">&#8592; Module ${mod.id}: ${mod.title}</a>
      <h1>Class ${cls.id}: ${content.title}</h1>
      <p class="class-subtitle">${content.subtitle}</p>
      ${renderProgressBar(mod.id, cls.id)}
    </div>
    ${sections}
    ${renderClassNav(mod, cls)}
    ${renderFooter()}
  `;
}

// ------------------------------------------------------------
// CLASS NAVIGATION (prev/next) — spans modules so students can
// walk the whole course linearly without dead-ends at module boundaries.
// ------------------------------------------------------------
function renderClassNav(mod, cls) {
  // Previous: try same module, then fall back to last class of previous module.
  const prevCls = mod.classList.find(c => c.id === cls.id - 1 && c.status === 'available');
  let prevLink;
  if (prevCls) {
    prevLink = `<a href="#/module/${mod.id}/class/${prevCls.id}">&#8592; Class ${prevCls.id}: ${prevCls.title}</a>`;
  } else {
    const prevMod = COURSE_DATA.modules.find(m => m.id === mod.id - 1 && m.status === 'available');
    const prevModLast = prevMod && [...prevMod.classList].reverse().find(c => c.status === 'available');
    prevLink = prevModLast
      ? `<a href="#/module/${prevMod.id}/class/${prevModLast.id}">&#8592; Module ${prevMod.id} &middot; Class ${prevModLast.id}: ${prevModLast.title}</a>`
      : `<a href="#/module/${mod.id}">&#8592; Module Overview</a>`;
  }

  // Next: try same module, then fall back to first class of next module.
  const nextCls = mod.classList.find(c => c.id === cls.id + 1 && c.status === 'available');
  let nextLink;
  if (nextCls) {
    nextLink = `<a href="#/module/${mod.id}/class/${nextCls.id}">Class ${nextCls.id}: ${nextCls.title} &#8594;</a>`;
  } else {
    const nextMod = COURSE_DATA.modules.find(m => m.id === mod.id + 1 && m.status === 'available');
    const nextModFirst = nextMod && nextMod.classList.find(c => c.status === 'available');
    nextLink = nextModFirst
      ? `<a href="#/module/${nextMod.id}/class/${nextModFirst.id}">Module ${nextMod.id} &middot; Class ${nextModFirst.id}: ${nextModFirst.title} &#8594;</a>`
      : `<a href="#/module/${mod.id}">Module Overview &#8594;</a>`;
  }

  return `
    <div class="class-nav">
      ${prevLink}
      ${nextLink}
    </div>
  `;
}

// ------------------------------------------------------------
// FOOTER
// ------------------------------------------------------------
function renderFooter() {
  const botLink = COURSE_DATA.botLink || 'https://t.me/lossfunction_bot';
  const botHandle = botLink.split('/').pop();
  return `
    <div class="footer">
      <p>${COURSE_DATA.courseTitle} &mdash; UN AI/ML Mentorship Program</p>
      <p>Questions? Reach out via <a href="${botLink}" target="_blank">@${botHandle}</a> on Telegram</p>
    </div>
  `;
}

// ============================================================
// PROGRESS TRACKER (localStorage)
// Persists which quiz questions each student has revealed.
// Shape: { "M-C": { quizzes: { "0": true, "1": true, ... }, completed: bool } }
// ============================================================
const PROGRESS_KEY = 'aiml-progress-v1';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveProgress(p) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch (e) {
    // localStorage full or disabled — silently ignore
  }
}

function getClassProgress(moduleId, classId) {
  const p = loadProgress();
  return p[`${moduleId}-${classId}`] || { quizzes: {}, completed: false };
}

function countQuizzesInClass(moduleId, classId) {
  const content = COURSE_DATA.classContent[`${moduleId}-${classId}`];
  if (!content) return 0;
  let count = 0;
  content.sections.forEach(s => {
    const matches = s.content.match(/class="quiz-item"/g);
    if (matches) count += matches.length;
  });
  return count;
}

function markQuizRevealed(moduleId, classId, quizIndex) {
  const p = loadProgress();
  const key = `${moduleId}-${classId}`;
  if (!p[key]) p[key] = { quizzes: {}, completed: false };
  p[key].quizzes[quizIndex] = true;

  const total = countQuizzesInClass(moduleId, classId);
  const revealed = Object.keys(p[key].quizzes).length;
  if (total > 0 && revealed >= total) {
    p[key].completed = true;
  }
  saveProgress(p);
  return p[key];
}

// Render a progress bar for a class based on quizzes revealed
function renderProgressBar(moduleId, classId) {
  const total = countQuizzesInClass(moduleId, classId);
  if (total === 0) return '';
  const prog = getClassProgress(moduleId, classId);
  const revealed = Object.keys(prog.quizzes).length;
  const pct = Math.min(100, Math.round((revealed / total) * 100));
  const label = prog.completed
    ? `Completed &#10003; (${revealed} / ${total} quizzes)`
    : `Progress: ${revealed} / ${total} quizzes`;
  return `
    <div class="progress-wrap" data-module="${moduleId}" data-class="${classId}">
      <div class="progress-label">${label}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

// Refresh the progress bar in-place (without re-rendering the whole class page)
function updateProgressBar() {
  const route = parseRoute();
  if (route.page !== 'class') return;
  const wrap = document.querySelector('.progress-wrap');
  if (!wrap) return;
  wrap.outerHTML = renderProgressBar(route.moduleId, route.classId);
}

// Re-apply stored progress to the currently rendered class page
function restoreQuizProgress() {
  const route = parseRoute();
  if (route.page !== 'class') return;
  const prog = getClassProgress(route.moduleId, route.classId);
  const items = document.querySelectorAll('#app-container .quiz-item');
  items.forEach((item, idx) => {
    if (prog.quizzes[idx]) {
      const btn = item.querySelector('.quiz-reveal');
      const ans = item.querySelector('.quiz-answer');
      if (btn && ans) {
        ans.classList.add('visible');
        btn.textContent = 'Hide Answer';
      }
    }
  });
}

// ============================================================
// EVENT DELEGATION
// One listener on #app-container handles all clicks for:
//   - collapsible section headers (.section-header)
//   - quiz answer reveals (.quiz-reveal)
// ============================================================
function attachDelegatedListener() {
  const container = document.getElementById('app-container');
  if (!container || container._delegated) return;
  container._delegated = true;

  container.addEventListener('click', (e) => {
    // Collapsible section toggle
    const header = e.target.closest('.section-header');
    if (header && container.contains(header)) {
      const section = header.parentElement;
      if (section && section.classList.contains('section')) {
        section.classList.toggle('open');
      }
      return;
    }

    // Quiz answer reveal
    const btn = e.target.closest('.quiz-reveal');
    if (btn && container.contains(btn)) {
      const answer = btn.nextElementSibling;
      if (!answer || !answer.classList.contains('quiz-answer')) return;
      answer.classList.toggle('visible');
      const isVisible = answer.classList.contains('visible');
      btn.textContent = isVisible ? 'Hide Answer' : 'Show Answer';

      if (isVisible) {
        const quizItem = btn.closest('.quiz-item');
        const allItems = Array.from(container.querySelectorAll('.quiz-item'));
        const idx = allItems.indexOf(quizItem);
        const route = parseRoute();
        if (route.page === 'class' && idx >= 0) {
          markQuizRevealed(route.moduleId, route.classId, idx);
          updateProgressBar();
        }
      }
      return;
    }
  });
}

// ============================================================
// SEARCH
// Filters titles, class summaries (desc), and keywords across
// all modules. Searches metadata only so it stays fast and
// doesn't force loading every module file.
// ============================================================
const SEARCH_MAX_RESULTS = 12;

function searchClasses(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const results = [];
  COURSE_DATA.modules.forEach(mod => {
    const modHaystack = `${mod.title} ${mod.description || ''}`.toLowerCase();
    mod.classList.forEach(cls => {
      const keywordsStr = (cls.keywords || []).join(' ').toLowerCase();
      // Lowercase every piece so case-mixed titles like "MLOps" or "Demo Day" match queries.
      const haystack = `${cls.title} ${cls.desc || ''}`.toLowerCase() + ` ${keywordsStr} ${modHaystack}`;
      // All terms must appear somewhere (AND match).
      const allMatch = terms.every(t => haystack.includes(t));
      if (!allMatch) return;

      // Score: title hits weigh most, then keywords, then desc, then module.
      let score = 0;
      terms.forEach(t => {
        if (cls.title.toLowerCase().includes(t)) score += 10;
        if (keywordsStr.includes(t)) score += 5;
        if ((cls.desc || '').toLowerCase().includes(t)) score += 3;
        if (modHaystack.includes(t)) score += 1;
      });

      results.push({
        moduleId: mod.id,
        classId: cls.id,
        moduleTitle: mod.title,
        title: cls.title,
        desc: cls.desc || '',
        status: cls.status,
        score
      });
    });
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, SEARCH_MAX_RESULTS);
}

function highlight(text, query) {
  const q = (query || '').trim();
  if (!q) return escapeHtml(text);
  const terms = q.split(/\s+/).filter(Boolean).map(escapeRegex);
  if (terms.length === 0) return escapeHtml(text);
  const re = new RegExp(`(${terms.join('|')})`, 'gi');
  return escapeHtml(text).replace(re, '<mark>$1</mark>');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderSearchResults(query) {
  const panel = document.getElementById('search-results');
  if (!panel) return;
  const q = (query || '').trim();
  if (!q) {
    panel.hidden = true;
    panel.innerHTML = '';
    return;
  }
  const results = searchClasses(q);
  if (results.length === 0) {
    panel.hidden = false;
    panel.innerHTML = `<div class="search-empty">No classes match "${escapeHtml(q)}"</div>`;
    return;
  }
  panel.hidden = false;
  panel.innerHTML = results.map((r, i) => {
    const locked = r.status !== 'available';
    const lockNote = locked ? ' &middot; Coming Soon' : '';
    return `
      <div class="search-result${i === 0 ? ' active' : ''}"
           data-module="${r.moduleId}" data-class="${r.classId}" data-locked="${locked ? '1' : '0'}">
        <div class="search-result-title">${highlight(r.title, q)}</div>
        <div class="search-result-meta">Module ${r.moduleId}: ${escapeHtml(r.moduleTitle)} &middot; Class ${r.classId}${lockNote}</div>
        <div class="search-result-desc">${highlight(r.desc, q)}</div>
      </div>
    `;
  }).join('');
}

function attachSearchHandlers() {
  const input = document.getElementById('search-input');
  const panel = document.getElementById('search-results');
  if (!input || !panel || input._wired) return;
  input._wired = true;

  let debounceTimer = null;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => renderSearchResults(input.value), 80);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim()) renderSearchResults(input.value);
  });

  input.addEventListener('keydown', (e) => {
    const items = Array.from(panel.querySelectorAll('.search-result'));
    const activeIdx = items.findIndex(el => el.classList.contains('active'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length === 0) return;
      const next = (activeIdx + 1) % items.length;
      items.forEach(el => el.classList.remove('active'));
      items[next].classList.add('active');
      items[next].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length === 0) return;
      const prev = (activeIdx - 1 + items.length) % items.length;
      items.forEach(el => el.classList.remove('active'));
      items[prev].classList.add('active');
      items[prev].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = items[Math.max(0, activeIdx)];
      if (target) openSearchResult(target);
    } else if (e.key === 'Escape') {
      input.value = '';
      panel.hidden = true;
      panel.innerHTML = '';
      input.blur();
    }
  });

  // Delegate clicks on result rows
  panel.addEventListener('click', (e) => {
    const row = e.target.closest('.search-result');
    if (row) openSearchResult(row);
  });

  // Close when clicking anywhere else
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !panel.contains(e.target)) {
      panel.hidden = true;
    }
  });
}

function openSearchResult(row) {
  const input = document.getElementById('search-input');
  const panel = document.getElementById('search-results');
  const moduleId = row.dataset.module;
  const classId = row.dataset.class;
  const locked = row.dataset.locked === '1';
  if (locked) {
    // Still navigate to the module page so the student can see what's coming
    navigate(`/module/${moduleId}`);
  } else {
    navigate(`/module/${moduleId}/class/${classId}`);
  }
  if (input) input.value = '';
  if (panel) { panel.hidden = true; panel.innerHTML = ''; }
}

// ------------------------------------------------------------
// EVENT LISTENERS
// On every render: re-attach delegated listener (idempotent) and
// restore any saved quiz progress.
// ------------------------------------------------------------
async function onRender() {
  await renderContent();
  attachDelegatedListener();
  restoreQuizProgress();
  updateSidebarActive();
  if (isPresenting()) {
    requestAnimationFrame(() => updateSectionFocus(true));
  }
}

// ============================================================
// THEME TOGGLE
// Initial theme is applied by the inline script in index.html's
// <head> to avoid flash. Here we just wire the toggle button.
// ============================================================
const THEME_KEY = 'aiml-theme';

function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}

function attachThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn || btn._wired) return;
  btn._wired = true;
  btn.addEventListener('click', () => {
    const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}

// ============================================================
// PRESENTATION MODE
// Class `.presentation-mode` on <body> scales UI for classroom
// display. ArrowLeft/Right steps through sections (and across
// classes at boundaries). Esc exits.
// Session-scoped: not persisted in localStorage on purpose so
// next visit starts in normal mode.
// ============================================================
function isPresenting() {
  return document.body.classList.contains('presentation-mode');
}

function togglePresentationMode(force) {
  const want = typeof force === 'boolean' ? force : !isPresenting();
  document.body.classList.toggle('presentation-mode', want);
  const btn = document.getElementById('present-toggle');
  if (btn) btn.classList.toggle('is-active', want);

  if (want) {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => updateSectionFocus(true));
  } else {
    document.querySelectorAll('.is-focus').forEach(el => el.classList.remove('is-focus'));
  }
}

function attachPresentationToggle() {
  const btn = document.getElementById('present-toggle');
  if (btn && !btn._wired) {
    btn._wired = true;
    btn.addEventListener('click', () => togglePresentationMode());
  }
  const exitBtn = document.getElementById('present-exit');
  if (exitBtn && !exitBtn._wired) {
    exitBtn._wired = true;
    exitBtn.addEventListener('click', () => togglePresentationMode(false));
  }
}

// Slides = class-header (title slide) + every .section, in document order.
function getPresentationSlides() {
  return Array.from(document.querySelectorAll(
    '#app-container .class-header, #app-container .section'
  ));
}

// Which slide is currently closest to the top of the viewport?
function currentSectionIndex() {
  const slides = getPresentationSlides();
  if (slides.length === 0) return -1;
  const anchor = window.innerHeight * 0.3;
  let bestIdx = 0;
  let bestDist = Infinity;
  slides.forEach((s, i) => {
    const rect = s.getBoundingClientRect();
    const dist = Math.abs(rect.top - anchor);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  });
  return bestIdx;
}

function scrollToSectionIndex(idx) {
  const slides = getPresentationSlides();
  if (idx < 0 || idx >= slides.length) return false;
  slides[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

// Update .is-focus on the current slide so CSS fades the others to 22%.
let _focusRaf = null;
function updateSectionFocus(force) {
  if (!force && !isPresenting()) return;
  if (_focusRaf) return;
  _focusRaf = requestAnimationFrame(() => {
    _focusRaf = null;
    const slides = getPresentationSlides();
    const idx = currentSectionIndex();
    slides.forEach((s, i) => s.classList.toggle('is-focus', i === idx));
  });
}

// Track focus on scroll, rAF-throttled.
window.addEventListener('scroll', () => {
  if (isPresenting()) updateSectionFocus();
}, { passive: true });

// Navigate to the next class (within module, or next module's first).
function goToNextClass() {
  const route = parseRoute();
  if (route.page !== 'class') return false;
  const mod = COURSE_DATA.modules.find(m => m.id === route.moduleId);
  if (!mod) return false;
  const nextCls = mod.classList.find(c => c.id === route.classId + 1 && c.status === 'available');
  if (nextCls) {
    navigate(`/module/${mod.id}/class/${nextCls.id}`);
    return true;
  }
  const nextMod = COURSE_DATA.modules.find(m => m.id === mod.id + 1 && m.status === 'available');
  const nextModFirst = nextMod && nextMod.classList.find(c => c.status === 'available');
  if (nextModFirst) {
    navigate(`/module/${nextMod.id}/class/${nextModFirst.id}`);
    return true;
  }
  return false;
}

function goToPrevClass() {
  const route = parseRoute();
  if (route.page !== 'class') return false;
  const mod = COURSE_DATA.modules.find(m => m.id === route.moduleId);
  if (!mod) return false;
  const prevCls = mod.classList.find(c => c.id === route.classId - 1 && c.status === 'available');
  if (prevCls) {
    navigate(`/module/${mod.id}/class/${prevCls.id}`);
    return true;
  }
  const prevMod = COURSE_DATA.modules.find(m => m.id === mod.id - 1 && m.status === 'available');
  const prevModLast = prevMod && [...prevMod.classList].reverse().find(c => c.status === 'available');
  if (prevModLast) {
    navigate(`/module/${prevMod.id}/class/${prevModLast.id}`);
    return true;
  }
  return false;
}

function presentationNext() {
  const slides = getPresentationSlides();
  if (slides.length > 0) {
    const idx = currentSectionIndex();
    if (idx + 1 < slides.length) {
      scrollToSectionIndex(idx + 1);
      return;
    }
  }
  goToNextClass();
}

function presentationPrev() {
  const slides = getPresentationSlides();
  if (slides.length > 0) {
    const idx = currentSectionIndex();
    if (idx - 1 >= 0) {
      scrollToSectionIndex(idx - 1);
      return;
    }
  }
  goToPrevClass();
}

function attachPresentationKeyboard() {
  if (attachPresentationKeyboard._wired) return;
  attachPresentationKeyboard._wired = true;
  document.addEventListener('keydown', (e) => {
    // Esc exits from anywhere (only if presenting)
    if (e.key === 'Escape' && isPresenting()) {
      togglePresentationMode(false);
      return;
    }
    if (!isPresenting()) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

    // Next: Right arrow, PageDown, Spacebar
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      presentationNext();
      return;
    }
    // Previous: Left arrow, PageUp, Backspace
    if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
      e.preventDefault();
      presentationPrev();
      return;
    }
  });
}

// ============================================================
// SIDEBAR
// Fixed left drawer listing every module. Click a module header
// to expand its classes. Click a class to navigate. Auto-expands
// the module that contains the currently viewed class.
// Open state persisted in localStorage; default open on desktop.
// ============================================================
const SIDEBAR_KEY = 'aiml-sidebar';
const DESKTOP_BREAKPOINT = 1024;

function isDesktop() {
  return window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches;
}

function loadSidebarPref() {
  try {
    const v = localStorage.getItem(SIDEBAR_KEY);
    if (v === 'open') return true;
    if (v === 'closed') return false;
  } catch (e) {}
  return isDesktop(); // default: open on desktop, closed on mobile
}

function saveSidebarPref(open) {
  try { localStorage.setItem(SIDEBAR_KEY, open ? 'open' : 'closed'); } catch (e) {}
}

function toggleSidebar(force) {
  const want = typeof force === 'boolean' ? force : !document.body.classList.contains('has-sidebar');
  document.body.classList.toggle('has-sidebar', want);
  const btn = document.getElementById('sidebar-toggle');
  if (btn) btn.classList.toggle('is-active', want);
  saveSidebarPref(want);
}

function renderSidebar() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  nav.innerHTML = COURSE_DATA.modules.map(m => {
    const available = m.status === 'available';
    const lockedCls = available ? '' : 'locked';
    const classItems = m.classList.map(c => {
      const clsLocked = c.status !== 'available' ? 'locked' : '';
      const done = c.status === 'available' && getClassProgress(m.id, c.id).completed;
      const doneCls = done ? 'completed' : '';
      const href = c.status === 'available'
        ? `#/module/${m.id}/class/${c.id}`
        : `#/module/${m.id}`;
      return `
        <a class="sidebar-class ${clsLocked} ${doneCls}" href="${href}" data-module="${m.id}" data-class="${c.id}">
          <span class="sidebar-class-dot" aria-hidden="true"></span>
          <span class="sidebar-class-text">Class ${c.id}: ${c.title}</span>
        </a>
      `;
    }).join('');
    return `
      <div class="sidebar-module" data-module="${m.id}">
        <button class="sidebar-module-header ${lockedCls}" data-module="${m.id}">
          <span class="sidebar-module-num">${m.id}</span>
          <span class="sidebar-module-title">${m.title}</span>
          <svg class="sidebar-module-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div class="sidebar-module-classes">${classItems}</div>
      </div>
    `;
  }).join('');
}

function attachSidebarHandlers() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  const nav = document.getElementById('sidebar-nav');
  if (!nav || nav._wired) return;
  nav._wired = true;

  if (toggleBtn && !toggleBtn._wired) {
    toggleBtn._wired = true;
    toggleBtn.addEventListener('click', () => toggleSidebar());
  }
  if (overlay && !overlay._wired) {
    overlay._wired = true;
    overlay.addEventListener('click', () => toggleSidebar(false));
  }

  // Delegated clicks inside the sidebar nav
  nav.addEventListener('click', (e) => {
    const header = e.target.closest('.sidebar-module-header');
    if (header) {
      e.preventDefault();
      if (header.classList.contains('locked')) return;
      const wrapper = header.parentElement;
      wrapper.classList.toggle('expanded');
      return;
    }
    const classLink = e.target.closest('.sidebar-class');
    if (classLink) {
      // Native hash navigation will fire; just close the drawer on mobile.
      if (!isDesktop()) {
        setTimeout(() => toggleSidebar(false), 80);
      }
    }
  });

  // Close sidebar on Esc (mobile-friendly)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('has-sidebar') && !isDesktop()) {
      toggleSidebar(false);
    }
  });

  // Re-evaluate on resize: crossing the breakpoint applies the default behavior
  // without clobbering an explicit user choice
  let lastDesktop = isDesktop();
  window.addEventListener('resize', () => {
    const nowDesktop = isDesktop();
    if (nowDesktop !== lastDesktop) {
      lastDesktop = nowDesktop;
    }
  });
}

// Keep sidebar state synced with the current route: expand the parent
// module and highlight the active class link.
function updateSidebarActive() {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;
  const route = parseRoute();

  nav.querySelectorAll('.sidebar-class.active').forEach(el => el.classList.remove('active'));

  if (route.page === 'class' || route.page === 'module') {
    const moduleWrap = nav.querySelector(`.sidebar-module[data-module="${route.moduleId}"]`);
    if (moduleWrap) moduleWrap.classList.add('expanded');
  }
  if (route.page === 'class') {
    const link = nav.querySelector(`.sidebar-class[data-module="${route.moduleId}"][data-class="${route.classId}"]`);
    if (link) link.classList.add('active');
  }
}

function initSidebar() {
  renderSidebar();
  attachSidebarHandlers();
  // Apply saved preference
  const open = loadSidebarPref();
  document.body.classList.toggle('has-sidebar', open);
  const btn = document.getElementById('sidebar-toggle');
  if (btn) btn.classList.toggle('is-active', open);
  updateSidebarActive();
}

function onReady() {
  attachThemeToggle();
  attachPresentationToggle();
  attachPresentationKeyboard();
  attachSearchHandlers();
  initSidebar();
  onRender();
}

window.addEventListener('hashchange', onRender);
window.addEventListener('DOMContentLoaded', onReady);
