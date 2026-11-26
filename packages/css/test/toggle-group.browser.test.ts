import { describe, expect, it } from 'vitest';
import { computed, css, hasBrowser, withPage } from './browser';

const styles = () => [
  css('packages/tokens/dist/css/variables.css'),
  css('packages/css/dist/mizu.css'),
];

const body = `
  <div id="wrap" style="position:absolute;left:40px;top:40px;padding:16px;background:rgb(255,255,255)">
    <div id="group" class="mizu-toggle-group" role="group">
      <button id="first" class="mizu-toggle-group__item" type="button" data-state="on">A</button>
      <button id="last" class="mizu-toggle-group__item" type="button">B</button>
    </div>
  </div>`;

describe.skipIf(!hasBrowser)('toggle group in a browser', () => {
  it('does not clip the focus ring of the last item at the group edge', async () => {
    const result = await withPage(styles(), body, async (page) => {
      await page.focus('#last');
      const focusVisible = await page.$eval('#last', (el) => el.matches(':focus-visible'));
      const rect = await page.$eval('#last', (el) => {
        const r = el.getBoundingClientRect();
        const g = document.getElementById('group')!.getBoundingClientRect();
        return { right: r.right, top: r.top, height: r.height, groupRight: g.right };
      });
      const overflow = await computed(page, '#group', 'overflow-x');

      // The focus ring is a 2px box-shadow that reaches one pixel past the group's right
      // edge, so the pixel column at that edge is only painted if the group does not clip.
      const x = Math.floor(rect.groupRight);
      const y = Math.floor(rect.top + rect.height / 2);
      const buf = await page.screenshot({ type: 'png', fullPage: false });
      const pixel = await page.evaluate(
        async ([b64, px, py]) => {
          const img = new Image();
          img.src = `data:image/png;base64,${b64}`;
          await img.decode();
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const [r, g, b] = ctx.getImageData(px, py, 1, 1).data;
          return { r, g, b };
        },
        [buf.toString('base64'), x, y] as const,
      );
      return { focusVisible, overflow, pixel };
    });

    expect(result.focusVisible).toBe(true);
    expect(result.overflow).toBe('visible');
    // Focus colour is --mizu-action-primary-default (blue); white would mean the ring was clipped.
    expect(result.pixel.b).toBeGreaterThan(result.pixel.r + 100);
  });

  it('gives the outer items the group corners so their backgrounds stay inside the radius', async () => {
    const radii = await withPage(styles(), body, async (page) => {
      const pick = (sel: string) =>
        page.$eval(sel, (el) => getComputedStyle(el).borderStartStartRadius);
      return {
        group: await page.$eval('#group', (el) => getComputedStyle(el).borderTopLeftRadius),
        first: await pick('#first'),
        last: await page.$eval('#last', (el) => getComputedStyle(el).borderStartEndRadius),
      };
    });
    expect(radii.group).not.toBe('0px');
    expect(radii.first).toBe(radii.group);
    expect(radii.last).toBe(radii.group);
  });
});
