'use client';

import { useEditorStore } from '@/store/editor-store';
import { buildShareUrl } from '@/utils/share-url';
import { Button } from '@aspect/react';
import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';

export function ShareButton() {
  const themeState = useEditorStore((s) => s.themeState);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = buildShareUrl(themeState);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API not available (insecure context / old browser) — fall back
      // to selecting the URL in a prompt the user can copy from manually.
      window.prompt('Copy this share link:', url);
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleShare} aria-label="Share theme">
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      <span style={{ marginLeft: '0.375rem' }}>{copied ? 'Copied' : 'Share'}</span>
    </Button>
  );
}
