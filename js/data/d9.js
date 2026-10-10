/* v1.1 — more tools: Multimedia → Cloud & IaC */
UB.add('multimedia', [
  { id: 'pdf', title: 'PDF & image tools', intro: 'Merge, split, compress, convert and strip metadata.',
    cmds: [
      ['pdfunite a.pdf b.pdf merged.pdf', 'Merge PDFs (poppler-utils)', ''],
      ['qpdf in.pdf --pages . 1-3 -- first3.pdf', 'Extract pages 1–3', ''],
      ['pdftotext report.pdf - | head', 'PDF text to the terminal'],
      ['gs -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -o small.pdf big.pdf', 'Shrink a PDF with Ghostscript', ''],
      ['sudo apt install img2pdf', 'Lossless images → PDF'],
      ['img2pdf scans/*.jpg -o album.pdf', 'Combine scans into one PDF', ''],
      ['sudo apt install libimage-exiftool-perl', 'ExifTool'],
      ['exiftool -all= photo.jpg', 'Remove all metadata (GPS, camera) from a photo', '    1 image files updated'],
      ['sudo apt install libheif-examples', 'HEIC tools'],
      ['heif-convert IMG_0412.heic IMG_0412.jpg', 'Convert iPhone HEIC to JPEG', 'File contains 1 image\nWritten to IMG_0412.jpg']
    ],
    flags: [['--pages <file> <range> --', 'Page selection', 'qpdf'], ['/screen /ebook /printer', 'Quality presets', 'gs'], ['-all=', 'Delete all tags', 'exiftool'], ['-q <0-100>', 'JPEG quality', 'heif-convert'], ['-layout', 'Keep layout', 'pdftotext']],
    demo: ['exiftool -all= photo.jpg', '    1 image files updated'] },
  { id: 'audio-edit', title: 'Audio editing & tagging', intro: 'SoX, Audacity, EasyEffects.',
    cmds: [
      ['sudo apt install sox libsox-fmt-all', 'SoX — the Swiss Army knife of audio'],
      ['sox in.wav out.flac', 'Convert format', ''],
      ['sox in.wav out.wav trim 0 30 fade 2', 'First 30 s with a fade-out', ''],
      ['soxi song.flac', 'Audio file info', '\nInput File     : \'song.flac\'\nChannels       : 2\nSample Rate    : 48000\nPrecision      : 24-bit\nDuration       : 00:03:41.20 = 10617600 samples ~ 16590 CDDA sectors\nFile Size      : 41.2M\nBit Rate       : 1.49M\nSample Encoding: 24-bit FLAC'],
      ['sudo apt install audacity', 'Audacity editor'],
      ['flatpak install flathub com.github.wwmm.easyeffects', 'EasyEffects: EQ & effects for PipeWire'],
      ['sudo apt install picard', 'MusicBrainz Picard tagger']
    ],
    flags: [['trim <start> <len>', 'Cut', 'sox'], ['fade <sec>', 'Fade', 'sox'], ['norm', 'Normalise volume', 'sox'], ['-r <rate>', 'Resample', 'sox']],
    demo: ['soxi song.flac', '\nInput File     : \'song.flac\'\nChannels       : 2\nSample Rate    : 48000\nPrecision      : 24-bit\nDuration       : 00:03:41.20 = 10617600 samples ~ 16590 CDDA sectors\nFile Size      : 41.2M\nBit Rate       : 1.49M\nSample Encoding: 24-bit FLAC'] }
]);

UB.add('gaming', [
  { id: 'wine', title: 'Wine, controllers & emulators', intro: 'Non-Steam Windows apps, gamepads and retro.',
    cmds: [
      ['sudo apt install wine', 'Wine (needs i386 enabled first)'],
      ['winecfg', 'Configure the default Wine prefix'],
      ['wine setup.exe', 'Run a Windows installer'],
      ['WINEPREFIX=~/.wine-games wine game.exe', 'Use a separate prefix per app'],
      ['sudo apt install steam-devices', 'udev rules for Steam controllers & VR'],
      ['sudo apt install evtest', 'Raw input event tester'],
      ['sudo evtest', 'Pick a gamepad and watch its buttons'],
      ['flatpak install flathub net.davidotek.pupgui2', 'ProtonUp-Qt: install GE-Proton, Wine-GE'],
      ['flatpak install flathub org.libretro.RetroArch', 'RetroArch multi-system emulator']
    ],
    flags: [['WINEPREFIX=', 'Prefix directory', 'wine'], ['WINEARCH=win64', 'Prefix architecture', 'wine'], ['wineboot -u', 'Update a prefix', 'wine']],
    demo: ['wine --version', 'wine-10.0 (Ubuntu 10.0~repack-6ubuntu1)'],
    tips: ['Bottles (`flatpak install flathub com.usebottles.bottles`) manages Wine prefixes with a GUI.'] }
]);

