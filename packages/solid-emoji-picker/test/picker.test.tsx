import type { JSX } from '@solidjs/web';
import { render } from '@solidjs/web';
import { Loading, createRoot, createSignal, flush } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import type { Emoji, EmojiEventHandler, EmojiPickerProps, EmojiSkinTone } from '../src/index';
import { EmojiPicker, useEmojiComponents, useEmojiData, useEmojiGroupData } from '../src/index';
import { COMPONENTS, DOG, EMOJIS, GRIN, POINT_UP, WAVE } from './fixtures';
import { stubEmojiFetch } from './fetch';
import { renderInHost } from './utils';

stubEmojiFetch();

function renderPicker(code: () => JSX.Element): HTMLElement {
  return renderInHost(() => <Loading fallback="loading">{code()}</Loading>);
}

async function waitForButtons(host: HTMLElement): Promise<void> {
  await vi.waitFor(() => {
    expect(host.querySelector('.emoji-button')).not.toBeNull();
  });
}

function getButton(host: HTMLElement, name: string): HTMLButtonElement {
  const button = host.querySelector<HTMLButtonElement>(`[title="${name}"]`);
  if (!button) {
    throw new Error(`No button titled ${name}`);
  }
  return button;
}

function getTitles(host: HTMLElement): string[] {
  const titles: string[] = [];
  for (const button of host.querySelectorAll('.emoji-button')) {
    titles.push(button.getAttribute('title') ?? '');
  }
  return titles;
}

