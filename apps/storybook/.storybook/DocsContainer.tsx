import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { DocsContainer as BaseContainer } from '@storybook/addon-docs/blocks';

/**
 * Wraps Storybook's docs container to surface a banner on docs pages whose
 * primary story is tagged `experimental` or `deprecated`. Pairs with the
 * `tagBadges` config in manager.ts — badges show in the sidebar, this shows
 * a full banner on the docs page itself. Banner styles live in story-utils.css.
 */
export const DocsContainer = ({ children, context, ...props }: DocsContainerProps) => {
  const tags = readPrimaryTags(context);
  const kind = tags.includes('deprecated')
    ? 'deprecated'
    : tags.includes('experimental')
      ? 'experimental'
      : null;

  return (
    <BaseContainer context={context} {...props}>
      {kind ? <Banner kind={kind} /> : null}
      {children}
    </BaseContainer>
  );
};

function readPrimaryTags(context: DocsContainerProps['context']): string[] {
  try {
    const primary = context.componentStories()[0];
    if (!primary) return [];
    const storyContext = context.getStoryContext(primary);
    return storyContext?.tags ?? [];
  } catch {
    return [];
  }
}

const COPY: Record<'experimental' | 'deprecated', { title: string; body: string }> = {
  experimental: {
    title: 'Experimental component',
    body: 'API may change without a major version bump. Not recommended for production.',
  },
  deprecated: {
    title: 'Deprecated component',
    body: 'Scheduled for removal in a future release. Check the changelog for the recommended replacement.',
  },
};

function Banner({ kind }: { kind: 'experimental' | 'deprecated' }) {
  const { title, body } = COPY[kind];
  return (
    <div role="note" className={`story-docs-banner story-docs-banner--${kind}`}>
      <strong className="story-docs-banner__title">{title}</strong>
      <span>{body}</span>
    </div>
  );
}