UB.add('backup', [
  { id: 'cloud', title: 'Cloud sync: rclone & Syncthing', intro: 'Google Drive, S3, OneDrive and device-to-device sync.',
    cmds: [
      ['sudo apt install rclone', 'rclone (70+ cloud providers)'],
      ['rclone config', 'Add a remote interactively (e.g. gdrive)'],
      ['rclone lsd gdrive:', 'List top-level folders on a remote', '          -1 2026-09-14 10:21:44        -1 Documents\n          -1 2026-08-02 08:11:20        -1 Photos\n          -1 2026-10-01 19:42:03        -1 Backups'],
      ['rclone sync ~/Documents gdrive:Documents --progress', 'Make the remote match the local folder'],
      ['rclone sync ~/Documents gdrive:Documents --dry-run', 'Preview what would change'],
      ['rclone mount gdrive: ~/gdrive --vfs-cache-mode writes --daemon', 'Mount a remote as a folder'],
      ['rclone check ~/Documents gdrive:Documents', 'Verify both sides match'],
      ['sudo apt install syncthing', 'Syncthing peer-to-peer sync'],
      ['systemctl --user enable --now syncthing.service', 'Run Syncthing for your user (UI at localhost:8384)']
    ],
    flags: [['sync', 'One-way mirror (deletes extras)', 'rclone'], ['copy', 'Copy without deleting', 'rclone'], ['--dry-run', 'Preview', 'rclone'], ['--progress', 'Live stats', 'rclone'], ['--vfs-cache-mode writes', 'Needed for most apps on mounts', 'rclone'], ['crypt', 'Encrypted remote type', 'rclone']],
    demo: ['rclone sync ~/Documents gdrive:Documents --progress', 'Transferred:       41.218 MiB / 41.218 MiB, 100%, 8.244 MiB/s, ETA 0s\nChecks:              1203 / 1203, 100%\nDeleted:                2 (files), 0 (dirs)\nTransferred:           14 / 14, 100%\nElapsed time:         6.1s'],
    warn: ['`rclone sync` deletes files on the destination that are not in the source. Use `copy` or `--dry-run` first.'] },
  { id: 'images', title: 'Disk images & cloning', intro: 'dd, partclone, ddrescue.',
    cmds: [
      ['sudo dd if=/dev/sdb of=usb.img bs=4M status=progress', 'Raw image of a whole disk'],
      ['sudo apt install partclone', 'Copies only used blocks'],
      ['sudo partclone.ext4 -c -s /dev/sdb1 -o sdb1.img', 'Image an ext4 partition'],
      ['sudo partclone.ext4 -r -s sdb1.img -o /dev/sdb1', 'Restore it'],
      ['sudo apt install gddrescue', 'GNU ddrescue for failing disks'],
      ['sudo ddrescue -n /dev/sdb rescue.img rescue.map', 'Copy the good areas first'],
      ['sudo ddrescue -r3 /dev/sdb rescue.img rescue.map', 'Retry bad areas 3 times']
    ],
    flags: [['-c / -r', 'Clone / restore', 'partclone.ext4'], ['-s / -o', 'Source / output', 'partclone.ext4'], ['-n', 'Skip scraping (fast pass)', 'ddrescue'], ['-r N', 'Retry passes', 'ddrescue']],
    demo: ['sudo ddrescue -n /dev/sdb rescue.img rescue.map', 'GNU ddrescue 1.29\nPress Ctrl-C to interrupt\n     ipos:  30765 MB, non-trimmed:     1048 kB,  current rate:   41943 kB/s\n     opos:  30765 MB, non-scraped:        0 B,  average rate:   38211 kB/s\nnon-tried:        0 B,  bad-sector:        0 B,    error rate:       0 B/s\n  rescued:  30764 MB,   bad areas:        0,        run time:     13m 25s\npct rescued:   99.99%, read errors:        2,  remaining time:         n/a\nFinished'],
    tips: ['For whole-system images, the Clonezilla live ISO automates partclone with a menu.'] }
]);

