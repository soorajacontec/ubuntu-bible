/* Multimedia, Gaming, Backup, Containers, LXD/Incus, Multipass, Virtualization */
UB.sec({ id: 'multimedia', title: 'Multimedia', icon: '🎬', desc: 'Codecs, audio (PipeWire), video conversion and media players.', cards: [
  { id: 'codecs', title: 'Codecs & fonts', intro: 'Restricted formats and hardware decoding.',
    cmds: [
      ['sudo apt install ubuntu-restricted-extras', 'MP3/H.264 codecs, MS fonts, unrar'],
      ['sudo apt install ubuntu-restricted-addons', 'Codecs without the fonts/EULA'],
      ['sudo apt install vainfo', 'VA-API diagnostic tool'],
      ['vainfo | grep -E "Driver|VAProfileH264|VAProfileAV1"', 'Check hardware video acceleration'],
      ['sudo apt install intel-media-va-driver-non-free', 'Full Intel VA-API driver'],
      ['fc-list | wc -l', 'Installed fonts']
    ],
    flags: [['ubuntu-restricted-extras', 'Codecs + fonts + archive tools', 'apt'], ['ubuntu-restricted-addons', 'GStreamer codec plugins', 'apt'], ['--display', 'X11/Wayland display', 'vainfo']],
    demo: ['vainfo | grep -E "Driver|VAProfileH264|VAProfileAV1"', 'vainfo: Driver version: Intel iHD driver for Intel(R) Gen Graphics - 25.3.4 ()\n      VAProfileH264Main               :\tVAEntrypointVLD\n      VAProfileH264High               :\tVAEntrypointVLD\n      VAProfileH264High               :\tVAEntrypointEncSliceLP\n      VAProfileAV1Profile0            :\tVAEntrypointVLD'],
    tips: ['26.04 enables VA-API hardware video acceleration by default in more apps; the extras package is still needed for some formats.'] },
  { id: 'audio', title: 'Audio with PipeWire', intro: 'wpctl, pactl and troubleshooting.',
    cmds: [
      ['wpctl status', 'Devices, sinks, sources and streams'],
      ['wpctl set-default 52', 'Make node 52 the default output'],
      ['wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+', 'Volume up 5%'],
      ['wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle', 'Toggle mute'],
      ['pactl list short sinks', 'Outputs (PulseAudio-compatible)'],
      ['systemctl --user restart pipewire pipewire-pulse wireplumber', 'Restart the audio stack'],
      ['sudo apt install pavucontrol', 'Per-app volume mixer GUI']
    ],
    flags: [['status', 'Overview', 'wpctl'], ['set-default <id>', 'Default device', 'wpctl'], ['set-volume <id> <v>', 'Volume (0.5, 5%+)', 'wpctl'], ['set-mute <id> 1|0|toggle', 'Mute', 'wpctl'], ['list short sinks', 'Compact sink list', 'pactl']],
    demo: ['wpctl status', 'PipeWire \'pipewire-0\' [1.4.7, ssk@ubuntu, cookie:3891224610]\n └─ Clients:\n        33. WirePlumber                         [1.4.7, ssk@ubuntu, pid:2141]\n        45. Firefox                             [1.4.7, ssk@ubuntu, pid:3120]\n\nAudio\n ├─ Devices:\n │      43. Meteor Lake-P HD Audio Controller   [alsa]\n │      61. WH-1000XM5                          [bluez5]\n │\n ├─ Sinks:\n │      52. Speaker                             [vol: 0.60]\n │  *   64. WH-1000XM5                          [vol: 0.45]\n │\n ├─ Sources:\n │  *   53. Digital Microphone                  [vol: 1.00]\n │\n └─ Streams:\n        88. Firefox\n             89. output_FL       > WH-1000XM5:playback_FL\n             90. output_FR       > WH-1000XM5:playback_FR'] },
  { id: 'convert', title: 'Convert & download', intro: 'ffmpeg, ImageMagick, yt-dlp.',
    cmds: [
      ['sudo apt install ffmpeg', 'Install FFmpeg'],
      ['ffmpeg -i input.mov -c:v libx264 -crf 23 -c:a aac output.mp4', 'Convert to H.264 MP4'],
      ['ffmpeg -i video.mp4 -vn -c:a libopus audio.opus', 'Extract audio'],
      ['ffmpeg -ss 00:01:00 -to 00:01:30 -i in.mp4 -c copy clip.mp4', 'Cut a clip without re-encoding'],
      ['ffmpeg -i in.mp4 -vf scale=1280:-2 out-720p.mp4', 'Resize'],
      ['sudo apt install imagemagick', 'Install ImageMagick'],
      ['convert photo.png -resize 50% photo-small.jpg', 'Resize/convert an image'],
      ['pipx install yt-dlp', 'yt-dlp (kept current via pipx)'],
      ['yt-dlp -x --audio-format mp3 "URL"', 'Download audio from a video you have rights to']
    ],
    flags: [['-c copy', 'Stream copy (no re-encode)', 'ffmpeg'], ['-crf', 'Quality', 'ffmpeg'], ['-vn / -an', 'Drop video / audio', 'ffmpeg'], ['-x', 'Extract audio', 'yt-dlp'], ['-f <fmt>', 'Format selection', 'yt-dlp'], ['-resize', 'Scale', 'convert']],
    demo: ['ffmpeg -i input.mov -c:v libx264 -crf 23 -c:a aac output.mp4', 'ffmpeg version 7.1.2-0ubuntu3 Copyright (c) 2000-2025 the FFmpeg developers\nInput #0, mov,mp4,m4a,3gp,3g2,mj2, from \'input.mov\':\n  Duration: 00:02:14.36, start: 0.000000, bitrate: 18342 kb/s\n  Stream #0:0: Video: hevc (Main), yuv420p(tv, bt709), 1920x1080, 29.97 fps\n  Stream #0:1: Audio: aac (LC), 48000 Hz, stereo, fltp, 256 kb/s\nOutput #0, mp4, to \'output.mp4\':\n  Stream #0:0: Video: h264 (libx264), yuv420p, 1920x1080, q=2-31, 29.97 fps\n  Stream #0:1: Audio: aac (LC), 48000 Hz, stereo, fltp, 128 kb/s\n[out#0/mp4 @ 0x5d1c] video:61824KiB audio:2101KiB subtitle:0KiB other streams:0KiB global headers:0KiB muxing overhead: 0.191247%\nframe= 4027 fps=142 q=-1.0 Lsize=   64047KiB time=00:02:14.33 bitrate=3906.0kbits/s speed=4.74x'] },
  { id: 'players', title: 'Players & recording', intro: 'VLC, mpv, OBS, screen recording.',
    cmds: [
      ['sudo snap install vlc', 'VLC (snap)'],
      ['sudo apt install mpv', 'mpv minimal player'],
      ['mpv --hwdec=auto movie.mkv', 'Play with hardware decoding'],
      ['flatpak install flathub com.obsproject.Studio', 'OBS Studio (official Flatpak)'],
      ['flatpak install flathub org.kde.kdenlive', 'Kdenlive video editor'],
      ['sudo apt install gimp inkscape', 'Image editing and vector graphics']
    ],
    flags: [['--hwdec=auto', 'Hardware decoding', 'mpv'], ['--fs', 'Fullscreen', 'mpv'], ['--loop', 'Repeat', 'mpv']],
    demo: ['mpv --hwdec=auto movie.mkv', ' (+) Video --vid=1 (*) (h264 1920x1080 23.976fps)\n (+) Audio --aid=1 --alang=eng (*) (aac 2ch 48000Hz)\nUsing hardware decoding (vaapi).\nAO: [pipewire] 48000Hz stereo 2ch floatp\nVO: [gpu-next] 1920x1080 vaapi[nv12]\nAV: 00:00:05 / 01:52:44 (0%) A-V:  0.000'],
    tips: ['GNOME\'s built-in screen recorder: Ctrl+Shift+Alt+R (or the screenshot UI with Print Screen).'] }
]});

