# solid-emoji-picker

> Unstyled Emoji Picker component for SolidJS

[![NPM](https://img.shields.io/npm/v/solid-emoji-picker.svg)](https://www.npmjs.com/package/solid-emoji-picker) [![JavaScript Style Guide](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/github/LXSMNSYC/solid-emoji-picker/tree/main/examples/demo)

## Install

```bash
npm i solid-emoji-picker
```

```bash
yarn add solid-emoji-picker
```

```bash
pnpm add solid-emoji-picker
```

## Usage

### Simplest example

```jsx
import { EmojiPicker } from 'solid-emoji-picker';

function App() {
  function pickEmoji(emoji) {
    console.log('You clicked', emoji.name);
  }

  return (
    <EmojiPicker onEmojiClick={pickEmoji} />
  );
}
```

### Emoji Data

The emoji data is based on [`unicode-emoji-json`](https://github.com/muan/unicode-emoji-json).

### Events

All event properties receives the emoji item data and the accompanying event value.

- `onEmojiClick` - `"click"` event
- `onEmojiFocus` - `"focus"` event
- `onEmojiHover` - `"mouseover"` event

### Styling

The emoji picker has the following structure:

```html
<div class="emoji-picker">
  <div class="emoji-section">
    <span class="emoji-section-title"></span>
    <div class="emoji-items">
      <button class="emoji-button">
        <!-- user-defined -->
      </button>
    </div>
  </div>
</div>
```

You can refer to these classes for styling the parts of the emoji picker.

### Skin Tones

You can define your selected skin tone with the `skinTone` property for `EmojiPicker`. The `skinTone` property has the following possible values: `"light"`, `"medium-light"`, `"medium"`, `"medium-dark"` and `"dark"`. By default, it is `undefined`.

```jsx
<EmojiPicker skinTone="medium" />
```

Take note that some emojis might not correctly apply the skin tone, this depends on the emoji support.

### Filtering

`filter` allows conditionally rendering each emoji item. `filter` receives the emoji item data which shall then return a boolean. This is useful for emulating emoji search.

```jsx
<EmojiPicker filter={(emoji) => emoji.name.includes('hand')} />
```

### Custom rendering

`renderEmoji` allows emoji to be rendered in a user-defined way. `renderEmoji` receives the emoji item data, the components (used for skin tone reference) and the currently selected skin tone, in which `renderEmoji` must return a `JSX.Element`.

Here's an example with [`twemoji`](https://github.com/twitter/twemoji):

```jsx
import twemoji from 'twemoji';

function renderTwemoji(
  emoji,
  components,
  tone,
) {
  const skinTone = tone && emoji.skin_tone_support
    ? convertSkinToneToComponent(components, tone)
    : '';
  return <span innerHTML={twemoji.parse(`${emoji.emoji}${skinTone}`)} />;
}

<EmojiPicker renderEmoji={renderTwemoji} />
```

If `renderEmoji` is unspecified, it renders the following:

```jsx
<span class="emoji">{emojiCodeWithSkinTone}</span>
```

### Custom CDN

By default, `solid-emoji-picker` loads the emoji data from `unicode-emoji-json`'s UNPKG. You can use the following to modify the data handling:

- `setCDN` - sets the base CDN path, defaults to `"https://unpkg.com/unicode-emoji-json/"`
- `setDataURL` - specify the full path of the group data JSON. If not set, it defaults to selected CDN path + `"data-by-group.json"`.
- `setComponentsURL` - specify the full path of the component JSON. If not set, it defaults to selected CDN path + `"data-emoji-components.json"`.
- `loadEmojiData` - Fetch the emoji data.
- `loadEmojiComponents` - Fetch the components data.
- `setEmojiData` - Set the emoji data.
- `setEmojiComponents` - Set the components data.

### Suspense

`<EmojiPicker>` uses `createResource` for data fetching. Wrapping it in `<Suspense>` is recommended.

To directly access these resource primitives, you can use `useEmojiData` and `useEmojiComponents`, both returns the data resource.

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
