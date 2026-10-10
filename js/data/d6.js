/* Web & DB, Servers, Ubuntu Pro & Livepatch, Upgrades, Ansible, Kubernetes, Cloud & IaC */
UB.sec({ id: 'web', title: 'Web & DB', icon: '🕸️', desc: 'nginx, Apache, TLS with certbot, PHP 8.5, PostgreSQL 18, MySQL 8.4/MariaDB 11.8 and Redis/Valkey.', cards: [
  { id: 'nginx', title: 'nginx', intro: 'Web server and reverse proxy (1.28 on 26.04).',
    cmds: [
      ['sudo apt install nginx', 'Install nginx'],
      ['sudo nano /etc/nginx/sites-available/example.com', 'Create a server block'],
      ['sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/', 'Enable the site'],
      ['sudo rm /etc/nginx/sites-enabled/default', 'Disable the default site'],
      ['sudo nginx -t', 'Test configuration'],
      ['sudo systemctl reload nginx', 'Apply changes'],
      ['sudo ufw allow "Nginx Full"', 'Open ports 80 and 443'],
      ['curl -I http://localhost', 'Check the response headers']
    ],
    flags: [['listen 80;', 'Port', 'server block'], ['server_name example.com;', 'Virtual host', 'server block'], ['root /var/www/example;', 'Document root', 'server block'], ['location / { proxy_pass http://127.0.0.1:8000; }', 'Reverse proxy', 'server block'], ['try_files $uri $uri/ =404;', 'Static file fallback', 'server block']],
    demo: ['sudo nginx -t', 'nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful'] },
  { id: 'apache', title: 'Apache & PHP', intro: 'apache2 with a2en* helpers.',
    cmds: [
      ['sudo apt install apache2', 'Install Apache 2.4'],
      ['sudo a2ensite example.conf', 'Enable a vhost'],
      ['sudo a2dissite 000-default.conf', 'Disable the default vhost'],
      ['sudo a2enmod rewrite headers ssl', 'Enable modules'],
      ['sudo apache2ctl configtest', 'Test configuration', 'Syntax OK'],
      ['sudo apt install php-fpm php-mysql php-xml php-curl', 'PHP 8.5 FPM + common extensions'],
      ['php -v', 'PHP version'],
      ['sudo a2enconf php8.5-fpm', 'Use PHP-FPM with Apache (after a2enmod proxy_fcgi)']
    ],
    flags: [['a2ensite / a2dissite', 'Toggle vhosts', 'apache2'], ['a2enmod / a2dismod', 'Toggle modules', 'apache2'], ['a2enconf', 'Enable config snippet', 'apache2'], ['configtest', 'Check syntax', 'apache2ctl']],
    demo: ['php -v', 'PHP 8.5.2 (cli) (built: Sep 18 2026 10:44:13) (NTS)\nCopyright (c) The PHP Group\nZend Engine v4.5.2, Copyright (c) Zend Technologies\n    with Zend OPcache v8.5.2, Copyright (c), by Zend Technologies'],
    v24: '24.04 ships PHP 8.3: package/config names use 8.3 (php8.3-fpm).' },
  { id: 'tls', title: 'HTTPS with certbot', intro: 'Free Let\'s Encrypt certificates.',
    cmds: [
      ['sudo snap install --classic certbot', 'Certbot (snap is the upstream-recommended install)'],
      ['sudo ln -s /snap/bin/certbot /usr/local/bin/certbot', 'Put certbot on PATH'],
      ['sudo certbot --nginx -d example.com -d www.example.com', 'Get and install a certificate for nginx'],
      ['sudo certbot --apache -d example.com', 'Same for Apache'],
      ['sudo certbot certificates', 'List certificates'],
      ['sudo certbot renew --dry-run', 'Test automatic renewal'],
      ['systemctl list-timers | grep certbot', 'Renewal timer']
    ],
    flags: [['--nginx / --apache', 'Installer plugin', 'certbot'], ['-d', 'Domain', 'certbot'], ['certonly --standalone', 'Cert only, temporary server', 'certbot'], ['--dry-run', 'Test', 'certbot']],
    demo: ['sudo certbot --nginx -d example.com -d www.example.com', 'Saving debug log to /var/log/letsencrypt/letsencrypt.log\nRequesting a certificate for example.com and www.example.com\n\nSuccessfully received certificate.\nCertificate is saved at: /etc/letsencrypt/live/example.com/fullchain.pem\nKey is saved at:         /etc/letsencrypt/live/example.com/privkey.pem\nThis certificate expires on 2027-01-01.\nThese files will be updated when the certificate renews.\nCertbot has set up a scheduled task to automatically renew this certificate in the background.\n\nDeploying certificate\nSuccessfully deployed certificate for example.com to /etc/nginx/sites-enabled/example.com\nCongratulations! You have successfully enabled HTTPS on https://example.com'] },
  { id: 'postgres', title: 'PostgreSQL', intro: 'PostgreSQL 18 with Ubuntu\'s cluster tools.',
    cmds: [
      ['sudo apt install postgresql', 'Install the default PostgreSQL'],
      ['pg_lsclusters', 'Clusters, versions, ports, status'],
      ['sudo -u postgres psql', 'Open psql as the postgres superuser'],
      ['sudo -u postgres createuser --pwprompt app', 'Create a role'],
      ['sudo -u postgres createdb -O app appdb', 'Create a database owned by it'],
      ['sudo -u postgres pg_dump appdb > appdb.sql', 'Back up a database'],
      ['sudo pg_ctlcluster 18 main restart', 'Restart one cluster'],
      ['sudo pg_upgradecluster 16 main', 'Upgrade an old cluster after a release upgrade']
    ],
    flags: [['-u postgres', 'Run as the DB superuser', 'sudo'], ['--pwprompt', 'Ask for password', 'createuser'], ['-O <owner>', 'Owner', 'createdb'], ['-Fc', 'Custom-format dump', 'pg_dump']],
    demo: ['pg_lsclusters', 'Ver Cluster Port Status Owner    Data directory              Log file\n18  main    5432 online postgres /var/lib/postgresql/18/main /var/log/postgresql/postgresql-18-main.log'],
    v24: '24.04 ships PostgreSQL 16. After `do-release-upgrade` the old 16 cluster keeps running until you `pg_upgradecluster` it.' },
  { id: 'mysql', title: 'MySQL, MariaDB, Redis', intro: 'Other popular data stores.',
    cmds: [
      ['sudo apt install mysql-server', 'MySQL 8.4 LTS'],
      ['sudo mysql_secure_installation', 'Harden defaults'],
      ['sudo mysql', 'Connect as root via socket auth'],
      ['sudo apt install mariadb-server', 'MariaDB 11.8 instead'],
      ['sudo apt install redis-server', 'Redis'],
      ['redis-cli ping', 'Check Redis', 'PONG'],
      ['sudo apt install sqlite3', 'SQLite CLI']
    ],
    flags: [['-u', 'User', 'mysql'], ['-p', 'Password prompt', 'mysql'], ['-e', 'Execute SQL', 'mysql'], ['-h', 'Host', 'redis-cli']],
    demo: ['sudo mysql -e "SELECT VERSION();"', '+-------------------------+\n| VERSION()               |\n+-------------------------+\n| 8.4.6-0ubuntu1          |\n+-------------------------+'],
    tips: ['Check `apt policy valkey` — Ubuntu also packages Valkey, the open-source Redis fork.'] }
]});

