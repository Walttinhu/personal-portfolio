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


// Role typing
(function loopRole(){
  const roleElement = $('#role');
  if (!roleElement) return;
  const text = 'Front End Developer Junior';
  const typeDelay = 80, eraseDelay = 50, hold = 900;
  let i = 0, typing = true;
  function tick(){
    if (typing){
      roleElement.textContent = text.slice(0, i++);
      if (i <= text.length) return setTimeout(tick, typeDelay);
      typing = false; return setTimeout(tick, hold);
    } else {
      roleElement.textContent = text.slice(0, i--);
      if (i >= 0) return setTimeout(tick, eraseDelay);
      typing = true; i = 0; return setTimeout(tick, typeDelay);
    }
  }
  tick();
})();

// meter circles animation
(function initMeters(){
  $$('.meter .fg').forEach(c => {
    const r = Number(c.getAttribute('r'));
    const C = 2 * Math.PI * r;
    const p = Number(c.dataset.percent || 0);
    c.style.strokeDasharray = C;
    c.style.strokeDashoffset = C;
    const offset = C - (C * p / 100);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting){
          c.style.strokeDashoffset = offset;
          obs.disconnect();
        }
      });
    }, { threshold: .4 });
    obs.observe(c);
  });
})();


// carrossel bottons (skills and projects)
$$('.cbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    const dir = Number(btn.dataset.dir || 1);
    const track = document.querySelector(btn.dataset.target);
    if (!track) return;
    const slide = track.querySelector('.slide');
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 26;
    const step = slide ? slide.getBoundingClientRect().width + gap : 340;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  });
});


// Contact form

emailjs.init('HcN1n2Sb6BepqSVT-'); // Public Key

const form = document.querySelector('#contactForm');
const status = document.querySelector('#status');

if(form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const message = document.querySelector('#message').value.trim();

    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!name || !okEmail || message.length < 1){ // to accept any message
      status.textContent = 'Please fill in all fields correctly.';
      return;
    }

    emailjs.send('service_ovs3r1h', 'template_92dxczr', { name, email, message })
      .then(() => {
        status.textContent = 'Message sent successfully! Thank you!';
        form.reset();
      })
      .catch((err) => {
        console.error(err);
        status.textContent = 'Oops! Something went wrong, try again.';
      });
  });
}