UB.add('containers', [
  { id: 'tooling', title: 'Image tools, GPUs & multi-arch', intro: 'skopeo, buildah, buildx, NVIDIA toolkit.',
    cmds: [
      ['sudo apt install skopeo buildah', 'Inspect/copy images and build without a daemon'],
      ['skopeo inspect docker://docker.io/library/nginx:stable', 'Image metadata without pulling'],
      ['skopeo copy docker://nginx:stable oci-archive:nginx.tar', 'Save an image to a file'],
      ['buildah bud -t myapp:1.0 .', 'Build from a Dockerfile, rootless'],
      ['docker buildx build --platform linux/amd64,linux/arm64 -t ssk/app:1.0 --push .', 'Multi-architecture image'],
      ['docker context ls', 'Docker endpoints you can switch between', 'NAME        DESCRIPTION                               DOCKER ENDPOINT               ERROR\ndefault *   Current DOCKER_HOST based configuration   unix:///var/run/docker.sock\nnas         Docker on the NAS                         ssh://ssk@nas'],
      ['sudo apt install nvidia-container-toolkit', 'GPU support for containers (from NVIDIA\'s repo)'],
      ['sudo nvidia-ctk runtime configure --runtime=docker', 'Register the NVIDIA runtime with Docker'],
      ['docker run --rm --gpus all nvidia/cuda:12.9.0-base-ubuntu24.04 nvidia-smi', 'Test GPU access in a container'],
      ['dockerd-rootless-setuptool.sh install', 'Rootless Docker for your user (docker-ce-rootless-extras)']
    ],
    flags: [['inspect docker://', 'Remote image info', 'skopeo'], ['copy <src> <dst>', 'Copy between registries/files', 'skopeo'], ['bud -t', 'Build with tag', 'buildah'], ['--platform', 'Target architectures', 'docker'], ['--push', 'Push after build', 'docker'], ['--gpus all', 'Expose GPUs', 'docker']],
    demo: ['skopeo inspect docker://docker.io/library/nginx:stable', '{\n    "Name": "docker.io/library/nginx",\n    "Digest": "sha256:9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",\n    "RepoTags": [\n        "1.28.0", "1.28.2", "stable", "stable-alpine", "…"\n    ],\n    "Created": "2026-09-30T18:12:44Z",\n    "DockerVersion": "",\n    "Architecture": "amd64",\n    "Os": "linux",\n    "Layers": [\n        "sha256:2a1b3c4d…",\n        "sha256:5e6f7a8b…"\n    ]\n}'] }
]);

UB.add('lxd', [
  { id: 'profiles', title: 'Profiles, devices & limits', intro: 'Port forwards, shared folders and resources.',
    cmds: [
      ['lxc config set web limits.cpu=2 limits.memory=2GiB', 'Limit CPU and RAM', ''],
      ['lxc config device add web http proxy listen=tcp:0.0.0.0:8080 connect=tcp:127.0.0.1:80', 'Forward host :8080 to the container', 'Device http added to web'],
      ['lxc config device add web code disk source=/home/ssk/code path=/srv/code', 'Share a host folder', 'Device code added to web'],
      ['lxc file push index.html web/var/www/html/', 'Copy a file in', ''],
      ['lxc profile create dev', 'New profile', 'Profile dev created'],
      ['lxc profile edit dev', 'Edit profile YAML (limits, devices, cloud-init)'],
      ['lxc launch ubuntu:26.04 box -p default -p dev', 'Launch with stacked profiles'],
      ['lxc copy web web2', 'Clone an instance', ''],
      ['lxc storage list', 'Storage pools', '+---------+--------+--------------------------------------------+---------+---------+\n|  NAME   | DRIVER |                   SOURCE                   | USED BY |  STATE  |\n+---------+--------+--------------------------------------------+---------+---------+\n| default | zfs    | /var/snap/lxd/common/lxd/disks/default.img | 6       | CREATED |\n+---------+--------+--------------------------------------------+---------+---------+'],
      ['lxc image list ubuntu: 26.04 type=container', 'Available Ubuntu 26.04 images']
    ],
    flags: [['limits.cpu', 'CPU count', 'lxc'], ['limits.memory', 'RAM', 'lxc'], ['security.nesting=true', 'Allow Docker inside', 'lxc'], ['proxy', 'Port-forward device', 'lxc'], ['disk source= path=', 'Shared folder device', 'lxc'], ['-p <profile>', 'Apply profile', 'lxc']],
    demo: ['lxc config device add web http proxy listen=tcp:0.0.0.0:8080 connect=tcp:127.0.0.1:80', 'Device http added to web'],
    tips: ['Running Docker inside an LXD container needs `security.nesting=true`.'] }
]);

