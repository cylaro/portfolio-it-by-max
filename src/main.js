import '@fontsource-variable/manrope';
import './style.css';
import * as THREE from 'three';
import { copy } from './content.js';

const app = document.querySelector('#app');
let lang = localStorage.getItem('max-lang') || 'en';
let activeProject = null;
let botStep = 0;
let previousFocus = null;

const icons = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
  cursor: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 3 10.5 9-5.2.8 3.1 6.1-2.1 1.1-3.1-6.1L7 18V3Z"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.7 12h16.6M12 3.5c2.2 2.3 3.2 5.1 3.2 8.5s-1 6.2-3.2 8.5c-2.2-2.3-3.2-5.1-3.2-8.5s1-6.2 3.2-8.5Z"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg>',
};

function render() {
  const t = copy[lang];
  document.documentElement.lang = lang;
  document.title = lang === 'en' ? 'Max — A developer. With a twist.' : 'Макс — Разработчик. С изюминкой.';
  app.innerHTML = `
    <div class="noise" aria-hidden="true"></div>
    <div class="cursor-glow" aria-hidden="true"></div>
    <header class="site-header">
      <a class="brand" href="#top" aria-label="Max, home"><span class="brand-mark">M</span><span>max<span class="brand-dot">.</span></span></a>
      <nav class="desktop-nav" aria-label="Main navigation">
        <a href="#work">${t.navWork}</a><a href="#about">${t.navAbout}</a><a href="#contact">${t.navContact}</a>
      </nav>
      <div class="header-tools"><button class="lang-switch" type="button" aria-label="Switch language"><span class="lang-en ${lang === 'en' ? 'active' : ''}">EN</span><span class="lang-slash">/</span><span class="lang-ru ${lang === 'ru' ? 'active' : ''}">RU</span></button><button class="menu-toggle" type="button" aria-label="${t.menu}" aria-expanded="false"><i></i><i></i></button></div>
    </header>
    <div class="mobile-menu" aria-hidden="true"><nav><a href="#work">${t.navWork}</a><a href="#about">${t.navAbout}</a><a href="#contact">${t.navContact}</a></nav><span>${t.location}</span></div>
    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy reveal"><p class="eyebrow"><span class="status-dot"></span>${t.available}</p><h1 id="hero-title"><span>${t.hero1}</span><span class="hero-outline">${t.hero2}</span></h1><p class="hero-intro">${t.intro}</p><a class="circle-link" href="#work"><span>${t.viewWork}</span>${icons.arrow}</a></div>
        <div class="hero-art reveal-delay" aria-label="Interactive 3D sculpture. ${t.sculpture}" role="img"><canvas id="hero-canvas"></canvas><div class="art-caption"><span class="caption-pulse"></span>${t.sculpture}</div><div class="art-index">01 <span>/</span> 04</div></div>
        <div class="hero-meta"><span>${t.heroNote}</span><a href="#work" class="scroll-cue"><span>${t.scroll}</span><i></i></a></div>
      </section>
      <div class="marquee" aria-hidden="true"><div class="marquee-track">${[...t.ribbon, ...t.ribbon].map((item) => `<span>${item} <b>✳</b></span>`).join('')}</div></div>
      <section class="work section-shell" id="work" aria-labelledby="work-title"><div class="section-heading reveal"><p class="eyebrow">${t.workLabel}</p><h2 id="work-title">${t.workTitle.replace('\n', '<br>')}</h2><p>${t.workIntro}</p></div><div class="project-stack"><article class="project-card forma reveal" data-project="forma"><div class="project-top"><span>${t.concept}</span><span>01 / 02</span></div><div class="forma-art"><div class="forma-sun"></div><div class="mountain mountain-back"></div><div class="mountain mountain-front"></div><div class="forma-house"><i></i><i></i><i></i></div><span class="forma-word">FORMA</span></div><div class="project-info"><div><p class="project-tag">${t.formaTag}</p><h3>Forma</h3><p>${t.formaDesc}</p></div><button class="text-button" data-open="forma">${t.projectAction}${icons.arrow}</button></div></article><article class="project-card relay reveal" data-project="relay"><div class="project-top"><span>${t.concept}</span><span>02 / 02</span></div><div class="relay-art"><div class="relay-orbit orbit-one"></div><div class="relay-orbit orbit-two"></div><div class="relay-orb"></div><span class="relay-word">RELAY</span><span class="relay-spark">✳</span></div><div class="project-info"><div><p class="project-tag">${t.relayTag}</p><h3>Relay</h3><p>${t.relayDesc}</p></div><button class="text-button" data-open="relay">${t.projectAction}${icons.arrow}</button></div></article></div></section>
      <section class="services section-shell" aria-labelledby="services-title"><div class="section-heading reveal"><p class="eyebrow">${t.servicesLabel}</p><h2 id="services-title">${t.servicesTitle.replace('\n', '<br>')}</h2></div><div class="service-list">${t.services.map((service, index) => `<article class="service-row reveal"><span class="service-number">0${index + 1}</span><div class="service-main"><h3>${service.title}</h3><p>${service.text}</p></div><div class="service-tags">${service.tags.map((tag) => `<span>${tag}</span>`).join('')}</div></article>`).join('')}</div></section>
      <section class="about section-shell" id="about" aria-labelledby="about-title"><div class="about-orbit reveal"><div class="orbit-ring ring-a"></div><div class="orbit-ring ring-b"></div><div class="about-sticker">${t.aboutSticker.replace('\n', '<br>')}</div><div class="about-initial">M<span>.</span></div><span class="orbit-star">✳</span></div><div class="about-copy reveal"><p class="eyebrow">${t.aboutLabel}</p><h2 id="about-title">${t.aboutTitle}</h2><p>${t.aboutText}</p><p>${t.aboutText2}</p><div class="about-note">${t.aboutNote} <span>↗</span></div></div></section>
      <section class="process section-shell" aria-labelledby="process-title"><div class="section-heading reveal"><p class="eyebrow">${t.processLabel}</p><h2 id="process-title">${t.processTitle.replace('\n', '<br>')}</h2></div><div class="process-grid">${t.process.map((step, index) => `<article class="process-item reveal"><span class="process-index">${String(index + 1).padStart(2, '0')}</span><div><h3>${step.title}</h3><p>${step.text}</p></div></article>`).join('')}</div></section>
      <section class="contact section-shell" id="contact" aria-labelledby="contact-title"><div class="contact-inner reveal"><div><p class="eyebrow">${t.contactLabel}</p><h2 id="contact-title">${t.contactTitle.replace('\n', '<br>')}</h2><p>${t.contactText}</p></div><div class="contact-actions"><a class="contact-button" href="https://t.me/cylaro" target="_blank" rel="noreferrer"><span>${t.contactCta}</span>${icons.arrow}</a><button class="copy-button" type="button" data-copy="@cylaro"><span>@cylaro</span><small>${t.copy}</small></button><span class="copy-feedback" role="status" aria-live="polite"></span></div></div><div class="contact-scribble" aria-hidden="true">✳</div></section>
    </main>
    <footer class="site-footer"><a class="brand" href="#top"><span class="brand-mark">M</span><span>max<span class="brand-dot">.</span></span></a><span>${t.footer}</span><span>${t.footerNote}</span><a href="#top" class="back-top">${t.backTop} ↑</a></footer>
      <div class="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" aria-hidden="true"><button class="modal-close" type="button" aria-label="${t.close}">${icons.close}</button><div class="modal-content"></div></div>
  `;
  bindEvents();
  initThree();
  initReveal();
}

