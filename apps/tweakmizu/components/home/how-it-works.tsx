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
    <section id="how-it-works" className="bg-muted px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Workflow
          </span>
          <h2 className="mt-3 mb-3 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
            Three steps from preset to CSS.
          </h2>
          <p className="m-0 text-base leading-relaxed text-muted-foreground">
            No account, no build step, no lock-in. The whole flow lives in your browser.
          </p>
        </div>

        <div className="how-grid grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="relative mb-4">
                <span className="block text-[5rem] font-extrabold leading-none tracking-tighter text-muted-foreground/20">
                  {s.n}
                </span>
                <span className="absolute bottom-1 left-1 h-[3px] w-10 rounded-full bg-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">{s.title}</h3>
              <p className="m-0 text-[0.9375rem] leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
