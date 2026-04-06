import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock logger so preflight doesn't pollute test output
vi.mock('../src/logger.js', () => ({
  logger: {
    step:    vi.fn(),
    info:    vi.fn(),
    success: vi.fn(),
    warn:    vi.fn(),
    error:   vi.fn(),
    logFile: '/tmp/test.log',
  },
}));

// Mock net so we don't make real TCP connections in tests
vi.mock('net', () => ({
  default: {
    createConnection: vi.fn(() => {
      const handlers = {};
      // Simulate successful connection after 0ms
      setTimeout(() => handlers['connect']?.(), 0);
      return {
        on: (event, cb) => { handlers[event] = cb; return {}; },
        destroy: vi.fn(),
      };
    }),
  },
}));

// Mock child_process so we don't run real sudo/df commands
vi.mock('child_process', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    execSync: vi.fn((cmd) => {
      if (cmd.includes('df')) return Buffer.from('100G');
      if (cmd.includes('sudo')) return Buffer.from('');
      return Buffer.from('');
    }),
  };
});

import { preflight } from '../src/preflight.js';

describe('preflight', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('completes without throwing for a normal linux user', async () => {
    const fakeArgs = { nonInteractive: true, dryRun: false };
    const fakeOs   = { os: 'linux', distro: 'fedora', arch: 'x64' };
    await expect(preflight(fakeArgs, fakeOs)).resolves.toBeUndefined();
  });

  it('completes without throwing on macos', async () => {
    const fakeArgs = { nonInteractive: true, dryRun: false };
    const fakeOs   = { os: 'macos', distro: 'macos', arch: 'arm64' };
    await expect(preflight(fakeArgs, fakeOs)).resolves.toBeUndefined();
  });

  it('completes without throwing on windows (skips root and sudo checks)', async () => {
    const fakeArgs = { nonInteractive: true, dryRun: false };
    const fakeOs   = { os: 'windows', distro: 'windows', arch: 'x64' };
    await expect(preflight(fakeArgs, fakeOs)).resolves.toBeUndefined();
  });
});
