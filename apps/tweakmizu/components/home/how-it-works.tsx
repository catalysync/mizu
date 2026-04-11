const steps = [
  {
    n: '01',
    title: 'Pick a preset',
    body: 'Start from default or any of the 26 mizu identity themes — atlas, bold, minimal, sage, neon, and the rest.',
  },
  {
    n: '02',
    title: 'Push tokens around',
    body: 'Color pickers for every semantic token, sliders for radius and motion, text fields for typography.',
  },
  {
    n: '03',
    title: 'Copy the CSS',
    body: 'Hit Code to get a block of --mizu-* custom properties. Paste it into your project and you are done.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: '6rem 1.5rem',
        background: 'var(--mizu-surface-secondary)',
      }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ maxWidth: '40rem', marginBottom: '3rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              color: 'var(--mizu-action-primary-default)',
            }}
          >
            Workflow
          </span>
          <h2
            style={{
              margin: '0.75rem 0 0.75rem',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--mizu-text-primary)',
            }}
          >
            Three steps from preset to CSS.
          </h2>
          <p
            style={{
              margin: 0,
              color: 'var(--mizu-text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            No account, no build step, no lock-in. The whole flow lives in your browser.
          </p>
        </div>

        <div
          className="how-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
          }}
        >
          {steps.map((s) => (
            <div key={s.n}>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '5rem',
                    fontWeight: 800,
                    lineHeight: 1,
                    color: 'color-mix(in srgb, var(--mizu-text-secondary) 15%, transparent)',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {s.n}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0.25rem',
                    left: '0.25rem',
                    width: '2.5rem',
                    height: '3px',
                    borderRadius: '9999px',
                    background: 'var(--mizu-action-primary-default)',
                  }}
                />
              </div>
              <h3
                style={{
                  margin: '0 0 0.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--mizu-text-primary)',
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'var(--mizu-text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
