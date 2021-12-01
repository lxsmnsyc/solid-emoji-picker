import {
  EmojiPicker,
  EmojiSkinTone,
  Emoji,
  convertSkinToneToComponent,
  EmojiComponents,
} from 'solid-emoji-picker';
import { createSignal, JSX, Setter } from 'solid-js';
import twemoji from 'twemoji';

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface SkinTonePickerProps {
  emoji: string;
  description: string;
  value?: EmojiSkinTone;
  setValue: Setter<EmojiSkinTone | undefined>;
  selected: boolean;
}

const SKIN_TONE_PICKER = classNames(
  'w-10 h-10 p-2 text-2xl rounded-lg',
  'flex items-center justify-center',
  'bg-gray-50 bg-opacity-0 hover:bg-opacity-50 active:bg-opacity-25',
);

function SkinTonePicker(props: SkinTonePickerProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={[props.setValue, props.value]}
      class={classNames(SKIN_TONE_PICKER, props.selected && 'bg-opacity-25')}
    >
      <span class="sr-only">{props.description}</span>
      {props.emoji}
    </button>
  );
}

function renderTwemoji(
  emoji: Emoji,
  components: EmojiComponents,
  tone?: EmojiSkinTone,
): JSX.Element {
  const skinTone = tone && emoji.skin_tone_support
    ? convertSkinToneToComponent(components, tone)
    : '';
  return <span innerHTML={twemoji.parse(`${emoji.emoji}${skinTone}`)} />;
}

export default function App(): JSX.Element {
  const [skinTone, setSkinTone] = createSignal<EmojiSkinTone>();
  const [pickedEmoji, setPickedEmoji] = createSignal<Emoji>();
  const [useTwemoji, setUseTwemoji] = createSignal(true);

  const [search, setSearch] = createSignal('');

  return (
    <div class="min-h-screen bg-gradient-to-bl from-indigo-600 to-sky-400 flex flex-col space-y-4 items-center justify-center">
      <span class="text-4xl font-mono text-gray-50 font-bold">solid-emoji-picker</span>
      <div class="flex flex-col space-y-2 items-center justify-center">
        <input
          type="text"
          class="w-full text-xl p-2 rounded-lg"
          placeholder="Search an emoji."
          value={search()}
          onInput={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />
        <EmojiPicker
          skinTone={skinTone()}
          onEmojiClick={(emoji) => {
            setPickedEmoji(emoji);
          }}
          filter={(emoji) => (search() !== '' ? emoji.name.includes(search()) : true)}
          renderEmoji={useTwemoji() ? renderTwemoji : undefined}
        />
      </div>
      <span class="text-3xl text-gray-50 font-mono">
        {pickedEmoji()?.emoji ?? 'No emoji picked.'}
      </span>
      <div class="flex items-center justify-center">
        <SkinTonePicker
          emoji="👋"
          description="Neutral"
          selected={skinTone() == null}
          setValue={setSkinTone}
        />
        <SkinTonePicker
          emoji="👋🏻"
          description="Light Skin"
          selected={skinTone() === 'light'}
          value="light"
          setValue={setSkinTone}
        />
        <SkinTonePicker
          emoji="👋🏼"
          description="Medium Light Skin"
          selected={skinTone() === 'medium-light'}
          value="medium-light"
          setValue={setSkinTone}
        />
        <SkinTonePicker
          emoji="👋🏽"
          description="Medium Skin"
          selected={skinTone() === 'medium'}
          value="medium"
          setValue={setSkinTone}
        />
        <SkinTonePicker
          emoji="👋🏾"
          description="Medium Dark Skin"
          selected={skinTone() === 'medium-dark'}
          value="medium-dark"
          setValue={setSkinTone}
        />
        <SkinTonePicker
          emoji="👋🏿"
          description="Dark Skin"
          selected={skinTone() === 'dark'}
          value="dark"
          setValue={setSkinTone}
        />
      </div>
      <button type="button" class="text-gray-50" onClick={() => setUseTwemoji((c) => !c)}>
        {useTwemoji() ? 'Twemoji: ON' : 'Twemoji: OFF'}
      </button>
    </div>
  );
}
