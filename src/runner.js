import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';
import { execa } from 'execa';
import ora from 'ora';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');

export async function runScript(scriptPath, args = [], dryRun = false) {
  const toolName = path.basename(scriptPath, path.extname(scriptPath));
  
  if (dryRun) {
    logger.info(`[dry-run] Would run: ${scriptPath}`);
    return;
  }

  const isWindows = process.platform === 'win32';
  const cmd  = isWindows ? 'powershell.exe' : 'bash';
  const cmdArgs = isWindows ? ['-ExecutionPolicy', 'Bypass', '-File', scriptPath] : [scriptPath, ...args];

  // The secret to the Github CLI aesthetic: Beautiful spinners instead of raw bash vomit!
  const spinner = ora(`Installing ${toolName}...`).start();

  try {
    // Run stealthily in the background. { all: true } captures stdout and stderr together.
    const { all } = await execa(cmd, cmdArgs, { all: true });
    
    spinner.succeed(`Successfully installed ${toolName}`);
    
    // We only log the raw output to a file later, but we keep the terminal clean!
  } catch (err) {
    spinner.fail(`Failed to install ${toolName}`);
    
    // If it fails, WE SHOW the raw logs so the user can debug it
    console.error(`\n--- ERROR LOG (${toolName}) ---`);
    console.error(err.all || err.stderr || err.message);
    console.error(`------------------------------\n`);
    
    throw new Error(`Script failed with exit code ${err.exitCode}: ${scriptPath}`);
  }
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
    installPython:   'python',
  };

  for (const [key, toolName] of Object.entries(toolMap)) {
    if (selections[key]) {
      const script = path.join(SCRIPTS_DIR, 'tools', `${toolName}${ext}`);
      // Pass nodeManager as first arg so nodejs.sh knows which manager to use
      const scriptArgs = toolName === 'nodejs' ? [selections.nodeManager ?? 'none'] : [];
      try {
        await runScript(script, scriptArgs, args.dryRun);
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

  // Configure shell aliases / prompt
  if (selections.configureShell && osInfo.os !== 'windows') {
    await applyShellConfig(args.dryRun);
  }
}

async function applyShellConfig(dryRun) {
  const { readFileSync, existsSync, appendFileSync } = await import('fs');
  const { homedir } = await import('os');

  const blockPath = path.join(__dirname, '..', 'config', 'shell-block.sh');
  if (!existsSync(blockPath)) {
    logger.warn('shell-block.sh not found — skipping shell configuration');
    return;
  }

  const block = readFileSync(blockPath, 'utf8');
  const marker = '# === Setupcraft managed block';

  for (const rc of ['.bashrc', '.zshrc']) {
    const rcPath = path.join(homedir(), rc);
    if (!existsSync(rcPath)) continue;

    const existing = readFileSync(rcPath, 'utf8');
    if (existing.includes(marker)) {
      logger.info(`${rc}: shell block already present — skipping`);
      continue;
    }

    if (dryRun) {
      logger.info(`[dry-run] Would append shell config to ~/${rc}`);
      continue;
    }

    appendFileSync(rcPath, `\n${block}\n`);
    logger.success(`Shell config appended to ~/${rc}`);
  }
}


