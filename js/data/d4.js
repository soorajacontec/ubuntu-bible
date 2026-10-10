/* SSH, Logs, Boot, Install & Rescue, Desktop, Hardware, Android & Phone */
UB.sec({ id: 'ssh', title: 'SSH', icon: '🔑', desc: 'OpenSSH client and server, keys, config, tunnels and file transfer.', cards: [
  { id: 'keys', title: 'Keys & login', intro: 'Ed25519 keys and passwordless login.',
    cmds: [
      ['ssh-keygen -t ed25519 -C "ssk@laptop"', 'Create an Ed25519 key pair'],
      ['ssh-copy-id ssk@192.168.1.10', 'Install your public key on a server'],
      ['ssh ssk@192.168.1.10', 'Log in'],
      ['ssh -p 2222 -i ~/.ssh/id_ed25519 ssk@server', 'Custom port and key'],
      ['eval "$(ssh-agent -s)"', 'Start an agent in this shell'],
      ['ssh-add ~/.ssh/id_ed25519', 'Cache a key passphrase'],
      ['ssh-keygen -R 192.168.1.10', 'Forget a changed host key'],
      ['ssh-keygen -t ed25519-sk -O resident', 'Hardware-backed key on a FIDO2 token']
    ],
    flags: [['-t ed25519', 'Key type', 'ssh-keygen'], ['-C', 'Comment', 'ssh-keygen'], ['-f', 'Output file', 'ssh-keygen'], ['-R <host>', 'Remove known host', 'ssh-keygen'], ['-i <file>', 'Key file', 'ssh-copy-id'], ['-p <port>', 'Port', 'ssh-copy-id']],
    demo: ['ssh-keygen -t ed25519 -C "ssk@laptop"', 'Generating public/private ed25519 key pair.\nEnter file in which to save the key (/home/ssk/.ssh/id_ed25519): \nEnter passphrase for "/home/ssk/.ssh/id_ed25519" (empty for no passphrase): \nEnter same passphrase again: \nYour identification has been saved in /home/ssk/.ssh/id_ed25519\nYour public key has been saved in /home/ssk/.ssh/id_ed25519.pub\nThe key fingerprint is:\nSHA256:q9Vb2kG0yLwH8f3N1mT6cXz4pR7sA5dE2uJ0iK8oQ1w ssk@laptop\nThe key\'s randomart image is:\n+--[ED25519 256]--+\n|      .o+=*o.    |\n|     . o=B.+     |\n|      ..*.O .    |\n|       o.X.+     |\n|      . S =.o    |\n|     . o =.o+    |\n|      . o ++ .   |\n|       . o.oE    |\n|        ..o.     |\n+----[SHA256]-----+'] },
  { id: 'server', title: 'OpenSSH server', intro: 'Install, harden, socket activation.',
    cmds: [
      ['sudo apt install openssh-server', 'Install the SSH server'],
      ['systemctl status ssh.socket', 'SSH is socket-activated on Ubuntu'],
      ['sudo nano /etc/ssh/sshd_config.d/10-hardening.conf', 'Put your settings in a drop-in'],
      ['sudo sshd -t', 'Validate configuration'],
      ['sudo systemctl daemon-reload', 'Regenerate socket after changing Port/ListenAddress'],
      ['sudo systemctl restart ssh.socket', 'Apply new port'],
      ['sudo systemctl restart ssh', 'Apply other sshd settings'],
      ['sudo journalctl -u ssh -f', 'Watch logins live']
    ],
    flags: [['PasswordAuthentication no', 'Keys only', 'sshd_config'], ['PermitRootLogin no', 'Block root login', 'sshd_config'], ['Port 2222', 'Listening port (needs daemon-reload)', 'sshd_config'], ['AllowUsers ssk alice', 'Whitelist users', 'sshd_config'], ['KbdInteractiveAuthentication no', 'Disable keyboard-interactive', 'sshd_config'], ['MaxAuthTries 3', 'Limit attempts', 'sshd_config'], ['-t', 'Test config', 'sshd']],
    demo: ['systemctl status ssh.socket', '● ssh.socket - OpenBSD Secure Shell server socket\n     Loaded: loaded (/usr/lib/systemd/system/ssh.socket; enabled; preset: enabled)\n     Active: active (running) since Sat 2026-10-03 07:12:58 +03; 2h 41min ago\n   Triggers: ● ssh.service\n     Listen: [::]:22 (Stream)\n      Tasks: 0 (limit: 18821)\n     Memory: 8K (peak: 256K)\n        CPU: 1ms\n     CGroup: /system.slice/ssh.socket'],
    warn: ['Keep an existing session open while testing changes — if sshd breaks you can still fix it.'],
    tips: ['Ubuntu reads `Port` from sshd_config and generates the socket for you — just `daemon-reload` and restart ssh.socket.'] },
  { id: 'config', title: '~/.ssh/config', intro: 'Short host aliases and jump hosts.',
    cmds: [
      ['nano ~/.ssh/config', 'Edit client config'],
      ['ssh web', 'Connect using a Host alias'],
      ['ssh -J bastion ssk@10.0.0.20', 'Jump through a bastion'],
      ['ssh -G web | head', 'Effective settings for a host'],
      ['chmod 600 ~/.ssh/config', 'Required permissions']
    ],
    flags: [['Host web', 'Alias', 'ssh_config'], ['HostName 203.0.113.5', 'Real address', 'ssh_config'], ['User ssk', 'Login user', 'ssh_config'], ['Port 2222', 'Port', 'ssh_config'], ['IdentityFile ~/.ssh/id_ed25519', 'Key', 'ssh_config'], ['ProxyJump bastion', 'Jump host', 'ssh_config'], ['ServerAliveInterval 30', 'Keepalive', 'ssh_config']],
    demo: ['cat ~/.ssh/config', 'Host bastion\n    HostName 203.0.113.5\n    User ssk\n\nHost web\n    HostName 10.0.0.20\n    User deploy\n    ProxyJump bastion\n    IdentityFile ~/.ssh/id_ed25519\n    ServerAliveInterval 30'] },
  { id: 'transfer', title: 'Copy files & tunnels', intro: 'scp, sftp, rsync and port forwarding.',
    cmds: [
      ['scp report.pdf web:/tmp/', 'Copy a file to a host'],
      ['scp -r web:/var/log/nginx ./logs', 'Copy a directory back'],
      ['rsync -avzP ./site/ web:/var/www/site/', 'Efficient sync over SSH'],
      ['sftp web', 'Interactive file transfer'],
      ['ssh -L 5432:localhost:5432 db', 'Reach a remote Postgres on localhost:5432'],
      ['ssh -R 8080:localhost:3000 web', 'Expose your local port 3000 on the server'],
      ['ssh -D 1080 -N web', 'SOCKS proxy through a server'],
      ['sshfs web:/srv ~/mnt/srv', 'Mount a remote dir (apt install sshfs)']
    ],
    flags: [['-r', 'Recursive', 'scp'], ['-P <port>', 'Port (capital P!)', 'scp'], ['-L', 'Local forward', 'ssh'], ['-R', 'Remote forward', 'ssh'], ['-D', 'Dynamic SOCKS', 'ssh'], ['-N', 'No shell', 'ssh']],
    demo: ['rsync -avzP ./site/ web:/var/www/site/', 'sending incremental file list\n./\nindex.html\n          4,812 100%    0.00kB/s    0:00:00 (xfr#1, to-chk=3/5)\ncss/style.css\n         12,044 100%   11.49MB/s    0:00:00 (xfr#2, to-chk=1/5)\n\nsent 5,311 bytes  received 77 bytes  3,592.00 bytes/sec\ntotal size is 16,856  speedup is 3.13'] }
]});

