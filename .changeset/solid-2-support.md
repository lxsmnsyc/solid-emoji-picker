---
'solid-emoji-picker': major
---

- Supports Solid 2.0. The peer dependencies are now `solid-js@^2.0.0` and `@solidjs/web@^2.0.0`.
- Requires Node.js 22 or later.
- The package is ESM only and ships its components as `.jsx` for your app's Solid compiler. The CommonJS build and the `development` export condition are removed.
- `useEmojiData`, `useEmojiGroupData` and `useEmojiComponents` return an `Accessor` that suspends until the data arrives, instead of a `Resource` that starts as `undefined`. Use `<Loading>` in place of `<Suspense>`.
- `EmojiPicker` attaches its event handlers as plain functions, so `onEmojiClick`, `onEmojiFocus` and `onEmojiHover` always run the latest function you pass.
