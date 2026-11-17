# solid-emoji-picker

> Unstyled Emoji Picker component for SolidJS

[![NPM](https://img.shields.io/npm/v/solid-emoji-picker.svg)](https://www.npmjs.com/package/solid-emoji-picker) [![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/github/LXSMNSYC/solid-emoji-picker/tree/main/examples/demo)

## Install

This version supports Solid 2.0. Solid 1 users stay on `solid-emoji-picker@0.3`, which is kept on the [`solid-1` branch](https://github.com/lxsmnsyc/solid-emoji-picker/tree/solid-1).

```bash
npm i solid-emoji-picker
```

```bash
yarn add solid-emoji-picker
```

```bash
pnpm add solid-emoji-picker
```

It requires `solid-js` and `@solidjs/web` 2.0 and Node.js 22 or later. The package ships its components as `.jsx`, so your app's Solid compiler builds them. With `@solidjs/vite-plugin` this works without extra setup.

## Usage

### Simplest example

```jsx
import { Loading } from 'solid-js';
import { EmojiPicker } from 'solid-emoji-picker';

function App() {
  function pickEmoji(emoji) {
    console.log('You clicked', emoji.name);
  }

  return (
    <Loading fallback="Loading emojis.">
      <EmojiPicker onEmojiClick={pickEmoji} />
    </Loading>
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

`renderEmoji` allows emoji to be rendered in a user-defined way. `renderEmoji` receives all emoji data, the emoji item, the components (used for skin tone reference) and the currently selected skin tone, in which `renderEmoji` must return a `JSX.Element`.

Here's an example with [`twemoji`](https://github.com/twitter/twemoji):

```jsx
import twemoji from 'twemoji';
import { convertSkinToneToComponent, getEmojiWithSkinTone } from 'solid-emoji-picker';

function getTwemoji(emojis, emoji, components, tone) {
  const skinTone = convertSkinToneToComponent(components, tone);
  const tonedEmoji = getEmojiWithSkinTone(emojis, emoji, skinTone);
  return twemoji.parse(tonedEmoji);
}

function renderTwemoji(emojis, emoji, components, tone) {
  return <span innerHTML={getTwemoji(emojis, emoji, components, tone)} />;
}

<EmojiPicker renderEmoji={renderTwemoji} />;
```

If `renderEmoji` is unspecified, it renders the following:

```jsx
<span class="emoji">{emojiCodeWithSkinTone}</span>
```

> [!WARNING]
> As of April 2024, twemoji no longer works as their CDN is no longer maintained.

### Custom CDN

By default, `solid-emoji-picker` loads the emoji data from `unicode-emoji-json`'s UNPKG. You can use the following to modify the data handling:

- `setCDN` - sets the base CDN path, defaults to `"https://unpkg.com/unicode-emoji-json/"`
- `setEmojiURL` - specify the full path of the emoji data JSON. If not set, it defaults to selected CDN path + `"data-by-emoji.json"`.
- `setEmojiGroupURL` - specify the full path of the group data JSON. If not set, it defaults to selected CDN path + `"data-by-group.json"`.
- `setComponentsURL` - specify the full path of the component JSON. If not set, it defaults to selected CDN path + `"data-emoji-components.json"`.
- `loadEmojiData` - Fetch the emoji data.
- `loadEmojiComponents` - Fetch the components data.
- `loadEmojiGroupData` - Fetch the emoji group data.
- `setEmojiData` - Set the emoji data.
- `setEmojiComponents` - Set the components data.

### Loading

The emoji data loads on first use. Until it arrives, `<EmojiPicker>` reads as pending, so the nearest `<Loading>` boundary shows its fallback. Without a boundary, the picker renders once the data is in.

`useEmojiData`, `useEmojiGroupData` and `useEmojiComponents` return an accessor for the data. Reading it before the data arrives suspends in the same way, so read it under a `<Loading>` boundary.

## Migrating from 0.3

- Requires Solid 2.0: install `@solidjs/web` next to `solid-js`.
- Wrap `<EmojiPicker>` in `<Loading>` where you wrapped it in `<Suspense>`.
- `useEmojiData`, `useEmojiGroupData` and `useEmojiComponents` return an `Accessor<T>` instead of a `Resource<T | undefined>`. The accessor never returns `undefined`. It suspends until the data arrives.
- The `JSX` type comes from `@solidjs/web`.
- The package is ESM only and ships `.jsx`, so a bundler without a Solid compiler cannot use it. The CommonJS build and the `development` export condition are removed.

## Sponsors

![Sponsors](https://github.com/lxsmnsyc/sponsors/blob/main/sponsors.svg?raw=true)

## License

MIT © [lxsmnsyc](https://github.com/lxsmnsyc)