UB.add('multipass', [
  { id: 'house', title: 'Networks, recovery & housekeeping', intro: 'Bridges, deleted VMs and versions.',
    cmds: [
      ['multipass version', 'Client and daemon versions', 'multipass   1.16.1\nmultipassd  1.16.1'],
      ['multipass networks', 'Host networks VMs can bridge to', 'Name        Type      Description\nenp0s31f6   ethernet  Ethernet device\nwlp0s20f3   wifi      Wi-Fi device\nmpbr0       bridge    Network bridge for Multipass'],
      ['multipass set local.bridged-network=enp0s31f6', 'Default network for --bridged', ''],
      ['multipass launch 26.04 --name lan --bridged', 'VM with an address on your LAN'],
      ['multipass recover dev', 'Bring back a deleted (not purged) VM', ''],
      ['multipass purge', 'Permanently remove deleted VMs', ''],
      ['multipass info --all', 'Details for every VM'],
      ['multipass restart dev', 'Restart a VM', '']
    ],
    flags: [['--bridged', 'Use local.bridged-network', 'multipass'], ['--network <name>', 'Extra NIC', 'multipass'], ['--all', 'All instances', 'multipass']],
    demo: ['multipass networks', 'Name        Type      Description\nenp0s31f6   ethernet  Ethernet device\nwlp0s20f3   wifi      Wi-Fi device\nmpbr0       bridge    Network bridge for Multipass'] }
]);

UB.add('virt', [
  { id: 'images', title: 'Disk images & guest tools', intro: 'qemu-img, libguestfs, GNOME Boxes.',
    cmds: [
      ['qemu-img create -f qcow2 disk.qcow2 40G', 'Thin-provisioned disk image', 'Formatting \'disk.qcow2\', fmt=qcow2 cluster_size=65536 extended_l2=off compression_type=zlib size=42949672960 lazy_refcounts=off refcount_bits=16'],
      ['qemu-img info disk.qcow2', 'Size, format, backing file'],
      ['qemu-img convert -O qcow2 win.vmdk win.qcow2', 'Convert VMware/VirtualBox disks', ''],
      ['qemu-img resize disk.qcow2 +20G', 'Grow a disk', 'Image resized.'],
      ['sudo apt install libguestfs-tools', 'Tools that edit VM disks offline'],
      ['sudo virt-customize -a disk.qcow2 --install nginx --root-password password:Ch4ngeMe', 'Install packages / set root password in an image'],
      ['sudo virt-sysprep -a disk.qcow2', 'Remove machine IDs, keys and logs before cloning'],
      ['sudo apt install qemu-guest-agent spice-vdagent', 'Inside the guest: clean shutdown, copy-paste, resize'],
      ['sudo apt install gnome-boxes', 'GNOME Boxes — simple VM app']
    ],
    flags: [['-f qcow2|raw', 'Format', 'qemu-img'], ['-O <fmt>', 'Output format', 'qemu-img'], ['-b <file> -F qcow2', 'Backing file (overlay)', 'qemu-img'], ['-a <disk>', 'Disk to edit', 'virt-customize'], ['--install', 'Packages', 'virt-customize'], ['--firstboot-command', 'Run on first boot', 'virt-customize']],
    demo: ['qemu-img info disk.qcow2', 'image: disk.qcow2\nfile format: qcow2\nvirtual size: 40 GiB (42949672960 bytes)\ndisk size: 2.81 GiB\ncluster_size: 65536\nFormat specific information:\n    compat: 1.1\n    compression type: zlib\n    lazy refcounts: false\n    refcount bits: 16\n    corrupt: false\n    extended l2: false'] }
]);

UB.add('web', [
  { id: 'caddy', title: 'Caddy, load tests & SQLite', intro: 'Automatic HTTPS and quick benchmarks.',
    cmds: [
      ['sudo apt install caddy', 'Caddy web server (automatic HTTPS)'],
      ['sudo nano /etc/caddy/Caddyfile', 'Site config'],
      ['caddy validate --config /etc/caddy/Caddyfile', 'Check the config', 'Valid configuration'],
      ['sudo systemctl reload caddy', 'Apply changes'],
      ['caddy reverse-proxy --from :8080 --to localhost:3000', 'Instant reverse proxy (no config)'],
      ['sudo apt install apache2-utils', 'ab benchmark and htpasswd'],
      ['ab -n 1000 -c 50 http://localhost/', '1000 requests, 50 concurrent'],
      ['sudo htpasswd -c /etc/nginx/.htpasswd ssk', 'Basic-auth password file'],
      ['sqlite3 app.db ".tables"', 'Tables in a SQLite database', 'migrations  sessions    users'],
      ['sqlite3 app.db "SELECT count(*) FROM users;"', 'Quick query', '128']
    ],
    flags: [['example.com {', 'Site block with auto HTTPS', 'Caddyfile'], ['reverse_proxy localhost:8000', 'Proxy directive', 'Caddyfile'], ['file_server', 'Serve static files', 'Caddyfile'], ['-n <N>', 'Requests', 'ab'], ['-c <N>', 'Concurrency', 'ab'], ['-c', 'Create file (htpasswd)', 'htpasswd']],
    demo: ['ab -n 1000 -c 50 http://localhost/', 'This is ApacheBench, Version 2.3 <$Revision: 1923142 $>\n\nBenchmarking localhost (be patient)\nCompleted 1000 requests\nFinished 1000 requests\n\nServer Software:        nginx/1.28.2\nDocument Length:        615 bytes\nConcurrency Level:      50\nTime taken for tests:   0.112 seconds\nComplete requests:      1000\nFailed requests:        0\nRequests per second:    8928.57 [#/sec] (mean)\nTime per request:       5.600 [ms] (mean)\nTransfer rate:          7311.45 [Kbytes/sec] received'] }
]);

