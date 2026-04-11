'use client';

import { PolarEmbedCheckout } from '@polar-sh/checkout/embed';

export async function openCheckout(link: string, theme: 'light' | 'dark' = 'light') {
  try {
    const checkout = await PolarEmbedCheckout.create(link, { theme });
    return checkout;
  } catch (error) {
    console.error('Failed to open checkout', error);
    return null;
  }
}
