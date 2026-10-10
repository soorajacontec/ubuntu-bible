/* v1.1 — more tools: Processes → Android */
UB.add('processes', [
  { id: 'inspect', title: 'Inspect & control processes', intro: 'pidof, pmap, prlimit, taskset, timeout.',
    cmds: [
      ['pidof nginx', 'PIDs of a program', '4212 4211 4210'],
      ['ps -o pid,ppid,stat,etime,cmd -p 4210', 'Custom columns for one process', '    PID    PPID STAT     ELAPSED CMD\n   4210       1 Ss     2-03:14:51 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;'],
      ['pmap -x 4410 | tail -1', 'Memory map total of a process', 'total kB         1440528  662344  610212'],
      ['prlimit --pid 4410 --nofile', 'Resource limit of a running process', 'RESOURCE DESCRIPTION              SOFT HARD UNITS\nNOFILE   max number of open files 1024 524288 files'],
      ['sudo prlimit --pid 4410 --nofile=65535:65535', 'Change it without restarting', ''],
      ['taskset -cp 4410', 'CPU affinity of a process', 'pid 4410\'s current affinity list: 0-15'],
      ['taskset -c 0-3 ./render.sh', 'Run pinned to CPUs 0–3'],
      ['timeout 10s ./flaky-test.sh', 'Kill a command if it runs longer than 10 s'],
      ['chrt -p 4410', 'Scheduling policy and priority', 'pid 4410\'s current scheduling policy: SCHED_OTHER\npid 4410\'s current scheduling priority: 0']
    ],
    flags: [['-o <cols>', 'Output columns', 'ps'], ['-x', 'Extended', 'pmap'], ['--pid', 'Target', 'prlimit'], ['--nofile=soft:hard', 'Open files', 'prlimit'], ['-c <list>', 'CPU list', 'taskset'], ['-p', 'Existing PID', 'taskset'], ['-k <dur>', 'Kill after extra time', 'timeout'], ['-s <sig>', 'Signal to send', 'timeout']],
    demo: ['pidof nginx', '4212 4211 4210'] }
]);

UB.add('performance', [
  { id: 'bench', title: 'Benchmarks & eBPF tracing', intro: 'stress-ng, sysbench, glances, bcc tools.',
    cmds: [
      ['sudo apt install stress-ng sysbench glances', 'Load generators and an all-in-one monitor'],
      ['stress-ng --cpu 4 --timeout 60s --metrics-brief', 'Stress 4 CPUs for a minute'],
      ['sysbench cpu run', 'Quick CPU benchmark (events/sec)'],
      ['sysbench memory run', 'Memory bandwidth benchmark'],
      ['glances', 'CPU, RAM, disks, network, sensors and containers in one screen'],
      ['sudo apt install bpfcc-tools bpftrace', 'eBPF tracing tools'],
      ['sudo execsnoop-bpfcc', 'Every new process as it starts'],
      ['sudo opensnoop-bpfcc -p 4410', 'Files a process opens'],
      ['sudo biolatency-bpfcc 5 1', 'Disk I/O latency histogram'],
      ['sudo bpftrace -e \'tracepoint:syscalls:sys_enter_openat { printf("%s %s\\n", comm, str(args->filename)); }\'', 'One-liner: who opens which file']
    ],
    flags: [['--cpu N', 'CPU workers', 'stress-ng'], ['--vm N --vm-bytes 2G', 'Memory workers', 'stress-ng'], ['--timeout', 'Duration', 'stress-ng'], ['--threads=N', 'Threads', 'sysbench'], ['-p <pid>', 'Filter by PID', 'opensnoop-bpfcc'], ['-e <prog>', 'Inline program', 'bpftrace']],
    demo: [['sysbench cpu run', 'sysbench 1.0.20 (using system LuaJIT 2.1.1723681758)\n\nRunning the test with following options:\nNumber of threads: 1\n\nPrime numbers limit: 10000\n\nCPU speed:\n    events per second:  2614.82\n\nGeneral statistics:\n    total time:                          10.0002s\n    total number of events:              26150\n\nLatency (ms):\n         min:                                    0.37\n         avg:                                    0.38\n         max:                                    1.12\n         95th percentile:                        0.39'],
      ['sudo execsnoop-bpfcc', 'PCOMM            PID     PPID    RET ARGS\nbash             7311    2880      0 /usr/bin/ls --color=auto\napt-check        7318    2214      0 /usr/lib/update-notifier/apt-check\ngit              7322    2880      0 /usr/bin/git status']],
    tips: ['On Ubuntu the bcc tools carry a `-bpfcc` suffix (execsnoop-bpfcc, tcplife-bpfcc…).'] }
]);

