/* eslint-disable camelcase */
import {
  createMemo,
  createResource,
  For,
  JSX,
  Resource,
  Show,
} from 'solid-js';

const ORIGIN_GROUP_DATA_KEY = 'data-by-group.json';
const ORIGIN_COMPONENTS_KEY = 'data-emoji-components.json';
const ORIGIN_EMOJI_KEY = 'data-by-emoji.json';
const CDN_URL = 'https://unpkg.com/unicode-emoji-json/';

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
export type EmojiGroupData = Record<string, Emoji[]>;
export type EmojiComponents = Record<string, string>;

let EMOJI_DATA: EmojiData | undefined;
let EMOJI_COMPONENTS: EmojiComponents | undefined;
let EMOJI_GROUP_DATA: EmojiGroupData | undefined;

export async function loadEmojiData(): Promise<EmojiData> {
  if (!EMOJI_DATA) {
    const response = await fetch(EMOJI_KEY);
    EMOJI_DATA = await response.json() as EmojiData;
  }
  return EMOJI_DATA;
}

export async function loadEmojiGroupData(): Promise<EmojiGroupData> {
  if (!EMOJI_GROUP_DATA) {
    const response = await fetch(GROUP_DATA_KEY);
    EMOJI_GROUP_DATA = await response.json() as EmojiGroupData;
  }
  return EMOJI_GROUP_DATA;
}

export async function loadEmojiComponents(): Promise<EmojiComponents> {
  if (!EMOJI_COMPONENTS) {
    const response = await fetch(COMPONENTS_KEY);
    EMOJI_COMPONENTS = await response.json() as EmojiComponents;
  }
  return EMOJI_COMPONENTS;
}

export function setEmojiData(data: EmojiData): void {
  EMOJI_DATA = data;
}

export function setEmojiComponents(data: EmojiComponents): void {
  EMOJI_COMPONENTS = data;
}

export function useEmojiData(): Resource<EmojiData | undefined> {
  const [data] = createResource<EmojiData>(loadEmojiData);
  return data;
}

export function useEmojiComponents(): Resource<EmojiComponents | undefined> {
  const [data] = createResource<EmojiComponents>(loadEmojiComponents);
  return data;
}

export function useEmojiGroupData(): Resource<EmojiGroupData | undefined> {
  const [data] = createResource<EmojiGroupData>(loadEmojiGroupData);
  return data;
}

export type EmojiSkinTone =
  | 'light'
  | 'medium-light'
  | 'medium'
  | 'medium-dark'
  | 'dark';

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

export function getEmojiWithSkinTone(
  emojis: EmojiData,
  emoji: Emoji,
  skinTone?: string,
): string {
  if (!skinTone || !emoji.skin_tone_support) {
    return emoji.emoji;
  }
  const emojiWithSkinTone = emoji.emoji.split(ZWJ)
    .map((chunk) => {
      if (chunk in emojis && emojis[chunk].skin_tone_support) {
        return `${chunk}${skinTone}`;
      }
      return chunk;
    })
    .join(ZWJ);

  const emojiWithoutVariation = emojiWithSkinTone.replaceAll(`${VARIATION}${skinTone}`, `${skinTone}`);

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
      {getEmojiWithSkinTone(
        emojis,
        emoji,
        convertSkinToneToComponent(components, skinTone),
      )}
    </span>
  );
}

export type EmojiEventHandler<T extends Event> = (emoji: Emoji, event: T & {
  currentTarget: HTMLButtonElement;
  target: Element;
}) => void;

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

  const renderEmoji = createMemo(() => props.renderEmoji || DEFAULT_EMOJI_RENDER);

  return (
    <div class="emoji-picker">
      {() => {
        const emoji = emojiData();
        const components = componentData();
        const emojiGroup = emojiGroupData();

        if (emoji && components && emojiGroup) {
          return (
            <For each={Object.keys(emojiGroup)}>
                {(group) => (
                  <div class="emoji-section">
                    <span class="emoji-section-title">{group}</span>
                    <div class="emoji-items">
                      <For each={emojiGroup[group]}>
                        {(emojiItem) => (
                          <Show when={props.filter ? props.filter(emojiItem) : true}>
                            <button
                              type="button"
                              class="emoji-button"
                              onClick={props.onEmojiClick && [props.onEmojiClick, emojiItem]}
                              onFocus={props.onEmojiFocus && [props.onEmojiFocus, emojiItem]}
                              onMouseOver={props.onEmojiHover && [props.onEmojiHover, emojiItem]}
                              title={emojiItem.name}
                            >
                              {renderEmoji()(emoji, emojiItem, components, props.skinTone)}
                            </button>
                          </Show>
                        )}
                      </For>
                    </div>
                  </div>
                )}
              </For>
          );
        }

        return null;
      }}
    </div>
  );
}
