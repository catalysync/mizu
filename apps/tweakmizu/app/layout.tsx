import { TooltipProvider } from '@aspect/react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'tweakmizu — visual theme editor for mizu design system',
  description:
    'Customize mizu design system themes with an interactive editor. Modify colors, typography, radius, shadows, and more — preview changes and export CSS in real time.',
  keywords: 'theme editor, mizu, design system, CSS variables, visual editor, design tokens',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&family=Space+Grotesk:wght@300..700&family=Fira+Code:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
