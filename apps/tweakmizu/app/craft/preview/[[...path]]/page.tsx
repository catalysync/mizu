import { PreviewApp } from '@/components/craft/preview/preview-app';

export default function CraftPreviewPage({ params }: { params: Promise<{ path?: string[] }> }) {
  return <PreviewApp paramsPromise={params} />;
}