UB.add('servers', [
  { id: 'dns-mail', title: 'DNS, DHCP & mail relay', intro: 'BIND, dnsmasq, Kea and Postfix.',
    cmds: [
      ['sudo apt install bind9', 'BIND authoritative/recursive DNS'],
      ['sudo named-checkconf', 'Validate named.conf', ''],
      ['sudo named-checkzone example.lan /etc/bind/db.example.lan', 'Validate a zone file', 'zone example.lan/IN: loaded serial 2026101001\nOK'],
      ['sudo apt install dnsmasq', 'Small DNS + DHCP for labs'],
      ['sudo apt install kea', 'ISC Kea DHCP (replaces isc-dhcp-server)'],
      ['sudo kea-dhcp4 -t /etc/kea/kea-dhcp4.conf', 'Test Kea DHCPv4 config'],
      ['sudo apt install postfix', 'Postfix mail server / relay'],
      ['postconf -n', 'Non-default Postfix settings', 'inet_interfaces = loopback-only\nmyhostname = web01.example.com\nrelayhost = [smtp.example.com]:587\nsmtp_sasl_auth_enable = yes\nsmtp_tls_security_level = encrypt'],
      ['mailq', 'Queued mail', 'Mail queue is empty']
    ],
    flags: [['-t <file>', 'Test config', 'kea-dhcp4'], ['-n', 'Non-defaults', 'postconf'], ['-e k=v', 'Set a value', 'postconf'], ['relayhost', 'Smart host', 'postfix']],
    demo: ['sudo named-checkzone example.lan /etc/bind/db.example.lan', 'zone example.lan/IN: loaded serial 2026101001\nOK'],
    v24: 'isc-dhcp-server is deprecated since 22.04; Kea is the supported DHCP server on both 24.04 and 26.04.' },
  { id: 'monitor', title: 'Monitoring agents', intro: 'Prometheus node exporter, Netdata, Monit.',
    cmds: [
      ['sudo apt install prometheus-node-exporter', 'Host metrics on :9100'],
      ['curl -s localhost:9100/metrics | grep ^node_load1', 'Check it works', 'node_load1 0.41'],
      ['sudo apt install prometheus', 'Prometheus server'],
      ['sudo apt install netdata', 'Real-time dashboard on :19999'],
      ['sudo apt install monit', 'Watchdog that restarts failed services'],
      ['sudo monit status', 'Monitored services and checks']
    ],
    flags: [['--collector.systemd', 'Export systemd unit states', 'node-exporter'], ['check process nginx with pidfile …', 'monitrc rule', 'monit']],
    demo: ['curl -s localhost:9100/metrics | grep ^node_load1', 'node_load1 0.41'] }
]);

UB.add('pro', [
  { id: 'landscape', title: 'Landscape, API & config', intro: 'Fleet management and automation.',
    cmds: [
      ['sudo apt install landscape-client', 'Landscape agent'],
      ['sudo landscape-config --computer-title web01 --account-name standalone --url https://landscape.example.com/message-system --ping-url http://landscape.example.com/ping', 'Register with a self-hosted Landscape server'],
      ['pro api u.pro.status.enabled_services.v1', 'Machine-readable service list (JSON)'],
      ['pro config set apt_news=false', 'Hide Pro news in apt output', ''],
      ['pro help livepatch', 'Docs for one service'],
      ['pro status --format json', 'Status as JSON for scripts']
    ],
    flags: [['api <endpoint>', 'Stable JSON API', 'pro'], ['config set k=v', 'Client settings', 'pro'], ['--computer-title', 'Display name', 'landscape-config'], ['--url / --ping-url', 'Server endpoints', 'landscape-config']],
    demo: ['pro api u.pro.status.enabled_services.v1', '{"_schema_version": "v1", "data": {"attributes": {"enabled_services": [{"name": "esm-apps", "variant_enabled": false}, {"name": "esm-infra", "variant_enabled": false}, {"name": "livepatch", "variant_enabled": false}]}, "meta": {"environment_vars": []}, "type": "EnabledServices"}, "errors": [], "result": "success", "version": "36.1", "warnings": []}'] }
]);