UB.add('shell', [
  { id: 'scripting', title: 'Bash scripting essentials', intro: 'Safe scripts, loops, input and debugging.',
    cmds: [
      ['sudo apt install shellcheck', 'Static analysis for shell scripts'],
      ['shellcheck deploy.sh', 'Find bugs and quoting problems', '\nIn deploy.sh line 7:\nrm -rf $TARGET/*\n       ^-----^ SC2115 (warning): Use "${var:?}" to ensure this never expands to /* .\n       ^-----^ SC2086 (info): Double quote to prevent globbing and word splitting.\n\nFor more information:\n  https://www.shellcheck.net/wiki/SC2115'],
      ['bash -n deploy.sh', 'Syntax check without running', ''],
      ['bash -x deploy.sh', 'Trace every command as it runs'],
      ['set -euo pipefail', 'Strict mode: stop on errors, unset vars and pipe failures', ''],
      ['read -rp "Hostname: " host', 'Prompt for input into $host'],
      ['for f in *.jpeg; do mv -- "$f" "${f%.jpeg}.jpg"; done', 'Loop with parameter expansion', ''],
      ['printf "%-10s %5d\\n" disk 42', 'Formatted output', 'disk          42'],
      ['echo $(( 7 * 6 ))', 'Integer arithmetic', '42'],
      ['trap \'rm -f "$tmp"\' EXIT', 'Clean up temp files when the script exits', '']
    ],
    flags: [['-e', 'Exit on error', 'set'], ['-u', 'Error on unset variables', 'set'], ['-o pipefail', 'Fail if any pipe stage fails', 'set'], ['-x', 'Trace', 'set'], ['${var:-default}', 'Default value', 'bash'], ['${f%.ext}', 'Strip suffix', 'bash'], ['[[ -f file ]]', 'Test file exists', 'bash'], ['-S <code>', 'Exclude a check', 'shellcheck']],
    demo: ['shellcheck deploy.sh', '\nIn deploy.sh line 7:\nrm -rf $TARGET/*\n       ^-----^ SC2115 (warning): Use "${var:?}" to ensure this never expands to /* .\n       ^-----^ SC2086 (info): Double quote to prevent globbing and word splitting.\n\nFor more information:\n  https://www.shellcheck.net/wiki/SC2115'],
    tips: ['Start scripts with `#!/usr/bin/env bash` and `set -euo pipefail`; Ubuntu\'s /bin/sh is dash, not bash.'] }
]);

UB.add('git', [
  { id: 'helpers', title: 'GitHub CLI, LFS & worktrees', intro: 'gh, git-lfs, tig and signed commits.',
    cmds: [
      ['sudo apt install gh', 'GitHub CLI'],
      ['gh auth login', 'Sign in (browser or token)'],
      ['gh repo clone ssk/app', 'Clone with your credentials'],
      ['gh pr create --fill', 'Open a PR from the current branch', 'Creating pull request for feature/search into main in ssk/app\n\nhttps://github.com/ssk/app/pull/42'],
      ['gh pr list', 'Open pull requests', 'Showing 2 of 2 open pull requests in ssk/app\n\n#42  Add search box     feature/search   about 1 minute ago\n#39  Bump deps          deps/oct         about 3 days ago'],
      ['gh run watch', 'Follow the latest CI run live'],
      ['sudo apt install git-lfs', 'Large File Storage'],
      ['git lfs install', 'Enable LFS hooks', 'Updated Git hooks.\nGit LFS initialized.'],
      ['git lfs track "*.psd"', 'Store PSDs in LFS', 'Tracking "*.psd"'],
      ['git worktree add ../app-hotfix hotfix', 'Check out another branch in a second folder', 'Preparing worktree (checking out \'hotfix\')\nHEAD is now at 9b8e7d1 Fix CSS on mobile'],
      ['git commit -S -m "Signed release"', 'Create a signed commit'],
      ['sudo apt install tig', 'Text-mode Git browser']
    ],
    flags: [['--fill', 'Use commit info for title/body', 'gh'], ['--web', 'Open in browser', 'gh'], ['--draft', 'Draft PR', 'gh'], ['track <glob>', 'Add LFS pattern', 'git'], ['worktree add <dir> <branch>', 'Extra working tree', 'git'], ['-S', 'Sign commit', 'git']],
    demo: ['gh pr list', 'Showing 2 of 2 open pull requests in ssk/app\n\n#42  Add search box     feature/search   about 1 minute ago\n#39  Bump deps          deps/oct         about 3 days ago'] }
]);

