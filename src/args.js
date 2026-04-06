export function parseArgs() {
  const args = process.argv.slice(2);

  return {
    nonInteractive: args.includes("--non-interactive"),
    dryRun: args.includes("--dry-run"),
    quiet: args.includes("--quiet"),
    debug: args.includes("--debug"),
    version: args.includes("--version"),
  };
}