UB.sec({ id: 'gaming', title: 'Gaming', icon: '🎮', desc: 'Steam, Proton, Lutris, Heroic and performance overlays.', cards: [
  { id: 'steam', title: 'Steam & Proton', intro: 'Play Windows games through Proton.',
    cmds: [
      ['sudo dpkg --add-architecture i386', 'Enable 32-bit libraries (needed by Steam)'],
      ['sudo apt update', 'Refresh lists after adding i386'],
      ['sudo apt install steam-installer', 'Steam from Ubuntu multiverse'],
      ['sudo snap install steam', 'Alternative: Steam snap'],
      ['flatpak install flathub com.valvesoftware.Steam', 'Alternative: Steam Flatpak'],
      ['sudo apt install protontricks', 'Winetricks helper for Proton prefixes'],
      ['gamemoderun %command%', 'Steam launch option: apply GameMode tweaks'],
      ['mangohud %command%', 'Steam launch option: FPS/temps overlay']
    ],
    flags: [['%command%', 'Placeholder for the game in Steam launch options', 'steam'], ['PROTON_LOG=1', 'Write Proton logs to ~/steam-*.log', 'steam'], ['PROTON_ENABLE_WAYLAND=1', 'Native Wayland in Proton 10+', 'steam'], ['DXVK_HUD=fps', 'DXVK overlay', 'steam']],
    demo: ['sudo dpkg --add-architecture i386', ''],
    tips: ['Enable Steam Play for all titles: Steam → Settings → Compatibility. Check ProtonDB for per-game tips.', '26.04\'s kernel 7.0 includes the NTSYNC driver, which recent Proton/Wine use for faster Windows synchronisation.'] },
  { id: 'launchers', title: 'Lutris, Heroic & tools', intro: 'GOG, Epic and emulators.',
    cmds: [
      ['flatpak install flathub net.lutris.Lutris', 'Lutris'],
      ['flatpak install flathub com.heroicgameslauncher.hgl', 'Heroic (Epic, GOG, Amazon)'],
      ['flatpak install flathub com.vysp3r.ProtonPlus', 'Manage Proton-GE and other runners'],
      ['sudo apt install gamemode mangohud', 'GameMode and MangoHud'],
      ['gamemoded -s', 'Is GameMode active?'],
      ['sudo apt install mesa-utils vulkan-tools', 'GL/Vulkan diagnostics'],
      ['vulkaninfo --summary', 'Vulkan devices and drivers']
    ],
    flags: [['-s', 'Status', 'gamemoded'], ['--summary', 'Short report', 'vulkaninfo']],
    demo: ['vulkaninfo --summary', '==========\nVULKANINFO\n==========\n\nVulkan Instance Version: 1.4.321\n\nDevices:\n========\nGPU0:\n\tapiVersion         = 1.4.321\n\tdriverVersion      = 25.2.3\n\tvendorID           = 0x8086\n\tdeviceName         = Intel(R) Arc(tm) Graphics (MTL)\n\tdriverName         = Intel open-source Mesa driver\nGPU1:\n\tapiVersion         = 1.4.312\n\tdriverVersion      = 580.82.9.0\n\tvendorID           = 0x10de\n\tdeviceName         = NVIDIA GeForce RTX 4050 Laptop GPU\n\tdriverName         = NVIDIA'] }
]});

