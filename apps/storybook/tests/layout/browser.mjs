import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';

// playwright-core is installed by packages/css (its browser harness uses it too). Resolving it
// through that package means this app does not need its own dependency.
const require = createRequire(new URL('../../../../packages/css/package.json', import.meta.url));
const { chromium } = require('playwright-core');

const CHROMIUM_PATHS = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'];

/** Launch the system Chromium. MIZU_CHROMIUM overrides the path. Throws if none is found. */
export function launchBrowser() {
  const executablePath =
    process.env.MIZU_CHROMIUM ?? CHROMIUM_PATHS.find((candidate) => existsSync(candidate));
  if (!executablePath) {
    throw new Error('No Chromium found. Set MIZU_CHROMIUM or install /usr/bin/chromium.');
  }
  return chromium.launch({ executablePath, args: ['--no-sandbox'] });
}