UB.sec({ id: 'servers', title: 'Servers', icon: '🗄️', desc: 'File sharing (Samba, NFS), Cockpit web console, mail relay and server basics.', cards: [
  { id: 'first', title: 'First steps on a new server', intro: 'The usual checklist.',
    cmds: [
      ['sudo apt update', 'Refresh package lists'],
      ['sudo apt full-upgrade', 'Patch everything'],
      ['sudo adduser deploy', 'Create a non-root admin user'],
      ['sudo usermod -aG sudo deploy', 'Give it sudo'],
      ['ssh-copy-id deploy@server', 'Key-based login (from your PC)'],
      ['sudo ufw allow OpenSSH', 'Allow SSH in the firewall'],
      ['sudo ufw enable', 'Enable the firewall'],
      ['sudo timedatectl set-timezone UTC', 'Use UTC on servers'],
      ['sudo pro attach', 'Optional: Ubuntu Pro (free for up to 5 machines)']
    ],
    flags: [['full-upgrade', 'Allow removals for transitions', 'apt'], ['-aG', 'Append groups', 'usermod']],
    demo: ['sudo ufw allow OpenSSH', 'Rule added\nRule added (v6)'] },
  { id: 'samba', title: 'Samba (Windows shares)', intro: 'Share folders with Windows/macOS.',
    cmds: [
      ['sudo apt install samba', 'Install Samba'],
      ['sudo nano /etc/samba/smb.conf', 'Add a [share] section'],
      ['testparm', 'Check smb.conf'],
      ['sudo smbpasswd -a ssk', 'Set a Samba password for a user'],
      ['sudo systemctl restart smbd', 'Apply changes'],
      ['sudo ufw allow samba', 'Open Samba ports'],
      ['smbclient -L //localhost -U ssk', 'List shares']
    ],
    flags: [['path = /srv/share', 'Directory', 'smb.conf'], ['read only = no', 'Writable', 'smb.conf'], ['valid users = ssk', 'Allowed users', 'smb.conf'], ['browseable = yes', 'Visible in lists', 'smb.conf'], ['-a <user>', 'Add user', 'smbpasswd']],
    demo: ['smbclient -L //localhost -U ssk', 'Password for [WORKGROUP\\ssk]:\n\n\tSharename       Type      Comment\n\t---------       ----      -------\n\tprint$          Disk      Printer Drivers\n\tshare           Disk      Team files\n\tIPC$            IPC       IPC Service (ubuntu server (Samba, Ubuntu))\nSMB1 disabled -- no workgroup available'] },
  { id: 'nfs', title: 'NFS', intro: 'Linux-to-Linux file sharing.',
    cmds: [
      ['sudo apt install nfs-kernel-server', 'NFS server'],
      ['echo "/srv/nfs 192.168.1.0/24(rw,sync,no_subtree_check)" | sudo tee -a /etc/exports', 'Export a directory'],
      ['sudo exportfs -ra', 'Reload exports'],
      ['sudo exportfs -v', 'Show exports'],
      ['sudo apt install nfs-common', 'NFS client'],
      ['sudo mount -t nfs server:/srv/nfs /mnt/nfs', 'Mount on a client'],
      ['showmount -e server', 'Exports offered by a server']
    ],
    flags: [['rw / ro', 'Read-write / read-only', 'exports'], ['sync', 'Safe writes', 'exports'], ['no_subtree_check', 'Recommended', 'exports'], ['root_squash', 'Map root to nobody (default)', 'exports'], ['-ra', 'Re-export all', 'exportfs']],
    demo: ['sudo exportfs -v', '/srv/nfs      \t192.168.1.0/24(sync,wdelay,hide,no_subtree_check,sec=sys,rw,secure,root_squash,no_all_squash)'] },
  { id: 'cockpit', title: 'Cockpit web console', intro: 'Manage a server from the browser.',
    cmds: [
      ['sudo apt install -t resolute-backports cockpit', 'Install Cockpit (backports = newest)'],
      ['sudo systemctl enable --now cockpit.socket', 'Start it'],
      ['sudo ufw allow 9090/tcp', 'Open its port'],
      ['xdg-open https://localhost:9090', 'Open the console'],
      ['sudo apt install cockpit-machines cockpit-podman', 'VM and container pages']
    ],
    flags: [['9090/tcp', 'Default port', 'cockpit'], ['-t <release>', 'Use backports', 'apt']],
    demo: ['sudo systemctl enable --now cockpit.socket', "Created symlink '/etc/systemd/system/sockets.target.wants/cockpit.socket' → '/usr/lib/systemd/system/cockpit.socket'."] }
]});

