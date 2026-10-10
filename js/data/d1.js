/* Basics, Troubleshoot, APT, Snap, Flatpak, Files, Users */
UB.sec({ id: 'basics', title: 'Basics', icon: '🧭', desc: 'Find your way around an Ubuntu system: release info, help, navigation and sudo.', cards: [
  { id: 'whoami', title: 'Which Ubuntu am I on?', intro: 'Release, kernel, hostname and architecture.',
    cmds: [
      ['lsb_release -a', 'Distributor, release and codename'],
      ['cat /etc/os-release', 'Machine-readable release info'],
      ['uname -r', 'Running kernel version', '7.0.0-14-generic'],
      ['uname -a', 'Kernel, hostname and architecture', 'Linux ubuntu 7.0.0-14-generic #14-Ubuntu SMP PREEMPT_DYNAMIC Thu Sep 10 11:02:31 UTC 2026 x86_64 GNU/Linux'],
      ['hostnamectl', 'Hostname, OS, kernel, hardware vendor and model'],
      ['dpkg --print-architecture', 'Debian architecture name', 'amd64'],
      ['ubuntu-report show', 'Hardware/system summary the installer can share (opt-in)'],
      ['cat /etc/lsb-release', 'Short release file used by older scripts', 'DISTRIB_ID=Ubuntu\nDISTRIB_RELEASE=26.04\nDISTRIB_CODENAME=resolute\nDISTRIB_DESCRIPTION="Ubuntu 26.04.1 LTS"']
    ],
    flags: [['-a', 'All fields (lsb_release)'], ['-d', 'Description only'], ['-c', 'Codename only'], ['-r', 'Release number only'], ['-s', 'Short output, no labels']],
    demo: [['lsb_release -a', 'No LSB modules are available.\nDistributor ID:\tUbuntu\nDescription:\tUbuntu 26.04.1 LTS\nRelease:\t26.04\nCodename:\tresolute'],
      ['hostnamectl', ' Static hostname: ubuntu\n       Icon name: computer-laptop\n         Chassis: laptop 💻\n      Machine ID: 4f1c2a9be0d84b51a0c2e7d9b1f3a6c8\n         Boot ID: 9b2e0c51a7f64d3e8a1b5c6d7e8f9a0b\n  Operating System: Ubuntu 26.04.1 LTS\n          Kernel: Linux 7.0.0-14-generic\n    Architecture: x86-64\n Hardware Vendor: LENOVO\n  Hardware Model: ThinkPad T14 Gen 5\nFirmware Version: R2LET31W (1.12)\n   Firmware Date: Wed 2026-05-13\n    Firmware Age: 4month 3w']],
    tips: ['Codenames: 24.04 = `noble` (Noble Numbat), 26.04 = `resolute` (Resolute Raccoon). Repository URLs and PPAs use the codename.'],
    v24: '24.04 runs kernel 6.8 (GA) or 6.17 (HWE). `lsb_release -cs` returns `noble`.' },
  { id: 'help', title: 'Getting help', intro: 'man pages, --help, apropos and tldr.',
    cmds: [
      ['man ls', 'Open the manual page for ls'],
      ['man -k partition', 'Search manual page descriptions (same as apropos)'],
      ['ls --help', 'Quick built-in usage summary'],
      ['help cd', 'Help for a bash built-in'],
      ['type ll', 'Show whether a name is an alias, builtin or file', 'll is aliased to `ls -alF\''],
      ['which -a python3', 'Every python3 on your PATH', '/usr/bin/python3\n/bin/python3'],
      ['whatis ssh', 'One-line description', 'ssh (1)               - OpenSSH remote login client'],
      ['sudo apt install tldr', 'Install community cheat-sheets (then: tldr tar)']
    ],
    flags: [['-k <word>', 'Search names and descriptions', 'man'], ['-f <name>', 'Same as whatis', 'man'], ['<section> <name>', 'Pick a section, e.g. man 5 fstab', 'man'], ['-a', 'Show all matching pages', 'man'], ['/text', 'Search forward inside the pager', 'man'], ['q', 'Quit the pager', 'man']],
    demo: ['man -k partition', 'addpart (8)           - tell the kernel about the existence of a partition\ncfdisk (8)            - display or manipulate a disk partition table\ndelpart (8)           - tell the kernel to forget about a partition\nfdisk (8)             - manipulate disk partition table\ngdisk (8)             - Interactive GUID partition table (GPT) manipulator\nparted (8)            - a partition manipulation program\npartx (8)             - tell the kernel about the presence and numbering of on-disk partitions\nsfdisk (8)            - display or manipulate a disk partition table'],
    tips: ['Man sections: 1 user commands, 5 file formats, 8 admin commands. `man 5 sshd_config` documents the file, not the program.'],
    warn: ['Ubuntu Server minimized images strip man pages. Run `sudo unminimize` to restore them.'] },
  { id: 'nav', title: 'Navigating the shell', intro: 'Where you are, moving around, listing.',
    cmds: [
      ['pwd', 'Print the working directory', '/home/ssk'],
      ['cd ~/Downloads', 'Change into a directory'],
      ['cd -', 'Jump back to the previous directory'],
      ['ls -lah', 'Long list, hidden files, human sizes'],
      ['tree -L 2', 'Directory tree two levels deep'],
      ['echo $SHELL', 'Your login shell', '/bin/bash'],
      ['clear', 'Clear the screen (or press Ctrl+L)'],
      ['history | tail -5', 'Your last five commands']
    ],
    flags: [['-l', 'Long format', 'ls'], ['-a', 'Show hidden dotfiles', 'ls'], ['-h', 'Human-readable sizes', 'ls'], ['-t', 'Sort by modification time', 'ls'], ['-r', 'Reverse order', 'ls'], ['-S', 'Sort by size', 'ls']],
    demo: ['ls -lah', 'total 64K\ndrwxr-x--- 16 ssk  ssk  4.0K Oct  3 09:20 .\ndrwxr-xr-x  3 root root 4.0K Apr 24 18:02 ..\n-rw-------  1 ssk  ssk  9.1K Oct  3 09:18 .bash_history\n-rw-r--r--  1 ssk  ssk   220 Apr 24 18:02 .bash_logout\n-rw-r--r--  1 ssk  ssk  3.8K Apr 24 18:02 .bashrc\ndrwx------ 12 ssk  ssk  4.0K Sep 30 21:04 .cache\ndrwx------ 15 ssk  ssk  4.0K Oct  1 08:11 .config\ndrwxr-xr-x  2 ssk  ssk  4.0K Oct  2 17:45 Desktop\ndrwxr-xr-x  5 ssk  ssk  4.0K Oct  3 08:59 Documents\ndrwxr-xr-x  3 ssk  ssk  4.0K Oct  3 09:20 Downloads\ndrwx------  6 ssk  ssk  4.0K Sep 12 10:03 snap\ndrwx------  2 ssk  ssk  4.0K Aug 19 12:40 .ssh'],
    tips: ['`tree` isn\'t installed by default: `sudo apt install tree`.', 'On 26.04 many core utilities (ls, cat, sort…) come from the Rust rust-coreutils (uutils) package; cp, mv and rm are still GNU. Output and flags are compatible for everyday use.'] },
  { id: 'sudo', title: 'sudo & root', intro: 'Run commands as administrator — sudo-rs is the default on 26.04.',
    cmds: [
      ['sudo apt update', 'Run one command as root'],
      ['sudo -i', 'Open a root login shell (exit to leave)'],
      ['sudo -l', 'List what you are allowed to run'],
      ['sudo -u postgres psql', 'Run a command as another user'],
      ['sudoedit /etc/hosts', 'Edit a root-owned file safely with your $EDITOR'],
      ['sudo -k', 'Forget cached credentials immediately'],
      ['sudo update-alternatives --config sudo', 'Switch between sudo-rs and classic sudo.ws (26.04)'],
      ['sudo visudo -f /etc/sudoers.d/90-ssk', 'Create a validated sudoers drop-in']
    ],
    flags: [['-i', 'Login shell as target user'], ['-s', 'Shell keeping your environment'], ['-u <user>', 'Run as user'], ['-E', 'Preserve environment variables'], ['-l', 'List privileges'], ['-k', 'Invalidate timestamp'], ['-n', 'Non-interactive (fail instead of prompting)']],
    demo: [['sudo -l', '[sudo: authenticate] Password: \nUser ssk may run the following commands on ubuntu:\n    (ALL : ALL) ALL'],
      ['sudo update-alternatives --config sudo', 'There are 2 choices for the alternative sudo (providing /usr/bin/sudo).\n\n  Selection    Path                  Priority   Status\n------------------------------------------------------------\n* 0            /usr/lib/cargo/bin/sudo   50        auto mode\n  1            /usr/bin/sudo.ws         40        manual mode\n  2            /usr/lib/cargo/bin/sudo   50        manual mode\n\nPress <enter> to keep the current choice[*], or type selection number: ']],
    tips: ['Members of the `sudo` group get admin rights: `sudo usermod -aG sudo alice`.'],
    warn: ['Never edit /etc/sudoers with a plain editor — a syntax error locks you out. Always use `visudo`.', 'sudo-rs does not support `sudoreplay`/I/O logging or sudoers LDAP. If your automation depends on those, switch the alternative to `sudo.ws`.'],
    v24: '24.04 ships classic sudo (sudo.ws). Its password prompt is "[sudo] password for ssk:", which some expect scripts match on.' }
]});

