import { parseArgs }  from './args.js';
import { detectOS }   from './detect-os.js';
import { logger }     from './logger.js';
import { preflight }  from './preflight.js';
import { runPrompts } from './prompts.js';
import { runInstall } from './runner.js';
import { verify }     from './verify.js';
import { summary }    from './summary.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function main() {
  const args = parseArgs();

  if (args.version) {
    const pkg = JSON.parse(readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    console.log(`setupcraft v${pkg.version}`);
    process.exit(0);
  }

  if (args.help) {
    console.log(`
  Usage: npx setupcraft [options]

  Options:
    --non-interactive   Run without prompts (uses defaults)
    --dry-run           Show what would happen, without doing it
    --quiet             Errors only
    --debug             Show all commands
    --help              Show this message
    --version           Show version
    `);
    process.exit(0);
  }


  const osInfo = detectOS();
  logger.step(`Detected: ${osInfo.os} / ${osInfo.distro} (${osInfo.arch})`);

  await preflight(args, osInfo);

  const selections = await runPrompts(args);

  await runInstall(selections, args, osInfo);

  const results = await verify();

  summary(results, logger.logFile);
}



