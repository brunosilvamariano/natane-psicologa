/* ============================================================
   NATANE GONÇALVES PSICÓLOGA — script.js
   Funcionalidades:
   1. Nav scroll (classe .scrolled + botão topo)
   2. Menu mobile (burger)
   3. AOS — Animate On Scroll (IntersectionObserver)
   4. Scroll suave para âncoras
   5. FAQ — alternância de ícone +/−
============================================================ */

'use strict';

/* ── 1. NAV SCROLL ── */
const nav      = document.getElementById('mainNav');
const toTopBtn = document.getElementById('toTop');

const onScroll = () => {
  const scrolled = window.scrollY > 40;
  nav.classList.toggle('scrolled', scrolled);
  toTopBtn.classList.toggle('visible', window.scrollY > 500);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // estado inicial

/* ── 2. BOTÃO VOLTAR AO TOPO ── */
toTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 3. MENU MOBILE ── */
const burger  = document.getElementById('navBurger');
const mobMenu = document.getElementById('mobMenu');

function openMenu() {
  const scrollY = window.scrollY;
  document.body.style.top = `-${scrollY}px`;
  document.body.classList.add('no-scroll');

  burger.classList.add('open');
  burger.setAttribute('aria-expanded', true);
  mobMenu.classList.add('open');
  mobMenu.setAttribute('aria-hidden', false);
}

function closeMenu() {
  const top = document.body.style.top;
  document.body.classList.remove('no-scroll');
  document.body.style.top = '';
  window.scrollTo({ top: parseInt(top || '0') * -1, behavior: 'instant' });

  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
  mobMenu.classList.remove('open');
  mobMenu.setAttribute('aria-hidden', true);
}

burger.addEventListener('click', () => {
  burger.classList.contains('open') ? closeMenu() : openMenu();
});

// Fecha ao clicar em qualquer link ou CTA do menu
mobMenu.querySelectorAll('.mob-link, .mob-cta').forEach(el => {
  el.addEventListener('click', closeMenu);
});

// Fecha ao pressionar Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobMenu.classList.contains('open')) closeMenu();
});

// Fecha ao clicar fora do menu
document.addEventListener('click', e => {
  if (
    mobMenu.classList.contains('open') &&
    !mobMenu.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    closeMenu();
  }
});

/* ── 4. AOS — ANIMATE ON SCROLL ──
   Seleciona todos os elementos com classes aos-fade-*
   e adiciona .aos-in quando entram no viewport.
─────────────────────────────────────────────────────────── */
const aosEls = document.querySelectorAll('[class*="aos-fade"]');

const aosObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-in');
        aosObserver.unobserve(entry.target); // anima apenas uma vez
      }
    });
  },
  {
    threshold:  0.07,
    rootMargin: '0px 0px -20px 0px'
  }
);

aosEls.forEach(el => aosObserver.observe(el));

/* ── 5. SCROLL SUAVE PARA ÂNCORAS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
    ) || 76;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 6. FAQ — ÍCONE +/− ── */
document.querySelectorAll('.faq__item').forEach(item => {
  item.addEventListener('toggle', () => {
    const icon = item.querySelector('.faq__q i');
    if (!icon) return;
    icon.className = item.open ? 'bi bi-dash' : 'bi bi-plus';
  });
});