'use client';

import { useEditorStore } from '@/store/editor-store';
import { parseMizuCss } from '@/utils/parse-mizu-css';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Stack,
  Textarea,
} from '@aspect/react';
import { ClipboardPaste } from 'lucide-react';
import { useState } from 'react';

const placeholder = `:root {
  --mizu-action-primary-default: #2563eb;
  --mizu-radius-md: 0.375rem;
  --mizu-font-family-sans: 'Inter', system-ui, sans-serif;
  ...
}`;

export function ImportButton() {
  const setThemeState = useEditorStore((s) => s.setThemeState);
  const [open, setOpen] = useState(false);
  const [css, setCss] = useState('');
  const [status, setStatus] = useState<null | {
    tone: 'success' | 'danger';
    text: string;
  }>(null);

  const handleApply = () => {
    const { applied, unknownKeys } = parseMizuCss(css);
    const appliedCount = Object.keys(applied).length;

    if (appliedCount === 0) {
      setStatus({
        tone: 'danger',
        text: 'No recognized --mizu-* properties found. Paste a CSS block with mizu token declarations.',
      });
      return;
    }

    const prev = useEditorStore.getState().themeState;
    setThemeState({
      ...prev,
      preset: undefined,
      styles: { ...prev.styles, ...applied },
    });

    const unknownMsg =
      unknownKeys.length > 0
        ? ` (skipped ${unknownKeys.length} unknown ${unknownKeys.length === 1 ? 'key' : 'keys'})`
        : '';
    setStatus({
      tone: 'success',
      text: `Applied ${appliedCount} ${appliedCount === 1 ? 'token' : 'tokens'}${unknownMsg}.`,
    });

    setTimeout(() => setOpen(false), 600);
  };

  const reset = () => {
    setCss('');
    setStatus(null);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <ModalTrigger asChild>
        <Button variant="ghost" size="sm">
          <ClipboardPaste size={14} />
          <span style={{ marginLeft: '0.375rem' }}>Import</span>
        </Button>
      </ModalTrigger>
      <ModalContent style={{ maxWidth: '42rem' }}>
        <ModalHeader>
          <ModalTitle>Import theme from CSS</ModalTitle>
          <ModalDescription>
            Paste a block of --mizu-* custom properties. Unknown keys are ignored.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <Stack gap="0.75rem">
            <Textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              placeholder={placeholder}
              rows={12}
              style={{
                fontFamily: 'var(--mizu-font-family-mono)',
                fontSize: 12,
              }}
              aria-label="CSS to import"
            />
            {status && (
              <div
                role={status.tone === 'danger' ? 'alert' : 'status'}
                style={{
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--mizu-radius-md)',
                  fontSize: '0.8125rem',
                  background:
                    status.tone === 'success'
                      ? 'var(--mizu-feedback-success-subtle)'
                      : 'var(--mizu-feedback-danger-subtle)',
                  color:
                    status.tone === 'success'
                      ? 'var(--mizu-feedback-success-default)'
                      : 'var(--mizu-feedback-danger-default)',
                }}
              >
                {status.text}
              </div>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply} disabled={!css.trim()}>
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
