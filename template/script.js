"use strict";

/**
 * Secure Reverse-String — script.js
 *
 * Security measures applied:
 *  1. Strict mode enabled.
 *  2. IIFE scope — nothing leaks to globalThis.
 *  3. Output via textContent only (never innerHTML / insertAdjacentHTML).
 *  4. Input sanitised: control chars and zero-width chars stripped.
 *  5. Hard character limit enforced in JS (mirrors HTML maxlength).
 *  6. Unicode-safe reversal using Intl.Segmenter to handle grapheme clusters.
 *  7. Debounced input handler to limit processing on rapid keystrokes.
 *  8. Object.freeze on config to prevent runtime mutation.
 */

(() => {
  /* ── Config ── */
  const CONFIG = Object.freeze({
    MAX_LENGTH: 500,
    DEBOUNCE_MS: 60,
    WARN_THRESHOLD: 400,
    // Regex: strip C0/C1 control chars and common zero-width / bidi chars
    SANITISE_RE: /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u200B-\u200F\u2028-\u202F\uFEFF]/g,
  });

  /* ── DOM refs (cached once) ── */
  const inputEl   = document.getElementById("inputText");
  const resultEl  = document.getElementById("resultText");
  const boxEl     = document.getElementById("resultBox");
  const counterEl = document.getElementById("charCount");

  if (!inputEl || !resultEl || !boxEl || !counterEl) {
    console.error("[reverse-string] Required DOM elements not found.");
    return;
  }

  /* ── Helpers ── */

  /**
   * Sanitise user input:
   *  - Remove dangerous / invisible characters.
   *  - Enforce max length.
   */
  function sanitise(raw) {
    return raw.replace(CONFIG.SANITISE_RE, "").slice(0, CONFIG.MAX_LENGTH);
  }

  /**
   * Unicode-safe string reversal using Intl.Segmenter (grapheme clusters).
   * Handles combined emoji (👨‍👩‍👧), flags (🇺🇸), skin tones, etc. correctly.
   * Falls back to Array.from (surrogate-pair-safe) if Segmenter is unavailable.
   */
  function reverseString(str) {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter();
      return Array.from(segmenter.segment(str), s => s.segment).reverse().join("");
    }
    return Array.from(str).reverse().join("");
  }

  /**
   * Update the character counter and apply visual warnings.
   */
  function updateCounter(length) {
    counterEl.textContent = `${length} / ${CONFIG.MAX_LENGTH}`;

    counterEl.classList.toggle("char-count--warn",
      length >= CONFIG.WARN_THRESHOLD && length < CONFIG.MAX_LENGTH);

    counterEl.classList.toggle("char-count--limit",
      length >= CONFIG.MAX_LENGTH);
  }

  /**
   * Core render — processes the current input value.
   */
  function render() {
    const clean = sanitise(inputEl.value);

    // Reflect sanitised value back (strips injected chars visually)
    if (inputEl.value !== clean) {
      inputEl.value = clean;
    }

    updateCounter(clean.length);

    if (clean.length === 0) {
      resultEl.className   = "result-placeholder";
      resultEl.textContent = "Start typing\u2026"; // safe literal
      boxEl.classList.remove("result-box--active");
      return;
    }

    resultEl.className   = "result-text";
    resultEl.textContent = reverseString(clean); // textContent — XSS-safe
    boxEl.classList.add("result-box--active");
  }

  /**
   * Simple trailing-edge debounce.
   */
  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /* ── Event binding ── */
  const debouncedRender = debounce(render, CONFIG.DEBOUNCE_MS);

  inputEl.addEventListener("input", debouncedRender);

  // Also handle paste (may bypass input event in some browsers)
  inputEl.addEventListener("paste", () => {
    requestAnimationFrame(render);
  });

  // Initial render in case browser auto-fills the field
  render();
})();