UB.add('editors', [
  { id: 'more', title: 'Emacs, Kate, Geany & Sublime', intro: 'More editors from apt and snap.',
    cmds: [
      ['sudo apt install emacs', 'GNU Emacs (GTK)'],
      ['emacs -nw notes.org', 'Emacs in the terminal'],
      ['sudo apt install kate', 'KDE Kate advanced text editor'],
      ['sudo apt install geany', 'Lightweight GTK IDE'],
      ['sudo snap install sublime-text --classic', 'Sublime Text'],
      ['sudo apt install editorconfig', 'EditorConfig core for consistent indentation'],
      ['sudo update-alternatives --config editor', 'Default editor for sudoedit, crontab, git…']
    ],
    flags: [['-nw', 'No window (terminal)', 'emacs'], ['C-x C-s', 'Save', 'emacs'], ['C-x C-c', 'Quit', 'emacs'], ['C-g', 'Cancel', 'emacs'], ['M-x', 'Run a command', 'emacs']],
    demo: ['emacs --version | head -1', 'GNU Emacs 30.1'] }
]);

UB.add('devtools', [
  { id: 'workflow', title: 'API & workflow tools', intro: 'HTTPie, just, direnv, pre-commit, ltrace.',
    cmds: [
      ['sudo apt install httpie', 'Human-friendly HTTP client'],
      ['http GET https://api.github.com/repos/canonical/lxd stargazers_count==1', 'GET with query params, coloured JSON'],
      ['http POST localhost:8000/login user=ssk pass=secret', 'POST JSON body from key=value pairs'],
      ['sudo apt install just', 'Command runner (justfile)'],
      ['just --list', 'Available recipes', 'Available recipes:\n    build\n    deploy env="staging"\n    test'],
      ['sudo apt install direnv', 'Per-directory environment variables'],
      ['direnv allow', 'Trust the current .envrc', 'direnv: loading ~/projects/app/.envrc\ndirenv: export +DATABASE_URL +FLASK_ENV'],
      ['pipx install pre-commit', 'Git pre-commit hook framework'],
      ['pre-commit run --all-files', 'Run all hooks on the repo'],
      ['ltrace -c ./app', 'Count library calls'],
      ['sudo apt install meld', 'Visual diff and merge tool']
    ],
    flags: [['==', 'Query parameter', 'http'], ['=', 'JSON string field', 'http'], [':=', 'Raw JSON field', 'http'], ['-v', 'Show request too', 'http'], ['--list', 'List recipes', 'just'], ['allow / deny', 'Trust .envrc', 'direnv']],
    demo: ['http POST localhost:8000/login user=ssk pass=secret', 'HTTP/1.1 200 OK\nContent-Length: 48\nContent-Type: application/json\nDate: Sat, 10 Oct 2026 08:44:12 GMT\nServer: gunicorn\n\n{\n    "ok": true,\n    "token": "eyJhbGciOi…"\n}'] },
  { id: 'more-langs', title: 'More languages', intro: 'Ruby, PHP Composer, .NET, Kotlin, Zig.',
    cmds: [
      ['sudo apt install ruby-full', 'Ruby with headers and gem'],
      ['gem install --user-install bundler', 'Per-user gems (no sudo)'],
      ['sudo apt install composer', 'PHP Composer'],
      ['composer create-project laravel/laravel blog', 'Scaffold a Laravel app'],
      ['apt search --names-only ^dotnet-sdk', '.NET SDKs packaged by Ubuntu'],
      ['sudo snap install kotlin --classic', 'Kotlin compiler'],
      ['sudo snap install zig --classic --beta', 'Zig toolchain (snap)'],
      ['sudo apt install lua5.4', 'Lua interpreter']
    ],
    flags: [['--user-install', 'Install to ~/.local/share/gem', 'gem'], ['require <pkg>', 'Add a dependency', 'composer'], ['install', 'Install from composer.lock', 'composer']],
    demo: ['apt search --names-only ^dotnet-sdk', 'Sorting... Done\nFull Text Search... Done\ndotnet-sdk-10.0/resolute 10.0.100-0ubuntu1 amd64\n  .NET 10.0 Software Development Kit\n\ndotnet-sdk-8.0/resolute 8.0.120-0ubuntu1 amd64\n  .NET 8.0 Software Development Kit'],
    tips: ['Prefer Ubuntu\'s .NET packages over Microsoft\'s repo — mixing both causes "SDK not found" errors.'] }
]);

