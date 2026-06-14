/* ============================================================
   NATANE GONÇALVES — signals.js
   Carrossel da seção Sinais de Atenção
   Sem autoplay · Navegação por dots · Swipe/drag suporte
============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    const carousel = document.getElementById('signalsCarousel');
    const track    = document.getElementById('signalsTrack');
    const dotsWrap = document.getElementById('signalsDots');

    if (!carousel || !track || !dotsWrap) return;

    const cards = Array.from(track.children);
    let currentPage = 0;
    let perPage     = getPerPage();
    let totalPages  = Math.ceil(cards.length / perPage);

    /* ── Quantos cards por página conforme viewport ── */
    function getPerPage() {
      const w = window.innerWidth;
      if (w <= 480) return 1;
      if (w <= 720) return 2;
      if (w <= 1024) return 3;
      return 4;
    }

    /* ── Calcula a largura de um card + gap ── */
    function getCardStep() {
      const card = cards[0];
      if (!card) return 0;
      const style  = getComputedStyle(track);
      const gap    = parseFloat(style.gap) || 20;
      return card.offsetWidth + gap;
    }

    /* ── Monta os dots ── */
    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement('button');
        btn.className   = 'signals__dot' + (i === currentPage ? ' signals__dot--active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', i === currentPage ? 'true' : 'false');
        btn.setAttribute('aria-label', 'Página ' + (i + 1) + ' de ' + totalPages);
        btn.addEventListener('click', function () { goTo(i); });
        dotsWrap.appendChild(btn);
      }
    }

    /* ── Atualiza estado dos dots ── */
    function updateDots() {
      const dots = dotsWrap.querySelectorAll('.signals__dot');
      dots.forEach(function (d, i) {
        const active = i === currentPage;
        d.classList.toggle('signals__dot--active', active);
        d.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    /* ── Move o track ── */
    function goTo(page) {
      currentPage = Math.max(0, Math.min(page, totalPages - 1));
      const offset = getCardStep() * currentPage * perPage;
      track.style.transform = 'translateX(-' + offset + 'px)';
      updateDots();
    }

    /* ── Recalcula ao redimensionar ── */
    function recalc() {
      const newPer = getPerPage();
      if (newPer !== perPage) {
        perPage    = newPer;
        totalPages = Math.ceil(cards.length / perPage);
        currentPage = 0;
        buildDots();
      }
      goTo(currentPage);
    }

    /* ── Inicializa ── */
    buildDots();
    goTo(0);

    window.addEventListener('resize', debounce(recalc, 150));

    /* ─────────────────────────────────────────
       DRAG / SWIPE (mouse + touch)
    ───────────────────────────────────────── */
    let startX   = 0;
    let isDragging = false;
    let hasMoved   = false;
    const THRESHOLD = 50; // px mínimos para mudar página

    /* Mouse */
    carousel.addEventListener('mousedown', function (e) {
      startX     = e.clientX;
      isDragging = true;
      hasMoved   = false;
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      if (Math.abs(e.clientX - startX) > 5) hasMoved = true;
    });

    window.addEventListener('mouseup', function (e) {
      if (!isDragging) return;
      isDragging = false;
      if (!hasMoved) return;
      const diff = startX - e.clientX;
      if (diff > THRESHOLD)       goTo(currentPage + 1);
      else if (diff < -THRESHOLD) goTo(currentPage - 1);
    });

    /* Impede clique acidental depois de arrastar */
    carousel.addEventListener('click', function (e) {
      if (hasMoved) e.preventDefault();
    });

    /* Touch */
    carousel.addEventListener('touchstart', function (e) {
      startX     = e.touches[0].clientX;
      isDragging = true;
      hasMoved   = false;
    }, { passive: true });

    carousel.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      if (Math.abs(e.touches[0].clientX - startX) > 5) hasMoved = true;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;
      if (!hasMoved) return;
      const diff = startX - e.changedTouches[0].clientX;
      if (diff > THRESHOLD)       goTo(currentPage + 1);
      else if (diff < -THRESHOLD) goTo(currentPage - 1);
    });

    /* Teclado quando o carrossel estiver em foco */
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentPage + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(currentPage - 1); }
    });

    /* ── Utilitário debounce ── */
    function debounce(fn, delay) {
      let timer;
      return function () {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
      };
    }

  });

}());