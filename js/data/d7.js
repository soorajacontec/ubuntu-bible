/* v1.1 — more tools: Basics → Disk */
UB.add('basics', [
  { id: 'utils', title: 'Everyday utilities', intro: 'Dates, maths, calendars and repeating commands.',
    cmds: [
      ['date "+%Y-%m-%d %H:%M"', 'Current date in a custom format', '2026-10-10 11:24'],
      ['date -d "next friday"', 'Date arithmetic in plain English', 'Fri Oct 16 00:00:00 +03 2026'],
      ['cal -3', 'Previous, current and next month', '   September 2026         October 2026         November 2026\nSu Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa\n       1  2  3  4  5               1  2  3   1  2  3  4  5  6  7\n 6  7  8  9 10 11 12   4  5  6  7  8  9 10   8  9 10 11 12 13 14\n13 14 15 16 17 18 19  11 12 13 14 15 16 17  15 16 17 18 19 20 21\n20 21 22 23 24 25 26  18 19 20 21 22 23 24  22 23 24 25 26 27 28\n27 28 29 30           25 26 27 28 29 30 31  29 30'],
      ['echo "scale=3; 22/7" | bc', 'Calculator with decimals', '3.142'],
      ['seq 1 5', 'Print a sequence of numbers', '1\n2\n3\n4\n5'],
      ['factor 2026', 'Prime factors', '2026: 2 1013'],
      ['watch -n 2 free -h', 'Re-run a command every 2 seconds (Ctrl+C to stop)', 'Every 2.0s: free -h                         ubuntu: Sat Oct 10 11:24:31 2026\n\n               total        used        free      shared  buff/cache   available\nMem:            15Gi       6.1Gi       2.4Gi       790Mi       7.5Gi       9.2Gi\nSwap:          4.0Gi       488Mi       3.5Gi'],
      ['uptime -p', 'Pretty uptime', 'up 3 hours, 11 minutes'],
      ['units "60 mph" "km/h"', 'Unit conversion (apt install units)', '\t* 96.56064\n\t/ 0.010356187']
    ],
    flags: [['+%Y-%m-%d', 'Output format', 'date'], ['-d <text>', 'Describe a date', 'date'], ['-u', 'UTC', 'date'], ['-3', 'Three months', 'cal'], ['-y', 'Whole year', 'cal'], ['-l', 'Math library (bc)', 'bc'], ['-n <sec>', 'Interval', 'watch'], ['-d', 'Highlight differences', 'watch']],
    demo: ['date -d "next friday"', 'Fri Oct 16 00:00:00 +03 2026'],
    tips: ['`watch -d` highlights what changed between refreshes — great with `ip -br a` or `df -h`.'] },
  { id: 'sysinfo', title: 'System summary tools', intro: 'fastfetch, inxi and friends.',
    cmds: [
      ['sudo apt install fastfetch', 'Install fastfetch (neofetch successor)'],
      ['fastfetch', 'Logo plus OS, kernel, DE, CPU, GPU and memory'],
      ['fastfetch --logo none', 'Text only, no ASCII logo'],
      ['sudo apt install hwinfo', 'Detailed hardware probe'],
      ['hwinfo --short', 'One line per device'],
      ['cat /proc/meminfo | head -3', 'Kernel memory counters', 'MemTotal:       16112404 kB\nMemFree:         2489012 kB\nMemAvailable:    9618220 kB']
    ],
    flags: [['--logo none', 'Hide logo', 'fastfetch'], ['-c <preset>', 'Use a config preset (e.g. all)', 'fastfetch'], ['--gen-config', 'Write ~/.config/fastfetch/config.jsonc', 'fastfetch'], ['--short', 'Brief output', 'hwinfo']],
    demo: ['fastfetch', '                             .-/+oossssoo+/-.               ssk@ubuntu\n                         `:+ssssssssssssssssss+:`           ----------\n                       -+ssssssssssssssssssyyssss+-         OS: Ubuntu 26.04.1 LTS x86_64\n                     .ossssssssssssssssssdMMMNysssso.       Host: ThinkPad T14 Gen 5\n                   /ssssssssssshdmmNNmmyNMMMMhssssss/      Kernel: Linux 7.0.0-14-generic\n                  +ssssssssshmydMMMMMMMNddddyssssssss+     Uptime: 3 hours, 11 mins\n                 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Packages: 2187 (dpkg), 11 (snap), 3 (flatpak)\n                .ssssssssdMMMNhsssssssssshNMMMdssssssss.   Shell: bash 5.3.3\n                +sssshhhyNMMNyssssssssssssyNMMMysssssss+   DE: GNOME 50.1\n                ossyNMMMNyMMhsssssssssssssshmmmhssssssso   WM: Mutter (Wayland)\n                ossyNMMMNyMMhsssssssssssssshmmmhssssssso   Terminal: Ptyxis 49.1\n                +sssshhhyNMMNyssssssssssssyNMMMysssssss+   CPU: Intel(R) Core(TM) Ultra 7 155U (14) @ 4.80 GHz\n                .ssssssssdMMMNhsssssssssshNMMMdssssssss.   GPU 1: NVIDIA GeForce RTX 4050 Max-Q / Mobile\n                 /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/    GPU 2: Intel Arc Graphics [Integrated]\n                  +sssssssssdmydMMMMMMMMddddyssssssss+     Memory: 6.08 GiB / 15.37 GiB (40%)\n                   /ssssssssssshdmNNNNmyNMMMMhssssss/      Disk (/): 401.12 GiB / 467.89 GiB (86%) - ext4\n                    .ossssssssssssssssssdMMMNysssso.       Battery: 81% [Discharging]\n                      -+sssssssssssssssssyyyssss+-         Locale: en_US.UTF-8'],
    tips: ['neofetch is unmaintained; fastfetch reads the same info faster and is in the 26.04 archive.'] }
]);

