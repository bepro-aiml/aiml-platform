// ============================================================
// REDESIGN.JS — UX additions layered on top of app.js
//
// Adds (without modifying existing render functions):
//   1. Scroll progress bar at top of class pages
//   2. In-class section TOC sidebar with scroll-spy
//   3. Reading-time chip on class header
//   4. Copy button on every code block
//   5. Interactive (click-to-answer) quizzes
//
// Hooked via MutationObserver on #app-container so it runs after
// every render regardless of which path triggered it.
// ============================================================

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -----------------------------------------------------------
  // 1. SCROLL PROGRESS BAR
  // -----------------------------------------------------------
  function ensureScrollProgress() {
    let bar = $('#scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'scroll-progress';
      bar.className = 'scroll-progress';
      bar.innerHTML = '<span class="scroll-progress-fill"></span>';
      document.body.appendChild(bar);
    }
    return bar;
  }
  function updateScrollProgress() {
    const bar = $('#scroll-progress');
    if (!bar) return;
    const onClass = !!$('.class-header');
    bar.classList.toggle('is-visible', onClass);
    if (!onClass) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    const fill = bar.firstElementChild;
    if (fill) fill.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);

  // -----------------------------------------------------------
  // 2. IN-CLASS SECTION TOC
  // -----------------------------------------------------------
  function slugify(s) {
    return String(s).toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'section';
  }
  function ensureSectionIds() {
    const seen = new Set();
    $$('#app-container .section').forEach((sec, i) => {
      if (sec.id) return;
      const titleEl = sec.querySelector('.section-title');
      const raw = titleEl ? titleEl.textContent.trim() : `section-${i + 1}`;
      let id = 's-' + slugify(raw);
      let n = 2;
      while (seen.has(id) || document.getElementById(id)) {
        id = 's-' + slugify(raw) + '-' + n++;
      }
      seen.add(id);
      sec.id = id;
    });
  }
  function buildClassTOC() {
    removeClassTOC();
    const header = $('.class-header');
    const sections = $$('#app-container .section');
    if (!header || sections.length === 0) return;
    ensureSectionIds();

    const items = sections.map((s, i) => {
      const titleEl = s.querySelector('.section-title');
      const iconEl = s.querySelector('.section-icon');
      const icon = iconEl ? iconEl.textContent.trim() : '·';
      const title = titleEl
        ? titleEl.textContent.replace(icon, '').trim()
        : `Section ${i + 1}`;
      return `
        <a class="class-toc-item" href="#${s.id}" data-target="${s.id}">
          <span class="class-toc-icon" aria-hidden="true">${icon}</span>
          <span class="class-toc-text">${title}</span>
        </a>
      `;
    }).join('');

    const aside = document.createElement('aside');
    aside.id = 'class-toc';
    aside.className = 'class-toc';
    aside.setAttribute('aria-label', 'On this page');
    aside.innerHTML = `
      <div class="class-toc-inner">
        <div class="class-toc-heading">On this page</div>
        <nav class="class-toc-list">${items}</nav>
      </div>
    `;
    document.body.appendChild(aside);

    aside.addEventListener('click', (e) => {
      const a = e.target.closest('.class-toc-item');
      if (!a) return;
      e.preventDefault();
      const target = document.getElementById(a.dataset.target);
      if (!target) return;
      // Open the section if it's collapsed, then smooth-scroll.
      target.classList.add('open');
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', '#' + target.id);
    });

    // Floating mobile toggle
    let fab = $('#class-toc-fab');
    if (!fab) {
      fab = document.createElement('button');
      fab.id = 'class-toc-fab';
      fab.className = 'class-toc-fab';
      fab.setAttribute('aria-label', 'Open section list');
      fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>';
      document.body.appendChild(fab);
      fab.addEventListener('click', () => document.body.classList.toggle('toc-open'));
    }
    document.body.classList.add('has-class-toc');
  }
  function removeClassTOC() {
    const t = $('#class-toc'); if (t) t.remove();
    const f = $('#class-toc-fab'); if (f) f.remove();
    document.body.classList.remove('has-class-toc', 'toc-open');
  }
  function updateClassTOCActive() {
    const items = $$('#class-toc .class-toc-item');
    if (items.length === 0) return;
    const sections = items.map(a => document.getElementById(a.dataset.target)).filter(Boolean);
    if (sections.length === 0) return;
    const anchor = window.scrollY + 120;
    let activeIdx = 0;
    sections.forEach((s, i) => {
      if (s.offsetTop <= anchor) activeIdx = i;
    });
    items.forEach((a, i) => a.classList.toggle('is-active', i === activeIdx));
  }
  window.addEventListener('scroll', updateClassTOCActive, { passive: true });

  // -----------------------------------------------------------
  // 3. READING-TIME CHIP
  // -----------------------------------------------------------
  function mountReadingTime() {
    const header = $('.class-header');
    if (!header || header.querySelector('.class-meta-row')) return;
    const sections = $$('#app-container .section-body');
    const wordCount = sections.reduce((n, el) => n + (el.textContent.trim().match(/\S+/g) || []).length, 0);
    const minutes = Math.max(1, Math.round(wordCount / 200));
    const sectionCount = $$('#app-container .section').length;
    const meta = document.createElement('div');
    meta.className = 'class-meta-row';
    meta.innerHTML = `
      <span class="class-meta-pill"><span class="dot"></span>${sectionCount} section${sectionCount === 1 ? '' : 's'}</span>
      <span class="class-meta-pill"><span class="dot dot-mint"></span>~${minutes} min read</span>
      <span class="class-meta-pill"><span class="dot dot-amber"></span>${wordCount.toLocaleString()} words</span>
    `;
    const subtitle = header.querySelector('.class-subtitle');
    if (subtitle) subtitle.insertAdjacentElement('afterend', meta);
    else header.appendChild(meta);
  }

  // -----------------------------------------------------------
  // 4. CODE COPY BUTTONS
  // -----------------------------------------------------------
  function mountCopyButtons() {
    $$('#app-container pre').forEach(pre => {
      if (pre.dataset.copyMounted) return;
      pre.dataset.copyMounted = '1';
      const wrap = document.createElement('div');
      wrap.className = 'code-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = `
        <svg class="i-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <svg class="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <span class="code-copy-label">Copy</span>
      `;
      btn.addEventListener('click', async () => {
        const text = pre.textContent;
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = text; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch {}
          ta.remove();
        }
        btn.classList.add('is-copied');
        const lbl = btn.querySelector('.code-copy-label');
        if (lbl) lbl.textContent = 'Copied';
        setTimeout(() => {
          btn.classList.remove('is-copied');
          if (lbl) lbl.textContent = 'Copy';
        }, 1400);
      });
      wrap.appendChild(btn);
    });
  }

  // -----------------------------------------------------------
  // 5. INTERACTIVE QUIZZES
  // Existing markup (untouched in data files):
  //   .quiz-item > .quiz-q + .quiz-options (ol, type=A) + .quiz-reveal + .quiz-answer
  // The .quiz-answer starts with "<strong>X.</strong>" where X is the
  // correct letter. We parse that, make every option clickable, and
  // give instant feedback on click. The reveal button stays as a fallback.
  // -----------------------------------------------------------
  function letterToIndex(L) {
    const c = (L || '').toUpperCase().charCodeAt(0);
    return c >= 65 && c <= 90 ? c - 65 : -1;
  }
  function mountInteractiveQuizzes() {
    $$('#app-container .quiz-item').forEach(item => {
      if (item.dataset.interactiveMounted) return;
      const ans = item.querySelector('.quiz-answer');
      const ol = item.querySelector('.quiz-options');
      if (!ans || !ol) return;
      // Pull correct letter from "<strong>B.</strong>"
      const strong = ans.querySelector('strong');
      const m = strong && strong.textContent.match(/([A-Z])/);
      const correctIdx = m ? letterToIndex(m[1]) : -1;
      if (correctIdx < 0) return;

      item.dataset.interactiveMounted = '1';
      item.dataset.correct = String(correctIdx);
      item.classList.add('quiz-interactive');

      const lis = Array.from(ol.children);
      lis.forEach((li, i) => {
        const text = li.innerHTML;
        const letter = String.fromCharCode(65 + i);
        li.innerHTML = `
          <button type="button" class="quiz-opt" data-idx="${i}">
            <span class="quiz-opt-letter">${letter}</span>
            <span class="quiz-opt-text">${text}</span>
          </button>
        `;
      });

      ol.addEventListener('click', (e) => {
        const btn = e.target.closest('.quiz-opt');
        if (!btn || item.classList.contains('quiz-answered')) return;
        const idx = Number(btn.dataset.idx);
        const correct = idx === correctIdx;
        item.classList.add('quiz-answered', correct ? 'quiz-correct' : 'quiz-incorrect');
        Array.from(ol.querySelectorAll('.quiz-opt')).forEach((b, i) => {
          if (i === correctIdx) b.classList.add('is-correct');
          if (i === idx && !correct) b.classList.add('is-wrong');
          b.disabled = true;
        });
        // Reveal explanation
        ans.classList.add('visible');
        const reveal = item.querySelector('.quiz-reveal');
        if (reveal) reveal.style.display = 'none';
        // Mark this quiz revealed in progress (re-uses existing storage)
        try {
          const route = (typeof parseRoute === 'function') ? parseRoute() : null;
          if (route && route.page === 'class') {
            const allItems = $$('#app-container .quiz-item');
            const itemIdx = allItems.indexOf(item);
            if (itemIdx >= 0 && typeof markQuizRevealed === 'function') {
              markQuizRevealed(route.moduleId, route.classId, itemIdx);
              if (typeof updateProgressBar === 'function') updateProgressBar();
            }
          }
        } catch {}
      });
    });
  }

  // -----------------------------------------------------------
  // CLASS-PAGE LIFECYCLE
  // -----------------------------------------------------------
  function isClassPage() {
    return location.hash.startsWith('#/module/') && location.hash.includes('/class/');
  }
  function refresh() {
    if (isClassPage()) {
      mountReadingTime();
      buildClassTOC();
      mountCopyButtons();
      mountInteractiveQuizzes();
      updateClassTOCActive();
    } else {
      removeClassTOC();
    }
    updateScrollProgress();
  }

  // Watch the app container for re-renders.
  function init() {
    ensureScrollProgress();
    const container = document.getElementById('app-container');
    if (container) {
      const obs = new MutationObserver(() => {
        // Defer to next frame so dependent functions in app.js (highlighting,
        // quiz progress restoration) finish first.
        requestAnimationFrame(refresh);
      });
      obs.observe(container, { childList: true, subtree: false });
    }
    window.addEventListener('hashchange', () => requestAnimationFrame(refresh));
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
