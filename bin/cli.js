#!/usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import { main } from '../src/index.js';

const program = new Command();

// Add a cool ASCII Header before running the main logic
function displayHeader() {
  console.clear();
  console.log(
    chalk.cyanBright.bold(
      figlet.textSync('SETUPCRAFT', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );
  console.log(chalk.gray('  Enterprise-Grade Dev Environment Automation\n'));
}

program
  .name('setupcraftt')
  .description('Auto development environment setup CLI — from zero to coding in minutes.')
  .version('1.1.0');

// 1. Interactive Dashboard (Default)
program
  .command('ui', { isDefault: true })
  .description('Launch the interactive CLI dashboard')
  .option('--non-interactive', 'Run without prompts, use defaults')
  .option('--dry-run', 'Show what would happen without doing it')
  .option('--quiet', 'Errors only')
  .option('--debug', 'Show all commands')
  .action(() => {
    displayHeader();
    main().catch((err) => {
      console.error(chalk.red('\nFatal error:'), err);
      process.exit(1);
    });
  });

// 2. Doctor Command (Testing execution)
program
  .command('doctor')
  .description('Run system sanity checks')
  .action(async () => {
    displayHeader();
    console.log(chalk.yellow('⠧ Executing System Diagnostics (Doctor)...'));
    // We will expand this in src/index.js later
    await new Promise(r => setTimeout(r, 1000));
    console.log(chalk.green('✅ System is ready for Setupcraft.'));
  });

program.parse();