UB.sec({ id: 'pro', title: 'Ubuntu Pro & Livepatch', icon: '⭐', desc: 'Expanded security maintenance, kernel Livepatch and compliance tooling — free for personal use on up to 5 machines.', cards: [
  { id: 'attach', title: 'Attach & status', intro: 'Get a token at ubuntu.com/pro.',
    cmds: [
      ['sudo pro attach C1aBcDeFgHiJkLmNoPqRsTuVwXyZ', 'Attach with your token'],
      ['pro status', 'Services and entitlements'],
      ['pro status --all', 'Include services not available on this machine'],
      ['sudo pro refresh', 'Refresh contract details'],
      ['sudo pro detach', 'Detach this machine'],
      ['pro --version', 'Client version']
    ],
    flags: [['attach <token>', 'Attach', 'pro'], ['--all', 'All services', 'pro'], ['--format json', 'JSON', 'pro']],
    demo: ['pro status', 'SERVICE          ENTITLED  STATUS       DESCRIPTION\nanbox-cloud      yes       disabled     Scalable Android in the cloud\nesm-apps         yes       enabled      Expanded Security Maintenance for Applications\nesm-infra        yes       enabled      Expanded Security Maintenance for Infrastructure\nfips-preview     yes       disabled     Preview of FIPS crypto packages undergoing certification with NIST\nlandscape        yes       disabled     Management and administration tool for Ubuntu\nlivepatch        yes       enabled      Canonical Livepatch service\nrealtime-kernel* yes       disabled     Ubuntu kernel with PREEMPT_RT patches integrated\nusg              yes       disabled     Security compliance and audit tools\n\n * Service has variants\n\nFor a list of all Ubuntu Pro services and variants, run \'pro status --all\'\nEnable services with: pro enable <service>\n\n     Account: ssk@example.com\nSubscription: Ubuntu Pro - free personal subscription'],
    tips: ['Pro extends security coverage of 26.04 to 10 years (2036), plus the Legacy add-on for up to 15.'] },
  { id: 'services', title: 'Enable services & fix CVEs', intro: 'ESM, USG, FIPS, real-time.',
    cmds: [
      ['sudo pro enable esm-apps', 'Security updates for Universe packages'],
      ['sudo pro enable usg', 'Ubuntu Security Guide'],
      ['sudo pro enable realtime-kernel', 'PREEMPT_RT kernel'],
      ['sudo pro enable fips-updates', 'FIPS-certified crypto (irreversible-ish!)'],
      ['pro security-status --esm-apps', 'Packages covered by esm-apps'],
      ['sudo pro fix CVE-2026-12345', 'Fix a specific CVE'],
      ['pro fix USN-7801-1 --dry-run', 'Preview a USN fix']
    ],
    flags: [['enable <svc>', 'Enable service', 'pro'], ['disable <svc>', 'Disable service', 'pro'], ['fix <id>', 'Remediate', 'pro'], ['--dry-run', 'Preview', 'pro'], ['--assume-yes', 'Non-interactive', 'pro']],
    demo: ['sudo pro fix CVE-2026-12345', 'CVE-2026-12345: OpenSSL vulnerability\n - https://ubuntu.com/security/CVE-2026-12345\n\n1 affected source package is installed: openssl\n(1/1) openssl:\nA fix is available in Ubuntu standard updates.\n{ apt update && apt install --only-upgrade -y libssl3t64 openssl }\n\n✔ CVE-2026-12345 is resolved.'],
    warn: ['FIPS mode is meant for regulated environments and is hard to undo; do not enable it on a desktop "just because".'] },
  { id: 'livepatch', title: 'Livepatch', intro: 'Critical kernel fixes without rebooting.',
    cmds: [
      ['sudo pro enable livepatch', 'Enable Livepatch'],
      ['canonical-livepatch status --verbose', 'Patch state and fixes applied'],
      ['sudo canonical-livepatch refresh', 'Check for patches now'],
      ['sudo pro disable livepatch', 'Disable Livepatch']
    ],
    flags: [['status', 'State', 'canonical-livepatch'], ['--verbose', 'Details', 'canonical-livepatch'], ['refresh', 'Check now', 'canonical-livepatch']],
    demo: ['canonical-livepatch status --verbose', 'client-version: 10.12.2\nmachine-id: 4f1c2a9be0d84b51a0c2e7d9b1f3a6c8\narchitecture: x86_64\ncpu-model: Intel(R) Core(TM) Ultra 7 155U\nlast-check: 2026-10-03T09:12:02+03:00\nboot-time: 2026-10-03T07:12:44+03:00\nuptime: 2h41m18s\nstatus:\n- kernel: 7.0.0-14.14-generic\n  running: true\n  livepatch:\n    checkState: checked\n    patchState: applied\n    version: "14.2"\n    fixes: |-\n      * cve-2026-33012\n      * cve-2026-34198'],
    tips: ['Livepatch covers high/critical kernel CVEs on LTS GA and HWE kernels; you still reboot eventually for full kernel updates.'] }
]});