UB.add('upgrades', [
  { id: 'lifecycle', title: 'Release info & interim upgrades', intro: 'distro-info, Prompt=normal, upgrade logs.',
    cmds: [
      ['ubuntu-distro-info --supported', 'Codenames still supported', 'jammy\nnoble\nresolute'],
      ['ubuntu-distro-info --lts', 'Latest LTS codename', 'resolute'],
      ['ubuntu-distro-info --series resolute --fullname', 'Full name of a codename', 'Ubuntu 26.04 LTS "Resolute Raccoon"'],
      ['sudo sed -i "s/^Prompt=lts/Prompt=normal/" /etc/update-manager/release-upgrades', 'Opt in to interim (non-LTS) releases', ''],
      ['sudo do-release-upgrade -m server', 'Server-mode upgrade (no desktop checks)'],
      ['less /var/log/dist-upgrade/main.log', 'What the last release upgrade did'],
      ['sudo apt install ubuntu-release-upgrader-core', 'Reinstall do-release-upgrade if missing']
    ],
    flags: [['--supported', 'Supported series', 'ubuntu-distro-info'], ['--lts', 'Latest LTS', 'ubuntu-distro-info'], ['--devel', 'Development series', 'ubuntu-distro-info'], ['--fullname', 'Full name', 'ubuntu-distro-info'], ['-m server|desktop', 'Upgrade mode', 'do-release-upgrade']],
    demo: ['ubuntu-distro-info --supported', 'jammy\nnoble\nresolute'],
    tips: ['Interim releases get 9 months of support — Prompt=normal is for people who want every new GNOME/kernel.'] }
]);

UB.add('ansible', [
  { id: 'more', title: 'Docs, vault strings & ansible-pull', intro: 'Day-to-day helpers.',
    cmds: [
      ['ansible-doc apt', 'Module documentation with examples'],
      ['ansible-doc -l | grep ufw', 'Find modules by name', 'community.general.ufw   Manage firewall with UFW'],
      ['ansible localhost -m debug -a "var=ansible_facts.distribution_version" -c local', 'Print a fact from the local machine'],
      ['ansible-vault encrypt_string "S3cret" --name db_password', 'Encrypt one variable to paste into YAML'],
      ['ansible-vault edit group_vars/all/vault.yml', 'Edit an encrypted file'],
      ['ansible-pull -U https://github.com/ssk/infra.git local.yml', 'Pull mode: a host configures itself from git'],
      ['pipx install molecule', 'Role testing framework'],
      ['molecule test', 'Create, converge, verify and destroy a test instance']
    ],
    flags: [['-l', 'List modules', 'ansible-doc'], ['-s', 'Snippet', 'ansible-doc'], ['--name', 'Variable name', 'ansible-vault'], ['-U <url>', 'Repository', 'ansible-pull'], ['-C <branch>', 'Branch', 'ansible-pull']],
    demo: ['ansible-vault encrypt_string "S3cret" --name db_password', 'New Vault password: \nConfirm New Vault password: \nEncryption successful\ndb_password: !vault |\n          $ANSIBLE_VAULT;1.1;AES256\n          61386339303534316561643066623266623637346362393437353564323034386131623563356334\n          3562643162333865373532366439366236343935633361310a656432623461313563373664376639'] }
]);