UB.add('troubleshoot', [
  { id: 'netfix', title: 'No internet / Wi-Fi problems', intro: 'Work up the stack: link → IP → route → DNS.',
    cmds: [
      ['nmcli device status', 'Is the interface connected?', 'DEVICE           TYPE      STATE                   CONNECTION\nwlp0s20f3        wifi      connected               HomeNet\nenp0s31f6        ethernet  unavailable             --\nlo               loopback  connected (externally)  lo'],
      ['ping -c 3 192.168.1.1', 'Can you reach the router?'],
      ['ping -c 3 1.1.1.1', 'Can you reach the internet by IP?'],
      ['resolvectl query ubuntu.com', 'Does DNS work?'],
      ['sudo systemctl restart NetworkManager', 'Restart networking (desktop)'],
      ['rfkill list', 'Is Wi-Fi/Bluetooth hard- or soft-blocked?', '0: hci0: Bluetooth\n\tSoft blocked: no\n\tHard blocked: no\n1: phy0: Wireless LAN\n\tSoft blocked: yes\n\tHard blocked: no'],
      ['sudo rfkill unblock wifi', 'Unblock Wi-Fi', ''],
      ['sudo dmesg | grep -i iwlwifi', 'Wi-Fi driver/firmware messages', '[    4.112047] iwlwifi 0000:00:14.3: Detected Intel(R) Wi-Fi 7 BE200 160MHz\n[    4.130511] iwlwifi 0000:00:14.3: loaded firmware version 92.d8f2c3a1.0 bz-b0-fm-c0-92.ucode op_mode iwlmvm'],
      ['sudo apt install --reinstall linux-firmware', 'Repair missing firmware files']
    ],
    flags: [['list', 'Show block state', 'rfkill'], ['block / unblock <type>', 'wifi, bluetooth, all', 'rfkill'], ['status', 'Device overview', 'nmcli']],
    demo: [['rfkill list', '0: hci0: Bluetooth\n\tSoft blocked: no\n\tHard blocked: no\n1: phy0: Wireless LAN\n\tSoft blocked: yes\n\tHard blocked: no'], ['sudo rfkill unblock wifi', '']],
    tips: ['If ping 1.1.1.1 works but ubuntu.com fails, it is DNS — see Network › DNS.', '"Hard blocked: yes" means a physical switch or BIOS setting; software cannot fix it.'] },
  { id: 'collect', title: 'Collect diagnostics for support', intro: 'sos, apport and hardware reports.',
    cmds: [
      ['sudo apt install sosreport', 'Install the sos diagnostic collector'],
      ['sudo sos report', 'Bundle logs and config into a tarball for support'],
      ['sudo apport-cli -f -p nginx', 'File a bug from the terminal (no GUI)'],
      ['apport-collect 2091234', 'Attach your system info to an existing Launchpad bug'],
      ['sudo lshw -html > hardware.html', 'Full hardware report as HTML', ''],
      ['systemd-analyze dump > systemd-state.txt', 'Full systemd manager state', '']
    ],
    flags: [['--batch', 'No prompts', 'sos'], ['-o <plugins>', 'Only these plugins', 'sos'], ['--clean', 'Obfuscate hostnames/IPs', 'sos'], ['-f', 'File a new report', 'apport-cli'], ['-p <pkg>', 'Package', 'apport-cli']],
    demo: ['sudo sos report', 'sos report (version 4.10.0)\n\nThis command will collect diagnostic and configuration information from\nthis Ubuntu system and installed applications.\n\nPress ENTER to continue, or CTRL-C to quit.\n\nOptionally, please enter the case id that you are generating this report for []: \n\n Setting up archive ...\n Setting up plugins ...\n Running plugins. Please wait ...\n\n  Finished running plugins\nCreating compressed archive...\n\nYour sos report has been generated and saved in:\n\t/tmp/sosreport-ubuntu-2026-10-10-abcdefg.tar.xz\n\n Size\t18.42MiB\n Owner\troot\n sha256\t9f1e2d3c4b5a69788796a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4\n\nPlease send this file to your support representative.'],
    warn: ['sos reports contain hostnames, IPs and config. Use `--clean` before sharing outside your organisation.'] }
]);

UB.add('apt', [
  { id: 'helpers', title: 'APT helpers: nala, aptitude, needrestart', intro: 'Friendlier front ends and maintenance tools.',
    cmds: [
      ['sudo apt install nala', 'Install nala (parallel downloads, pretty output)'],
      ['sudo nala upgrade', 'Update lists and upgrade in one step'],
      ['sudo nala fetch', 'Benchmark and choose the fastest mirrors'],
      ['nala history', 'Numbered transaction history', 'ID  Command                     Date and Time        Altered  Requested-By\n1   install htop                2026-10-03 09:31:12  1        ssk (1000)\n2   upgrade                     2026-10-05 18:04:55  14       ssk (1000)\n3   install vlc ffmpeg          2026-10-09 20:11:40  41       ssk (1000)'],
      ['sudo nala history undo 3', 'Roll back a nala transaction'],
      ['sudo apt install aptitude', 'Classic ncurses package manager'],
      ['aptitude why libfuse2t64', 'Dependency chain that pulls a package in', 'i   appimagelauncher Depends libfuse2t64 (>= 2.9.9)'],
      ['sudo needrestart -r l', 'Services/processes still using old libraries (list only)'],
      ['sudo debsums -s', 'Verify installed files against package checksums (errors only)'],
      ['sudo apt install synaptic', 'Synaptic graphical package manager']
    ],
    flags: [['upgrade', 'update + upgrade', 'nala'], ['fetch', 'Mirror selection', 'nala'], ['history undo <id>', 'Revert', 'nala'], ['-r l|i|a', 'Restart mode: list, interactive, automatic', 'needrestart'], ['-k', 'Only check the kernel', 'needrestart'], ['-s', 'Silent — only report errors', 'debsums'], ['-c', 'List changed files', 'debsums']],
    demo: ['sudo needrestart -r l', 'Scanning processes...\nScanning candidates...\nScanning processor microcode...\nScanning linux images...\n\nRunning kernel seems to be up-to-date.\n\nThe processor microcode seems to be up-to-date.\n\nRestarting services...\n\nService restarts being deferred:\n systemctl restart NetworkManager.service\n systemctl restart cron.service\n systemctl restart ssh.service\n\nNo containers need to be restarted.\n\nUser sessions running outdated binaries:\n ssk @ session #2: gnome-shell[2214]\n\nNo VM guests are running outdated hypervisor (qemu) binaries on this host.'],
    tips: ['needrestart runs automatically after apt on Ubuntu Server and asks which services to restart.'] },
  { id: 'patterns', title: 'APT search patterns', intro: 'Query installed packages with ?patterns.',
    cmds: [
      ['apt list "?garbage"', 'Packages autoremove would remove'],
      ['apt list "?config-files"', 'Removed packages that left config behind', 'Listing...\nlibpython3.12-stdlib/now 3.12.3-1ubuntu0.8 amd64 [residual-config]\nnginx-common/now 1.24.0-2ubuntu7.5 all [residual-config]'],
      ['sudo apt purge "?config-files"', 'Purge all leftover config'],
      ['apt list "?installed ?section(games)"', 'Installed packages in a section'],
      ['apt list "?upgradable ?origin(Ubuntu)"', 'Upgradable from Ubuntu only'],
      ['apt list "?narrow(?installed, ?not(?origin(Ubuntu)))"', 'Installed packages not from Ubuntu', 'Listing...\ncode/stable,now 1.105.0-1759333218 amd64 [installed]\ndocker-ce/resolute,now 5:29.0.1-1~ubuntu.26.04~resolute amd64 [installed]\ngoogle-chrome-stable/stable,now 141.0.7390.65-1 amd64 [installed]']
    ],
    flags: [['?installed (~i)', 'Installed'], ['?upgradable (~U)', 'Has upgrade'], ['?garbage (~g)', 'Auto-removable'], ['?config-files (~c)', 'Residual config'], ['?obsolete (~o)', 'Not in any repo'], ['?automatic (~M)', 'Auto-installed'], ['?name(regex) (~n)', 'Name matches'], ['?origin(x)', 'Repository origin'], ['?not(…) (!)', 'Negate']],
    demo: ['apt list "?garbage"', 'Listing...\nlibllvm20/resolute,now 1:20.1.8-0ubuntu4 amd64 [installed,auto-removable]\nlinux-headers-7.0.0-12-generic/resolute-updates,now 7.0.0-12.12 amd64 [installed,auto-removable]\nlinux-image-7.0.0-12-generic/resolute-updates,now 7.0.0-12.12 amd64 [installed,auto-removable]'] }
]);

