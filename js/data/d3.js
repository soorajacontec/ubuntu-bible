/* Processes, Performance, Shell, Git, Editors, Dev Tools, Packaging, Local AI */
UB.sec({ id: 'processes', title: 'Processes', icon: '🧵', desc: 'See, prioritise, pause and stop running programs.', cards: [
  { id: 'list', title: 'List & monitor', intro: 'ps, top, htop, btop, pgrep.',
    cmds: [
      ['ps aux --sort=-%mem | head', 'Top memory users'],
      ['ps -ef --forest', 'Process tree'],
      ['pgrep -a firefox', 'PIDs and command lines by name'],
      ['top', 'Live process monitor (q to quit)'],
      ['htop', 'Friendlier live monitor'],
      ['sudo apt install btop', 'Install a modern resource monitor'],
      ['pstree -p ssk', 'Tree of your processes'],
      ['resources', 'GNOME Resources app (default monitor on 26.04)']
    ],
    flags: [['aux', 'All processes, BSD style', 'ps'], ['-ef', 'All processes, full listing', 'ps'], ['--sort=-%cpu', 'Sort descending', 'ps'], ['-a', 'Full command line', 'pgrep'], ['-u <user>', 'By user', 'pgrep'], ['-p', 'Show PIDs', 'pstree']],
    demo: ['ps aux --sort=-%mem | head', 'USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nssk         3120 12.4 14.8 12880412 2391044 ?   Sl   07:15  18:31 /snap/firefox/6812/usr/lib/firefox/firefox\nssk         2214  3.1  4.9 5627312 790212 ?     Ssl  07:13   4:02 /usr/bin/gnome-shell\nssk         4410  1.8  4.1 1440528 662344 ?     Sl   08:02   1:12 /usr/share/code/code --type=renderer\nssk         3388  0.4  2.2 2961100 356812 ?     Sl   07:15   0:33 /snap/firefox/6812/usr/lib/firefox/firefox -contentproc\nroot         991  0.2  0.9 2318880 151204 ?     Ssl  07:12   0:09 /usr/lib/snapd/snapd\nssk         2861  0.6  0.8  890112 132668 ?     Sl   07:14   0:41 /usr/bin/ptyxis\nroot         812  0.0  0.1   23524  15392 ?     Ss   07:12   0:01 /usr/lib/systemd/systemd-resolved\nssk         2390  0.0  0.4  712204  71228 ?     Ssl  07:13   0:02 /usr/libexec/evolution-data-server\nroot           1  0.0  0.1   23996  14520 ?     Ss   07:12   0:03 /sbin/init splash'],
    v24: '24.04 uses GNOME System Monitor (`gnome-system-monitor`) instead of Resources.' },
  { id: 'signals', title: 'Stop & signal', intro: 'kill, pkill, killall and xkill.',
    cmds: [
      ['kill 4410', 'Ask a process to exit (SIGTERM)'],
      ['kill -9 4410', 'Force-kill (SIGKILL) a stuck process'],
      ['pkill -f "python3 server.py"', 'Kill by full command line'],
      ['killall -HUP nginx', 'Send a signal to every process with that name'],
      ['kill -l', 'List signal names'],
      ['sudo systemctl kill --signal=SIGUSR1 myapp', 'Signal a whole service']
    ],
    flags: [['-TERM (15)', 'Graceful stop', 'kill'], ['-KILL (9)', 'Cannot be caught', 'kill'], ['-HUP (1)', 'Reload/hang up', 'kill'], ['-STOP / -CONT', 'Pause / resume', 'kill'], ['-f', 'Match full command', 'pkill'], ['-u <user>', 'Only this user', 'pkill']],
    demo: ['kill -l', ' 1) SIGHUP\t 2) SIGINT\t 3) SIGQUIT\t 4) SIGILL\t 5) SIGTRAP\n 6) SIGABRT\t 7) SIGBUS\t 8) SIGFPE\t 9) SIGKILL\t10) SIGUSR1\n11) SIGSEGV\t12) SIGUSR2\t13) SIGPIPE\t14) SIGALRM\t15) SIGTERM\n16) SIGSTKFLT\t17) SIGCHLD\t18) SIGCONT\t19) SIGSTOP\t20) SIGTSTP'],
    tips: ['Frozen desktop app? Wait for GNOME\'s "not responding" dialog and choose Force Quit, or switch to a text console with Ctrl+Alt+F3 and use `pkill`.'] },
  { id: 'jobs', title: 'Jobs & priority', intro: 'Background jobs, nice and nohup.',
    cmds: [
      ['sleep 300 &', 'Run in the background'],
      ['jobs -l', 'Background jobs in this shell'],
      ['fg %1', 'Bring job 1 to the foreground'],
      ['bg %1', 'Resume a stopped job in background (after Ctrl+Z)'],
      ['nohup ./long-task.sh > task.log 2>&1 &', 'Keep running after logout'],
      ['nice -n 10 tar -czf big.tgz /data', 'Start with lower priority'],
      ['sudo renice -n -5 -p 4410', 'Raise priority of a running process'],
      ['ionice -c3 rsync -a /data /backup', 'Idle I/O priority'],
      ['systemd-run --user --scope -p MemoryMax=2G ./build.sh', 'Cap memory of a command']
    ],
    flags: [['-n <N>', 'Niceness −20 (high) … 19 (low)', 'nice'], ['-p <pid>', 'Process', 'renice'], ['-c1/2/3', 'Realtime/best-effort/idle', 'ionice'], ['%N', 'Job number', 'fg']],
    demo: ['jobs -l', '[1]+  6120 Running                 sleep 300 &'] },
  { id: 'open', title: 'Files, ports & syscalls', intro: 'What a process is doing.',
    cmds: [
      ['sudo lsof -i :8080', 'Who uses a port'],
      ['sudo lsof +D /media/ssk/USB', 'Why a USB drive is busy'],
      ['sudo fuser -vm /media/ssk/USB', 'Processes using a mount'],
      ['sudo strace -fp 4410 -e trace=network', 'Trace network syscalls'],
      ['cat /proc/4410/status', 'Kernel view of a process'],
      ['sudo ls -l /proc/4410/fd', 'Open file descriptors']
    ],
    flags: [['-i :<port>', 'Network files', 'lsof'], ['+D <dir>', 'Recursive directory', 'lsof'], ['-f', 'Follow forks', 'strace'], ['-p <pid>', 'Attach', 'strace'], ['-e trace=', 'Filter syscalls', 'strace']],
    demo: ['sudo lsof -i :8080', 'COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnode    7731  ssk   22u  IPv6  61234      0t0  TCP *:http-alt (LISTEN)'] }
]});