UB.add('k8s', [
  { id: 'helm', title: 'Helm & Canonical Kubernetes', intro: 'Charts and the k8s snap.',
    cmds: [
      ['sudo snap install helm --classic', 'Helm 3'],
      ['helm repo add bitnami https://charts.bitnami.com/bitnami', 'Add a chart repository', '"bitnami" has been added to your repositories'],
      ['helm repo update', 'Refresh chart indexes'],
      ['helm install blog bitnami/wordpress -n blog --create-namespace', 'Install a chart as a release'],
      ['helm list -A', 'Releases in all namespaces', 'NAME  NAMESPACE  REVISION  UPDATED                                 STATUS    CHART             APP VERSION\nblog  blog       1         2026-10-10 12:12:41.0112 +0300 +03     deployed  wordpress-25.0.4  6.8.3'],
      ['helm upgrade blog bitnami/wordpress -n blog -f values.yaml', 'Change values'],
      ['helm rollback blog 1 -n blog', 'Return to revision 1'],
      ['sudo snap install k8s --classic', 'Canonical Kubernetes'],
      ['sudo k8s bootstrap', 'Create a cluster on this node'],
      ['sudo k8s status --wait-ready', 'Wait for a healthy cluster'],
      ['sudo k8s kubectl get nodes', 'Bundled kubectl'],
      ['sudo k8s get-join-token worker1 --worker', 'Token for joining a worker node']
    ],
    flags: [['-n <ns>', 'Namespace', 'helm'], ['--create-namespace', 'Create it if missing', 'helm'], ['-f values.yaml', 'Values file', 'helm'], ['--set k=v', 'Inline value', 'helm'], ['--dry-run', 'Render only', 'helm'], ['bootstrap', 'New cluster', 'k8s'], ['enable <feature>', 'ingress, load-balancer, local-storage…', 'k8s']],
    demo: ['sudo k8s status --wait-ready', 'cluster status:           ready\ncontrol plane nodes:      192.168.1.42:6400 (voter)\nhigh availability:        no\ndatastore:                k8s-dqlite\nnetwork:                  enabled\ndns:                      enabled at 10.152.183.106\ningress:                  disabled\nload-balancer:            disabled\nlocal-storage:            enabled at /var/snap/k8s/common/rawfile-storage\ngateway                   enabled'] }
]);

UB.add('cloud', [
  { id: 'clis', title: 'Cloud provider CLIs', intro: 'AWS, Google Cloud, Azure, DigitalOcean, OpenStack.',
    cmds: [
      ['sudo snap install aws-cli --classic', 'AWS CLI v2'],
      ['aws configure', 'Set keys, region and output format'],
      ['aws ec2 describe-images --owners 099720109477 --filters "Name=name,Values=ubuntu/images/*26.04*" --query "Images[].Name" --output text', 'Find official Ubuntu 26.04 AMIs (Canonical\'s account)'],
      ['sudo snap install google-cloud-cli --classic', 'Google Cloud CLI (gcloud)'],
      ['gcloud init', 'Log in and choose a project'],
      ['gcloud compute images list --filter="family~ubuntu-2604"', 'Ubuntu 26.04 images on GCP'],
      ['curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash', 'Azure CLI (Microsoft\'s apt repo script)'],
      ['az login', 'Sign in to Azure'],
      ['sudo snap install doctl', 'DigitalOcean CLI'],
      ['sudo snap install openstackclients', 'OpenStack CLI clients']
    ],
    flags: [['--region', 'Region', 'aws'], ['--profile', 'Named credentials', 'aws'], ['--query', 'JMESPath filter', 'aws'], ['--output table|json|text', 'Format', 'aws'], ['--project', 'Project', 'gcloud'], ['--filter', 'Filter expression', 'gcloud']],
    demo: ['aws configure', 'AWS Access Key ID [None]: AKIA****************\nAWS Secret Access Key [None]: ****************************************\nDefault region name [None]: me-central-1\nDefault output format [None]: json'],
    tips: ['099720109477 is Canonical\'s AWS account ID — filtering by it avoids look-alike "Ubuntu" AMIs.'] }
]);