UB.sec({ id: 'backup', title: 'Backup', icon: '💾', desc: 'Déjà Dup, Timeshift, rsync, restic and Borg — plus restore drills.', cards: [
  { id: 'desktop', title: 'Desktop backups', intro: 'Déjà Dup (Backups) and Timeshift.',
    cmds: [
      ['sudo apt install deja-dup', 'Backups app (restic or duplicity backend)'],
      ['deja-dup --backup', 'Run a backup now'],
      ['sudo apt install timeshift', 'System snapshots (rsync or Btrfs)'],
      ['sudo timeshift --create --comments "before upgrade"', 'Create a system snapshot'],
      ['sudo timeshift --list', 'List snapshots'],
      ['sudo timeshift --restore', 'Restore interactively']
    ],
    flags: [['--backup', 'Back up now', 'deja-dup'], ['--restore <file>', 'Restore a file', 'deja-dup'], ['--create', 'New snapshot', 'timeshift'], ['--comments', 'Label', 'timeshift'], ['--delete', 'Remove snapshot', 'timeshift']],
    demo: ['sudo timeshift --list', 'Mounted \'/dev/nvme0n1p2\' at \'/run/timeshift/12345/backup\'\nDevice : /dev/nvme0n1p2\nUUID   : c1b2d3e4-8f9a-4b0c-9d1e-2f3a4b5c6d7e\nPath   : /run/timeshift/12345/backup\nMode   : RSYNC\nStatus : OK\n3 snapshots, 41.2 GB free\n\nNum     Name                 Tags  Description\n------------------------------------------------------------------------------\n0    >  2026-09-28_02-00-01  D\n1    >  2026-10-01_21-14-52  O     before nvidia 580\n2    >  2026-10-03_08-40-17  O     before upgrade'],
    tips: ['Timeshift protects the system, not your documents — pair it with Déjà Dup or restic for /home.'] },
  { id: 'rsync', title: 'rsync & tar', intro: 'Simple, scriptable copies.',
    cmds: [
      ['rsync -aAXHv --delete ~/ /media/ssk/Backup/home/', 'Mirror your home to a USB drive'],
      ['rsync -aAXHvn --delete ~/ /media/ssk/Backup/home/', 'Dry run first'],
      ['rsync -a --link-dest=../latest ~/ /backup/2026-10-03/', 'Space-saving dated snapshots'],
      ['sudo tar --zstd -cpf /backup/etc-$(date +%F).tar.zst /etc', 'Archive /etc with date'],
      ['dpkg --get-selections > packages.txt', 'Save your package list'],
      ['apt-mark showmanual > manual-packages.txt', 'Manually installed packages'],
      ['snap list > snaps.txt', 'Save snap list']
    ],
    flags: [['-a', 'Archive', 'rsync'], ['-A -X -H', 'ACLs, xattrs, hard links', 'rsync'], ['--delete', 'Mirror deletions', 'rsync'], ['-n', 'Dry run', 'rsync'], ['--link-dest', 'Hard-link unchanged files', 'rsync']],
    demo: ['rsync -aAXHvn --delete ~/ /media/ssk/Backup/home/', 'sending incremental file list\ndeleting Documents/old-draft.odt\nDocuments/report-q3.pdf\nPictures/2026/10/IMG_0412.jpg\n.config/Code/User/settings.json\n\nsent 18,224 bytes  received 1,041 bytes  38,530.00 bytes/sec\ntotal size is 48,213,889,101  speedup is 2,502,694.58 (DRY RUN)'],
    warn: ['A trailing slash matters: `src/` copies contents, `src` copies the directory itself. With --delete, a wrong path can wipe the target.'] },
  { id: 'restic', title: 'restic & Borg', intro: 'Encrypted, deduplicated, versioned.',
    cmds: [
      ['sudo apt install restic', 'Install restic'],
      ['restic -r /media/ssk/Backup/restic init', 'Create a repository'],
      ['restic -r sftp:nas:/backups/laptop backup ~ --exclude-caches', 'Back up home over SFTP'],
      ['restic -r sftp:nas:/backups/laptop snapshots', 'List snapshots'],
      ['restic -r sftp:nas:/backups/laptop forget --keep-daily 7 --keep-weekly 4 --keep-monthly 12 --prune', 'Retention + cleanup'],
      ['restic -r sftp:nas:/backups/laptop restore latest --target /tmp/restore --include /home/ssk/Documents', 'Restore a folder'],
      ['sudo apt install borgbackup', 'Install Borg'],
      ['borg create --stats ssh://nas/./borg::{hostname}-{now} ~', 'Create a Borg archive']
    ],
    flags: [['-r', 'Repository', 'restic'], ['--exclude-caches', 'Skip CACHEDIR.TAG dirs', 'restic'], ['--keep-*', 'Retention policy', 'restic'], ['--prune', 'Free space', 'restic'], ['RESTIC_PASSWORD_FILE', 'Password from file (for cron/timers)', 'restic']],
    demo: ['restic -r sftp:nas:/backups/laptop backup ~ --exclude-caches', 'repository 7f3a91c2 opened (version 2, compression level auto)\nusing parent snapshot 1c9e04ab\n\nFiles:         412 new,  1203 changed, 186442 unmodified\nDirs:           31 new,   288 changed,  21944 unmodified\nAdded to the repository: 1.284 GiB (902.311 MiB stored)\n\nprocessed 188057 files, 48.213 GiB in 1:42\nsnapshot 5d2b7e10 saved'],
    tips: ['Test restores regularly. A backup you have never restored is a hope, not a backup.'] }
]});