UB.sec({ id: 'logs', title: 'Logs', icon: '📜', desc: 'journalctl, kernel logs, classic log files, rotation and crash reports.', cards: [
  { id: 'journal', title: 'journalctl essentials', intro: 'The systemd journal.',
    cmds: [
      ['journalctl -b', 'Everything since boot'],
      ['journalctl -f', 'Follow new messages'],
      ['journalctl -u ssh --since "1 hour ago"', 'One service, last hour'],
      ['journalctl -p err -b', 'Errors this boot'],
      ['journalctl --list-boots', 'Recorded boots'],
      ['journalctl -k -b -1', 'Kernel log of the previous boot'],
      ['journalctl _COMM=sudo --since today', 'Every sudo use today'],
      ['journalctl -o json-pretty -n 1', 'Latest entry with all fields']
    ],
    flags: [['-b', 'This boot'], ['-f', 'Follow'], ['-u', 'Unit'], ['-p', 'Priority'], ['--since/--until', 'Time window'], ['-k', 'Kernel'], ['-n', 'Last N'], ['-o', 'Output format'], ['-g', 'Grep message']],
    demo: ['journalctl --list-boots', 'IDX BOOT ID                          FIRST ENTRY                 LAST ENTRY\n -2 7c1e0b9a2d3f4e5a8b6c7d8e9f0a1b2c Thu 2026-10-01 08:01:12 +03 Thu 2026-10-01 23:44:05 +03\n -1 1a2b3c4d5e6f708192a3b4c5d6e7f809 Fri 2026-10-02 07:55:41 +03 Fri 2026-10-02 22:10:33 +03\n  0 9b2e0c51a7f64d3e8a1b5c6d7e8f9a0b Sat 2026-10-03 07:12:44 +03 Sat 2026-10-03 09:58:02 +03'] },
  { id: 'files', title: 'Log files & rotation', intro: '/var/log, logrotate, journal size.',
    cmds: [
      ['ls /var/log', 'Classic log directory'],
      ['sudo tail -f /var/log/auth.log', 'Authentication log (needs rsyslog)'],
      ['sudo less /var/log/apt/term.log', 'Full APT terminal output'],
      ['journalctl --disk-usage', 'Journal size'],
      ['sudo journalctl --vacuum-time=2weeks', 'Delete older journal entries'],
      ['sudo nano /etc/systemd/journald.conf.d/size.conf', 'Cap journal size permanently (SystemMaxUse=)'],
      ['sudo logrotate -d /etc/logrotate.d/nginx', 'Debug a logrotate rule']
    ],
    flags: [['SystemMaxUse=500M', 'Journal size cap', 'journald.conf'], ['MaxRetentionSec=1month', 'Age cap', 'journald.conf'], ['daily / weekly', 'Rotation interval', 'logrotate'], ['rotate 7', 'Keep N files', 'logrotate'], ['compress', 'gzip old logs', 'logrotate'], ['-d', 'Debug (dry run)', 'logrotate']],
    demo: ['journalctl --disk-usage', 'Archived and active journals take up 1.2G in the file system.'],
    tips: ['If rsyslog is not installed (minimal systems), /var/log/syslog and auth.log do not exist — use `journalctl`.'] },
  { id: 'crash', title: 'Crashes & dmesg', intro: 'Kernel ring buffer and Apport.',
    cmds: [
      ['sudo dmesg -T --level=err,warn', 'Kernel errors with human time'],
      ['sudo dmesg -w', 'Watch kernel messages (plug in a USB device)'],
      ['ls /var/crash', 'Apport crash reports'],
      ['ubuntu-bug /var/crash/_usr_bin_gnome-shell.1000.crash', 'Report a crash'],
      ['coredumpctl list', 'Core dumps (if systemd-coredump is installed)'],
      ['sudo systemctl disable --now apport', 'Disable crash reporting dialogs']
    ],
    flags: [['-T', 'Human timestamps', 'dmesg'], ['-w', 'Follow', 'dmesg'], ['--level', 'Severity filter', 'dmesg'], ['-H', 'Human, paged', 'dmesg']],
    demo: ['sudo dmesg -w', '[Sat Oct  3 10:01:12 2026] usb 3-2: new high-speed USB device number 7 using xhci_hcd\n[Sat Oct  3 10:01:12 2026] usb 3-2: New USB device found, idVendor=0781, idProduct=5591, bcdDevice= 1.00\n[Sat Oct  3 10:01:12 2026] usb 3-2: Product: Ultra USB 3.0\n[Sat Oct  3 10:01:12 2026] usb-storage 3-2:1.0: USB Mass Storage device detected\n[Sat Oct  3 10:01:13 2026] sd 2:0:0:0: [sdb] 60088320 512-byte logical blocks: (30.8 GB/28.7 GiB)\n[Sat Oct  3 10:01:13 2026]  sdb: sdb1'] }
]});

