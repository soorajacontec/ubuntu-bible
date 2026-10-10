/* Network, Services, System, Firewall, AppArmor, Security, Disk */
UB.sec({ id: 'network', title: 'Network', icon: '🌐', desc: 'Netplan, NetworkManager, systemd-resolved and the iproute2 toolbox.', cards: [
  { id: 'inspect', title: 'Inspect interfaces & routes', intro: 'ip, ss and friends.',
    cmds: [
      ['ip -br -c a', 'One line per interface with addresses'],
      ['ip r', 'Routing table', 'default via 192.168.1.1 dev wlp0s20f3 proto dhcp src 192.168.1.42 metric 600\n192.168.1.0/24 dev wlp0s20f3 proto kernel scope link src 192.168.1.42 metric 600'],
      ['ip route get 1.1.1.1', 'Which route/interface a destination uses'],
      ['sudo ss -tulpn', 'Listening TCP/UDP ports with processes'],
      ['ping -c 4 ubuntu.com', 'Test reachability'],
      ['tracepath ubuntu.com', 'Trace the path (no root needed)'],
      ['curl -I https://ubuntu.com', 'HTTP headers only'],
      ['ip neigh', 'ARP / neighbour cache']
    ],
    flags: [['-br', 'Brief output', 'ip'], ['-c', 'Colour', 'ip'], ['-4 / -6', 'Address family', 'ip'], ['-t -u', 'TCP / UDP', 'ss'], ['-l', 'Listening', 'ss'], ['-p', 'Process', 'ss'], ['-n', 'Numeric', 'ss'], ['-c <N>', 'Packet count', 'ping']],
    demo: [['ip -br -c a', 'lo               UNKNOWN        127.0.0.1/8 ::1/128\nenp0s31f6        DOWN\nwlp0s20f3        UP             192.168.1.42/24 fe80::4a1c:2bff:fe9e:11d0/64\ndocker0          DOWN           172.17.0.1/16\nvirbr0           DOWN           192.168.122.1/24'],
      ['sudo ss -tulpn', 'Netid State  Recv-Q Send-Q  Local Address:Port  Peer Address:Port Process\nudp   UNCONN 0      0          127.0.0.54:53         0.0.0.0:*     users:(("systemd-resolve",pid=812,fd=16))\nudp   UNCONN 0      0       127.0.0.53%lo:53         0.0.0.0:*     users:(("systemd-resolve",pid=812,fd=14))\ntcp   LISTEN 0      4096       127.0.0.54:53         0.0.0.0:*     users:(("systemd-resolve",pid=812,fd=17))\ntcp   LISTEN 0      4096          0.0.0.0:22         0.0.0.0:*     users:(("sshd",pid=1,fd=79),("systemd",pid=1,fd=79))\ntcp   LISTEN 0      511           0.0.0.0:80         0.0.0.0:*     users:(("nginx",pid=4210,fd=5))']],
    tips: ['sshd shows pid 1 (systemd) because Ubuntu socket-activates SSH via ssh.socket.', '`ifconfig`/`netstat` live in the legacy `net-tools` package; prefer `ip` and `ss`.'] },
  { id: 'netplan', title: 'Netplan (static IP, bridges)', intro: 'YAML in /etc/netplan rendered to NetworkManager or systemd-networkd.',
    cmds: [
      ['ls /etc/netplan/', 'Netplan YAML files'],
      ['sudo netplan get', 'Merged current configuration'],
      ['sudo netplan set ethernets.enp1s0.dhcp4=false', 'Change a key without editing YAML'],
      ['sudo nano /etc/netplan/50-cloud-init.yaml', 'Edit config (server)'],
      ['sudo netplan generate', 'Validate and render backend config'],
      ['sudo netplan try', 'Apply with automatic rollback after 120 s'],
      ['sudo netplan apply', 'Apply permanently'],
      ['netplan status --all', 'Live state of all interfaces'],
      ['sudo chmod 600 /etc/netplan/*.yaml', 'Fix "permissions too open" warnings']
    ],
    flags: [['renderer: networkd', 'Use systemd-networkd (server default)', 'netplan'], ['renderer: NetworkManager', 'Use NetworkManager (desktop default)', 'netplan'], ['dhcp4: true', 'DHCP for IPv4', 'netplan'], ['addresses: [10.0.0.5/24]', 'Static addresses', 'netplan'], ['routes: - to: default via: 10.0.0.1', 'Default route', 'netplan'], ['nameservers: addresses: [1.1.1.1]', 'DNS servers', 'netplan'], ['bridges: br0: interfaces: [enp1s0]', 'Create a bridge', 'netplan']],
    demo: [['sudo netplan get', 'network:\n  version: 2\n  ethernets:\n    enp1s0:\n      addresses:\n      - "10.0.0.5/24"\n      nameservers:\n        addresses:\n        - 1.1.1.1\n        - 9.9.9.9\n      routes:\n      - to: "default"\n        via: "10.0.0.1"'],
      ['sudo netplan try', 'Do you want to keep these settings?\n\n\nPress ENTER before the timeout to accept the new configuration\n\n\nChanges will revert in 118 seconds\nConfiguration accepted.']],
    tips: ['Use `netplan try` over SSH — if you lose connectivity it rolls back automatically.', 'On desktops, changes made in GNOME Settings are stored by NetworkManager as Netplan YAML (90-NM-*.yaml).'] },
  { id: 'nm', title: 'NetworkManager (nmcli)', intro: 'Wi-Fi, VPN and connection profiles on desktops.',
    cmds: [
      ['nmcli general status', 'Overall connectivity'],
      ['nmcli device wifi list', 'Scan for Wi-Fi networks'],
      ['nmcli device wifi connect "HomeNet" --ask', 'Join Wi-Fi (prompts for password)'],
      ['nmcli connection show', 'Saved profiles'],
      ['nmcli con mod "HomeNet" ipv4.addresses 192.168.1.50/24 ipv4.gateway 192.168.1.1 ipv4.dns "1.1.1.1" ipv4.method manual', 'Make a profile static'],
      ['nmcli con up "HomeNet"', 'Activate a profile'],
      ['nmcli device wifi hotspot ssid MyHotspot password "s3cretpass"', 'Create a Wi-Fi hotspot'],
      ['nmcli radio wifi off', 'Turn Wi-Fi off'],
      ['nmtui', 'Text-mode UI for NetworkManager']
    ],
    flags: [['-t', 'Terse', 'nmcli'], ['-f <fields>', 'Field selection', 'nmcli'], ['--ask', 'Prompt for secrets', 'nmcli'], ['ipv4.method manual|auto', 'Static or DHCP', 'nmcli'], ['connection.autoconnect yes|no', 'Connect automatically', 'nmcli']],
    demo: ['nmcli device wifi list', 'IN-USE  BSSID              SSID        MODE   CHAN  RATE        SIGNAL  BARS  SECURITY\n*       4C:ED:FB:12:34:56  HomeNet     Infra  36    866 Mbit/s  88      ▂▄▆█  WPA3\n        4C:ED:FB:12:34:57  HomeNet-2G  Infra  6     195 Mbit/s  74      ▂▄▆_  WPA2 WPA3\n        A0:63:91:AB:CD:EF  Office      Infra  11    130 Mbit/s  41      ▂▄__  WPA2'] },
  { id: 'dns', title: 'DNS with systemd-resolved', intro: 'The stub resolver on 127.0.0.53.',
    cmds: [
      ['resolvectl status', 'DNS servers per interface'],
      ['resolvectl query ubuntu.com', 'Resolve and show which link answered'],
      ['resolvectl flush-caches', 'Flush the DNS cache'],
      ['resolvectl statistics', 'Cache hits and misses'],
      ['dig +short ubuntu.com', 'Direct DNS query (apt install bind9-dnsutils)'],
      ['sudo mkdir -p /etc/systemd/resolved.conf.d', 'Directory for resolved drop-ins'],
      ['sudo systemctl restart systemd-resolved', 'Apply resolved.conf changes'],
      ['ls -l /etc/resolv.conf', 'Should point to the stub', 'lrwxrwxrwx 1 root root 39 Apr 24 18:01 /etc/resolv.conf -> ../run/systemd/resolve/stub-resolv.conf']
    ],
    flags: [['DNS=', 'Global DNS servers', 'resolved.conf'], ['FallbackDNS=', 'Used if nothing else configured', 'resolved.conf'], ['DNSOverTLS=yes|opportunistic', 'Encrypt DNS', 'resolved.conf'], ['DNSSEC=allow-downgrade', 'Validate when possible', 'resolved.conf'], ['Domains=~.', 'Route all queries to this link', 'resolved.conf']],
    demo: ['resolvectl status', 'Global\n         Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported\n  resolv.conf mode: stub\n\nLink 2 (enp0s31f6)\n    Current Scopes: none\n         Protocols: -DefaultRoute -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported\n\nLink 3 (wlp0s20f3)\n    Current Scopes: DNS\n         Protocols: +DefaultRoute -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported\nCurrent DNS Server: 192.168.1.1\n       DNS Servers: 192.168.1.1 fe80::1%3\n        DNS Domain: lan'],
    tips: ['On desktops, set DNS per connection in NetworkManager; on servers, set `nameservers:` in Netplan.'] },
  { id: 'vpn', title: 'VPN: WireGuard & Tailscale', intro: 'Secure tunnels.',
    cmds: [
      ['sudo apt install wireguard', 'WireGuard tools (kernel module is built in)'],
      ['wg genkey | tee private.key | wg pubkey > public.key', 'Generate a key pair'],
      ['sudo wg-quick up wg0', 'Bring up /etc/wireguard/wg0.conf'],
      ['sudo wg show', 'Peers, handshakes and transfer'],
      ['sudo systemctl enable --now wg-quick@wg0', 'Start the tunnel at boot'],
      ['sudo nmcli connection import type wireguard file wg0.conf', 'Import into NetworkManager (GUI toggle)'],
      ['curl -fsSL https://tailscale.com/install.sh | sh', 'Install Tailscale (official script)'],
      ['sudo tailscale up --ssh', 'Join your tailnet with Tailscale SSH']
    ],
    flags: [['up / down', 'Start / stop interface', 'wg-quick'], ['[Interface] Address', 'Tunnel IP', 'wg0.conf'], ['[Peer] AllowedIPs', 'Routed subnets (0.0.0.0/0 = full tunnel)', 'wg0.conf'], ['PersistentKeepalive = 25', 'Keep NAT mappings alive', 'wg0.conf']],
    demo: ['sudo wg show', 'interface: wg0\n  public key: x8bF2v0C+3VQ6xkqZy1u0YtPq7bm1s2NdHq9uW4kQ0Q=\n  private key: (hidden)\n  listening port: 51820\n\npeer: Qm3vZ7Ty9k1E0dCq8m4XgB2LwP5sR6aJ1nHc0uV7yX8=\n  endpoint: 203.0.113.10:51820\n  allowed ips: 10.8.0.0/24\n  latest handshake: 12 seconds ago\n  transfer: 18.42 MiB received, 3.17 MiB sent'],
    warn: ['Review any `curl | sh` installer before running it.'] }
]});