UB.sec({ id: 'upgrades', title: 'Upgrades', icon: '⬆️', desc: 'Release upgrades with do-release-upgrade — 24.04 LTS → 26.04 LTS is open since 26.04.1.', cards: [
  { id: 'prepare', title: 'Prepare', intro: 'Back up, patch, check space.',
    cmds: [
      ['sudo apt full-upgrade', 'Fully patch the current release (after apt update)'],
      ['sudo apt autoremove --purge', 'Remove leftovers'],
      ['df -h / /boot', 'At least a few GB free on / (and space on /boot)'],
      ['ls /etc/apt/sources.list.d/', 'Note third-party repos/PPAs (they get disabled)'],
      ['sudo timeshift --create --comments "pre-26.04"', 'Snapshot first'],
      ['cat /etc/update-manager/release-upgrades', 'Upgrade policy', '[DEFAULT]\nPrompt=lts'],
      ['sudo reboot', 'Reboot into the latest kernel before upgrading']
    ],
    flags: [['Prompt=lts', 'Only offer LTS → LTS', 'release-upgrades'], ['Prompt=normal', 'Offer every release (interim)', 'release-upgrades'], ['Prompt=never', 'Never offer', 'release-upgrades']],
    demo: ['cat /etc/update-manager/release-upgrades', '[DEFAULT]\n# Default prompting and upgrade behavior, valid options:\n#\n#  never  - Never check for, or allow upgrading to, a new release.\n#  normal - Check to see if a new release is available.  If more than one new\n#           release is found, the release upgrader will attempt to upgrade to\n#           the supported release that immediately succeeds the\n#           currently-running release.\n#  lts    - Check to see if a new LTS release is available.  The upgrader\n#           will attempt to upgrade to the first LTS release available after\n#           the currently-running one.\nPrompt=lts'],
    warn: ['Over SSH, the upgrader opens a backup sshd on port 1022. Allow it in the firewall if your session drops: `sudo ufw allow 1022/tcp`.'] },
  { id: 'run', title: 'Run the upgrade', intro: 'do-release-upgrade.',
    cmds: [
      ['do-release-upgrade -c', 'Check whether a new release is offered'],
      ['sudo do-release-upgrade', 'Upgrade to the next LTS'],
      ['sudo do-release-upgrade -d', 'Upgrade before the path is officially open (or to development)'],
      ['sudo do-release-upgrade -f DistUpgradeViewNonInteractive', 'Unattended upgrade (servers, careful)'],
      ['update-manager -c', 'Desktop GUI upgrade check'],
      ['lsb_release -d', 'Confirm afterwards', 'Description:\tUbuntu 26.04.1 LTS']
    ],
    flags: [['-c', 'Check only', 'do-release-upgrade'], ['-d', 'Devel/early', 'do-release-upgrade'], ['-f <frontend>', 'Frontend', 'do-release-upgrade'], ['--allow-third-party', 'Keep third-party repos', 'do-release-upgrade']],
    demo: [['do-release-upgrade -c', 'Checking for a new Ubuntu release\nNew release \'26.04.1 LTS\' available.\nRun \'do-release-upgrade\' to upgrade to it.'],
      ['sudo do-release-upgrade', 'Checking for a new Ubuntu release\nGet:1 Upgrade tool signature [833 B]\nGet:2 Upgrade tool [1,288 kB]\nAuthentication of the upgrade tool...\nExtracting \'resolute.tar.gz\'\n\nReading cache\nChecking package manager\n\nUpdating repository information\n\nThird party sources disabled\n\nSome third party entries in your sources.list were disabled. You can\nre-enable them after the upgrade with the \'software-properties\' tool\nor your package manager.\n\nDo you want to start the upgrade?\n\n7 installed packages are no longer supported by Canonical.\n312 packages are going to be removed. 891 new packages are going to be\ninstalled. 2104 packages are going to be upgraded.\n\nYou have to download a total of 2,941 M. This download will take about\n6 minutes with your connection.\n\n Continue [yN]  Details [d]']],
    tips: ['Upgrades from 24.04 are offered since 26.04.1 (late August 2026). Interim users (25.10) upgrade to 26.04 directly.'] },
  { id: 'after', title: 'After the upgrade', intro: 'Clean up and re-enable things.',
    cmds: [
      ['sudo apt autoremove --purge', 'Remove obsolete packages'],
      ['apt list "~o"', 'Obsolete packages no longer in any repo'],
      ['ls /etc/apt/sources.list.d/*.distUpgrade', 'Backups of disabled sources'],
      ['sudo apt modernize-sources', 'Convert remaining .list files to deb822'],
      ['sudo add-apt-repository ppa:git-core/ppa', 'Re-add PPAs that support resolute'],
      ['sudo pg_upgradecluster 16 main', 'Upgrade PostgreSQL data if you run it'],
      ['systemctl --failed', 'Check for broken services']
    ],
    flags: [['~o', 'APT pattern: obsolete', 'apt'], ['~c', 'APT pattern: config files only (removed)', 'apt'], ['?narrow', 'Pattern combinators', 'apt']],
    demo: ['apt list "~o"', 'libpython3.12t64/now 3.12.3-1ubuntu0.8 amd64 [installed,local]\npython3.12/now 3.12.3-1ubuntu0.8 amd64 [installed,local]\nlinux-image-6.17.0-14-generic/now 6.17.0-14.14~24.04.1 amd64 [installed,local]'],
    v24: 'Things that change for 24.04 users: sudo-rs, rust-coreutils, chrony, dracut, Wayland-only GNOME 50, Ptyxis, Python 3.14, PHP 8.5, PostgreSQL 18.' }
]});

