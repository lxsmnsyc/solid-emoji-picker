import { describe, expect, it } from 'vitest';
import { loadEmojiComponents, loadEmojiData, loadEmojiGroupData, setCDN } from '../src/index';
import { stubEmojiFetch } from './fetch';

const requested = stubEmojiFetch();

describe('setCDN', () => {
  it('sets the base path of all three files', async () => {
    setCDN('https://cdn.example/emoji/');

    await loadEmojiData();
    await loadEmojiComponents();
    await loadEmojiGroupData();

    expect(requested).toEqual([
      'https://cdn.example/emoji/data-by-emoji.json',
      'https://cdn.example/emoji/data-emoji-components.json',
      'https://cdn.example/emoji/data-by-group.json',
    ]);
  });
});
