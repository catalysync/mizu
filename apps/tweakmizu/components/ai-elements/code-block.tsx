import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  return (
    <pre className={cn('p-4 text-sm', className)}>
      <code>{code}</code>
    </pre>
  );
}
