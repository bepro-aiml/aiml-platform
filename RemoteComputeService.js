// ============================================================
// RemoteComputeService — OpenRouter (serverless, OpenAI-compatible)
// Exposed globally as window.RemoteCompute.
//
// Usage:
//   const reply = await RemoteCompute.infer("prompt");
//   // reply = { ok: true, text, ms, tokens } OR { ok: false, error, code }
//
//   const status = await RemoteCompute.ping();
//   // status = { ok: true, ms } OR { ok: false, error }
//
// Config can be overridden at runtime before any call:
//   RemoteCompute.config.apiKey = '...';
//   RemoteCompute.config.model  = 'qwen/qwen-2.5-7b-instruct';
//
// API key loading order:
//   1. window.ENV.OPENROUTER_API_KEY     (generated from .env via make_env_js.py)
//   2. process.env.OPENROUTER_API_KEY    (when bundled)
//   3. config.apiKey set at runtime
// Never paste a real key directly into this file — it goes in .env.
// ============================================================

(function () {
  const ENV = (typeof window !== 'undefined' && window.ENV) || {};
  const procEnv = (typeof process !== 'undefined' && process && process.env) || {};

  const config = {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model:    ENV.OPENROUTER_MODEL   || procEnv.OPENROUTER_MODEL   || 'qwen/qwen-2.5-7b-instruct',
    apiKey:   ENV.OPENROUTER_API_KEY || procEnv.OPENROUTER_API_KEY || '',
    referer:  ENV.OPENROUTER_REFERER || procEnv.OPENROUTER_REFERER || 'http://localhost:8000',
    title:    ENV.OPENROUTER_TITLE   || procEnv.OPENROUTER_TITLE   || 'Burgut AI Foundry',
    timeoutMs: 30000,
    codes: {
      NETWORK:  'NETWORK',     // fetch failed (DNS, offline, blocked)
      TIMEOUT:  'TIMEOUT',     // request exceeded timeoutMs
      HTTP:     'HTTP',        // server returned non-2xx
      PARSE:    'PARSE',       // response wasn't valid JSON / missing fields
      DISABLED: 'DISABLED',    // infer() called but service is disabled / no key
      NOKEY:    'NOKEY'        // OPENROUTER_API_KEY not set
    }
  };

  // Local fallback used when OpenRouter is unreachable or key is missing.
  function localMock(prompt, meta = {}) {
    const chain = meta.chain || 'DATA → PREP → LAYER → OUTPUT';
    const acc = meta.accuracy != null ? meta.accuracy.toFixed(0) : '??';
    return [
      `[LOCAL MOCK — OpenRouter unreachable]`,
      ``,
      `Architecture:  ${chain}`,
      `Accuracy:      ${acc}%`,
      ``,
      `Predicted class: ${Math.random() < 0.5 ? 'A' : 'B'}`,
      `Confidence:      ${(60 + Math.random() * 35).toFixed(1)}%`,
      ``,
      `This is a placeholder reply because OpenRouter did not respond.`,
      `Check OPENROUTER_API_KEY in .env, then run:`,
      `    python3 make_env_js.py`
    ].join('\n');
  }

  function _headers() {
    return {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      'HTTP-Referer':  config.referer,
      'X-Title':       config.title
    };
  }

  async function infer(prompt, meta = {}) {
    if (!config.apiKey) {
      return {
        ok: false, code: config.codes.NOKEY,
        error: 'OPENROUTER_API_KEY not set. Add it to .env, then run python3 make_env_js.py',
        text: localMock(prompt, meta)
      };
    }
    const t0 = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs);

    const body = JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: 'You are the inference engine for a student ML lab. Respond in 2-4 short lines: the predicted class, a confidence percentage, and one sentence of reasoning. No preamble.' },
        { role: 'user',   content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 180
    });

    try {
      const res = await fetch(config.endpoint, {
        method: 'POST',
        mode: 'cors',
        headers: _headers(),
        body,
        signal: controller.signal
      });
      clearTimeout(timer);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        return {
          ok: false,
          code: config.codes.HTTP,
          error: `HTTP ${res.status}: ${errText.slice(0, 160) || res.statusText}`,
          text: localMock(prompt, meta),
          ms: Math.round(performance.now() - t0)
        };
      }

      const data = await res.json();
      const text = (data && data.choices && data.choices[0] &&
                    data.choices[0].message && data.choices[0].message.content) || '';
      if (!text) {
        return {
          ok: false,
          code: config.codes.PARSE,
          error: 'Response missing choices[0].message.content',
          text: localMock(prompt, meta),
          ms: Math.round(performance.now() - t0)
        };
      }
      return {
        ok: true,
        text: text.trim(),
        tokens: (data.usage && data.usage.total_tokens) || null,
        model:  data.model || config.model,
        ms: Math.round(performance.now() - t0)
      };
    } catch (err) {
      clearTimeout(timer);
      const timedOut = err && err.name === 'AbortError';
      return {
        ok: false,
        code: timedOut ? config.codes.TIMEOUT : config.codes.NETWORK,
        error: timedOut ? `Timed out after ${config.timeoutMs}ms` : (err && err.message) || String(err),
        text: localMock(prompt, meta),
        ms: Math.round(performance.now() - t0)
      };
    }
  }

  // Lightweight health check — sends a 1-token completion to confirm
  // both the API surface AND the configured model are reachable.
  // Costs ~$0.0000003 per ping (negligible).
  async function ping() {
    if (!config.apiKey) return { ok: false, error: 'no api key', code: config.codes.NOKEY };
    const t0 = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(config.endpoint, {
        method: 'POST',
        mode: 'cors',
        headers: _headers(),
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 1
        }),
        signal: controller.signal
      });
      clearTimeout(timer);
      return { ok: res.ok, status: res.status, ms: Math.round(performance.now() - t0) };
    } catch (err) {
      clearTimeout(timer);
      return { ok: false, error: (err && err.message) || String(err), ms: Math.round(performance.now() - t0) };
    }
  }

  window.RemoteCompute = { config, infer, ping, localMock };
})();
