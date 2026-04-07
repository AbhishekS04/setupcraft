import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';

const logFile = path.join(os.homedir(), `.setupcraft-${Date.now()}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function write(msg) {
  // eslint-disable-next-line no-control-regex
  logStream.write(msg.replace(/\x1B\[[0-9;]*m/g, '') + '\n');
}

export const logger = {
  info:    (msg) => { console.log(chalk.cyan('ℹ'), msg);            write(`[INFO]  ${msg}`); },
  success: (msg) => { console.log(chalk.green('✅'), msg);           write(`[OK]    ${msg}`); },
  warn:    (msg) => { console.log(chalk.yellow('⚠'), msg);           write(`[WARN]  ${msg}`); },
  error:   (msg) => { console.log(chalk.red('✖'), chalk.red(msg));   write(`[ERROR] ${msg}`); },
  step:    (msg) => { console.log(chalk.bold.magenta('\n▶'), chalk.bold(msg)); write(`[STEP]  ${msg}`); },
  logFile,
};