UB.add('packaging', [
  { id: 'tweak', title: 'Inspect, repack & convert', intro: 'apt-get download, dpkg-deb, equivs, alien.',
    cmds: [
      ['apt-get download htop', 'Fetch a .deb without installing it', 'Get:1 http://archive.ubuntu.com/ubuntu resolute/main amd64 htop amd64 3.4.1-5 [171 kB]\nFetched 171 kB in 0s (812 kB/s)'],
      ['dpkg-deb -R htop_3.4.1-5_amd64.deb htop-x', 'Unpack data + control to a folder', ''],
      ['dpkg-deb -b htop-x htop-custom.deb', 'Rebuild after editing', 'dpkg-deb: building package \'htop\' in \'htop-custom.deb\'.'],
      ['dpkg-query -W -f=\'${Package} ${Version}\\n\' | head -3', 'Custom-format installed list', 'accountsservice 23.13.9-7ubuntu2\nacl 2.3.2-2\nadduser 3.153ubuntu1'],
      ['sudo apt install equivs', 'Create dummy/meta packages'],
      ['equivs-control my-meta', 'Template control file', ''],
      ['equivs-build my-meta', 'Build the dummy .deb', 'dh_testdir\n…\ndpkg-deb: building package \'my-meta\' in \'../my-meta_1.0_all.deb\'.\n\nThe package has been created.'],
      ['sudo apt install alien', 'Convert between package formats'],
      ['sudo alien --to-deb app-2.1.x86_64.rpm', 'Convert an RPM to .deb', 'app_2.1-2_amd64.deb generated']
    ],
    flags: [['-R / -x', 'Raw extract / data only', 'dpkg-deb'], ['-b', 'Build', 'dpkg-deb'], ['-W -f', 'Show with format', 'dpkg-query'], ['--to-deb', 'Target format', 'alien'], ['--scripts', 'Keep maintainer scripts', 'alien']],
    demo: ['apt-get download htop', 'Get:1 http://archive.ubuntu.com/ubuntu resolute/main amd64 htop amd64 3.4.1-5 [171 kB]\nFetched 171 kB in 0s (812 kB/s)'],
    warn: ['alien-converted packages skip dependency metadata; prefer native .debs, Flatpak or snap when available.'] }
]);

UB.add('ai', [
  { id: 'clients', title: 'Chat UIs, CLIs & model downloads', intro: 'Open WebUI, llm, Hugging Face and GPU checks.',
    cmds: [
      ['docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main', 'Open WebUI in Docker (talks to local Ollama)'],
      ['pipx install llm', 'Simon Willison\'s llm CLI'],
      ['llm install llm-ollama', 'Plugin to use Ollama models'],
      ['llm -m qwen3:8b "Explain netplan try in one sentence"', 'Prompt a local model from the shell', 'netplan try applies a new network config and automatically rolls it back after a timeout unless you confirm it, so a bad change can\'t lock you out.'],
      ['cat app.log | llm -s "Summarise the errors"', 'Pipe text in with a system prompt'],
      ['pipx install "huggingface_hub[cli]"', 'Hugging Face CLI (hf)'],
      ['hf download Qwen/Qwen3-8B-GGUF --include "*Q4_K_M*" --local-dir models', 'Download one quantised GGUF'],
      ['sudo apt install nvtop clinfo', 'GPU monitor and OpenCL device info'],
      ['clinfo -l', 'OpenCL platforms and devices', 'Platform #0: Intel(R) OpenCL Graphics\n `-- Device #0: Intel(R) Arc(TM) Graphics\nPlatform #1: NVIDIA CUDA\n `-- Device #0: NVIDIA GeForce RTX 4050 Laptop GPU']
    ],
    flags: [['-m <model>', 'Model', 'llm'], ['-s <text>', 'System prompt', 'llm'], ['-c', 'Continue conversation', 'llm'], ['--include <glob>', 'Only matching files', 'hf'], ['--local-dir', 'Destination', 'hf']],
    demo: ['llm -m qwen3:8b "Explain netplan try in one sentence"', 'netplan try applies a new network config and automatically rolls it back after a timeout unless you confirm it, so a bad change can\'t lock you out.'],
    tips: ['Open WebUI listens on http://localhost:3000; the first account you create becomes admin.'] }
]);