UB.sec({ id: 'services', title: 'Services', icon: '⚙️', desc: 'systemd units: start, enable, inspect, override, timers and user services.', cards: [
  { id: 'control', title: 'Start, stop, enable', intro: 'Control service state now and at boot.',
    cmds: [
      ['systemctl status ssh', 'Status and recent log lines'],
      ['sudo systemctl start nginx', 'Start now'],
      ['sudo systemctl stop nginx', 'Stop now'],
      ['sudo systemctl restart nginx', 'Restart'],
      ['sudo systemctl reload nginx', 'Reload config without dropping connections'],
      ['sudo systemctl enable --now nginx', 'Start now and at every boot'],
      ['sudo systemctl disable --now cups', 'Stop now and disable at boot'],
      ['sudo systemctl mask bluetooth', 'Prevent a unit from ever starting'],
      ['systemctl is-active nginx', 'Prints active/inactive (script friendly)', 'active'],
      ['systemctl is-enabled nginx', 'Prints enabled/disabled', 'enabled']
    ],
    flags: [['--now', 'Also start/stop (with enable/disable)'], ['--user', 'User service manager'], ['--no-pager', 'Print directly'], ['-l', 'Do not truncate lines'], ['-H user@host', 'Remote host']],
    demo: ['systemctl status ssh', '● ssh.service - OpenBSD Secure Shell server\n     Loaded: loaded (/usr/lib/systemd/system/ssh.service; disabled; preset: enabled)\n     Active: active (running) since Sat 2026-10-03 09:40:11 +03; 4min ago\nTriggeredBy: ● ssh.socket\n       Docs: man:sshd(8)\n             man:sshd_config(5)\n   Main PID: 5034 (sshd)\n      Tasks: 1 (limit: 18821)\n     Memory: 3.1M (peak: 4.6M)\n        CPU: 41ms\n     CGroup: /system.slice/ssh.service\n             └─5034 "sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups"\n\nOct 03 09:40:11 ubuntu systemd[1]: Starting ssh.service - OpenBSD Secure Shell server...\nOct 03 09:40:11 ubuntu sshd[5034]: Server listening on 0.0.0.0 port 22.\nOct 03 09:40:11 ubuntu systemd[1]: Started ssh.service - OpenBSD Secure Shell server.'],
    tips: ['The unit name may differ from the program: SSH is `ssh`, Apache is `apache2`, Docker is `docker`.'] },
  { id: 'list', title: 'List & inspect units', intro: 'What is running and how it is configured.',
    cmds: [
      ['systemctl list-units --type=service --state=running', 'Running services'],
      ['systemctl list-unit-files --state=enabled', 'Services enabled at boot'],
      ['systemctl cat nginx', 'Unit file plus drop-ins'],
      ['systemctl show nginx -p MainPID,MemoryCurrent', 'Selected properties'],
      ['systemctl list-dependencies graphical.target', 'Dependency tree'],
      ['systemd-analyze security ssh', 'Sandboxing exposure score'],
      ['systemd-cgls', 'Control-group tree of processes']
    ],
    flags: [['-t, --type', 'service, socket, timer, mount…'], ['--state', 'running, failed, enabled…'], ['-p <prop>', 'Property names'], ['--all', 'Include inactive']],
    demo: ['systemctl list-units --type=service --state=running', '  UNIT                        LOAD   ACTIVE SUB     DESCRIPTION\n  accounts-daemon.service     loaded active running Accounts Service\n  avahi-daemon.service        loaded active running Avahi mDNS/DNS-SD Stack\n  chrony.service              loaded active running chrony, an NTP client/server\n  cron.service                loaded active running Regular background program processing daemon\n  dbus.service                loaded active running D-Bus System Message Bus\n  gdm.service                 loaded active running GNOME Display Manager\n  NetworkManager.service      loaded active running Network Manager\n  snapd.service               loaded active running Snap Daemon\n  systemd-journald.service    loaded active running Journal Service\n  systemd-logind.service      loaded active running User Login Management\n  systemd-resolved.service    loaded active running Network Name Resolution\n  udisks2.service             loaded active running Disk Manager\n\n12 loaded units listed.'] },
  { id: 'custom', title: 'Write & override units', intro: 'Drop-ins and your own services.',
    cmds: [
      ['sudo systemctl edit nginx', 'Create a drop-in override'],
      ['sudo systemctl edit --full myapp', 'Edit a whole copy of the unit'],
      ['sudo nano /etc/systemd/system/myapp.service', 'Write a new service unit'],
      ['sudo systemctl daemon-reload', 'Reload unit files after changes'],
      ['sudo systemctl revert nginx', 'Remove local overrides'],
      ['systemd-analyze verify /etc/systemd/system/myapp.service', 'Lint a unit file'],
      ['sudo systemd-run --unit=oneoff --on-active=10m /usr/local/bin/cleanup.sh', 'Run something once in 10 minutes']
    ],
    flags: [['ExecStart=', 'Command to run', 'unit'], ['Restart=on-failure', 'Restart policy', 'unit'], ['User=', 'Run as user', 'unit'], ['WorkingDirectory=', 'Working dir', 'unit'], ['Environment=K=V', 'Environment', 'unit'], ['WantedBy=multi-user.target', 'Enable target', 'unit'], ['ProtectSystem=strict', 'Read-only OS for the service', 'unit'], ['NoNewPrivileges=yes', 'Block privilege escalation', 'unit']],
    demo: ['systemctl cat myapp', '# /etc/systemd/system/myapp.service\n[Unit]\nDescription=My App API\nAfter=network-online.target\nWants=network-online.target\n\n[Service]\nUser=myapp\nWorkingDirectory=/opt/myapp\nExecStart=/opt/myapp/venv/bin/gunicorn -b 127.0.0.1:8000 app:app\nRestart=on-failure\nProtectSystem=strict\nNoNewPrivileges=yes\n\n[Install]\nWantedBy=multi-user.target'],
    warn: ['Never edit files in /usr/lib/systemd/system — package updates overwrite them. Use `systemctl edit`.'] },
  { id: 'timers', title: 'Timers & cron', intro: 'Scheduled jobs.',
    cmds: [
      ['systemctl list-timers', 'All timers and next run'],
      ['systemd-analyze calendar "Mon..Fri 02:30"', 'Check an OnCalendar expression'],
      ['sudo systemctl enable --now backup.timer', 'Activate a timer'],
      ['crontab -e', 'Edit your crontab'],
      ['crontab -l', 'List your cron jobs'],
      ['sudo ls /etc/cron.daily', 'Daily system jobs']
    ],
    flags: [['OnCalendar=daily', 'Calendar schedule', 'timer'], ['OnBootSec=5min', 'After boot', 'timer'], ['OnUnitActiveSec=1h', 'Repeat interval', 'timer'], ['Persistent=true', 'Catch up missed runs', 'timer'], ['RandomizedDelaySec=15m', 'Spread load', 'timer'], ['m h dom mon dow', 'Cron field order', 'crontab']],
    demo: ['systemctl list-timers', 'NEXT                            LEFT LAST                            PASSED UNIT                         ACTIVATES\nSat 2026-10-03 10:00:00 +03     15min Sat 2026-10-03 09:00:01 +03  44min ago sysstat-collect.timer       sysstat-collect.service\nSat 2026-10-03 11:40:12 +03  1h 55min Sat 2026-10-03 06:12:31 +03 3h 32min ago snapd.snap-repair.timer    snapd.snap-repair.service\nSat 2026-10-03 18:22:51 +03 8h 38min Sat 2026-10-03 06:41:07 +03 3h 3min ago apt-daily.timer             apt-daily.service\nSun 2026-10-04 00:00:00 +03     14h Sat 2026-10-03 00:00:01 +03 9h ago      logrotate.timer             logrotate.service\nSun 2026-10-04 06:18:44 +03     20h Sat 2026-10-03 06:22:10 +03 3h 22min ago apt-daily-upgrade.timer     apt-daily-upgrade.service\n\n5 timers listed.'] },
  { id: 'user', title: 'User services', intro: 'Services that run as you.',
    cmds: [
      ['systemctl --user status', 'Your user service manager'],
      ['systemctl --user enable --now syncthing', 'Start a per-user service'],
      ['journalctl --user -u syncthing -f', 'Follow a user service log'],
      ['sudo loginctl enable-linger ssk', 'Keep user services running after logout'],
      ['mkdir -p ~/.config/systemd/user', 'Where your own user units live']
    ],
    flags: [['--user', 'Operate on the user manager', 'systemctl'], ['enable-linger', 'Start user manager at boot', 'loginctl'], ['WantedBy=default.target', 'User-unit install target', 'unit']],
    demo: ['systemctl --user enable --now syncthing', "Created symlink '/home/ssk/.config/systemd/user/default.target.wants/syncthing.service' → '/usr/lib/systemd/user/syncthing.service'."] }
]});

