import { describe, expect, it } from 'vitest';
import { loadEmojiComponents, loadEmojiData, loadEmojiGroupData } from '../src/index';
import { stubEmojiFetch } from './fetch';
import { COMPONENTS, EMOJIS, GROUPS } from './fixtures';

const requested = stubEmojiFetch();

describe('data loaders with the default CDN', () => {
  it('fetch from unicode-emoji-json on UNPKG', async () => {
    expect(await loadEmojiData()).toEqual(EMOJIS);
    expect(await loadEmojiComponents()).toEqual(COMPONENTS);
    expect(await loadEmojiGroupData()).toEqual(GROUPS);
    // A second round reads the cache and adds no request.
    await loadEmojiData();
    await loadEmojiComponents();
    await loadEmojiGroupData();
    expect(requested).toEqual([
      'https://unpkg.com/unicode-emoji-json@0.6.0/data-by-emoji.json',
      'https://unpkg.com/unicode-emoji-json@0.6.0/data-emoji-components.json',
      'https://unpkg.com/unicode-emoji-json@0.6.0/data-by-group.json',
    ]);
  });
});