UB.sec({ id: 'boot', title: 'Boot', icon: '🚀', desc: 'GRUB, kernel parameters, initramfs (dracut on 26.04), UEFI and boot timing.', cards: [
  { id: 'grub', title: 'GRUB configuration', intro: 'Menu timeout, default entry, kernel parameters.',
    cmds: [
      ['sudo nano /etc/default/grub', 'Main GRUB settings'],
      ['sudo update-grub', 'Regenerate /boot/grub/grub.cfg'],
      ['grep -E "menuentry |submenu " /boot/grub/grub.cfg | cut -d"\'" -f2', 'Boot entry titles'],
      ['sudo grub-reboot "Advanced options for Ubuntu>Ubuntu, with Linux 7.0.0-12-generic"', 'Boot an entry once'],
      ['sudo grub-set-default 0', 'Set the default entry'],
      ['cat /proc/cmdline', 'Parameters the running kernel booted with']
    ],
    flags: [['GRUB_TIMEOUT_STYLE=menu', 'Always show the menu', 'grub'], ['GRUB_TIMEOUT=5', 'Seconds to wait', 'grub'], ['GRUB_DEFAULT=saved', 'Remember last choice (with GRUB_SAVEDEFAULT=true)', 'grub'], ['GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"', 'Normal-boot kernel parameters', 'grub'], ['GRUB_DISABLE_OS_PROBER=false', 'Detect Windows/other OSes', 'grub']],
    demo: ['sudo update-grub', 'Sourcing file `/etc/default/grub\'\nGenerating grub configuration file ...\nFound linux image: /boot/vmlinuz-7.0.0-14-generic\nFound initrd image: /boot/initrd.img-7.0.0-14-generic\nFound linux image: /boot/vmlinuz-7.0.0-12-generic\nFound initrd image: /boot/initrd.img-7.0.0-12-generic\nFound memtest86+ 64bit EFI image: /boot/memtest86+x64.efi\nWarning: os-prober will be executed to detect other bootable partitions.\nFound Windows Boot Manager on /dev/nvme0n1p1@/EFI/Microsoft/Boot/bootmgfw.efi\nAdding boot menu entry for UEFI Firmware Settings ...\ndone'],
    tips: ['Common parameters: `nomodeset` (graphics trouble), `systemd.unit=rescue.target`, `mem_sleep_default=deep`.'] },
  { id: 'initramfs', title: 'initramfs (dracut vs initramfs-tools)', intro: 'Rebuild the early-boot image.',
    cmds: [
      ['sudo dracut --force --regenerate-all', '26.04: rebuild initramfs for all kernels'],
      ['sudo dracut -f --kver 7.0.0-14-generic', '26.04: rebuild for one kernel'],
      ['lsinitrd /boot/initrd.img-7.0.0-14-generic | less', '26.04: inspect an initramfs (dracut)'],
      ['sudo update-initramfs -u -k all', '24.04: rebuild with initramfs-tools'],
      ['lsinitramfs /boot/initrd.img-$(uname -r) | head', '24.04: inspect an initramfs'],
      ['ls -lh /boot', 'Kernels and initramfs images']
    ],
    flags: [['-f, --force', 'Overwrite', 'dracut'], ['--regenerate-all', 'All kernels', 'dracut'], ['--kver', 'Kernel version', 'dracut'], ['-u', 'Update (initramfs-tools)', 'update-initramfs'], ['-k all', 'All kernels (initramfs-tools)', 'update-initramfs']],
    demo: ['ls -lh /boot', 'total 168M\n-rw-r--r-- 1 root root 295K Sep 10 11:02 config-7.0.0-14-generic\ndrwx------ 3 root root 4.0K Jan  1  1970 efi\ndrwxr-xr-x 6 root root 4.0K Oct  2 18:04 grub\nlrwxrwxrwx 1 root root   31 Oct  2 18:03 initrd.img -> initrd.img-7.0.0-14-generic\n-rw-r--r-- 1 root root  72M Oct  2 18:04 initrd.img-7.0.0-12-generic\n-rw-r--r-- 1 root root  73M Oct  2 18:04 initrd.img-7.0.0-14-generic\n-rw-r--r-- 1 root root 9.4M Sep 10 11:02 System.map-7.0.0-14-generic\nlrwxrwxrwx 1 root root   28 Oct  2 18:03 vmlinuz -> vmlinuz-7.0.0-14-generic\n-rw------- 1 root root  15M Sep 10 11:02 vmlinuz-7.0.0-14-generic'],
    tips: ['Kernel package installs rebuild the initramfs automatically — manual runs are only needed after changing modules, crypttab or firmware.'],
    v24: '24.04 uses initramfs-tools (`update-initramfs`). 25.10 switched the default to dracut, and 26.04 LTS keeps it.' },
  { id: 'uefi', title: 'UEFI & Secure Boot', intro: 'Boot entries and MOK.',
    cmds: [
      ['efibootmgr -v', 'UEFI boot entries'],
      ['sudo efibootmgr -n 0001', 'Boot entry 0001 next time only'],
      ['sudo efibootmgr -o 0000,0001', 'Change boot order'],
      ['mokutil --sb-state', 'Is Secure Boot on?', 'SecureBoot enabled'],
      ['sudo mokutil --import /var/lib/shim-signed/mok/MOK.der', 'Enroll the key used to sign DKMS modules'],
      ['systemctl reboot --firmware-setup', 'Reboot into BIOS/UEFI setup']
    ],
    flags: [['-v', 'Verbose', 'efibootmgr'], ['-n', 'BootNext', 'efibootmgr'], ['-o', 'BootOrder', 'efibootmgr'], ['--sb-state', 'Secure Boot state', 'mokutil'], ['--import', 'Queue a key for enrolment', 'mokutil']],
    demo: ['efibootmgr -v', 'BootCurrent: 0000\nTimeout: 0 seconds\nBootOrder: 0000,0001,2001\nBoot0000* Ubuntu\tHD(1,GPT,3c1e…,0x800,0x219800)/File(\\EFI\\ubuntu\\shimx64.efi)\nBoot0001* Windows Boot Manager\tHD(1,GPT,3c1e…,0x800,0x219800)/File(\\EFI\\Microsoft\\Boot\\bootmgfw.efi)\nBoot2001* EFI USB Device\tRC'] },
  { id: 'targets', title: 'Boot targets & timing', intro: 'Rescue mode and slow boots.',
    cmds: [
      ['systemd-analyze', 'Total boot time'],
      ['systemd-analyze critical-chain', 'Slowest dependency chain'],
      ['systemd-analyze plot > boot.svg', 'Visual timeline'],
      ['sudo systemctl set-default multi-user.target', 'Boot to text console'],
      ['sudo systemctl isolate rescue.target', 'Switch to rescue mode now'],
      ['sudo systemctl disable NetworkManager-wait-online.service', 'Common boot-time saver on desktops']
    ],
    flags: [['graphical.target', 'Desktop'], ['multi-user.target', 'Text, networking'], ['rescue.target', 'Single-user rescue'], ['emergency.target', 'Minimal, read-only root']],
    demo: ['systemd-analyze', 'Startup finished in 6.412s (firmware) + 2.103s (loader) + 1.981s (kernel) + 3.554s (initrd) + 9.870s (userspace) = 23.922s\ngraphical.target reached after 9.802s in userspace.'] }
]});

