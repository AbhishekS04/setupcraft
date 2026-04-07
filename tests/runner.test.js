import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock execa and ora for the new stealth execution structure
vi.mock('execa', () => {
  return {
    execa: vi.fn(),
  };
});

vi.mock('ora', () => {
  const mockOra = {
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn(),
    fail: vi.fn(),
  };
  return {
    default: vi.fn(() => mockOra),
  };
});

import { execa } from 'execa';
import { runScript } from '../src/runner.js';

describe('runScript', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves immediately in dry-run mode without executing', async () => {
    await runScript('/fake/path/script.sh', [], true);
    expect(execa).not.toHaveBeenCalled();
  });

  it('executes bash for .sh scripts on non-windows', async () => {
    execa.mockResolvedValue({ stdout: '', stderr: '', all: '' });

    const scriptPath = path.join(__dirname, '../scripts/tools/git.sh');
    await runScript(scriptPath, [], false);

    expect(execa).toHaveBeenCalledWith(
      'bash',
      [scriptPath],
      expect.objectContaining({ all: true })
    );
  });

  it('rejects if script throws an error', async () => {
    execa.mockRejectedValue(Object.assign(new Error('Failed'), { exitCode: 1, all: 'Error logged' }));

    // Suppress console.error in tests to keep the output clean
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(runScript('/fake/fail.sh', [], false)).rejects.toThrow(
      'Script failed with exit code 1'
    );
    
    consoleSpy.mockRestore();
  });

  it('passes extra args to bash', async () => {
     execa.mockResolvedValue({ stdout: '', stderr: '', all: '' });

    await runScript('/fake/nodejs.sh', ['asdf'], false);

    expect(execa).toHaveBeenCalledWith(
      'bash',
      ['/fake/nodejs.sh', 'asdf'],
      expect.objectContaining({ all: true })
    );
  });
});