/* pop-up knowledge for new tools */
UB.tools({
  nala: { s: 'nala <command> [pkg…]', d: 'APT front end with parallel downloads and history', o: [['install', 'Install'], ['upgrade', 'Update + upgrade'], ['remove', 'Remove'], ['purge', 'Remove with config'], ['fetch', 'Pick fastest mirrors'], ['history', 'Show transactions'], ['history undo <id>', 'Undo'], ['search', 'Search'], ['show', 'Package info'], ['list --upgradable', 'Upgradable packages']] },
  rclone: { s: 'rclone <command> <src> [dst] [flags]', d: 'rsync for cloud storage', o: [['config', 'Manage remotes'], ['ls / lsd / lsl', 'List files / dirs / long'], ['copy', 'Copy, never delete'], ['sync', 'Mirror (deletes extras)'], ['move', 'Move'], ['check', 'Compare'], ['mount', 'FUSE mount'], ['bisync', 'Two-way sync'], ['--dry-run', 'Preview'], ['--progress', 'Progress'], ['--exclude <glob>', 'Exclude'], ['--bwlimit <rate>', 'Bandwidth limit']] },
  nmap: { s: 'nmap [scan type] [options] <targets>', d: 'Network scanner (only scan what you own)', o: [['-sn', 'Host discovery only'], ['-sT', 'TCP connect scan'], ['-sS', 'SYN scan (root)'], ['-sU', 'UDP scan'], ['-sV', 'Service versions'], ['-O', 'OS detection'], ['-p <ports>', 'Ports (22,80 or 1-1024 or -)'], ['-A', 'Aggressive: -O -sV -sC --traceroute'], ['-T4', 'Faster timing'], ['-oN <file>', 'Save output']] },
  tcpdump: { s: 'tcpdump [options] [filter]', d: 'Capture and print network packets', o: [['-i <iface>', 'Interface (any = all)'], ['-n', 'No name resolution'], ['-w <file>', 'Write pcap'], ['-r <file>', 'Read pcap'], ['-c <N>', 'Stop after N packets'], ['-A', 'Print payload as ASCII'], ['port 53', 'Filter by port'], ['host 1.2.3.4', 'Filter by host']] },
  iperf3: { s: 'iperf3 -s | -c <host> [options]', d: 'Network throughput tester', o: [['-s', 'Server mode'], ['-c <host>', 'Client mode'], ['-R', 'Reverse (server sends)'], ['-u', 'UDP'], ['-b <rate>', 'Target bitrate'], ['-P <N>', 'Parallel streams'], ['-t <sec>', 'Duration']] },
  mtr: { s: 'mtr [options] <host>', d: 'Combined traceroute and ping', o: [['-r', 'Report mode'], ['-w', 'Wide report'], ['-c <N>', 'Cycles'], ['-n', 'No DNS'], ['-T', 'TCP probes'], ['-u', 'UDP probes']] },
  gh: { s: 'gh <command> <subcommand> [flags]', d: 'GitHub CLI', o: [['auth login', 'Sign in'], ['repo clone', 'Clone'], ['repo create', 'New repo'], ['pr create', 'Open PR'], ['pr list', 'List PRs'], ['pr checkout <n>', 'Check out a PR'], ['pr merge', 'Merge'], ['issue list', 'Issues'], ['run list', 'CI runs'], ['run watch', 'Follow a run'], ['release create', 'Publish a release']] },
  helm: { s: 'helm <command> [flags]', d: 'Kubernetes package manager', o: [['repo add', 'Add repo'], ['repo update', 'Refresh'], ['search repo', 'Find charts'], ['install', 'Install release'], ['upgrade', 'Upgrade release'], ['rollback', 'Roll back'], ['uninstall', 'Remove'], ['list -A', 'Releases'], ['template', 'Render locally'], ['show values', 'Default values']] },
  k8s: { s: 'k8s <command>', d: 'Canonical Kubernetes snap', o: [['bootstrap', 'Create cluster'], ['status', 'Cluster status'], ['get-join-token <name>', 'Join token'], ['join-cluster <token>', 'Join'], ['enable <feature>', 'Enable feature'], ['disable <feature>', 'Disable'], ['kubectl', 'Bundled kubectl'], ['config', 'Print kubeconfig']] },
  mdadm: { s: 'mdadm [mode] <raiddevice> [options] <devices>', d: 'Linux software RAID manager', o: [['--create', 'New array'], ['--assemble', 'Assemble existing'], ['--detail', 'Array details'], ['--examine', 'Member superblock'], ['--fail', 'Mark failed'], ['--remove', 'Remove member'], ['--add', 'Add member'], ['--grow', 'Reshape/resize'], ['--level', 'RAID level'], ['--raid-devices', 'Member count']] },
  'qemu-img': { s: 'qemu-img <command> [options] <file>', d: 'QEMU disk image utility', o: [['create', 'New image'], ['info', 'Image info'], ['convert', 'Convert format'], ['resize', 'Change size'], ['check', 'Consistency check'], ['snapshot', 'Internal snapshots'], ['-f', 'Input format'], ['-O', 'Output format']] },
  caddy: { s: 'caddy <command> [flags]', d: 'Web server with automatic HTTPS', o: [['run', 'Run in foreground'], ['start / stop', 'Background'], ['reload', 'Reload config'], ['validate', 'Check config'], ['fmt', 'Format Caddyfile'], ['reverse-proxy', 'Quick proxy'], ['file-server', 'Quick static server'], ['--config <file>', 'Config path']] },
  skopeo: { s: 'skopeo <command> [options]', d: 'Work with remote container images', o: [['inspect', 'Image metadata'], ['copy', 'Copy images'], ['list-tags', 'Tags in a repo'], ['delete', 'Delete from registry'], ['login', 'Registry login'], ['sync', 'Mirror repos']] },
  fastfetch: { s: 'fastfetch [options]', d: 'System information tool', o: [['--logo none', 'No logo'], ['-c <preset>', 'Preset'], ['--gen-config', 'Write config'], ['--structure', 'Choose modules']] },
  shellcheck: { s: 'shellcheck [options] <script>', d: 'Shell script linter', o: [['-s bash|sh', 'Shell dialect'], ['-e <code>', 'Exclude code'], ['-f gcc|json|diff', 'Output format'], ['-x', 'Follow source']] }
});
