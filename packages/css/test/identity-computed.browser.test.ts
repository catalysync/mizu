import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { chromiumPath, css, hasBrowser } from './browser';
import { repo } from './helpers';

// Identity themes may only set tokens (lint rule mizu/identity-tokens-only). Moving a component
// selector into a token must not change any rendered style, so this test records the computed
// style of every probe under every identity that used to restyle a component, plus a control
// with no identity, and compares it to a golden file captured before the move.
//
// Regenerate the golden only when a visual change is intended:
//   MIZU_UPDATE_IDENTITY_GOLDEN=1 pnpm --filter @mizunagara/css test identity-computed

const GOLDEN = join(repo, 'packages/css/test/fixtures/identity-computed-style.golden.json');
const UPDATE = process.env.MIZU_UPDATE_IDENTITY_GOLDEN === '1';

const IDENTITIES = [
  'atlas',
  'clinical',
  'editorial',
  'industrial',
  'layered',
  'monochrome',
  'neon',
  'playful',
  'precise',
  'refined',
  'sage',
];
const CONTROL = 'none';

// Longhands only: getComputedStyle expands the shorthands, so these cover every identity edit.
const PROPS = [
  'background-color',
  'background-image',
  'background-size',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-top-style',
  'border-right-style',
  'border-bottom-style',
  'border-left-style',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-collapse',
  'box-shadow',
  'color',
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'height',
  'letter-spacing',
  'line-height',
  'min-height',
  'opacity',
  'outline-style',
  'outline-width',
  'outline-color',
  'outline-offset',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'text-decoration-line',
  'text-decoration-style',
  'text-decoration-color',
  'text-decoration-thickness',
  'text-underline-offset',
  'text-transform',
  'vertical-align',
  'width',
  'white-space',
];

type Probe = {
  key: string;
  html: string;
  // Element inside the probe to read, relative to the probe wrapper.
  selector: string;
  // rest | hover | focus: how the element is put into the state before it is read.
  state: 'rest' | 'hover' | 'focus';
};

const PROBES: Probe[] = [
  {
    key: 'btn-primary',
    selector: 'button',
    state: 'rest',
    html: '<button class="mizu-button mizu-button--primary">x</button>',
  },
  {
    key: 'btn-primary-hover',
    selector: 'button',
    state: 'hover',
    html: '<button class="mizu-button mizu-button--primary">x</button>',
  },
  {
    key: 'btn-primary-focus',
    selector: 'button',
    state: 'focus',
    html: '<button class="mizu-button mizu-button--primary">x</button>',
  },
  {
    key: 'btn-primary-disabled',
    selector: 'button',
    state: 'rest',
    html: '<button class="mizu-button mizu-button--primary" disabled>x</button>',
  },
  {
    key: 'btn-primary-loading',
    selector: 'button',
    state: 'rest',
    html: '<button class="mizu-button mizu-button--primary" data-loading="true">x</button>',
  },
  {
    key: 'btn-ghost',
    selector: 'button',
    state: 'rest',
    html: '<button class="mizu-button mizu-button--ghost">x</button>',
  },
  {
    key: 'btn-ghost-focus',
    selector: 'button',
    state: 'focus',
    html: '<button class="mizu-button mizu-button--ghost">x</button>',
  },
  {
    key: 'btn-secondary-focus',
    selector: 'button',
    state: 'focus',
    html: '<button class="mizu-button mizu-button--secondary">x</button>',
  },
  {
    key: 'btn-plain',
    selector: 'button',
    state: 'rest',
    html: '<button class="mizu-button">x</button>',
  },
  {
    key: 'btn-plain-focus',
    selector: 'button',
    state: 'focus',
    html: '<button class="mizu-button">x</button>',
  },
  {
    key: 'btn-sm',
    selector: 'button',
    state: 'rest',
    html: '<button class="mizu-button mizu-button--primary mizu-button--sm">x</button>',
  },
  {
    key: 'btn-lg',
    selector: 'button',
    state: 'rest',
    html: '<button class="mizu-button mizu-button--primary mizu-button--lg">x</button>',
  },
  {
    key: 'btn-icon',
    selector: 'button',
    state: 'rest',
    html: '<button class="mizu-button mizu-button--icon mizu-button--primary mizu-icon-button mizu-icon-button--md" aria-label="x">x</button>',
  },
  { key: 'card', selector: '.mizu-card', state: 'rest', html: '<div class="mizu-card">x</div>' },
  {
    key: 'card-hover',
    selector: '.mizu-card',
    state: 'hover',
    html: '<div class="mizu-card">x</div>',
  },
  {
    key: 'card-interactive-hover',
    selector: '.mizu-card',
    state: 'hover',
    html: '<div class="mizu-card mizu-card--interactive">x</div>',
  },
  {
    key: 'input',
    selector: 'input',
    state: 'rest',
    html: '<input class="mizu-input" aria-label="x">',
  },
  {
    key: 'input-hover',
    selector: 'input',
    state: 'hover',
    html: '<input class="mizu-input" aria-label="x">',
  },
  {
    key: 'input-focus',
    selector: 'input',
    state: 'focus',
    html: '<input class="mizu-input" aria-label="x">',
  },
  {
    key: 'textarea',
    selector: 'textarea',
    state: 'rest',
    html: '<textarea class="mizu-textarea" aria-label="x"></textarea>',
  },
  {
    key: 'textarea-focus',
    selector: 'textarea',
    state: 'focus',
    html: '<textarea class="mizu-textarea" aria-label="x"></textarea>',
  },
  {
    key: 'select-trigger',
    selector: 'button',
    state: 'rest',
    html: '<button class="mizu-select__trigger">x</button>',
  },
  {
    key: 'select-trigger-focus',
    selector: 'button',
    state: 'focus',
    html: '<button class="mizu-select__trigger">x</button>',
  },
  {
    key: 'table',
    selector: 'table',
    state: 'rest',
    html: '<table class="mizu-table"><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr><tr><td>2</td></tr></tbody></table>',
  },
  {
    key: 'table-thead',
    selector: 'thead',
    state: 'rest',
    html: '<table class="mizu-table"><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr><tr><td>2</td></tr></tbody></table>',
  },
  {
    key: 'table-th',
    selector: 'th',
    state: 'rest',
    html: '<table class="mizu-table"><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr><tr><td>2</td></tr></tbody></table>',
  },
  {
    key: 'table-td',
    selector: 'td',
    state: 'rest',
    html: '<table class="mizu-table"><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr><tr><td>2</td></tr></tbody></table>',
  },
  {
    key: 'table-tr-even',
    selector: 'tbody tr:nth-child(2)',
    state: 'rest',
    html: '<table class="mizu-table"><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr><tr><td>2</td></tr></tbody></table>',
  },
  {
    key: 'badge',
    selector: '.mizu-badge',
    state: 'rest',
    html: '<span class="mizu-badge">x</span>',
  },
  {
    key: 'badge-success',
    selector: '.mizu-badge',
    state: 'rest',
    html: '<span class="mizu-badge mizu-badge--success">x</span>',
  },
  {
    key: 'badge-danger',
    selector: '.mizu-badge',
    state: 'rest',
    html: '<span class="mizu-badge mizu-badge--danger">x</span>',
  },
  { key: 'alert', selector: '.mizu-alert', state: 'rest', html: '<div class="mizu-alert">x</div>' },
];