UB.add('snap', [
  { id: 'advanced', title: 'Advanced snap tools', intro: 'Assertions, offline installs, shells and the App Center.',
    cmds: [
      ['snap version', 'snapd, series and kernel', 'snap    2.71\nsnapd   2.71\nseries  16\nubuntu  26.04\nkernel  7.0.0-14-generic\narchitecture amd64'],
      ['snap download hello-world', 'Download a .snap and its .assert for offline use', 'Fetching snap "hello-world"\nFetching assertions for "hello-world"\nInstall the snap with:\n   snap ack hello-world_29.assert\n   snap install hello-world_29.snap'],
      ['sudo snap ack hello-world_29.assert', 'Trust the downloaded assertion', ''],
      ['sudo snap install hello-world_29.snap', 'Install the offline snap (signed, no --dangerous)', 'hello-world 6.4 from Canonical✓ installed'],
      ['snap run --shell vlc', 'Open a shell inside a snap\'s confinement (debugging)'],
      ['snap aliases', 'Command aliases provided by snaps', 'Command          Alias  Notes\nlxd.lxc          lxc    -\nmicrok8s.kubectl kubectl manual'],
      ['snap warnings', 'Pending snapd warnings', 'No warnings.'],
      ['snap model', 'Device model assertion (brand, grade)', 'brand   canonical✓\nmodel   generic-classic\nserial  -- (device not registered yet)'],
      ['snap-store', 'Open App Center (Ubuntu\'s software store)']
    ],
    flags: [['download', 'Fetch .snap + .assert', 'snap'], ['ack', 'Add an assertion', 'snap'], ['run --shell', 'Shell in confinement', 'snap'], ['aliases', 'List aliases', 'snap'], ['--basename=<name>', 'Name downloaded files', 'snap']],
    demo: ['snap version', 'snap    2.71\nsnapd   2.71\nseries  16\nubuntu  26.04\nkernel  7.0.0-14-generic\narchitecture amd64'],
    tips: ['Offline installs: download on a connected machine, copy both files, then `snap ack` + `snap install`.'] }
]);

UB.add('flatpak', [
  { id: 'maint', title: 'Maintenance, downgrade & debugging', intro: 'History, repair and pinning versions.',
    cmds: [
      ['flatpak history', 'Install/update history', 'Time                    Change    Application                   Branch   Installation  Remote\nOct  3 09:52:11         deploy    org.kde.Platform              6.9      system        flathub\nOct  3 09:52:40         deploy    com.obsproject.Studio         stable   system        flathub\nOct  8 18:20:02         deploy    org.gimp.GIMP                 stable   system        flathub'],
      ['sudo flatpak repair', 'Verify and fix the installation', 'Working on the system installation at /var/lib/flatpak\n[1/48] Verifying flathub:app/org.gimp.GIMP/x86_64/stable…\n…\nChecking remotes...\nPruning objects\nErasing .removed'],
      ['flatpak ps', 'Running Flatpak sandboxes', 'Instance   PID   Application              Runtime\n1835071482 7012  org.gimp.GIMP            org.gnome.Platform'],
      ['flatpak kill org.gimp.GIMP', 'Stop a running app', ''],
      ['flatpak remote-info --log flathub org.gimp.GIMP', 'Commit history of an app (to pick an older one)', '        ID: org.gimp.GIMP\n       Ref: app/org.gimp.GIMP/x86_64/stable\n    Commit: 4a1b2c3d4e5f…\n   Version: 3.0.6\n\n    Commit: 9f8e7d6c5b4a…\n   Subject: Update to 3.0.4\n      Date: 2026-06-02 11:22:14 +0000'],
      ['sudo flatpak update --commit=9f8e7d6c5b4a org.gimp.GIMP', 'Downgrade to a specific commit'],
      ['flatpak mask org.gimp.GIMP', 'Stop updates for an app', ''],
      ['flatpak mask --remove org.gimp.GIMP', 'Allow updates again', ''],
      ['flatpak run --command=sh org.gimp.GIMP', 'Shell inside the app sandbox']
    ],
    flags: [['--log', 'Show commit history', 'flatpak'], ['--commit=<hash>', 'Deploy a specific commit', 'flatpak'], ['--remove', 'Unmask', 'flatpak'], ['--command=<cmd>', 'Run another command in the sandbox', 'flatpak'], ['--devel', 'Use the SDK (debugging)', 'flatpak']],
    demo: ['flatpak ps', 'Instance   PID   Application              Runtime\n1835071482 7012  org.gimp.GIMP            org.gnome.Platform'] }
]);