UB.sec({ id: 'ansible', title: 'Ansible', icon: '🅰️', desc: 'Agentless automation over SSH — inventories, ad-hoc commands, playbooks and roles.', cards: [
  { id: 'setup', title: 'Install & inventory', intro: 'Control node on Ubuntu.',
    cmds: [
      ['sudo apt install ansible', 'Ansible from the Ubuntu archive'],
      ['pipx install --include-deps ansible', 'Latest Ansible per-user'],
      ['nano inventory.ini', 'Write an inventory'],
      ['ansible-inventory -i inventory.ini --graph', 'Show groups and hosts'],
      ['ansible all -i inventory.ini -m ping', 'Test connectivity'],
      ['ansible-config dump --only-changed', 'Non-default settings']
    ],
    flags: [['[web]', 'Group header', 'inventory'], ['ansible_host=', 'Address', 'inventory'], ['ansible_user=', 'SSH user', 'inventory'], ['--graph', 'Tree view', 'ansible-inventory']],
    demo: ['ansible all -i inventory.ini -m ping', 'web1 | SUCCESS => {\n    "ansible_facts": {\n        "discovered_interpreter_python": "/usr/bin/python3.14"\n    },\n    "changed": false,\n    "ping": "pong"\n}\nweb2 | SUCCESS => {\n    "changed": false,\n    "ping": "pong"\n}\ndb1 | UNREACHABLE! => {\n    "changed": false,\n    "msg": "Failed to connect to the host via ssh: ssh: connect to host 10.0.0.30 port 22: Connection timed out",\n    "unreachable": true\n}'] },
  { id: 'adhoc', title: 'Ad-hoc commands', intro: 'One-off tasks across many hosts.',
    cmds: [
      ['ansible web -i inventory.ini -a "uptime"', 'Run a command on a group'],
      ['ansible all -i inventory.ini -b -m apt -a "update_cache=yes upgrade=dist"', 'Upgrade all hosts'],
      ['ansible web -i inventory.ini -b -m apt -a "name=nginx state=present"', 'Install a package'],
      ['ansible web -i inventory.ini -b -m systemd_service -a "name=nginx state=restarted"', 'Restart a service'],
      ['ansible all -i inventory.ini -m setup -a "filter=ansible_distribution*"', 'Gather facts']
    ],
    flags: [['-m', 'Module', 'ansible'], ['-a', 'Arguments', 'ansible'], ['-b', 'Become root', 'ansible'], ['-K', 'Ask sudo password', 'ansible'], ['-f', 'Forks', 'ansible']],
    demo: ['ansible web -i inventory.ini -a "uptime"', 'web1 | CHANGED | rc=0 >>\n 10:04:12 up 12 days,  3:41,  1 user,  load average: 0.08, 0.05, 0.01\nweb2 | CHANGED | rc=0 >>\n 10:04:12 up 12 days,  3:40,  0 users,  load average: 0.12, 0.09, 0.03'] },
  { id: 'playbook', title: 'Playbooks, roles & vault', intro: 'Repeatable configuration.',
    cmds: [
      ['ansible-playbook -i inventory.ini site.yml --check --diff', 'Dry run with diffs'],
      ['ansible-playbook -i inventory.ini site.yml -l web1', 'Run on one host'],
      ['ansible-playbook -i inventory.ini site.yml --tags nginx', 'Only tagged tasks'],
      ['ansible-galaxy collection install community.general', 'Install a collection'],
      ['ansible-galaxy init roles/webserver', 'Scaffold a role'],
      ['ansible-vault create group_vars/all/vault.yml', 'Encrypted variables'],
      ['ansible-lint site.yml', 'Lint (apt install ansible-lint)']
    ],
    flags: [['--check', 'Dry run', 'ansible-playbook'], ['--diff', 'Show changes', 'ansible-playbook'], ['-l', 'Limit hosts', 'ansible-playbook'], ['--tags', 'Tags', 'ansible-playbook'], ['--ask-vault-pass', 'Vault password', 'ansible-playbook']],
    demo: ['ansible-playbook -i inventory.ini site.yml --check --diff', '\nPLAY [web] ************************************************************\n\nTASK [Gathering Facts] ************************************************\nok: [web1]\nok: [web2]\n\nTASK [Install nginx] **************************************************\nok: [web1]\nchanged: [web2]\n\nTASK [Deploy site config] *********************************************\n--- before: /etc/nginx/sites-available/site\n+++ after: /home/ssk/infra/templates/site.j2\n@@ -3 +3 @@\n-    server_name old.example.com;\n+    server_name example.com;\nchanged: [web1]\nchanged: [web2]\n\nPLAY RECAP ************************************************************\nweb1 : ok=3  changed=1  unreachable=0  failed=0  skipped=0\nweb2 : ok=3  changed=2  unreachable=0  failed=0  skipped=0'] }
]});

