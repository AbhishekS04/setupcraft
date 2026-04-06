import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');

export function runScript(scriptPath, args = [], dryRun = false) {
  return new Promise((resolve, reject) => {
    if (dryRun) {
      logger.info(`[dry-run] Would run: ${scriptPath}`);
      return resolve();
    }

    const ext = path.extname(scriptPath);
    const isWindows = process.platform === 'win32';

    const cmd  = isWindows ? 'powershell.exe' : 'bash';
    const cmdArgs = isWindows ? ['-ExecutionPolicy', 'Bypass', '-File', scriptPath] : [scriptPath, ...args];

    logger.info(`Running: ${path.basename(scriptPath)}`);

    const child = spawn(cmd, cmdArgs, { stdio: 'inherit' });

    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Script failed with exit code ${code}: ${scriptPath}`));
    });
  });
}

export async function runInstall(selections, args, osInfo) {
  logger.step('Starting installation...');

  const platform = osInfo.distro;
  const ext = osInfo.os === 'windows' ? '.ps1' : '.sh';

  // Run platform setup first
  const platformScript = path.join(SCRIPTS_DIR, 'platforms', `${platform}${ext}`);
  try {
    await runScript(platformScript, [], args.dryRun);
  } catch (e) {
    logger.warn(`Platform script not found for: ${platform} — skipping`);
  }

  // Run tool scripts based on selections
  const toolMap = {
    installGit:      'git',
    installDocker:   'docker',
    installCliTools: 'cli-tools',
    installNode:     'nodejs',
  };

  for (const [key, toolName] of Object.entries(toolMap)) {
    if (selections[key]) {
      const script = path.join(SCRIPTS_DIR, 'tools', `${toolName}${ext}`);
      try {
        await runScript(script, [], args.dryRun);
      } catch (e) {
        logger.error(`Failed to install ${toolName}: ${e.message}`);
      }
    }
  }

  // Optional tools
  for (const tool of selections.optionalTools || []) {
    const script = path.join(SCRIPTS_DIR, 'tools', 'optional', `${tool}${ext}`);
    try {
      await runScript(script, [], args.dryRun);
    } catch (e) {
      logger.error(`Failed to install optional tool ${tool}: ${e.message}`);
    }
  }
}


