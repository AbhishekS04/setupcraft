import { execSync } from 'child_process';
import { logger } from './logger.js';

function checkTool(name, cmd) {
  try {
    const version = execSync(cmd, { stdio: 'pipe' }).toString().trim();
    return { name, version, ok: true };
  } catch {
    return { name, version: null, ok: false };
  }
}

export async function verify() {
  logger.step('Verifying installations...');

  const results = [
    checkTool('Node.js', 'node --version'),
    checkTool('npm',     'npm --version'),
    checkTool('Python',  'python3 --version'),
    checkTool('Git',     'git --version'),
    checkTool('Docker',  'docker --version'),
  ];

  for (const r of results) {
    if (r.ok) logger.success(`${r.name}: ${r.version}`);
    else       logger.warn(`${r.name}: not found`);
  }

  return results;
}