UB.add('ssh', [
  { id: 'more', title: 'Mosh, multiplexing & SSH CAs', intro: 'Resilient sessions and certificate auth.',
    cmds: [
      ['sudo apt install mosh', 'Mobile shell — survives roaming and sleep'],
      ['mosh ssk@server', 'Connect (needs UDP 60000–61000 open)'],
      ['ssh-keyscan -t ed25519 server >> ~/.ssh/known_hosts', 'Pre-trust a host key', '# server:22 SSH-2.0-OpenSSH_10.0p2 Ubuntu-5ubuntu2'],
      ['ssh -O check web', 'Is a ControlMaster connection alive?', 'Master running (pid=7112)'],
      ['ssh -O exit web', 'Close the shared connection', 'Exit request sent.'],
      ['sudo apt install sshuttle', 'VPN over SSH'],
      ['sshuttle -r ssk@server 0/0', 'Route all traffic through a server'],
      ['sudo apt install autossh', 'Auto-restarting tunnels'],
      ['autossh -M 0 -f -N -L 5432:localhost:5432 db', 'Persistent background tunnel'],
      ['ssh-keygen -s ca_key -I ssk -n ssk -V +52w id_ed25519.pub', 'Sign a user key with your SSH CA', 'Signed user key id_ed25519-cert.pub: id "ssk" serial 0 for ssk valid from 2026-10-10T11:50:00 to 2027-10-09T11:51:12'],
      ['ssh-keygen -Lf id_ed25519-cert.pub', 'Inspect a certificate']
    ],
    flags: [['ControlMaster auto', 'Share connections', 'ssh_config'], ['ControlPath ~/.ssh/cm-%r@%h:%p', 'Socket path', 'ssh_config'], ['ControlPersist 10m', 'Keep master open', 'ssh_config'], ['-O check|exit', 'Control master', 'ssh'], ['-M 0', 'No monitor port (autossh)', 'autossh'], ['TrustedUserCAKeys', 'Server: accept CA-signed keys', 'sshd_config']],
    demo: ['ssh -O check web', 'Master running (pid=7112)'] }
]);

UB.add('logs', [
  { id: 'tools', title: 'Log viewers & writing logs', intro: 'lnav, logger, systemd-cat, GoAccess.',
    cmds: [
      ['sudo apt install lnav', 'Log navigator with syntax, filters and SQL'],
      ['lnav /var/log/nginx/', 'Merge and browse a folder of logs'],
      ['logger -t backup "Backup finished OK"', 'Write a message to the journal/syslog', ''],
      ['journalctl -t backup', 'Read messages with that tag', 'Oct 10 11:52:14 ubuntu backup[7420]: Backup finished OK'],
      ['./job.sh | systemd-cat -t nightly -p info', 'Send a script\'s output to the journal', ''],
      ['sudo apt install goaccess', 'Web log analyser'],
      ['goaccess /var/log/nginx/access.log -o report.html --log-format=COMBINED', 'HTML traffic report from nginx logs'],
      ['sudo apt install rsyslog', 'Classic syslog daemon (text files + remote logging)'],
      ['echo "*.* @@logs.example.com:514" | sudo tee /etc/rsyslog.d/90-remote.conf', 'Forward all logs over TCP']
    ],
    flags: [['-t <tag>', 'Identifier', 'logger'], ['-p <prio>', 'Priority (user.err…)', 'logger'], ['-t / -p', 'Identifier / priority', 'systemd-cat'], ['-o <file>', 'Output report', 'goaccess'], ['--log-format', 'COMBINED, VCOMBINED…', 'goaccess'], ['@@host', 'TCP (@ = UDP)', 'rsyslog']],
    demo: ['journalctl -t backup', 'Oct 10 11:52:14 ubuntu backup[7420]: Backup finished OK'] }
]);

