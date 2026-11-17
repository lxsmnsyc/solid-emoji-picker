import { describe, expect, it } from 'vitest';
import {
  loadEmojiComponents,
  loadEmojiData,
  loadEmojiGroupData,
  setComponentsURL,
  setEmojiGroupURL,
  setEmojiURL,
} from '../src/index';
import { stubEmojiFetch } from './fetch';

const requested = stubEmojiFetch();

describe('single-file URL setters', () => {
  it('set the full URL of one file each', async () => {
    setEmojiURL('https://a.example/emoji.json');
    setComponentsURL('https://b.example/components.json');
    setEmojiGroupURL('https://c.example/groups.json');

    await loadEmojiData();
    await loadEmojiComponents();
    await loadEmojiGroupData();

    expect(requested).toEqual([
      'https://a.example/emoji.json',
      'https://b.example/components.json',
      'https://c.example/groups.json',
    ]);
  });
});