UB.sec({ id: 'performance', title: 'Performance', icon: '📈', desc: 'Memory, CPU, I/O and profiling tools.', cards: [
  { id: 'mem', title: 'Memory & load', intro: 'free, vmstat, uptime.',
    cmds: [
      ['free -h', 'RAM and swap usage'],
      ['uptime', 'Load averages', ' 09:52:14 up  2:39,  2 users,  load average: 0.61, 0.48, 0.39'],
      ['vmstat 2 5', 'CPU/memory/IO every 2 s, 5 times'],
      ['nproc', 'Number of CPU threads', '16'],
      ['lscpu', 'CPU model and features'],
      ['cat /proc/pressure/memory', 'Pressure stall information']
    ],
    flags: [['-h', 'Human readable', 'free'], ['-s <sec>', 'Repeat every N s', 'free'], ['<delay> <count>', 'Sampling', 'vmstat'], ['-w', 'Wide output', 'vmstat']],
    demo: ['free -h', '               total        used        free      shared  buff/cache   available\nMem:            15Gi       6.4Gi       2.1Gi       812Mi       7.6Gi       8.9Gi\nSwap:          4.0Gi       512Mi       3.5Gi'],
    tips: ['"available", not "free", is what matters — Linux uses idle RAM as cache.'] },
  { id: 'io', title: 'Disk & network I/O', intro: 'iostat, iotop, nethogs, sar.',
    cmds: [
      ['sudo apt install sysstat iotop-c nethogs', 'Install the I/O toolkit'],
      ['iostat -xz 2', 'Extended per-device stats'],
      ['sudo iotop-c -o', 'Processes doing I/O right now'],
      ['sudo nethogs wlp0s20f3', 'Bandwidth per process'],
      ['sar -u 1 5', 'CPU utilisation samples'],
      ['sar -n DEV 1 3', 'Network throughput per interface']
    ],
    flags: [['-x', 'Extended stats', 'iostat'], ['-z', 'Hide idle devices', 'iostat'], ['-o', 'Only active', 'iotop-c'], ['-u', 'CPU', 'sar'], ['-n DEV', 'Network devices', 'sar'], ['-r', 'Memory', 'sar']],
    demo: ['iostat -xz 2', 'avg-cpu:  %user   %nice %system %iowait  %steal   %idle\n           6.12    0.02    2.41    0.38    0.00   91.07\n\nDevice            r/s     rkB/s   rrqm/s  %rrqm r_await rareq-sz     w/s     wkB/s   w_await wareq-sz  aqu-sz  %util\nnvme0n1         14.20    712.40     0.00   0.00    0.21    50.17   38.60   1820.80    0.64    47.17    0.03   1.92'] },
  { id: 'profile', title: 'Profiling & tuning', intro: 'perf, boot time, CPU frequency.',
    cmds: [
      ['sudo apt install linux-tools-common linux-tools-$(uname -r)', 'Install perf for your kernel'],
      ['sudo perf top', 'Live hottest functions'],
      ['sudo perf record -g -- ./app', 'Record a profile with call graphs'],
      ['sudo perf report', 'Analyse the recording'],
      ['systemd-analyze blame | head', 'Slowest units at boot'],
      ['sudo apt install linux-tools-generic', 'cpupower and friends'],
      ['cpupower frequency-info', 'CPU governor and frequency'],
      ['sudo sysctl vm.swappiness=10', 'Prefer RAM over swap (until reboot)']
    ],
    flags: [['-g', 'Call graphs', 'perf'], ['-p <pid>', 'Attach to process', 'perf'], ['-e <event>', 'Event (cycles, cache-misses)', 'perf'], ['--sort', 'Report grouping', 'perf']],
    demo: ['systemd-analyze blame | head', '6.912s plymouth-quit-wait.service\n3.104s NetworkManager-wait-online.service\n1.812s snapd.seeded.service\n1.402s snapd.service\n 912ms dev-nvme0n1p2.device\n 604ms systemd-udev-settle.service\n 488ms apparmor.service\n 361ms udisks2.service\n 302ms accounts-daemon.service\n 288ms gpu-manager.service'] }
]});

