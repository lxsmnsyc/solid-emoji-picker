import type { EmojiComponents, EmojiData, EmojiGroupData } from '../src/index';

export const WAVE = {
  emoji: '👋',
  skin_tone_support: true,
  name: 'waving hand',
  slug: 'waving_hand',
  unicode_version: '0.6',
  emoji_version: '0.6',
};

export const GRIN = {
  emoji: '😀',
  skin_tone_support: false,
  name: 'grinning face',
  slug: 'grinning_face',
  unicode_version: '6.1',
  emoji_version: '1.0',
};

export const DOG = {
  emoji: '🐶',
  skin_tone_support: false,
  name: 'dog face',
  slug: 'dog_face',
  unicode_version: '6.0',
  emoji_version: '0.6',
};

// The pointing finger is stored with a variation selector.
export const POINT_UP = {
  emoji: '☝️',
  skin_tone_support: true,
  name: 'index pointing up',
  slug: 'index_pointing_up',
  unicode_version: '0.6',
  emoji_version: '0.6',
};

export const FARMER = {
  emoji: '\u{1F9D1}‍\u{1F33E}',
  skin_tone_support: true,
  name: 'farmer',
  slug: 'farmer',
  unicode_version: '12.0',
  emoji_version: '12.1',
};

export const PERSON = {
  emoji: '\u{1F9D1}',
  skin_tone_support: true,
  name: 'person',
  slug: 'person',
  unicode_version: '5.0',
  emoji_version: '5.0',
};

export const SHEAF = {
  emoji: '\u{1F33E}',
  skin_tone_support: false,
  name: 'sheaf of rice',
  slug: 'sheaf_of_rice',
  unicode_version: '6.0',
  emoji_version: '0.6',
};

export const EMOJIS: EmojiData = {
  [WAVE.emoji]: WAVE,
  [GRIN.emoji]: GRIN,
  [DOG.emoji]: DOG,
  [POINT_UP.emoji]: POINT_UP,
  [PERSON.emoji]: PERSON,
  [SHEAF.emoji]: SHEAF,
  [FARMER.emoji]: FARMER,
};

export const COMPONENTS: EmojiComponents = {
  light_skin_tone: '\u{1F3FB}',
  medium_light_skin_tone: '\u{1F3FC}',
  medium_skin_tone: '\u{1F3FD}',
  medium_dark_skin_tone: '\u{1F3FE}',
  dark_skin_tone: '\u{1F3FF}',
};

export const GROUPS: EmojiGroupData[] = [
  { name: 'Smileys & Emotion', slug: 'smileys_emotion', emojis: [GRIN] },
  { name: 'People & Body', slug: 'people_body', emojis: [WAVE, POINT_UP] },
  { name: 'Animals & Nature', slug: 'animals_nature', emojis: [DOG] },
];
