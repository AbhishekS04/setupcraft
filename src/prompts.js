import * as p from '@clack/prompts';
import { logger } from './logger.js';

export async function runPrompts(args, osInfo) {
  // Skip prompts in non-interactive mode — return defaults
  if (args.nonInteractive) {
    logger.info('Non-interactive mode — using default selections');
    return {
      nodeManager: 'asdf',
      installDocker: true,
      installGit: true,
      installNode: true,
      installPython: true,
      installCliTools: true,
      optionalTools: [],
      configureShell: true,
    };
  }

  p.intro('🚀 Welcome to Setupcraft — Dev Environment Setup');

  const nodeManager = await p.select({
    message: 'Which Node.js version manager would you prefer?',
    options: [
      { value: 'asdf', label: 'asdf-vm', hint: 'recommended — manages multiple languages' },
      { value: 'nvm',  label: 'nvm',     hint: 'Node.js only' },
      { value: 'fnm',  label: 'fnm',     hint: 'Fast Node.js manager' },
      { value: 'none', label: 'None',    hint: "I'll manage Node.js myself" },
    ],
  });

  const coreTools = await p.multiselect({
    message: 'Select core tools to install:',
    options: [
      { value: 'docker',    label: 'Docker',     hint: 'Container runtime',      initialValue: true },
      { value: 'git',       label: 'Git',        hint: 'Version control',        initialValue: true },
      { value: 'python',    label: 'Python 3',   hint: 'python3 + pip + venv',   initialValue: true },
      { value: 'cli-tools', label: 'CLI Tools',  hint: 'fzf, ripgrep, bat, jq', initialValue: true },
    ],
    required: false,
  });

  const optionalTools = await p.multiselect({
    message: 'Optional language runtimes (space to select):',
    options: [
      { value: 'rust', label: 'Rust',   hint: 'cargo, rustc' },
      { value: 'go',   label: 'Go',     hint: 'Cloud/services development' },
      { value: 'java', label: 'Java',   hint: 'OpenJDK' },
    ],
    required: false,
  });

  const configureShell = await p.confirm({
    message: 'Configure shell aliases and prompt?',
    initialValue: true,
  });

  // Handle ctrl+c
  if (p.isCancel(nodeManager) || p.isCancel(coreTools) || p.isCancel(configureShell)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  p.outro('Great! Starting installation...');

  return {
    nodeManager,
    installDocker:   coreTools.includes('docker'),
    installGit:      coreTools.includes('git'),
    installPython:   coreTools.includes('python'),
    installCliTools: coreTools.includes('cli-tools'),
    optionalTools,
    configureShell,
  };
}




