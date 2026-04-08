import type { ReactNode } from 'react';
import '@aspect/tokens/css';
import '@aspect/css';
import './globals.css';

export const metadata = {
  title: 'mizu — design system',
  description: 'Documentation for the mizu design system',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