UB.add('files', [
  { id: 'modern', title: 'Modern CLI file tools', intro: 'bat, eza, fzf, zoxide, duf, trash-cli.',
    cmds: [
      ['sudo apt install bat eza fzf zoxide duf trash-cli', 'Install the modern toolkit'],
      ['batcat app.py', 'cat with syntax highlighting (binary is batcat on Ubuntu)'],
      ['eza -la --git --icons', 'ls with git status and icons'],
      ['eza --tree --level=2', 'Tree view'],
      ['fzf', 'Fuzzy-find a file interactively (Ctrl+R in bash after setup)'],
      ['z proj', 'Jump to a frequently used directory (after zoxide init)'],
      ['duf', 'Colourful disk-usage overview'],
      ['trash-put old.log', 'Move to Trash from the terminal', ''],
      ['trash-list', 'What is in the Trash', '2026-10-09 20:14:02 /home/ssk/old.log\n2026-10-05 08:41:19 /home/ssk/Documents/draft-v1.odt'],
      ['trash-restore', 'Restore interactively'],
      ['rename \'s/\\.jpeg$/.jpg/\' *.jpeg', 'Bulk rename with a Perl regex (apt install rename)', ''],
      ['mc', 'Midnight Commander two-pane file manager']
    ],
    flags: [['-la', 'Long, all (eza)', 'eza'], ['--git', 'Git status column', 'eza'], ['--tree', 'Tree', 'eza'], ['-p', 'Plain output (bat)', 'batcat'], ['-l <lang>', 'Force language', 'batcat'], ['-n', 'Dry run (rename)', 'rename'], ['eval "$(zoxide init bash)"', 'Enable z in ~/.bashrc', 'zoxide']],
    demo: ['duf', '╭──────────────────────────────────────────────────────────────────────────────╮\n│ 2 local devices                                                              │\n├────────────┬────────┬────────┬────────┬───────────────────────┬──────┬───────┤\n│ MOUNTED ON │   SIZE │   USED │  AVAIL │          USE%         │ TYPE │ FS    │\n├────────────┼────────┼────────┼────────┼───────────────────────┼──────┼───────┤\n│ /          │ 467.9G │ 401.1G │  43.0G │ [#################...]  85.7% │ ext4 │ /dev/nvme0n1p2 │\n│ /boot/efi  │   1.0G │   6.2M │   1.0G │ [....................]   0.6% │ vfat │ /dev/nvme0n1p1 │\n╰────────────┴────────┴────────┴────────┴───────────────────────┴──────┴───────╯'],
    tips: ['Add `alias cat=batcat` and `alias ls=eza` to ~/.bash_aliases if you like them.'] },
  { id: 'checksums', title: 'Checksums, binary & secure delete', intro: 'Verify, inspect and destroy data.',
    cmds: [
      ['sha256sum file.iso', 'SHA-256 checksum', '9f2c1e5b7d0a8e4f3c6b1a2d5e8f7c9b0a1d2e3f4c5b6a7d8e9f0a1b2c3d4e5f  file.iso'],
      ['b2sum file.iso', 'BLAKE2 checksum (fast)'],
      ['cmp a.bin b.bin', 'First differing byte between two files', 'a.bin b.bin differ: byte 4097, line 12'],
      ['xxd photo.jpg | head -3', 'Hex dump', '00000000: ffd8 ffe0 0010 4a46 4946 0001 0101 0048  ......JFIF.....H\n00000010: 0048 0000 ffdb 0043 0003 0202 0302 0203  .H.....C........\n00000020: 0303 0304 0303 0405 0805 0504 0404 050a  ................'],
      ['split -b 1G big.tar.zst part_', 'Split a file into 1 GB chunks', ''],
      ['cat part_* > big.tar.zst', 'Join chunks back together', ''],
      ['shred -u -n 3 secret.txt', 'Overwrite then delete a file (HDDs)', ''],
      ['strings app.bin | grep -i version', 'Readable text inside a binary', 'version 2.4.1\nVERSION_INFO']
    ],
    flags: [['-c <file>', 'Check sums from a file', 'sha256sum'], ['-b <size>', 'Chunk size', 'split'], ['-n <N>', 'Overwrite passes', 'shred'], ['-u', 'Delete after overwrite', 'shred'], ['-l <len>', 'Bytes to dump', 'xxd']],
    demo: ['xxd photo.jpg | head -3', '00000000: ffd8 ffe0 0010 4a46 4946 0001 0101 0048  ......JFIF.....H\n00000010: 0048 0000 ffdb 0043 0003 0202 0302 0203  .H.....C........\n00000020: 0303 0304 0303 0405 0805 0504 0404 050a  ................'],
    warn: ['`shred` is unreliable on SSDs and journaling/CoW filesystems. Use full-disk encryption, or `blkdiscard` for a whole SSD.'] }
]);

UB.add('users', [
  { id: 'policy', title: 'Passwords, renames & lockouts', intro: 'Password policy, faillock and renaming accounts.',
    cmds: [
      ['sudo apt install pwgen', 'Password generator'],
      ['pwgen -s 20 3', 'Three secure 20-character passwords', 'Xq7mR2vP9kLwT4zN8bYc  h3JfK9sQ2mW6pZ1xV7dR  aT5nY8cE2uB4qL7mK1sW'],
      ['sudo chage -M 90 -W 7 alice', 'Expire password every 90 days, warn 7 days before', ''],
      ['sudo apt install libpam-pwquality', 'Enforce password complexity'],
      ['sudo nano /etc/security/pwquality.conf', 'Set minlen, minclass, dictcheck…'],
      ['sudo faillock --user alice', 'Failed login records (when pam_faillock is enabled)', 'alice:\nWhen                Type  Source                                           Valid\n2026-10-10 09:12:44 RHOST 203.0.113.7                                          V'],
      ['sudo faillock --user alice --reset', 'Unlock after too many failures', ''],
      ['sudo usermod -l alicia -d /home/alicia -m alice', 'Rename a user and move their home', ''],
      ['sudo groupmod -n alicia alice', 'Rename their primary group too', '']
    ],
    flags: [['-s', 'Secure/random', 'pwgen'], ['-M <days>', 'Max age', 'chage'], ['-W <days>', 'Warning days', 'chage'], ['-E <date>', 'Account expiry', 'chage'], ['minlen = 12', 'Minimum length', 'pwquality.conf'], ['--reset', 'Clear failures', 'faillock'], ['-l <new>', 'New login name', 'usermod'], ['-d <dir> -m', 'Move home', 'usermod']],
    demo: ['pwgen -s 20 3', 'Xq7mR2vP9kLwT4zN8bYc  h3JfK9sQ2mW6pZ1xV7dR  aT5nY8cE2uB4qL7mK1sW'],
    warn: ['Rename users while they are logged out — use another admin account or a TTY.'] }
]);

