'use client';

import { CopyButton } from '@/components/copy-button';
import { TooltipWrapper } from '@/components/tooltip-wrapper';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditorStore } from '@/store/editor-store';
import { generateThemeCode } from '@/utils/theme-style-generator';
import { Braces } from 'lucide-react';
import { useMemo, useState } from 'react';

export function CodeButton() {
  const [open, setOpen] = useState(false);
  const themeState = useEditorStore((s) => s.themeState);

  const [scope, setScope] = useState<'root' | 'identity'>('root');

  const code = useMemo(() => generateThemeCode(themeState, 'hex', scope), [themeState, scope]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipWrapper label="View theme code" asChild>
          <Button variant="ghost" size="sm">
            <Braces className="size-3.5" />
            <span className="hidden text-sm md:block">Code</span>
          </Button>
        </TooltipWrapper>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generated CSS</DialogTitle>
          <DialogDescription>Copy this CSS into your project to apply the theme.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Button
            variant={scope === 'root' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setScope('root')}
          >
            :root
          </Button>
          {themeState.preset && (
            <Button
              variant={scope === 'identity' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScope('identity')}
            >
              [data-mizu-identity]
            </Button>
          )}
        </div>

        <div className="relative">
          <div className="absolute top-2 right-2 z-10">
            <CopyButton value={code} />
          </div>
          <ScrollArea className="bg-muted h-[400px] rounded-md border">
            <pre className="p-4 text-sm">
              <code>{code}</code>
            </pre>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
