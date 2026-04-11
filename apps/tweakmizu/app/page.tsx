import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { CTA } from '@/components/home/cta';
import { FAQ } from '@/components/home/faq';
import { Features } from '@/components/home/features';
import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-it-works';

export default function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100dvh', flexDirection: 'column' }}>
      <SiteHeader />
      <main style={{ flex: 1 }}>
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}
