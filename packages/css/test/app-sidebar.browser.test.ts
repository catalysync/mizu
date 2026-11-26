import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const styles = () => [
  css('packages/tokens/dist/css/variables.css'),
  css('packages/css/dist/mizu.css'),
];

const sidebar = (collapsed: boolean) => `
  <div class="mizu-app-layout"${collapsed ? ' data-sidebar-collapsed="true"' : ''}>
    <aside class="mizu-app-sidebar">
      <div class="mizu-app-sidebar__section">
        <div class="mizu-app-sidebar__section-label">Workspace</div>
        <a class="mizu-app-sidebar__item" href="#home">
          <span class="mizu-app-sidebar__item-icon">i</span>
          <span class="mizu-app-sidebar__item-label">Home</span>
        </a>
      </div>
    </aside>
    <main></main>
  </div>`;

describe.skipIf(!hasBrowser)('app sidebar in a browser', () => {
  it('keeps collapsed labels in the layout box as clipped, not display:none', async () => {
    const result = await withPage(styles(), sidebar(true), async (page) => ({
      display: await computed(page, '.mizu-app-sidebar__item-label', 'display'),
      clip: await computed(page, '.mizu-app-sidebar__item-label', 'clip-path'),
      width: await page.$eval(
        '.mizu-app-sidebar__item-label',
        (el) => el.getBoundingClientRect().width,
      ),
    }));
    expect(result.display).not.toBe('none');
    expect(result.clip).toContain('inset(50%)');
    expect(result.width).toBeLessThanOrEqual(1);
  });

  it('shows labels when the sidebar is expanded', async () => {
    const clip = await withPage(styles(), sidebar(false), (page) =>
      computed(page, '.mizu-app-sidebar__item-label', 'clip-path'),
    );
    expect(clip).toBe('none');
  });

  it('takes the sidebar background from --mizu-app-sidebar-bg when set', async () => {
    const bg = await withPage(
      styles(),
      `<div style="--mizu-app-sidebar-bg: rgb(7, 8, 9)">${sidebar(false)}</div>`,
      (page) => computed(page, '.mizu-app-sidebar', 'background-color'),
    );
    expect(bg).toBe('rgb(7, 8, 9)');
  });

  it('sizes the sidebar column from --mizu-app-sidebar-width', async () => {
    const columns = await withPage(
      styles(),
      `<div style="--mizu-app-sidebar-width: 20rem">${sidebar(false)}</div>`,
      (page) => computed(page, '.mizu-app-layout', 'grid-template-columns'),
    );
    expect(columns.startsWith('320px')).toBe(true);
  });
});
