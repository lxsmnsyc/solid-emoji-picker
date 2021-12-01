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
const CDN_URL = 'https://unpkg.com/unicode-emoji-json/';

let GROUP_DATA_KEY = `${CDN_URL}${ORIGIN_GROUP_DATA_KEY}`;
let COMPONENTS_KEY = `${CDN_URL}${ORIGIN_COMPONENTS_KEY}`;

export function setCDN(url: string): void {
  GROUP_DATA_KEY = `${url}${ORIGIN_GROUP_DATA_KEY}`;
  COMPONENTS_KEY = `${url}${ORIGIN_COMPONENTS_KEY}`;
}

export function setDataURL(url: string): void {
  GROUP_DATA_KEY = url;
}

export function setComponentsURL(url: string): void {
  COMPONENTS_KEY = url;
}

export interface Emoji {
  emoji: string;
  skin_tone_support: boolean;
  name: string;
  slug: string;
  unicode_version: string;
  emoji_version: string;
}

export type EmojiData = Record<string, Emoji[]>;
export type EmojiComponents = Record<string, string>;

let EMOJI_DATA: EmojiData | undefined;
let EMOJI_COMPONENTS: EmojiComponents | undefined;

export async function loadEmojiData(): Promise<EmojiData> {
  if (!EMOJI_DATA) {
    const response = await fetch(GROUP_DATA_KEY);
    EMOJI_DATA = await response.json() as EmojiData;
  }
  return EMOJI_DATA;
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
  skinTone: EmojiSkinTone,
): string {
  return components[SKIN_TONE_TO_COMPONENT[skinTone]];
}

function DEFAULT_EMOJI_RENDER(
  emoji: Emoji,
  components: EmojiComponents,
  skinTone?: EmojiSkinTone,
): JSX.Element {
  if (emoji.skin_tone_support && skinTone) {
    return (
      <span class="emoji">
        {`${emoji.emoji}${convertSkinToneToComponent(components, skinTone)}`}
      </span>
    );
  }
  return <span class="emoji">{emoji.emoji}</span>;
}

export type EmojiEventHandler<T extends Event> = (emoji: Emoji, event: T & {
  currentTarget: HTMLButtonElement;
  target: Element;
}) => void;

export interface EmojiPickerProps {
  skinTone?: EmojiSkinTone;
  filter?: (emoji: Emoji) => boolean;
  renderEmoji?: (
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

  const renderEmoji = createMemo(() => props.renderEmoji ?? DEFAULT_EMOJI_RENDER);

  return (
    <div class="emoji-picker">
      <Show when={componentData()}>
        {(components) => (
          <Show when={emojiData()}>
            {(emoji) => (
              <For each={Object.keys(emoji)}>
                {(group) => (
                  <div class="emoji-section">
                    <span class="emoji-section-title">{group}</span>
                    <div class="emoji-items">
                      <For each={emoji[group]}>
                        {(emojiItem) => (
                          <Show when={props.filter?.(emojiItem) ?? true}>
                            <button
                              type="button"
                              class="emoji-button"
                              onClick={props.onEmojiClick && [props.onEmojiClick, emojiItem]}
                              onFocus={props.onEmojiFocus && [props.onEmojiFocus, emojiItem]}
                              onMouseOver={props.onEmojiHover && [props.onEmojiHover, emojiItem]}
                              title={emojiItem.name}
                            >
                              {renderEmoji()(emojiItem, components, props.skinTone)}
                            </button>
                          </Show>
                        )}
                      </For>
                    </div>
                  </div>
                )}
              </For>
            )}
          </Show>
        )}
      </Show>
    </div>
  );
}