UB.sec({ id: 'troubleshoot', title: 'Troubleshoot', icon: '🩺', desc: 'Quick fixes for broken packages, failed services, full disks and boot problems.', cards: [
  { id: 'broken-apt', title: 'Broken packages & APT locks', intro: 'Repair dpkg/APT after an interrupted install.',
    cmds: [
      ['sudo dpkg --configure -a', 'Finish configuring half-installed packages'],
      ['sudo apt --fix-broken install', 'Resolve unmet dependencies'],
      ['sudo apt update --fix-missing', 'Retry failed index downloads'],
      ['sudo apt install --reinstall ubuntu-desktop', 'Reinstall the desktop metapackage'],
      ['sudo lsof /var/lib/dpkg/lock-frontend', 'See which process holds the APT lock'],
      ['systemctl status unattended-upgrades', 'Check whether automatic updates are running'],
      ['sudo apt clean', 'Delete cached .deb files (fixes corrupt downloads)']
    ],
    flags: [['--configure -a', 'Configure every unpacked package', 'dpkg'], ['-f, --fix-broken', 'Attempt to correct broken deps', 'apt'], ['--fix-missing', 'Ignore missing packages', 'apt'], ['--reinstall', 'Reinstall even if current', 'apt']],
    demo: [['sudo apt install vlc', 'E: Could not get lock /var/lib/dpkg/lock-frontend. It is held by process 2841 (unattended-upgr)\nN: Be aware that removing the lock file is not a solution and may break your system.\nE: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), is another process using it?'],
      ['sudo dpkg --configure -a', 'Setting up linux-firmware (20260908.git1a2b3c4d-0ubuntu1) ...\nSetting up linux-image-7.0.0-14-generic (7.0.0-14.14) ...\nProcessing triggers for dracut (108-3ubuntu2) ...\nProcessing triggers for grub2-common (2.14-1ubuntu3) ...']],
    warn: ['Do not delete lock files. Wait for the other APT/unattended-upgrades run to finish; if a process is truly dead, reboot and run `sudo dpkg --configure -a`.'] },
  { id: 'failed', title: 'Failed services & errors', intro: 'Find what broke and why.',
    cmds: [
      ['systemctl --failed', 'List failed units'],
      ['journalctl -xeu nginx.service', 'Recent log for one unit with explanations'],
      ['journalctl -b -p err', 'Errors from the current boot'],
      ['journalctl -b -1 -p warning', 'Warnings from the previous boot'],
      ['sudo systemctl reset-failed', 'Clear failed state after fixing'],
      ['dmesg --level=err,warn', 'Kernel errors and warnings'],
      ['ubuntu-bug nginx', 'Report a bug with logs attached (Apport)']
    ],
    flags: [['-x', 'Add catalog explanations', 'journalctl'], ['-e', 'Jump to the end', 'journalctl'], ['-u <unit>', 'Filter by unit', 'journalctl'], ['-b [-N]', 'This boot or N boots ago', 'journalctl'], ['-p <level>', 'Minimum priority', 'journalctl']],
    demo: [['systemctl --failed', '  UNIT          LOAD   ACTIVE SUB    DESCRIPTION\n● nginx.service loaded failed failed A high performance web server and a reverse proxy server\n\nLegend: LOAD   → Reflects whether the unit definition was properly loaded.\n        ACTIVE → The high-level unit activation state, i.e. generalization of SUB.\n        SUB    → The low-level unit activation state, values depend on unit type.\n\n1 loaded units listed.'],
      ['journalctl -xeu nginx.service', 'Oct 03 09:41:02 ubuntu nginx[5120]: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)\nOct 03 09:41:02 ubuntu nginx[5120]: nginx: configuration file /etc/nginx/nginx.conf test failed\nOct 03 09:41:02 ubuntu systemd[1]: nginx.service: Control process exited, code=exited, status=1/FAILURE\n░░ Subject: Unit process exited\n░░ An ExecStartPre= process belonging to unit nginx.service has exited.\nOct 03 09:41:02 ubuntu systemd[1]: Failed to start nginx.service - A high performance web server and a reverse proxy server.']],
    tips: ['"Address already in use" → find the culprit with `sudo ss -ltnp \'sport = :80\'`.'] },
  { id: 'disk-full', title: 'Disk full', intro: 'Free space fast and safely.',
    cmds: [
      ['df -h', 'Free space per filesystem'],
      ['sudo du -xh --max-depth=1 / | sort -h', 'Biggest top-level directories'],
      ['sudo apt install ncdu', 'Install an interactive disk-usage browser'],
      ['sudo ncdu -x /', 'Browse usage interactively'],
      ['sudo journalctl --vacuum-size=200M', 'Shrink the systemd journal'],
      ['sudo apt autoremove --purge', 'Remove orphaned packages and old kernels'],
      ['snap list --all | awk \'/disabled/{print $1, $3}\'', 'Find old disabled snap revisions'],
      ['sudo snap set system refresh.retain=2', 'Keep only two revisions of each snap'],
      ['docker system df', 'Space used by Docker']
    ],
    flags: [['-h', 'Human-readable', 'df'], ['-T', 'Show filesystem type', 'df'], ['-i', 'Inode usage', 'df'], ['-x', 'Stay on one filesystem', 'du'], ['--max-depth=N', 'Limit depth', 'du'], ['-s', 'Summary only', 'du']],
    demo: ['df -h', 'Filesystem      Size  Used Avail Use% Mounted on\ntmpfs           1.6G  2.4M  1.6G   1% /run\nefivarfs        192K  104K   84K  56% /sys/firmware/efi/efivars\n/dev/nvme0n1p2  468G  441G  3.1G 100% /\ntmpfs           7.7G   12M  7.7G   1% /dev/shm\ntmpfs           5.0M   12K  5.0M   1% /run/lock\n/dev/nvme0n1p1  1.1G  6.2M  1.1G   1% /boot/efi\ntmpfs           1.6G  152K  1.6G   1% /run/user/1000'],
    warn: ['Do not delete files from /var/lib/snapd or /var/lib/dpkg by hand. Use snap/apt to remove things.'] },
  { id: 'boot-rescue', title: "Won't boot / black screen", intro: 'First steps when the desktop does not appear.',
    cmds: [
      ['sudo systemctl restart gdm3', 'Restart the login screen (from a TTY: Ctrl+Alt+F3)'],
      ['systemctl get-default', 'Current boot target'],
      ['sudo systemctl set-default graphical.target', 'Boot to the desktop again'],
      ['sudo apt install --reinstall gdm3 ubuntu-session', 'Reinstall login manager and session'],
      ['sudo ubuntu-drivers install', 'Reinstall the recommended GPU driver'],
      ['sudo fsck -f /dev/nvme0n1p2', 'Check a filesystem (only when unmounted, e.g. from live USB)'],
      ['journalctl -b -1 -e', 'End of the log from the failed boot']
    ],
    flags: [['-f', 'Force a check', 'fsck'], ['-y', 'Answer yes to all repairs', 'fsck'], ['-n', 'Check only, change nothing', 'fsck']],
    demo: ['systemctl get-default', 'graphical.target'],
    tips: ['Hold Shift (BIOS) or tap Esc (UEFI) at power-on to show the GRUB menu → Advanced options → (recovery mode).'],
    v24: 'On 24.04 you can pick "Ubuntu on Xorg" at the login screen if Wayland fails. 26.04 is Wayland-only (X11 apps still work via XWayland).' }
]});