UB.sec({ id: 'system', title: 'System', icon: '🖥️', desc: 'Hostname, time, locale, kernel parameters, alternatives and power.', cards: [
  { id: 'host', title: 'Hostname, time & locale', intro: 'hostnamectl, timedatectl, localectl.',
    cmds: [
      ['sudo hostnamectl set-hostname devbox', 'Change hostname'],
      ['timedatectl', 'Time, time zone and NTP state'],
      ['sudo timedatectl set-timezone Asia/Qatar', 'Set time zone'],
      ['timedatectl list-timezones | grep Asia', 'Find a zone name'],
      ['localectl', 'Locale and keyboard'],
      ['sudo localectl set-locale LANG=en_GB.UTF-8', 'Change system locale'],
      ['sudo dpkg-reconfigure locales', 'Generate additional locales'],
      ['sudo dpkg-reconfigure tzdata', 'Pick time zone interactively']
    ],
    flags: [['set-hostname', 'Static hostname', 'hostnamectl'], ['--pretty', 'Pretty name (spaces allowed)', 'hostnamectl'], ['set-timezone', 'Zone', 'timedatectl'], ['set-ntp true|false', 'Toggle network time', 'timedatectl'], ['set-keymap', 'Console keymap', 'localectl']],
    demo: ['timedatectl', '               Local time: Sat 2026-10-03 09:46:20 +03\n           Universal time: Sat 2026-10-03 06:46:20 UTC\n                 RTC time: Sat 2026-10-03 06:46:20\n                Time zone: Asia/Qatar (+03, +0300)\nSystem clock synchronized: yes\n              NTP service: active\n          RTC in local TZ: no'],
    tips: ['Edit /etc/hosts after changing the hostname so `127.0.1.1 devbox` matches.'] },
  { id: 'ntp', title: 'Time sync with chrony', intro: '26.04 uses chrony (with NTS) instead of systemd-timesyncd.',
    cmds: [
      ['chronyc tracking', 'Offset, stratum and drift'],
      ['chronyc sources -v', 'Time sources and their state'],
      ['sudo chronyc authdata', 'NTS authentication status'],
      ['sudo chronyc makestep', 'Step the clock immediately'],
      ['cat /etc/chrony/sources.d/ubuntu-ntp-pools.sources', 'Ubuntu\'s default NTS pools'],
      ['sudo systemctl restart chrony', 'Restart chrony after config changes']
    ],
    flags: [['server <host> iburst nts', 'NTS-authenticated server', 'chrony.conf'], ['pool <host> iburst', 'Pool of servers', 'chrony.conf'], ['makestep 1 3', 'Step if off by >1 s in first 3 updates', 'chrony.conf'], ['allow 192.168.1.0/24', 'Serve time to LAN', 'chrony.conf']],
    demo: ['chronyc tracking', 'Reference ID    : B9D03F12 (1.ntp.ubuntu.com)\nStratum         : 2\nRef time (UTC)  : Sat Oct 03 06:45:58 2026\nSystem time     : 0.000041231 seconds slow of NTP time\nLast offset     : -0.000018774 seconds\nRMS offset      : 0.000102116 seconds\nFrequency       : 7.412 ppm fast\nResidual freq   : -0.002 ppm\nSkew            : 0.081 ppm\nRoot delay      : 0.031204712 seconds\nRoot dispersion : 0.000611301 seconds\nUpdate interval : 1031.4 seconds\nLeap status     : Normal'],
    v24: '24.04 uses systemd-timesyncd: check with `timedatectl timesync-status`, configure in /etc/systemd/timesyncd.conf.' },
  { id: 'kernel', title: 'Kernel & sysctl', intro: 'Kernel versions, HWE and runtime tunables.',
    cmds: [
      ['uname -r', 'Running kernel'],
      ['apt list --installed "linux-image-*"', 'Installed kernels'],
      ['sudo apt install linux-generic-hwe-24.04', '24.04: opt in to the newer HWE kernel'],
      ['sysctl vm.swappiness', 'Read a kernel parameter', 'vm.swappiness = 60'],
      ['sudo sysctl -w net.ipv4.ip_forward=1', 'Set a parameter until reboot'],
      ['echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/60-forward.conf', 'Persist a parameter'],
      ['sudo sysctl --system', 'Reload all sysctl files'],
      ['lsmod | grep kvm', 'Loaded kernel modules'],
      ['sudo modprobe -r pcspkr', 'Unload a module'],
      ['cat /proc/cmdline', 'Kernel boot parameters']
    ],
    flags: [['-w', 'Write a value', 'sysctl'], ['-a', 'Show all', 'sysctl'], ['--system', 'Load /etc/sysctl.d/*', 'sysctl'], ['-p <file>', 'Load a file', 'sysctl'], ['-r', 'Remove module', 'modprobe']],
    demo: ['apt list --installed "linux-image-*"', 'linux-image-7.0.0-12-generic/resolute-updates,now 7.0.0-12.12 amd64 [installed,automatic]\nlinux-image-7.0.0-14-generic/resolute-updates,now 7.0.0-14.14 amd64 [installed,automatic]\nlinux-image-generic/resolute-updates,now 7.0.0-14.14 amd64 [installed,automatic]'],
    v24: '24.04 desktop installs track HWE kernels by default (6.8 → 6.11 → 6.14 → 6.17); servers stay on 6.8 GA unless you install the HWE metapackage.' },
  { id: 'alternatives', title: 'Alternatives & defaults', intro: 'Pick default editors, Java, sudo implementation…',
    cmds: [
      ['sudo update-alternatives --config editor', 'Choose the default editor'],
      ['sudo update-alternatives --config java', 'Choose the default Java'],
      ['update-alternatives --display x-terminal-emulator', 'Show candidates for a link'],
      ['sudo select-editor', 'Per-user editor for crontab etc.'],
      ['xdg-mime query default text/html', 'Default app for a MIME type', 'firefox_firefox.desktop'],
      ['xdg-settings set default-web-browser firefox_firefox.desktop', 'Set default browser']
    ],
    flags: [['--config <name>', 'Interactive selection', 'update-alternatives'], ['--set <name> <path>', 'Non-interactive', 'update-alternatives'], ['--display <name>', 'Show info', 'update-alternatives'], ['--auto <name>', 'Back to automatic', 'update-alternatives']],
    demo: ['sudo update-alternatives --config editor', 'There are 4 choices for the alternative editor (providing /usr/bin/editor).\n\n  Selection    Path                Priority   Status\n------------------------------------------------------------\n* 0            /bin/nano            40        auto mode\n  1            /bin/ed             -100       manual mode\n  2            /bin/nano            40        manual mode\n  3            /usr/bin/vim.basic   30        manual mode\n  4            /usr/bin/vim.tiny    15        manual mode\n\nPress <enter> to keep the current choice[*], or type selection number: 3\nupdate-alternatives: using /usr/bin/vim.basic to provide /usr/bin/editor (editor) in manual mode'] },
  { id: 'power', title: 'Power & reboot', intro: 'Shutdown, reboot and power profiles.',
    cmds: [
      ['sudo reboot', 'Reboot now'],
      ['sudo shutdown -h +10 "Maintenance"', 'Power off in 10 minutes with a message'],
      ['sudo shutdown -c', 'Cancel a scheduled shutdown'],
      ['systemctl suspend', 'Suspend to RAM'],
      ['sudo systemctl soft-reboot', 'Restart userspace without rebooting the kernel'],
      ['powerprofilesctl', 'Current power profile'],
      ['powerprofilesctl set power-saver', 'Switch profile'],
      ['cat /var/run/reboot-required', 'Is a reboot needed after updates?', '*** System restart required ***']
    ],
    flags: [['-h', 'Halt/power off', 'shutdown'], ['-r', 'Reboot', 'shutdown'], ['+N / hh:mm / now', 'When', 'shutdown'], ['-c', 'Cancel', 'shutdown']],
    demo: ['powerprofilesctl', '  performance:\n    CpuDriver:\tintel_pstate\n    Degraded:   no\n\n* balanced:\n    CpuDriver:\tintel_pstate\n    PlatformDriver:\tplatform_profile\n\n  power-saver:\n    CpuDriver:\tintel_pstate\n    PlatformDriver:\tplatform_profile'] }
]});

