import { Button } from '@aspect/react';

export default function HomePage() {
  return (
    <main>
      <h1>mizu design system</h1>
      <p>A token-driven, framework-agnostic design system.</p>
      <p>
        <Button variant="primary">Get started</Button>{' '}
        <Button variant="secondary">View on GitHub</Button>
      </p>
      <p>
        See <a href="/getting-started">getting started</a> for installation.
      </p>
    </main>
  );
}
