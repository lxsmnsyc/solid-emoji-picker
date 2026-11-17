import { describe, expect, it } from 'vitest';
import { convertSkinToneToComponent, getEmojiWithSkinTone } from '../src/index';
import { COMPONENTS, DOG, EMOJIS, FARMER, POINT_UP, WAVE } from './fixtures';

describe('convertSkinToneToComponent', () => {
  it('returns undefined without a skin tone', () => {
    expect(convertSkinToneToComponent(COMPONENTS)).toBeUndefined();
  });

  it('maps each skin tone to its component', () => {
    expect(convertSkinToneToComponent(COMPONENTS, 'light')).toBe(COMPONENTS.light_skin_tone);
    expect(convertSkinToneToComponent(COMPONENTS, 'medium-light')).toBe(
      COMPONENTS.medium_light_skin_tone,
    );
    expect(convertSkinToneToComponent(COMPONENTS, 'medium')).toBe(COMPONENTS.medium_skin_tone);
    expect(convertSkinToneToComponent(COMPONENTS, 'medium-dark')).toBe(
      COMPONENTS.medium_dark_skin_tone,
    );
    expect(convertSkinToneToComponent(COMPONENTS, 'dark')).toBe(COMPONENTS.dark_skin_tone);
  });
});

describe('getEmojiWithSkinTone', () => {
  const tone = COMPONENTS.dark_skin_tone;

  it('returns the emoji unchanged without a skin tone', () => {
    expect(getEmojiWithSkinTone(EMOJIS, WAVE)).toBe(WAVE.emoji);
  });

  it('returns the emoji unchanged when it has no skin tone support', () => {
    expect(getEmojiWithSkinTone(EMOJIS, DOG, tone)).toBe(DOG.emoji);
  });

  it('appends the skin tone to a supporting emoji', () => {
    expect(getEmojiWithSkinTone(EMOJIS, WAVE, tone)).toBe(`${WAVE.emoji}${tone}`);
  });

  it('drops the variation selector before the skin tone', () => {
    expect(getEmojiWithSkinTone(EMOJIS, POINT_UP, tone)).toBe(`☝${tone}`);
  });

  it('applies the skin tone to the person in a joined sequence only', () => {
    expect(getEmojiWithSkinTone(EMOJIS, FARMER, tone)).toBe(`\u{1F9D1}${tone}‍\u{1F33E}`);
  });
});