describe('EmojiPicker', () => {
  // The module caches the data once loaded, so this has to stay the first
  // test that renders a picker.
  it('shows the Loading fallback until the data arrives', async () => {
    const host = renderPicker(() => <EmojiPicker />);
    expect(host.textContent).toBe('loading');

    await waitForButtons(host);
    expect(host.textContent).not.toContain('loading');
  });

  it('renders without a Loading boundary around it', async () => {
    const host = renderInHost(() => <EmojiPicker />);
    await waitForButtons(host);

    expect(host.querySelectorAll('.emoji-button')).toHaveLength(4);
  });

  it('renders one section per group with its title and buttons', async () => {
    const host = renderPicker(() => <EmojiPicker />);
    await waitForButtons(host);

    const sections = host.querySelectorAll('.emoji-picker > .emoji-section');
    expect(sections).toHaveLength(3);
    const headings: string[] = [];
    for (const title of host.querySelectorAll('.emoji-section-title')) {
      headings.push(title.textContent);
    }
    expect(headings).toEqual(['Smileys & Emotion', 'People & Body', 'Animals & Nature']);
    expect(getTitles(host)).toEqual([GRIN.name, WAVE.name, POINT_UP.name, DOG.name]);
  });

  it('renders each emoji in a span with the emoji class', async () => {
    const host = renderPicker(() => <EmojiPicker />);
    await waitForButtons(host);

    expect(getButton(host, DOG.name).querySelector('span.emoji')?.textContent).toBe(DOG.emoji);
  });

  it('applies the skin tone and tracks it', async () => {
    const [tone, setTone] = createSignal<EmojiSkinTone | undefined>('dark');
    const host = renderPicker(() => <EmojiPicker skinTone={tone()} />);
    await waitForButtons(host);

    const wave = getButton(host, WAVE.name);
    expect(wave.textContent).toBe(`${WAVE.emoji}${COMPONENTS.dark_skin_tone}`);
    // An emoji without skin tone support is left alone.
    expect(getButton(host, DOG.name).textContent).toBe(DOG.emoji);

    setTone('light');
    flush();
    expect(wave.textContent).toBe(`${WAVE.emoji}${COMPONENTS.light_skin_tone}`);

    setTone(undefined);
    flush();
    expect(wave.textContent).toBe(WAVE.emoji);
  });

  it('renders only the emoji the filter accepts', async () => {
    const host = renderPicker(() => (
      <EmojiPicker filter={(emoji): boolean => emoji.name.includes('hand')} />
    ));
    await waitForButtons(host);

    expect(getTitles(host)).toEqual([WAVE.name]);
  });

  it('re-runs the filter when a signal it reads changes', async () => {
    const [search, setSearch] = createSignal('');
    const host = renderPicker(() => (
      <EmojiPicker filter={(emoji): boolean => emoji.name.includes(search())} />
    ));
    await waitForButtons(host);
    expect(getTitles(host)).toHaveLength(4);

    setSearch('face');
    flush();
    expect(getTitles(host)).toEqual([GRIN.name, DOG.name]);

    setSearch('nothing matches');
    flush();
    expect(getTitles(host)).toEqual([]);

    setSearch('');
    flush();
    expect(getTitles(host)).toHaveLength(4);
  });

  it('calls onEmojiClick with the emoji and the event', async () => {
    // The event resets its currentTarget after dispatch, so read it inside.
    const seen: (EventTarget | null)[] = [];
    const onEmojiClick = vi.fn((_emoji: Emoji, event: MouseEvent): void => {
      seen.push(event.currentTarget);
    });
    const host = renderPicker(() => <EmojiPicker onEmojiClick={onEmojiClick} />);
    await waitForButtons(host);

    const button = getButton(host, DOG.name);
    button.click();

    expect(onEmojiClick).toHaveBeenCalledTimes(1);
    const [emoji, event] = onEmojiClick.mock.calls[0];
    expect(emoji).toEqual(DOG);
    expect(event.type).toBe('click');
    expect(seen).toEqual([button]);
  });

  it('calls onEmojiFocus when a button is focused', async () => {
    const onEmojiFocus = vi.fn<EmojiEventHandler<FocusEvent>>();
    const host = renderPicker(() => <EmojiPicker onEmojiFocus={onEmojiFocus} />);
    await waitForButtons(host);

    getButton(host, WAVE.name).dispatchEvent(new FocusEvent('focus'));

    expect(onEmojiFocus).toHaveBeenCalledTimes(1);
    expect(onEmojiFocus.mock.calls[0][0]).toEqual(WAVE);
    expect(onEmojiFocus.mock.calls[0][1].type).toBe('focus');
  });

  it('calls onEmojiHover on mouseover', async () => {
    const onEmojiHover = vi.fn<EmojiEventHandler<MouseEvent>>();
    const host = renderPicker(() => <EmojiPicker onEmojiHover={onEmojiHover} />);
    await waitForButtons(host);

    getButton(host, GRIN.name).dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

    expect(onEmojiHover).toHaveBeenCalledTimes(1);
    expect(onEmojiHover.mock.calls[0][0]).toEqual(GRIN);
    expect(onEmojiHover.mock.calls[0][1].type).toBe('mouseover');
  });

  it('uses the latest handler when the prop changes', async () => {
    const first = vi.fn<EmojiEventHandler<MouseEvent>>();
    const second = vi.fn<EmojiEventHandler<MouseEvent>>();
    const [current, setCurrent] = createSignal({ handler: first });
    const host = renderPicker(() => <EmojiPicker onEmojiClick={current().handler} />);
    await waitForButtons(host);

    setCurrent({ handler: second });
    flush();
    getButton(host, DOG.name).click();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('does not throw when a click has no handler', async () => {
    const host = renderPicker(() => <EmojiPicker />);
    await waitForButtons(host);

    expect(() => {
      getButton(host, DOG.name).click();
    }).not.toThrow();
  });

  it('renders with renderEmoji and passes it the data', async () => {
    const renderEmoji = vi.fn<NonNullable<EmojiPickerProps['renderEmoji']>>(
      (_emojis, emoji, _components, skinTone) => (
        <i class="custom">{`${emoji.slug}:${skinTone}`}</i>
      ),
    );
    const host = renderPicker(() => <EmojiPicker skinTone="medium" renderEmoji={renderEmoji} />);
    await waitForButtons(host);

    expect(host.querySelector('span.emoji')).toBeNull();
    expect(getButton(host, DOG.name).querySelector('i.custom')?.textContent).toBe(
      'dog_face:medium',
    );
    const [emojis, , components] = renderEmoji.mock.calls[0];
    expect(emojis).toEqual(EMOJIS);
    expect(components).toEqual(COMPONENTS);
  });

  it('removes its listeners and nodes on dispose', async () => {
    const onEmojiClick = vi.fn<EmojiEventHandler<MouseEvent>>();
    const host = document.createElement('div');
    document.body.append(host);
    const dispose = render(
      () => (
        <Loading>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </Loading>
      ),
      host,
    );
    await waitForButtons(host);
    const button = getButton(host, DOG.name);

    dispose();
    button.click();

    expect(host.innerHTML).toBe('');
    expect(onEmojiClick).not.toHaveBeenCalled();
    host.remove();
  });
});

describe('data hooks', () => {
  it('resolve the emoji data, the components and the groups', async () => {
    const reads = createRoot(() => ({
      emojis: useEmojiData(),
      components: useEmojiComponents(),
      groups: useEmojiGroupData(),
    }));
    const host = renderPicker(() => (
      <>
        <output id="emojis">{Object.keys(reads.emojis()).length}</output>
        <output id="components">{Object.keys(reads.components()).length}</output>
        <output id="groups">{reads.groups().length}</output>
      </>
    ));

    await vi.waitFor(() => {
      expect(host.querySelector('#groups')?.textContent).toBe('3');
    });
    expect(host.querySelector('#emojis')?.textContent).toBe(String(Object.keys(EMOJIS).length));
    expect(host.querySelector('#components')?.textContent).toBe('5');
  });
});