UB.sec({ id: 'apt', title: 'APT', icon: '📦', desc: 'The native Debian/Ubuntu package manager — install, update, search and manage repositories (APT 3.2 on 26.04).', cards: [
  { id: 'update', title: 'Update & upgrade', intro: 'Keep the system current.',
    cmds: [
      ['sudo apt update', 'Refresh package lists from all sources'],
      ['apt list --upgradable', 'See what can be upgraded'],
      ['sudo apt upgrade', 'Upgrade packages (never removes anything)'],
      ['sudo apt full-upgrade', 'Upgrade, allowing removals/new deps (kernels, transitions)'],
      ['sudo apt autoremove --purge', 'Remove no-longer-needed dependencies'],
      ['sudo apt upgrade -s', 'Simulate an upgrade'],
      ['sudo unattended-upgrade --dry-run -d', 'Preview automatic security updates']
    ],
    flags: [['-y, --yes', 'Assume yes'], ['-s, --simulate', 'Dry run'], ['--with-new-pkgs', 'upgrade: allow new dependencies'], ['-o APT::Get::Always-Include-Phased-Updates=true', 'Skip phased-update hold-back'], ['-q', 'Quieter output']],
    demo: [['sudo apt update', 'Hit:1 http://archive.ubuntu.com/ubuntu resolute InRelease\nGet:2 http://security.ubuntu.com/ubuntu resolute-security InRelease [126 kB]\nGet:3 http://archive.ubuntu.com/ubuntu resolute-updates InRelease [126 kB]\nHit:4 http://archive.ubuntu.com/ubuntu resolute-backports InRelease\nGet:5 http://archive.ubuntu.com/ubuntu resolute-updates/main amd64 Packages [412 kB]\nFetched 664 kB in 2s (318 kB/s)\n14 packages can be upgraded. Run \'apt list --upgradable\' to see them.'],
      ['sudo apt upgrade', 'Upgrading:\n  firefox  libnss3  linux-firmware  openssl  libssl3t64  python3.14\n  python3.14-minimal  systemd  systemd-sysv  libsystemd0  udev\n\nNot upgrading yet due to phasing:\n  gnome-shell  gnome-shell-common  mutter-common\n\nSummary:\n  Upgrading: 11, Installing: 0, Removing: 0, Not Upgrading: 3\n  Download size: 498 MB\n  Space needed: 21.4 MB / 61.4 GB available\n\nContinue? [Y/n] ']],
    tips: ['"Not upgrading yet due to phasing" is normal: Ubuntu rolls updates out gradually. Just wait — do not force them.'],
    v24: 'APT 2.7 on 24.04 prints the older "The following packages will be upgraded:" layout and "N upgraded, N newly installed…" summary.' },
  { id: 'install', title: 'Install & remove', intro: 'Packages from the archive or a local .deb.',
    cmds: [
      ['sudo apt install htop', 'Install a package'],
      ['sudo apt install ./google-chrome-stable_current_amd64.deb', 'Install a local .deb with dependency resolution'],
      ['sudo apt install --no-install-recommends ffmpeg', 'Skip recommended extras'],
      ['sudo apt reinstall nautilus', 'Reinstall a package'],
      ['sudo apt remove htop', 'Remove, keep config'],
      ['sudo apt purge htop', 'Remove including /etc config'],
      ['sudo apt install -t resolute-backports cockpit', 'Install a newer version from backports'],
      ['sudo apt install nginx=1.28.2-1ubuntu1', 'Install a specific version']
    ],
    flags: [['--no-install-recommends', 'Install only hard dependencies'], ['-t <release>', 'Target release (e.g. resolute-backports)'], ['--reinstall', 'Reinstall'], ['-d', 'Download only'], ['--purge', 'Purge config on removal'], ['-y', 'Non-interactive yes']],
    demo: ['sudo apt install htop', 'Installing:\n  htop\n\nSuggested packages:\n  lm-sensors  strace\n\nSummary:\n  Upgrading: 0, Installing: 1, Removing: 0, Not Upgrading: 0\n  Download size: 171 kB\n  Space needed: 434 kB / 61.4 GB available\n\nGet:1 http://archive.ubuntu.com/ubuntu resolute/main amd64 htop amd64 3.4.1-5 [171 kB]\nFetched 171 kB in 0s (912 kB/s)\nSelecting previously unselected package htop.\n(Reading database ... 214523 files and directories currently installed.)\nPreparing to unpack .../htop_3.4.1-5_amd64.deb ...\nUnpacking htop (3.4.1-5) ...\nSetting up htop (3.4.1-5) ...\nProcessing triggers for hicolor-icon-theme (0.18-2) ...\nProcessing triggers for man-db (2.13.1-1) ...'],
    tips: ['Use `./file.deb` (with ./) so apt treats it as a file, not a package name.'],
    warn: ['Avoid `dpkg -i` for downloaded .debs — it will not pull dependencies. `apt install ./pkg.deb` does.'] },
  { id: 'search', title: 'Search & inspect', intro: 'Find packages and the files they own.',
    cmds: [
      ['apt search --names-only ^python3-flask', 'Search package names by regex'],
      ['apt show nginx', 'Description, version, size, dependencies'],
      ['apt policy firefox', 'Installed vs candidate version and origin'],
      ['apt list --installed | wc -l', 'Count installed packages'],
      ['apt list --manual-installed', 'Packages you installed explicitly'],
      ['dpkg -L curl', 'Files installed by a package'],
      ['dpkg -S /usr/bin/ss', 'Which package owns a file', 'iproute2: /usr/bin/ss'],
      ['apt-file search bin/dig', 'Find a package containing a file not yet installed'],
      ['apt why libfuse2t64', 'Explain why a package is installed (APT 3.1+)'],
      ['apt rdepends --installed libssl3t64', 'Installed packages depending on a library']
    ],
    flags: [['--names-only', 'Match names only', 'apt'], ['--full', 'Full records', 'apt'], ['--installed', 'Only installed', 'apt'], ['--manual-installed', 'Only manually installed', 'apt'], ['-a, --all-versions', 'Show all versions', 'apt']],
    demo: [['apt policy firefox', 'firefox:\n  Installed: 1:1snap1-0ubuntu8\n  Candidate: 1:1snap1-0ubuntu8\n  Version table:\n *** 1:1snap1-0ubuntu8 500\n        500 http://archive.ubuntu.com/ubuntu resolute/main amd64 Packages\n        100 /var/lib/dpkg/status'],
      ['apt why libfuse2t64', 'libfuse2t64:amd64 is selected for install because:\n1. appimagelauncher:amd64 is selected for install\n2. appimagelauncher:amd64 Depends libfuse2t64 (>= 2.9.9)']],
    tips: ['`apt-file` needs `sudo apt install apt-file && sudo apt-file update` first.', 'Firefox and Thunderbird debs in the archive are transitional wrappers that install the snap.'] },
  { id: 'sources', title: 'Repositories & sources', intro: 'deb822 .sources files, components and PPAs.',
    cmds: [
      ['cat /etc/apt/sources.list.d/ubuntu.sources', 'Default Ubuntu repositories (deb822 format)'],
      ['sudo add-apt-repository universe', 'Enable a component'],
      ['sudo add-apt-repository ppa:git-core/ppa', 'Add a Launchpad PPA'],
      ['sudo add-apt-repository --remove ppa:git-core/ppa', 'Remove a PPA'],
      ['sudo apt modernize-sources', 'Convert old one-line .list files to .sources'],
      ['ls /etc/apt/sources.list.d/', 'All extra repository files'],
      ['sudo apt edit-sources', 'Edit sources in your editor'],
      ['sudo apt install ppa-purge', 'Tool to downgrade back to archive versions'],
      ['sudo ppa-purge ppa:git-core/ppa', 'Disable a PPA and downgrade its packages']
    ],
    flags: [['Types:', 'deb and/or deb-src', 'ubuntu.sources'], ['URIs:', 'Mirror URL', 'ubuntu.sources'], ['Suites:', 'resolute resolute-updates resolute-backports', 'ubuntu.sources'], ['Components:', 'main restricted universe multiverse', 'ubuntu.sources'], ['Signed-By:', 'Keyring that must sign the repo', 'ubuntu.sources']],
    demo: ['cat /etc/apt/sources.list.d/ubuntu.sources', 'Types: deb\nURIs: http://archive.ubuntu.com/ubuntu/\nSuites: resolute resolute-updates resolute-backports\nComponents: main restricted universe multiverse\nSigned-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg\n\nTypes: deb\nURIs: http://security.ubuntu.com/ubuntu/\nSuites: resolute-security\nComponents: main restricted universe multiverse\nSigned-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg'],
    tips: ['Third-party repos: download the key to /etc/apt/keyrings/ and reference it with `Signed-By:` — never use the deprecated `apt-key`.'],
    v24: '24.04 also uses ubuntu.sources (deb822), but `apt modernize-sources` arrived later (APT 2.9+); convert by hand on 24.04.' },
  { id: 'hold', title: 'Hold, pin & history', intro: 'Freeze versions and audit what changed.',
    cmds: [
      ['sudo apt-mark hold linux-generic', 'Prevent a package from upgrading'],
      ['apt-mark showhold', 'List held packages'],
      ['sudo apt-mark unhold linux-generic', 'Release a hold'],
      ['sudo apt-mark auto libfoo1', 'Mark as auto-installed so autoremove can clean it'],
      ['apt history-list', 'Past APT transactions (APT 3.1+)'],
      ['sudo apt history-undo 42', 'Undo transaction 42 (APT 3.1+)'],
      ['less /var/log/apt/history.log', 'Raw APT history log (all releases)'],
      ['apt-cache madison nginx', 'Versions available from each repo']
    ],
    flags: [['hold', 'Freeze version', 'apt-mark'], ['unhold', 'Unfreeze', 'apt-mark'], ['showhold', 'List holds', 'apt-mark'], ['Pin-Priority: 1001', 'Force a version even if older (preferences file)', 'apt'], ['Pin-Priority: -1', 'Never install from that origin', 'apt']],
    demo: ['apt history-list', ' ID  Command line                          Date and Time        Action    Changes\n 45  apt install htop                      2026-10-03 09:31:12  Install   1\n 44  apt upgrade                           2026-10-02 18:04:55  Upgrade   11\n 43  apt install ./code_1.104_amd64.deb    2026-09-30 21:10:03  Install   1\n 42  apt install gimp                      2026-09-28 14:22:41  Install   38'],
    tips: ['Pin preferences live in /etc/apt/preferences.d/ — e.g. to prefer a PPA or block snap transitional packages.'],
    v24: '`apt history-*` and `apt why` are not available in APT 2.7; read /var/log/apt/history.log instead.' }
]});