UB.sec({ id: 'containers', title: 'Containers', icon: '🐳', desc: 'Docker Engine and Podman on Ubuntu — install, run, compose and clean up.', cards: [
  { id: 'docker-install', title: 'Install Docker', intro: 'Ubuntu archive (docker.io) or Docker\'s repo (docker-ce).',
    cmds: [
      ['sudo apt install docker.io docker-compose-v2 docker-buildx', 'Docker from the Ubuntu archive (Docker 29 on 26.04)'],
      ['sudo usermod -aG docker $USER', 'Use docker without sudo (re-login)'],
      ['docker run --rm hello-world', 'Smoke test'],
      ['docker version', 'Client and server versions'],
      ['sudo snap install docker', 'Alternative: Docker snap (Canonical)'],
      ['sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin', 'Docker CE after adding Docker\'s apt repository']
    ],
    flags: [['docker.io', 'Ubuntu-maintained engine', 'apt'], ['docker-compose-v2', 'Compose v2 plugin (docker compose)', 'apt'], ['docker-ce', 'Docker Inc. engine', 'apt']],
    demo: ['docker run --rm hello-world', 'Unable to find image \'hello-world:latest\' locally\nlatest: Pulling from library/hello-world\n17eec7bbc9d7: Pull complete\nDigest: sha256:54e66cc1dd1fcb1c3c58bd8017914dbed8701e2d8c74d9262e26bd9cc1642d31\nStatus: Downloaded newer image for hello-world:latest\n\nHello from Docker!\nThis message shows that your installation appears to be working correctly.'],
    warn: ['The docker group is root-equivalent. Consider rootless Docker or Podman on shared machines.', 'Do not mix docker.io and docker-ce — remove one before installing the other.'] },
  { id: 'docker', title: 'Run & manage containers', intro: 'Everyday docker commands.',
    cmds: [
      ['docker run -d --name web -p 8080:80 --restart unless-stopped nginx:stable', 'Run nginx in the background'],
      ['docker ps -a', 'All containers'],
      ['docker logs -f web', 'Follow logs'],
      ['docker exec -it web bash', 'Shell inside a container'],
      ['docker stop web', 'Stop'],
      ['docker rm web', 'Remove'],
      ['docker images', 'Local images'],
      ['docker build -t myapp:1.0 .', 'Build from a Dockerfile'],
      ['docker system prune -af --volumes', 'Remove everything unused (careful)']
    ],
    flags: [['-d', 'Detached'], ['-it', 'Interactive TTY'], ['--rm', 'Remove on exit'], ['-p host:container', 'Publish port'], ['-v host:container', 'Mount'], ['--name', 'Name'], ['--restart unless-stopped', 'Restart policy'], ['-e KEY=val', 'Env var']],
    demo: ['docker ps -a', 'CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS                     PORTS                                     NAMES\n3c9f1a2b4d5e   nginx:stable   "/docker-entrypoint.…"   12 minutes ago   Up 12 minutes              0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   web\n8a7b6c5d4e3f   postgres:18    "docker-entrypoint.s…"   2 days ago       Exited (0) 3 hours ago                                               db'] },
  { id: 'compose', title: 'Docker Compose', intro: 'Multi-container apps from compose.yaml.',
    cmds: [
      ['docker compose up -d', 'Start the stack in the background'],
      ['docker compose ps', 'Services and state'],
      ['docker compose logs -f api', 'Follow one service'],
      ['docker compose pull', 'Pull newer images'],
      ['docker compose down', 'Stop and remove containers'],
      ['docker compose config', 'Validate and print merged config']
    ],
    flags: [['-d', 'Detached', 'docker'], ['-f <file>', 'Compose file', 'docker'], ['--build', 'Rebuild images', 'docker'], ['-v', 'With down: remove volumes', 'docker']],
    demo: ['docker compose up -d', '[+] Running 4/4\n ✔ Network app_default  Created     0.1s\n ✔ Volume "app_pgdata"  Created     0.0s\n ✔ Container app-db-1   Started     0.6s\n ✔ Container app-api-1  Started     0.9s'],
    tips: ['Use `docker compose` (v2 plugin, space) — the old `docker-compose` (hyphen) Python tool is retired.'] },
  { id: 'podman', title: 'Podman (rootless)', intro: 'Daemonless containers as your own user.',
    cmds: [
      ['sudo apt install podman', 'Install Podman'],
      ['podman run -d --name web -p 8080:80 docker.io/library/nginx:stable', 'Run rootless (fully qualified image)'],
      ['podman ps', 'Running containers'],
      ['podman generate kube web > web.yaml', 'Export as Kubernetes YAML'],
      ['podman kube play web.yaml', 'Run Kubernetes YAML'],
      ['mkdir -p ~/.config/containers/systemd', 'Quadlet directory for user units'],
      ['systemctl --user daemon-reload', 'Generate services from .container files'],
      ['systemctl --user start web', 'Start a Quadlet-defined container']
    ],
    flags: [['--userns=keep-id', 'Map your UID', 'podman'], [':Z / :z', 'SELinux relabel (no-op on Ubuntu)', 'podman'], ['--replace', 'Replace existing container', 'podman'], ['unqualified-search-registries', 'Short-name registries (registries.conf)', 'podman']],
    demo: ['podman ps', 'CONTAINER ID  IMAGE                           COMMAND               CREATED        STATUS        PORTS                 NAMES\n9e8d7c6b5a41  docker.io/library/nginx:stable  nginx -g daemon o...  4 minutes ago  Up 4 minutes  0.0.0.0:8080->80/tcp  web'] }
]});