UB.sec({ id: 'firewall', title: 'Firewall', icon: '🧱', desc: 'ufw for everyday rules and nftables for full control.', cards: [
  { id: 'ufw', title: 'ufw basics', intro: 'Default deny incoming, allow what you need.',
    cmds: [
      ['sudo ufw status verbose', 'State, defaults and rules'],
      ['sudo ufw default deny incoming', 'Block unsolicited inbound traffic'],
      ['sudo ufw default allow outgoing', 'Allow outbound traffic'],
      ['sudo ufw allow OpenSSH', 'Allow SSH via its app profile'],
      ['sudo ufw enable', 'Turn the firewall on (persists across reboots)'],
      ['sudo ufw allow 443/tcp', 'Allow a port/protocol'],
      ['sudo ufw allow from 192.168.1.0/24 to any port 22 proto tcp', 'Allow SSH only from the LAN'],
      ['sudo ufw limit 22/tcp', 'Rate-limit SSH brute force'],
      ['sudo ufw status numbered', 'Rules with numbers'],
      ['sudo ufw delete 3', 'Delete rule number 3']
    ],
    flags: [['allow / deny / reject / limit', 'Rule action'], ['from <src>', 'Source address/subnet'], ['to any port <n>', 'Destination port'], ['proto tcp|udp', 'Protocol'], ['in on <iface>', 'Interface'], ['comment "text"', 'Annotation'], ['--dry-run', 'Show without applying']],
    demo: [['sudo ufw enable', 'Command may disrupt existing ssh connections. Proceed with operation (y|n)? y\nFirewall is active and enabled on system startup'],
      ['sudo ufw status verbose', 'Status: active\nLogging: on (low)\nDefault: deny (incoming), allow (outgoing), deny (routed)\nNew profiles: skip\n\nTo                         Action      From\n--                         ------      ----\n22/tcp (OpenSSH)           ALLOW IN    Anywhere\n443/tcp                    ALLOW IN    Anywhere\n22/tcp                     ALLOW IN    192.168.1.0/24\n22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)\n443/tcp (v6)               ALLOW IN    Anywhere (v6)']],
    warn: ['On a remote server, `ufw allow OpenSSH` BEFORE `ufw enable`, or you will lock yourself out.', 'Docker publishes ports by inserting its own rules, bypassing ufw. Bind containers to 127.0.0.1 or use the DOCKER-USER chain.'] },
  { id: 'ufw-adv', title: 'ufw apps, logging & routing', intro: 'Profiles, logs and forwarding.',
    cmds: [
      ['sudo ufw app list', 'Application profiles'],
      ['sudo ufw app info "Nginx Full"', 'Ports in a profile'],
      ['sudo ufw allow "Nginx Full"', 'Allow HTTP+HTTPS via profile'],
      ['sudo ufw logging medium', 'Set logging level'],
      ['sudo journalctl -k -g "UFW BLOCK"', 'See blocked packets'],
      ['sudo ufw route allow in on wg0 out on enp1s0', 'Allow forwarding between interfaces'],
      ['sudo ufw show added', 'Rules in command form'],
      ['sudo ufw reset', 'Remove all rules and disable']
    ],
    flags: [['app list|info|update', 'Profiles in /etc/ufw/applications.d', 'ufw'], ['logging off|low|medium|high|full', 'Log level', 'ufw'], ['route', 'FORWARD chain rules', 'ufw'], ['DEFAULT_FORWARD_POLICY', '/etc/default/ufw setting', 'ufw']],
    demo: ['sudo ufw app list', 'Available applications:\n  CUPS\n  Nginx Full\n  Nginx HTTP\n  Nginx HTTPS\n  OpenSSH'] },
  { id: 'nft', title: 'nftables', intro: 'The kernel firewall framework underneath.',
    cmds: [
      ['sudo nft list ruleset', 'Dump every table, chain and rule'],
      ['sudo nft add table inet filter', 'Create a table for IPv4+IPv6'],
      ['sudo nft add chain inet filter input "{ type filter hook input priority 0; policy drop; }"', 'Input chain with drop policy'],
      ['sudo nft add rule inet filter input ct state established,related accept', 'Allow return traffic'],
      ['sudo nft add rule inet filter input tcp dport { 22, 443 } accept', 'Allow ports'],
      ['sudo nft -a list chain inet filter input', 'Show rule handles'],
      ['sudo nft -c -f /etc/nftables.conf', 'Check a rules file'],
      ['sudo systemctl enable --now nftables', 'Load /etc/nftables.conf at boot']
    ],
    flags: [['inet / ip / ip6', 'Address family', 'nft'], ['hook input|forward|output', 'Netfilter hook', 'nft'], ['policy accept|drop', 'Chain default', 'nft'], ['ct state', 'Connection tracking state', 'nft'], ['-a', 'Show handles', 'nft'], ['-c -f', 'Check file only', 'nft']],
    demo: ['sudo nft list ruleset', 'table inet filter {\n\tchain input {\n\t\ttype filter hook input priority filter; policy drop;\n\t\tct state established,related accept\n\t\tiif "lo" accept\n\t\ttcp dport { 22, 443 } accept\n\t\ticmp type echo-request accept\n\t}\n}'],
    warn: ['Do not run ufw and a hand-written nftables.service ruleset at the same time — pick one.'] }
]});

