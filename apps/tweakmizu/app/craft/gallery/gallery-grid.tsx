'use client';

import './gallery.css';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Badge, Button } from '@aspect/react';
import { useCraftStore } from '@/store/craft-store';
import { profileToCss } from '@/lib/craft/profile-to-css';
import { safeParseProfile, type DesignLanguageProfile } from '@/lib/craft/profile';

interface GalleryProfile {
  id: string;
  name: string;
  archetype: string | null;
  domain: string | null;
  likes: number;
  tags: string[] | null;
  profileJson: unknown;
  createdAt: Date;
}

export function GalleryGrid({ profiles }: { profiles: GalleryProfile[] }) {
  const router = useRouter();
  const importProfile = useCraftStore((s) => s.importProfile);

  const handleFork = (p: GalleryProfile) => {
    const result = importProfile(p.profileJson);
    if (result.ok) router.push('/craft/foundation');
  };

  if (profiles.length === 0) {
    return (
      <div className="craft-gallery__empty">
        <p>No community profiles yet. Be the first to publish yours!</p>
      </div>
    );
  }

  return (
    <div className="craft-gallery__grid">
      {profiles.map((p) => {
        const profile = safeParseProfile(p.profileJson);
        if (!profile) return null;
        const vars = profileToCss(profile);
        return (
          <article key={p.id} className="craft-gallery__card">
            <div className="craft-gallery__swatch" style={vars as React.CSSProperties}>
              <div className="craft-gallery__swatch-mock">
                <span className="craft-gallery__swatch-dot craft-gallery__swatch-dot--primary" />
                <span className="craft-gallery__swatch-dot craft-gallery__swatch-dot--success" />
                <span className="craft-gallery__swatch-dot craft-gallery__swatch-dot--surface" />
              </div>
            </div>
            <div className="craft-gallery__card-body">
              <h3 className="craft-gallery__card-title">{p.name}</h3>
              <div className="craft-gallery__card-meta">
                {p.domain ? <Badge tone="neutral">{p.domain}</Badge> : null}
                {p.archetype ? <Badge tone="info">{p.archetype}</Badge> : null}
                <span className="craft-gallery__card-likes">
                  <Heart size={12} /> {p.likes}
                </span>
              </div>
              {p.tags && p.tags.length > 0 ? (
                <div className="craft-gallery__card-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="craft-gallery__tag">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              <Button size="sm" variant="secondary" onClick={() => handleFork(p)}>
                Fork this profile
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