UB.sec({ id: 'k8s', title: 'Kubernetes', icon: '☸️', desc: 'MicroK8s and Canonical Kubernetes snaps plus kubectl essentials.', cards: [
  { id: 'microk8s', title: 'MicroK8s', intro: 'Single-node to HA in a snap.',
    cmds: [
      ['sudo snap install microk8s --classic', 'Install MicroK8s'],
      ['sudo usermod -aG microk8s $USER', 'Use without sudo (re-login)'],
      ['microk8s status --wait-ready', 'Wait until the cluster is ready'],
      ['microk8s enable dns hostpath-storage ingress', 'Enable core add-ons'],
      ['microk8s kubectl get nodes -o wide', 'Nodes'],
      ['microk8s add-node', 'Print a join command for another machine'],
      ['microk8s config > ~/.kube/config', 'Export kubeconfig for plain kubectl'],
      ['sudo snap install kubectl --classic', 'Standalone kubectl']
    ],
    flags: [['--classic', 'Required confinement', 'snap'], ['--channel=1.34/stable', 'Kubernetes version track', 'snap'], ['--wait-ready', 'Block until ready', 'microk8s'], ['enable <addon>', 'Add-on (dns, ingress, metallb, observability…)', 'microk8s']],
    demo: ['microk8s status --wait-ready', 'microk8s is running\nhigh-availability: no\n  datastore master nodes: 127.0.0.1:19001\n  datastore standby nodes: none\naddons:\n  enabled:\n    dns                  # (core) CoreDNS\n    ha-cluster           # (core) Configure high availability on the current node\n    helm                 # (core) Helm - the package manager for Kubernetes\n    hostpath-storage     # (core) Storage class; allocates storage from host directory\n    ingress              # (core) Ingress controller for external access\n    storage              # (core) Alias to hostpath-storage add-on, deprecated\n  disabled:\n    cert-manager         # (core) Cloud native certificate management\n    metallb              # (core) Loadbalancer for your Kubernetes cluster\n    metrics-server       # (core) K8s Metrics Server for API access to service metrics\n    observability        # (core) A lightweight observability stack for logs, traces and metrics'],
    tips: ['Canonical Kubernetes (`sudo snap install k8s --classic`, then `sudo k8s bootstrap`) is the newer, production-focused distribution.'] },
  { id: 'kubectl', title: 'kubectl essentials', intro: 'Deploy, inspect, debug.',
    cmds: [
      ['kubectl create deployment web --image=nginx:stable --replicas=2', 'Create a deployment'],
      ['kubectl expose deployment web --port=80 --type=NodePort', 'Expose it'],
      ['kubectl get pods -A -o wide', 'All pods everywhere'],
      ['kubectl describe pod web-7c9f8d6b5-x2k4p', 'Events and details'],
      ['kubectl logs -f deploy/web', 'Follow logs'],
      ['kubectl exec -it deploy/web -- sh', 'Shell in a pod'],
      ['kubectl apply -f app.yaml', 'Apply manifests'],
      ['kubectl rollout restart deploy/web', 'Rolling restart'],
      ['kubectl port-forward svc/web 8080:80', 'Reach a service locally']
    ],
    flags: [['-n', 'Namespace', 'kubectl'], ['-A', 'All namespaces', 'kubectl'], ['-o wide|yaml', 'Output', 'kubectl'], ['-f', 'File / follow', 'kubectl'], ['--replicas', 'Count', 'kubectl'], ['-w', 'Watch', 'kubectl']],
    demo: ['kubectl get pods -A -o wide', 'NAMESPACE     NAME                                      READY   STATUS    RESTARTS   AGE   IP            NODE\ndefault       web-7c9f8d6b5-x2k4p                       1/1     Running   0          3m    10.1.77.12    ubuntu\ndefault       web-7c9f8d6b5-zq8mn                       1/1     Running   0          3m    10.1.77.13    ubuntu\ningress       nginx-ingress-microk8s-controller-6xj2d   1/1     Running   0          21m   10.1.77.8     ubuntu\nkube-system   calico-node-r6b9c                         1/1     Running   0          24m   192.168.1.42  ubuntu\nkube-system   coredns-7896dbf49-l2t7p                   1/1     Running   0          22m   10.1.77.5     ubuntu'] }
]});