UB.sec({ id: 'snap', title: 'Snap', icon: '🫧', desc: 'Canonical\'s transactional, auto-updating package format with confinement and channels.', cards: [
  { id: 'basics', title: 'Find, install, remove', intro: 'Everyday snap usage.',
    cmds: [
      ['snap find "video editor"', 'Search the Snap Store'],
      ['snap info vlc', 'Channels, versions and publisher'],
      ['sudo snap install vlc', 'Install from latest/stable'],
      ['sudo snap install code --classic', 'Install a classic (unconfined) snap'],
      ['sudo snap install node --channel=24/stable --classic', 'Install from a specific track'],
      ['snap list', 'Installed snaps'],
      ['sudo snap remove --purge vlc', 'Remove without keeping a snapshot'],
      ['sudo snap install ./mysnap_1.0_amd64.snap --dangerous', 'Install an unsigned local snap']
    ],
    flags: [['--classic', 'Classic confinement'], ['--channel=<track/risk>', 'Channel e.g. latest/edge'], ['--beta / --edge / --candidate', 'Risk-level shortcuts'], ['--devmode', 'Development mode (no enforcement)'], ['--dangerous', 'Allow unasserted local snaps'], ['--purge', 'Skip automatic snapshot on remove']],
    demo: [['snap info vlc', 'name:      vlc\nsummary:   The ultimate media player\npublisher: VideoLAN✓\nstore-url: https://snapcraft.io/vlc\nlicense:   GPL-2.0+\ndescription: |\n  VLC is the VideoLAN project\'s media player.\nsnap-id: RT9mcUhVsRYrDLG8qnvGiy26NKvv6Qkd\nchannels:\n  latest/stable:    3.0.21           2026-06-18 (3777) 345MB -\n  latest/candidate: 3.0.21           2026-06-18 (3777) 345MB -\n  latest/beta:      3.0.21-12-g3f2c  2026-09-29 (3891) 351MB -\n  latest/edge:      4.0.0-dev-31842  2026-10-02 (3902) 402MB -'],
      ['sudo snap install vlc', 'vlc 3.0.21 from VideoLAN✓ installed']],
    tips: ['A green ✓ next to a publisher means a verified account (e.g. Canonical✓, VideoLAN✓).'] },
  { id: 'updates', title: 'Updates, holds & revisions', intro: 'Control when snaps refresh and roll back.',
    cmds: [
      ['snap refresh --list', 'Pending snap updates'],
      ['sudo snap refresh', 'Update all snaps now'],
      ['sudo snap refresh firefox --channel=latest/beta', 'Switch a snap to another channel'],
      ['sudo snap revert firefox', 'Roll back to the previous revision'],
      ['sudo snap refresh --hold=72h firefox', 'Pause updates of one snap for 3 days'],
      ['sudo snap refresh --hold', 'Hold all refreshes indefinitely'],
      ['sudo snap refresh --unhold', 'Resume automatic refreshes'],
      ['snap refresh --time', 'Refresh schedule and next run'],
      ['sudo snap set system refresh.timer=fri,23:00-01:00', 'Refresh only during a window'],
      ['snap changes', 'History of snap operations']
    ],
    flags: [['--list', 'Show available updates', 'snap'], ['--hold[=duration]', 'Pause refreshes', 'snap'], ['--unhold', 'Resume refreshes', 'snap'], ['--time', 'Show schedule', 'snap'], ['refresh.timer', 'System refresh window', 'snap'], ['refresh.retain', 'Revisions to keep (2–20)', 'snap'], ['refresh.metered=hold', 'Pause on metered connections', 'snap']],
    demo: ['snap refresh --time', 'timer: 00:00~24:00/4\nlast: today at 06:12 +03\nnext: today at 11:40 +03'],
    tips: ['Desktop apps that are running get a notification and refresh when you close them ("refresh-app-awareness").'] },
  { id: 'confinement', title: 'Interfaces & confinement', intro: 'Permissions, services and data.',
    cmds: [
      ['snap connections vlc', 'Which interfaces a snap uses'],
      ['sudo snap connect vlc:removable-media', 'Allow access to /media and /mnt'],
      ['sudo snap disconnect vlc:camera', 'Revoke an interface'],
      ['snap services', 'Services provided by snaps'],
      ['sudo snap restart lxd.daemon', 'Restart a snap service'],
      ['sudo snap logs -n 50 lxd', 'Last 50 log lines of a snap'],
      ['snap saved', 'Automatic snapshots of removed snaps'],
      ['sudo snap save firefox', 'Snapshot a snap\'s data'],
      ['ls ~/snap/firefox/common', 'Per-user data directory of a snap']
    ],
    flags: [['strict', 'Fully confined; access through interfaces'], ['classic', 'Unconfined, like a deb'], ['devmode', 'Confinement violations only logged'], ['home', 'Interface: non-hidden files in $HOME'], ['removable-media', 'Interface: /media, /mnt, /run/media'], ['personal-files', 'Interface: specific dotfiles']],
    demo: ['snap connections vlc', 'Interface          Plug                   Slot                Notes\naudio-playback     vlc:audio-playback     :audio-playback     -\naudio-record       vlc:audio-record       -                   -\ncamera             vlc:camera             -                   -\ndesktop            vlc:desktop            :desktop            -\nhome               vlc:home               :home               -\nnetwork            vlc:network            :network            -\nopengl             vlc:opengl             :opengl             -\noptical-drive      vlc:optical-drive      :optical-drive      -\nremovable-media    vlc:removable-media    -                   -\nwayland            vlc:wayland            :wayland            -'],
    tips: ['GNOME Settings → Apps shows the same snap permissions as toggles.'] }
]});