UB.sec({ id: 'install', title: 'Install & Rescue', icon: '🛟', desc: 'Make install media, autoinstall, and repair a broken system from a live USB.', cards: [
  { id: 'media', title: 'Create install media', intro: 'Verify and write the ISO.',
    cmds: [
      ['sha256sum ubuntu-26.04.1-desktop-amd64.iso', 'Checksum to compare with SHA256SUMS'],
      ['lsblk -d -o NAME,SIZE,MODEL,TRAN', 'Identify the USB stick'],
      ['sudo dd if=ubuntu-26.04.1-desktop-amd64.iso of=/dev/sdb bs=4M status=progress oflag=sync', 'Write ISO to USB (erases it)'],
      ['sudo apt install usb-creator-gtk', 'Startup Disk Creator GUI'],
      ['flatpak install flathub org.fedoraproject.MediaWriter', 'Alternative writer (Fedora Media Writer)']
    ],
    flags: [['if=', 'Input file', 'dd'], ['of=', 'Output device — the WHOLE disk, not sdb1', 'dd'], ['bs=4M', 'Block size', 'dd'], ['status=progress', 'Show progress', 'dd'], ['oflag=sync', 'Flush writes', 'dd']],
    demo: ['sudo dd if=ubuntu-26.04.1-desktop-amd64.iso of=/dev/sdb bs=4M status=progress oflag=sync', '6555697152 bytes (6.6 GB, 6.1 GiB) copied, 401 s, 16.3 MB/s\n1564+1 records in\n1564+1 records out\n6563790848 bytes (6.6 GB, 6.1 GiB) copied, 402.17 s, 16.3 MB/s'],
    warn: ['dd overwrites the target without asking. Check `lsblk` twice.'],
    tips: ['26.04 desktop needs ~6 GB RAM recommended (up from 4 GB) and a 64-bit CPU.'] },
  { id: 'autoinstall', title: 'Autoinstall', intro: 'Unattended installs with YAML.',
    cmds: [
      ['nano autoinstall.yaml', 'Write an autoinstall config'],
      ['cloud-init schema -c autoinstall.yaml --annotate', 'Basic YAML validation'],
      ['sudo snap install ubuntu-image --classic', 'Build custom images (advanced)']
    ],
    flags: [['version: 1', 'Schema version', 'autoinstall'], ['identity:', 'Hostname, user, password hash', 'autoinstall'], ['storage: layout: name: lvm', 'Disk layout (lvm, direct, zfs)', 'autoinstall'], ['ssh: install-server: true', 'Enable SSH', 'autoinstall'], ['packages:', 'Extra packages', 'autoinstall'], ['late-commands:', 'Shell commands at the end', 'autoinstall'], ['interactive-sections:', 'Ask for some answers anyway', 'autoinstall']],
    demo: ['cat autoinstall.yaml', 'autoinstall:\n  version: 1\n  identity:\n    hostname: web01\n    username: ssk\n    password: "$6$exDY1mhS4KUYCE/2$zmn9ToZwTKLhCw.b4/b.ZRTIZM30JZ4QrOQ2aOXJ8yk96xpcCof0kxKwuX1kqLG/ygbJ1f8wxED22bTL4F46P0"\n  storage:\n    layout:\n      name: lvm\n  ssh:\n    install-server: true\n    allow-pw: false\n  packages:\n    - nginx\n    - fail2ban'],
    tips: ['Desktop and Server installers both accept autoinstall (provide it via a CIDATA drive or `autoinstall` on the kernel command line).'] },
  { id: 'chroot', title: 'Repair from a live USB', intro: 'chroot into the installed system.',
    cmds: [
      ['sudo mount /dev/nvme0n1p2 /mnt', 'Mount the installed root'],
      ['sudo mount /dev/nvme0n1p1 /mnt/boot/efi', 'Mount the EFI partition'],
      ['for d in dev proc sys run; do sudo mount --rbind /$d /mnt/$d; done', 'Bind system directories'],
      ['sudo chroot /mnt', 'Enter the installed system'],
      ['grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=ubuntu', 'Reinstall GRUB (inside chroot)'],
      ['update-grub', 'Regenerate menu (inside chroot)'],
      ['apt install --reinstall linux-image-generic', 'Fix a broken kernel install (inside chroot)'],
      ['passwd ssk', 'Reset a forgotten password (inside chroot)']
    ],
    flags: [['--rbind', 'Recursive bind mount', 'mount'], ['--target=x86_64-efi', 'UEFI', 'grub-install'], ['--efi-directory', 'ESP mount point', 'grub-install'], ['--bootloader-id', 'EFI folder name', 'grub-install']],
    demo: ['sudo chroot /mnt', 'root@ubuntu:/#'],
    tips: ['For an LVM/LUKS install, first `sudo cryptsetup open /dev/nvme0n1p3 dm_crypt-0` and `sudo vgchange -ay`, then mount /dev/ubuntu-vg/ubuntu-lv.'] },
  { id: 'recovery', title: 'Recovery mode', intro: 'Built-in rescue menu.',
    cmds: [
      ['mount -o remount,rw /', 'Make root writable in recovery shell'],
      ['fsck -f /dev/nvme0n1p2', 'Check the root filesystem (recovery menu → fsck)'],
      ['dpkg --configure -a', 'Repair packages (recovery menu → dpkg)'],
      ['systemctl default', 'Continue normal boot from rescue']
    ],
    flags: [['resume', 'Continue booting', 'recovery'], ['clean', 'Free space', 'recovery'], ['dpkg', 'Repair packages', 'recovery'], ['fsck', 'Check filesystems', 'recovery'], ['network', 'Enable networking', 'recovery'], ['root', 'Root shell', 'recovery']],
    demo: ['mount -o remount,rw /', ''] }
]});

