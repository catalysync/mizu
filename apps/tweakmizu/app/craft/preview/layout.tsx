import './preview-layout.css';

// The preview layout deliberately does NOT share the craft shell chrome.
// It renders as an isolated, token-only surface so it can be embedded in an
// iframe (inside the craft app) or opened standalone (shareable preview).
// The craft layout's auth gate applies at /craft/*, so preview inherits it.
export default function CraftPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="craft-preview-root" data-mizu-preview>
      {children}
    </div>
  );
}