UB.sec({ id: 'lxd', title: 'LXD/Incus', icon: '📦', desc: 'System containers and VMs with LXD (snap) or Incus (archive).', cards: [
  { id: 'lxd', title: 'LXD', intro: 'Canonical\'s container & VM manager.',
    cmds: [
      ['sudo snap install lxd', 'Install LXD (preinstalled on Ubuntu Server)'],
      ['sudo usermod -aG lxd $USER', 'Allow your user (re-login)'],
      ['lxd init --minimal', 'Quick default setup'],
      ['lxc launch ubuntu:26.04 web', 'Launch an Ubuntu 26.04 container'],
      ['lxc launch ubuntu:24.04 vm1 --vm -c limits.cpu=2 -c limits.memory=4GiB', 'Launch a VM'],
      ['lxc list', 'Instances and IPs'],
      ['lxc exec web -- bash', 'Shell inside'],
      ['lxc snapshot web before-upgrade', 'Snapshot'],
      ['lxc restore web before-upgrade', 'Restore'],
      ['lxc delete -f web', 'Delete']
    ],
    flags: [['--vm', 'Virtual machine', 'lxc'], ['-c key=value', 'Config at launch', 'lxc'], ['-p <profile>', 'Profile', 'lxc'], ['-f', 'Force', 'lxc'], ['ubuntu:', 'Official Ubuntu image remote', 'lxc'], ['images:', 'Community images remote', 'lxc']],
    demo: ['lxc list', '+------+---------+----------------------+-----------------------------------------------+-----------------+-----------+\n| NAME |  STATE  |         IPV4         |                     IPV6                      |      TYPE       | SNAPSHOTS |\n+------+---------+----------------------+-----------------------------------------------+-----------------+-----------+\n| vm1  | RUNNING | 10.92.14.188 (enp5s0) | fd42:e1c2:a9b0:7d31:216:3eff:fe6b:2a11 (enp5s0) | VIRTUAL-MACHINE | 0         |\n| web  | RUNNING | 10.92.14.42 (eth0)   | fd42:e1c2:a9b0:7d31:216:3eff:fe90:c4a2 (eth0) | CONTAINER       | 1         |\n+------+---------+----------------------+-----------------------------------------------+-----------------+-----------+'],
    warn: ['LXD and Docker both manage iptables/nftables; if LXD containers lose network after installing Docker, allow the lxdbr0 bridge in the DOCKER-USER chain.'] },
  { id: 'incus', title: 'Incus', intro: 'The community fork, packaged as a deb.',
    cmds: [
      ['sudo apt install incus', 'Install Incus from the archive'],
      ['sudo adduser $USER incus-admin', 'Grant admin access (re-login)'],
      ['incus admin init --minimal', 'Quick setup'],
      ['incus launch images:ubuntu/26.04 c1', 'Launch from the community image server'],
      ['incus list', 'Instances'],
      ['incus shell c1', 'Root shell'],
      ['incus snapshot create c1 snap0', 'Snapshot'],
      ['sudo lxd-to-incus', 'Migrate existing LXD instances to Incus']
    ],
    flags: [['images:', 'Community image remote', 'incus'], ['--vm', 'VM instance', 'incus'], ['-c', 'Config', 'incus'], ['admin init', 'Initial config', 'incus']],
    demo: ['incus launch images:ubuntu/26.04 c1', 'Launching c1'],
    tips: ['Incus cannot use the `ubuntu:` image remote; use `images:ubuntu/26.04`.'] }
]});

