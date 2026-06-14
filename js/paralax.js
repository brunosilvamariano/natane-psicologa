/* ============================================================
   NATANE GONÇALVES — paralax.js
   Parallax suave para a seção CTA
   Vanilla JS · sem dependências · respeita reduced-motion
============================================================ */

(function () {
  'use strict';

  const prefersReduced =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) return;

  const bg = document.querySelector('.cta-section__bg');
  if (!bg) return;

  let rafId = null;
  let lastY  = -1;
  const STRENGTH = 0.18; // 0 = sem efeito, 0.3 = intenso

  function getOffset() {
    const section = bg.closest('.cta-section');
    if (!section) return 0;

    const rect   = section.getBoundingClientRect();
    const winH   = window.innerHeight;
    const center = rect.top + rect.height / 2 - winH / 2;
    return center * STRENGTH;
  }

  function update() {
    const offset = getOffset();

    // Só atualiza se mudou (evita repaint desnecessário)
    if (Math.abs(offset - lastY) < 0.3) {
      rafId = null;
      return;
    }

    lastY = offset;
    bg.style.transform = `translateY(${offset.toFixed(2)}px)`;
    rafId = null;
  }

  function onScroll() {
    if (!rafId) {
      rafId = requestAnimationFrame(update);
    }
  }

  // Roda no load e no scroll
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();