UB.sec({ id: 'desktop', title: 'Desktop', icon: '🎨', desc: 'GNOME 50 with Ubuntu Dock, extensions, settings from the terminal, and the official flavours.', cards: [
  { id: 'gnome', title: 'GNOME settings via gsettings', intro: 'Script your desktop.',
    cmds: [
      ['gsettings set org.gnome.desktop.interface color-scheme prefer-dark', 'Dark style'],
      ['gsettings set org.gnome.desktop.interface accent-color "orange"', 'Accent colour (GNOME 47+)'],
      ['gsettings set org.gnome.desktop.wm.preferences button-layout ":minimize,maximize,close"', 'Window buttons'],
      ['gsettings set org.gnome.mutter experimental-features "[\'scale-monitor-framebuffer\']"', 'Fractional scaling'],
      ['gsettings list-recursively org.gnome.shell.extensions.dash-to-dock | head', 'Ubuntu Dock settings'],
      ['gsettings set org.gnome.shell.extensions.dash-to-dock dock-position BOTTOM', 'Move the Ubuntu Dock'],
      ['gsettings set org.gnome.shell.extensions.dash-to-dock extend-height false', 'Floating dock'],
      ['dconf dump /org/gnome/ > gnome-settings.ini', 'Back up all GNOME settings'],
      ['dconf load /org/gnome/ < gnome-settings.ini', 'Restore them']
    ],
    flags: [['get / set / reset', 'Read / write / default', 'gsettings'], ['list-recursively', 'Dump keys', 'gsettings'], ['dump / load', 'Export / import', 'dconf']],
    demo: ['gsettings list-recursively org.gnome.shell.extensions.dash-to-dock | head', "org.gnome.shell.extensions.dash-to-dock dash-max-icon-size 48\norg.gnome.shell.extensions.dash-to-dock dock-fixed true\norg.gnome.shell.extensions.dash-to-dock dock-position 'LEFT'\norg.gnome.shell.extensions.dash-to-dock extend-height true\norg.gnome.shell.extensions.dash-to-dock show-apps-at-top false\norg.gnome.shell.extensions.dash-to-dock show-mounts true\norg.gnome.shell.extensions.dash-to-dock show-trash false\norg.gnome.shell.extensions.dash-to-dock click-action 'focus-or-appspread'\norg.gnome.shell.extensions.dash-to-dock autohide true\norg.gnome.shell.extensions.dash-to-dock intellihide true"],
    tips: ['Ubuntu Dock is Ubuntu\'s build of Dash to Dock — its keys live in the dash-to-dock schema.'] },
  { id: 'extensions', title: 'Extensions & tweaks', intro: 'Manage GNOME Shell extensions.',
    cmds: [
      ['gnome-extensions list --enabled', 'Enabled extensions'],
      ['gnome-extensions disable tiling-assistant@ubuntu.com', 'Disable Ubuntu tiling assistant'],
      ['gnome-extensions enable ding@rastersoft.com', 'Desktop icons'],
      ['sudo apt install gnome-shell-extension-manager', 'Extension Manager app (browse extensions.gnome.org)'],
      ['sudo apt install gnome-tweaks', 'GNOME Tweaks (fonts, startup apps)'],
      ['gnome-shell --version', 'GNOME version', 'GNOME Shell 50.1']
    ],
    flags: [['list', 'Installed', 'gnome-extensions'], ['--enabled', 'Only enabled', 'gnome-extensions'], ['info <uuid>', 'Details', 'gnome-extensions'], ['enable/disable', 'Toggle', 'gnome-extensions'], ['prefs <uuid>', 'Open settings', 'gnome-extensions']],
    demo: ['gnome-extensions list --enabled', 'ding@rastersoft.com\nubuntu-appindicators@ubuntu.com\nubuntu-dock@ubuntu.com\ntiling-assistant@ubuntu.com'],
    tips: ['"Startup Applications" was removed; add autostart entries with GNOME Tweaks or by placing .desktop files in ~/.config/autostart/.'],
    v24: '24.04 ships GNOME 46 with an X11 ("Ubuntu on Xorg") session and GNOME Terminal, Eye of GNOME, Evince and System Monitor.' },
  { id: 'apps', title: 'Default apps on 26.04', intro: 'What replaced what.',
    cmds: [
      ['ptyxis', 'Terminal (replaced GNOME Terminal)'],
      ['loupe photo.jpg', 'Image viewer (replaced Eye of GNOME)'],
      ['papers doc.pdf', 'Document viewer with annotations (replaced Evince)'],
      ['showtime video.mp4', 'Video player (replaced Totem)'],
      ['resources', 'System monitor (replaced System Monitor + Power Statistics)'],
      ['sudo apt install gnome-terminal', 'Bring GNOME Terminal back if you prefer it'],
      ['echo $XDG_SESSION_TYPE', 'Session type', 'wayland']
    ],
    flags: [['Ctrl+Shift+T', 'New tab', 'ptyxis'], ['Ctrl+Shift+N', 'New window', 'ptyxis'], ['Ctrl+Shift+F', 'Find', 'ptyxis']],
    demo: ['echo $XDG_SESSION_TYPE', 'wayland'],
    warn: ['26.04 has no Xorg session. Old X11-only tools (xdotool, some screen recorders) won\'t control other windows; use portal-aware alternatives.'] },
  { id: 'flavours', title: 'KDE (Kubuntu) & other flavours', intro: 'Different desktops, same Ubuntu base.',
    cmds: [
      ['sudo apt install kubuntu-desktop', 'KDE Plasma 6 (Kubuntu)'],
      ['sudo apt install xubuntu-desktop', 'Xfce (Xubuntu)'],
      ['sudo apt install lubuntu-desktop', 'LXQt (Lubuntu)'],
      ['sudo apt install ubuntu-mate-desktop', 'MATE'],
      ['sudo apt install ubuntu-budgie-desktop', 'Budgie'],
      ['sudo apt install ubuntucinnamon-desktop', 'Cinnamon'],
      ['sudo apt install ubuntustudio-desktop', 'Ubuntu Studio (creative tools, low-latency)'],
      ['kwriteconfig6 --file kdeglobals --group KDE --key SingleClick false', 'KDE: double-click to open'],
      ['plasmashell --replace &', 'Restart a frozen Plasma shell'],
      ['qdbus6 org.kde.KWin /KWin reconfigure', 'Reload KWin settings']
    ],
    flags: [['kubuntu-desktop', 'KDE Plasma', 'apt'], ['xubuntu-desktop', 'Xfce', 'apt'], ['lubuntu-desktop', 'LXQt', 'apt'], ['ubuntu-mate-desktop', 'MATE', 'apt'], ['ubuntu-budgie-desktop', 'Budgie', 'apt'], ['ubuntucinnamon-desktop', 'Cinnamon', 'apt'], ['ubuntu-unity-desktop', 'Unity', 'apt'], ['edubuntu-desktop', 'Education', 'apt']],
    demo: ['sudo apt install kubuntu-desktop', 'Installing:\n  kubuntu-desktop\n\nInstalling dependencies:\n  plasma-desktop  plasma-workspace  kwin-wayland  sddm  dolphin  konsole\n  kate  okular  gwenview  ark  spectacle  plasma-nm  plasma-pa  ...\n\nSummary:\n  Upgrading: 0, Installing: 612, Removing: 0, Not Upgrading: 0\n  Download size: 498 MB\n  Space needed: 1,914 MB / 61.4 GB available\n\nContinue? [Y/n] \nConfiguring sddm\n  Default display manager: gdm3'],
    tips: ['Installing several desktops side by side can mix themes and apps. A fresh install of the flavour ISO is cleaner.'] }
]});