UB.sec({ id: 'flatpak', title: 'Flatpak', icon: '📥', desc: 'Sandboxed desktop apps from Flathub — not preinstalled on Ubuntu, but easy to add.', cards: [
  { id: 'setup', title: 'Set up Flathub', intro: 'Install flatpak and add the Flathub remote.',
    cmds: [
      ['sudo apt install flatpak', 'Install Flatpak'],
      ['sudo apt install gnome-software-plugin-flatpak', 'Optional: Flatpak support in GNOME Software (deb version)'],
      ['flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo', 'Add Flathub system-wide'],
      ['flatpak remotes', 'Configured remotes'],
      ['flatpak --version', 'Flatpak version', 'Flatpak 1.16.1']
    ],
    flags: [['--if-not-exists', 'No error if remote exists', 'flatpak'], ['--user', 'Per-user remote/install', 'flatpak'], ['--system', 'System-wide (default)', 'flatpak']],
    demo: ['flatpak remotes', 'Name    Options\nflathub system'],
    tips: ['Log out and back in after adding Flathub so app icons appear in the launcher.'],
    warn: ['Ubuntu\'s "App Center" is a snap store only — Flatpak apps appear in GNOME Software, not App Center.'] },
  { id: 'use', title: 'Install, run, update', intro: 'Daily Flatpak workflow.',
    cmds: [
      ['flatpak search obs', 'Search remotes'],
      ['flatpak install flathub com.obsproject.Studio', 'Install an app'],
      ['flatpak run com.obsproject.Studio', 'Run an app from the terminal'],
      ['flatpak list --app', 'Installed applications'],
      ['flatpak update -y', 'Update all apps and runtimes'],
      ['flatpak uninstall com.obsproject.Studio', 'Remove an app'],
      ['flatpak uninstall --unused', 'Remove runtimes nothing uses'],
      ['flatpak uninstall --delete-data org.gimp.GIMP', 'Remove app and its ~/.var/app data']
    ],
    flags: [['-y', 'Assume yes'], ['--app', 'Only apps (list)'], ['--runtime', 'Only runtimes (list)'], ['--unused', 'Unused refs (uninstall)'], ['--delete-data', 'Also delete app data'], ['--columns=application,version', 'Choose list columns']],
    demo: ['flatpak install flathub com.obsproject.Studio', 'Looking for matches…\nRequired runtime for com.obsproject.Studio/x86_64/stable (runtime/org.kde.Platform/x86_64/6.9) found in remote flathub\nDo you want to install it? [Y/n]: y\n\ncom.obsproject.Studio permissions:\n    ipc     network     pulseaudio     wayland     x11     devices\n    file access [1]     dbus access [2]\n\n        ID                                   Branch    Op   Remote    Download\n 1. [✓] org.kde.Platform                     6.9       i    flathub   356.4 MB / 361.0 MB\n 2. [✓] com.obsproject.Studio                stable    i    flathub   118.2 MB / 120.9 MB\n\nInstallation complete.'] },
  { id: 'perm', title: 'Permissions with overrides', intro: 'Tighten or loosen a sandbox.',
    cmds: [
      ['flatpak info --show-permissions org.gimp.GIMP', 'Current sandbox permissions'],
      ['flatpak override --user --filesystem=~/Pictures org.gimp.GIMP', 'Grant access to a folder'],
      ['flatpak override --user --nofilesystem=home org.gimp.GIMP', 'Revoke home access'],
      ['flatpak override --user --show org.gimp.GIMP', 'Show your overrides'],
      ['flatpak override --user --reset org.gimp.GIMP', 'Remove all overrides'],
      ['flatpak install flathub com.github.tchx84.Flatseal', 'GUI permission manager']
    ],
    flags: [['--filesystem=<path>[:ro]', 'Grant access (optionally read-only)'], ['--nofilesystem=<path>', 'Revoke access'], ['--socket=<s>', 'Allow socket (wayland, x11, pulseaudio)'], ['--nosocket=<s>', 'Deny socket'], ['--env=K=V', 'Set environment variable'], ['--device=<d>', 'Allow device (dri, all)'], ['--reset', 'Drop overrides']],
    demo: ['flatpak override --user --show org.gimp.GIMP', '[Context]\nfilesystems=~/Pictures;!home;'] }
]});

