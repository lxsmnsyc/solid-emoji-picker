import { describe, expect, it } from 'vitest';
import { loadEmojiComponents, loadEmojiData, setEmojiComponents, setEmojiData } from '../src/index';
import { stubEmojiFetch } from './fetch';
import { COMPONENTS, EMOJIS } from './fixtures';

const requested = stubEmojiFetch();

describe('setEmojiData and setEmojiComponents', () => {
  it('make the loaders skip the network', async () => {
    setEmojiData(EMOJIS);
    setEmojiComponents(COMPONENTS);

    expect(await loadEmojiData()).toBe(EMOJIS);
    expect(await loadEmojiComponents()).toBe(COMPONENTS);
    expect(requested).toEqual([]);
  });
});