UB.add('network', [
  { id: 'diag', title: 'Diagnostics: mtr, nmap, iperf3, tcpdump', intro: 'Measure, scan and capture traffic.',
    cmds: [
      ['sudo apt install mtr-tiny nmap iperf3 tcpdump netcat-openbsd', 'Install the network toolkit'],
      ['mtr -rwc 10 ubuntu.com', 'Traceroute + packet loss report'],
      ['nc -zv example.com 443', 'Is a TCP port open?', 'Connection to example.com (93.184.215.14) 443 port [tcp/https] succeeded!'],
      ['nmap -sV 192.168.1.10', 'Open ports and service versions on a host you own'],
      ['nmap -sn 192.168.1.0/24', 'Ping-scan your LAN for live hosts'],
      ['iperf3 -s', 'Start a throughput test server'],
      ['iperf3 -c 192.168.1.10', 'Measure bandwidth to that server'],
      ['sudo tcpdump -ni any port 53', 'Watch DNS packets live'],
      ['sudo tcpdump -i wlp0s20f3 -w capture.pcap', 'Save packets for Wireshark', 'tcpdump: listening on wlp0s20f3, link-type EN10MB (Ethernet), snapshot length 262144 bytes\n^C1842 packets captured\n1850 packets received by filter\n0 packets dropped by kernel'],
      ['sudo ethtool enp0s31f6', 'Link speed, duplex and driver of a NIC'],
      ['iw dev wlp0s20f3 link', 'Wi-Fi signal, bitrate and frequency']
    ],
    flags: [['-r -w -c N', 'Report, wide, N cycles', 'mtr'], ['-z -v', 'Scan only, verbose', 'nc'], ['-sn', 'Host discovery only', 'nmap'], ['-sV', 'Service versions', 'nmap'], ['-p <ports>', 'Port list', 'nmap'], ['-c <host>', 'Client mode', 'iperf3'], ['-R', 'Reverse direction', 'iperf3'], ['-n', 'No name resolution', 'tcpdump'], ['-i <iface>', 'Interface (any = all)', 'tcpdump'], ['-w <file>', 'Write pcap', 'tcpdump']],
    demo: [['mtr -rwc 10 ubuntu.com', 'Start: 2026-10-10T11:30:12+0300\nHOST: ubuntu                     Loss%   Snt   Last   Avg  Best  Wrst StDev\n  1.|-- _gateway                    0.0%    10    2.1   2.4   1.8   4.0   0.6\n  2.|-- 10.20.0.1                   0.0%    10    8.4   9.1   7.9  12.2   1.2\n  3.|-- ae1.core1.doh.example.net   0.0%    10   12.9  13.4  12.1  16.0   1.1\n  4.|-- ???                        100.0    10    0.0   0.0   0.0   0.0   0.0\n  5.|-- website-content-cache-1.ps5.canonical.com  0.0%  10  38.7  39.5  38.1  42.8  1.3'],
      ['iperf3 -c 192.168.1.10', 'Connecting to host 192.168.1.10, port 5201\n[  5] local 192.168.1.42 port 51544 connected to 192.168.1.10 port 5201\n[ ID] Interval           Transfer     Bitrate         Retr  Cwnd\n[  5]   0.00-1.00   sec  98.4 MBytes   825 Mbits/sec    0   1.21 MBytes\n[  5]   1.00-2.00   sec  101 MBytes    849 Mbits/sec    0   1.21 MBytes\n- - - - - - - - - - - - - - - - - - - - - - - - -\n[ ID] Interval           Transfer     Bitrate         Retr\n[  5]   0.00-10.00  sec   993 MBytes   833 Mbits/sec    2             sender\n[  5]   0.00-10.04  sec   990 MBytes   827 Mbits/sec                  receiver\n\niperf Done.']],
    warn: ['Only scan networks and hosts you own or have permission to test.'] },
  { id: 'lan', title: 'LAN names, hosts & mDNS', intro: '/etc/hosts, Avahi (.local) and lookups.',
    cmds: [
      ['hostname -I', 'All IP addresses of this machine', '192.168.1.42 172.17.0.1 192.168.122.1 fd42:e1c2:a9b0:7d31::1'],
      ['getent hosts example.com', 'Resolve using the system\'s full NSS order', '93.184.215.14   example.com'],
      ['sudo nano /etc/hosts', 'Static name → IP entries'],
      ['ping -c 2 nas.local', 'Reach a LAN device by mDNS name'],
      ['sudo apt install avahi-utils', 'mDNS browsing tools'],
      ['avahi-browse -art', 'Discover services (printers, shares, Chromecasts)'],
      ['nmcli device show wlp0s20f3', 'IP, gateway and DNS of one interface']
    ],
    flags: [['-I', 'All addresses', 'hostname'], ['-a -r -t', 'All, resolve, terminate', 'avahi-browse'], ['hosts <name>', 'Lookup database', 'getent']],
    demo: ['avahi-browse -art', '+ wlp0s20f3 IPv4 HP LaserJet M110w             Internet Printer     local\n+ wlp0s20f3 IPv4 nas                           SSH Remote Terminal  local\n+ wlp0s20f3 IPv4 Living Room TV                Google Cast          local\n= wlp0s20f3 IPv4 nas                           SSH Remote Terminal  local\n   hostname = [nas.local]\n   address = [192.168.1.10]\n   port = [22]'] }
]);

