import { describe, it, expect, vi } from 'vitest';

// Mock logger so verify doesn't pollute test output
vi.mock('../src/logger.js', () => ({
  logger: {
    step:    vi.fn(),
    success: vi.fn(),
    warn:    vi.fn(),
    logFile: '/tmp/test.log',
  },
}));

// Mock execSync to simulate installed / missing tools
vi.mock('child_process', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    execSync: vi.fn((cmd) => {
      if (cmd.includes('node'))   return Buffer.from('v20.12.0');
      if (cmd.includes('npm'))    return Buffer.from('10.5.0');
      if (cmd.includes('python')) return Buffer.from('Python 3.12.3');
      if (cmd.includes('git'))    return Buffer.from('git version 2.43.0');
      if (cmd.includes('docker')) return Buffer.from('Docker version 26.1.1');
      throw new Error('command not found');
    }),
  };
});

import { verify } from '../src/verify.js';

describe('verify', () => {
  it('returns an array of results', async () => {
    const results = await verify();
    expect(Array.isArray(results)).toBe(true);
  });

  it('returns an object with name, version, and ok for each tool', async () => {
    const results = await verify();
    for (const r of results) {
      expect(r).toHaveProperty('name');
      expect(r).toHaveProperty('ok');
      expect(typeof r.name).toBe('string');
      expect(typeof r.ok).toBe('boolean');
    }
  });

  it('marks tools as ok when execSync returns output', async () => {
    const results = await verify();
    const node = results.find(r => r.name === 'Node.js');
    expect(node).toBeDefined();
    expect(node.ok).toBe(true);
    expect(node.version).toBe('v20.12.0');
  });

  it('marks tools as not ok when execSync throws', async () => {
    // Re-mock to simulate all tools missing
    const { execSync } = await import('child_process');
    execSync.mockImplementation(() => { throw new Error('not found'); });

    const { verify: verifyFresh } = await import('../src/verify.js?t=' + Date.now());
    const results = await verifyFresh();
    for (const r of results) {
      expect(r.ok).toBe(false);
      expect(r.version).toBeNull();
    }
  });
});