UB.sec({ id: 'shell', title: 'Shell', icon: '💲', desc: 'Bash power tools: pipes, redirection, text processing, aliases and multiplexers.', cards: [
  { id: 'redirect', title: 'Pipes & redirection', intro: 'Chain commands and capture output.',
    cmds: [
      ['ls /etc | wc -l', 'Pipe output into another command', '237'],
      ['dmesg > boot.txt', 'Write stdout to a file (overwrite)'],
      ['echo "export EDITOR=vim" >> ~/.bashrc', 'Append to a file'],
      ['make 2> errors.log', 'Redirect stderr'],
      ['./build.sh > build.log 2>&1', 'Both stdout and stderr to a file'],
      ['sort names.txt | uniq -c | sort -rn', 'Count duplicate lines'],
      ['journalctl -b | tee boot.log | grep -i error', 'Save and filter at the same time'],
      ['diff <(ls dir1) <(ls dir2)', 'Process substitution']
    ],
    flags: [['|', 'Pipe stdout'], ['>', 'Overwrite file'], ['>>', 'Append'], ['2>', 'stderr'], ['2>&1', 'stderr to stdout'], ['&>', 'Both to a file (bash)'], ['<(…)', 'Process substitution'], ['&&  ||', 'Run next on success / failure']],
    demo: ['sort names.txt | uniq -c | sort -rn', '      4 alice\n      3 bob\n      1 carol'] },
  { id: 'text', title: 'Text processing', intro: 'sed, awk, cut, sort, jq.',
    cmds: [
      ['sed -i "s/old/new/g" config.txt', 'Replace text in place'],
      ['awk -F: \'$3>=1000 {print $1}\' /etc/passwd', 'Regular user names', 'nobody\nssk\nalice'],
      ['cut -d, -f1,3 data.csv', 'Select CSV columns'],
      ['sort -t, -k2 -n data.csv', 'Sort numerically by column 2'],
      ['tr a-z A-Z < file.txt', 'Uppercase'],
      ['xargs -a urls.txt -n1 -P4 curl -sO', 'Download URLs 4 at a time'],
      ['jq ".items[].name" data.json', 'Query JSON (apt install jq)'],
      ['yq ".services | keys" compose.yaml', 'Query YAML (snap install yq)']
    ],
    flags: [['-i', 'Edit in place', 'sed'], ['s/a/b/g', 'Substitute globally', 'sed'], ['-F <sep>', 'Field separator', 'awk'], ['-d <sep> -f <n>', 'Delimiter and fields', 'cut'], ['-n -k -t', 'Numeric / key / separator', 'sort'], ['-r', 'Raw strings', 'jq']],
    demo: ['jq ".items[].name" data.json', '"web-01"\n"web-02"\n"db-01"'] },
  { id: 'config', title: 'Aliases, PATH & prompt', intro: 'Customise bash.',
    cmds: [
      ['alias ll="ls -alF"', 'Create an alias for this session'],
      ['echo \'alias update="sudo apt update && sudo apt upgrade"\' >> ~/.bash_aliases', 'Persist an alias'],
      ['source ~/.bashrc', 'Reload bash config'],
      ['echo $PATH', 'Command search path', '/home/ssk/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin'],
      ['export PATH="$HOME/.local/bin:$PATH"', 'Prepend a directory to PATH'],
      ['env | sort', 'All environment variables'],
      ['history | grep ssh', 'Search history (or press Ctrl+R)']
    ],
    flags: [['~/.bashrc', 'Interactive shell config'], ['~/.profile', 'Login shell config'], ['~/.bash_aliases', 'Aliases (sourced by Ubuntu\'s .bashrc)'], ['HISTSIZE', 'History length'], ['PS1', 'Prompt string']],
    demo: ['type update', 'update is aliased to `sudo apt update && sudo apt upgrade\''] },
  { id: 'shells', title: 'zsh, fish & tmux', intro: 'Alternative shells and multiplexers.',
    cmds: [
      ['sudo apt install zsh', 'Install zsh'],
      ['chsh -s $(which zsh)', 'Make zsh your login shell'],
      ['sudo apt install fish', 'Install fish'],
      ['sudo apt install tmux', 'Install tmux'],
      ['tmux new -s work', 'New named session'],
      ['tmux attach -t work', 'Re-attach after disconnect'],
      ['tmux ls', 'List sessions', 'work: 3 windows (created Sat Oct  3 09:10:12 2026)'],
      ['screen -S job', 'GNU screen alternative']
    ],
    flags: [['Ctrl-b d', 'Detach', 'tmux'], ['Ctrl-b c', 'New window', 'tmux'], ['Ctrl-b %', 'Split left/right', 'tmux'], ['Ctrl-b "', 'Split top/bottom', 'tmux'], ['Ctrl-b arrow', 'Move between panes', 'tmux']],
    demo: ['chsh -s $(which zsh)', 'Password: '],
    tips: ['Ptyxis (26.04\'s terminal) has built-in container awareness: new tabs can open straight into a Toolbx/Distrobox container.'] }
]});

