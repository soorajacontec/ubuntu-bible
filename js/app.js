/* Ubuntu Bible — app logic (renderer, router, search, pop-up, terminal, theme, music) */
(() => {
'use strict';
const UB = window.UB, S = UB.S, T = UB.T;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s).trim().replace(/\s+/g, ' ');
const USER = 'ssk', HOST = 'ubuntu';
const PS1 = `${USER}@${HOST}:~$`;

/* ---------- groups for the home grid ---------- */
const GROUPS = [
  ['Essentials', ['basics', 'troubleshoot', 'files', 'shell', 'users', 'processes']],
  ['Packages', ['apt', 'snap', 'flatpak', 'packaging', 'upgrades', 'pro']],
  ['System', ['services', 'system', 'logs', 'boot', 'install', 'performance', 'disk', 'backup']],
  ['Network & Security', ['network', 'firewall', 'apparmor', 'security', 'ssh']],
  ['Desktop & Devices', ['desktop', 'hardware', 'android', 'multimedia', 'gaming']],
  ['Development', ['git', 'editors', 'devtools', 'ai', 'web']],
  ['Virtualization & Cloud', ['containers', 'lxd', 'multipass', 'virt', 'servers', 'ansible', 'k8s', 'cloud']]
];

/* ---------- indexing ---------- */
function baseOf(cmd) {
  const t = norm(cmd).split(' ');
  let i = 0;
  while (i < t.length) {
    const w = t[i];
    if (w === 'sudo') {
      i++;
      while (i < t.length && t[i].startsWith('-')) { i += (t[i] === '-u' || t[i] === '-g') ? 2 : 1; }
      continue;
    }
    if (/^[A-Z_][A-Z0-9_]*=/.test(w) || w === 'time' || w === 'nohup' || w === 'env' || w === 'exec') { i++; continue; }
    break;
  }
  return (t[i] || '').replace(/^\.\//, './');
}
const ROWS = [], FLAGS = [], DEMOS = [];
const SEC = {}, CARD = {};
S.forEach(s => {
  SEC[s.id] = s;
  s.cards.forEach(c => {
    c.sec = s;
    CARD[s.id + '/' + c.id] = c;
    c.cmds = c.cmds || [];
    c.flags = c.flags || [];
    if (c.demo && !Array.isArray(c.demo[0])) c.demo = [c.demo];
    c.demo = c.demo || [];
    c.ft = c.ft || (c.cmds[0] ? baseOf(c.cmds[0][0]) : '');
    c.cmds.forEach(r => ROWS.push({ cmd: r[0], desc: r[1], out: r[2], sec: s, card: c, base: baseOf(r[0]) }));
    c.flags.forEach(f => FLAGS.push({ flag: f[0], desc: f[1], tool: f[2] || c.ft, sec: s, card: c }));
    c.demo.forEach(d => DEMOS.push({ cmd: d[0], out: d[1], sec: s, card: c, base: baseOf(d[0]) }));
  });
});
const EXACT = new Map();
const isErrDemo = d => /Could not get lock/.test(d.out || '') && d.sec.id === 'troubleshoot';
DEMOS.filter(d => !isErrDemo(d)).forEach(d => { const k = norm(d.cmd); if (!EXACT.has(k)) EXACT.set(k, { out: d.out, src: d }); });
ROWS.forEach(r => { const k = norm(r.cmd); if (!EXACT.has(k)) EXACT.set(k, { out: r.out, desc: r.desc, src: r }); else if (EXACT.get(k).out == null && r.out != null) EXACT.get(k).out = r.out; });
Object.entries(UB.EXTRA || {}).forEach(([k, v]) => { const h = EXACT.get(norm(k)); if (h) { if (h.out == null) h.out = v; } else EXACT.set(norm(k), { out: v }); });
const BASES = new Set([...ROWS.map(r => r.base), ...DEMOS.map(d => d.base), ...Object.keys(T)]);
BASES.delete('');

function aliases(flag) {
  const r = String(flag).split(/,\s*|\s+\|\s+|\s+or\s+/).map(p => p.trim().split(/[\s=\[<]/)[0]).filter(Boolean);
  return r.length ? r : [String(flag).trim()];
}
const OPTS_CACHE = {};
function optsFor(base) {
  if (OPTS_CACHE[base]) return OPTS_CACHE[base];
  const out = [], seen = new Set();
  const add = (f, d) => { const k = aliases(f).join('|') || f; if (seen.has(k)) return; seen.add(k); out.push({ f, d, a: aliases(f) }); };
  ((T[base] && T[base].o) || []).forEach(o => add(o[0], o[1]));
  FLAGS.filter(x => x.tool === base).forEach(x => add(x.flag, x.desc));
  return (OPTS_CACHE[base] = out);
}
function stripQ(t) { return t.replace(/^['"]|['"]$/g, ''); }
function usesOf(cmd) {
  const base = baseOf(cmd), opts = optsFor(base);
  const toks = norm(cmd).split(' ');
  const bi = toks.indexOf(base);
  const used = [], args = [];
  let pos = 0;
  const find = k => opts.find(o => o.a.includes(k));
  for (let i = bi + 1; i < toks.length; i++) {
    const raw = stripQ(toks[i]);
    if (raw === '|' || raw === '&&' || raw === ';') break;
    const k = raw.split('=')[0];
    let o = find(k);
    if (o) { used.push({ tok: raw, o }); continue; }
    if (/^-[A-Za-z0-9]{2,}$/.test(k)) {
      const hits = k.slice(1).split('').map(ch => find('-' + ch)).filter(Boolean);
      if (hits.length) { hits.forEach(h => used.push({ tok: raw, o: h })); continue; }
    }
    if (!raw.startsWith('-') && pos < 2) {
      pos++;
      o = opts.find(x => !x.a[0].startsWith('-') && x.a.includes(raw));
      if (o) { used.push({ tok: raw, o }); continue; }
    }
    args.push(raw);
  }
  return { base, used, args };
}

/* ---------- utilities ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1600);
}
function copy(text) {
  const done = () => toast('Copied ✓');
  try {
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(done, () => fallback()); return; }
  } catch (e) {}
  fallback();
  function fallback() {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;width:1px;height:1px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed'); }
    ta.remove();
  }
}
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
function hl(cmd) {
  // light syntax highlight for a command string
  return esc(cmd).replace(/(^|\s)(sudo)(?=\s)/g, '$1<i class="k-sudo">$2</i>')
    .replace(/(\s)(--?[A-Za-z][\w-]*)/g, '$1<i class="k-flag">$2</i>')
    .replace(/(\s)(\||&amp;&amp;|&gt;&gt;?|2&gt;&amp;1|;)(?=\s|$)/g, '$1<i class="k-op">$2</i>');
}
const copyBtn = (text, label = 'Copy') => `<button class="cp" data-copy="${esc(text)}" aria-label="${esc(label)}" title="${esc(label)}">⧉</button>`;

/* ---------- views ---------- */
const view = $('#view');
const totals = () => ({ sections: S.length, cards: S.reduce((n, s) => n + s.cards.length, 0), commands: ROWS.length, flags: FLAGS.length, demos: DEMOS.length });

function renderHome() {
  const t = totals();
  const streamCmds = ROWS.filter((r, i) => i % 7 === 0 && r.cmd.length < 46).slice(0, 36).map(r => '$ ' + r.cmd);
  const stream = esc(streamCmds.join('\n'));
  let h = `<section class="hero">
    <div class="hero-fx" aria-hidden="true"><i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i>
      <div class="hero-stream"><pre>${stream}</pre><pre>${stream}</pre></div></div>
    <p class="kicker">Ubuntu 26.04 LTS · Resolute Raccoon</p>
    <h1>Every command, <span>one tap away.</span></h1>
    <p class="lead">An offline field guide to Ubuntu — commands, flags and live simulated terminals, with notes where 24.04 LTS differs.</p>
    <div class="stats">
      <div><b data-count="${t.sections}">${t.sections}</b><span>sections</span></div>
      <div><b data-count="${t.commands}">${t.commands}</b><span>commands</span></div>
      <div><b data-count="${t.flags}">${t.flags}</b><span>flags</span></div>
      <div><b data-count="${t.demos}">${t.demos}</b><span>live demos</span></div>
    </div>
    <a class="cta" href="#terminal"><span>&gt;<em class="blink">_</em></span> Open the terminal playground</a>
  </section>`;
  const placed = new Set();
  GROUPS.forEach(([g, ids]) => {
    const secs = ids.map(i => SEC[i]).filter(Boolean);
    if (!secs.length) return;
    secs.forEach(s => placed.add(s.id));
    h += `<h2 class="grp">${esc(g)}</h2><div class="tiles">` + secs.map(tile).join('') + `</div>`;
  });
  const rest = S.filter(s => !placed.has(s.id));
  if (rest.length) h += `<h2 class="grp">More</h2><div class="tiles">` + rest.map(tile).join('') + `</div>`;
  view.innerHTML = h;
  countUp();
  function tile(s) {
    const n = s.cards.reduce((a, c) => a + c.cmds.length, 0);
    return `<a class="tile" href="#${s.id}"><span class="ti">${s.icon}</span><span class="tt">${esc(s.title)}</span><span class="tn">${s.cards.length} cards · ${n} cmds</span></a>`;
  }
}

/* hero stats count up (skipped when reduced motion is preferred) */
let counted = false;
function countUp() {
  const els = $$('.hero [data-count]'); if (counted || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  counted = true;
  const t0 = performance.now(), D = 1200;
  els.forEach(el => el.textContent = '0');
  const step = now => { const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
    els.forEach(el => { el.textContent = Math.round(+el.dataset.count * e); });
    if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function renderSection(s) {
  setTimeout(() => document.dispatchEvent(new CustomEvent('ub:visit', { detail: { type: 'section', sec: s.id, label: s.title, icon: s.icon } })), 0);
  const idx = S.indexOf(s), prev = S[idx - 1], next = S[idx + 1];
  let h = `<div class="crumbs"><a href="#">Home</a><span>›</span><b>${esc(s.title)}</b></div>
  <section class="sechead"><span class="si">${s.icon}</span><div><h1>${esc(s.title)}</h1><p>${esc(s.desc)}</p></div></section>
  <div class="cards">`;
  s.cards.forEach(c => { h += renderCard(s, c); });
  h += `</div><nav class="pager">${prev ? `<a href="#${prev.id}">‹ ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a href="#${next.id}">${esc(next.title)} ›</a>` : '<span></span>'}</nav>`;
  view.innerHTML = h;
}

function renderCard(s, c) {
  const id = `${s.id}/${c.id}`;
  const rows = c.cmds.map((r, i) => `<div class="row" role="button" tabindex="0" data-cmd="${esc(r[0])}" data-card="${esc(id)}">
      <code>${hl(r[0])}</code><span class="rd">${esc(r[1])}</span>${copyBtn(r[0], 'Copy command')}</div>`).join('');
  const flags = c.flags.length ? `<table class="ft"><thead><tr><th>Option</th><th>Meaning</th></tr></thead><tbody>${c.flags.map(f => `<tr><td><code>${esc(f[0])}</code>${f[2] && f[2] !== c.ft ? `<small>${esc(f[2])}</small>` : ''}</td><td>${esc(f[1])}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No flags table for this card.</p>';
  const demo = `<div class="term mini"><div class="tbar"><i></i><i></i><i></i><span>${esc(PS1.replace('$', ''))}</span></div><div class="tscreen" data-demo="${esc(id)}">${demoStatic(c)}</div>
    <div class="tact"><button class="btn sm" data-replay="${esc(id)}">▶ Replay</button><button class="btn sm ghost" data-play="${esc(c.demo[0] ? c.demo[0][0] : '')}">Run in playground</button></div></div>`;
  const notes = [
    ...(c.tips || []).map(t => `<div class="note tip"><b>Tip</b><p>${inline(t)}</p></div>`),
    ...(c.warn || []).map(t => `<div class="note warn"><b>Warning</b><p>${inline(t)}</p></div>`),
    ...(c.v24 ? [`<div class="note v24"><b>24.04 LTS</b><p>${inline(c.v24)}</p></div>`] : [])
  ].join('');
  return `<article class="card" id="card-${s.id}-${c.id}" data-id="${esc(id)}">
    <a class="chead" href="#${id}" aria-expanded="false"><span class="ct">${esc(c.title)}</span><span class="cs">${esc(c.intro || '')}</span><span class="cm">${c.cmds.length} cmds · ${c.flags.length} flags</span><span class="chev" aria-hidden="true">⌄</span></a>
    <div class="cbody" hidden>
      <div class="tabs" role="tablist">
        <a role="tab" href="#${id}/cmds" data-pane="cmds">Commands</a>
        <a role="tab" href="#${id}/flags" data-pane="flags">Options &amp; flags</a>
        <a role="tab" href="#${id}/term" data-pane="term">Terminal</a>
      </div>
      <div class="pane" data-pane="cmds">${rows}</div>
      <div class="pane" data-pane="flags" hidden>${flags}</div>
      <div class="pane" data-pane="term" hidden>${demo}</div>
      ${notes}
    </div></article>`;
}
function inline(t) { return esc(t).replace(/`([^`]+)`/g, '<code>$1</code>'); }
function demoStatic(c) {
  return c.demo.map(d => `<div class="tl"><span class="ps">${PS1}</span> <span class="tc">${esc(d[0])}</span></div>${d[1] ? `<pre class="to">${esc(d[1])}</pre>` : ''}`).join('') || `<div class="tl muted">No demo.</div>`;
}

function openCard(id, pane) {
  $$('.card').forEach(el => {
    const on = el.dataset.id === id;
    el.classList.toggle('open', on);
    $('.chead', el).setAttribute('aria-expanded', on);
    $('.chead', el).setAttribute('href', on ? `#${el.dataset.id.split('/')[0]}` : `#${el.dataset.id}`);
    $('.cbody', el).hidden = !on;
    if (on) {
      const cc = CARD[id]; if (cc && el.dataset.visited !== '1') { el.dataset.visited = '1'; document.dispatchEvent(new CustomEvent('ub:visit', { detail: { type: 'card', card: id, label: cc.title, sec: cc.sec.title } })); }
      pane = pane || 'cmds';
      $$('.tabs a', el).forEach(a => { const p = a.dataset.pane === pane; a.classList.toggle('on', p); a.setAttribute('aria-selected', p); });
      $$('.pane', el).forEach(p => { p.hidden = p.dataset.pane !== pane; });
    }
  });
}

/* ---------- live demo replay ---------- */
let replayTok = 0;
async function replay(id) {
  const c = CARD[id]; const scr = $(`[data-demo="${CSS.escape(id)}"]`); if (!c || !scr) return;
  const tok = ++replayTok; scr.innerHTML = '';
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  for (const d of c.demo) {
    const line = document.createElement('div'); line.className = 'tl';
    line.innerHTML = `<span class="ps">${PS1}</span> <span class="tc"></span><span class="cur">▌</span>`;
    scr.appendChild(line);
    const tc = $('.tc', line);
    for (const ch of d[0]) { if (tok !== replayTok) return; tc.textContent += ch; await sleep(18); }
    $('.cur', line).remove(); await sleep(250);
    if (d[1]) { const pre = document.createElement('pre'); pre.className = 'to'; scr.appendChild(pre);
      for (const ln of d[1].split('\n')) { if (tok !== replayTok) return; pre.textContent += (pre.textContent ? '\n' : '') + ln; await sleep(30); } }
    await sleep(300);
  }
}

/* ---------- search ---------- */
function search(q) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const match = hay => { hay = hay.toLowerCase(); return words.every(w => hay.includes(w)); };
  const res = [];
  S.forEach(s => { if (match(s.title + ' ' + s.desc + ' ' + s.id)) res.push({ t: 'Section', w: 0, title: s.title, sub: s.desc, href: `#${s.id}` }); });
  S.forEach(s => s.cards.forEach(c => { if (match(c.title + ' ' + (c.intro || '') + ' ' + s.title)) res.push({ t: 'Topic', w: 1, title: c.title, sub: `${s.title} · ${c.intro || ''}`, href: `#${s.id}/${c.id}` }); }));
  ROWS.forEach(r => { if (match(r.cmd + ' ' + r.desc)) res.push({ t: 'Command', w: match(r.cmd) ? 2 : 3, title: r.cmd, sub: `${r.desc} — ${r.sec.title} › ${r.card.title}`, cmd: r.cmd, card: `${r.sec.id}/${r.card.id}` }); });
  FLAGS.forEach(f => { if (match(f.flag + ' ' + f.desc + ' ' + f.tool)) res.push({ t: 'Flag', w: 4, title: `${f.tool} ${f.flag}`, sub: `${f.desc} — ${f.sec.title} › ${f.card.title}`, href: `#${f.sec.id}/${f.card.id}/flags` }); });
  S.forEach(s => s.cards.forEach(c => [...(c.tips || []), ...(c.warn || []), c.v24 || ''].forEach(t => { if (t && match(t)) res.push({ t: 'Note', w: 5, title: c.title, sub: t, href: `#${s.id}/${c.id}` }); })));
  return res.sort((a, b) => a.w - b.w);
}
function renderSearch(q) {
  const res = search(q), shown = res.slice(0, 80);
  view.innerHTML = `<div class="crumbs"><a href="#" data-clear>Home</a><span>›</span><b>Search</b></div>
  <h1 class="sh">${res.length} result${res.length === 1 ? '' : 's'} for “${esc(q)}”</h1>
  <div class="results">${shown.map(r => r.cmd
    ? `<div class="res" role="button" tabindex="0" data-cmd="${esc(r.cmd)}" data-card="${esc(r.card)}"><span class="rt">${r.t}</span><code>${hl(r.title)}</code><span>${esc(r.sub)}</span></div>`
    : `<a class="res" href="${r.href}" data-clear><span class="rt">${r.t}</span><b>${esc(r.title)}</b><span>${esc(r.sub)}</span></a>`).join('')}
  ${res.length > shown.length ? `<p class="muted">Showing first ${shown.length}. Refine your search to see more.</p>` : ''}
  ${!res.length ? `<p class="muted">Nothing found. Try a tool name like <code>apt</code>, <code>netplan</code> or a flag like <code>--now</code>.</p>` : ''}</div>`;
}

/* ---------- pop-up (bottom sheet) ---------- */
const sheet = $('#sheet'), scrim = $('#scrim');
let sheetOpen = false, lastFocus = null;
function openSheet(html, label) {
  sheet.innerHTML = `<div class="grab" aria-hidden="true"></div><div class="shd"><h2 id="sheetTitle">${esc(label)}</h2><button class="x" data-close aria-label="Close">✕</button></div><div class="sbody">${html}</div>`;
  if (!sheetOpen) { lastFocus = document.activeElement; try { history.pushState({ ubSheet: 1, ubRoute: HASH }, ''); } catch (e) {} }
  sheetOpen = true; sheet.hidden = false; scrim.hidden = false;
  requestAnimationFrame(() => { if (!sheetOpen) return; sheet.classList.add('on'); scrim.classList.add('on'); });
  document.body.classList.add('lock');
  $('.x', sheet).focus({ preventScroll: true });
  sheet.querySelector('.sbody').scrollTop = 0;
}
let pendingAfterClose = null;
function closeSheet(fromPop, then) {
  if (!sheetOpen) { if (then) then(); return; }
  sheetOpen = false; sheet.classList.remove('on'); scrim.classList.remove('on');
  document.body.classList.remove('lock');
  setTimeout(() => { if (!sheetOpen) { sheet.hidden = true; scrim.hidden = true; } }, 220);
  let waiting = false;
  if (!fromPop) { try { if (history.state && history.state.ubSheet) { pendingAfterClose = then || null; waiting = !!then; history.back(); } } catch (e) {} }
  if (!then && lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  if (then && !waiting) then();
}
window.addEventListener('popstate', e => {
  if (!sheetOpen && !pendingAfterClose) { const st = e.state; const h = st && 'ubRoute' in st ? st.ubRoute : (st && st.ubSheet ? HASH : location.hash); if (h !== HASH) { HASH = h; route(); } return; }
  if (sheetOpen) closeSheet(true); if (pendingAfterClose) { const f = pendingAfterClose; pendingAfterClose = null; setTimeout(f, 0); } });

function cmdPopup(cmd, cardId) {
  cmd = norm(cmd);
  const row = ROWS.find(r => norm(r.cmd) === cmd && (!cardId || `${r.sec.id}/${r.card.id}` === cardId)) || ROWS.find(r => norm(r.cmd) === cmd);
  const u = usesOf(cmd), base = u.base, opts = optsFor(base), tinfo = T[base] || {};
  const usedSet = new Set(u.used.map(x => x.o));
  const syntax = tinfo.s || `${base} [options] [arguments]`;
  const same = ROWS.filter(r => r.base === base && norm(r.cmd) !== cmd);
  const exSeen = new Set(); const examples = same.filter(r => { const k = norm(r.cmd); if (exSeen.has(k)) return false; exSeen.add(k); return true; }).slice(0, 10);
  const cards = []; const cs = new Set();
  ROWS.concat(DEMOS).filter(r => r.base === base).forEach(r => { const k = `${r.sec.id}/${r.card.id}`; if (!cs.has(k)) { cs.add(k); cards.push(r); } });
  let h = `<div class="cmdbox"><code>${hl(cmd)}</code>${copyBtn(cmd, 'Copy command')}</div>
  ${row ? `<p class="cdesc">${esc(row.desc)}</p><p class="where"><a href="#${row.sec.id}/${row.card.id}" data-nav>${row.sec.icon} ${esc(row.sec.title)} › ${esc(row.card.title)}</a></p>` : ''}
  ${tinfo.d ? `<p class="tdesc"><b>${esc(base)}</b> — ${esc(tinfo.d)}</p>` : ''}
  <h3>What this command uses</h3>
  ${u.used.length ? `<ul class="uses">${u.used.map(x => `<li><code class="hlt">${esc(x.tok)}</code><span>${esc(x.o.d)}</span></li>`).join('')}</ul>` : `<p class="muted">No options — <code>${esc(base)}</code> runs with its defaults${u.args.length ? ' on the arguments below' : ''}.</p>`}
  ${u.args.length ? `<p class="args">Arguments: ${u.args.map(a => `<code>${esc(a)}</code>`).join(' ')}</p>` : ''}
  <h3>Syntax</h3><div class="cmdbox syn"><code>${esc(syntax)}</code>${copyBtn(syntax, 'Copy syntax')}</div>
  <h3>All options &amp; subcommands <small>(${opts.length})</small></h3>
  ${opts.length ? `<ul class="opts">${opts.map(o => `<li class="${usedSet.has(o) ? 'used' : ''}"><code>${esc(o.f)}</code><span>${esc(o.d)}</span>${copyBtn(o.a[0] || o.f, 'Copy option')}</li>`).join('')}</ul>` : `<p class="muted">Try <code>man ${esc(base)}</code> in the playground.</p>`}
  ${examples.length ? `<h3>Examples</h3><div class="exs">${examples.map(r => `<div class="row" role="button" tabindex="0" data-cmd="${esc(r.cmd)}" data-card="${esc(r.sec.id + '/' + r.card.id)}"><code>${hl(r.cmd)}</code><span class="rd">${esc(r.desc)}</span></div>`).join('')}</div>` : ''}
  ${cards.length ? `<h3>More of this command in the app</h3><ul class="more">${cards.map(r => `<li><a href="#${r.sec.id}/${r.card.id}" data-nav>${r.sec.icon} ${esc(r.sec.title)} › ${esc(r.card.title)}</a></li>`).join('')}</ul>` : ''}
  <div class="sfoot"><button class="btn" data-copy="${esc(cmd)}">⧉ Copy</button><button class="btn pri" data-try="${esc(cmd)}">&gt;_ Try in terminal</button></div>`;
  h = `<div class="spk"><button class="btn sm spkbtn" data-note-add="${esc(cmd)}">📝 Save to notepad</button></div>` + h;
  openSheet(h, base || 'Command');
  document.dispatchEvent(new CustomEvent('ub:visit', { detail: { type: 'cmd', cmd, card: row ? `${row.sec.id}/${row.card.id}` : '', label: row ? row.desc : base } }));
}

const k = x => `<kbd>${x}</kbd>`;
const GUIDE = [
  ['🧭', 'Quick start', `<ol>
    <li>Tap a <b>section tile</b> on the home page (e.g. <b>📦 APT</b>).</li>
    <li>Tap a <b>card</b> to open it — each card has three tabs: <b>Commands</b>, <b>Options &amp; flags</b> and <b>Terminal</b>.</li>
    <li>Tap any <b>command</b> to open its details pop-up, then <b>Copy</b> it or <b>Try in terminal</b>.</li>
    <li>Use the <b>search bar</b> to jump straight to a command, flag or topic.</li></ol>`],
  ['🔝', 'Top bar buttons', `<ul class="glist">
    <li><span class="gb-i">🐱</span><div><b>Cat</b> — shows or hides Kitty, the animated companion at the bottom of the page.</div></li>
    <li><span class="gb-i">📝</span><div><b>Notepad</b> — quick notes and saved commands. The orange badge counts notes not yet ticked.</div></li>
    <li><span class="gb-i">✏️</span><div><b>About</b> — this page: credits, stats and this guide.</div></li>
    <li><span class="gb-i">🎵</span><div><b>Music</b> — starts or stops the ambient music and its mini player.</div></li>
    <li><span class="gb-i">🌗</span><div><b>Theme</b> — switches dark / light. Your choice is remembered.</div></li>
    <li><span class="gb-i">📖</span><div><b>Logo</b> (Ubuntu Bible) — back to the home page.</div></li></ul>
    <p>The header and search bar stay pinned at the top while you scroll.</p>`],
  ['🔍', 'Search', `<ul>
    <li>Type in <b>Search commands, flags, topics…</b> — results update as you type (sections, topics, commands, flags and tips).</li>
    <li>Tap a <b>command</b> result to open its pop-up; tap a section/topic/flag result to jump there.</li>
    <li>${k('Esc')} clears the search. On a keyboard, ${k('/')} jumps to the search box.</li>
    <li>The <b>&gt;_</b> button beside the search bar opens the terminal playground.</li></ul>`],
  ['🗂️', 'Sections & cards', `<ul>
    <li><b>Home</b> groups the 43 sections (Essentials, Packages, System…). The hero shows live totals.</li>
    <li>Each <b>card</b> opens/closes with a tap. Tabs: <b>Commands</b> (tap any row) · <b>Options &amp; flags</b> (a table of what each flag means) · <b>Terminal</b> (a sample session — tap <b>▶ Replay</b> to type it out, or <b>Run in playground</b>).</li>
    <li>Coloured notes: <b class="gt-tip">Tip</b>, <b class="gt-warn">Warning</b> and <b class="gt-v24">24.04 LTS</b> (what differs on the previous LTS).</li>
    <li><b>⧉</b> on any row copies that command without opening it.</li>
    <li>Use <b>‹ Previous / Next ›</b> at the bottom of a section, or <b>Home</b> in the breadcrumb, to move around. Your phone's Back button works too.</li></ul>`],
  ['💬', 'Command pop-up', `<ul>
    <li><b>📝 Save to notepad</b> — keeps the command in your notepad.</li>
    <li><b>What this command uses</b> — every option in the command, highlighted and explained.</li>
    <li><b>Syntax</b> and <b>All options &amp; subcommands</b> — the full option list, each with its own ⧉ copy button (options used by this command are highlighted).</li>
    <li><b>Examples</b> — more commands with the same tool (tap to open), and <b>More of this command in the app</b> — every card that uses it.</li>
    <li><b>⧉ Copy</b> and <b>&gt;_ Try in terminal</b> at the bottom. Close with <b>✕</b>, a tap outside, ${k('Esc')} or the Back button.</li></ul>`],
  ['⌨️', 'Terminal playground', `<p>A simulated Ubuntu shell — nothing runs on your device.</p><ul>
    <li>Type a command and press ${k('Enter')} or the <b>⏎</b> button. Every command in the app gives realistic output.</li>
    <li>Real shell basics work: <code>cd</code>, <code>ls -la</code>, <code>pwd</code>, <code>cat</code>, <code>mkdir</code>, <code>touch</code>, <code>rm</code>, <code>cp</code>, <code>mv</code>, <code>echo … &gt; file</code>, pipes <code>| grep · head · tail · wc · sort</code>, chains <code>&amp;&amp;</code> and <code>;</code>, <code>export</code>.</li>
    <li><code>sudo -i</code> gives a red <b>root#</b> prompt; <code>exit</code> returns to your user.</li>
    <li>Built-ins: <code>help</code>, <code>sections</code>, <code>commands apt</code>, <code>search ufw</code>, <code>man ls</code>, <code>examples</code>, <code>history</code>, <code>clear</code>.</li>
    <li>Key row: <b>Tab</b> completes commands and file names · <b>↑ ↓</b> history · <b>help</b> · <b>clear</b>.</li></ul>`],
  ['🧩', 'Section browser', `<ul>
    <li>Under the terminal. Type a command in <b>Type a command or filter…</b> and press ${k('Enter')} or <b>▶ Run</b> — it runs in the terminal above.</li>
    <li>Typing a word filters the list; ${k('Enter')} then runs the top match.</li>
    <li>Tap a <b>section chip</b> to show only its commands; <b>Show all 43 sections ▾</b> expands the chips. Tap any command in the list to run it.</li></ul>`],
  ['📝', 'Notepad', `<ul>
    <li>Tap <b>📝</b>, type a note or command, then ${k('Enter')} or <b>Add</b>. Newest notes appear first.</li>
    <li>Per note: <b>☐</b> tick done · tap the text to <b>edit</b> · <b>&gt;_</b> run it in the terminal (commands only) · <b>⧉</b> copy · <b>✕</b> delete.</li>
    <li><b>Copy all</b> copies the list as a checklist; <b>Clear done</b> removes ticked notes.</li>
    <li>Notes are saved on this device in the installed app (a sandboxed preview keeps them only until you close it).</li></ul>`],
  ['🎵', 'Music player', `<ul>
    <li>Tap <b>🎵</b> to start ambient music generated live on your device (works offline). A mini player appears at the bottom.</li>
    <li><b>⏸ / ▶</b> pause and play · <b>⏭</b> change track (Neon Kernel → Deep Packet → Orbit Shell) · slider sets the volume · <b>✕</b> stops and closes.</li>
    <li><b>Drag</b> the player anywhere. <b>Swipe it left or right</b> (or tap the sound bars) to tuck it into a floating <b>bubble</b> — drag the bubble around, tap it to expand again.</li>
    <li>Your track and volume are remembered.</li></ul>`],
  ['🐱', 'Kitty the cat', `<ul>
    <li>Tap <b>🐱</b> in the top bar to show or hide Kitty at the bottom of the page.</li>
    <li>Kitty reacts to what you do: <b>stretches</b> when you open a section, <b>watches</b> (head tilt) when you open a card, <b>jumps</b> when you open or run a command, and looks puzzled 😾 if a command fails. Its eyes follow your finger.</li>
    <li>After 20 s of quiet it stretches; after a minute it falls <b>asleep</b> 💤 — tap to wake.</li>
    <li><b>Tap Kitty</b> for <b>🐾 Recently visited</b> — tap an entry to reopen it. Buttons: <b>⇄ Other side</b>, <b>Clear</b>, <b>Hide cat</b>.</li></ul>`],
  ['📲', 'Install & offline', `<ul>
    <li>Open the app in your browser and choose <b>Add to Home screen</b> / <b>Install app</b>. It then opens full-screen and works completely <b>offline</b>.</li>
    <li>New versions download automatically next time you open it online.</li>
    <li>Links can point straight to a card, e.g. <code>#network/netplan/flags</code>.</li></ul>`]
];
function aboutPopup() {
  const t = totals();
  const mail = 'soorajsknairqa@gmail.com';
  openSheet(`<div class="about">
    <img src="${$('.brand img').getAttribute('src')}" alt="" width="72" height="72">
    <h3 class="an">Ubuntu Bible <small>v${UB.VERSION}</small></h3>
    <p><b>Created by SSK-BLUM</b></p>
    <div class="cmdbox mail"><a href="mailto:${mail}">${mail}</a>${copyBtn(mail, 'Copy email')}</div>
    <p class="muted">An offline, installable command reference for Ubuntu 26.04 LTS (with 24.04 LTS notes). Every terminal here is simulated — nothing runs on your device. Tap any command to see what its options do, then try it in the playground.</p>
    <div class="stats in">
      <div><b>${t.sections}</b><span>sections</span></div>
      <div><b>${t.commands}</b><span>commands</span></div>
      <div><b>${t.flags}</b><span>flags</span></div>
      <div><b>${t.demos}</b><span>live demos</span></div>
    </div>
    <h3 class="guide-h">📘 How to use</h3>
    <div class="guide">
      ${GUIDE.map((g, i) => `<details${i === 0 ? ' open' : ''}><summary><span class="gi">${g[0]}</span>${g[1]}</summary><div class="gb">${g[2]}</div></details>`).join('')}
    </div>
    <p class="muted small">Ubuntu® is a registered trademark of Canonical Ltd. This is an unofficial reference.</p>
  </div>`, 'About');
}

/* ---------- terminal engine ---------- */
let sudoAuthed = false;
const HIST = [];
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function ver(name) { const h = hash(name); return `${1 + h % 9}.${(h >> 4) % 20}.${(h >> 9) % 10}-${1 + (h >> 13) % 4}`; }
function kb(name) { return 40 + hash(name) % 1900; }
function aptInstall(pkgs) {
  const sz = pkgs.reduce((a, p) => a + kb(p), 0);
  let o = `Reading package lists... Done\nBuilding dependency tree... Done\nReading state information... Done\nInstalling:\n  ${pkgs.join('  ')}\n\nSummary:\n  Upgrading: 0, Installing: ${pkgs.length}, Removing: 0, Not Upgrading: 0\n  Download size: ${sz} kB\n  Space needed: ${(sz * 3.2).toFixed(0)} kB / 61.4 GB available\n\n`;
  pkgs.forEach((p, i) => { o += `Get:${i + 1} http://archive.ubuntu.com/ubuntu resolute/universe amd64 ${p} amd64 ${ver(p)} [${kb(p)} kB]\n`; });
  o += `Fetched ${sz} kB in 1s (${Math.round(sz * 0.9)} kB/s)\n`;
  pkgs.forEach(p => { o += `Selecting previously unselected package ${p}.\nUnpacking ${p} (${ver(p)}) ...\nSetting up ${p} (${ver(p)}) ...\n`; });
  return o + 'Processing triggers for man-db (2.13.1-1) ...';
}
function synth(cmd, desc) {
  const c = norm(cmd).replace(/^sudo (-E )?/, '');
  let m;
  const pk = s => s.split(' ').filter(x => x && !x.startsWith('-') && !x.includes('/') || /^ppa:/.test(x)).map(x => x.replace(/[=:].*$/, ''));
  if ((m = c.match(/^apt(?:-get)? (?:-y )?install (.+)/))) { const p = pk(m[1]); if (p.length) return aptInstall(p); }
  if ((m = c.match(/^apt(?:-get)? (?:-y )?(remove|purge|autoremove) ?(.*)/))) { const p = pk(m[2]); return `Reading package lists... Done\nBuilding dependency tree... Done\nREMOVING:\n  ${p.join('  ') || 'linux-image-6.17.0-8-generic'}\n\nSummary:\n  Upgrading: 0, Installing: 0, Removing: ${Math.max(1, p.length)}, Not Upgrading: 0\n  Freed space: ${kb(m[2] || 'x') * 3} kB\n\n(Reading database ... 214523 files and directories currently installed.)\n` + (p.length ? p : ['package']).map(x => `Removing ${x} (${ver(x)}) ...`).join('\n'); }
  if ((m = c.match(/^snap install \.\/(\w+)_([\d.]+)/))) return `${m[1]} ${m[2]} installed`;
  if ((m = c.match(/^snap install (.+)/))) { const p = pk(m[1]); return p.map(x => `${x} ${ver(x).split('-')[0]} from Canonical✓ installed`).join('\n'); }
  if ((m = c.match(/^snap (remove|refresh) (.+)/)) && pk(m[2]).length) { const p = pk(m[2]); return p.map(x => m[1] === 'remove' ? `${x} removed` : `${x} ${ver(x).split('-')[0]} from Canonical✓ refreshed`).join('\n'); }
  if (/^flatpak (install|update)/.test(c)) return `Looking for matches…\n\n        ID                         Branch   Op   Remote    Download\n 1. [✓] ${(c.split(' ').pop())}   stable   i    flathub   42.1 MB / 42.1 MB\n\nInstallation complete.`;
  if ((m = c.match(/^systemctl (?:--user )?enable --now (\S+)/)) || (m = c.match(/^systemctl (?:--user )?enable (\S+)/))) { const u = m[1].includes('.') ? m[1] : m[1] + '.service'; return `Created symlink '/etc/systemd/system/multi-user.target.wants/${u}' → '/usr/lib/systemd/system/${u}'.`; }
  if ((m = c.match(/^systemctl (?:--user )?disable (?:--now )?(\S+)/))) { const u = m[1].includes('.') ? m[1] : m[1] + '.service'; return `Removed '/etc/systemd/system/multi-user.target.wants/${u}'.`; }
  if ((m = c.match(/^systemctl mask (\S+)/))) { const u = m[1].includes('.') ? m[1] : m[1] + '.service'; return `Created symlink '/etc/systemd/system/${u}' → '/dev/null'.`; }
  if ((m = c.match(/^systemctl (?:--user )?(?:status) (\S+)/))) { const u = m[1].includes('.') ? m[1] : m[1] + '.service'; return `● ${u} - ${u.replace('.service', '')} service\n     Loaded: loaded (/usr/lib/systemd/system/${u}; enabled; preset: enabled)\n     Active: active (running) since Sat 2026-10-03 09:12:44 +03; 2h 4min ago\n   Main PID: ${1000 + hash(u) % 8000} (${u.replace('.service', '')})\n      Tasks: ${2 + hash(u) % 9} (limit: 18821)\n     Memory: ${(hash(u) % 90) + 4}.${hash(u) % 9}M (peak: ${(hash(u) % 120) + 10}.2M)\n        CPU: ${hash(u) % 900}ms\n     CGroup: /system.slice/${u}`; }
  if (/^systemctl (?:--user )?(start|stop|restart|reload|daemon-reload|unmask|try-restart|kill)\b/.test(c)) return '';
  if ((m = c.match(/^ufw (allow|deny|reject|limit)\b/))) return 'Rule added\nRule added (v6)';
  if (/^ufw delete/.test(c)) return 'Rule deleted\nRule deleted (v6)';
  if (/^ufw enable/.test(c)) return 'Command may disrupt existing ssh connections. Proceed with operation (y|n)? y\nFirewall is active and enabled on system startup';
  if (/^ufw disable/.test(c)) return 'Firewall stopped and disabled on system startup';
  if ((m = c.match(/^git commit .*-m ["']?([^"']+)/))) return `[main ${(hash(c) % 0xfffffff).toString(16).padStart(7, '0')}] ${m[1]}\n 2 files changed, 14 insertions(+), 3 deletions(-)`;
  if ((m = c.match(/^(pipx|pip3?) install (\S+)/))) return m[1] === 'pipx' ? `  installed package ${m[2]} ${ver(m[2]).split('-')[0]}, installed using Python 3.14.0\n  These apps are now globally available\n    - ${m[2]}\ndone! ✨ 🌟 ✨` : `Successfully installed ${m[2]}-${ver(m[2]).split('-')[0]}`;
  if ((m = c.match(/^(?:docker|podman) pull (\S+)/))) return `Using default tag: latest\nlatest: Pulling from library/${m[1]}\n${(hash(m[1]) % 0xffffff).toString(16)}a1f2: Pull complete\nDigest: sha256:${(hash(c) >>> 0).toString(16).repeat(8).slice(0, 64)}\nStatus: Downloaded newer image for ${m[1]}:latest`;
  if ((m = c.match(/^echo (.*)/)) && !/[|>]/.test(c)) return stripQ(m[1]).replace(/\$USER/g, USER).replace(/\$HOME/g, `/home/${USER}`).replace(/\$SHELL/g, '/bin/bash');
  for (const [re, out] of (UB.OUT || [])) { const mm = c.match(re); if (mm) { const r = typeof out === 'function' ? out(mm, c) : out; if (r != null) return r; } }
  if (/^(cd|mkdir|cp|mv|rm|rmdir|touch|chmod|chown|chgrp|ln|export|alias|unalias|source|\.|kill|pkill|killall|sleep|mount|umount|swapon|swapoff|usermod|useradd|groupadd|userdel|groupdel|setfacl|sed -i|true|exit|newgrp|xdg-open|gsettings set|systemd-run|chattr|renice|nice|chsh|hostnamectl set|timedatectl set|localectl set|sysctl --system|update-grub|exec|fg|bg|disown|wait|unset|nmcli con(nection)? (down|mod|delete)|ip (link|addr|route) (set|add|del))\b/.test(c)) return '';
  return null;
}
function usage(base) {
  const t = T[base] || {}, opts = optsFor(base);
  let o = `Usage: ${t.s || base + ' [options]'}\n`;
  if (t.d) o += `\n${t.d}\n`;
  if (opts.length) { o += '\nOptions & subcommands:\n'; opts.slice(0, 24).forEach(x => { o += `  ${x.f.padEnd(24)} ${x.d}\n`; }); if (opts.length > 24) o += `  … ${opts.length - 24} more — type: man ${base}\n`; }
  return o.trimEnd();
}
function manPage(base) {
  if (!BASES.has(base)) return `No manual entry for ${base}`;
  const t = T[base] || {}, opts = optsFor(base);
  const cards = [...new Set(ROWS.filter(r => r.base === base).map(r => `${r.sec.title} › ${r.card.title}`))];
  let o = `${base.toUpperCase()}(1)                 Ubuntu Bible Manual                 ${base.toUpperCase()}(1)\n\nNAME\n       ${base} - ${t.d || (ROWS.find(r => r.base === base) || {}).desc || 'command'}\n\nSYNOPSIS\n       ${t.s || base + ' [options] [arguments]'}\n`;
  if (opts.length) { o += '\nOPTIONS\n'; opts.forEach(x => { o += `       ${x.f}\n              ${x.d}\n`; }); }
  const ex = ROWS.filter(r => r.base === base).slice(0, 8);
  if (ex.length) { o += '\nEXAMPLES\n'; ex.forEach(r => { o += `       ${r.cmd}\n              ${r.desc}\n`; }); }
  if (cards.length) o += `\nSEE IN APP\n       ${cards.join('\n       ')}\n`;
  return o.trimEnd();
}
const BUILTIN = ['help', 'sections', 'commands', 'search', 'man', 'examples', 'history', 'clear'];
function runCore(input) {
  const raw = norm(input);
  if (!raw) return { out: '' };
  const [w0, ...rest] = raw.split(' '); const arg = rest.join(' ');
  switch (w0) {
    case 'help': return { out: `Ubuntu Bible terminal — simulated, nothing runs on your device.\n\nBuilt-ins:\n  help                 this help\n  sections             list all sections\n  commands <section>   list a section's commands (e.g. commands apt)\n  search <text>        search commands, flags and topics\n  man <cmd>            manual page for a command (e.g. man ufw)\n  examples [section]   random examples to try\n  history              show command history\n  clear                clear the screen\n\nShell basics: cd, pwd, ls [-la], cat, mkdir, touch, rm, cp, mv, echo … > file,\n  pipes ( | grep · head · tail · wc · sort · uniq ), chains ( && ; ),\n  sudo -i / exit for a root shell, export VAR=value\n\nAnything from the app runs too — try: sudo apt update, ufw status, netplan get\nKeys: Tab completes commands and paths · ↑/↓ history · Enter runs` };
    case 'clear': return { clear: true };
    case 'history': return { out: HIST.map((h, i) => `${String(i + 1).padStart(5)}  ${h}`).join('\n') || '(empty)' };
    case 'sections': return { out: S.map(s => `${s.id.padEnd(13)} ${s.title}  (${s.cards.reduce((a, c) => a + c.cmds.length, 0)} cmds)`).join('\n') + '\n\nType: commands <id>' };
    case 'commands': {
      if (!arg) return { out: 'usage: commands <section>   (type "sections" for ids)', err: true };
      const s = SEC[arg] || S.find(x => x.title.toLowerCase() === arg.toLowerCase() || x.title.toLowerCase().startsWith(arg.toLowerCase()));
      if (!s) return { out: `commands: no section "${arg}". Type "sections".`, err: true };
      return { out: `${s.title} — ${s.desc}\n` + s.cards.map(c => `\n[${c.title}]\n` + c.cmds.map(r => `  ${r[0]}\n      ${r[1]}`).join('\n')).join('\n') };
    }
    case 'search': {
      if (!arg) return { out: 'usage: search <text>', err: true };
      const r = search(arg).filter(x => x.t === 'Command' || x.t === 'Flag').slice(0, 25);
      return { out: r.length ? r.map(x => `${x.t === 'Command' ? '$' : '⚑'} ${x.title}\n    ${x.sub}`).join('\n') : `No matches for "${arg}".` };
    }
    case 'man': {
      if (!arg) return { out: 'What manual page do you want?\nFor example, try \'man man\'.', err: true };
      const b = arg.split(' ')[0];
      if (b === 'man') return { out: 'MAN(1)\n\nNAME\n       man - an interface to the system reference manuals\n\nIn this playground: man <cmd> shows syntax, options and examples gathered from the app.' };
      return { out: manPage(b), err: !BASES.has(b) };
    }
    case 'examples': {
      const pool = arg && SEC[arg] ? ROWS.filter(r => r.sec.id === arg) : ROWS;
      const pick = [...pool].sort(() => Math.random() - .5).slice(0, 8);
      return { out: 'Try one of these:\n' + pick.map(r => `  ${r.cmd}\n      ${r.desc}`).join('\n') };
    }
  }
  let pre = '';
  if (/^sudo\b/.test(raw) && !sudoAuthed) { sudoAuthed = true; pre = `[sudo: authenticate] Password: \n`; }
  const k = raw;
  let hit = EXACT.get(k);
  if (!hit && !/^sudo /.test(k) && EXACT.get('sudo ' + k)) {
    const b = baseOf(k);
    if (b === 'apt' || b === 'apt-get' || b === 'dpkg') return { out: `E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)\nE: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), are you root?\n\nhint: run it again with sudo — try: sudo ${k}`, err: true };
    hit = EXACT.get('sudo ' + k);
  }
  if (!hit && /^sudo /.test(k) && EXACT.get(k.replace(/^sudo /, ''))) hit = EXACT.get(k.replace(/^sudo /, ''));
  if (hit) {
    if (hit.out != null) return hit.out === '' ? { out: pre.trim(), quiet: true } : { out: pre + hit.out };
    const s = synth(k, hit.desc);
    if (s != null) return { out: pre + s, quiet: s === '' };
    return { out: pre + `# ${hit.desc}\n(simulated: command completed successfully, exit status 0)`, dim: true };
  }
  const base = baseOf(k);
  if (/(^|\s)(--help|-h)$/.test(k) && BASES.has(base)) return { out: pre + usage(base) };
  if (BASES.has(base) || ['echo', 'cd', 'mkdir', 'touch', 'cp', 'mv', 'rm'].includes(base)) {
    const s = synth(k);
    if (s != null) return { out: pre + s, quiet: s === '' };
    if (base === 'date' && k === 'date') return { out: new Date().toString().replace(/ GMT.*/, '') };
    if (base === 'pwd') return { out: `/home/${USER}` };
    if (base === 'whoami') return { out: USER };
    // closest documented command with the same tool (and same subcommand when there is one)
    const toks = k.split(' '), sub = toks[toks.indexOf(base) + 1];
    let best = null, bs = 0;
    ROWS.concat(DEMOS).filter(r => r.base === base).forEach(r => { const t = norm(r.cmd).split(' '); const set = new Set(t); const sc = toks.filter(x => set.has(x)).length / Math.max(t.length, toks.length) + (sub && t[t.indexOf(base) + 1] === sub ? 0.3 : 0); if (sc > bs) { bs = sc; best = r; } });
    if (best && bs >= 0.55 && !/^-/.test(sub || '')) { const r2 = runCore(best.cmd); if (r2.out && !r2.err) return { out: (pre + r2.out).trimStart() }; }
    if (INTERACTIVE.test(base)) return { out: pre + `(${base} opens an interactive program — not simulated here)`, dim: true };
    return { out: pre.trim(), quiet: true };
  }
  if (/^sudo$/.test(k)) return { out: 'usage: sudo -h | -K | -k | -V\nusage: sudo [-ABbEHnPS] [-u user] [command [arg ...]]' };
  const s0 = synth(k); if (s0 != null) return { out: pre + s0, quiet: s0 === '' };
  const pkg = INSTALLABLE[base];
  if (pkg) return { out: `Command '${base}' not found, but can be installed with:\nsudo ${pkg.startsWith('snap') ? pkg : 'apt install ' + pkg}`, err: true };
  return { out: `${base}: command not found`, err: true };
}
const INTERACTIVE = /^(vim?|nvim|nano|emacs|micro|less|more|man|top|htop|btop|mc|tmux|screen|python3?|node|irb|psql|mysql|sqlite3|ssh|mosh|sftp|ftp|telnet|bc|ncdu|nmtui|glances|lnav|fzf|tig|k9s)$/;
const INSTALLABLE = { ifconfig: 'net-tools', netstat: 'net-tools', route: 'net-tools', arp: 'net-tools', neofetch: 'neofetch', sl: 'sl', cowsay: 'cowsay', figlet: 'figlet', lolcat: 'lolcat', cmatrix: 'cmatrix', tree: 'tree', htop: 'htop', btop: 'btop', ncdu: 'ncdu', traceroute: 'traceroute', whois: 'whois', nmap: 'nmap', mtr: 'mtr-tiny', iperf3: 'iperf3', jq: 'jq', tldr: 'tldr', ranger: 'ranger', unrar: 'unrar', '7z': '7zip', zip: 'zip', unzip: 'unzip', gcc: 'gcc', make: 'make', cmake: 'cmake', docker: 'docker.io', podman: 'podman', pip: 'python3-pip', pip3: 'python3-pip', node: 'nodejs', npm: 'npm', java: 'default-jre', javac: 'default-jdk', go: 'golang-go', rustc: 'rustc', cargo: 'cargo', php: 'php-cli', ruby: 'ruby', composer: 'composer', ffmpeg: 'ffmpeg', vlc: 'vlc', gimp: 'gimp', mpv: 'mpv', code: 'snap install code --classic', kubectl: 'snap install kubectl --classic', helm: 'snap install helm --classic', terraform: 'snap install terraform --classic', fastfetch: 'fastfetch', bat: 'bat', eza: 'eza', fd: 'fd-find', rg: 'ripgrep', fzf: 'fzf', zsh: 'zsh', fish: 'fish', tmux: 'tmux', screen: 'screen', ansible: 'ansible', gh: 'gh', ollama: 'snap install ollama', lynis: 'lynis', clamscan: 'clamav', mosh: 'mosh', ssh: 'openssh-client', sshd: 'openssh-server', virsh: 'libvirt-clients', qemu: 'qemu-system-x86', nginx: 'nginx', apache2: 'apache2', mysql: 'mysql-client-core', psql: 'postgresql-client', sqlite3: 'sqlite3', redis: 'redis-tools' };
let SH = null;
function sudoPrefix(r) { if (!r || sudoAuthed) return r; sudoAuthed = true; return { ...r, out: '[sudo: authenticate] Password: ' + (r.out ? '\n' + r.out : ''), quiet: false }; }
function run(input) {
  if (!SH) SH = UB.makeShell({ runCore, EXACT, norm, HOST, HOME_USER: USER, isKnown: b => BASES.has(b) || /^(cd|pwd|ls|cat|echo|mkdir|touch|rm|cp|mv|whoami|id|which|env|tree|exit)$/.test(b), sudoPrefix });
  return SH.run(input);
}
function ps1() { return SH ? SH.prompt() : PS1; }

/* ---------- terminal UI ---------- */
let termReady = false, histIdx = -1;
const COMPLETE = () => [...new Set([...BUILTIN.map(b => b + ' '), ...ROWS.map(r => norm(r.cmd)), ...DEMOS.map(d => norm(d.cmd)), ...S.map(s => 'commands ' + s.id), ...[...BASES].map(b => 'man ' + b)])];
let COMP = null;
function renderTerminal(autorun) {
  view.innerHTML = `<div class="crumbs"><a href="#">Home</a><span>›</span><b>Terminal playground</b></div>
  <div class="term big">
    <div class="tbar"><i></i><i></i><i></i><span>${USER}@${HOST}: ~ — simulated</span></div>
    <div class="tscreen" id="tout" aria-live="polite"></div>
    <div class="tin"><label for="tin" class="ps">${esc(ps1())}</label><input id="tin" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" aria-label="Terminal input"><button id="tsend" class="send" aria-label="Run command">⏎</button></div>
    <div class="tkeys"><button data-key="tab">Tab</button><button data-key="up">↑</button><button data-key="down">↓</button><button data-key="help">help</button><button data-key="clear">clear</button></div>
  </div>
  <section class="browser">
    <h2 class="grp">Section browser</h2>
    <div class="bfrow"><input id="bfilter" type="text" placeholder="Type a command or filter…" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" aria-label="Type a command to run, or text to filter the list"><button id="brun" class="btn pri" aria-label="Run in terminal">▶ Run</button></div>
    <p class="bhint muted small">Enter or ▶ runs it in the terminal above · tap any command below to run it</p>
    <div class="chips collapsed" id="bchips"><button class="chip on" data-sec="">All</button>${S.map(s => `<button class="chip" data-sec="${s.id}">${s.icon} ${esc(s.title)}</button>`).join('')}</div>
    <button class="chipmore" id="chipMore" aria-expanded="false">Show all ${S.length} sections ▾</button>
    <div class="blist" id="blist"></div>
  </section>`;
  const out = $('#tout');
  if (!SH) run('');
  print(`Welcome to Ubuntu 26.04.1 LTS (GNU/Linux 7.0.0-14-generic x86_64) — Ubuntu Bible simulator\n\n * Type "help" for tips. Real shell basics work: cd, ls, cat, mkdir, pipes (|), && …\n * Everything is simulated — nothing runs on your device.`, 'dim');
  $('.tin .ps').textContent = ps1(); $('.term.big .tbar span').textContent = ps1().replace(/[#$]$/, '') + ' — simulated';
  termReady = true;
  renderBrowser();
  const tin = $('#tin');
  tin.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); exec(tin.value); }
    else if (e.key === 'Tab') { e.preventDefault(); complete(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); histMove(-1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); histMove(1); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); out.innerHTML = ''; }
  });
  $('#tsend').addEventListener('click', () => { exec(tin.value); tin.focus(); });
  if (autorun) exec(autorun); else if (matchMedia('(pointer:fine)').matches) tin.focus({ preventScroll: true });
}
function print(text, cls) {
  const out = $('#tout'); if (!out) return;
  const pre = document.createElement('pre'); pre.className = 'to' + (cls ? ' ' + cls : ''); pre.textContent = text; out.appendChild(pre);
}
function exec(cmd) {
  const out = $('#tout'), tin = $('#tin'); if (!out) return;
  cmd = norm(cmd); tin.value = ''; histIdx = -1;
  const line = document.createElement('div'); line.className = 'tl';
  line.innerHTML = `<span class="ps${SH && SH.user === 'root' ? ' root' : ''}">${esc(ps1())}</span> <span class="tc">${esc(cmd)}</span>`; out.appendChild(line);
  if (cmd) { HIST.push(cmd); if (HIST.length > 200) HIST.shift(); }
  const r = run(cmd);
  if (cmd) document.dispatchEvent(new CustomEvent('ub:visit', { detail: { type: 'run', cmd, ok: !r.err } }));
  const lab = $('.tin .ps'); if (lab) { lab.textContent = ps1(); lab.classList.toggle('root', SH.user === 'root'); }
  const tt = $('.term.big .tbar span'); if (tt) tt.textContent = ps1().replace(/[#$]$/, '') + ' — simulated';
  if (r.clear) out.innerHTML = '';
  else if (r.out) print(r.out, r.err ? 'err' : r.dim ? 'dim' : '');
  else if (r.quiet) print('(no output — success, exit status 0)', 'dim q');
  out.dataset.last = cmd;
  out.scrollTop = out.scrollHeight;
  return r;
}
function histMove(d) {
  if (!HIST.length) return;
  histIdx = histIdx === -1 ? (d < 0 ? HIST.length - 1 : -1) : histIdx + d;
  if (histIdx >= HIST.length) histIdx = -1;
  if (histIdx < -1) histIdx = 0;
  $('#tin').value = histIdx === -1 ? '' : HIST[Math.max(0, histIdx)];
}
function complete() {
  const tin = $('#tin'); const v = tin.value.replace(/^\s+/, '');
  COMP = COMP || COMPLETE();
  let c = COMP.filter(x => x.startsWith(v));
  if (!c.length && SH && / /.test(v)) { const i = v.lastIndexOf(' '); c = SH.paths(v.slice(i + 1)).map(p => v.slice(0, i + 1) + p); }
  if (!c.length) return;
  if (c.length === 1) { tin.value = c[0]; return; }
  let p = c[0]; for (const x of c) { while (!x.startsWith(p)) p = p.slice(0, -1); }
  if (p.length > v.length) tin.value = p;
  else { const l = document.createElement('div'); l.className = 'tl'; l.innerHTML = `<span class="ps">${esc(ps1())}</span> <span class="tc">${esc(v)}</span>`; $('#tout').appendChild(l); print(c.slice(0, 40).join('\n') + (c.length > 40 ? `\n… ${c.length - 40} more` : ''), 'dim'); $('#tout').scrollTop = 1e9; }
}
let bSec = '';
function renderBrowser() {
  const f = ($('#bfilter') || {}).value || '';
  const words = f.toLowerCase().split(/\s+/).filter(Boolean);
  const list = ROWS.filter(r => (!bSec || r.sec.id === bSec) && words.every(w => (r.cmd + ' ' + r.desc).toLowerCase().includes(w)));
  const shown = list.slice(0, 150);
  $('#blist').innerHTML = shown.map(r => `<button class="bitem" data-run="${esc(r.cmd)}"><code>${hl(r.cmd)}</code><span>${esc(r.desc)}</span></button>`).join('') + (list.length > shown.length ? `<p class="muted">${list.length - shown.length} more — refine the filter or pick a section.</p>` : '') + (!list.length ? '<p class="muted">No commands match.</p>' : '');
}


/* ---------- notepad (quick add) ---------- */
const Notes = (() => {
  let mem = null, persistent = true;
  try { const k = '__ub_t'; localStorage.setItem(k, '1'); localStorage.removeItem(k); } catch (e) { persistent = false; }
  function load() { if (mem) return mem; try { mem = JSON.parse(localStorage.getItem('ub-notes') || '[]'); } catch (e) { mem = []; } if (!Array.isArray(mem)) mem = []; return mem; }
  function save() { try { localStorage.setItem('ub-notes', JSON.stringify(mem)); } catch (e) {} badge(); }
  function badge() { const n = load().filter(x => !x.done).length, b = $('#btnNotes .nbadge'); b.hidden = !n; b.textContent = n > 99 ? '99+' : n; }
  const isCmd = t => /^(sudo\s+)?[a-z0-9][\w.+-]*(\s|$)/i.test(t) && BASES.has(baseOf(t));
  function add(text) {
    text = String(text || '').trim(); if (!text) return false;
    load().unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), t: text.slice(0, 2000), done: false, at: Date.now() });
    save(); return true;
  }
  function itemHTML(n) {
    return `<li class="np-it${n.done ? ' done' : ''}" data-id="${n.id}">
      <button class="np-chk" data-np="toggle" aria-label="${n.done ? 'Mark not done' : 'Mark done'}">${n.done ? '✓' : ''}</button>
      <span class="np-t" contenteditable="true" spellcheck="false" data-np-edit>${esc(n.t)}</span>
      <span class="np-act">${isCmd(n.t) ? `<button data-np="run" aria-label="Try in terminal" title="Try in terminal">&gt;_</button>` : ''}<button data-copy="${esc(n.t)}" aria-label="Copy" title="Copy">⧉</button><button data-np="del" aria-label="Delete" title="Delete">✕</button></span></li>`;
  }
  function renderList() {
    const L = load(), box = $('#npList'); if (!box) return;
    const done = L.filter(x => x.done).length;
    $('#npMeta').textContent = L.length ? `${L.length} item${L.length === 1 ? '' : 's'}${done ? ` · ${done} done` : ''}` : '';
    box.innerHTML = L.length ? L.map(itemHTML).join('') : `<li class="np-empty">No notes yet. Type above and press Enter — or tap “📝 Save to notepad” on any command.</li>`;
    $('#npTools').hidden = !L.length;
  }
  function open() {
    openSheet(`<div class="np">
      <div class="np-add"><input id="npIn" type="text" placeholder="Quick note or command…" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" aria-label="New note"><button id="npAddBtn" class="btn pri">Add</button></div>
      <div class="np-tools" id="npTools"><span id="npMeta"></span><span><button class="btn sm ghost2" data-np="copyall">⧉ Copy all</button><button class="btn sm ghost2" data-np="cleardone">Clear done</button></span></div>
      <ul class="np-list" id="npList"></ul>
      ${persistent ? '<p class="muted small">Saved on this device only.</p>' : '<p class="muted small">This preview can’t store data — notes last until you close it. Install the app to keep them.</p>'}
    </div>`, 'Notepad');
    renderList();
    const inp = $('#npIn');
    const commit = () => { if (add(inp.value)) { inp.value = ''; renderList(); toast('Added to notepad'); } inp.focus(); };
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } });
    $('#npAddBtn').addEventListener('click', commit);
    if (matchMedia('(pointer:fine)').matches) setTimeout(() => inp.focus(), 50);
  }
  function act(btn) {
    const a = btn.dataset.np, li = btn.closest('.np-it'), L = load(), it = li && L.find(x => x.id === li.dataset.id);
    if (a === 'toggle' && it) { it.done = !it.done; save(); renderList(); }
    else if (a === 'del' && it) { mem = L.filter(x => x !== it); save(); renderList(); toast('Deleted'); }
    else if (a === 'run' && it) { const c = it.t; closeSheet(false, () => tryInTerminal(c)); }
    else if (a === 'cleardone') { mem = L.filter(x => !x.done); save(); renderList(); }
    else if (a === 'copyall') { copy(L.map(x => (x.done ? '[x] ' : '[ ] ') + x.t).join('\n')); }
  }
  function edited(span) {
    const li = span.closest('.np-it'), it = li && load().find(x => x.id === li.dataset.id); if (!it) return;
    const t = span.textContent.trim();
    if (!t) { mem = load().filter(x => x !== it); save(); renderList(); return; }
    if (t !== it.t) { it.t = t; save(); }
  }
  document.addEventListener('focusout', e => { if (e.target.matches && e.target.matches('[data-np-edit]')) edited(e.target); });
  document.addEventListener('keydown', e => { if (e.target.matches && e.target.matches('[data-np-edit]') && e.key === 'Enter') { e.preventDefault(); e.target.blur(); } });
  $('#btnNotes').addEventListener('click', open);
  badge();
  return { open, add, act, load, renderList, get persistent() { return persistent; } };
})();

/* ---------- router ----------
   The current route lives in HASH, not only in location.hash: inside sandboxed/srcdoc previews a
   real "#…" navigation resolves against the parent page and blanks the app, so every in-app link
   is intercepted and routed here. history.pushState is used when allowed (deep links + Back). */
let curSec = null;
let HASH = location.hash;
function pushRoute(h) {
  try { history.pushState({ ubRoute: h }, '', h || location.pathname + location.search); return; } catch (e) {}
  try { history.pushState({ ubRoute: h }, ''); } catch (e) {}
}
function go(href) {
  const h = !href || href === '#' ? '' : href;
  if (h !== HASH) { HASH = h; pushRoute(h); }
  if (sheetOpen) closeSheet(true);
  route();
}
function route() {
  const q = $('#q').value.trim();
  if (q) { renderSearch(q); curSec = '#search'; return; }
  const h = decodeURIComponent(HASH.slice(1));
  const [sid, cid, pane] = h.split('/');
  if (!sid) { if (curSec !== '') { renderHome(); curSec = ''; } setTitle(); scrollTop(); return; }
  if (sid === 'terminal') { if (curSec !== 'terminal') { renderTerminal(); curSec = 'terminal'; } setTitle('Terminal'); scrollTop(); return; }
  const s = SEC[sid];
  if (!s) { renderHome(); curSec = ''; return; }
  const fresh = curSec !== sid;
  if (fresh) { renderSection(s); curSec = sid; }
  setTitle(s.title);
  if (cid && CARD[`${sid}/${cid}`]) {
    openCard(`${sid}/${cid}`, ['cmds', 'flags', 'term'].includes(pane) ? pane : 'cmds');
    const el = document.getElementById(`card-${sid}-${cid}`);
    if (el && (fresh || !pane)) setTimeout(() => el.scrollIntoView({ block: 'start', behavior: fresh ? 'auto' : 'smooth' }), 0);
  } else { openCard(null); if (fresh) scrollTop(); }
}
function setTitle(t) { document.title = t ? `${t} — Ubuntu Bible` : 'Ubuntu Bible'; }
function scrollTop() { window.scrollTo(0, 0); }
window.addEventListener('hashchange', () => { if (location.hash === HASH) return; HASH = location.hash; if (sheetOpen) closeSheet(true); route(); });

/* ---------- global events ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  const np = t.closest('[data-np]'); if (np) { e.preventDefault(); Notes.act(np); return; }
  const na = t.closest('[data-note-add]'); if (na) { if (Notes.add(na.dataset.noteAdd)) { toast('📝 Saved to notepad'); na.textContent = '✓ Saved'; } return; }
  const cp = t.closest('[data-copy]'); if (cp) { e.preventDefault(); e.stopPropagation(); copy(cp.dataset.copy); return; }
  if (t.closest('[data-close]') || t === scrim) { closeSheet(); return; }
  const tr = t.closest('[data-try]'); if (tr) { const c = tr.dataset.try; closeSheet(false, () => tryInTerminal(c)); return; }
  const nav = t.closest('[data-nav]'); if (nav) { e.preventDefault(); const href = nav.getAttribute('href'); closeSheet(false, () => { $('#q').value = ''; curSec = curSec === '#search' ? null : curSec; go(href); }); return; }
  const row = t.closest('.row[data-cmd], .res[data-cmd]'); if (row) { cmdPopup(row.dataset.cmd, row.dataset.card); return; }
  const clr = t.closest('[data-clear]'); if (clr) { e.preventDefault(); $('#q').value = ''; curSec = null; go(clr.getAttribute('href')); return; }
  const a = t.closest('a[href^="#"]'); if (a) { e.preventDefault(); go(a.getAttribute('href')); return; }
  const rp = t.closest('[data-replay]'); if (rp) { replay(rp.dataset.replay); return; }
  const pl = t.closest('[data-play]'); if (pl) { tryInTerminal(pl.dataset.play); return; }
  const ru = t.closest('[data-run]'); if (ru) { exec(ru.dataset.run); const tm = $('.term.big'); tm && tm.scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
  if (t.closest('#brun')) { browserRun(); return; }
  const cm = t.closest('#chipMore'); if (cm) { const b = $('#bchips'), open = b.classList.toggle('collapsed'); cm.setAttribute('aria-expanded', String(!open)); cm.textContent = open ? `Show all ${S.length} sections ▾` : 'Show fewer ▴'; return; }
  const ch = t.closest('#bchips .chip'); if (ch) { bSec = ch.dataset.sec; $$('#bchips .chip').forEach(x => x.classList.toggle('on', x === ch)); renderBrowser(); return; }
  const key = t.closest('[data-key]'); if (key) {
    const k = key.dataset.key, tin = $('#tin');
    if (k === 'tab') complete(); else if (k === 'up') histMove(-1); else if (k === 'down') histMove(1); else exec(k);
    tin && tin.focus({ preventScroll: true }); return;
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && sheetOpen) { e.preventDefault(); closeSheet(); return; }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.row[data-cmd], .res[data-cmd]')) { e.preventDefault(); cmdPopup(e.target.dataset.cmd, e.target.dataset.card); }
  if (e.key === '/' && !e.target.matches('input, textarea') && !sheetOpen) { e.preventDefault(); $('#q').focus(); }
});
document.addEventListener('input', e => { if (e.target.id === 'bfilter') renderBrowser(); });
/* section browser: Enter / ▶ runs what was typed (or the first match when it's just a filter word) */
function browserRun() {
  const inp = $('#bfilter'); if (!inp) return;
  const v = norm(inp.value); if (!v) { toast('Type a command first'); inp.focus(); return; }
  const first = $('#blist .bitem');
  const typedIsCommand = BUILTIN.includes(v.split(' ')[0]) || EXACT.has(v) || BASES.has(baseOf(v)) || /^(cd|ls|pwd|cat|echo|mkdir|touch|rm|cp|mv|whoami|id|which|env|tree|exit|export|sudo)\b/.test(v) || /[|&;>]/.test(v);
  const cmd = typedIsCommand || !first ? v : first.dataset.run;
  exec(cmd);
  inp.value = ''; renderBrowser();
  const term = $('.term.big'); if (term) term.scrollIntoView({ block: 'start', behavior: 'smooth' });
}
document.addEventListener('keydown', e => { if (e.target.id === 'bfilter' && (e.key === 'Enter' || e.keyCode === 13)) { e.preventDefault(); browserRun(); } });
function tryInTerminal(cmd) {
  $('#q').value = '';
  if (curSec === 'terminal' && HASH === '#terminal') { exec(cmd); return; }
  curSec = 'terminal'; renderTerminal(cmd);
  if (HASH !== '#terminal') { HASH = '#terminal'; pushRoute(HASH); }
  setTitle('Terminal'); scrollTop();
}
let qT;
$('#q').addEventListener('input', () => { clearTimeout(qT); qT = setTimeout(() => { curSec = null; route(); }, 120); });
$('#q').addEventListener('keydown', e => { if (e.key === 'Escape') { e.target.value = ''; curSec = null; route(); } });

/* ---------- theme ---------- */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  const m = $('meta[name="theme-color"]'); if (m) m.content = t === 'light' ? '#fbf6f2' : '#1b0a17';
}
$('#btnTheme').addEventListener('click', () => { const t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; applyTheme(t); store.set('ub-theme', t); toast(t === 'light' ? 'Light theme' : 'Dark theme'); });
applyTheme(document.documentElement.dataset.theme || 'dark');
$('#btnAbout').addEventListener('click', aboutPopup);

/* ---------- ambient music (Web Audio, off by default) ---------- */
const Music = {
  vol: (() => { const v = parseFloat(store.get('ub-vol')); return isNaN(v) ? 0.7 : Math.min(1, Math.max(0, v)); })(),
  track: (() => { const t = parseInt(store.get('ub-track'), 10); return t >= 0 && t < 3 ? t : 0; })(),
  level() { return 0.12 * this.vol * (this.TRACKS[this.track].gain || 1); },
  setVol(v) { this.vol = v; store.set('ub-vol', String(v)); if (this.ctx && this.on) { const now = this.ctx.currentTime; this.master.gain.cancelScheduledValues(now); this.master.gain.setTargetAtTime(this.level(), now, 0.08); } },
  ctx: null, master: null, on: false, timers: [], voices: [], gen: 0,
  f: m => 440 * Math.pow(2, (m - 69) / 12),
  rnd: a => a[Math.floor(Math.random() * a.length)],
  /* three generated tracks: each sets the shared filter/delay, then schedules its own voices */
  TRACKS: [
    { title: 'Neon Kernel', sub: 'ambient', cutoff: 900, q: 6, lfo: 0.05, lfoDepth: 500, delay: 0.6, fb: 0.42, wet: 0.35,
      play(M, g) {
        const chords = [[45, 52, 57, 64], [41, 48, 57, 60], [43, 50, 55, 62], [40, 47, 55, 59]];
        const chord = i => { if (!M.live(g)) return; const t = M.ctx.currentTime, dur = 9;
          chords[i % 4].forEach((n, j) => [-6, 6].forEach(det => M.voice(j === 0 ? 'triangle' : 'sawtooth', M.f(n), t, 3, j === 0 ? 0.16 : 0.05, dur + 2, det, true)));
          M.later(() => chord(i + 1), dur * 1000, g); };
        const blip = () => { if (!M.live(g)) return; M.voice('sine', M.f(M.rnd([69, 72, 74, 76, 79, 81, 84])), M.ctx.currentTime, 0.02, 0.05, 1.6); M.later(blip, 1200 + Math.random() * 2600, g); };
        chord(0); blip();
      } },
    { title: 'Deep Packet', sub: 'dark drone', cutoff: 520, q: 3, lfo: 0.03, lfoDepth: 260, delay: 0.9, fb: 0.5, wet: 0.4, gain: 1.25,
      play(M, g) {
        const roots = [38, 36, 41, 33];
        const drone = i => { if (!M.live(g)) return; const t = M.ctx.currentTime, dur = 14, r = roots[i % 4];
          [[r - 12, 'sine', 0.22, 0], [r, 'triangle', 0.09, -4], [r + 7, 'triangle', 0.06, 5], [r + 12, 'sine', 0.035, 3]]
            .forEach(([n, w, a, det]) => M.voice(w, M.f(n), t, 5, a, dur + 4, det, true));
          M.later(() => drone(i + 1), dur * 1000, g); };
        const wash = () => { if (!M.live(g)) return; const t = M.ctx.currentTime;   // filtered noise "wind"
          const src = M.ctx.createBufferSource(), bp = M.ctx.createBiquadFilter(), gn = M.ctx.createGain();
          src.buffer = M.noise(); src.loop = true; bp.type = 'bandpass'; bp.Q.value = 1.2;
          bp.frequency.setValueAtTime(300, t); bp.frequency.linearRampToValueAtTime(1100, t + 6); bp.frequency.linearRampToValueAtTime(260, t + 12);
          gn.gain.setValueAtTime(0, t); gn.gain.linearRampToValueAtTime(0.05, t + 4); gn.gain.linearRampToValueAtTime(0, t + 12);
          src.connect(bp).connect(gn).connect(M.lp); src.start(t); src.stop(t + 12.2); M.track_(src);
          M.later(wash, 9000 + Math.random() * 5000, g); };
        const bell = () => { if (!M.live(g)) return; const t = M.ctx.currentTime, n = M.rnd([50, 53, 55, 57, 60, 62]);
          M.voice('sine', M.f(n), t, 0.01, 0.07, 4); M.voice('sine', M.f(n) * 2.76, t, 0.01, 0.018, 1.8);
          M.later(bell, 5000 + Math.random() * 4500, g); };
        drone(0); M.later(wash, 1500, g); M.later(bell, 3000, g);
      } },
    { title: 'Orbit Shell', sub: 'arpeggio', cutoff: 1900, q: 4, lfo: 0.08, lfoDepth: 900, delay: 0.375, fb: 0.38, wet: 0.3, gain: 2.2,
      play(M, g) {
        const prog = [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 67], [52, 55, 59, 64]], step = 0.25, pattern = [0, 1, 2, 3, 2, 1, 3, 2];
        const bar = i => { if (!M.live(g)) return; const t0 = M.ctx.currentTime + 0.05, ch = prog[i % 4];
          ch.forEach((n, j) => M.voice('triangle', M.f(n - 12), t0, 1.2, j ? 0.03 : 0.06, 8.5, j % 2 ? 5 : -5, true));   // soft pad
          for (let k = 0; k < 32; k++) {
            const n = ch[pattern[k % 8]] + (k % 16 >= 8 ? 12 : 0);
            M.voice(k % 4 === 0 ? 'square' : 'triangle', M.f(n), t0 + k * step, 0.008, k % 4 === 0 ? 0.03 : 0.045, 0.32);
          }
          M.voice('sine', M.f(ch[0] - 24), t0, 0.05, 0.14, 7.8, 0, true);                                              // bass
          M.later(() => bar(i + 1), 32 * step * 1000, g); };
        bar(0);
      } }
  ],
  live(g) { return this.on && g === this.gen; },
  later(fn, ms, g) { this.timers.push(setTimeout(() => { if (this.live(g)) fn(); }, ms)); },
  track_(node) { this.voices.push(node); node.onended = () => { this.voices = this.voices.filter(v => v !== node); }; },
  voice(type, freq, t, attack, peak, len, detune = 0, sustain = false) {
    const ctx = this.ctx, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq; o.detune.value = detune;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + attack);
    if (sustain) g.gain.linearRampToValueAtTime(0, t + len); else g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g).connect(this.lp); o.start(t); o.stop(t + len + 0.1); this.track_(o);
  },
  noise() {
    if (this._noise) return this._noise;
    const len = this.ctx.sampleRate * 2, b = this.ctx.createBuffer(1, len, this.ctx.sampleRate), d = b.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { last = (last + 0.04 * (Math.random() * 2 - 1)) / 1.04; d[i] = last * 3.5; }   // soft brown-ish noise
    return (this._noise = b);
  },
  applyFx() {
    const T = this.TRACKS[this.track], now = this.ctx.currentTime;
    this.lp.frequency.setTargetAtTime(T.cutoff, now, 0.3); this.lp.Q.setTargetAtTime(T.q, now, 0.3);
    this.lfo.frequency.setTargetAtTime(T.lfo, now, 0.3); this.lfoG.gain.setTargetAtTime(T.lfoDepth, now, 0.3);
    this.dly.delayTime.setTargetAtTime(T.delay, now, 0.2); this.fb.gain.setTargetAtTime(T.fb, now, 0.2); this.wet.gain.setTargetAtTime(T.wet, now, 0.2);
  },
  killVoices() { this.voices.forEach(v => { try { v.stop(); } catch (e) {} }); this.voices = []; },
  start() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) { toast('Web Audio not supported'); return false; }
    if (!this.ctx) {
      const ctx = this.ctx = new AC();
      this.master = ctx.createGain(); this.master.gain.value = 0;
      const lp = this.lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 6;
      this.lfo = ctx.createOscillator(); this.lfoG = ctx.createGain(); this.lfo.frequency.value = 0.05; this.lfoG.gain.value = 500; this.lfo.connect(this.lfoG).connect(lp.frequency); this.lfo.start();
      this.dly = ctx.createDelay(2); this.fb = ctx.createGain(); this.wet = ctx.createGain(); this.dly.delayTime.value = 0.6; this.fb.gain.value = 0.42; this.wet.gain.value = 0.35;
      lp.connect(this.master); lp.connect(this.dly); this.dly.connect(this.fb).connect(this.dly); this.dly.connect(this.wet).connect(this.master);
      this.master.connect(ctx.destination);
    }
    this.ctx.resume();
    this.timers.forEach(clearTimeout); this.timers = []; this.killVoices();
    const now = this.ctx.currentTime, g = ++this.gen;
    this.master.gain.cancelScheduledValues(now); this.master.gain.setValueAtTime(this.master.gain.value, now); this.master.gain.linearRampToValueAtTime(this.level(), now + 3);
    this.on = true; this.applyFx(); this.TRACKS[this.track].play(this, g); return true;
  },
  stop() {
    this.on = false; this.gen++; this.timers.forEach(clearTimeout); this.timers = [];
    if (!this.ctx) return;
    const now = this.ctx.currentTime, g = this.gen; this.master.gain.cancelScheduledValues(now); this.master.gain.setValueAtTime(this.master.gain.value, now); this.master.gain.linearRampToValueAtTime(0, now + 1.2);
    this.timers.push(setTimeout(() => { if (this.on || g !== this.gen) return; this.killVoices(); this.ctx.suspend(); }, 1400));
  },
  setTrack(i) {
    this.track = (i + this.TRACKS.length) % this.TRACKS.length; store.set('ub-track', String(this.track));
    if (!this.on || !this.ctx) return;
    // quick crossfade: dip, swap voices + effects, rise
    this.timers.forEach(clearTimeout); this.timers = [];
    const g = ++this.gen, now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now); this.master.gain.setValueAtTime(this.master.gain.value, now); this.master.gain.linearRampToValueAtTime(0, now + 0.35);
    this.timers.push(setTimeout(() => {
      if (!this.on || g !== this.gen) return;
      this.killVoices(); this.applyFx();
      const t = this.ctx.currentTime; this.master.gain.cancelScheduledValues(t); this.master.gain.setValueAtTime(0, t); this.master.gain.linearRampToValueAtTime(this.level(), t + 1.5);
      this.TRACKS[this.track].play(this, g);
    }, 400));
  },
  next() { this.setTrack(this.track + 1); }
};
/* ---------- mini media player (bottom pill ⇄ draggable bubble) ---------- */
const MP = (() => {
  const el = document.createElement('div');
  el.id = 'mplayer'; el.className = 'mp'; el.hidden = true;
  el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'Ambient music player');
  el.innerHTML = `
    <button class="mp-play" aria-label="Pause"><span class="i-pause"></span><span class="i-play"></span></button>
    <button class="mp-next" aria-label="Next track" title="Change track"><span></span></button>
    <button class="mp-eq" aria-label="Minimise to bubble" title="Minimise (or swipe sideways)"><i></i><i></i><i></i><i></i><i></i></button>
    <div class="mp-txt"><b></b><span></span></div>
    <input class="mp-vol" type="range" min="0" max="100" step="1" aria-label="Volume">
    <button class="mp-x" aria-label="Close player">✕</button>`;
  document.body.appendChild(el);
  const btn = $('#btnMusic'), play = $('.mp-play', el), vol = $('.mp-vol', el);
  let mode = 'pill', pos = null; // pos = {x,y} in px for the current mode
  const PAD = 10;
  function syncTrack(anim) {
    const T = Music.TRACKS[Music.track], txt = $('.mp-txt', el);
    $('b', txt).textContent = T.title; $('span', txt).textContent = `${T.sub} · ${Music.track + 1}/${Music.TRACKS.length}`;
    el.dataset.track = Music.track;
    if (anim) { txt.classList.remove('swap'); void txt.offsetWidth; txt.classList.add('swap'); }
  }
  function syncVol() { vol.value = Math.round(Music.vol * 100); vol.style.setProperty('--v', vol.value + '%'); }
  function sync() {
    el.classList.toggle('playing', Music.on);
    play.setAttribute('aria-label', Music.on ? 'Pause' : 'Play');
    btn.classList.toggle('on', !el.hidden); btn.setAttribute('aria-pressed', String(!el.hidden));
    btn.title = el.hidden ? 'Ambient music (off)' : 'Ambient music (on)';
    document.body.classList.toggle('mp-open', !el.hidden && mode === 'pill');
  }
  function clamp(x, y) {
    const r = el.getBoundingClientRect(), W = innerWidth, H = innerHeight;
    return { x: Math.min(Math.max(PAD, x), Math.max(PAD, W - r.width - PAD)), y: Math.min(Math.max(PAD + 50, y), H - r.height - PAD) };
  }
  function place(p, anim) {
    el.style.transition = anim ? 'left .28s cubic-bezier(.2,.8,.2,1), top .28s cubic-bezier(.2,.8,.2,1)' : 'none';
    if (!p) { el.style.left = ''; el.style.top = ''; el.classList.remove('moved'); pos = null; return; }
    const c = clamp(p.x, p.y); pos = c; el.classList.add('moved');
    el.style.left = c.x + 'px'; el.style.top = c.y + 'px';
  }
  function toBubble(side) {
    const r = el.getBoundingClientRect();
    mode = 'bubble'; el.classList.add('bubble'); el.classList.remove('moved'); el.tabIndex = 0; el.setAttribute('aria-label', 'Music bubble — tap to expand');
    el.style.transition = 'none'; el.style.left = r.left + 'px'; el.style.top = r.top + 'px';
    requestAnimationFrame(() => {
      const b = el.getBoundingClientRect();
      const x = side === 'left' ? PAD : innerWidth - b.width - PAD;
      place({ x, y: Math.min(r.top + r.height / 2 - b.height / 2, innerHeight - b.height - 90) }, true);
    });
    sync(); toast('Swiped to bubble — tap it to expand');
  }
  function toPill() {
    mode = 'pill'; el.classList.remove('bubble'); el.removeAttribute('tabindex'); el.setAttribute('aria-label', 'Ambient music player'); place(null, false);
    el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 300); sync();
  }
  function show() { el.hidden = false; if (mode === 'pill') place(null); requestAnimationFrame(() => el.classList.add('in')); sync(); }
  function hide() { el.classList.remove('in'); el.hidden = true; mode = 'pill'; el.classList.remove('bubble'); place(null); sync(); }
  function togglePlay() { if (Music.on) Music.stop(); else Music.start(); sync(); }
  // pointer: drag anywhere that isn't a control; tap bubble to expand; horizontal swipe on pill → bubble
  let d = null;
  el.addEventListener('pointerdown', e => {
    if (mode === 'pill' && e.target.closest('button, input')) return;
    const r = el.getBoundingClientRect();
    e.preventDefault();
    d = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: r.left, oy: r.top, t: Date.now(), moved: false };
    try { el.setPointerCapture(e.pointerId); } catch (_) {}
  });
  el.addEventListener('pointermove', e => {
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    d.moved = true; e.preventDefault(); el.classList.add('dragging');
    place({ x: d.ox + dx, y: d.oy + dy }, false);
  });
  const end = e => {
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy, dt = Math.max(1, Date.now() - d.t), moved = d.moved;
    d = null; el.classList.remove('dragging');
    if (mode === 'bubble') {
      if (!moved) { toPill(); return; }
      const b = el.getBoundingClientRect();           // snap bubble to nearest side
      place({ x: b.left + b.width / 2 < innerWidth / 2 ? PAD : innerWidth - b.width - PAD, y: b.top }, true);
      return;
    }
    if (moved && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.4 && (Math.abs(dx) / dt > 0.35 || Math.abs(dx) > innerWidth * 0.3)) toBubble(dx < 0 ? 'left' : 'right');
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('dragstart', e => e.preventDefault());
  el.addEventListener('pointercancel', e => { if (d && e.pointerId === d.id) { d = null; el.classList.remove('dragging'); } });
  el.addEventListener('click', e => {
    if (mode === 'bubble') return;
    if (e.target.closest('.mp-play')) togglePlay();
    else if (e.target.closest('.mp-next')) { Music.next(); if (!Music.on) { Music.start(); } syncTrack(true); sync(); toast('♪ ' + Music.TRACKS[Music.track].title); }
    else if (e.target.closest('.mp-eq')) toBubble('right');
    else if (e.target.closest('.mp-x')) { Music.stop(); hide(); toast('Music off'); }
  });
  el.addEventListener('keydown', e => { if (mode === 'bubble' && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toPill(); } });
  vol.addEventListener('input', () => { Music.setVol(vol.value / 100); vol.style.setProperty('--v', vol.value + '%'); });
  addEventListener('resize', () => { if (pos) place(pos, false); });
  syncVol(); syncTrack(false);
  return { show, hide, sync, el, toBubble, toPill, get mode() { return mode; } };
})();
$('#btnMusic').addEventListener('click', () => {
  if (!MP.el.hidden) { Music.stop(); MP.hide(); toast('Music off'); return; }
  if (Music.start()) { MP.show(); toast('Ambient music on'); }
});

/* ---------- PWA ---------- */
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !window.UB_INLINE) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}

/* expose for tests */
UB.go = go; UB.run = run; UB.shell = () => SH; UB.exec = exec; UB.ROWS = ROWS; UB.DEMOS = DEMOS; UB.FLAGS = FLAGS; UB.totals = totals; UB.usesOf = usesOf; UB.optsFor = optsFor; UB.cmdPopup = cmdPopup; UB.Notes = Notes; UB.MP = MP; UB.Music = Music;  UB.speechText = () => LAST_SPEECH; UB.closeSheet = closeSheet;
/* ---------- fixed top chrome: header + search always visible ---------- */
(function pinChrome() {
  const top = $('.top'), bar = $('.bar'), root = document.documentElement;
  const measure = () => { const h = top.offsetHeight, b = bar.offsetHeight; root.style.setProperty('--hdrH', h + 'px'); root.style.setProperty('--chromeH', (h + b) + 'px'); };
  measure(); addEventListener('resize', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(top);
  const onScroll = () => document.body.classList.toggle('scrolled', scrollY > 4);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();
route();
})();
