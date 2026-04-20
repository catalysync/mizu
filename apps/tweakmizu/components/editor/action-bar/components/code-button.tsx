'use client';

import { useEditorStore } from '@/store/editor-store';
import { generateThemeCode } from '@/utils/theme-style-generator';
import {
  Button,
  Inline,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  ScrollArea,
  Stack,
} from '@aspect/react';
import { Braces, Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';

export function CodeButton() {
  const themeState = useEditorStore((s) => s.themeState);
  const [scope, setScope] = useState<'root' | 'identity'>('root');
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => generateThemeCode(themeState, 'hex', scope), [themeState, scope]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Modal>
      <ModalTrigger asChild>
        <Button variant="ghost" size="sm">
          <Braces size={14} />
          <span style={{ marginLeft: '0.375rem' }}>Code</span>
        </Button>
      </ModalTrigger>
      <ModalContent style={{ maxWidth: '42rem' }}>
        <ModalHeader>
          <ModalTitle>Generated CSS</ModalTitle>
          <ModalDescription>Paste this into your project to apply the theme.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <Stack gap="0.75rem">
            <Inline gap="0.5rem">
              <Button
                variant={scope === 'root' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setScope('root')}
              >
                :root
              </Button>
              {themeState.preset && themeState.preset !== 'default' && (
                <Button
                  variant={scope === 'identity' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setScope('identity')}
                >
                  [data-mizu-identity]
                </Button>
              )}
              <div style={{ flex: 1 }} />
              <Button variant="secondary" size="sm" onClick={copy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span style={{ marginLeft: '0.375rem' }}>{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            </Inline>
            <div
              style={{
                borderRadius: 'var(--mizu-radius-md)',
                border: '1px solid var(--mizu-border-default)',
                background: 'var(--mizu-surface-secondary)',
                overflow: 'hidden',
              }}
            >
              <ScrollArea style={{ height: 420 }}>
                <pre
                  style={{
                    padding: '1rem',
                    margin: 0,
                    fontFamily: 'var(--mizu-font-family-mono)',
                    fontSize: 12,
                    color: 'var(--mizu-text-primary)',
                  }}
                >
                  <code>{code}</code>
                </pre>
              </ScrollArea>
            </div>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