function bindEvents() {
  document.querySelector('.lang-switch').addEventListener('click', () => { lang = lang === 'en' ? 'ru' : 'en'; localStorage.setItem('max-lang', lang); render(); });
  const menu = document.querySelector('.mobile-menu'); const toggle = document.querySelector('.menu-toggle');
  toggle.addEventListener('click', () => { const open = document.body.classList.toggle('menu-open'); toggle.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open); });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true'); }));
  document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => openProject(button.dataset.open)));
  document.querySelector('.modal-close').addEventListener('click', closeProject);
  document.querySelector('.project-modal').addEventListener('click', (event) => { if (event.target.classList.contains('project-modal')) closeProject(); });
  document.onkeydown = (event) => { if (event.key === 'Escape') closeProject(); };
  document.querySelector('.copy-button').addEventListener('click', async (event) => { const button = event.currentTarget; const feedback = document.querySelector('.copy-feedback'); try { await navigator.clipboard.writeText(button.dataset.copy); feedback.textContent = copy[lang].copied; } catch { feedback.textContent = copy[lang].copyFail; } setTimeout(() => { feedback.textContent = ''; }, 2600); });
  window.addEventListener('pointermove', (event) => { document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`); document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`); }, { passive: true });
}

function openProject(project) {
  activeProject = project; botStep = 0; previousFocus = document.activeElement; const t = copy[lang]; const modal = document.querySelector('.project-modal'); const content = document.querySelector('.modal-content'); modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open');
  content.innerHTML = project === 'forma' ? `<div class="modal-visual forma-modal"><div class="forma-sun"></div><div class="mountain mountain-back"></div><div class="mountain mountain-front"></div><div class="forma-house"><i></i><i></i><i></i></div><span class="forma-word">FORMA</span><div class="modal-visual-caption"><span>FORMA</span><small>ARCHITECTURE / 2024</small></div></div><div class="modal-copy"><p class="eyebrow">${t.demoNotice}</p><h2>${t.formaSubtitle}</h2><p>${t.formaBody}</p><a class="text-button" href="#contact" data-modal-contact>${t.formaLink}${icons.arrow}</a><button class="room-button" type="button" data-room-next>${t.formaNext} <span>↗</span></button><p class="room-name">${t.formaRooms[0]}</p></div>` : `<div class="modal-visual relay-modal"><div class="relay-orbit orbit-one"></div><div class="relay-orbit orbit-two"></div><div class="relay-orb"></div><span class="relay-word">RELAY</span><span class="relay-spark">✳</span><div class="modal-visual-caption"><span>RELAY</span><small>TELEGRAM BOT / DEMO</small></div></div><div class="modal-copy bot-copy"><p class="eyebrow">${t.demoNotice}</p><h2>${t.relayTitle}</h2><p>${t.relayBody}</p><div class="bot-window"><div class="bot-head"><span class="bot-avatar">R</span><span><b>Relay</b><small>${t.botStatus}</small></span><i></i></div><div class="bot-messages" id="bot-messages"><div class="bot-message bot-in">${t.botGreeting}</div><div class="bot-options" id="bot-options">${t.botServices.map((item) => `<button type="button" data-service="${item}">${item}</button>`).join('')}</div></div></div></div>`;
  document.querySelector('[data-modal-contact]')?.addEventListener('click', closeProject);
  document.querySelector('[data-room-next]')?.addEventListener('click', () => { const name = document.querySelector('.room-name'); const rooms = t.formaRooms; const next = (rooms.indexOf(name.textContent) + 1) % rooms.length; name.textContent = rooms[next]; document.querySelector('.forma-modal').classList.toggle('room-shift'); });
  document.querySelectorAll('[data-service]').forEach((button) => button.addEventListener('click', () => runBot(button.dataset.service)));
  const modalTitle = content.querySelector('.modal-copy h2');
  if (modalTitle) modalTitle.id = 'project-modal-title';
  modal.onkeydown = (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  requestAnimationFrame(() => modal.querySelector('.modal-close')?.focus());
}

function runBot(service) {
  const t = copy[lang]; const messages = document.querySelector('#bot-messages'); const options = document.querySelector('#bot-options'); if (!messages || !options) return;
  options.remove(); messages.insertAdjacentHTML('beforeend', `<div class="bot-message bot-out">${service}</div><div class="bot-message bot-in bot-typing">•••</div>`);
  setTimeout(() => { document.querySelector('.bot-typing')?.remove(); messages.insertAdjacentHTML('beforeend', `<div class="bot-message bot-in">${t.botPick}</div><div class="bot-options time-options"><button type="button" data-time="10:30">10:30</button><button type="button" data-time="14:00">14:00</button><button type="button" data-time="17:30">17:30</button></div>`); document.querySelectorAll('[data-time]').forEach((button) => button.addEventListener('click', () => confirmBot(button.dataset.time))); messages.scrollTop = messages.scrollHeight; }, 500);
}

function confirmBot(time) { const t = copy[lang]; const messages = document.querySelector('#bot-messages'); document.querySelector('.time-options')?.remove(); messages.insertAdjacentHTML('beforeend', `<div class="bot-message bot-out">${time}</div><div class="bot-message bot-in">${t.botConfirm} ${time}.</div><div class="bot-note">${t.botEnd}</div><button class="bot-reset" type="button">${t.botReset}</button>`); messages.scrollTop = messages.scrollHeight; document.querySelector('.bot-reset').addEventListener('click', () => { document.querySelector('.bot-messages').innerHTML = `<div class="bot-message bot-in">${t.botGreeting}</div><div class="bot-options" id="bot-options">${t.botServices.map((item) => `<button type="button" data-service="${item}">${item}</button>`).join('')}</div>`; document.querySelectorAll('[data-service]').forEach((button) => button.addEventListener('click', () => runBot(button.dataset.service))); }); }

function closeProject() { const modal = document.querySelector('.project-modal'); if (!modal || !modal.classList.contains('is-open')) return; modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); activeProject = null; modal.onkeydown = null; if (previousFocus && document.contains(previousFocus)) previousFocus.focus(); }