UB.sec({ id: 'git', title: 'Git', icon: '🌿', desc: 'Version control from first commit to rebasing and recovery.', cards: [
  { id: 'setup', title: 'Install & configure', intro: 'Identity, defaults and keys.',
    cmds: [
      ['sudo apt install git', 'Install Git'],
      ['git config --global user.name "SSK Blum"', 'Your name for commits'],
      ['git config --global user.email "you@example.com"', 'Your email for commits'],
      ['git config --global init.defaultBranch main', 'Default branch name'],
      ['git config --global pull.rebase true', 'Rebase on pull'],
      ['git config --global gpg.format ssh', 'Sign commits with SSH keys'],
      ['git config --list --show-origin', 'Effective config and where it came from'],
      ['sudo add-apt-repository ppa:git-core/ppa', 'Newest Git from the git-core PPA']
    ],
    flags: [['--global', '~/.gitconfig'], ['--local', '.git/config'], ['--system', '/etc/gitconfig'], ['--list', 'Show values'], ['--unset', 'Remove a key']],
    demo: ['git --version', 'git version 2.51.0'] },
  { id: 'daily', title: 'Daily workflow', intro: 'Clone, stage, commit, push.',
    cmds: [
      ['git clone git@github.com:ssk/app.git', 'Copy a repository'],
      ['git status -sb', 'Short status with branch'],
      ['git add -p', 'Stage changes hunk by hunk'],
      ['git commit -m "Add login form"', 'Commit staged changes'],
      ['git commit --amend --no-edit', 'Add staged changes to the last commit'],
      ['git push -u origin main', 'Push and set upstream'],
      ['git pull', 'Fetch and integrate'],
      ['git log --oneline --graph --decorate -15', 'Compact history graph'],
      ['git diff --staged', 'Review what will be committed']
    ],
    flags: [['-m <msg>', 'Message', 'git'], ['-a', 'Stage tracked changes', 'git'], ['--amend', 'Rewrite last commit', 'git'], ['-p', 'Patch mode', 'git'], ['-u', 'Set upstream', 'git'], ['--oneline', 'Compact log', 'git'], ['--graph', 'ASCII graph', 'git']],
    demo: [['git status -sb', '## main...origin/main [ahead 1]\n M src/app.py\n?? src/login.html'],
      ['git log --oneline --graph --decorate -15', '* 3f2a1c9 (HEAD -> main) Add login form\n* 9b8e7d1 (origin/main) Fix CSS on mobile\n*   7a6c5e2 Merge branch \'feature/api\'\n|\\\n| * 51d4c3b Add /health endpoint\n|/\n* 2e1f0a9 Initial commit']] },
  { id: 'branch', title: 'Branches, merge & rebase', intro: 'Parallel work.',
    cmds: [
      ['git switch -c feature/search', 'Create and switch to a branch'],
      ['git branch -vv', 'Branches with upstream info'],
      ['git merge --no-ff feature/search', 'Merge keeping a merge commit'],
      ['git rebase -i HEAD~4', 'Squash/reorder the last 4 commits'],
      ['git cherry-pick 51d4c3b', 'Apply one commit here'],
      ['git push origin --delete feature/search', 'Delete a remote branch'],
      ['git stash push -m "wip"', 'Shelve uncommitted work'],
      ['git stash pop', 'Restore shelved work']
    ],
    flags: [['-c', 'Create (switch)', 'git'], ['-d / -D', 'Delete / force delete branch', 'git'], ['--no-ff', 'Always create merge commit', 'git'], ['-i', 'Interactive rebase', 'git'], ['--continue / --abort', 'Rebase/merge control', 'git']],
    demo: ['git branch -vv', '* feature/search 4c1d2e3 [origin/feature/search] Add search box\n  main           3f2a1c9 [origin/main: ahead 1] Add login form'] },
  { id: 'undo', title: 'Undo & recover', intro: 'Fix mistakes safely.',
    cmds: [
      ['git restore src/app.py', 'Discard unstaged changes to a file'],
      ['git restore --staged src/app.py', 'Unstage a file'],
      ['git reset --soft HEAD~1', 'Undo last commit, keep changes staged'],
      ['git revert 3f2a1c9', 'Undo a pushed commit with a new commit'],
      ['git reflog', 'Find "lost" commits'],
      ['git reset --hard ORIG_HEAD', 'Return to before a bad merge/rebase'],
      ['git clean -nd', 'Preview deleting untracked files'],
      ['git bisect start', 'Begin binary search for a bad commit']
    ],
    flags: [['--soft', 'Keep index and tree', 'git'], ['--mixed', 'Keep tree only (default)', 'git'], ['--hard', 'Discard everything', 'git'], ['-n', 'Dry run (clean)', 'git'], ['-d', 'Include directories (clean)', 'git']],
    demo: ['git reflog', '3f2a1c9 (HEAD -> main) HEAD@{0}: commit: Add login form\n9b8e7d1 (origin/main) HEAD@{1}: pull: Fast-forward\n4c1d2e3 HEAD@{2}: checkout: moving from feature/search to main'],
    warn: ['`git reset --hard` and `git clean -fd` delete uncommitted work permanently.'] }
]});