UB.add('boot', [
  { id: 'misc', title: 'Firmware mode, inhibitors & splash', intro: 'bootctl, systemd-inhibit and Plymouth.',
    cmds: [
      ['[ -d /sys/firmware/efi ] && echo UEFI || echo BIOS', 'Did the system boot in UEFI or legacy mode?', 'UEFI'],
      ['bootctl status', 'Firmware, Secure Boot and boot loader info', 'System:\n      Firmware: UEFI 2.80 (Lenovo 0.1031)\n Firmware Arch: x64\n   Secure Boot: enabled (user)\n  TPM2 Support: yes\n  Measured UKI: no\n  Boot into FW: supported\n\nCurrent Boot Loader:\n      Product: GRUB 2.14\n     Features: ✗ Boot counting\n          ESP: /dev/disk/by-partuuid/3c1e9a2b-…'],
      ['systemd-inhibit --list', 'What is blocking sleep/shutdown', 'WHO            UID  USER PID  COMM           WHAT     WHY                       MODE\nNetworkManager 0    root 903  NetworkManager sleep    NetworkManager needs to … delay\nUPower         0    root 1011 upowerd        sleep    Pause device polling      delay\nssk            1000 ssk  2214 gnome-shell    sleep    GNOME needs to lock the … delay\n\n3 inhibitors listed.'],
      ['systemd-inhibit --what=sleep ./long-backup.sh', 'Prevent suspend while a job runs'],
      ['sudo update-alternatives --config default.plymouth', 'Choose the boot splash theme'],
      ['last -x reboot | head -3', 'Recent boots and how long they lasted', 'reboot   system boot  7.0.0-14-generic Sat Oct 10 07:12   still running\nreboot   system boot  7.0.0-14-generic Fri Oct  9 07:51 - 23:02  (15:11)\nreboot   system boot  7.0.0-14-generic Thu Oct  8 08:03 - 22:44  (14:41)'],
      ['sudo apt install memtest86+', 'RAM test entry in the GRUB menu']
    ],
    flags: [['status', 'Boot environment', 'bootctl'], ['--list', 'Inhibitors', 'systemd-inhibit'], ['--what=sleep|shutdown|idle', 'What to block', 'systemd-inhibit'], ['-x', 'Include shutdowns/runlevel', 'last']],
    demo: ['bootctl status', 'System:\n      Firmware: UEFI 2.80 (Lenovo 0.1031)\n Firmware Arch: x64\n   Secure Boot: enabled (user)\n  TPM2 Support: yes\n  Measured UKI: no\n  Boot into FW: supported\n\nCurrent Boot Loader:\n      Product: GRUB 2.14\n     Features: ✗ Boot counting\n          ESP: /dev/disk/by-partuuid/3c1e9a2b-…'] }
]);

UB.add('install', [
  { id: 'migrate', title: 'Boot-Repair, apt-clone & dual boot', intro: 'Fix bootloaders and copy setups to a new machine.',
    cmds: [
      ['sudo add-apt-repository ppa:yannubuntu/boot-repair', 'Boot-Repair PPA (from a live USB)'],
      ['sudo apt install boot-repair', 'Install Boot-Repair'],
      ['boot-repair', 'Guided GRUB/EFI repair with a shareable report'],
      ['sudo os-prober', 'Detect other operating systems', '/dev/nvme0n1p1@/EFI/Microsoft/Boot/bootmgfw.efi:Windows Boot Manager:Windows:efi'],
      ['sudo apt install apt-clone', 'Clone package selections'],
      ['sudo apt-clone clone ~/mybox', 'Save installed packages, sources and keys', ''],
      ['sudo apt-clone restore ~/mybox.apt-clone.tar.gz', 'Re-install everything on a fresh system'],
      ['sudo timedatectl set-local-rtc 1', 'Dual boot: keep RTC in local time (avoid Windows clock skew)', '']
    ],
    flags: [['clone <dest>', 'Create archive', 'apt-clone'], ['restore <file>', 'Restore archive', 'apt-clone'], ['info <file>', 'Show archive info', 'apt-clone'], ['set-local-rtc 0|1', 'RTC mode', 'timedatectl']],
    demo: ['sudo os-prober', '/dev/nvme0n1p1@/EFI/Microsoft/Boot/bootmgfw.efi:Windows Boot Manager:Windows:efi'],
    tips: ['Instead of `set-local-rtc 1`, the cleaner fix is setting Windows to UTC (RealTimeIsUniversal registry key).'] }
]);

