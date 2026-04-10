import type { MDXComponents } from 'mdx/types';
import { CopyButton } from './app/components/code-block';

function extractCodeString(children: React.ReactNode): string {
  if (!children || typeof children !== 'object') return '';
  const el = children as unknown as { props?: { children?: unknown } };
  if (el.props && typeof el.props.children === 'string') return el.props.children;
  return '';
}

function Pre({ children, ...props }: React.ComponentPropsWithoutRef<'pre'>) {
  const code = extractCodeString(children);

  return (
    <div className="code-block-wrapper">
      <pre {...props}>{children}</pre>
      {code && <CopyButton text={code} />}
    </div>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: Pre,
  };
}