UB.sec({ id: 'editors', title: 'Editors', icon: '✍️', desc: 'Terminal editors and desktop IDEs on Ubuntu.', cards: [
  { id: 'nano', title: 'nano', intro: 'Ubuntu\'s default terminal editor.',
    cmds: [
      ['nano notes.txt', 'Open or create a file'],
      ['sudo nano /etc/hosts', 'Edit a system file'],
      ['nano +42 app.py', 'Open at line 42'],
      ['nano -l script.sh', 'Show line numbers']
    ],
    flags: [['Ctrl+O', 'Write (save)', 'nano'], ['Ctrl+X', 'Exit', 'nano'], ['Ctrl+W', 'Search', 'nano'], ['Ctrl+\\', 'Replace', 'nano'], ['Ctrl+K / Ctrl+U', 'Cut / paste line', 'nano'], ['Alt+U', 'Undo', 'nano'], ['Ctrl+_', 'Go to line', 'nano'], ['-l', 'Line numbers', 'nano']],
    demo: ['nano --version', ' GNU nano, version 8.4\n (C) 2025 the Free Software Foundation and various contributors\n Compiled options: --disable-libmagic --enable-utf8'] },
  { id: 'vim', title: 'Vim & Neovim', intro: 'Modal editing.',
    cmds: [
      ['sudo apt install vim', 'Full Vim (Ubuntu ships vim-tiny)'],
      ['vimtutor', '30-minute interactive tutorial'],
      ['vim +/PermitRootLogin /etc/ssh/sshd_config', 'Open at first match'],
      ['sudo apt install neovim', 'Install Neovim'],
      ['nvim -d a.conf b.conf', 'Diff two files side by side']
    ],
    flags: [['i / Esc', 'Insert / normal mode', 'vim'], [':w / :q / :wq / :q!', 'Save / quit / both / discard', 'vim'], ['/text', 'Search', 'vim'], [':%s/a/b/g', 'Replace all', 'vim'], ['dd / yy / p', 'Delete / yank / paste line', 'vim'], ['u / Ctrl+R', 'Undo / redo', 'vim']],
    demo: ['vim --version | head -1', 'VIM - Vi IMproved 9.1 (2024 Jan 02, compiled Sep 02 2026 10:11:04)'] },
  { id: 'gui', title: 'Desktop editors & IDEs', intro: 'Text Editor, VS Code, JetBrains.',
    cmds: [
      ['gnome-text-editor notes.md', 'GNOME Text Editor (default)'],
      ['sudo snap install code --classic', 'Visual Studio Code (snap)'],
      ['code .', 'Open the current folder in VS Code'],
      ['snap find jetbrains', 'Find JetBrains IDE snaps (PyCharm, IntelliJ IDEA…)'],
      ['flatpak install flathub dev.zed.Zed', 'Zed editor from Flathub'],
      ['sudo apt install micro', 'micro: nano-like with modern keys']
    ],
    flags: [['--classic', 'IDEs need classic confinement', 'snap'], ['-n', 'New window', 'code'], ['--diff a b', 'Diff view', 'code'], ['--install-extension <id>', 'Install extension', 'code']],
    demo: ['sudo snap install code --classic', 'code 1.105.0 from Visual Studio Code (vscode✓) installed'],
    tips: ['Microsoft also offers an apt repository/.deb for VS Code if you prefer debs over snaps.'] }
]});

