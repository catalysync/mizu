import { describe, expect, it } from 'vitest';
import { css, hasBrowser, withPage } from './browser';

// Forced-colors mode drops box-shadow, so a ring drawn only with box-shadow vanishes.
// Outline survives, so each focusable control must draw its ring with outline.
const controls: Array<{ name: string; html: string }> = [
  { name: 'autocomplete input', html: '<input class="mizu-autocomplete__input" aria-label="x" />' },
  {
    name: 'combobox input (ring on control)',
    html: '<div class="mizu-combobox__control" id="{ring}"><input class="mizu-combobox__input" id="{id}" aria-label="x" /></div>',
  },
  {
    name: 'select item (highlighted)',
    html: '<div class="mizu-select__item" id="{id}" role="option" data-highlighted tabindex="0">x</div>',
  },
  {
    name: 'dropdown menu item (highlighted)',
    html: '<div class="mizu-dropdown-menu__item" id="{id}" role="menuitem" data-highlighted tabindex="0">x</div>',
  },
  {
    name: 'context menu item (highlighted)',
    html: '<div class="mizu-context-menu__item" id="{id}" role="menuitem" data-highlighted tabindex="0">x</div>',
  },
  {
    name: 'command menu input (ring on wrapper)',
    html: '<div class="mizu-command-menu__input-wrapper" id="{ring}"><input class="mizu-command-menu__input" id="{id}" aria-label="x" /></div>',
  },
  {
    name: 'command menu item (selected)',
    html: '<div class="mizu-command-menu__item" id="{id}" role="option" data-selected="true" tabindex="0">x</div>',
  },
  {
    name: 'combobox option (selected)',
    html: '<div class="mizu-combobox__option" id="{id}" role="option" data-selected="true" tabindex="0">x</div>',
  },
  {
    name: 'autocomplete option (selected)',
    html: '<div class="mizu-autocomplete__option" id="{id}" role="option" data-selected="true" tabindex="0">x</div>',
  },
  { name: 'button', html: '<button class="mizu-button">x</button>' },
  { name: 'input', html: '<input class="mizu-input" aria-label="x" />' },
  { name: 'input filled', html: '<input class="mizu-input mizu-input--filled" aria-label="x" />' },
  {
    name: 'input underline',
    html: '<input class="mizu-input mizu-input--underline" aria-label="x" />',
  },
  { name: 'textarea', html: '<textarea class="mizu-textarea" aria-label="x"></textarea>' },
  { name: 'select trigger', html: '<button class="mizu-select__trigger">x</button>' },
  {
    name: 'checkbox',
    html: '<button class="mizu-checkbox" role="checkbox" aria-checked="false">x</button>',
  },
  {
    name: 'radio item',
    html: '<button class="mizu-radio-item" role="radio" aria-checked="false">x</button>',
  },
  { name: 'link', html: '<a class="mizu-link" href="#x">x</a>' },
  { name: 'tabs trigger', html: '<button class="mizu-tabs__trigger">x</button>' },
  { name: 'toggle group item', html: '<button class="mizu-toggle-group__item">x</button>' },
  {
    name: 'segmented control item',
    html: '<button class="mizu-segmented-control__item">x</button>',
  },
  {
    name: 'slider thumb',
    html: '<span class="mizu-slider__thumb" role="slider" tabindex="0" aria-label="x"></span>',
  },
  { name: 'number input stepper', html: '<button class="mizu-number-input__stepper">x</button>' },
  { name: 'password input toggle', html: '<button class="mizu-password-input__toggle">x</button>' },
  {
    name: 'file input dropzone',
    html: '<div class="mizu-file-input__dropzone" tabindex="0">x</div>',
  },
  { name: 'file input remove', html: '<button class="mizu-file-input__remove">x</button>' },
  { name: 'tag dismiss', html: '<button class="mizu-tag__dismiss">x</button>' },
  { name: 'pagination page', html: '<button class="mizu-pagination__page">1</button>' },
  { name: 'date picker trigger', html: '<button class="mizu-date-picker__trigger">x</button>' },
  { name: 'calendar nav', html: '<button class="mizu-calendar__nav">x</button>' },
  { name: 'calendar day', html: '<button class="mizu-calendar__day">1</button>' },
  { name: 'date navigator preset', html: '<button class="mizu-date-navigator__preset">x</button>' },
  { name: 'date navigator arrow', html: '<button class="mizu-date-navigator__arrow">x</button>' },
  {
    name: 'data collection view button',
    html: '<button class="mizu-data-collection__view-button">x</button>',
  },
  { name: 'step flow step', html: '<button class="mizu-step-flow__step">x</button>' },
  { name: 'sheet close', html: '<button class="mizu-sheet__close">x</button>' },
  { name: 'dialog close', html: '<button class="mizu-dialog__close">x</button>' },
  {
    name: 'resizable handle',
    html: '<div class="mizu-resizable-handle" role="separator" tabindex="0"></div>',
  },
  {
    name: 'data table sortable header',
    html: '<table class="mizu-data-table"><thead><tr><th id="{id}" data-sortable="true" tabindex="0">x</th></tr></thead></table>',
  },
  {
    name: 'table clickable row',
    html: '<table class="mizu-table"><tbody><tr id="{id}" data-clickable="true" tabindex="0"><td>x</td></tr></tbody></table>',
  },
];

describe.skipIf(!hasBrowser)('focus rings under forced colors', () => {
  it('every focusable control draws a visible outline when focused', async () => {
    const body = controls
      .map((c, i) =>
        c.html.includes('{id}')
          ? c.html.replace('{id}', `f${i}`).replace('{ring}', `r${i}`)
          : c.html.replace(/^<(\w+)/, `<$1 id="f${i}"`),
      )
      .join('\n');

    const results = await withPage(
      [css('packages/tokens/dist/css/variables.css'), css('packages/css/dist/mizu.css')],
      body,
      async (page) => {
        await page.emulateMedia({ forcedColors: 'active' });
        return page.evaluate((count) => {
          const out: Array<{ i: number; focusVisible: boolean; style: string; width: string }> = [];
          for (let i = 0; i < count; i++) {
            const el = document.getElementById(`f${i}`) as HTMLElement;
            // Some controls ring their wrapper (focus-within), so measure that when present.
            const ring = document.getElementById(`r${i}`) ?? el;
            el.focus();
            out.push({
              i,
              focusVisible: el.matches(':focus-visible'),
              style: getComputedStyle(ring).outlineStyle,
              width: getComputedStyle(ring).outlineWidth,
            });
          }
          return out;
        }, controls.length);
      },
    );

    const failures = results
      .filter((r) => !r.focusVisible || r.style === 'none' || parseFloat(r.width) <= 0)
      .map(
        (r) =>
          `${controls[r.i].name}: focus-visible=${r.focusVisible} outline-style=${r.style} outline-width=${r.width}`,
      );
    expect(failures).toEqual([]);
  });
});