UB.sec({ id: 'multipass', title: 'Multipass', icon: '🪟', desc: 'Instant Ubuntu VMs for development — one command to a shell.', cards: [
  { id: 'basics', title: 'Launch & use VMs', intro: 'Create, enter, share files.',
    cmds: [
      ['sudo snap install multipass', 'Install Multipass'],
      ['multipass find', 'Available images'],
      ['multipass launch 26.04 --name dev --cpus 2 --memory 4G --disk 20G', 'Create a VM'],
      ['multipass list', 'VMs and IPs'],
      ['multipass shell dev', 'Open a shell'],
      ['multipass exec dev -- lsb_release -a', 'Run a command inside'],
      ['multipass mount ~/code dev:/home/ubuntu/code', 'Share a folder'],
      ['multipass transfer notes.txt dev:/home/ubuntu/', 'Copy a file in'],
      ['multipass stop dev', 'Stop'],
      ['multipass delete --purge dev', 'Delete permanently']
    ],
    flags: [['--name', 'VM name', 'multipass'], ['--cpus', 'vCPUs', 'multipass'], ['--memory', 'RAM', 'multipass'], ['--disk', 'Disk', 'multipass'], ['--cloud-init <file>', 'Provision with cloud-init', 'multipass'], ['--purge', 'Delete permanently', 'multipass']],
    demo: [['multipass launch 26.04 --name dev --cpus 2 --memory 4G --disk 20G', 'Launched: dev'],
      ['multipass list', 'Name                    State             IPv4             Image\ndev                     Running           10.163.24.71     Ubuntu 26.04 LTS\nprimary                 Stopped           --               Ubuntu 24.04 LTS']] },
  { id: 'advanced', title: 'Cloud-init, snapshots & blueprints', intro: 'Reproducible dev VMs.',
    cmds: [
      ['multipass launch --name web --cloud-init cloud-config.yaml', 'Provision on first boot'],
      ['multipass snapshot dev --name clean', 'Snapshot a stopped VM'],
      ['multipass restore dev.clean', 'Restore a snapshot'],
      ['multipass info dev', 'Detailed info'],
      ['multipass set local.dev.cpus=4', 'Change resources of a stopped VM'],
      ['multipass alias dev:docker docker', 'Run "docker" on the host → inside dev'],
      ['multipass launch docker --name dock', 'Launch a ready-made Docker VM (blueprint)']
    ],
    flags: [['local.<vm>.cpus', 'vCPU setting', 'multipass'], ['local.<vm>.memory', 'RAM setting', 'multipass'], ['local.driver', 'qemu/lxd (Linux)', 'multipass']],
    demo: ['multipass info dev', 'Name:           dev\nState:          Running\nSnapshots:      1\nIPv4:           10.163.24.71\nRelease:        Ubuntu 26.04.1 LTS\nImage hash:     4c0b9e61a2f3 (Ubuntu 26.04 LTS)\nCPU(s):         2\nLoad:           0.08 0.04 0.01\nDisk usage:     2.6GiB out of 19.3GiB\nMemory usage:   412.7MiB out of 3.8GiB\nMounts:         /home/ssk/code => /home/ubuntu/code'] }
]});