UB.sec({ id: 'files', title: 'Files', icon: '🗂️', desc: 'Copy, move, find, compress and secure files.', cards: [
  { id: 'manage', title: 'Create, copy, move, delete', intro: 'Core file operations.',
    cmds: [
      ['mkdir -p ~/projects/demo/src', 'Create nested directories'],
      ['touch notes.txt', 'Create an empty file / update its time'],
      ['cp -a ~/Documents /mnt/backup/', 'Copy preserving everything (recursive)'],
      ['cp -i report.pdf ~/Desktop/', 'Copy, ask before overwriting'],
      ['mv old.txt new.txt', 'Rename or move'],
      ['rm -i *.log', 'Delete with confirmation'],
      ['rm -rf build/', 'Delete a directory tree (no undo!)'],
      ['gio trash old-draft.odt', 'Move to Trash instead of deleting'],
      ['ln -s /opt/app/bin/app ~/.local/bin/app', 'Create a symbolic link']
    ],
    flags: [['-p', 'Create parents (mkdir)', 'mkdir'], ['-a', 'Archive mode (cp)', 'cp'], ['-r, -R', 'Recursive', 'cp'], ['-i', 'Interactive prompt', 'cp'], ['-n', 'Never overwrite', 'cp'], ['-v', 'Verbose', 'cp'], ['-u', 'Copy only when newer', 'cp'], ['-f', 'Force, no prompts', 'rm']],
    demo: ['mkdir -p ~/projects/demo/src', ''],
    warn: ['`rm -rf` has no Trash. Double-check the path; a stray space in `rm -rf / tmp` is catastrophic.'] },
  { id: 'view', title: 'View & compare', intro: 'Read files without an editor.',
    cmds: [
      ['cat /etc/hostname', 'Print a file', 'ubuntu'],
      ['less /var/log/syslog', 'Page through a long file (q to quit)'],
      ['head -n 20 data.csv', 'First 20 lines'],
      ['tail -f /var/log/nginx/access.log', 'Follow a growing file'],
      ['wc -l data.csv', 'Count lines', '15872 data.csv'],
      ['diff -u a.conf b.conf', 'Unified diff of two files'],
      ['file photo.heic', 'Detect a file\'s type', 'photo.heic: ISO Media, HEIF Image HEVC Main or Main Still Picture Profile'],
      ['stat notes.txt', 'Size, permissions, timestamps, inode']
    ],
    flags: [['-n <N>', 'Number of lines', 'head'], ['-f', 'Follow appended data', 'tail'], ['-F', 'Follow and retry after rotation', 'tail'], ['-u', 'Unified diff', 'diff'], ['-r', 'Recursive diff', 'diff']],
    demo: ['stat notes.txt', '  File: notes.txt\n  Size: 2048      \tBlocks: 8          IO Block: 4096   regular file\nDevice: 259,2\tInode: 1835342     Links: 1\nAccess: (0644/-rw-r--r--)  Uid: ( 1000/     ssk)   Gid: ( 1000/     ssk)\nAccess: 2026-10-03 09:20:41.112003924 +0300\nModify: 2026-10-03 09:20:38.904118223 +0300\nChange: 2026-10-03 09:20:38.904118223 +0300\n Birth: 2026-09-21 14:02:11.410287313 +0300'] },
  { id: 'find', title: 'Find files & text', intro: 'find, locate, grep and ripgrep.',
    cmds: [
      ['find ~ -iname "*.pdf" -mtime -7', 'PDFs changed in the last week'],
      ['find /var/log -type f -size +100M', 'Files bigger than 100 MB'],
      ['find . -name "*.tmp" -delete', 'Delete matching files'],
      ['find . -type f -name "*.sh" -exec chmod +x {} +', 'Run a command on every match'],
      ['grep -rn "PermitRootLogin" /etc/ssh/', 'Search text recursively with line numbers'],
      ['grep -i error -C 2 app.log', 'Case-insensitive match with context'],
      ['sudo apt install plocate', 'Fast filename index (locate)'],
      ['locate -i sshd_config', 'Instant filename search via index'],
      ['rg "TODO" --type py', 'ripgrep: fast code search (apt install ripgrep)'],
      ['fdfind -e jpg', 'fd: friendly find (apt install fd-find)']
    ],
    flags: [['-name / -iname', 'Name pattern', 'find'], ['-type f|d', 'Files or directories', 'find'], ['-mtime -N', 'Modified within N days', 'find'], ['-size +N', 'Bigger than', 'find'], ['-r', 'Recursive', 'grep'], ['-n', 'Line numbers', 'grep'], ['-i', 'Ignore case', 'grep'], ['-l', 'Only file names', 'grep']],
    demo: ['grep -rn "PermitRootLogin" /etc/ssh/', '/etc/ssh/sshd_config:33:#PermitRootLogin prohibit-password\n/etc/ssh/sshd_config.d/50-cloud-init.conf:2:PermitRootLogin no'] },
  { id: 'perms', title: 'Permissions & ownership', intro: 'chmod, chown, ACLs and umask.',
    cmds: [
      ['chmod 640 secret.conf', 'Owner rw, group r, others nothing'],
      ['chmod u+x deploy.sh', 'Make a script executable'],
      ['chmod -R g+rwX shared/', 'Group read/write, X only on dirs'],
      ['sudo chown -R www-data:www-data /var/www/site', 'Change owner and group recursively'],
      ['setfacl -m u:alice:rx ~/shared', 'Give one user access with an ACL'],
      ['getfacl ~/shared', 'Show ACLs'],
      ['umask', 'Default permission mask', '0002'],
      ['sudo chattr +i /etc/resolv.conf', 'Make a file immutable']
    ],
    flags: [['r=4 w=2 x=1', 'Octal permission values'], ['u g o a', 'User, group, others, all'], ['+ - =', 'Add, remove, set'], ['X', 'Execute only for directories/already-executable'], ['-R', 'Recursive'], ['s (setuid/setgid)', 'Run as owner / inherit group']],
    demo: ['getfacl ~/shared', '# file: home/ssk/shared\n# owner: ssk\n# group: ssk\nuser::rwx\nuser:alice:r-x\ngroup::r-x\nmask::r-x\nother::---'] },
  { id: 'archive', title: 'Archives & compression', intro: 'tar, zip, zstd, 7z.',
    cmds: [
      ['tar -czvf site.tar.gz /var/www/site', 'Create a gzip tarball'],
      ['tar --zstd -cf home.tar.zst ~/Documents', 'Create a zstd tarball (fast, small)'],
      ['tar -xvf archive.tar.xz -C /tmp/out', 'Extract (compression auto-detected) into a dir'],
      ['tar -tf archive.tar.gz', 'List contents'],
      ['zip -r photos.zip Pictures/', 'Create a zip'],
      ['unzip photos.zip -d ~/restore', 'Extract a zip'],
      ['7z x backup.7z', 'Extract 7z (apt install 7zip)'],
      ['zstd -19 big.log', 'Compress a single file with zstd']
    ],
    flags: [['-c / -x / -t', 'Create / extract / list', 'tar'], ['-z / -j / -J / --zstd', 'gzip / bzip2 / xz / zstd', 'tar'], ['-v', 'Verbose', 'tar'], ['-f <file>', 'Archive file name', 'tar'], ['-C <dir>', 'Target directory', 'tar'], ['-r', 'Recurse (zip)', 'zip']],
    demo: ['tar -czvf site.tar.gz /var/www/site', 'tar: Removing leading `/\' from member names\n/var/www/site/\n/var/www/site/index.html\n/var/www/site/css/\n/var/www/site/css/style.css\n/var/www/site/img/logo.svg'],
    tips: ['The 7-Zip package is `7zip` (provides `7z`); older guides mention `p7zip-full`.'] }
]});

