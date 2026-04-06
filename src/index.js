import { parseArgs }  from './args.js';
import { detectOS }   from './detect-os.js';
import { logger }     from './logger.js';
import { preflight }  from './preflight.js';
import { runPrompts } from './prompts.js';
import { runInstall } from './runner.js';
import { verify }     from './verify.js';
import { summary }    from './summary.js';

export async function main() {
  const args = parseArgs();

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

  const selections = await runPrompts(args, osInfo);

  await runInstall(selections, args, osInfo);

  const results = await verify();

  summary(results, logger.logFile);
}



