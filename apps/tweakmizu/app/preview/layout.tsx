import './preview-layout.css';

// Lives outside /craft/* so the auth gate doesn't block iframe embeds.
export default function CraftPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="craft-preview-root" data-mizu-preview>
      {children}
    </div>
  );
}
