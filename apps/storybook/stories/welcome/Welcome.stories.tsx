import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Inline, Card, CardBody, Heading, Link, Badge } from '@aspect/react';

function Welcome() {
  return (
    <Stack gap="2rem" style={{ maxWidth: 960, padding: '2rem', margin: '0 auto' }}>
      <Stack gap="0.75rem">
        <Inline gap="0.75rem" align="center">
          <img src="/mizu-logo.svg" alt="mizu" height={40} />
          <Badge tone="neutral">v0.x · pre-1.0</Badge>
        </Inline>
        <Heading level={1} size="3xl">
          mizu — a base layer on top of Radix
        </Heading>
        <p style={{ color: 'var(--mizu-text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
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
            <p style={{ color: 'var(--mizu-text-secondary)', lineHeight: 1.6, margin: 0 }}>
              It ships with a neutral default theme as a starting point, but that theme is a{' '}
              <em>sample</em>, not the system's opinion. There is no "mizu believes X about UI"
              manifesto. The same components are meant to serve very different products — enterprise
              accounting, Palantir-style IDEs, commerce dashboards — and each has its own
              principles, vocabulary, grammar and voice. mizu stays deliberately language-absent so
              it can be the canvas for all of them.
            </p>
            <p style={{ color: 'var(--mizu-text-secondary)', lineHeight: 1.6, margin: 0 }}>
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
        <p style={{ color: 'var(--mizu-text-secondary)', margin: 0, lineHeight: 1.6 }}>
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

      <Stack gap="1rem">
        <Heading level={2} size="lg">
          Credits & references
        </Heading>
        <Stack gap="0.25rem" style={{ color: 'var(--mizu-text-secondary)' }}>
          <span>
            <strong>Cloudscape</strong> — atomic component reference (Cloudscape.design). Props,
            collection patterns, contentType presets.
          </span>
          <span>
            <strong>Carbon (IBM)</strong> — compositional shell reference. AppHeader + AppSidebar +
            AppContent architecture inspired by Carbon's UIShell.
          </span>
          <span>
            <strong>Braid (SEEK)</strong> — layout primitive vocabulary. Stack, Inline, Grid, Split,
            Center, Cluster.
          </span>
          <span>
            <strong>Radix UI</strong> — the behavioral foundation. mizu wraps Radix primitives
            rather than reinventing them.
          </span>
          <span>
            <strong>Geist / Linear</strong> — neutral scale + LCH-based theming inspiration.
          </span>
        </Stack>
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
            <strong style={{ color: 'var(--mizu-text-primary)' }}>{title}</strong>
            <code
              style={{
                fontSize: '0.75rem',
                color: 'var(--mizu-text-tertiary)',
                background: 'var(--mizu-surface-secondary)',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {pkg}
            </code>
          </Inline>
          <span style={{ color: 'var(--mizu-text-secondary)', fontSize: '0.875rem' }}>{desc}</span>
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
    <a
      href={href}
      style={{
        flex: '1 1 260px',
        minWidth: 260,
        padding: '1rem',
        background: 'var(--mizu-surface-default)',
        border: '1px solid var(--mizu-border-subtle)',
        borderRadius: 'var(--mizu-radius-lg)',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      <strong style={{ color: 'var(--mizu-text-primary)', display: 'block', marginBottom: 4 }}>
        {title}
      </strong>
      <span
        style={{
          color: 'var(--mizu-text-secondary)',
          fontSize: '0.875rem',
          lineHeight: 1.5,
        }}
      >
        {children}
      </span>
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