UB.add('desktop', [
  { id: 'tweaks', title: 'Handy GNOME tweaks', intro: 'Workspaces, touchpad, clock, power and scaling.',
    cmds: [
      ['gsettings set org.gnome.mutter dynamic-workspaces false', 'Use a fixed number of workspaces', ''],
      ['gsettings set org.gnome.desktop.wm.preferences num-workspaces 4', 'Four workspaces', ''],
      ['gsettings set org.gnome.desktop.peripherals.touchpad tap-to-click true', 'Tap to click', ''],
      ['gsettings set org.gnome.desktop.interface clock-show-seconds true', 'Seconds in the top-bar clock', ''],
      ['gsettings set org.gnome.desktop.interface show-battery-percentage true', 'Battery percentage', ''],
      ['gsettings set org.gnome.desktop.interface text-scaling-factor 1.15', 'Larger text everywhere', ''],
      ['gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type "nothing"', 'Never auto-suspend on AC', ''],
      ['gsettings set org.gnome.shell.extensions.dash-to-dock click-action "minimize"', 'Click a dock icon to minimise', ''],
      ['gsettings reset-recursively org.gnome.shell.extensions.dash-to-dock', 'Reset the Ubuntu Dock to defaults', '']
    ],
    flags: [['dynamic-workspaces', 'Auto-add workspaces', 'gsettings'], ['tap-to-click', 'Touchpad taps', 'gsettings'], ['text-scaling-factor', 'Font scale', 'gsettings'], ['sleep-inactive-ac-type', 'suspend / nothing', 'gsettings'], ['click-action', 'focus-or-appspread, minimize, previews', 'gsettings']],
    demo: ['gsettings get org.gnome.desktop.interface text-scaling-factor', '1.15'] },
  { id: 'remote', title: 'Remote desktop (RDP)', intro: 'GNOME Remote Desktop and clients.',
    cmds: [
      ['grdctl status', 'Desktop-sharing state for your session'],
      ['grdctl rdp enable', 'Share your logged-in desktop over RDP', ''],
      ['grdctl rdp set-credentials ssk "S3cret!pass"', 'RDP username/password', ''],
      ['sudo grdctl --system rdp enable', 'Remote login to the login screen (headless-friendly)', ''],
      ['sudo ufw allow 3389/tcp', 'Open RDP port'],
      ['sudo apt install remmina', 'Remote desktop client (RDP/VNC/SSH)'],
      ['sudo apt install freerdp3-x11', 'FreeRDP command-line client'],
      ['xfreerdp3 /v:192.168.1.42 /u:ssk /dynamic-resolution', 'Connect to an RDP host']
    ],
    flags: [['rdp enable|disable', 'Toggle RDP', 'grdctl'], ['--system', 'System-wide (login screen)', 'grdctl'], ['set-credentials', 'Set auth', 'grdctl'], ['/v: /u:', 'Host, user', 'xfreerdp3'], ['/dynamic-resolution', 'Resize with window', 'xfreerdp3']],
    demo: ['grdctl status', 'Overall:\n\tUnit status: active\nRDP:\n\tStatus: enabled\n\tPort: 3389\n\tTLS certificate: /home/ssk/.local/share/gnome-remote-desktop/certificates/rdp-tls.crt\n\tView-only: no\n\tUsername: (hidden)\n\tPassword: (hidden)'],
    tips: ['Settings › System › Remote Desktop has the same switches as `grdctl`.'] }
]);

