import fs from 'fs';
import os from 'os';

export function detectOS() {
  const platform = process.platform;

  if (platform === 'darwin') return { os: 'macos', distro: 'macos', arch: os.arch() };
  if (platform === 'win32')  return { os: 'windows', distro: 'windows', arch: os.arch() };

  if (platform === 'linux') {
    try {
      const release = fs.readFileSync('/etc/os-release', 'utf8');
      const id = (release.match(/^ID="?([^"\n]+)"?/m) || [])[1]?.toLowerCase();
      const idLike = (release.match(/^ID_LIKE="?([^"\n]+)"?/m) || [])[1]?.toLowerCase() || '';

      if (id === 'fedora')                          return { os: 'linux', distro: 'fedora',  arch: os.arch() };
      if (id === 'arch' || idLike.includes('arch')) return { os: 'linux', distro: 'arch',    arch: os.arch() };
      if (id === 'opensuse' || id?.includes('suse'))return { os: 'linux', distro: 'opensuse',arch: os.arch() };
      if (['ubuntu','debian','pop','linuxmint'].includes(id) || idLike.includes('debian'))
                                                    return { os: 'linux', distro: 'ubuntu',  arch: os.arch() };
    } catch { /* ignore */ }
    return { os: 'linux', distro: 'unknown', arch: os.arch() };
  }

  return { os: 'unknown', distro: 'unknown', arch: os.arch() };
}


