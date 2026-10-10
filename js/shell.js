/* Ubuntu Bible — shell layer for the terminal playground (v1.6).
   Adds a small virtual filesystem (cd/pwd/ls/cat/mkdir/touch/rm/cp/mv/echo >), a root shell
   (sudo -i / su / exit), && ; chains, and pipes (grep/head/tail/wc/sort/uniq/tee).
   app.js calls UB.makeShell({...}) and uses the returned run() for the playground. */
UB.makeShell = function (api) {
  'use strict';
  const { runCore, EXACT, norm, HOST, HOME_USER } = api;
  const st = { user: HOME_USER, cwd: '/home/' + HOME_USER, env: { USER: HOME_USER, HOME: '/home/' + HOME_USER, SHELL: '/bin/bash', LANG: 'en_US.UTF-8', PATH: '/home/' + HOME_USER + '/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin' } };
  const H = () => '/home/' + HOME_USER;

  /* ---------- virtual filesystem ---------- */
  const FS = new Map(); // path -> {d:bool, c:string, t:'Oct  3 09:20', m:'drwxr-xr-x', o:'ssk'}
  const now = () => { const d = new Date(); return d.toLocaleString('en-US', { month: 'short' }) + ' ' + String(d.getDate()).padStart(2, ' ') + ' ' + d.toTimeString().slice(0, 5); };
  function mk(path, isDir, content, owner, time, mode) {
    const parts = path.split('/').filter(Boolean); let p = '';
    for (let i = 0; i < parts.length - 1; i++) { p += '/' + parts[i]; if (!FS.has(p)) FS.set(p, { d: true, o: p.startsWith(H()) ? HOME_USER : 'root', t: 'Apr 24 18:02' }); }
    FS.set(path || '/', { d: isDir, c: content || '', o: owner || (path.startsWith(H()) ? HOME_USER : 'root'), t: time || 'Oct  3 09:20', m: mode });
  }
  FS.set('/', { d: true, o: 'root', t: 'Apr 24 17:58' });
  ['bin', 'boot', 'dev', 'etc', 'home', 'lib', 'lib64', 'media', 'mnt', 'opt', 'proc', 'root', 'run', 'sbin', 'snap', 'srv', 'sys', 'tmp', 'usr', 'var'].forEach(d => mk('/' + d, true, '', 'root', 'Apr 24 17:58'));
  const home = H();
  [['Desktop', 'Oct  2 17:45'], ['Documents', 'Oct  3 08:59'], ['Downloads', 'Oct  3 09:20'], ['Music', 'Sep 30 21:04'], ['Pictures', 'Oct  1 08:11'], ['Videos', 'Sep 28 19:12'], ['Public', 'Apr 24 18:05'], ['Templates', 'Apr 24 18:05'], ['projects', 'Oct  9 20:02'], ['snap', 'Sep 12 10:03']].forEach(([d, t]) => mk(home + '/' + d, true, '', HOME_USER, t));
  const files = {
    '.bashrc': '# ~/.bashrc: executed by bash(1) for non-login shells.\ncase $- in\n    *i*) ;;\n      *) return;;\nesac\nHISTCONTROL=ignoreboth\nshopt -s histappend\nHISTSIZE=1000\nalias ll=\'ls -alF\'\nalias la=\'ls -A\'\nif [ -f ~/.bash_aliases ]; then\n    . ~/.bash_aliases\nfi',
    '.profile': '# ~/.profile: executed by the command interpreter for login shells.\nif [ -n "$BASH_VERSION" ]; then\n    if [ -f "$HOME/.bashrc" ]; then\n\t. "$HOME/.bashrc"\n    fi\nfi\nif [ -d "$HOME/.local/bin" ] ; then\n    PATH="$HOME/.local/bin:$PATH"\nfi',
    '.bash_logout': '# ~/.bash_logout: executed by bash(1) when login shell exits.',
    'notes.txt': 'Ubuntu Bible scratch notes\n- try: sudo apt update\n- try: ls -la /etc\n- try: cat /etc/os-release | grep VERSION',
    'Documents/notes.md': '# Notes\n\n* Back up ~/Documents every Friday\n* Upgrade servers to 26.04.1\n* Renew TLS certs before 2027-01-01',
    'Documents/report-q3.pdf': '%PDF-1.7 (binary file)',
    'Documents/todo.txt': 'buy USB stick\nflash Ubuntu 26.04 ISO\nbackup photos\nupdate firmware',
    'Downloads/ubuntu-26.04.1-desktop-amd64.iso': '(binary ISO image)',
    'Downloads/google-chrome-stable_current_amd64.deb': '(Debian binary package)',
    'Pictures/wallpaper.jpg': '(JPEG image)',
    'projects/demo/app.py': 'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/health")\ndef health():\n    return {"ok": True}',
    'projects/demo/README.md': '# demo\n\nA tiny Flask app used in Ubuntu Bible examples.',
    'projects/demo/requirements.txt': 'flask==3.1.2\ngunicorn==23.0.0'
  };
  const sizes = { 'Documents/report-q3.pdf': 421990, 'Downloads/ubuntu-26.04.1-desktop-amd64.iso': 6563790848, 'Downloads/google-chrome-stable_current_amd64.deb': 118422016, 'Pictures/wallpaper.jpg': 2841192 };
  Object.entries(files).forEach(([f, c]) => { mk(home + '/' + f, false, c, HOME_USER); if (sizes[f]) FS.get(home + '/' + f).sz = sizes[f]; });
  mk(home + '/.ssh', true, '', HOME_USER, 'Aug 19 12:40', 'drwx------'); mk(home + '/.config', true, '', HOME_USER, 'Oct  1 08:11', 'drwx------'); mk(home + '/.cache', true, '', HOME_USER, 'Sep 30 21:04', 'drwx------');
  mk(home + '/.ssh/id_ed25519.pub', false, 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG3k0bS2x7Lq9vR4mT1pY8cN5wE6hJ2uF0aK3dZ7sQ1w ssk@laptop', HOME_USER, 'Aug 19 12:40');
  mk(home + '/.ssh/config', false, 'Host web\n    HostName 10.0.0.20\n    User deploy', HOME_USER, 'Aug 19 12:40', '-rw-------');
  mk('/root/.bashrc', false, '# root bashrc', 'root');
  const sys = {
    '/etc/hosts': '127.0.0.1\tlocalhost\n127.0.1.1\tubuntu\n\n# The following lines are desirable for IPv6 capable hosts\n::1     ip6-localhost ip6-loopback\nff02::1 ip6-allnodes\nff02::2 ip6-allrouters',
    '/etc/fstab': '# /etc/fstab: static file system information.\n# <file system> <mount point>   <type>  <options>       <dump>  <pass>\nUUID=c1b2d3e4-8f9a-4b0c-9d1e-2f3a4b5c6d7e /               ext4    errors=remount-ro 0       1\nUUID=5A1C-9F3E  /boot/efi       vfat    umask=0077      0       1\n/swap.img\tnone\tswap\tsw\t0\t0',
    '/etc/timezone': 'Asia/Qatar', '/etc/shells': '# /etc/shells: valid login shells\n/bin/sh\n/bin/bash\n/usr/bin/bash\n/bin/dash\n/usr/bin/dash',
    '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nsystemd-resolve:x:991:991:systemd Resolver:/:/usr/sbin/nologin\nssk:x:1000:1000:SSK,,,:/home/ssk:/bin/bash',
    '/etc/group': 'root:x:0:\nadm:x:4:syslog,ssk\nsudo:x:27:ssk\nusers:x:100:ssk\nssk:x:1000:',
    '/etc/ssh/sshd_config': 'Include /etc/ssh/sshd_config.d/*.conf\n#Port 22\n#PermitRootLogin prohibit-password\nKbdInteractiveAuthentication no\nUsePAM yes\nX11Forwarding yes\nPrintMotd no\nAcceptEnv LANG LC_* COLORTERM NO_COLOR\nSubsystem\tsftp\t/usr/lib/openssh/sftp-server',
    '/etc/resolv.conf': '# This is /run/systemd/resolve/stub-resolv.conf managed by man:systemd-resolved(8).\nnameserver 127.0.0.53\noptions edns0 trust-ad\nsearch lan',
    '/var/log/syslog': '2026-10-10T09:12:44.112+03:00 ubuntu systemd[1]: Started cron.service - Regular background program processing daemon.\n2026-10-10T09:13:02.401+03:00 ubuntu NetworkManager[903]: <info>  [1791021182.4012] device (wlp0s20f3): state change: activated\n2026-10-10T09:40:11.000+03:00 ubuntu systemd[1]: Started ssh.service - OpenBSD Secure Shell server.',
    '/var/log/auth.log': '2026-10-10T09:40:12.341+03:00 ubuntu sshd[5034]: Accepted publickey for ssk from 192.168.1.24 port 51544 ssh2: ED25519 SHA256:q9Vb2kG0yLwH8f3N1mT6cXz4pR7sA5dE2uJ0iK8oQ1w\n2026-10-10T09:41:02.118+03:00 ubuntu sudo: ssk : TTY=pts/1 ; PWD=/home/ssk ; USER=root ; COMMAND=/usr/bin/apt update',
    '/var/log/dpkg.log': '2026-10-03 09:31:12 startup archives unpack\n2026-10-03 09:31:12 install htop:amd64 <none> 3.4.1-5\n2026-10-03 09:31:13 status installed htop:amd64 3.4.1-5'
  };
  Object.entries(sys).forEach(([p, c]) => mk(p, false, c, 'root', 'Apr 24 18:01'));
  ['/etc/netplan', '/etc/apt', '/etc/apt/sources.list.d', '/etc/systemd', '/etc/ufw', '/var/www', '/var/www/html', '/var/log/apt', '/usr/bin', '/usr/lib', '/usr/share', '/usr/local', '/usr/local/bin', '/opt'].forEach(d => mk(d, true, '', 'root', 'Apr 24 17:58'));
  ['bash', 'ls', 'cat', 'apt', 'snap', 'git', 'python3', 'ssh', 'sudo', 'systemctl', 'nano', 'curl', 'ufw', 'netplan'].forEach(b => mk('/usr/bin/' + b, false, '(ELF 64-bit executable)', 'root', 'Apr  8 12:00', '-rwxr-xr-x'));
  // files whose documented `cat` output lives in the app become real files
  EXACT.forEach((v, k) => { const m = k.match(/^(?:sudo )?cat (\/[\w./-]+|~\/[\w./-]+)$/); if (m && v.out && !/^\(/.test(v.out)) { const p = m[1].replace(/^~/, home); if (!FS.has(p)) mk(p, false, v.out, p.startsWith(home) ? HOME_USER : 'root', 'Apr 24 18:01'); } });

  /* ---------- paths ---------- */
  function resolve(p) {
    if (!p || p === '~') return st.user === 'root' ? '/root' : home;
    if (p === '-') return st.oldpwd || st.cwd;
    p = p.replace(/^~(?=\/|$)/, st.user === 'root' ? '/root' : home);
    const abs = p.startsWith('/') ? p : st.cwd + '/' + p;
    const out = [];
    abs.split('/').forEach(s => { if (!s || s === '.') return; if (s === '..') out.pop(); else out.push(s); });
    return '/' + out.join('/');
  }
  const pretty = p => { const h = st.user === 'root' ? '/root' : home; return p === h ? '~' : p.startsWith(h + '/') ? '~' + p.slice(h.length) : p; };
  const children = dir => [...FS.keys()].filter(k => k !== dir && k.startsWith(dir === '/' ? '/' : dir + '/') && !k.slice(dir === '/' ? 1 : dir.length + 1).includes('/')).map(k => k.slice(k.lastIndexOf('/') + 1)).sort((a, b) => a.replace(/^\./, '').localeCompare(b.replace(/^\./, ''), 'en', { sensitivity: 'base' }));
  const canRead = p => st.user === 'root' || !(p === '/root' || p.startsWith('/root/'));

  /* ---------- tokenizer ---------- */
  function tokens(s) {
    const out = []; let cur = '', q = null, has = false;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (q) { if (ch === q) q = null; else cur += ch; continue; }
      if (ch === '"' || ch === "'") { q = ch; has = true; continue; }
      if (/\s/.test(ch)) { if (cur || has) { out.push(cur); cur = ''; has = false; } continue; }
      cur += ch;
    }
    if (cur || has) out.push(cur);
    return out.map(t => t.replace(/\$(\w+)|\$\{(\w+)\}/g, (m, a, b) => st.env[a || b] != null ? st.env[a || b] : ''));
  }
  // split on a top-level operator list, respecting quotes
  function splitTop(s, ops) {
    const parts = []; let cur = '', q = null;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (q) { cur += ch; if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
      const op = ops.find(o => s.startsWith(o, i) && !(o === '|' && (s[i + 1] === '|' || s[i - 1] === '|')) && !(o === '&&' && false));
      if (op) { parts.push({ cmd: cur.trim(), op }); cur = ''; i += op.length - 1; continue; }
      cur += ch;
    }
    parts.push({ cmd: cur.trim(), op: null });
    return parts.filter(p => p.cmd);
  }

  /* ---------- ls ---------- */
  function lsLong(path, name, human) {
    const e = FS.get(path) || { d: false };
    const mode = e.m || (e.d ? (path.startsWith(home + '/.') ? 'drwx------' : 'drwxr-xr-x') : '-rw-r--r--');
    const size = e.d ? 4096 : (e.sz || Math.max(e.c ? e.c.length + 1 : 0, 0));
    const hs = n => n < 1024 ? String(n) : n < 1048576 ? (n / 1024).toFixed(n < 10240 ? 1 : 0) + 'K' : n < 1073741824 ? (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + 'M' : (n / 1073741824).toFixed(1) + 'G';
    const o = e.o || 'root';
    return `${mode} ${e.d ? String(Math.max(2, children(path).filter(c => FS.get(path + '/' + c) && FS.get(path + '/' + c).d).length + 2)).padStart(2) : ' 1'} ${o.padEnd(4)} ${o.padEnd(4)} ${String(human ? hs(size) : size).padStart(human ? 4 : 10)} ${e.t || 'Oct  3 09:20'} ${name}`;
  }
  function ls(args, piped) {
    const flags = args.filter(a => /^-\w/.test(a)).join('').replace(/-/g, ''), paths = args.filter(a => !/^-/.test(a));
    const all = /a/.test(flags), almost = /A/.test(flags), long = /l/.test(flags), human = /h/.test(flags), one = /1/.test(flags) || piped, dirOnly = /d/.test(flags);
    const targets = paths.length ? paths : ['.'];
    const out = []; let err = false;
    targets.forEach((t, ti) => {
      const p = resolve(t), e = FS.get(p);
      if (!e) { out.push(`ls: cannot access '${t}': No such file or directory`); err = true; return; }
      if (!canRead(p)) { out.push(`ls: cannot open directory '${t}': Permission denied`); err = true; return; }
      if (!e.d || dirOnly) { out.push(long ? lsLong(p, t, human) : t); return; }
      let names = children(p).filter(n => all || almost || !n.startsWith('.'));
      if (all) names = ['.', '..', ...names];
      if (targets.length > 1) out.push((ti ? '\n' : '') + t + ':');
      if (long) { out.push('total ' + (names.length * 4) + (human ? 'K' : '')); names.forEach(n => out.push(lsLong(n === '.' ? p : n === '..' ? resolve(p + '/..') : p + '/' + n, n, human))); }
      else if (one) names.forEach(n => out.push(n));
      else if (names.length) out.push(names.join('  '));
    });
    return { out: out.join('\n'), err, quiet: !out.length };
  }

  /* ---------- builtins over the VFS ---------- */
  function fsCmd(t, piped) {
    let a = t.slice(); let sudo = false;
    if (a[0] === 'sudo') { sudo = true; a.shift(); while (a[0] && a[0].startsWith('-') && !['-i', '-s'].includes(a[0])) a.shift(); }
    const c = a[0], args = a.slice(1), files = args.filter(x => !x.startsWith('-'));
    const asRoot = sudo || st.user === 'root';
    const denied = p => !asRoot && !p.startsWith(home) && !p.startsWith('/tmp');
    switch (c) {
      case 'cd': {
        const p = resolve(args[0]); const e = FS.get(p);
        if (!e) return { out: `bash: cd: ${args[0]}: No such file or directory`, err: true };
        if (!e.d) return { out: `bash: cd: ${args[0]}: Not a directory`, err: true };
        if (!canRead(p)) return { out: `bash: cd: ${args[0]}: Permission denied`, err: true };
        st.oldpwd = st.cwd; st.cwd = p; return { out: args[0] === '-' ? p : '', quiet: args[0] !== '-' };
      }
      case 'pwd': return { out: st.cwd };
      case 'true': case ':': return { out: '', quiet: true };
      case 'false': return { out: '', err: true, quiet: true };
      case 'whoami': return { out: st.user };
      case 'id': return { out: st.user === 'root' ? 'uid=0(root) gid=0(root) groups=0(root)' : 'uid=1000(ssk) gid=1000(ssk) groups=1000(ssk),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users),114(lpadmin)' };
      case 'ls': case 'll': case 'la': {
        const extra = c === 'll' ? ['-alF'] : c === 'la' ? ['-A'] : [];
        // keep documented special cases (e.g. snap list --all | awk) out of the VFS
        if (files.some(f => /[*?]/.test(f))) return null;
        if (files.some(f => !FS.has(resolve(f))) && files.some(f => /^\/(proc|sys|dev|run|boot|snap)\b/.test(resolve(f)))) return null;
        return ls(extra.concat(args), piped);
      }
      case 'tree': {
        const li = args.indexOf('-L'), lvl = li >= 0 ? +args[li + 1] || 3 : 3, dirArg = args.filter((x, i) => !x.startsWith('-') && i !== li + 1)[0];
        const root = resolve(dirArg || '.'); if (!FS.has(root)) return { out: `${dirArg}  [error opening dir]\n\n0 directories, 0 files`, err: true }; let nd = 0, nf = 0; const lines = [dirArg || '.'];
        const walk = (p, pre, depth) => { if (depth > lvl) return; const ch = children(p).filter(n => !n.startsWith('.')); ch.forEach((n, i) => { const last = i === ch.length - 1, q = p + '/' + n, d = FS.get(q).d; d ? nd++ : nf++; lines.push(pre + (last ? '└── ' : '├── ') + n); if (d) walk(q, pre + (last ? '    ' : '│   '), depth + 1); }); };
        walk(root, '', 1); lines.push('', `${nd} directories, ${nf} files`); return { out: lines.join('\n') };
      }
      case 'cat': case 'less': case 'more': case 'head': case 'tail': case 'wc': case 'bat': case 'batcat': {
        if (!files.length || files.some(f => /[*?]/.test(f))) return null;
        const outs = []; let err = false;
        for (const f of files) {
          if (c === 'head' || c === 'tail') { if (/^\d+$/.test(f) && args[args.indexOf(f) - 1] === '-n') continue; }
          const p = resolve(f), e = FS.get(p);
          if (!e) { if (/^\/(proc|sys|dev|run|var|etc|usr|boot)\//.test(p)) return null; outs.push(`${c}: ${f}: No such file or directory`); err = true; continue; }
          if (e.d) { outs.push(`${c}: ${f}: Is a directory`); err = true; continue; }
          if (!canRead(p) || (/^\/etc\/(shadow|sudoers)/.test(p) && !asRoot)) { outs.push(`${c}: ${f}: Permission denied`); err = true; continue; }
          outs.push(applyFilter([c, ...args.filter(x => x.startsWith('-') || /^\d+$/.test(x))], e.c));
        }
        return { out: outs.join('\n'), err };
      }
      case 'mkdir': {
        if (!files.length) return { out: 'mkdir: missing operand', err: true };
        const outs = [];
        files.forEach(f => { const p = resolve(f); if (FS.has(p)) { if (!args.includes('-p')) outs.push(`mkdir: cannot create directory ‘${f}’: File exists`); return; }
          if (denied(p)) { outs.push(`mkdir: cannot create directory ‘${f}’: Permission denied`); return; }
          if (!FS.has(resolve(p + '/..')) && !args.includes('-p')) { outs.push(`mkdir: cannot create directory ‘${f}’: No such file or directory`); return; }
          mk(p, true, '', asRoot ? 'root' : st.user, now()); });
        return outs.length ? { out: outs.join('\n'), err: true } : { out: '', quiet: true };
      }
      case 'touch': {
        if (!files.length) return { out: 'touch: missing file operand', err: true };
        for (const f of files) { const p = resolve(f); if (denied(p) && !FS.has(p)) return { out: `touch: cannot touch '${f}': Permission denied`, err: true }; if (FS.has(p)) FS.get(p).t = now(); else mk(p, false, '', asRoot ? 'root' : st.user, now()); }
        return { out: '', quiet: true };
      }
      case 'rm': case 'rmdir': {
        if (!files.length) return { out: `${c}: missing operand`, err: true };
        const rec = /-\w*[rR]/.test(args.join(' ')), force = /-\w*f/.test(args.join(' '));
        const outs = [];
        for (const f of files) {
          if (/[*?]/.test(f)) { const dir = resolve(f.includes('/') ? f.slice(0, f.lastIndexOf('/')) : '.'); const re = new RegExp('^' + f.slice(f.lastIndexOf('/') + 1).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$'); children(dir).filter(n => re.test(n)).forEach(n => FS.delete(dir + '/' + n)); continue; }
          const p = resolve(f), e = FS.get(p);
          if (!e) { if (!force) outs.push(`${c}: cannot remove '${f}': No such file or directory`); continue; }
          if (p === '/' ) { outs.push(`rm: it is dangerous to operate recursively on '/'\nrm: use --no-preserve-root to override this failsafe`); continue; }
          if (denied(p)) { outs.push(`${c}: cannot remove '${f}': Permission denied`); continue; }
          if (e.d && c === 'rm' && !rec) { outs.push(`rm: cannot remove '${f}': Is a directory`); continue; }
          if (e.d && c === 'rmdir' && children(p).length) { outs.push(`rmdir: failed to remove '${f}': Directory not empty`); continue; }
          [...FS.keys()].filter(k => k === p || k.startsWith(p + '/')).forEach(k => FS.delete(k));
          if (st.cwd === p || st.cwd.startsWith(p + '/')) st.cwd = resolve(p + '/..');
        }
        return outs.length ? { out: outs.join('\n'), err: true } : { out: '', quiet: true };
      }
      case 'cp': case 'mv': {
        if (files.length < 2) return { out: `${c}: missing destination file operand after '${files[0] || ''}'`, err: true };
        const dst = files[files.length - 1], srcs = files.slice(0, -1), dp = resolve(dst);
        for (const s of srcs) {
          const sp = resolve(s), e = FS.get(sp);
          if (!e) { if (/[*?]/.test(s)) continue; return { out: `${c}: cannot stat '${s}': No such file or directory`, err: true }; }
          if (e.d && c === 'cp' && !/-\w*[raR]/.test(args.join(' '))) return { out: `cp: -r not specified; omitting directory '${s}'`, err: true };
          const target = FS.has(dp) && FS.get(dp).d ? dp + '/' + sp.slice(sp.lastIndexOf('/') + 1) : dp;
          if (denied(target)) return { out: `${c}: cannot create regular file '${dst}': Permission denied`, err: true };
          [...FS.keys()].filter(k => k === sp || k.startsWith(sp + '/')).forEach(k => { const nk = target + k.slice(sp.length); mk(nk, FS.get(k).d, FS.get(k).c, FS.get(k).o, c === 'cp' ? now() : FS.get(k).t); if (c === 'mv') FS.delete(k); });
        }
        return { out: '', quiet: true };
      }
      case 'echo': {
        return null; // handled by redirection layer / app
      }
      case 'su': case '-i': case '-s': {
        if (c === 'su' && files[0] && files[0] !== 'root' && files[0] !== '-') { if (!FS.has('/home/' + files[0]) && files[0] !== 'root') return { out: `su: user ${files[0]} does not exist or the user entry does not contain all the required fields`, err: true }; }
        if (c === 'su' && !sudo && st.user !== 'root') return { out: 'Password: \nsu: Authentication failure\n(hint: the root account is locked on Ubuntu — use sudo -i)', err: true };
        st.prevUser = st.user; st.prevCwd = st.cwd; st.user = 'root'; st.cwd = c === '-s' ? st.cwd : '/root';
        return { out: '', quiet: true, prompt: true };
      }
      case 'exit': case 'logout': {
        if (st.user === 'root' && st.prevUser) { st.user = st.prevUser; st.cwd = st.prevCwd || home; st.prevUser = null; return { out: 'logout', prompt: true }; }
        return { out: 'logout\n(simulated terminal — your session stays open; tap Home to leave)', dim: true };
      }
      case 'export': { args.forEach(x => { const m = x.match(/^(\w+)=(.*)$/); if (m) st.env[m[1]] = m[2]; }); return { out: '', quiet: true }; }
      case 'unset': { args.forEach(x => delete st.env[x]); return { out: '', quiet: true }; }
      case 'env': case 'printenv': { if (files[0]) return st.env[files[0]] != null ? { out: st.env[files[0]] } : { out: '', quiet: true }; return { out: Object.entries({ ...st.env, PWD: st.cwd, LOGNAME: st.user, USER: st.user, XDG_SESSION_TYPE: 'wayland', XDG_CURRENT_DESKTOP: 'ubuntu:GNOME', DESKTOP_SESSION: 'ubuntu' }).sort().map(([k, v]) => `${k}=${v}`).join('\n') }; }
      case 'hostname': if (!args.length) return { out: HOST }; return null;
      case 'which': { if (!files.length) return { out: '', quiet: true }; return { out: files.map(f => api.isKnown(f) ? (f === 'cd' ? '' : (/^(snap|code|lxc|multipass|microk8s|certbot|helm|k8s|juju)$/.test(f) ? '/snap/bin/' : '/usr/bin/') + f) : '').filter(Boolean).join('\n'), quiet: false }; }
    }
    return null;
  }

  /* ---------- pipe filters ---------- */
  function applyFilter(t, input) {
    const c = t[0], args = t.slice(1);
    let lines = input === '' ? [] : String(input).split('\n');
    const num = (def) => { const i = args.indexOf('-n'); if (i >= 0) return parseInt(args[i + 1], 10); const m = args.find(a => /^-\d+$/.test(a)); return m ? -parseInt(m, 10) : def; };
    switch (c) {
      case 'grep': case 'egrep': case 'rg': {
        const fl = args.filter(a => /^-/.test(a)).join(''), pat = args.find(a => !/^-/.test(a)) || '';
        let re; try { re = new RegExp(/[EP]/.test(fl) || c !== 'grep' ? pat : pat.replace(/[+?(){}|]/g, '\\$&'), /i/.test(fl) ? 'i' : ''); } catch (e) { re = new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), /i/.test(fl) ? 'i' : ''); }
        let res = lines.map((l, i) => [l, i]).filter(([l]) => /v/.test(fl) ? !re.test(l) : re.test(l));
        if (/c/.test(fl)) return String(res.length);
        return res.map(([l, i]) => (/n/.test(fl) ? (i + 1) + ':' : '') + l).join('\n');
      }
      case 'head': return lines.slice(0, num(10)).join('\n');
      case 'tail': { const n = num(10); return lines.slice(Math.max(0, lines.length - n)).join('\n'); }
      case 'wc': { const txt = lines.join('\n'), l = lines.length, w = txt.split(/\s+/).filter(Boolean).length, ch = txt.length + (l ? 1 : 0); const fl = args.join(''); if (/l/.test(fl)) return String(l); if (/w/.test(fl)) return String(w); if (/c|m/.test(fl)) return String(ch); return `${String(l).padStart(7)} ${String(w).padStart(7)} ${String(ch).padStart(7)}`; }
      case 'sort': { const fl = args.join(''); lines = lines.slice().sort(/n/.test(fl) ? (a, b) => parseFloat(a) - parseFloat(b) : /h/.test(fl) ? (a, b) => hv(a) - hv(b) : (a, b) => a.localeCompare(b)); if (/r/.test(fl)) lines.reverse(); if (/u/.test(fl)) lines = lines.filter((l, i) => l !== lines[i - 1]); return lines.join('\n'); }
      case 'uniq': { const out = []; lines.forEach(l => { if (out.length && out[out.length - 1][0] === l) out[out.length - 1][1]++; else out.push([l, 1]); }); return out.map(([l, n]) => args.includes('-c') ? `${String(n).padStart(7)} ${l}` : l).join('\n'); }
      case 'tr': { if (args[0] === 'a-z' && args[1] === 'A-Z') return input.toUpperCase(); if (args[0] === 'A-Z' && args[1] === 'a-z') return input.toLowerCase(); return input; }
      case 'nl': return lines.map((l, i) => `${String(i + 1).padStart(6)}\t${l}`).join('\n');
      case 'rev': return lines.map(l => [...l].reverse().join('')).join('\n');
      case 'tee': { const f = args.find(a => !a.startsWith('-')); if (f) { const p = resolve(f); const e = FS.get(p); const add = args.includes('-a') && e ? e.c + '\n' : ''; if (!p.startsWith(home) && !p.startsWith('/tmp') && st.user !== 'root' && !st.sudoPipe) return input + `\ntee: ${f}: Permission denied`; mk(p, false, add + input, st.sudoPipe ? 'root' : st.user, now()); } return input; }
      default: return input; // cat, less, more, column, … pass through
    }
  }
  const hv = s => { const m = String(s).trim().match(/^([\d.]+)([KMGT]?)/i); if (!m) return 0; return parseFloat(m[1]) * ({ K: 1e3, M: 1e6, G: 1e9, T: 1e12 }[m[2].toUpperCase()] || 1); };
  const FILTERS = /^(grep|egrep|rg|head|tail|wc|sort|uniq|tr|nl|rev|tee|cat|less|more|column)$/;

  /* ---------- one simple command (no chains) ---------- */
  function one(cmd, piped) {
    let t = tokens(cmd);
    if (!t.length) return { out: '', quiet: true };
    // output redirection: cmd > file / >> file  (only when the whole command isn't documented)
    const ri = t.findIndex(x => x === '>' || x === '>>' || /^>>?\S/.test(x));
    if (ri > 0 && !EXACT.has(norm(cmd)) && !/2>/.test(cmd)) {
      const app = t[ri].startsWith('>>'), tgt = t[ri].replace(/^>>?/, '') || t[ri + 1];
      const left = t.slice(0, ri).join(' ');
      const r = t[0] === 'echo' || (t[0] === 'sudo' && t[1] === 'echo') ? { out: echo(t.slice(t[0] === 'echo' ? 1 : 2, ri)) } : run1(left);
      if (r.err) return r;
      const p = resolve(tgt); if (FS.has(p) && FS.get(p).d) return { out: `bash: ${tgt}: Is a directory`, err: true };
      if (!p.startsWith(home) && !p.startsWith('/tmp') && st.user !== 'root') return { out: `bash: ${tgt}: Permission denied`, err: true };
      const prev = app && FS.has(p) ? FS.get(p).c : '';
      mk(p, false, (prev ? prev + '\n' : '') + (r.out || ''), st.user, now());
      return { out: '', quiet: true };
    }
    if (t[0] === 'echo' && !EXACT.has(norm(cmd))) return { out: echo(t.slice(1)) };
    const f = fsCmd(t, piped);
    if (f) return f;
    return run1(cmd);
  }
  function echo(args) { const nl = args[0] === '-n'; const e = args[0] === '-e'; const a = nl || e ? args.slice(1) : args; let s = a.join(' '); if (e) s = s.replace(/\\n/g, '\n').replace(/\\t/g, '\t'); return s; }
  function run1(cmd) { const r = runCore(cmd); return r; }

  /* ---------- pipelines & chains ---------- */
  function pipeline(cmd) {
    const parts = splitTop(cmd, ['|']).map(p => p.cmd);
    if (parts.length < 2) return one(cmd, false);
    const first = one(parts[0], true);
    if (first.err && !first.out) return first;
    let out = first.out || '';
    for (const p of parts.slice(1)) {
      const t = tokens(p); let tt = t;
      st.sudoPipe = t[0] === 'sudo';
      if (t[0] === 'sudo') tt = t.slice(1);
      if (FILTERS.test(tt[0])) out = applyFilter(tt, out);
      else { const r = runCore(p); out = r.out || out; }
      st.sudoPipe = false;
    }
    return { out, err: first.err, quiet: !out };
  }
  function run(input) {
    const raw = norm(input);
    if (!raw) return { out: '' };
    // documented commands win (keeps every example in the app exact), except state-changing builtins
    const first = raw.replace(/^sudo\s+(-\S+\s+)*/, '').split(' ')[0];
    const stateful = /^(true|false|cd|pwd|ls|ll|la|mkdir|touch|rm|rmdir|cp|mv|cat|whoami|id|exit|logout|su|export|unset|env|printenv|tree|which)$/.test(first) || /^sudo\s+(-i|-s|su)\b/.test(raw);
    if (!stateful && EXACT.has(raw)) return runCore(raw);
    if (/^(for|while|if|until|case)\b/.test(raw)) return runCore(raw);
    const chain = splitTop(raw, ['&&', '||', ';']);
    if (chain.length > 1 && !(EXACT.has(raw) && !stateful)) {
      const outs = []; let last = { out: '' };
      for (let i = 0; i < chain.length; i++) {
        const prevOp = i ? chain[i - 1].op : null;
        if (prevOp === '&&' && last.err) break;
        if (prevOp === '||' && !last.err) continue;
        last = pipeline(chain[i].cmd);
        if (last.clear) { outs.length = 0; continue; }
        if (last.out) outs.push(last.out);
      }
      return { out: outs.join('\n'), err: last.err, quiet: !outs.length, prompt: true };
    }
    if (/^sudo\s+(-i|-s|su)\b/.test(raw)) { const r = fsCmd(['sudo', /\bsu\b/.test(raw) ? 'su' : raw.match(/-[is]/)[0]]); return api.sudoPrefix(r); }
    const r = pipeline(raw);
    return /^sudo\b/.test(raw) && (r.quiet || r.out) && !r.err ? api.sudoPrefix(r) : r;
  }
  return {
    run,
    prompt() { const root = st.user === 'root'; return `${st.user}@${HOST}:${pretty(st.cwd)}${root ? '#' : '$'}`; },
    get user() { return st.user; }, get cwd() { return st.cwd; },
    paths(prefix) { const i = prefix.lastIndexOf('/'), dir = resolve(i >= 0 ? prefix.slice(0, i + 1) || '/' : '.'), stem = prefix.slice(i + 1); return FS.has(dir) ? children(dir).filter(n => n.startsWith(stem) && (stem.startsWith('.') || !n.startsWith('.'))).map(n => prefix.slice(0, i + 1) + n + (FS.get(dir === '/' ? '/' + n : dir + '/' + n).d ? '/' : '')) : []; },
    reset() { st.user = HOME_USER; st.cwd = home; }
  };
};
