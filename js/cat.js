/* Ubuntu Bible — "Kernel" the cat: an animated companion that sits at the bottom of the page and
   reacts to whatever you visit (watch · jump · stretch · sleep). Original SVG artwork. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  const CAT_SVG = `
  <svg class="kit" viewBox="0 0 120 112" aria-hidden="true">
    <defs>
      <linearGradient id="kFur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffa45c"/><stop offset="1" stop-color="#ec7a2c"/></linearGradient>
      <radialGradient id="kBelly" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fff3e4"/><stop offset="1" stop-color="#ffd9b3"/></radialGradient>
    </defs>
    <ellipse class="k-shadow" cx="60" cy="106" rx="32" ry="4.5"/>
    <g class="k-all">
      <g class="k-tail"><path d="M36 96 C16 96 8 78 14 64 C18 54 28 52 30 58 C32 63 26 64 24 70 C21 79 26 88 40 90" fill="url(#kFur)" stroke="#5a2a1c" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M16 70 l7 2 M15 79 l8 0" stroke="#c75a1c" stroke-width="2.2" stroke-linecap="round"/></g>
      <g class="k-body">
        <path d="M34 100 C26 82 34 58 60 57 C86 58 94 82 86 100 Z" fill="url(#kFur)" stroke="#5a2a1c" stroke-width="1.8" stroke-linejoin="round"/>
        <ellipse cx="60" cy="84" rx="13" ry="14" fill="url(#kBelly)"/>
        <path d="M38 76 q6 2 9 -1 M36 86 q6 2 9 -1 M83 76 q-6 2 -9 -1 M85 86 q-6 2 -9 -1" stroke="#c75a1c" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </g>
      <g class="k-legs">
        <rect x="49" y="86" width="10" height="17" rx="5" fill="url(#kFur)" stroke="#5a2a1c" stroke-width="1.6"/>
        <rect x="61" y="86" width="10" height="17" rx="5" fill="url(#kFur)" stroke="#5a2a1c" stroke-width="1.6"/>
        <ellipse cx="54" cy="102" rx="5.5" ry="2.6" fill="#fff3e4"/><ellipse cx="66" cy="102" rx="5.5" ry="2.6" fill="#fff3e4"/>
      </g>
      <g class="k-head">
        <path class="k-ear k-ear-l" d="M40 32 L37 9 L56 22 Z" fill="url(#kFur)" stroke="#5a2a1c" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M42 27 L41 15 L51 22 Z" fill="#ffb3a7"/>
        <path class="k-ear k-ear-r" d="M80 32 L83 9 L64 22 Z" fill="url(#kFur)" stroke="#5a2a1c" stroke-width="1.8" stroke-linejoin="round"/>
        <path class="k-ear-in-r" d="M78 27 L79 15 L69 22 Z" fill="#ffb3a7"/>
        <ellipse cx="60" cy="39" rx="25" ry="21" fill="url(#kFur)" stroke="#5a2a1c" stroke-width="1.8"/>
        <path d="M55 20 l1 7 M60 19 l0 8 M65 20 l-1 7" stroke="#c75a1c" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="60" cy="48" rx="10" ry="7" fill="url(#kBelly)"/>
        <ellipse class="k-blush" cx="44" cy="46" rx="4" ry="2.4"/><ellipse class="k-blush" cx="76" cy="46" rx="4" ry="2.4"/>
        <g class="k-eye k-eye-l"><ellipse cx="50" cy="37" rx="5.4" ry="6.4" fill="#fff"/><g class="k-pupil"><ellipse cx="50" cy="38" rx="3.2" ry="4.2" fill="#2a1622"/><circle cx="51.3" cy="36.3" r="1.2" fill="#fff"/></g></g>
        <g class="k-eye k-eye-r"><ellipse cx="70" cy="37" rx="5.4" ry="6.4" fill="#fff"/><g class="k-pupil"><ellipse cx="70" cy="38" rx="3.2" ry="4.2" fill="#2a1622"/><circle cx="71.3" cy="36.3" r="1.2" fill="#fff"/></g></g>
        <path class="k-lid" d="M44.5 37 q5.5 4 11 0 M64.5 37 q5.5 4 11 0" stroke="#5a2a1c" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M57.4 45 h5.2 l-2.6 3 z" fill="#e26a7d" stroke="#5a2a1c" stroke-width=".8" stroke-linejoin="round"/>
        <path class="k-mouth" d="M60 48 q-2.6 3.4 -5.6 1.6 M60 48 q2.6 3.4 5.6 1.6" stroke="#5a2a1c" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        <ellipse class="k-yawn" cx="60" cy="51" rx="3" ry="0" fill="#7a2335"/>
        <path d="M36 44 l-12 -2 M36 48 l-12 1 M84 44 l12 -2 M84 48 l12 1" stroke="#5a2a1c" stroke-width="1" stroke-linecap="round" opacity=".55"/>
      </g>
      <g class="k-zzz"><text x="86" y="22">z</text><text x="94" y="12">z</text><text x="102" y="4">z</text></g>
    </g>
  </svg>`;
  const MINI = `<svg class="kmini" viewBox="0 0 40 36" aria-hidden="true">
      <path class="m-ear-l" d="M7 15 L6 2 L16 9 Z" fill="#f08a3c" stroke="#5a2a1c" stroke-width="1.5" stroke-linejoin="round"/>
      <path class="m-ear-r" d="M33 15 L34 2 L24 9 Z" fill="#f08a3c" stroke="#5a2a1c" stroke-width="1.5" stroke-linejoin="round"/>
      <ellipse cx="20" cy="20" rx="15" ry="13" fill="#f08a3c" stroke="#5a2a1c" stroke-width="1.5"/>
      <path d="M17 8.5 v4 M20 8 v5 M23 8.5 v4" stroke="#c75a1c" stroke-width="1.6" stroke-linecap="round"/>
      <g class="m-eyes"><ellipse cx="14" cy="19" rx="2.4" ry="3" fill="#2a1622"/><ellipse cx="26" cy="19" rx="2.4" ry="3" fill="#2a1622"/></g>
      <path d="M18.6 24 h2.8 l-1.4 1.6 z" fill="#e26a7d"/>
      <path d="M20 25.6 q-1.6 2 -3.4 .8 M20 25.6 q1.6 2 3.4 .8" stroke="#5a2a1c" stroke-width="1" fill="none" stroke-linecap="round"/>
    </svg>`;

  /* ---------- header button ---------- */
  const hdr = $('.hbtns');
  const btn = document.createElement('button');
  btn.className = 'hbtn'; btn.id = 'btnCat'; btn.title = 'Kitty companion'; btn.setAttribute('aria-label', 'Show or hide the cat companion'); btn.setAttribute('aria-pressed', 'false');
  btn.innerHTML = MINI;
  hdr.insertBefore(btn, hdr.firstChild);

  /* ---------- pet ---------- */
  const pet = document.createElement('div');
  pet.id = 'catPet'; pet.className = 'catpet'; pet.hidden = true;
  pet.innerHTML = `<div class="cat-bubble" aria-live="polite"></div><button class="cat" aria-label="Kitty — tap to see what you visited">${CAT_SVG}</button>`;
  document.body.appendChild(pet);
  const cat = $('.cat', pet), bubble = $('.cat-bubble', pet), kit = $('.kit', pet);
  const LOG_MAX = 30;
  let log = []; try { log = JSON.parse(store.get('ub-cat-log') || '[]'); } catch (e) {} if (!Array.isArray(log)) log = [];
  let on = false, gestureT = 0, bubbleT = 0, idleT = 0, sleepT = 0, state = 'sit', panelOpen = false;

  const MOODS = { cmd: ['👀', 'Ooh, a command!'], card: ['📖', 'Reading…'], section: ['🐾', 'New place!'], runOk: ['✨', 'Nice run!'], runErr: ['😾', 'Hmm… that failed'] };
  function gesture(name, ms) {
    clearTimeout(gestureT);
    cat.classList.remove('jump', 'watch', 'stretch', 'sleep', 'wiggle', 'walk');
    void cat.offsetWidth;                       // restart CSS animation
    cat.classList.add(name); state = name;
    gestureT = setTimeout(() => { cat.classList.remove(name); state = 'sit'; }, ms);
  }
  function say(html, ms = 3200) {
    if (panelOpen) return;
    bubble.innerHTML = html; bubble.classList.add('on');
    clearTimeout(bubbleT); bubbleT = setTimeout(() => bubble.classList.remove('on'), ms);
  }
  function lookAt(x, y) {
    const r = kit.getBoundingClientRect(); if (!r.width) return;
    const cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.34;
    const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 160);
    const tx = (dx / d) * 2.2 * k, ty = (dy / d) * 2.2 * k;
    pet.style.setProperty('--px', tx.toFixed(2) + 'px'); pet.style.setProperty('--py', ty.toFixed(2) + 'px');
  }
  function wake() {
    clearTimeout(idleT); clearTimeout(sleepT);
    if (state === 'sleep') { cat.classList.remove('sleep'); state = 'sit'; gesture('stretch', 2400); }
    idleT = setTimeout(() => { if (on && !panelOpen) gesture('stretch', 2400); }, 20000);
    sleepT = setTimeout(() => { if (on && !panelOpen) { clearTimeout(gestureT); cat.classList.remove('jump', 'watch', 'stretch', 'wiggle'); cat.classList.add('sleep'); state = 'sleep'; say('💤 zzz… tap me to wake', 4000); } }, 60000);
  }
  function remember(v) {
    const key = v.type === 'cmd' || v.type === 'run' ? 'c:' + v.cmd : v.type + ':' + (v.card || v.sec || v.label);
    log = log.filter(x => x.k !== key);
    log.unshift({ k: key, type: v.type, cmd: v.cmd || '', card: v.card || '', sec: v.sec || '', label: v.label || v.cmd || '', at: Date.now() });
    log = log.slice(0, LOG_MAX); store.set('ub-cat-log', JSON.stringify(log));
  }
  document.addEventListener('ub:visit', e => {
    const v = e.detail || {}; remember(v);
    if (!on) return;
    wake(); if (panelOpen) renderPanel();
    if (v.type === 'cmd') { gesture('jump', 800); say(`${MOODS.cmd[0]} <code>${esc(short(v.cmd))}</code>`); lookAt(innerWidth * 0.6, innerHeight * 0.35); }
    else if (v.type === 'card') { gesture('watch', 1800); say(`${MOODS.card[0]} ${esc(v.label)}`); }
    else if (v.type === 'section') { gesture('stretch', 2400); say(`${v.icon || MOODS.section[0]} ${esc(v.label)}`); }
    else if (v.type === 'run') { if (v.ok) { gesture('jump', 800); say(`${MOODS.runOk[0]} <code>${esc(short(v.cmd))}</code>`, 2400); } else { gesture('watch', 1800); say(`${MOODS.runErr[0]} ${MOODS.runErr[1]}`, 2600); } }
  });
  const short = s => (s = String(s || '')).length > 34 ? s.slice(0, 33) + '…' : s;

  /* ---------- visited panel (tap the cat) ---------- */
  function renderPanel() {
    const icon = t => ({ cmd: '⌨️', run: '>_', card: '📖', section: '🐾' }[t] || '•');
    const items = log.slice(0, 10);
    bubble.innerHTML = `<div class="cp-head"><b>🐾 Recently visited</b><button class="cp-x" data-cat="close" aria-label="Close list">✕</button></div>
      ${items.length ? `<ul class="cp-list">${items.map((x, i) => `<li><button data-cat="open" data-i="${i}"><span class="cp-i">${icon(x.type)}</span><span class="cp-t">${x.type === 'cmd' || x.type === 'run' ? `<code>${esc(x.cmd)}</code>` : esc(x.label)}</span></button></li>`).join('')}</ul>` : '<p class="cp-empty">Nothing yet — open a section or tap a command and I’ll keep track.</p>'}
      <div class="cp-foot"><button data-cat="side">⇄ Other side</button>${items.length ? '<button data-cat="clear">Clear</button>' : ''}<button data-cat="hide">Hide cat</button></div>`;
  }
  function openPanel() { panelOpen = true; clearTimeout(bubbleT); renderPanel(); bubble.classList.add('on', 'panel'); }
  function closePanel() { panelOpen = false; bubble.classList.remove('on', 'panel'); }
  cat.addEventListener('click', () => {
    if (state === 'sleep') { wake(); say('😸 I’m awake!', 1600); return; }
    wake(); gesture('wiggle', 700);
    panelOpen ? closePanel() : openPanel();
  });
  bubble.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    e.stopPropagation();
    const a = b.dataset.cat;
    if (a === 'close') closePanel();
    else if (a === 'hide') setOn(false);
    else if (a === 'clear') { log = []; store.set('ub-cat-log', '[]'); renderPanel(); }
    else if (a === 'side') { pet.classList.toggle('right'); store.set('ub-cat-side', pet.classList.contains('right') ? 'right' : 'left'); }
    else if (a === 'open') {
      const x = log[+b.dataset.i]; if (!x) return; closePanel();
      if ((x.type === 'cmd') && UB.cmdPopup) UB.cmdPopup(x.cmd, x.card);
      else if (x.type === 'run' && UB.go) { UB.go('#terminal'); setTimeout(() => UB.exec && UB.exec(x.cmd), 60); }
      else if (x.type === 'card' && UB.go) UB.go('#' + x.card);
      else if (x.type === 'section' && UB.go) UB.go('#' + x.sec);
    }
  });

  /* ---------- watching: eyes follow the finger / pointer / scrolling ---------- */
  addEventListener('pointermove', e => { if (on) lookAt(e.clientX, e.clientY); }, { passive: true });
  addEventListener('pointerdown', e => { if (on) { lookAt(e.clientX, e.clientY); wake(); } }, { passive: true });
  let lastY = scrollY;
  addEventListener('scroll', () => { if (!on) return; const d = scrollY - lastY; lastY = scrollY; pet.style.setProperty('--py', (d > 0 ? 2 : -2) + 'px'); wake(); }, { passive: true });

  /* ---------- on / off ---------- */
  function setOn(v) {
    on = v; store.set('ub-cat', v ? '1' : '0');
    btn.classList.toggle('on', v); btn.setAttribute('aria-pressed', String(v));
    if (v) {
      pet.hidden = false; closePanel();
      requestAnimationFrame(() => { pet.classList.add('in'); gesture('walk', 1100); setTimeout(() => say('😺 Hi! I’ll watch what you explore.', 2800), 900); });
      wake();
    } else {
      closePanel(); pet.classList.remove('in'); clearTimeout(idleT); clearTimeout(sleepT);
      setTimeout(() => { if (!on) pet.hidden = true; }, 350);
    }
  }
  btn.addEventListener('click', () => setOn(!on));
  if (store.get('ub-cat-side') === 'right') pet.classList.add('right');
  if (store.get('ub-cat') === '1') setOn(true);

  UB.Cat = { setOn, gesture, get on() { return on; }, get state() { return state; }, get log() { return log.slice(); }, openPanel, closePanel };
})();