UB.sec({ id: 'apparmor', title: 'AppArmor', icon: '🛡️', desc: 'Ubuntu\'s mandatory access control: profiles, modes and user-namespace restrictions.', cards: [
  { id: 'status', title: 'Status & modes', intro: 'Which profiles are loaded and how strict.',
    cmds: [
      ['sudo aa-status', 'Loaded profiles and their modes'],
      ['sudo apt install apparmor-utils', 'Tools: aa-enforce, aa-complain, aa-logprof…'],
      ['sudo aa-complain /etc/apparmor.d/usr.sbin.cupsd', 'Log violations without blocking'],
      ['sudo aa-enforce /etc/apparmor.d/usr.sbin.cupsd', 'Enforce a profile'],
      ['sudo aa-disable /etc/apparmor.d/usr.sbin.cupsd', 'Disable a profile'],
      ['sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.cupsd', 'Reload a profile after editing'],
      ['sudo journalctl -k -g apparmor="DENIED"', 'Find denials']
    ],
    flags: [['enforce', 'Violations blocked and logged'], ['complain', 'Violations only logged'], ['unconfined', 'No restrictions'], ['kill', 'Kill on violation (newer modes)'], ['prompt', 'Ask the user (prompting client, experimental)']],
    demo: ['sudo aa-status', 'apparmor module is loaded.\n142 profiles are loaded.\n97 profiles are in enforce mode.\n   /snap/snapd/24718/usr/lib/snapd/snap-confine\n   /usr/bin/man\n   /usr/sbin/chronyd\n   /usr/sbin/cups-browsed\n   /usr/sbin/cupsd\n   ...\n4 profiles are in complain mode.\n   transmission-cli\n   transmission-daemon\n41 profiles are in unconfined mode.\n   ...\n18 processes have profiles defined.\n16 processes are in enforce mode.\n2 processes are unconfined but have a profile defined.\n0 processes are in mixed mode.\n0 processes are in kill mode.'] },
  { id: 'profiles', title: 'Build a profile', intro: 'Generate and refine profiles from logs.',
    cmds: [
      ['sudo aa-genprof /usr/local/bin/myapp', 'Interactive profile generation'],
      ['sudo aa-logprof', 'Update profiles from logged denials'],
      ['sudo aa-autodep /usr/local/bin/myapp', 'Create a minimal starting profile'],
      ['ls /etc/apparmor.d/', 'Profile files'],
      ['sudo nano /etc/apparmor.d/local/usr.sbin.cupsd', 'Local additions that survive updates']
    ],
    flags: [['r w x m k l', 'Read, write, exec, mmap-exec, lock, link'], ['ix / px / ux', 'Exec inherit / profile / unconfined'], ['#include <abstractions/base>', 'Common rule sets'], ['capability net_bind_service,', 'Grant a capability'], ['network inet tcp,', 'Allow TCP']],
    demo: ['ls /etc/apparmor.d/', 'abi            local                   usr.bin.man\nabstractions   lsb_release             usr.sbin.chronyd\napache2.d      nvidia_modprobe         usr.sbin.cups-browsed\nbalena-etcher  sbin.dhclient           usr.sbin.cupsd\nchrome         tunables                usr.sbin.rsyslogd\ndisable        unprivileged_userns     ...'] },
  { id: 'userns', title: 'Unprivileged user namespaces', intro: 'Why some AppImages and sandboxes fail.',
    cmds: [
      ['sysctl kernel.apparmor_restrict_unprivileged_userns', 'Is the restriction on?', 'kernel.apparmor_restrict_unprivileged_userns = 1'],
      ['sudo journalctl -k -g "userns_create"', 'Denials caused by the restriction'],
      ['sudo nano /etc/apparmor.d/myappimage', 'Write a profile that grants userns for one app'],
      ['sudo apparmor_parser -r /etc/apparmor.d/myappimage', 'Load it']
    ],
    flags: [['userns,', 'Rule that allows creating user namespaces', 'profile'], ['flags=(unconfined)', 'Profile mode for app-specific exception', 'profile']],
    demo: ['cat /etc/apparmor.d/myappimage', 'abi <abi/4.0>,\ninclude <tunables/global>\n\nprofile myappimage /home/ssk/Apps/MyApp.AppImage flags=(unconfined) {\n  userns,\n  include if exists <local/myappimage>\n}'],
    warn: ['Setting the sysctl to 0 disables the protection for the whole system. Prefer a per-app profile.'],
    tips: ['Introduced in 23.10 and enabled in 24.04; Chrome, VS Code and other common apps ship with profiles already.'] }
]});

