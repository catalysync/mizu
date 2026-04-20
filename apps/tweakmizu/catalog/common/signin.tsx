import type { OutputFile, RenderContext } from '@/lib/patterns/types';
import { definePattern } from '@/lib/patterns/types';
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Stack } from '@aspect/react';

function Preview() {
  return (
    <Card style={{ maxWidth: '24rem', margin: '0 auto' }}>
      <CardHeader
        title="Sign in"
        description="Welcome back. Use your email and password or continue with a provider."
      />
      <CardBody>
        <Stack gap="1rem">
          <Input label="Email" type="email" defaultValue="you@example.com" />
          <Input label="Password" type="password" defaultValue="••••••••" />
        </Stack>
      </CardBody>
      <CardFooter>
        <Stack gap="0.5rem" style={{ width: '100%' }}>
          <Button variant="primary" style={{ width: '100%' }}>
            Sign in
          </Button>
          <Button variant="ghost" style={{ width: '100%' }}>
            Continue with GitHub
          </Button>
        </Stack>
      </CardFooter>
    </Card>
  );
}

const TEMPLATE = `import { Button, Card, CardBody, CardFooter, CardHeader, Input, Stack } from '@aspect/react';

export default function SignInPage() {
  return (
    <main style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ maxWidth: '24rem', width: '100%' }}>
        <CardHeader title="Sign in" description="Welcome back. Use your email and password or continue with a provider." />
        <CardBody>
          <Stack gap="1rem">
            <Input label="Email" type="email" required />
            <Input label="Password" type="password" required />
          </Stack>
        </CardBody>
        <CardFooter>
          <Stack gap="0.5rem" style={{ width: '100%' }}>
            <Button variant="primary" style={{ width: '100%' }}>Sign in</Button>
            <Button variant="ghost" style={{ width: '100%' }}>Continue with GitHub</Button>
          </Stack>
        </CardFooter>
      </Card>
    </main>
  );
}
`;

export const commonSignin = definePattern({
  meta: {
    id: 'common.signin',
    name: 'Sign-in Page',
    description:
      'Centered sign-in card with email/password inputs, a primary submit, and an OAuth continue button.',
    kind: 'page',
    industries: ['cloud', 'saas-admin', 'ecommerce', 'fintech', 'ai-product', 'devtools', 'other'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Input',
      '@aspect/react#Button',
      '@aspect/react#Stack',
    ],
    sources: [
      {
        system: 'stripe',
        relationship: 'ia-borrowed',
        notes: 'Email + password + OAuth button layout mirrors Stripe dashboard sign-in.',
      },
      {
        system: 'linear',
        relationship: 'visual-rhythm',
        notes: 'Card-centered sign-in pattern from Linear.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/signin/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});
