import { afterEach, beforeEach, vi } from 'vitest';
import { COMPONENTS, EMOJIS, GROUPS } from './fixtures';

function getBody(url: string): unknown {
  if (url.includes('components')) {
    return COMPONENTS;
  }
  if (url.includes('group')) {
    return GROUPS;
  }
  return EMOJIS;
}

/**
 * Replaces `fetch` with a stub that serves the fixture that matches the file name and
 * records every URL. The module caches what it loads, so each test file
 * covers one loading scenario.
 */
export function stubEmojiFetch(): string[] {
  const requested: string[] = [];

  beforeEach(() => {
    requested.length = 0;
    vi.stubGlobal('fetch', async (url: string): Promise<Response> => {
      requested.push(url);
      return Promise.resolve(Response.json(getBody(url)));
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  return requested;
}