UB.add('services', [
  { id: 'limits', title: 'Resource limits, sockets & D-Bus', intro: 'cgroups, socket activation and busctl.',
    cmds: [
      ['systemd-cgtop', 'Live CPU/memory per service (cgroup)'],
      ['sudo systemctl set-property nginx.service MemoryMax=1G CPUQuota=50%', 'Cap a running service (persists)', ''],
      ['systemctl list-sockets', 'Socket units and what they activate', 'LISTEN                          UNIT                         ACTIVATES\n/run/dbus/system_bus_socket     dbus.socket                  dbus.service\n/run/snapd.socket               snapd.socket                 snapd.service\n[::]:22                         ssh.socket                   ssh.service\n/run/cups/cups.sock             cups.socket                  cups.service\n\n4 sockets listed.'],
      ['systemctl list-jobs', 'Jobs queued right now (stuck boot?)', 'No jobs running.'],
      ['systemd-delta', 'Overridden/extended unit files vs vendor', '[EXTENDED]   /usr/lib/systemd/system/nginx.service → /etc/systemd/system/nginx.service.d/override.conf\n[MASKED]     /etc/systemd/system/bluetooth.service → /usr/lib/systemd/system/bluetooth.service\n\n2 overridden configuration files found.'],
      ['busctl list | head', 'Services on the system D-Bus'],
      ['busctl introspect org.freedesktop.hostname1 /org/freedesktop/hostname1', 'Methods and properties of a D-Bus object']
    ],
    flags: [['MemoryMax=', 'Hard memory limit', 'systemctl'], ['CPUQuota=', 'CPU share (50% = half a core)', 'systemctl'], ['IOWeight=', 'I/O priority', 'systemctl'], ['TasksMax=', 'Max processes/threads', 'systemctl'], ['--runtime', 'Until reboot only', 'systemctl'], ['-m', 'Sort by memory (cgtop)', 'systemd-cgtop']],
    demo: ['systemd-cgtop', 'Control Group                          Tasks   %CPU   Memory  Input/s Output/s\n/                                        612   18.4     6.2G        -        -\nuser.slice                               402   15.1     4.8G        -        -\nuser.slice/user-1000.slice               402   15.1     4.8G        -        -\nsystem.slice                             118    2.9   912.4M        -        -\nsystem.slice/snapd.service                22    0.4   112.1M        -        -\nsystem.slice/NetworkManager.service        4    0.1    18.2M        -        -'] }
]);

UB.add('system', [
  { id: 'dkms', title: 'Kernel modules & DKMS', intro: 'Out-of-tree drivers and blacklisting.',
    cmds: [
      ['sudo apt install dkms linux-headers-$(uname -r)', 'Build tools for out-of-tree modules'],
      ['dkms status', 'Modules DKMS builds for each kernel', 'nvidia-srv/580.82.09, 7.0.0-14-generic, x86_64: installed\nv4l2loopback/0.15.1, 7.0.0-14-generic, x86_64: installed\nvirtualbox/7.2.2, 7.0.0-14-generic, x86_64: installed'],
      ['sudo dkms autoinstall', 'Rebuild all DKMS modules for the running kernel'],
      ['modinfo iwlwifi | head -5', 'Module file, version, firmware and parameters', 'filename:       /lib/modules/7.0.0-14-generic/kernel/drivers/net/wireless/intel/iwlwifi/iwlwifi.ko.zst\nlicense:        GPL\ndescription:    Intel(R) Wireless WiFi driver for Linux\nfirmware:       iwlwifi-bz-b0-fm-c0-92.ucode\nsrcversion:     8A1F3C2D4B5E6A7C9D0E1F2'],
      ['echo "blacklist pcspkr" | sudo tee /etc/modprobe.d/blacklist-pcspkr.conf', 'Never load a module at boot'],
      ['echo "options snd_hda_intel power_save=1" | sudo tee /etc/modprobe.d/audio.conf', 'Set a module parameter permanently'],
      ['sudo dracut -f', '26.04: rebuild initramfs so the change applies early'],
      ['systool -vm snd_hda_intel | grep power_save', 'Current parameter value (apt install sysfsutils)', '    power_save          = "1"']
    ],
    flags: [['status', 'List builds', 'dkms'], ['autoinstall', 'Build for current kernel', 'dkms'], ['-k <ver>', 'Kernel version', 'dkms'], ['blacklist <mod>', 'Disable autoload', 'modprobe.d'], ['options <mod> k=v', 'Module parameters', 'modprobe.d']],
    demo: ['dkms status', 'nvidia-srv/580.82.09, 7.0.0-14-generic, x86_64: installed\nv4l2loopback/0.15.1, 7.0.0-14-generic, x86_64: installed\nvirtualbox/7.2.2, 7.0.0-14-generic, x86_64: installed'],
    tips: ['With Secure Boot, DKMS modules are signed with a local MOK key — enrol it once when prompted (Boot › UEFI).'],
    v24: 'On 24.04 use `sudo update-initramfs -u` instead of dracut.' },
  { id: 'env', title: 'Environment & limits', intro: '/etc/environment, profile.d and ulimit.',
    cmds: [
      ['cat /etc/environment', 'System-wide environment variables', 'PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"'],
      ['echo \'export JAVA_HOME=/usr/lib/jvm/java-25-openjdk-amd64\' | sudo tee /etc/profile.d/java.sh', 'Login-shell variable for all users'],
      ['mkdir -p ~/.config/environment.d', 'Per-user variables for the graphical session', ''],
      ['ulimit -a', 'Your shell resource limits'],
      ['ulimit -n 65535', 'Raise open-files limit for this shell', ''],
      ['sudo nano /etc/security/limits.d/90-nofile.conf', 'Persistent per-user limits (PAM sessions)'],
      ['localectl list-locales | head -3', 'Generated locales', 'C.UTF-8\nen_GB.UTF-8\nen_US.UTF-8']
    ],
    flags: [['-a', 'All limits', 'ulimit'], ['-n', 'Open files', 'ulimit'], ['-u', 'Max processes', 'ulimit'], ['-s', 'Stack size', 'ulimit'], ['* soft nofile 65535', 'limits.conf syntax', 'limits.conf']],
    demo: ['ulimit -a', 'real-time non-blocking time  (microseconds, -R) unlimited\ncore file size              (blocks, -c) 0\ndata seg size               (kbytes, -d) unlimited\nfile size                   (blocks, -f) unlimited\nmax locked memory           (kbytes, -l) 1985672\nmax memory size             (kbytes, -m) unlimited\nopen files                          (-n) 1024\nstack size                  (kbytes, -s) 8192\nmax user processes                  (-u) 62743\nvirtual memory              (kbytes, -v) unlimited'],
    tips: ['systemd services ignore limits.conf — set `LimitNOFILE=` in the unit instead.'] }
]);

