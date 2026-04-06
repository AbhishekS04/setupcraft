import chalk from 'chalk';

export function summary(results, logFile) {
  console.log('\n' + chalk.bold('=== Setupcraft Complete ===\n'));

  for (const r of results) {
    if (r.ok) console.log(chalk.green('✅'), `${r.name}: ${r.version}`);
    else      console.log(chalk.yellow('⚠'), `${r.name}: not installed`);
  }

  console.log('\n' + chalk.dim(`📝 Log saved to: ${logFile}`));

  console.log(chalk.bold('\n🚀 Next steps:'));
  console.log('   1. Run: source ~/.bashrc');
  console.log('   2. Create a project: mkdir ~/projects/my-app && cd $_');
  console.log('   3. Run: git init && npm init\n');
}