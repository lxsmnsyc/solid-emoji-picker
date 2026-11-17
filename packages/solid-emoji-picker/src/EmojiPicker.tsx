import type { JSX } from '@solidjs/web';
import type { Accessor } from 'solid-js';
import { For, Show, createMemo } from 'solid-js';

const ORIGIN_GROUP_DATA_KEY = 'data-by-group.json';
const ORIGIN_COMPONENTS_KEY = 'data-emoji-components.json';
const ORIGIN_EMOJI_KEY = 'data-by-emoji.json';
const CDN_URL = 'https://unpkg.com/unicode-emoji-json@0.6.0/';

let GROUP_DATA_KEY = `${CDN_URL}${ORIGIN_GROUP_DATA_KEY}`;
let COMPONENTS_KEY = `${CDN_URL}${ORIGIN_COMPONENTS_KEY}`;
let EMOJI_KEY = `${CDN_URL}${ORIGIN_EMOJI_KEY}`;

export function setCDN(url: string): void {
  GROUP_DATA_KEY = `${url}${ORIGIN_GROUP_DATA_KEY}`;
  COMPONENTS_KEY = `${url}${ORIGIN_COMPONENTS_KEY}`;
  EMOJI_KEY = `${url}${ORIGIN_EMOJI_KEY}`;
}

export function setComponentsURL(url: string): void {
  COMPONENTS_KEY = url;
}

export function setEmojiURL(url: string): void {
  EMOJI_KEY = url;
}

export function setEmojiGroupURL(url: string): void {
  GROUP_DATA_KEY = url;
}

export interface Emoji {
  emoji: string;
  skin_tone_support: boolean;
  name: string;
  slug: string;
  unicode_version: string;
  emoji_version: string;
}

export type EmojiData = Record<string, Emoji>;

export interface EmojiGroupData {
  name: string;
  slug: string;
  emojis: Emoji[];
}

export type EmojiComponents = Record<string, string>;

let EMOJI_DATA: EmojiData | undefined;
let EMOJI_COMPONENTS: EmojiComponents | undefined;
let EMOJI_GROUP_DATA: EmojiGroupData[] | undefined;

// The body is trusted to match `T`, as it came from the configured data URL.
async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return (await response.json()) as T;
}

export async function loadEmojiData(): Promise<EmojiData> {
  EMOJI_DATA ??= await fetchJSON<EmojiData>(EMOJI_KEY);
  return EMOJI_DATA;
}

export async function loadEmojiGroupData(): Promise<EmojiGroupData[]> {
  EMOJI_GROUP_DATA ??= await fetchJSON<EmojiGroupData[]>(GROUP_DATA_KEY);
  return EMOJI_GROUP_DATA;
}

export async function loadEmojiComponents(): Promise<EmojiComponents> {
  EMOJI_COMPONENTS ??= await fetchJSON<EmojiComponents>(COMPONENTS_KEY);
  return EMOJI_COMPONENTS;
}

export function setEmojiData(data: EmojiData): void {
  EMOJI_DATA = data;
}

export function setEmojiComponents(data: EmojiComponents): void {
  EMOJI_COMPONENTS = data;
}

// The accessors below read as pending until the data arrives, so a read
// suspends the nearest `<Loading>` boundary instead of returning `undefined`.
export function useEmojiData(): Accessor<EmojiData> {
  return createMemo(async () => loadEmojiData());
}

export function useEmojiComponents(): Accessor<EmojiComponents> {
  return createMemo(async () => loadEmojiComponents());
}

export function useEmojiGroupData(): Accessor<EmojiGroupData[]> {
  return createMemo(async () => loadEmojiGroupData());
}

export type EmojiSkinTone = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';

const SKIN_TONE_TO_COMPONENT: Record<EmojiSkinTone, string> = {
  light: 'light_skin_tone',
  'medium-light': 'medium_light_skin_tone',
  medium: 'medium_skin_tone',
  'medium-dark': 'medium_dark_skin_tone',
  dark: 'dark_skin_tone',
};

export function convertSkinToneToComponent(
  components: EmojiComponents,
  skinTone?: EmojiSkinTone,
): string | undefined {
  if (skinTone) {
    return components[SKIN_TONE_TO_COMPONENT[skinTone]];
  }
  return undefined;
}

const VARIATION = '\uFE0F';
const ZWJ = '\u200D';

export function getEmojiWithSkinTone(emojis: EmojiData, emoji: Emoji, skinTone?: string): string {
  if (!(skinTone && emoji.skin_tone_support)) {
    return emoji.emoji;
  }
  const emojiWithSkinTone = emoji.emoji
    .split(ZWJ)
    .map((chunk) => {
      if (chunk in emojis && emojis[chunk].skin_tone_support) {
        return `${chunk}${skinTone}`;
      }
      return chunk;
    })
    .join(ZWJ);

  const emojiWithoutVariation = emojiWithSkinTone.replaceAll(`${VARIATION}${skinTone}`, skinTone);

  return emojiWithoutVariation;
}

function DEFAULT_EMOJI_RENDER(
  emojis: EmojiData,
  emoji: Emoji,
  components: EmojiComponents,
  skinTone?: EmojiSkinTone,
): JSX.Element {
  return (
    <span class="emoji">
      {getEmojiWithSkinTone(emojis, emoji, convertSkinToneToComponent(components, skinTone))}
    </span>
  );
}

export type EmojiEventHandler<T extends Event> = (
  emoji: Emoji,
  event: T & {
    currentTarget: HTMLButtonElement;
    target: Element;
  },
) => void;

export interface EmojiPickerProps {
  skinTone?: EmojiSkinTone;
  filter?: (emoji: Emoji) => boolean;
  renderEmoji?: (
    emojis: EmojiData,
    emoji: Emoji,
    components: EmojiComponents,
    skinTone?: EmojiSkinTone,
  ) => JSX.Element;
  onEmojiClick?: EmojiEventHandler<MouseEvent>;
  onEmojiFocus?: EmojiEventHandler<FocusEvent>;
  onEmojiHover?: EmojiEventHandler<MouseEvent>;
}

export function EmojiPicker(props: EmojiPickerProps): JSX.Element {
  const emojiData = useEmojiData();
  const componentData = useEmojiComponents();
  const emojiGroupData = useEmojiGroupData();

  const renderEmoji = createMemo(() => props.renderEmoji ?? DEFAULT_EMOJI_RENDER);

  return (
    <div class="emoji-picker">
      <For each={emojiGroupData()}>
        {(group): JSX.Element => (
          <div class="emoji-section">
            <span class="emoji-section-title">{group.name}</span>
            <div class="emoji-items">
              <For each={group.emojis}>
                {(emojiItem): JSX.Element => (
                  <Show when={props.filter ? props.filter(emojiItem) : true}>
                    <button
                      type="button"
                      class="emoji-button"
                      onClick={(event): void => {
                        props.onEmojiClick?.(emojiItem, event);
                      }}
                      onFocus={(event): void => {
                        props.onEmojiFocus?.(emojiItem, event);
                      }}
                      onMouseOver={(event): void => {
                        props.onEmojiHover?.(emojiItem, event);
                      }}
                      title={emojiItem.name}
                    >
                      {renderEmoji()(emojiData(), emojiItem, componentData(), props.skinTone)}
                    </button>
                  </Show>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