UB.sec({ id: 'security', title: 'Security', icon: '🔐', desc: 'Automatic updates, intrusion prevention, auditing, encryption and the Security Center.', cards: [
  { id: 'updates', title: 'Automatic security updates', intro: 'unattended-upgrades is on by default.',
    cmds: [
      ['sudo dpkg-reconfigure -plow unattended-upgrades', 'Turn automatic updates on/off'],
      ['cat /etc/apt/apt.conf.d/20auto-upgrades', 'Is it enabled?', 'APT::Periodic::Update-Package-Lists "1";\nAPT::Periodic::Unattended-Upgrade "1";'],
      ['sudo nano /etc/apt/apt.conf.d/50unattended-upgrades', 'Origins, blacklist, auto-reboot'],
      ['sudo unattended-upgrade --dry-run --debug', 'Test what would be installed'],
      ['less /var/log/unattended-upgrades/unattended-upgrades.log', 'What was installed automatically'],
      ['pro security-status', 'Security coverage of installed packages']
    ],
    flags: [['Unattended-Upgrade::Automatic-Reboot "true";', 'Reboot when required', '50unattended-upgrades'], ['Unattended-Upgrade::Automatic-Reboot-Time "03:00";', 'Reboot time', '50unattended-upgrades'], ['Unattended-Upgrade::Package-Blacklist', 'Never auto-update these', '50unattended-upgrades'], ['Unattended-Upgrade::Mail', 'Email reports', '50unattended-upgrades']],
    demo: ['pro security-status', '2187 packages installed:\n     1764 packages from Ubuntu Main/Restricted repository\n      409 packages from Ubuntu Universe/Multiverse repository\n       14 packages no longer available for download\n\nTo get more information about the packages, run\n    pro security-status --help\nfor a list of available options.\n\nThis machine is receiving security patching for Ubuntu Main/Restricted\nrepository until 2031.\nThis machine is not attached to an Ubuntu Pro subscription.\n\nUbuntu Pro with \'esm-apps\' enabled provides security updates for\nUniverse/Multiverse packages until 2036.'] },
  { id: 'fail2ban', title: 'fail2ban', intro: 'Ban IPs that brute-force SSH or web logins.',
    cmds: [
      ['sudo apt install fail2ban', 'Install fail2ban'],
      ['sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local', 'Make a local config'],
      ['sudo systemctl enable --now fail2ban', 'Start it'],
      ['sudo fail2ban-client status', 'Active jails'],
      ['sudo fail2ban-client status sshd', 'Banned IPs for SSH'],
      ['sudo fail2ban-client set sshd unbanip 203.0.113.7', 'Unban an address']
    ],
    flags: [['bantime = 1h', 'Ban length', 'jail.local'], ['findtime = 10m', 'Window to count failures', 'jail.local'], ['maxretry = 5', 'Failures before ban', 'jail.local'], ['backend = systemd', 'Read the journal', 'jail.local'], ['ignoreip', 'Never ban these', 'jail.local']],
    demo: ['sudo fail2ban-client status sshd', 'Status for the jail: sshd\n|- Filter\n|  |- Currently failed:\t3\n|  |- Total failed:\t412\n|  `- Journal matches:\t_SYSTEMD_UNIT=ssh.service + _COMM=sshd\n`- Actions\n   |- Currently banned:\t2\n   |- Total banned:\t57\n   `- Banned IP list:\t203.0.113.7 198.51.100.23'] },
  { id: 'audit', title: 'Audit & hardening', intro: 'Find weaknesses and track changes.',
    cmds: [
      ['sudo apt install lynis', 'Security auditing tool'],
      ['sudo lynis audit system', 'Full hardening audit with suggestions'],
      ['sudo apt install auditd', 'Kernel audit framework'],
      ['sudo auditctl -w /etc/passwd -p wa -k passwd', 'Watch a file for writes'],
      ['sudo ausearch -k passwd', 'Search audit events by key'],
      ['sudo pro enable usg', 'Ubuntu Security Guide (CIS/DISA-STIG) — Pro'],
      ['sudo usg audit cis_level1_server', 'CIS benchmark audit — Pro'],
      ['sudo apt install clamav', 'Antivirus scanner (mostly for files you share)']
    ],
    flags: [['-w <path>', 'Watch path', 'auditctl'], ['-p rwxa', 'Permissions to watch', 'auditctl'], ['-k <key>', 'Search key', 'auditctl'], ['--quick', 'No pauses', 'lynis']],
    demo: ['sudo lynis audit system', '[ Lynis 3.1.4 ]\n\n  ...\n  -[ Lynis 3.1.4 Results ]-\n\n  Warnings (1):\n  ----------------------------\n  ! Found some information disclosure in SMTP banner [MAIL-8818]\n\n  Suggestions (27):\n  ----------------------------\n  * Consider hardening SSH configuration [SSH-7408]\n      - Details  : AllowTcpForwarding (set YES to NO)\n  * Install a PAM module for password strength testing like pam_cracklib or pam_passwdqc [AUTH-9262]\n  ...\n  Hardening index : 68 [#############       ]\n  Tests performed : 271'] },
  { id: 'crypto', title: 'Encryption & keys', intro: 'LUKS, TPM-backed FDE, GPG.',
    cmds: [
      ['sudo cryptsetup luksDump /dev/nvme0n1p3', 'Inspect a LUKS header'],
      ['sudo cryptsetup luksAddKey /dev/nvme0n1p3', 'Add a backup passphrase'],
      ['sudo cryptsetup luksFormat --type luks2 /dev/sdb1', 'Encrypt a new partition (erases it!)'],
      ['sudo cryptsetup open /dev/sdb1 usbcrypt', 'Unlock to /dev/mapper/usbcrypt'],
      ['gpg --full-generate-key', 'Create a GPG key'],
      ['gpg --verify SHA256SUMS.gpg SHA256SUMS', 'Verify an Ubuntu ISO checksum signature'],
      ['sha256sum -c SHA256SUMS --ignore-missing', 'Check ISO integrity']
    ],
    flags: [['luksFormat', 'Create LUKS header', 'cryptsetup'], ['open / close', 'Unlock / lock', 'cryptsetup'], ['luksAddKey / luksRemoveKey', 'Manage key slots', 'cryptsetup'], ['--type luks2', 'LUKS version', 'cryptsetup']],
    demo: ['sha256sum -c SHA256SUMS --ignore-missing', 'ubuntu-26.04.1-desktop-amd64.iso: OK'],
    tips: ['26.04\'s Security Center (desktop app) manages TPM-backed encryption, recovery keys and app permissions.'],
    warn: ['Store LUKS/TPM recovery keys somewhere off the machine. Firmware updates or BIOS changes can trigger recovery-key prompts.'] }
]});