UB.sec({ id: 'devtools', title: 'Dev Tools', icon: '🧰', desc: 'Compilers, Python, Node.js, Rust, Go, Java and debugging on Ubuntu 26.04.', cards: [
  { id: 'build', title: 'Build essentials', intro: 'GCC 15, make, CMake, gdb.',
    cmds: [
      ['sudo apt install build-essential', 'gcc, g++, make, libc headers'],
      ['gcc --version | head -1', 'Compiler version', 'gcc (Ubuntu 15.2.0-4ubuntu4) 15.2.0'],
      ['sudo apt install cmake ninja-build pkg-config', 'Modern build tooling'],
      ['cmake -B build -G Ninja', 'Configure a CMake project with Ninja'],
      ['cmake --build build', 'Build it'],
      ['sudo apt install clang lld', 'LLVM/Clang 21 toolchain'],
      ['gdb ./app', 'Debug a program'],
      ['valgrind --leak-check=full ./app', 'Find memory leaks']
    ],
    flags: [['-O2 / -g', 'Optimise / debug info', 'gcc'], ['-Wall -Wextra', 'Warnings', 'gcc'], ['-B <dir>', 'Build dir', 'cmake'], ['-G Ninja', 'Generator', 'cmake'], ['-j<N>', 'Parallel jobs', 'make']],
    demo: ['gcc --version | head -1', 'gcc (Ubuntu 15.2.0-4ubuntu4) 15.2.0'],
    v24: '24.04 ships GCC 13 and Clang 18 by default (newer via -toolchain PPA or versioned packages).' },
  { id: 'python', title: 'Python 3.14', intro: 'venv, pipx and uv — system Python is externally managed.',
    cmds: [
      ['python3 --version', 'Python version', 'Python 3.14.0'],
      ['sudo apt install python3-venv python3-pip', 'venv and pip support'],
      ['python3 -m venv .venv', 'Create a virtual environment'],
      ['source .venv/bin/activate', 'Activate it'],
      ['pip install requests', 'Install inside the venv'],
      ['sudo apt install pipx', 'Isolated CLI apps'],
      ['pipx install yt-dlp', 'Install a Python CLI tool globally for your user'],
      ['pipx ensurepath', 'Add ~/.local/bin to PATH'],
      ['sudo snap install astral-uv --classic', 'uv: fast Python/project manager']
    ],
    flags: [['-m venv <dir>', 'Create venv', 'python3'], ['--system-site-packages', 'See apt-installed modules', 'python3'], ['-r requirements.txt', 'Install from file', 'pip'], ['--upgrade', 'Upgrade', 'pip']],
    demo: ['pip install requests', 'error: externally-managed-environment\n\n× This environment is externally managed\n╰─> To install Python packages system-wide, try apt install\n    python3-xyz, where xyz is the package you are trying to\n    install.\n\n    If you wish to install a non-Debian-packaged Python package,\n    create a virtual environment using python3 -m venv path/to/venv.\n    Then use path/to/venv/bin/python and path/to/venv/bin/pip.'],
    warn: ['Do not use `pip install --break-system-packages` on the system Python; it can break apt-managed tools.'],
    v24: '24.04 ships Python 3.12. The externally-managed rule (PEP 668) applies there too.' },
  { id: 'node', title: 'Node.js', intro: 'Archive, snap, or nvm.',
    cmds: [
      ['sudo apt install nodejs npm', 'Node from the Ubuntu archive'],
      ['sudo snap install node --classic --channel=24', 'Node 24 LTS from the snap'],
      ['curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash', 'Install nvm (per-user)'],
      ['nvm install --lts', 'Latest LTS via nvm'],
      ['node -v', 'Node version', 'v24.9.0'],
      ['corepack enable', 'Enable pnpm/yarn shims'],
      ['npm config set prefix ~/.npm-global', 'Global npm installs without sudo']
    ],
    flags: [['--lts', 'Latest LTS', 'nvm'], ['use <ver>', 'Switch version', 'nvm'], ['-g', 'Global install', 'npm'], ['ci', 'Clean install from lockfile', 'npm']],
    demo: ['nvm install --lts', 'Installing latest LTS version.\nDownloading and installing node v24.9.0...\nDownloading https://nodejs.org/dist/v24.9.0/node-v24.9.0-linux-x64.tar.xz...\n######################################################################## 100.0%\nComputing checksum with sha256sum\nChecksums matched!\nNow using node v24.9.0 (npm v11.6.0)'] },
  { id: 'langs', title: 'Rust, Go, Java', intro: 'More toolchains.',
    cmds: [
      ['sudo apt install rustc cargo', 'Rust 1.93 from the archive'],
      ['curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh', 'rustup (latest Rust, per-user)'],
      ['sudo apt install golang-go', 'Go from the archive'],
      ['sudo snap install go --classic', 'Latest Go via snap'],
      ['sudo apt install openjdk-25-jdk', 'OpenJDK 25 LTS'],
      ['sudo apt install openjdk-21-jdk', 'OpenJDK 21 LTS'],
      ['java -version', 'Active Java']
    ],
    flags: [['update', 'Update toolchains', 'rustup'], ['default stable', 'Default toolchain', 'rustup'], ['build --release', 'Optimised build', 'cargo'], ['--config java', 'Switch Java', 'update-alternatives']],
    demo: ['java -version', 'openjdk version "25" 2025-09-16\nOpenJDK Runtime Environment (build 25+36-Ubuntu-1)\nOpenJDK 64-Bit Server VM (build 25+36-Ubuntu-1, mixed mode, sharing)'],
    v24: '24.04 defaults to OpenJDK 21 and Rust 1.75 (newer rustc-1.xx packages exist).' },
  { id: 'containers-dev', title: 'Dev containers', intro: 'Toolbx & Distrobox.',
    cmds: [
      ['sudo apt install distrobox podman', 'Distrobox with Podman'],
      ['distrobox create -n fedora -i registry.fedoraproject.org/fedora-toolbox:43', 'Create a Fedora box'],
      ['distrobox enter fedora', 'Enter it'],
      ['distrobox-export --app gimp', 'Export a GUI app to your host menu'],
      ['distrobox list', 'Your boxes']
    ],
    flags: [['-n <name>', 'Box name', 'distrobox'], ['-i <image>', 'Image', 'distrobox'], ['--root', 'Rootful box', 'distrobox']],
    demo: ['distrobox list', 'ID           | NAME     | STATUS        | IMAGE\n4c2e1a9f0b3d | fedora   | Up 2 minutes  | registry.fedoraproject.org/fedora-toolbox:43'] }
]});

