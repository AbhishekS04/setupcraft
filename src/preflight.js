import os from 'os';
import net from 'net';
import { execSync } from 'child_process';
import { logger } from './logger.js';

// Native TCP check — no child process, guaranteed timeout
function checkInternet(timeoutMs = 5000) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '1.1.1.1', port: 80 });
    const timer = setTimeout(() => { socket.destroy(); resolve(false); }, timeoutMs);
    socket.on('connect', () => { clearTimeout(timer); socket.destroy(); resolve(true); });
    socket.on('error',   () => { clearTimeout(timer); resolve(false); });
  });
}

export async function preflight(args, osInfo) {
  logger.step('Running preflight checks...');

  // Block running as root
  if (osInfo.os !== 'windows') {
    try {
      const uid = process.getuid?.();
      if (uid === 0) {
        logger.error('Do not run setupcraft as root. Run as your normal user.');
        process.exit(1);
      }
    } catch { /* ignore */ }
  }

  // Check internet connectivity (async, won't hang)
  const online = await checkInternet();
  if (online) {
    logger.success('Internet connection detected');
  } else {
    logger.warn('Could not verify internet connection — continuing anyway');
  }

  // Check available disk space (free RAM as proxy — real disk check via df)
  try {
    const dfOut = execSync("df -BG --output=avail / | tail -1", { stdio: 'pipe' }).toString().trim();
    const freeGB = parseInt(dfOut.replace('G', ''), 10);
    if (freeGB < 5) {
      logger.warn(`Low disk space: ${freeGB}GB free on /. Some installs may fail.`);
    } else {
      logger.success(`Disk space: ${freeGB}GB free on /`);
    }
  } catch {
    const freeGB = (os.freemem() / 1024 ** 3).toFixed(1);
    logger.success(`Memory: ${freeGB}GB free`);
  }

  // Check sudo available
  if (osInfo.os !== 'windows') {
    try {
      execSync('sudo -n true', { stdio: 'ignore' });
      logger.success('sudo access confirmed');
    } catch {
      logger.warn('sudo may prompt for password during installation');
    }
  }

  logger.success('Preflight checks passed\n');
}