UB.sec({ id: 'disk', title: 'Disk', icon: '💽', desc: 'Partitions, filesystems, fstab, LVM, ZFS, Btrfs and SSD health.', cards: [
  { id: 'inspect', title: 'Inspect disks', intro: 'What is attached and how full it is.',
    cmds: [
      ['lsblk -f', 'Devices, filesystems, labels, UUIDs'],
      ['lsblk -e7 -o NAME,SIZE,TYPE,MOUNTPOINTS,MODEL', 'Hide snap loop devices'],
      ['sudo blkid', 'UUIDs and types'],
      ['sudo fdisk -l /dev/nvme0n1', 'Partition table'],
      ['findmnt -t ext4,btrfs,zfs,vfat', 'Mounted filesystems by type'],
      ['sudo smartctl -H /dev/nvme0n1', 'Drive health (apt install smartmontools)'],
      ['sudo fstrim -av', 'Trim SSDs now (also runs weekly via fstrim.timer)']
    ],
    flags: [['-f', 'Filesystem info', 'lsblk'], ['-e7', 'Exclude loop devices', 'lsblk'], ['-o', 'Columns', 'lsblk'], ['-l', 'List partitions', 'fdisk'], ['-a -v', 'All mounted / verbose', 'fstrim']],
    demo: ['lsblk -f', 'NAME        FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS\nnvme0n1\n├─nvme0n1p1 vfat   FAT32       5A1C-9F3E                               1.1G     1% /boot/efi\n├─nvme0n1p2 ext4   1.0         c1b2d3e4-8f9a-4b0c-9d1e-2f3a4b5c6d7e     58.2G    85% /\n└─nvme0n1p3 crypto 2           8e7d6c5b-4a39-4281-90fe-dcba98765432\nsda\n└─sda1      exfat  1.0   USB   1A2B-3C4D                               28.9G     2% /media/ssk/USB'],
    tips: ['Snap mounts its packages as loop devices; `-e7` hides them from lsblk.'] },
  { id: 'partition', title: 'Partition, format, mount', intro: 'Prepare a new disk.',
    cmds: [
      ['sudo parted /dev/sdb --script mklabel gpt mkpart data ext4 1MiB 100%', 'GPT + one partition'],
      ['sudo mkfs.ext4 -L data /dev/sdb1', 'Format ext4 with a label'],
      ['sudo mkfs.exfat -n USB /dev/sdc1', 'Format exFAT for cross-platform USB'],
      ['sudo mkdir -p /mnt/data', 'Create a mount point'],
      ['sudo mount /dev/sdb1 /mnt/data', 'Mount now'],
      ['echo "UUID=$(sudo blkid -s UUID -o value /dev/sdb1) /mnt/data ext4 defaults,noatime 0 2" | sudo tee -a /etc/fstab', 'Mount at boot by UUID'],
      ['sudo findmnt --verify', 'Validate /etc/fstab before rebooting'],
      ['sudo mount -a', 'Mount everything in fstab'],
      ['sudo umount /mnt/data', 'Unmount'],
      ['gnome-disks', 'GUI Disks utility']
    ],
    flags: [['mklabel gpt', 'New partition table', 'parted'], ['mkpart', 'New partition', 'parted'], ['-L <label>', 'Filesystem label', 'mkfs.ext4'], ['defaults,noatime', 'Mount options (fstab)', 'fstab'], ['nofail', 'Boot even if missing (fstab)', 'fstab'], ['0 2', 'dump / fsck order (fstab)', 'fstab']],
    demo: ['sudo findmnt --verify', '   [W] your fstab has been modified, but systemd still uses the old version;\n       use \'systemctl daemon-reload\' to reload\n\n0 parse errors, 0 errors, 1 warning'],
    warn: ['Triple-check device names: formatting /dev/sda instead of /dev/sdb destroys data. Use `lsblk` first.'] },
  { id: 'lvm', title: 'LVM', intro: 'Flexible volumes (default for Ubuntu Server guided installs).',
    cmds: [
      ['sudo pvs', 'Physical volumes'],
      ['sudo vgs', 'Volume groups and free space'],
      ['sudo lvs', 'Logical volumes'],
      ['sudo lvextend -r -l +100%FREE /dev/ubuntu-vg/ubuntu-lv', 'Grow root LV and filesystem into all free space'],
      ['sudo pvcreate /dev/sdb', 'Turn a disk into a PV'],
      ['sudo vgextend ubuntu-vg /dev/sdb', 'Add the PV to a VG'],
      ['sudo lvcreate -L 50G -n data ubuntu-vg', 'Create a 50 GB LV'],
      ['sudo lvcreate -s -L 5G -n root-snap /dev/ubuntu-vg/ubuntu-lv', 'Snapshot an LV']
    ],
    flags: [['-L <size>', 'Absolute size', 'lvcreate'], ['-l +100%FREE', 'All remaining extents', 'lvextend'], ['-r', 'Resize filesystem too', 'lvextend'], ['-s', 'Snapshot', 'lvcreate'], ['-n <name>', 'LV name', 'lvcreate']],
    demo: [['sudo vgs', '  VG        #PV #LV #SN Attr   VSize    VFree\n  ubuntu-vg   1   1   0 wz--n- <98.00g <49.00g'],
      ['sudo lvextend -r -l +100%FREE /dev/ubuntu-vg/ubuntu-lv', '  Size of logical volume ubuntu-vg/ubuntu-lv changed from 49.00 GiB (12544 extents) to <98.00 GiB (25087 extents).\n  Logical volume ubuntu-vg/ubuntu-lv successfully resized.\nresize2fs 1.47.2 (1-Jan-2025)\nFilesystem at /dev/mapper/ubuntu--vg-ubuntu--lv is mounted on /; on-line resizing required\nold_desc_blocks = 7, new_desc_blocks = 13\nThe filesystem on /dev/mapper/ubuntu--vg-ubuntu--lv is now 25689088 (4k) blocks long.']],
    tips: ['Ubuntu Server\'s installer only gives half the disk to the root LV — the `lvextend` above is a classic first step.'] },
  { id: 'zfs', title: 'ZFS', intro: 'Pools, datasets, snapshots and send/receive.',
    cmds: [
      ['sudo apt install zfsutils-linux', 'ZFS userspace tools (module ships with Ubuntu kernels)'],
      ['sudo zpool create -o ashift=12 tank mirror /dev/sdb /dev/sdc', 'Create a mirrored pool'],
      ['zpool status', 'Pool health'],
      ['sudo zfs create -o compression=zstd tank/backups', 'Dataset with zstd compression'],
      ['zfs list', 'Datasets and usage'],
      ['sudo zfs snapshot tank/backups@2026-10-03', 'Snapshot'],
      ['zfs list -t snapshot', 'List snapshots'],
      ['sudo zfs rollback tank/backups@2026-10-03', 'Roll back'],
      ['sudo zfs send -i @2026-10-02 tank/backups@2026-10-03 | ssh nas sudo zfs receive pool/backups', 'Incremental replication'],
      ['sudo zpool scrub tank', 'Verify all checksums']
    ],
    flags: [['mirror / raidz1 / raidz2', 'vdev layout', 'zpool'], ['-o ashift=12', '4K sectors', 'zpool'], ['compression=zstd', 'Compression', 'zfs'], ['-t snapshot', 'Only snapshots', 'zfs'], ['-i', 'Incremental send', 'zfs'], ['-r', 'Recursive', 'zfs']],
    demo: ['zpool status', '  pool: tank\n state: ONLINE\n  scan: scrub repaired 0B in 00:21:44 with 0 errors on Sun Sep 13 00:45:46 2026\nconfig:\n\n\tNAME        STATE     READ WRITE CKSUM\n\ttank        ONLINE       0     0     0\n\t  mirror-0  ONLINE       0     0     0\n\t    sdb     ONLINE       0     0     0\n\t    sdc     ONLINE       0     0     0\n\nerrors: No known data errors'],
    tips: ['Ubuntu\'s desktop installer can still put the root filesystem on ZFS (Advanced features). Use /dev/disk/by-id/ paths for pools in production.'] },
  { id: 'btrfs', title: 'Btrfs', intro: 'Subvolumes, snapshots, compression.',
    cmds: [
      ['sudo mkfs.btrfs -L pool /dev/sdb', 'Create a Btrfs filesystem'],
      ['sudo btrfs subvolume create /mnt/pool/@data', 'Create a subvolume'],
      ['sudo btrfs subvolume list /mnt/pool', 'List subvolumes'],
      ['sudo btrfs subvolume snapshot -r /mnt/pool/@data /mnt/pool/.snaps/data-2026-10-03', 'Read-only snapshot'],
      ['sudo btrfs filesystem usage /mnt/pool', 'Real space usage'],
      ['sudo btrfs scrub start /mnt/pool', 'Verify checksums'],
      ['sudo mount -o compress=zstd:3,noatime /dev/sdb /mnt/pool', 'Mount with compression']
    ],
    flags: [['-r', 'Read-only snapshot', 'btrfs'], ['compress=zstd:N', 'Transparent compression (mount)', 'btrfs'], ['subvol=@data', 'Mount a subvolume', 'btrfs'], ['-d raid1 -m raid1', 'Data/metadata profiles (mkfs)', 'btrfs']],
    demo: ['sudo btrfs filesystem usage /mnt/pool', 'Overall:\n    Device size:\t\t 931.51GiB\n    Device allocated:\t\t 214.02GiB\n    Device unallocated:\t\t 717.49GiB\n    Used:\t\t\t 198.64GiB\n    Free (estimated):\t\t 731.88GiB\t(min: 373.14GiB)\n    Free (statfs, df):\t\t 731.88GiB\n    Data ratio:\t\t\t      1.00\n    Metadata ratio:\t\t      2.00'] },
  { id: 'swap', title: 'Swap & zram', intro: 'Swap file sizing and compressed RAM swap.',
    cmds: [
      ['swapon --show', 'Active swap', 'NAME      TYPE SIZE USED PRIO\n/swap.img file   4G 512M   -2'],
      ['sudo swapoff /swap.img', 'Disable the swap file'],
      ['sudo fallocate -l 8G /swap.img', 'Resize/create the swap file'],
      ['sudo chmod 600 /swap.img', 'Secure permissions'],
      ['sudo mkswap /swap.img', 'Format as swap'],
      ['sudo swapon /swap.img', 'Enable it'],
      ['sudo apt install systemd-zram-generator', 'Compressed swap in RAM'],
      ['zramctl', 'zram devices']
    ],
    flags: [['--show', 'Table of swap areas', 'swapon'], ['-l <size>', 'Length', 'fallocate'], ['zram-size = ram / 2', 'Size in /etc/systemd/zram-generator.conf', 'zram'], ['compression-algorithm = zstd', 'zram codec', 'zram']],
    demo: ['zramctl', 'NAME       ALGORITHM DISKSIZE  DATA COMPR TOTAL STREAMS MOUNTPOINT\n/dev/zram0 zstd           7.7G  1.2G  301M  318M       8 [SWAP]'],
    tips: ['Ubuntu uses /swap.img by default. For hibernation, swap must be at least the size of RAM.'] }
]});
