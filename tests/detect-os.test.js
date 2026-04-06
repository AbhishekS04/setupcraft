import { describe, it, expect } from 'vitest';
import { detectOS } from '../src/detect-os.js';

describe('detectOS', () => {
  it('returns an object with os, distro, and arch keys', () => {
    const result = detectOS();
    expect(result).toHaveProperty('os');
    expect(result).toHaveProperty('distro');
    expect(result).toHaveProperty('arch');
  });

  it('returns a non-empty string for os', () => {
    const { os } = detectOS();
    expect(typeof os).toBe('string');
    expect(os.length).toBeGreaterThan(0);
  });

  it('returns a non-empty string for distro', () => {
    const { distro } = detectOS();
    expect(typeof distro).toBe('string');
    expect(distro.length).toBeGreaterThan(0);
  });

  it('returns a valid arch string', () => {
    const { arch } = detectOS();
    expect(['x64', 'arm64', 'ia32', 'arm', 'x32']).toContain(arch);
  });

  it('returns one of the known os values', () => {
    const { os } = detectOS();
    expect(['linux', 'macos', 'windows', 'unknown']).toContain(os);
  });

  it('returns a known distro for linux', () => {
    const result = detectOS();
    if (result.os === 'linux') {
      expect(['fedora', 'ubuntu', 'arch', 'opensuse', 'unknown']).toContain(result.distro);
    }
  });

  it('returns distro=macos on macOS', () => {
    const result = detectOS();
    if (result.os === 'macos') {
      expect(result.distro).toBe('macos');
    }
  });
});
