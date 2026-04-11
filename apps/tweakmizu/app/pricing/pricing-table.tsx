'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Inline,
  Stack,
} from '@aspect/react';
import { Check, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { openCheckout } from '@/lib/checkout';

type Cadence = 'monthly' | 'annual';

interface Feature {
  label: string;
  free: boolean;
  pro: boolean;
}

const FEATURES: Feature[] = [
  { label: 'Theme editor with 3+ tabs', free: true, pro: true },
  { label: '3 industries (Cloud, SaaS, E-commerce)', free: true, pro: true },
  { label: '7 free-tier patterns', free: true, pro: true },
  { label: 'React + HTML/CSS export', free: true, pro: true },
  { label: 'Zip download', free: true, pro: true },
  { label: 'Save up to 3 projects', free: true, pro: false },
  { label: 'Unlimited projects', free: false, pro: true },
  { label: 'Full pattern catalog (60+ patterns)', free: false, pro: true },
  { label: 'AI edit-by-prompt (Cmd+K)', free: false, pro: true },
  { label: 'Svelte, Vue, Alpine export', free: false, pro: true },
  { label: 'Layout primitives editor', free: false, pro: true },
  { label: 'Density modes', free: false, pro: true },
  { label: 'Push to GitHub', free: false, pro: true },
  { label: '100 generations / hour', free: false, pro: true },
];

export function PricingTable() {
  const [cadence, setCadence] = useState<Cadence>('monthly');

  const proCheckoutLink =
    cadence === 'monthly'
      ? process.env.NEXT_PUBLIC_POLAR_PRO_MONTHLY_LINK
      : process.env.NEXT_PUBLIC_POLAR_PRO_ANNUAL_LINK;
  const lifetimeCheckoutLink = process.env.NEXT_PUBLIC_POLAR_LIFETIME_LINK;

  const handleProUpgrade = async () => {
    if (!proCheckoutLink) {
      window.alert(
        'Checkout link not yet configured. Set NEXT_PUBLIC_POLAR_PRO_MONTHLY_LINK in Vercel.',
      );
      return;
    }
    await openCheckout(proCheckoutLink);
  };

  const handleLifetimeUpgrade = async () => {
    if (!lifetimeCheckoutLink) {
      window.alert(
        'Lifetime checkout not yet configured. Set NEXT_PUBLIC_POLAR_LIFETIME_LINK in Vercel.',
      );
      return;
    }
    await openCheckout(lifetimeCheckoutLink);
  };

  return (
    <Stack gap="2rem">
      <Inline
        gap="0.5rem"
        align="center"
        role="group"
        aria-label="Billing cadence"
        style={{ justifyContent: 'center' }}
      >
        <Button
          variant={cadence === 'monthly' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setCadence('monthly')}
        >
          Monthly
        </Button>
        <Button
          variant={cadence === 'annual' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setCadence('annual')}
        >
          Annual <Badge tone="success">Save 20%</Badge>
        </Button>
      </Inline>

      <Grid gap="1.5rem" min="18rem">
        <Card>
          <CardHeader title="Free" description="Everything you need to ship a real product." />
          <CardBody>
            <Stack gap="1rem">
              <div>
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground"> / forever</span>
              </div>
              <FeatureList features={FEATURES} pick="free" />
            </Stack>
          </CardBody>
          <CardFooter>
            <Link href="/studio/new">
              <Button variant="secondary">Start free</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader
            title={
              <Inline gap="0.5rem" align="center">
                <span>Pro</span>
                <Badge tone="info">Recommended</Badge>
              </Inline>
            }
            description="The full studio, unlocked."
          />
          <CardBody>
            <Stack gap="1rem">
              <div>
                <span className="text-4xl font-bold text-foreground">
                  ${cadence === 'monthly' ? '15' : '12'}
                </span>
                <span className="text-muted-foreground">
                  {' '}
                  / month{cadence === 'annual' ? ' (billed $144/year)' : ''}
                </span>
              </div>
              <FeatureList features={FEATURES} pick="pro" />
            </Stack>
          </CardBody>
          <CardFooter>
            <Button variant="primary" onClick={handleProUpgrade}>
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader
            title={
              <Inline gap="0.5rem" align="center">
                <span>Lifetime</span>
                <Badge tone="warning">Launch deal</Badge>
              </Inline>
            }
            description="Pro, forever, one-time payment."
          />
          <CardBody>
            <Stack gap="1rem">
              <div>
                <span className="text-4xl font-bold text-foreground">$149</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Limited to 500 licenses at launch. Every Pro feature, every future Pro feature,
                never billed again.
              </p>
              <FeatureList features={FEATURES} pick="pro" />
            </Stack>
          </CardBody>
          <CardFooter>
            <Button variant="primary" onClick={handleLifetimeUpgrade}>
              Buy lifetime
            </Button>
          </CardFooter>
        </Card>
      </Grid>

      <Stack gap="0.5rem" className="text-center">
        <p className="text-sm text-muted-foreground">
          Need enterprise pricing? Email{' '}
          <a href="mailto:sureife@gmail.com" className="underline">
            sureife@gmail.com
          </a>
          .
        </p>
      </Stack>
    </Stack>
  );
}

function FeatureList({ features, pick }: { features: Feature[]; pick: 'free' | 'pro' }) {
  return (
    <Stack as="ul" gap="0.375rem" className="list-none p-0">
      {features.map((feature) => {
        const included = pick === 'free' ? feature.free : feature.pro;
        return (
          <li key={feature.label} className="flex items-center gap-2 text-sm">
            {included ? (
              <Check className="h-4 w-4 text-success" aria-label="Included" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground/60" aria-label="Not included" />
            )}
            <span className={included ? 'text-foreground' : 'text-muted-foreground line-through'}>
              {feature.label}
            </span>
          </li>
        );
      })}
    </Stack>
  );
}