UB.add('firewall', [
  { id: 'others', title: 'iptables, gufw & firewalld', intro: 'Other front ends to netfilter.',
    cmds: [
      ['sudo iptables -L -n -v', 'Rules via the iptables-nft compatibility layer'],
      ['sudo iptables-save', 'Dump rules in restore format'],
      ['update-alternatives --display iptables', 'Shows iptables-nft (default) vs legacy', 'iptables - auto mode\n  link best version is /usr/sbin/iptables-nft\n  link currently points to /usr/sbin/iptables-nft\n/usr/sbin/iptables-legacy - priority 10\n/usr/sbin/iptables-nft - priority 20'],
      ['sudo apt install iptables-persistent', 'Save/restore hand-written iptables rules at boot'],
      ['sudo netfilter-persistent save', 'Store current rules in /etc/iptables/rules.v4/v6'],
      ['sudo apt install gufw', 'Graphical front end for ufw'],
      ['sudo apt install firewalld', 'Zone-based firewall (alternative to ufw)'],
      ['sudo firewall-cmd --state', 'Is firewalld running?', 'running'],
      ['sudo firewall-cmd --add-service=https --permanent', 'Open HTTPS in the default zone', 'success'],
      ['sudo firewall-cmd --reload', 'Apply permanent rules', 'success']
    ],
    flags: [['-L', 'List rules', 'iptables'], ['-n -v', 'Numeric, counters', 'iptables'], ['-A / -I / -D', 'Append / insert / delete', 'iptables'], ['--permanent', 'Persist (firewalld)', 'firewall-cmd'], ['--zone=<z>', 'Zone', 'firewall-cmd'], ['--list-all', 'Show zone config', 'firewall-cmd']],
    demo: ['sudo iptables -L -n -v', 'Chain INPUT (policy DROP 0 packets, 0 bytes)\n pkts bytes target     prot opt in     out     source               destination\n18422 21M ufw-before-logging-input  all  --  *      *       0.0.0.0/0            0.0.0.0/0\n18422 21M ufw-before-input  all  --  *      *       0.0.0.0/0            0.0.0.0/0\n  412 24K ufw-after-input  all  --  *      *       0.0.0.0/0            0.0.0.0/0\n\nChain FORWARD (policy DROP 0 packets, 0 bytes)\n pkts bytes target     prot opt in     out     source               destination\n 9120 8M DOCKER-USER  all  --  *      *       0.0.0.0/0            0.0.0.0/0'],
    warn: ['Use one firewall manager. ufw, firewalld and iptables-persistent all write rules and will fight each other.'] }
]);

UB.add('apparmor', [
  { id: 'tools', title: 'More AppArmor tools', intro: 'Check, run under a profile, get notified.',
    cmds: [
      ['aa-enabled', 'Is AppArmor enabled?', 'Yes'],
      ['sudo aa-unconfined', 'Network-facing processes without a profile', '903 /usr/sbin/NetworkManager not confined\n1544 /snap/lxd/35467/bin/lxd confined by \'snap.lxd.daemon (enforce)\'\n4210 /usr/sbin/nginx not confined'],
      ['aa-exec -p myprofile -- /usr/local/bin/myapp', 'Run a program under a specific profile'],
      ['sudo apt install apparmor-notify', 'Desktop notifications for denials'],
      ['aa-notify -s 1 -v', 'Summarise denials from the last day', 'Last login: Sat Oct 10 07:12:51 2026\nAppArmor denials: 3 (since Fri Oct  9 11:40:02 2026)\n  Profile: unprivileged_userns\n  Operation: userns_create\n  Name: /home/ssk/Apps/MyApp.AppImage\n  Denied: userns_create'],
      ['sudo apparmor_parser -QTK /etc/apparmor.d/myappimage', 'Compile-check a profile without loading it', ''],
      ['ls /etc/apparmor.d/disable/', 'Profiles disabled with aa-disable', 'usr.sbin.cupsd']
    ],
    flags: [['-p <profile>', 'Profile name', 'aa-exec'], ['-s <days>', 'Since N days', 'aa-notify'], ['-v', 'Verbose', 'aa-notify'], ['-Q', 'Skip kernel load', 'apparmor_parser'], ['-T', 'Skip read cache', 'apparmor_parser'], ['-K', 'Skip write cache', 'apparmor_parser']],
    demo: ['sudo aa-unconfined', '903 /usr/sbin/NetworkManager not confined\n1544 /snap/lxd/35467/bin/lxd confined by \'snap.lxd.daemon (enforce)\'\n4210 /usr/sbin/nginx not confined'] }
]);

UB.add('security', [
  { id: 'scanners', title: 'Rootkit & integrity scanners', intro: 'rkhunter, chkrootkit, AIDE, ClamAV.',
    cmds: [
      ['sudo apt install rkhunter chkrootkit', 'Rootkit scanners'],
      ['sudo rkhunter --propupd', 'Record current file properties as the baseline'],
      ['sudo rkhunter --check --sk', 'Scan without pausing'],
      ['sudo chkrootkit -q', 'Quiet scan, print only findings'],
      ['sudo apt install aide', 'File integrity database'],
      ['sudo aideinit', 'Create the initial AIDE database'],
      ['sudo aide --config /etc/aide/aide.conf --check', 'Compare files against the database'],
      ['sudo systemctl stop clamav-freshclam', 'Stop the updater daemon before a manual update', ''],
      ['sudo freshclam', 'Update ClamAV signatures'],
      ['clamscan -ri ~/Downloads', 'Scan a folder, print only infected files']
    ],
    flags: [['--check', 'Run checks', 'rkhunter'], ['--sk', 'Skip keypress', 'rkhunter'], ['--propupd', 'Update baseline', 'rkhunter'], ['-q', 'Quiet', 'chkrootkit'], ['-r', 'Recursive', 'clamscan'], ['-i', 'Only infected', 'clamscan'], ['--remove', 'Delete infected (careful)', 'clamscan']],
    demo: ['clamscan -ri ~/Downloads', '\n----------- SCAN SUMMARY -----------\nKnown viruses: 8712044\nEngine version: 1.4.3\nScanned directories: 41\nScanned files: 612\nInfected files: 0\nData scanned: 1842.11 MB\nData read: 2310.40 MB (ratio 0.80:1)\nTime: 48.212 sec (0 m 48 s)\nStart Date: 2026:10:10 11:41:02\nEnd Date:   2026:10:10 11:41:50'],
    tips: ['Run rkhunter `--propupd` again after legitimate upgrades, or it will warn about changed binaries.'] },
  { id: 'secrets', title: 'Passwords & secrets', intro: 'Generate, encrypt and store secrets.',
    cmds: [
      ['openssl rand -base64 32', 'Random 256-bit secret', 'q8F3m2YvK0pT7xN1cR9wLb4sJ6dH5gZaUeA2iO0kVtE='],
      ['gpg -c secrets.txt', 'Encrypt a file with a passphrase (AES)'],
      ['gpg -d secrets.txt.gpg > secrets.txt', 'Decrypt it'],
      ['sudo apt install age', 'Modern, simple file encryption'],
      ['age -p -o notes.age notes.txt', 'Encrypt with a passphrase', 'Enter passphrase (leave empty to autogenerate a secure one): \nConfirm passphrase: '],
      ['sudo apt install pass', 'Unix password manager (GPG + git)'],
      ['pass insert email/work', 'Store a password'],
      ['pass -c email/work', 'Copy it to the clipboard for 45 s', 'Copied email/work to clipboard. Will clear in 45 seconds.'],
      ['secret-tool lookup service myapp', 'Read from GNOME Keyring (libsecret-tools)'],
      ['sudo apt install keepassxc', 'KeePassXC password manager']
    ],
    flags: [['-c', 'Symmetric encrypt / copy (pass)', 'gpg'], ['-d', 'Decrypt', 'gpg'], ['-p', 'Passphrase mode', 'age'], ['-r <recipient>', 'Public-key recipient', 'age'], ['-o <file>', 'Output', 'age'], ['init <gpg-id>', 'Create store', 'pass'], ['generate <name> <len>', 'Generate and store', 'pass']],
    demo: ['openssl rand -base64 32', 'q8F3m2YvK0pT7xN1cR9wLb4sJ6dH5gZaUeA2iO0kVtE='] }
]);

