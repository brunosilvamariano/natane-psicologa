// ─── NAV SCROLL ───
const nav = document.getElementById('mainNav');
const scrollHandler = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('toTop').classList.toggle('visible', window.scrollY > 500);
};
window.addEventListener('scroll', scrollHandler, { passive: true });
scrollHandler();

// ─── MOBILE MENU ───
const burger  = document.getElementById('navBurger');
const mobMenu = document.getElementById('mobMenu');

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  mobMenu.classList.toggle('open', open);
  mobMenu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobMenu.querySelectorAll('.mob-link, .mob-cta').forEach(el => {
  el.addEventListener('click', () => {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
    mobMenu.classList.remove('open');
    mobMenu.setAttribute('aria-hidden', true);
    document.body.style.overflow = '';
  });
});

// ─── REVEAL ON SCROLL ───
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ─── SCROLL TO TOP ───
document.getElementById('toTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── SMOOTH ANCHOR LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── FAQ ICON TOGGLE ───
document.querySelectorAll('.faq__item').forEach(item => {
  item.addEventListener('toggle', () => {
    const icon = item.querySelector('.faq__q i');
    if (!icon) return;
    icon.className = item.open ? 'bi bi-dash' : 'bi bi-plus';
  });
});