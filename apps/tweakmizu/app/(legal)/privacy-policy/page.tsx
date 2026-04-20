import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | tweakmizu',
  description: 'How tweakmizu handles your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <article className="text-foreground mx-auto max-w-2xl px-6 py-16 font-sans leading-relaxed">
      <h1 className="m-0 text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
      <p className="text-muted-foreground mt-2 mb-8 text-sm">Last updated: April 11, 2026</p>

      <Section title="1. Overview">
        tweakmizu is a static, client-side tool for editing themes in the mizu design system. It
        runs entirely in your browser. There is no user account, no server-side database, and no
        backend that processes your work.
      </Section>

      <Section title="2. What data we store">
        The editor persists your in-progress theme to your browser&apos;s <code>localStorage</code>{' '}
        so that a refresh or returning visit restores your state. This data never leaves your
        machine. Clearing your browser storage removes it.
      </Section>

      <Section title="3. What data we collect">
        We do not collect personal information, set tracking cookies, or run third-party advertising
        scripts. If tweakmizu is deployed behind a CDN or platform provider, that platform may keep
        standard request logs (IP, user-agent, referrer) for operational reasons. Those logs are
        governed by the hosting provider&apos;s own privacy policy.
      </Section>

      <Section title="4. Cookies">
        tweakmizu does not set cookies. The site uses <code>localStorage</code> for editor state
        only, which is a separate browser storage mechanism and is not transmitted with network
        requests.
      </Section>

      <Section title="5. Open source">
        tweakmizu is part of the open-source mizu design system. The full source is available on
        GitHub and can be audited, forked, or self-hosted. If you want absolute control over where
        your edits live, self-hosting the app is the most conservative option.
      </Section>

      <Section title="6. Changes to this policy">
        If this policy changes, the &ldquo;Last updated&rdquo; date above will be revised. Material
        changes will be reflected in the commit history of the mizu repository.
      </Section>

      <Section title="7. Contact">
        Questions about this policy? Open an issue on the{' '}
        <a
          href="https://github.com/catalysync/mizu/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary"
        >
          mizu repository
        </a>
        .
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="mb-2 text-lg font-bold">{title}</h2>
      <p className="text-muted-foreground m-0">{children}</p>
    </section>
  );
}
