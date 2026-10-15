/**
 * Maps a story file path to the npm package consumers should import from.
 * Returns null if the file lives under a package that doesn't publish this
 * component (internal utilities, shell-only code, etc.).
 *
 * Mizu ships each package as its own barrel (@mizunagara/react, @mizunagara/charts,
 * @mizunagara/finance, @mizunagara/commerce) — no subpath entries. So the package
 * map is simply: packages/{name}/src/** → @mizunagara/{name}.
 */

// packages/{slug}/... → '@mizunagara/{scope}'
const PACKAGE_MAP: Array<{ prefix: string; pkg: string }> = [
  { prefix: 'packages/react/', pkg: '@mizunagara/react' },
  { prefix: 'packages/charts/', pkg: '@mizunagara/charts' },
  { prefix: 'packages/finance/', pkg: '@mizunagara/finance' },
  { prefix: 'packages/commerce/', pkg: '@mizunagara/commerce' },
  { prefix: 'packages/tokens/', pkg: '@mizunagara/tokens' },
  { prefix: 'packages/query-builder/', pkg: '@mizunagara/query-builder' },
  { prefix: 'packages/advanced-query-builder/', pkg: '@mizunagara/advanced-query-builder' },
];

export function resolveImportPath(fileName: string | undefined): string | null {
  if (!fileName) return null;
  const normalized = fileName.replace(/^\.\//, '').replace(/^.*\/mizu\//, '');
  for (const { prefix, pkg } of PACKAGE_MAP) {
    if (normalized.startsWith(prefix)) return pkg;
  }
  return null;
}

/**
 * Extracts the component export name from a story path + title.
 * Tries: parent dir name, title's last segment. Returns whichever is first
 * available — no validation against actual exports (unlike F0's approach,
 * which requires importing every barrel; we keep it cheap).
 */
export function extractComponentName(
  fileName: string | undefined,
  title: string | undefined,
): string | null {
  const candidates: string[] = [];

  if (fileName) {
    // Match "packages/X/src/components/ComponentName/..." style
    const componentDir = fileName.match(/\/(?:components|shell|layouts)\/([^/]+)\//);
    if (componentDir) candidates.push(componentDir[1]);
    // Match "stories/ComponentName.stories.tsx" style
    const storyFile = fileName.match(/\/([^/]+)\.stories\.[tj]sx$/);
    if (storyFile) candidates.push(storyFile[1]);
  }

  if (title) {
    const last = title.split('/').pop();
    if (last) candidates.push(last);
  }

  return candidates[0] ?? null;
}