UB.sec({ id: 'packaging', title: 'Packaging', icon: '🏗️', desc: 'Build .deb packages, rebuild from source and publish to Launchpad PPAs.', cards: [
  { id: 'simple', title: 'A minimal .deb by hand', intro: 'dpkg-deb for simple binaries.',
    cmds: [
      ['mkdir -p hello_1.0-1_amd64/DEBIAN hello_1.0-1_amd64/usr/local/bin', 'Package tree'],
      ['cp hello hello_1.0-1_amd64/usr/local/bin/', 'Add the binary'],
      ['nano hello_1.0-1_amd64/DEBIAN/control', 'Write control metadata'],
      ['dpkg-deb --build --root-owner-group hello_1.0-1_amd64', 'Build the .deb'],
      ['dpkg -c hello_1.0-1_amd64.deb', 'List contents'],
      ['dpkg -I hello_1.0-1_amd64.deb', 'Show control info'],
      ['sudo apt install ./hello_1.0-1_amd64.deb', 'Install it'],
      ['lintian hello_1.0-1_amd64.deb', 'Check policy issues']
    ],
    flags: [['Package:', 'Name', 'control'], ['Version:', 'Upstream-revision', 'control'], ['Architecture:', 'amd64, arm64, all', 'control'], ['Depends:', 'Runtime dependencies', 'control'], ['Maintainer:', 'Name <email>', 'control'], ['Description:', 'Summary + long text', 'control'], ['--root-owner-group', 'Files owned by root', 'dpkg-deb']],
    demo: ['dpkg-deb --build --root-owner-group hello_1.0-1_amd64', "dpkg-deb: building package 'hello' in 'hello_1.0-1_amd64.deb'."] },
  { id: 'debian', title: 'Proper Debian packaging', intro: 'debian/ directory, debhelper and dpkg-buildpackage.',
    cmds: [
      ['sudo apt install devscripts debhelper dh-make lintian', 'Packaging toolchain'],
      ['dh_make --createorig -s -p hello_1.0', 'Generate a debian/ skeleton'],
      ['dch -i', 'Add a changelog entry'],
      ['sudo apt build-dep .', 'Install build dependencies from debian/control'],
      ['dpkg-buildpackage -us -uc -b', 'Build unsigned binary packages'],
      ['debuild -S -sa', 'Build a signed source package for upload'],
      ['apt source htop', 'Download an Ubuntu source package'],
      ['sudo apt install sbuild', 'Clean-chroot builder (or pbuilder)']
    ],
    flags: [['-us -uc', 'Unsigned source and changes', 'dpkg-buildpackage'], ['-b', 'Binary only', 'dpkg-buildpackage'], ['-S', 'Source only', 'dpkg-buildpackage'], ['-i', 'Increment version', 'dch'], ['-s', 'Single binary', 'dh_make'], ['--createorig', 'Make .orig.tar', 'dh_make']],
    demo: ['dpkg-buildpackage -us -uc -b', 'dpkg-buildpackage: info: source package hello\ndpkg-buildpackage: info: source version 1.0-1\ndpkg-buildpackage: info: source distribution resolute\ndpkg-buildpackage: info: host architecture amd64\n dpkg-source --before-build .\n debian/rules binary\ndh binary\n   dh_update_autotools_config\n   dh_auto_configure\n   dh_auto_build\n   dh_auto_install\n   dh_installdocs\n   dh_strip\n   dh_shlibdeps\n   dh_gencontrol\n   dh_builddeb\ndpkg-deb: building package \'hello\' in \'../hello_1.0-1_amd64.deb\'.\n dpkg-genbuildinfo --build=binary -O../hello_1.0-1_amd64.buildinfo\n dpkg-genchanges --build=binary -O../hello_1.0-1_amd64.changes\ndpkg-buildpackage: info: binary-only upload (no source included)'] },
  { id: 'ppa', title: 'Launchpad PPAs', intro: 'Publish packages for Ubuntu users.',
    cmds: [
      ['gpg --full-generate-key', 'Create a signing key'],
      ['gpg --send-keys --keyserver keyserver.ubuntu.com <KEYID>', 'Publish key, then add it on Launchpad'],
      ['dch -D resolute -v 1.0-1~ppa1', 'Target 26.04 in the changelog'],
      ['debuild -S -sa', 'Build signed source package'],
      ['dput ppa:ssk/tools ../hello_1.0-1~ppa1_source.changes', 'Upload to your PPA'],
      ['sudo add-apt-repository ppa:ssk/tools', 'Users add your PPA'],
      ['sudo snap install lpcraft --classic', 'Launchpad CI runner (optional)']
    ],
    flags: [['ppa:<user>/<name>', 'PPA target', 'dput'], ['-D <series>', 'Distribution (noble, resolute)', 'dch'], ['~ppa1', 'Version suffix that sorts below archive', 'dch'], ['-sa', 'Include original tarball', 'debuild']],
    demo: ['dput ppa:ssk/tools ../hello_1.0-1~ppa1_source.changes', 'Checking signature on .changes\ngpg: ../hello_1.0-1~ppa1_source.changes: Valid signature from 3A1F9C2D7B4E6A10\nChecking signature on .dsc\ngpg: ../hello_1.0-1~ppa1.dsc: Valid signature from 3A1F9C2D7B4E6A10\nUploading to ppa (via ftp to ppa.launchpad.net):\n  Uploading hello_1.0-1~ppa1.dsc: done.\n  Uploading hello_1.0.orig.tar.gz: done.\n  Uploading hello_1.0-1~ppa1.debian.tar.xz: done.\n  Uploading hello_1.0-1~ppa1_source.buildinfo: done.\n  Uploading hello_1.0-1~ppa1_source.changes: done.\nSuccessfully uploaded packages.'],
    tips: ['Launchpad builds binaries from your source upload — you cannot upload .debs directly.', 'Upload separate versions (e.g. ~ppa1~24.04 and ~ppa1~26.04) for noble and resolute.'] },
  { id: 'snapcraft', title: 'Snaps & other formats', intro: 'snapcraft, AppImage awareness.',
    cmds: [
      ['sudo snap install snapcraft --classic', 'Snap build tool'],
      ['snapcraft init', 'Create snap/snapcraft.yaml'],
      ['snapcraft pack', 'Build the .snap (uses LXD)'],
      ['snapcraft upload --release=edge hello_1.0_amd64.snap', 'Publish to the edge channel'],
      ['sudo apt install libfuse2t64', 'Needed by most AppImages']
    ],
    flags: [['base: core24', 'Runtime base (core24 = 24.04)', 'snapcraft.yaml'], ['confinement: strict', 'Confinement', 'snapcraft.yaml'], ['--release=<ch>', 'Channel', 'snapcraft']],
    demo: ['snapcraft init', 'Go to https://documentation.ubuntu.com/snapcraft/stable/ for more information about the snapcraft.yaml format.\nSuccessfully initialised project.'] }
]});