UB.add('hardware', [
  { id: 'power', title: 'Battery, brightness & input', intro: 'upower, powertop, brightnessctl, libinput.',
    cmds: [
      ['upower -i $(upower -e | grep BAT)', 'Battery health, capacity and rate'],
      ['cat /sys/class/power_supply/BAT0/capacity', 'Battery percentage', '81'],
      ['sudo apt install powertop', 'Power consumption analyser'],
      ['sudo powertop --auto-tune', 'Apply all power-saving tunables (until reboot)', 'modprobe cpufreq_stats failedLoaded 0 prior measurements\nCannot load from file /var/cache/powertop/saved_parameters.powertop\nLeaving PowerTOP'],
      ['sudo apt install brightnessctl', 'Backlight control'],
      ['brightnessctl set 50%', 'Set screen brightness', 'Updated device \'intel_backlight\':\nDevice \'intel_backlight\' of class \'backlight\':\n\tCurrent brightness: 48000 (50%)\n\tMax brightness: 96000'],
      ['sudo apt install libinput-tools', 'Input device debugging'],
      ['sudo libinput list-devices | grep -A2 Touchpad', 'Touchpad capabilities', 'Device:           SYNA8018:00 06CB:CE67 Touchpad\nKernel:           /dev/input/event7\nGroup:            5']
    ],
    flags: [['-e', 'Enumerate devices', 'upower'], ['-i <path>', 'Device info', 'upower'], ['--auto-tune', 'Enable tunables', 'powertop'], ['--html', 'Report', 'powertop'], ['set N%|+10%|10%-', 'Brightness', 'brightnessctl'], ['debug-events', 'Live events', 'libinput']],
    demo: ['upower -i $(upower -e | grep BAT)', '  native-path:          BAT0\n  vendor:               SMP\n  model:                5B11M90088\n  power supply:         yes\n  battery\n    present:             yes\n    state:               discharging\n    energy:              43.12 Wh\n    energy-full:         52.80 Wh\n    energy-full-design:  57.00 Wh\n    energy-rate:         8.41 W\n    time to empty:       5.1 hours\n    percentage:          81%\n    capacity:            92.6%\n    technology:          lithium-polymer'],
    tips: ['Battery charge limits (e.g. stop at 80%) live in Settings › Power on supported laptops in recent GNOME.'] },
  { id: 'print', title: 'Printing & scanning', intro: 'CUPS commands, HPLIP and SANE.',
    cmds: [
      ['lpstat -t', 'Everything CUPS knows: printers, queues, defaults'],
      ['lp -d HP_LaserJet_M110w report.pdf', 'Print a file', 'request id is HP_LaserJet_M110w-41 (1 file(s))'],
      ['lp -n 2 -o sides=two-sided-long-edge report.pdf', 'Two copies, duplex'],
      ['cancel -a', 'Cancel all your jobs', ''],
      ['sudo lpadmin -x OldPrinter', 'Remove a printer', ''],
      ['sudo apt install hplip', 'HP drivers and tools'],
      ['hp-setup -i 192.168.1.50', 'Set up an HP printer by IP'],
      ['scanimage -L', 'List scanners (SANE / eSCL)', 'device `airscan:e0:HP LaserJet M110w\' is a eSCL HP LaserJet M110w ip=192.168.1.50'],
      ['scanimage --format=png --resolution 300 > scan.png', 'Scan a page']
    ],
    flags: [['-d <printer>', 'Destination', 'lp'], ['-n <N>', 'Copies', 'lp'], ['-o sides=…', 'Duplex', 'lp'], ['-t', 'All status', 'lpstat'], ['-x <name>', 'Delete printer', 'lpadmin'], ['--resolution', 'DPI', 'scanimage']],
    demo: ['lpstat -t', 'scheduler is running\nsystem default destination: HP_LaserJet_M110w\ndevice for HP_LaserJet_M110w: implicitclass://HP_LaserJet_M110w/\nHP_LaserJet_M110w accepting requests since Sat 10 Oct 2026 07:13:12 AM +03\nprinter HP_LaserJet_M110w is idle.  enabled since Sat 10 Oct 2026 07:13:12 AM +03'],
    tips: ['Most modern network printers work driverless (IPP Everywhere) — no driver install needed.'] }
]);

UB.add('android', [
  { id: 'debug', title: 'Screenshots, battery & debloat', intro: 'Useful adb shell commands.',
    cmds: [
      ['adb exec-out screencap -p > screen.png', 'Save a phone screenshot on the PC', ''],
      ['adb shell screenrecord --time-limit 30 /sdcard/demo.mp4', 'Record the screen for 30 s'],
      ['adb shell dumpsys battery', 'Battery level, health and temperature', 'Current Battery Service state:\n  AC powered: false\n  USB powered: true\n  status: 2\n  health: 2\n  present: true\n  level: 76\n  scale: 100\n  voltage: 4182\n  temperature: 301\n  technology: Li-ion'],
      ['adb shell wm size', 'Screen resolution', 'Physical size: 1440x3120'],
      ['adb shell input text "hello"', 'Type text on the phone', ''],
      ['adb shell pm list packages -d', 'Disabled packages'],
      ['adb shell pm uninstall -k --user 0 com.example.bloat', 'Remove a preinstalled app for your user (debloat)', 'Success'],
      ['adb shell cmd package install-existing com.example.bloat', 'Restore a removed system app', 'Package com.example.bloat installed for user: 0']
    ],
    flags: [['exec-out', 'Binary-safe output', 'adb'], ['--time-limit <s>', 'Recording length', 'adb'], ['-d', 'Disabled only (pm list)', 'adb'], ['-k --user 0', 'Keep data, current user only', 'adb']],
    demo: ['adb shell dumpsys battery', 'Current Battery Service state:\n  AC powered: false\n  USB powered: true\n  status: 2\n  health: 2\n  present: true\n  level: 76\n  scale: 100\n  voltage: 4182\n  temperature: 301\n  technology: Li-ion'],
    warn: ['Removing the wrong system package can bootloop the phone. Research each package and keep the restore command handy.'] }
]);
