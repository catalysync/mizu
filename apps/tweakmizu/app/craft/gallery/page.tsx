import { getPublicProfiles } from '@/actions/craft-profiles';
import type { Metadata } from 'next';
import { GalleryGrid } from './gallery-grid';

export const metadata: Metadata = {
  title: 'Gallery — tweakmizu craft',
  description: 'Browse and fork community design language profiles.',
};

export default async function GalleryPage() {
  const profiles = await getPublicProfiles();

  return (
    <div className="craft-gallery">
      <header className="craft-gallery__header">
        <h1 className="craft-gallery__title">Community gallery</h1>
        <p className="craft-gallery__lede">
          Browse design language profiles published by the community. Fork any profile to start
          editing, or publish your own.
        </p>
      </header>
      <GalleryGrid profiles={profiles} />
    </div>
  );
}