UB.sec({ id: 'hardware', title: 'Hardware', icon: '🔧', desc: 'Identify hardware, install drivers (ubuntu-drivers, NVIDIA) and update firmware.', cards: [
  { id: 'identify', title: 'Identify hardware', intro: 'lspci, lsusb, lshw, inxi, sensors.',
    cmds: [
      ['lspci -k | grep -A3 -E "VGA|3D|Network"', 'GPU/network devices and their kernel drivers'],
      ['lsusb', 'USB devices'],
      ['sudo lshw -short', 'Hardware summary'],
      ['sudo apt install inxi', 'Install inxi'],
      ['inxi -Fxz', 'Full system report, privacy-filtered'],
      ['sudo dmidecode -t memory | grep -E "Size|Speed|Type:"', 'RAM modules'],
      ['sudo apt install lm-sensors', 'Install temperature sensor tools'],
      ['sudo sensors-detect --auto', 'Detect sensor chips automatically'],
      ['sensors', 'Temperatures and fans']
    ],
    flags: [['-k', 'Kernel driver in use', 'lspci'], ['-nn', 'Vendor:device IDs', 'lspci'], ['-v', 'Verbose', 'lsusb'], ['-short', 'Compact', 'lshw'], ['-F', 'Full', 'inxi'], ['-z', 'Mask serials/IPs', 'inxi']],
    demo: ['lspci -k | grep -A3 -E "VGA|3D|Network"', '00:02.0 VGA compatible controller: Intel Corporation Meteor Lake-P [Intel Arc Graphics] (rev 08)\n\tSubsystem: Lenovo Device 50e1\n\tKernel driver in use: xe\n\tKernel modules: i915, xe\n01:00.0 3D controller: NVIDIA Corporation AD107M [GeForce RTX 4050 Max-Q / Mobile] (rev a1)\n\tSubsystem: Lenovo Device 3c2a\n\tKernel driver in use: nvidia\n\tKernel modules: nvidiafb, nouveau, nvidia_drm, nvidia\n00:14.3 Network controller: Intel Corporation Meteor Lake PCH CNVi WiFi (rev 20)\n\tKernel driver in use: iwlwifi'] },
  { id: 'drivers', title: 'ubuntu-drivers', intro: 'Proprietary/third-party drivers the Ubuntu way.',
    cmds: [
      ['ubuntu-drivers devices', 'Hardware with available drivers'],
      ['sudo ubuntu-drivers list', 'Driver packages for this machine'],
      ['sudo ubuntu-drivers install', 'Install recommended drivers'],
      ['sudo ubuntu-drivers install nvidia:580', 'Install a specific NVIDIA branch'],
      ['sudo ubuntu-drivers install --gpgpu nvidia:580-server', 'Headless/compute driver for servers'],
      ['software-properties-gtk --open-tab=4', 'Additional Drivers GUI tab (if installed)']
    ],
    flags: [['devices', 'Detect', 'ubuntu-drivers'], ['list', 'List packages', 'ubuntu-drivers'], ['install [drv]', 'Install', 'ubuntu-drivers'], ['--gpgpu', 'Compute variant', 'ubuntu-drivers'], ['--free-only', 'Only open drivers', 'ubuntu-drivers']],
    demo: ['ubuntu-drivers devices', '== /sys/devices/pci0000:00/0000:00:01.0/0000:01:00.0 ==\nmodalias : pci:v000010DEd000028A1sv000017AAsd00003C2Abc03sc02i00\nvendor   : NVIDIA Corporation\nmodel    : AD107M [GeForce RTX 4050 Max-Q / Mobile]\ndriver   : nvidia-driver-570 - distro non-free\ndriver   : nvidia-driver-580 - distro non-free recommended\ndriver   : nvidia-driver-580-open - distro non-free\ndriver   : nvidia-driver-570-server - distro non-free\ndriver   : xserver-xorg-video-nouveau - distro free builtin'],
    tips: ['With Secure Boot on, Ubuntu\'s pre-signed NVIDIA kernel modules (linux-modules-nvidia-*) load without MOK enrolment.'],
    v24: '"Software & Updates" (with its Additional Drivers tab) is no longer installed by default on 26.04 — use `ubuntu-drivers` or install `software-properties-gtk`.' },
  { id: 'nvidia', title: 'NVIDIA tools', intro: 'Monitoring and hybrid graphics.',
    cmds: [
      ['nvidia-smi', 'GPU status, memory and processes'],
      ['nvidia-smi --query-gpu=name,temperature.gpu,utilization.gpu,memory.used --format=csv -l 2', 'Live CSV metrics'],
      ['prime-select query', 'Hybrid graphics mode', 'on-demand'],
      ['sudo prime-select nvidia', 'Always use the NVIDIA GPU (log out to apply)'],
      ['__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia glxgears', 'Run one app on the dGPU (on-demand mode)'],
      ['sudo apt install nvtop', 'Live GPU monitor (NVIDIA/AMD/Intel)'],
      ['cat /proc/driver/nvidia/version', 'Loaded driver version']
    ],
    flags: [['-L', 'List GPUs', 'nvidia-smi'], ['--query-gpu', 'Fields', 'nvidia-smi'], ['-l <s>', 'Loop', 'nvidia-smi'], ['on-demand', 'Offload per app', 'prime-select'], ['nvidia', 'dGPU always', 'prime-select'], ['intel', 'iGPU only', 'prime-select']],
    demo: ['nvidia-smi', '+-----------------------------------------------------------------------------------------+\n| NVIDIA-SMI 580.82.09              Driver Version: 580.82.09      CUDA Version: 13.0     |\n|-----------------------------------------+------------------------+----------------------+\n| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |\n| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |\n|=========================================+========================+======================|\n|   0  NVIDIA GeForce RTX 4050 ...    Off |   00000000:01:00.0 Off |                  N/A |\n| N/A   46C    P8              3W /   35W |      12MiB /   6141MiB |      0%      Default |\n+-----------------------------------------+------------------------+----------------------+\n| Processes:                                                                              |\n|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |\n|    0   N/A  N/A            2214      G   /usr/bin/gnome-shell                      4MiB |\n+-----------------------------------------------------------------------------------------+'] },
  { id: 'firmware', title: 'Firmware, printers & Bluetooth', intro: 'fwupd, CUPS, bluetoothctl.',
    cmds: [
      ['fwupdmgr get-devices', 'Firmware-updatable devices'],
      ['fwupdmgr refresh', 'Fetch LVFS metadata'],
      ['fwupdmgr get-updates', 'Available firmware updates'],
      ['fwupdmgr update', 'Install firmware updates'],
      ['fwupdmgr security', 'Host Security ID report'],
      ['lpstat -p -d', 'Printers and the default (CUPS)'],
      ['bluetoothctl devices', 'Known Bluetooth devices'],
      ['bluetoothctl connect AA:BB:CC:DD:EE:FF', 'Connect a device']
    ],
    flags: [['--force', 'Force refresh', 'fwupdmgr'], ['-p', 'Printers', 'lpstat'], ['-d', 'Default printer', 'lpstat'], ['scan on', 'Discover devices', 'bluetoothctl'], ['pair / trust / connect', 'Pairing steps', 'bluetoothctl']],
    demo: ['fwupdmgr get-updates', 'Devices with no available firmware updates:\n • UEFI dbx\n • Intel Management Engine\nLENOVO 21MCCTO1WW\n│\n└─System Firmware:\n  │   Device ID:          a45df35ac0e948ee180fe216a5f703f32dda163f\n  │   Current version:    0.1.31\n  │   Vendor:             LENOVO (DMI:LENOVO)\n  │\n  └─ThinkPad T14 Gen 5 System Update:\n        New version:      0.1.34\n        Remote ID:        lvfs\n        Summary:          Lenovo ThinkPad T14 Gen 5 System Firmware\n        Release Flags:    Trusted metadata, Is upgrade'] }
]});

