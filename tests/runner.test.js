import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// We test runScript behavior by mocking child_process.spawn
vi.mock('child_process', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    spawn: vi.fn(),
  };
});

import { spawn } from 'child_process';
import { runScript } from '../src/runner.js';

describe('runScript', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves immediately in dry-run mode without spawning', async () => {
    await runScript('/fake/path/script.sh', [], true);
    expect(spawn).not.toHaveBeenCalled();
  });

  it('spawns bash for .sh scripts on non-windows', async () => {
    const mockChild = {
      on: vi.fn((event, cb) => {
        if (event === 'close') cb(0); // simulate exit code 0
      }),
    };
    spawn.mockReturnValue(mockChild);

    const scriptPath = path.join(__dirname, '../scripts/tools/git.sh');
    await runScript(scriptPath, [], false);

    expect(spawn).toHaveBeenCalledWith(
      'bash',
      [scriptPath],
      expect.objectContaining({ stdio: 'inherit' })
    );
  });

  it('rejects if script exits with non-zero code', async () => {
    const mockChild = {
      on: vi.fn((event, cb) => {
        if (event === 'close') cb(1); // simulate failure
      }),
    };
    spawn.mockReturnValue(mockChild);

    await expect(runScript('/fake/fail.sh', [], false)).rejects.toThrow(
      'Script failed with exit code 1'
    );
  });

  it('passes extra args to bash', async () => {
    const mockChild = {
      on: vi.fn((event, cb) => {
        if (event === 'close') cb(0);
      }),
    };
    spawn.mockReturnValue(mockChild);

    await runScript('/fake/nodejs.sh', ['asdf'], false);

    expect(spawn).toHaveBeenCalledWith(
      'bash',
      ['/fake/nodejs.sh', 'asdf'],
      expect.objectContaining({ stdio: 'inherit' })
    );
  });
});