UB.add('disk', [
  { id: 'health', title: 'Health, speed & recovery', intro: 'nvme-cli, badblocks, fio, TestDisk.',
    cmds: [
      ['sudo apt install nvme-cli', 'NVMe management tool'],
      ['sudo nvme smart-log /dev/nvme0', 'Wear, temperature, media errors'],
      ['sudo hdparm -tT /dev/sda', 'Quick read-speed test (SATA)', '/dev/sda:\n Timing cached reads:   21842 MB in  2.00 seconds = 10935.24 MB/sec\n Timing buffered disk reads: 1592 MB in  3.00 seconds = 530.42 MB/sec'],
      ['fio --name=rand --rw=randread --bs=4k --size=1G --runtime=30 --time_based', 'Random-read IOPS benchmark (apt install fio)'],
      ['sudo badblocks -sv /dev/sdb', 'Read-only surface scan of an unmounted disk'],
      ['sudo apt install testdisk', 'TestDisk + PhotoRec recovery tools'],
      ['sudo testdisk /dev/sdb', 'Recover lost partitions'],
      ['sudo photorec /dev/sdb', 'Recover deleted photos/files by signature'],
      ['sudo growpart /dev/sda 1', 'Grow a partition to fill the disk (cloud VMs)', 'CHANGED: partition=1 start=227328 old: size=20744159 end=20971487 new: size=104630239 end=104857567'],
      ['sudo resize2fs /dev/sda1', 'Grow the ext4 filesystem to match', 'resize2fs 1.47.2 (1-Jan-2025)\nFilesystem at /dev/sda1 is mounted on /; on-line resizing required\nThe filesystem on /dev/sda1 is now 13078779 (4k) blocks long.']
    ],
    flags: [['smart-log', 'Health counters', 'nvme'], ['list', 'NVMe devices', 'nvme'], ['-tT', 'Buffered + cached timing', 'hdparm'], ['-s -v', 'Progress, verbose', 'badblocks'], ['--rw', 'read, write, randread, randwrite', 'fio'], ['--bs', 'Block size', 'fio']],
    demo: ['sudo nvme smart-log /dev/nvme0', 'Smart Log for NVME device:nvme0 namespace-id:ffffffff\ncritical_warning                        : 0\ntemperature                             : 39 °C (312 K)\navailable_spare                         : 100%\navailable_spare_threshold               : 10%\npercentage_used                         : 3%\ndata_units_read                         : 41,822,104 (21.41 TB)\ndata_units_written                      : 28,114,902 (14.39 TB)\npower_cycles                            : 1,212\npower_on_hours                          : 4,318\nunsafe_shutdowns                        : 41\nmedia_errors                            : 0\nnum_err_log_entries                     : 0'],
    warn: ['Run recovery tools against a copy (`ddrescue`) or an unmounted disk, and save recovered files to a different drive.'] },
  { id: 'raid', title: 'Software RAID (mdadm)', intro: 'Mirrors and parity arrays.',
    cmds: [
      ['sudo apt install mdadm', 'Install mdadm'],
      ['sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc', 'Create a RAID 1 mirror'],
      ['cat /proc/mdstat', 'Array state and resync progress', 'Personalities : [raid1]\nmd0 : active raid1 sdc[1] sdb[0]\n      976630464 blocks super 1.2 [2/2] [UU]\n      [====>................]  resync = 21.4% (209812480/976630464) finish=62.1min speed=205738K/sec\n      bitmap: 6/8 pages [24KB], 65536KB chunk\n\nunused devices: <none>'],
      ['sudo mdadm --detail /dev/md0', 'Full array details'],
      ['sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf', 'Remember the array at boot'],
      ['sudo dracut -f', 'Rebuild initramfs with the new mdadm.conf (26.04)'],
      ['sudo mdadm /dev/md0 --fail /dev/sdc --remove /dev/sdc', 'Mark a disk failed and remove it', 'mdadm: set /dev/sdc faulty in /dev/md0\nmdadm: hot removed /dev/sdc from /dev/md0'],
      ['sudo mdadm /dev/md0 --add /dev/sdd', 'Add a replacement disk (rebuild starts)', 'mdadm: added /dev/sdd']
    ],
    flags: [['--level=1|5|6|10', 'RAID level', 'mdadm'], ['--raid-devices=N', 'Member count', 'mdadm'], ['--detail', 'Array info', 'mdadm'], ['--scan', 'Find arrays', 'mdadm'], ['--fail / --remove / --add', 'Member management', 'mdadm']],
    demo: ['cat /proc/mdstat', 'Personalities : [raid1]\nmd0 : active raid1 sdc[1] sdb[0]\n      976630464 blocks super 1.2 [2/2] [UU]\n      [====>................]  resync = 21.4% (209812480/976630464) finish=62.1min speed=205738K/sec\n      bitmap: 6/8 pages [24KB], 65536KB chunk\n\nunused devices: <none>'],
    v24: 'On 24.04 run `sudo update-initramfs -u` after editing mdadm.conf.',
    warn: ['RAID is not a backup — deletions and ransomware are mirrored instantly.'] }
]);