UB.sec({ id: 'android', title: 'Android & Phone', icon: '📱', desc: 'adb/fastboot, screen mirroring, file transfer and phone integration.', cards: [
  { id: 'adb', title: 'adb basics', intro: 'Talk to an Android device over USB or Wi-Fi.',
    cmds: [
      ['sudo apt install adb fastboot', 'Android platform tools from the archive'],
      ['adb devices -l', 'Connected devices (approve the prompt on the phone)'],
      ['adb shell', 'Shell on the phone'],
      ['adb install -r app-release.apk', 'Install or update an APK'],
      ['adb shell pm list packages -3', 'Third-party apps'],
      ['adb pull /sdcard/DCIM/Camera ./photos', 'Copy photos to the PC'],
      ['adb push music.mp3 /sdcard/Music/', 'Copy a file to the phone'],
      ['adb logcat -s ActivityManager', 'Filtered device log'],
      ['adb pair 192.168.1.33:37099', 'Wireless debugging pairing (Android 11+)'],
      ['adb connect 192.168.1.33:41567', 'Connect over Wi-Fi']
    ],
    flags: [['-l', 'Long device list', 'adb'], ['-s <serial>', 'Pick a device', 'adb'], ['-r', 'Replace existing app', 'adb'], ['-3', 'Third-party only (pm list)', 'adb']],
    demo: ['adb devices -l', 'List of devices attached\nR5CT31ABCDE            device usb:3-1 product:e3qxeea model:SM_S928B device:e3q transport_id:2'],
    tips: ['Enable Developer options (tap Build number 7×) → USB debugging.', 'If the device shows "no permissions", install `android-sdk-platform-tools-common` for udev rules and replug.'] },
  { id: 'fastboot', title: 'Bootloader & flashing', intro: 'fastboot for unlocking and flashing images.',
    cmds: [
      ['adb reboot bootloader', 'Reboot into the bootloader'],
      ['fastboot devices', 'Devices in fastboot mode'],
      ['fastboot getvar current-slot', 'Active A/B slot'],
      ['fastboot flashing unlock', 'Unlock the bootloader (wipes data!)'],
      ['fastboot flash boot boot.img', 'Flash a partition'],
      ['fastboot reboot', 'Reboot normally'],
      ['adb sideload ota.zip', 'Sideload an OTA from recovery']
    ],
    flags: [['flash <part> <img>', 'Write image', 'fastboot'], ['flashing unlock|lock', 'Bootloader state', 'fastboot'], ['--set-active=a|b', 'Slot', 'fastboot'], ['-w', 'Wipe userdata', 'fastboot']],
    demo: ['fastboot devices', '1A2B3C4D5E6F\tfastboot'],
    warn: ['Unlocking the bootloader erases the phone and may affect warranty or banking apps.'] },
  { id: 'mirror', title: 'Mirror & integrate', intro: 'scrcpy, GSConnect/KDE Connect, MTP.',
    cmds: [
      ['sudo apt install scrcpy', 'Screen mirroring and control'],
      ['scrcpy -m 1280 -b 8M', 'Mirror at 1280 px, 8 Mbit/s'],
      ['scrcpy -S --stay-awake', 'Turn phone screen off while mirroring'],
      ['scrcpy --video-source=camera --camera-facing=back', 'Use the phone camera as a webcam source'],
      ['sudo apt install gnome-shell-extension-gsconnect', 'GSConnect (KDE Connect protocol for GNOME)'],
      ['sudo apt install kdeconnect', 'KDE Connect (Kubuntu)'],
      ['gio mount -li | grep -i mtp', 'Phone storage mounted via MTP']
    ],
    flags: [['-m <px>', 'Max size', 'scrcpy'], ['-b <rate>', 'Bitrate', 'scrcpy'], ['-S', 'Screen off', 'scrcpy'], ['--record file.mp4', 'Record', 'scrcpy'], ['--no-audio', 'No audio', 'scrcpy']],
    demo: ['scrcpy -m 1280 -b 8M', 'scrcpy 3.3.1 <https://github.com/Genymobile/scrcpy>\nINFO: ADB device found:\nINFO:     -->   (usb)  R5CT31ABCDE    device  SM_S928B\n/usr/share/scrcpy/scrcpy-server: 1 file pushed.\nINFO: Renderer: opengl\nINFO: Texture: 1280x576'],
    tips: ['GSConnect needs ports 1714–1764 TCP/UDP open: `sudo ufw allow 1714:1764/udp` and `sudo ufw allow 1714:1764/tcp`.'] }
]});
