// ===== Utilidades =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ===== Animación de aparición de secciones con IntersectionObserver =====
const sections = $$("section");
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.15 });
sections.forEach(s => io.observe(s));

// ===== FAQ desplegable =====
$$('.faq-item button').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.nextElementSibling;
    const visible = panel.style.display === 'block';
    panel.style.display = visible ? 'none' : 'block';
  });
});

// ===== Confeti al cargar =====
function lanzarConfeti() {
  if (typeof confetti !== 'function') return;
  const end = Date.now() + 3 * 1000;
  const colores = ['#ff80ab', '#ba68c8'];
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: colores });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: colores });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
window.addEventListener('load', lanzarConfeti);

// ===== Tema oscuro/claro =====
const themeBtn = $('#theme-toggle');
const applyTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro');
};

// Cargar preferencia guardada o del sistema
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(saved ? saved : (prefersDark ? 'dark' : 'light'));

themeBtn.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ===== Botón "volver arriba" =====
const backToTop = $('#backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Barra de progreso de lectura =====
const progress = $('#progress');
const updateProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progress.style.width = percent + '%';
};
window.addEventListener('scroll', updateProgress);
window.addEventListener('resize', updateProgress);
updateProgress();

// ===== Resaltado de link activo en el menú =====
const navLinks = $$('nav a');
const sectionMap = sections.map(sec => ({ id: sec.id, top: 0 }));
const computeTops = () => {
  sectionMap.forEach(s => {
    const el = document.getElementById(s.id);
    s.top = el.getBoundingClientRect().top + window.scrollY - 120; // offset por navbar
  });
};

const highlightLink = () => {
  const y = window.scrollY;
  let currentId = sectionMap[0]?.id;
  for (const s of sectionMap) if (y >= s.top) currentId = s.id;
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + currentId));
};

window.addEventListener('scroll', highlightLink);
window.addEventListener('resize', () => { computeTops(); highlightLink(); });
window.addEventListener('load', () => { computeTops(); highlightLink(); });

// ===== Año dinámico en el footer =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();