UB.sec({ id: 'virt', title: 'Virtualization', icon: '🖧', desc: 'KVM, QEMU, libvirt and virt-manager.', cards: [
  { id: 'setup', title: 'Install KVM & virt-manager', intro: 'Check support and install the stack.',
    cmds: [
      ['egrep -c "(vmx|svm)" /proc/cpuinfo', 'CPU virtualization flags (> 0 is good)', '16'],
      ['sudo apt install cpu-checker', 'kvm-ok tool'],
      ['kvm-ok', 'Is KVM usable?'],
      ['sudo apt install qemu-system-x86 libvirt-daemon-system virtinst virt-manager', 'KVM + libvirt + GUI'],
      ['sudo usermod -aG libvirt,kvm $USER', 'Manage VMs without sudo (re-login)'],
      ['virsh -c qemu:///system list --all', 'VMs on the system connection']
    ],
    flags: [['qemu:///system', 'System-wide VMs', 'virsh'], ['qemu:///session', 'Per-user VMs', 'virsh']],
    demo: ['kvm-ok', 'INFO: /dev/kvm exists\nKVM acceleration can be used'],
    tips: ['26.04 ships QEMU 10.2 and libvirt 12.'] },
  { id: 'create', title: 'Create VMs', intro: 'virt-install from the CLI.',
    cmds: [
      ['virt-install --name u26 --memory 4096 --vcpus 2 --disk size=30 --cdrom ~/Downloads/ubuntu-26.04.1-desktop-amd64.iso --osinfo detect=on,require=off --boot uefi --tpm default', 'Desktop VM with UEFI and TPM'],
      ['virt-install --name srv --memory 2048 --vcpus 2 --disk size=20 --cloud-init user-data=user-data.yaml --import --disk /var/lib/libvirt/images/noble-server-cloudimg-amd64.img --osinfo ubuntu24.04 --graphics none', 'Server VM from a cloud image'],
      ['osinfo-query os | grep -i ubuntu', 'Known OS variants'],
      ['virt-viewer u26', 'Open the VM display']
    ],
    flags: [['--name', 'Name', 'virt-install'], ['--memory', 'MiB', 'virt-install'], ['--vcpus', 'CPUs', 'virt-install'], ['--disk size=N', 'New disk (GiB)', 'virt-install'], ['--cdrom', 'ISO', 'virt-install'], ['--osinfo', 'OS variant', 'virt-install'], ['--boot uefi', 'UEFI', 'virt-install'], ['--tpm default', 'vTPM', 'virt-install']],
    demo: ['osinfo-query os | grep -i ubuntu', ' ubuntu24.04          | Ubuntu 24.04 LTS                                   | 24.04    | http://ubuntu.com/ubuntu/24.04\n ubuntu25.04          | Ubuntu 25.04                                       | 25.04    | http://ubuntu.com/ubuntu/25.04\n ubuntu25.10          | Ubuntu 25.10                                       | 25.10    | http://ubuntu.com/ubuntu/25.10\n ubuntu26.04          | Ubuntu 26.04 LTS                                   | 26.04    | http://ubuntu.com/ubuntu/26.04'] },
  { id: 'manage', title: 'Manage with virsh', intro: 'Lifecycle, snapshots, networks.',
    cmds: [
      ['virsh list --all', 'All VMs'],
      ['virsh start u26', 'Start'],
      ['virsh shutdown u26', 'Graceful shutdown'],
      ['virsh destroy u26', 'Force off'],
      ['virsh autostart u26', 'Start with host'],
      ['virsh snapshot-create-as u26 clean "fresh install"', 'Snapshot'],
      ['virsh snapshot-revert u26 clean', 'Revert'],
      ['virsh domifaddr u26', 'Guest IP'],
      ['virsh undefine u26 --nvram --remove-all-storage', 'Delete VM and disks']
    ],
    flags: [['--all', 'Include stopped', 'virsh'], ['--nvram', 'Remove UEFI vars', 'virsh'], ['--remove-all-storage', 'Delete disks', 'virsh']],
    demo: ['virsh list --all', ' Id   Name   State\n-----------------------\n 3    u26    running\n -    srv    shut off'] }
]});
