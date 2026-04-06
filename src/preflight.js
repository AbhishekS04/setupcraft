import os from 'os';
import { execSync } from 'child_process';
import { logger } from './logger.js';

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
    } catch {}
  }

  // Check internet connectivity
  try {
    execSync('curl -s --max-time 5 https://registry.npmjs.org > /dev/null 2>&1', { stdio: 'ignore' });
    logger.success('Internet connection detected');
  } catch {
    try {
      execSync('wget -q --timeout=5 https://registry.npmjs.org -O /dev/null', { stdio: 'ignore' });
      logger.success('Internet connection detected');
    } catch {
      logger.warn('Could not verify internet connection — continuing anyway');
    }
  }

  // Check available disk space
  const free = os.freemem();
  const freeGB = (free / 1024 ** 3).toFixed(1);
  if (freeGB < 2) {
    logger.warn(`Low memory: ${freeGB}GB free. Some installs may fail.`);
  } else {
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