function initReveal() { const items = document.querySelectorAll('.reveal, .reveal-delay'); if (!('IntersectionObserver' in window)) { items.forEach((item) => item.classList.add('is-visible')); return; } const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.14 }); items.forEach((item) => observer.observe(item)); }

function initThree() {
  const canvas = document.querySelector('#hero-canvas'); if (!canvas) return; const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100); camera.position.z = 5.4; const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const group = new THREE.Group(); scene.add(group); const geometry = new THREE.IcosahedronGeometry(1.5, 2); const material = new THREE.MeshPhysicalMaterial({ color: 0xc8b4ee, roughness: 0.18, metalness: 0.3, transmission: 0.12, clearcoat: 0.8, clearcoatRoughness: 0.14, flatShading: true }); const mesh = new THREE.Mesh(geometry, material); group.add(mesh);
  const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 22), new THREE.LineBasicMaterial({ color: 0xf4effd, transparent: true, opacity: 0.22 })); group.add(wire); const halo = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.008, 8, 100), new THREE.MeshBasicMaterial({ color: 0xc8b4ee, transparent: true, opacity: 0.44 })); halo.rotation.x = 1.05; group.add(halo);
  scene.add(new THREE.AmbientLight(0xcbbcf1, 2.1)); const key = new THREE.DirectionalLight(0xffffff, 4); key.position.set(3, 4, 5); scene.add(key); const fill = new THREE.PointLight(0x8b70c5, 14, 12); fill.position.set(-4, -1, 3); scene.add(fill);
  let pointerX = 0; let pointerY = 0; window.addEventListener('pointermove', (event) => { pointerX = (event.clientX / innerWidth - 0.5) * 2; pointerY = (event.clientY / innerHeight - 0.5) * 2; }, { passive: true });
  const resize = () => { const box = canvas.getBoundingClientRect(); renderer.setSize(box.width, box.height, false); camera.aspect = box.width / box.height; camera.updateProjectionMatrix(); }; resize(); window.addEventListener('resize', resize); const clock = new THREE.Clock();
  const animate = () => { const elapsed = clock.getElapsedTime(); group.rotation.y += 0.0028; group.rotation.x += (pointerY * 0.15 - group.rotation.x) * 0.018; group.rotation.y += (pointerX * 0.15) * 0.004; halo.rotation.z = elapsed * 0.08; renderer.render(scene, camera); requestAnimationFrame(animate); }; animate();
}

render();
