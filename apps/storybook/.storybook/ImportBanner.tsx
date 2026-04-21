import { DocsContext, Source } from '@storybook/addon-docs/blocks';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { extractComponentName, resolveImportPath } from './resolveImportPath';

/**
 * Finds an insertion point after the docs-page title and installs a
 * container element for the portal. The title is a plain <h1> inside
 * #storybook-docs, typically followed by a <p> subtitle.
 */
function usePortalTarget() {
  const [target, setTarget] = React.useState<HTMLElement | null>(null);
  const containerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const titleEl = document.querySelector('#storybook-docs h1:not(.docs-story *)');
    if (!titleEl) return;

    const sibling = titleEl.nextElementSibling;
    const afterEl =
      sibling?.tagName === 'P' || (sibling?.tagName === 'DIV' && sibling.querySelector('p'))
        ? sibling
        : titleEl;

    if (!containerRef.current) {
      containerRef.current = document.createElement('div');
    }
    afterEl.after(containerRef.current);
    setTarget(containerRef.current);

    return () => {
      containerRef.current?.remove();
    };
  }, []);

  return target;
}

/**
 * Renders an `import { X } from "@aspect/Y"` code block at the top of each
 * component's Docs page. Components that don't map to a published package
 * render nothing. Styles live in story-utils.css.
 */
export function ImportBanner() {
  const context = React.useContext(DocsContext);
  const portalTarget = usePortalTarget();

  let fileName: string | undefined;
  let title: string | undefined;

  try {
    const stories = context.componentStories();
    if (stories.length === 0) return null;
    const primary = stories[0];
    const storyContext = context.getStoryContext(primary);
    if (!storyContext.component) return null;
    fileName = storyContext.parameters?.fileName as string | undefined;
    title = primary.title;
  } catch {
    return null;
  }

  const pkg = resolveImportPath(fileName);
  const name = extractComponentName(fileName, title);
  if (!pkg || !name || !portalTarget) return null;

  const content = (
    <div className="story-import-banner">
      <span className="story-import-banner__label">Import</span>
      <Source code={`import { ${name} } from '${pkg}';`} language="tsx" />
    </div>
  );

  return createPortal(content, portalTarget);
}