UB.sec({ id: 'users', title: 'Users', icon: '👥', desc: 'Accounts, groups, passwords and admin rights.', cards: [
  { id: 'accounts', title: 'Create & remove users', intro: 'adduser (friendly) vs useradd (low level).',
    cmds: [
      ['sudo adduser alice', 'Create a user with home, password prompt and defaults'],
      ['sudo useradd -m -s /bin/bash -G sudo bob', 'Low-level create with home, shell and group'],
      ['sudo passwd bob', 'Set or change a password'],
      ['sudo usermod -aG sudo alice', 'Give admin rights (append to sudo group)'],
      ['sudo deluser --remove-home bob', 'Delete a user and their home'],
      ['sudo usermod -L alice', 'Lock an account'],
      ['sudo chage -l alice', 'Password ageing info'],
      ['getent passwd alice', 'Show a user record', 'alice:x:1001:1001:Alice Smith,,,:/home/alice:/bin/bash']
    ],
    flags: [['-m', 'Create home directory', 'useradd'], ['-s <shell>', 'Login shell', 'useradd'], ['-G <groups>', 'Supplementary groups', 'useradd'], ['-aG', 'Append to groups (never omit -a!)', 'usermod'], ['-L / -U', 'Lock / unlock', 'usermod'], ['--remove-home', 'Delete home dir', 'deluser']],
    demo: ['sudo adduser alice', 'info: Adding user `alice\' ...\ninfo: Selecting UID/GID from range 1000 to 59999 ...\ninfo: Adding new group `alice\' (1001) ...\ninfo: Adding new user `alice\' (1001) with group `alice (1001)\' ...\ninfo: Creating home directory `/home/alice\' ...\ninfo: Copying files from `/etc/skel\' ...\nNew password: \nRetype new password: \npasswd: password updated successfully\nChanging the user information for alice\nEnter the new value, or press ENTER for the default\n\tFull Name []: Alice Smith\nIs the information correct? [Y/n] y\ninfo: Adding new user `alice\' to supplemental / extra groups `users\' ...'],
    warn: ['`usermod -G sudo alice` without `-a` REPLACES all of Alice\'s groups.'] },
  { id: 'groups', title: 'Groups', intro: 'Membership controls device and service access.',
    cmds: [
      ['groups', 'Your groups', 'ssk adm cdrom sudo dip plugdev users lpadmin'],
      ['id alice', 'UID, GID and groups of a user'],
      ['sudo groupadd devs', 'Create a group'],
      ['sudo gpasswd -a alice devs', 'Add a user to a group'],
      ['sudo gpasswd -d alice devs', 'Remove a user from a group'],
      ['newgrp docker', 'Use a new group in this shell without logging out'],
      ['getent group sudo', 'Members of a group', 'sudo:x:27:ssk,alice']
    ],
    flags: [['sudo', 'Administrators'], ['adm', 'Read /var/log'], ['docker', 'Use Docker (root-equivalent!)'], ['lxd', 'Use LXD (root-equivalent!)'], ['libvirt', 'Manage VMs'], ['dialout', 'Serial ports (Arduino, modems)'], ['plugdev', 'Removable devices']],
    demo: ['id alice', 'uid=1001(alice) gid=1001(alice) groups=1001(alice),27(sudo),100(users),1002(devs)'],
    tips: ['Group changes apply at the next login (or use `newgrp`).'] },
  { id: 'session', title: 'Who is logged in', intro: 'Sessions, logins and switching users.',
    cmds: [
      ['who', 'Logged-in users'],
      ['w', 'Users and what they are running'],
      ['last -n 10', 'Recent logins'],
      ['loginctl list-sessions', 'systemd-logind sessions'],
      ['su - alice', 'Switch to another user (needs their password)'],
      ['sudo loginctl terminate-user bob', 'Log a user out'],
      ['sudo lastb -n 5', 'Recent failed logins']
    ],
    flags: [['-n <N>', 'Number of entries', 'last'], ['-a', 'Hostname in last column', 'last'], ['-', 'Login shell (su -)', 'su']],
    demo: ['w', ' 09:44:10 up  2:31,  2 users,  load average: 0.42, 0.37, 0.30\nUSER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU  WHAT\nssk      seat0    -                07:13    2:31m  0.00s  0.01s /usr/libexec/gdm-wayland-session\nssk      pts/1    192.168.1.24     09:40    0.00s  0.04s  0.00s w'] }
]});