UB.sec({ id: 'ai', title: 'Local AI', icon: '🤖', desc: 'Run LLMs locally: Ollama, llama.cpp, inference snaps and GPU acceleration.', cards: [
  { id: 'ollama', title: 'Ollama', intro: 'The easiest local LLM runner.',
    cmds: [
      ['curl -fsSL https://ollama.com/install.sh | sh', 'Install Ollama (official script, creates a systemd service)'],
      ['ollama run llama3.2', 'Download and chat with a model'],
      ['ollama pull qwen3:8b', 'Download a model'],
      ['ollama list', 'Installed models'],
      ['ollama ps', 'Loaded models and GPU/CPU split'],
      ['ollama rm llama3.2', 'Delete a model'],
      ['curl http://localhost:11434/api/generate -d \'{"model":"qwen3:8b","prompt":"Hi"}\'', 'Use the HTTP API'],
      ['sudo systemctl edit ollama', 'Set OLLAMA_HOST/OLLAMA_MODELS via drop-in']
    ],
    flags: [['OLLAMA_HOST=0.0.0.0', 'Listen on all interfaces', 'ollama'], ['OLLAMA_MODELS=/data/ollama', 'Model storage path', 'ollama'], ['OLLAMA_KEEP_ALIVE=10m', 'Keep model loaded', 'ollama'], ['/bye', 'Exit chat', 'ollama']],
    demo: [['ollama list', 'NAME            ID              SIZE      MODIFIED\nqwen3:8b        500a1f067a9f    5.2 GB    2 days ago\nllama3.2:latest a80c4f17acd5    2.0 GB    3 weeks ago\nnomic-embed-text:latest 0a109f422b47 274 MB 1 month ago'],
      ['ollama ps', 'NAME        ID              SIZE      PROCESSOR    CONTEXT    UNTIL\nqwen3:8b    500a1f067a9f    6.1 GB    100% GPU     4096       4 minutes from now']],
    warn: ['Exposing port 11434 to your network gives anyone unauthenticated access to your models. Keep it on localhost or put it behind a reverse proxy.'] },
  { id: 'snaps', title: 'Inference snaps (Canonical)', intro: 'Silicon-optimised models packaged as snaps (beta).',
    cmds: [
      ['sudo snap install deepseek-r1 --beta', 'DeepSeek R1 inference snap'],
      ['sudo snap install qwen-vl --beta', 'Qwen 2.5 VL vision-language snap'],
      ['deepseek-r1 status', 'Server, engine and endpoint info'],
      ['deepseek-r1 chat', 'Command-line chat'],
      ['deepseek-r1 list-engines', 'Available hardware engines'],
      ['sudo deepseek-r1 use-engine --auto', 'Pick the best engine for this machine'],
      ['deepseek-r1 show-machine', 'Detected hardware']
    ],
    flags: [['status', 'Server and runtime info', 'deepseek-r1'], ['chat', 'CLI chat', 'deepseek-r1'], ['list-engines', 'Engines and compatibility', 'deepseek-r1'], ['use-engine <name>', 'Switch engine', 'deepseek-r1'], ['get / set k=v', 'Configuration', 'deepseek-r1'], ['prune-cache', 'Free cached resources', 'deepseek-r1']],
    demo: ['deepseek-r1 status', 'engine: intel-cpu\nendpoints:\n    openai: http://localhost:8324/v1'],
    tips: ['Each inference snap exposes an OpenAI-compatible endpoint, so existing tools/SDKs can point at it.'] },
  { id: 'llamacpp', title: 'llama.cpp & GPU stacks', intro: 'Bare-metal performance and drivers.',
    cmds: [
      ['sudo apt install build-essential cmake libcurl4-openssl-dev', 'llama.cpp build deps'],
      ['git clone https://github.com/ggml-org/llama.cpp', 'Get the source'],
      ['cmake -B build -DGGML_VULKAN=ON', 'Configure with Vulkan (AMD/Intel/NVIDIA)'],
      ['cmake --build build -j --config Release', 'Compile llama.cpp'],
      ['./build/bin/llama-server -m models/qwen3-8b-q4_k_m.gguf --port 8080', 'OpenAI-compatible server + web UI'],
      ['sudo ubuntu-drivers install --gpgpu', 'NVIDIA compute driver for headless servers'],
      ['sudo apt install nvidia-cuda-toolkit', 'CUDA toolkit from the archive'],
      ['apt search --names-only rocm', 'Find AMD ROCm packages in the 26.04 archive'],
      ['nvidia-smi', 'Check GPU memory while a model runs']
    ],
    flags: [['-m <gguf>', 'Model file', 'llama-server'], ['-ngl <N>', 'Layers offloaded to GPU', 'llama-server'], ['-c <ctx>', 'Context size', 'llama-server'], ['--host / --port', 'Bind address', 'llama-server'], ['-DGGML_CUDA=ON', 'CUDA build', 'cmake'], ['-DGGML_VULKAN=ON', 'Vulkan build', 'cmake']],
    demo: ['./build/bin/llama-server -m models/qwen3-8b-q4_k_m.gguf --port 8080', 'main: build = 6512 (a1b2c3d4)\nllama_model_loader: loaded meta data with 32 key-value pairs from models/qwen3-8b-q4_k_m.gguf\nload_tensors: offloaded 37/37 layers to GPU\nllama_context: n_ctx = 4096\nmain: server is listening on http://127.0.0.1:8080 - starting the main loop\nsrv  update_slots: all slots are idle'],
    tips: ['Ubuntu 26.04 packages AMD ROCm in the archive; on 24.04 use AMD\'s own repository.'] }
]});
