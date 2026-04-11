import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Inline, Card, CardBody, Heading, Link, Badge } from '@aspect/react';
import './welcome.css';

function Welcome() {
  return (
    <Stack gap="2rem" className="mizu-welcome">
      <Stack gap="0.75rem">
        <Inline gap="0.75rem" align="center">
          <img src="/mizu-logo.svg" alt="mizu" height={40} />
          <Badge tone="neutral">v0.x · pre-1.0</Badge>
        </Inline>
        <Heading level={1} size="3xl">
          mizu — a base layer on top of Radix
        </Heading>
        <p className="mizu-welcome__lede">
          Tokens, CSS, React bindings, layout primitives, and shell composition for building web
          applications. Radix handles the hard primitives (focus trap, overlay positioning, ARIA
          wiring, keyboard semantics); mizu adds the visual substrate.
        </p>
      </Stack>

      <Card>
        <CardBody>
          <Stack gap="0.5rem">
            <Heading level={2} size="md">
              mizu does not have a design language
            </Heading>
            <p className="mizu-welcome__para">
              It ships with a neutral default theme as a starting point, but that theme is a{' '}
              <em>sample</em>, not the system&apos;s opinion. There is no &ldquo;mizu believes X
              about UI&rdquo; manifesto. The same components are meant to serve very different
              products — enterprise accounting, Palantir-style IDEs, commerce dashboards — and each
              has its own principles, vocabulary, grammar and voice. mizu stays deliberately
              language-absent so it can be the canvas for all of them.
            </p>
            <p className="mizu-welcome__para">
              Guidance about accessibility, semantic HTML, composition, and prop API usage is
              authoritative. Guidance about <em>visual style</em> — colors, radii, motion curves,
              voice — is only ever a recommendation from the default sample. Override freely.
            </p>
          </Stack>
        </CardBody>
      </Card>

      <Stack gap="1rem">
        <Heading level={2} size="lg">
          Architecture
        </Heading>
        <p className="mizu-welcome__para">
          mizu is a 4-tier pipeline. Each tier is a pnpm workspace package and can be consumed
          independently.
        </p>
        <Stack gap="0.5rem">
          <ArchRow
            title="1. Tokens"
            pkg="@aspect/tokens"
            desc="DTCG JSON → CSS variables, JSON, ES module, React Native via Style Dictionary 5."
          />
          <ArchRow
            title="2. CSS"
            pkg="@aspect/css"
            desc="Framework-agnostic component styles. BEM class names prefixed mizu-, references --mizu-* custom properties. Usable from any framework."
          />
          <ArchRow
            title="3. React"
            pkg="@aspect/react"
            desc="React 19 bindings. Wraps Radix primitives for overlay/focus/keyboard. CVA for variants. forwardRef + data-component throughout."
          />
          <ArchRow
            title="4. Tailwind bridge"
            pkg="@aspect/tailwind-preset"
            desc="Tailwind v4 @theme block mapping mizu tokens → Tailwind utilities. Zero-JS bridge."
          />
        </Stack>
      </Stack>

      <Stack gap="1rem">
        <Heading level={2} size="lg">
          Storybook sections
        </Heading>
        <Inline gap="1rem" wrap>
          <SectionCard title="Components" href="?path=/docs/components-atoms-button--docs">
            Atomic components — Button, Input, Select, Table, Modal, Drawer, and 40+ others.
          </SectionCard>
          <SectionCard title="Layouts" href="?path=/docs/layouts-stack--docs">
            Stack, Inline, Grid, Split, Center, Cluster. Layout vocabulary borrowed from Braid.
          </SectionCard>
          <SectionCard title="Shell" href="?path=/docs/shell-app-layout--docs">
            AppLayout, AppHeader, AppSidebar, AppContent, AppBreadcrumbs. Compositional — not
            monolithic.
          </SectionCard>
          <SectionCard title="Patterns" href="?path=/docs/patterns-resource-list--docs">
            Opinionated compositions — resource lists, filter forms, multi-step wizards.
          </SectionCard>
          <SectionCard title="Demos" href="?path=/docs/demos-cloud--docs">
            Full app shells with mock data — cloud, commerce, conversations, finance.
          </SectionCard>
        </Inline>
      </Stack>

      <Stack gap="0.5rem">
        <Heading level={2} size="md">
          Links
        </Heading>
        <Inline gap="1rem">
          <Link href="https://github.com/catalysync/mizu" external>
            GitHub
          </Link>
          <Link href="https://mizu-docs.vercel.app" external>
            Docs
          </Link>
          <Link href="?path=/docs/components-atoms-button--docs">Component reference</Link>
        </Inline>
      </Stack>
    </Stack>
  );
}

function ArchRow({ title, pkg, desc }: { title: string; pkg: string; desc: string }) {
  return (
    <Card>
      <CardBody>
        <Stack gap="0.25rem">
          <Inline gap="0.5rem" align="baseline">
            <strong className="mizu-welcome__arch-title">{title}</strong>
            <code className="mizu-welcome__arch-pkg">{pkg}</code>
          </Inline>
          <span className="mizu-welcome__arch-desc">{desc}</span>
        </Stack>
      </CardBody>
    </Card>
  );
}

function SectionCard({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className="mizu-welcome__section-card">
      <strong className="mizu-welcome__section-title">{title}</strong>
      <span className="mizu-welcome__section-desc">{children}</span>
    </a>
  );
}

const meta = {
  title: 'Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
    docs: { disable: true },
  },
} satisfies Meta<typeof Welcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