// Every probe sits in its own wrapper so states (hover, focus) cannot leak between probes.
function pageBody() {
  const roots = [CONTROL, ...IDENTITIES]
    .map((id) => {
      const attr = id === CONTROL ? '' : ` data-mizu-identity="${id}"`;
      const probes = PROBES.map(
        (p) => `<div class="probe" data-probe="${p.key}">${p.html}</div>`,
      ).join('');
      return `<section data-id="${id}"${attr}>${probes}</section>`;
    })
    .join('\n');
  return roots;
}

type Snapshot = Record<string, Record<string, Record<string, string>>>;

async function capture(): Promise<Snapshot> {
  const { chromium } = await import('playwright-core');
  const browser = await chromium.launch({ executablePath: chromiumPath, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    const head = [
      css('packages/tokens/dist/css/variables.css'),
      css('packages/css/dist/mizu.css'),
      ...IDENTITIES.map((id) => css(`packages/css/dist/themes/${id}.css`)),
      // Transitions and animations would sample mid-way; computed values must be the end state.
      '*, *::before, *::after { transition: none !important; animation: none !important; }',
    ]
      .map((s) => `<style>${s}</style>`)
      .join('\n');
    await page.setContent(
      `<!doctype html><html><head>${head}</head><body>${pageBody()}</body></html>`,
    );

    const out: Snapshot = {};
    for (const id of [CONTROL, ...IDENTITIES]) {
      out[id] = {};
      for (const probe of PROBES) {
        const wrapper = `[data-id="${id}"] [data-probe="${probe.key}"]`;
        const target = `${wrapper} ${probe.selector}`;
        // Reset pointer and focus before each probe so the previous state cannot carry over.
        await page.mouse.move(0, 0);
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        if (probe.state === 'hover') await page.hover(target);
        if (probe.state === 'focus') await page.focus(target);
        const values = await page.$eval(
          target,
          (el, props) => {
            const cs = getComputedStyle(el);
            return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)]));
          },
          PROPS,
        );
        out[id][probe.key] = values;
      }
    }
    return out;
  } finally {
    await browser.close();
  }
}

// The golden stores the control in full, and for each identity only the values that differ from
// the control. A reader can see exactly which computed style an identity changes.
function toGolden(snapshot: Snapshot) {
  const golden: Record<string, unknown> = { control: snapshot[CONTROL] };
  for (const id of IDENTITIES) {
    const diff: Record<string, Record<string, string>> = {};
    for (const probe of PROBES) {
      const a = snapshot[id][probe.key];
      const c = snapshot[CONTROL][probe.key];
      const changed = Object.fromEntries(PROPS.filter((p) => a[p] !== c[p]).map((p) => [p, a[p]]));
      if (Object.keys(changed).length) diff[probe.key] = changed;
    }
    golden[id] = diff;
  }
  return golden;
}

describe.skipIf(!hasBrowser)('identity themes leave computed styles unchanged', () => {
  it('matches the golden computed style for every identity and probe', async () => {
    const snapshot = await capture();
    const actual = toGolden(snapshot);

    if (UPDATE) {
      mkdirSync(dirname(GOLDEN), { recursive: true });
      writeFileSync(GOLDEN, `${JSON.stringify(actual, null, 2)}\n`);
      return;
    }
    const expected = JSON.parse(readFileSync(GOLDEN, 'utf8'));
    expect(actual).toEqual(expected);
  }, 120_000);
});