UB.sec({ id: 'cloud', title: 'Cloud & IaC', icon: '☁️', desc: 'cloud-init for first boot, Juju for operators, Terraform for infrastructure.', cards: [
  { id: 'cloudinit', title: 'cloud-init', intro: 'Configure instances on first boot.',
    cmds: [
      ['cloud-init status --long', 'Did first-boot configuration finish?'],
      ['cloud-init status --wait', 'Block until done (useful in scripts)'],
      ['sudo cloud-init schema --system --annotate', 'Validate the user-data this instance got'],
      ['cloud-init query ds', 'Detected datasource'],
      ['sudo cloud-init clean --logs --reboot', 'Re-run cloud-init from scratch'],
      ['cloud-init analyze blame', 'Slowest modules'],
      ['sudo less /var/log/cloud-init-output.log', 'Output of your scripts']
    ],
    flags: [['#cloud-config', 'Required first line of user-data', 'cloud-config'], ['users:', 'Create users/keys', 'cloud-config'], ['packages:', 'Install packages', 'cloud-config'], ['package_upgrade: true', 'Upgrade on boot', 'cloud-config'], ['write_files:', 'Drop files', 'cloud-config'], ['runcmd:', 'Run commands last', 'cloud-config']],
    demo: ['cloud-init status --long', 'status: done\nextended_status: done\nboot_status_code: enabled-by-generator\nlast_update: Sat, 03 Oct 2026 07:13:21 +0000\ndetail: DataSourceNoCloud [seed=/dev/sr0]\nerrors: []\nrecoverable_errors: {}'] },
  { id: 'juju', title: 'Juju', intro: 'Deploy and integrate charmed applications.',
    cmds: [
      ['sudo snap install juju', 'Install Juju 3'],
      ['juju bootstrap localhost lxd-ctrl', 'Controller on local LXD'],
      ['juju add-model demo', 'Create a model'],
      ['juju deploy postgresql --channel 16/stable', 'Deploy a charm'],
      ['juju deploy wordpress-k8s', 'Deploy a Kubernetes charm (on a k8s model)'],
      ['juju integrate wordpress-k8s mysql-k8s:database', 'Integrate apps (Juju 3; formerly "relate")'],
      ['juju status --watch 2s', 'Live status'],
      ['juju run postgresql/leader get-password', 'Run a charm action']
    ],
    flags: [['--channel', 'Charm channel', 'juju'], ['-n', 'Units', 'juju'], ['--watch', 'Refresh', 'juju'], ['--constraints', 'Machine requirements', 'juju']],
    demo: ['juju status', 'Model  Controller  Cloud/Region         Version  SLA          Timestamp\ndemo   lxd-ctrl    localhost/localhost  3.6.9    unsupported  10:12:44+03:00\n\nApp         Version  Status  Scale  Charm       Channel    Rev  Exposed  Message\npostgresql  16.9     active      1  postgresql  16/stable  843  no\n\nUnit           Workload  Agent  Machine  Public address  Ports     Message\npostgresql/0*  active    idle   0        10.92.14.77     5432/tcp  Primary\n\nMachine  State    Address      Inst id        Base          AZ  Message\n0        started  10.92.14.77  juju-4c1a2b-0  ubuntu@24.04      Running'] },
  { id: 'terraform', title: 'Terraform / OpenTofu', intro: 'Declarative infrastructure.',
    cmds: [
      ['sudo snap install terraform --classic', 'Terraform via snap'],
      ['sudo snap install opentofu --classic', 'OpenTofu (open-source fork) via snap'],
      ['terraform init', 'Download providers'],
      ['terraform fmt -recursive', 'Format code'],
      ['terraform validate', 'Check syntax'],
      ['terraform plan -out=tfplan', 'Preview and save a plan'],
      ['terraform apply tfplan', 'Apply the saved plan'],
      ['terraform destroy', 'Tear everything down']
    ],
    flags: [['-out=<file>', 'Save plan', 'terraform'], ['-var k=v', 'Variable', 'terraform'], ['-auto-approve', 'No prompt', 'terraform'], ['-upgrade', 'Upgrade providers', 'terraform']],
    demo: ['terraform plan -out=tfplan', 'Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:\n  + create\n\nTerraform will perform the following actions:\n\n  # lxd_instance.web will be created\n  + resource "lxd_instance" "web" {\n      + image    = "ubuntu:26.04"\n      + name     = "web"\n      + type     = "container"\n      + ipv4_address = (known after apply)\n    }\n\nPlan: 1 to add, 0 to change, 0 to destroy.\n\nSaved the plan to: tfplan'],
    tips: ['HashiCorp also publishes an apt repository; the snap is simplest on Ubuntu.'] }
]});
