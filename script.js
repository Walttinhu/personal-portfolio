// util
const $ = (s, sc=document) => sc.querySelector(s);
const $$ = (s, sc=document) => [...sc.querySelectorAll(s)];

// year
const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

// theme light/dark with persisting
const THEME_KEY = 'walter-theme';
const themeBtn = $('#themeBtn');
function applyTheme(mode){
  document.body.classList.toggle('theme-light', mode === 'light');
  document.body.classList.toggle('theme-dark', mode !== 'light');
}
applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
if (themeBtn){
  themeBtn.addEventListener('click', () => {
    const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
}

// mobile menu + active underline
const hamburguer = $('.hamburguer');
const menu = $('#menu');
if (hamburguer && menu) {
  hamburguer.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    hamburguer.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') menu.classList.remove('open'); });
}

// active section
const links = $$('.navlink');
function setActive(){
  let id = 'inicio';
  const sections = ['inicio','skills','projetos','contato'];
  for (const s of sections){
    const el = document.getElementById(s);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120){ id = s; break; }
  }
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
}
document.addEventListener('scroll', setActive);
setActive();
