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
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">
            Workflow
          </span>
          <h2 className="text-foreground mt-3 mb-3 text-4xl leading-[1.1] font-bold tracking-tight md:text-5xl">
            Three steps from preset to CSS.
          </h2>
          <p className="text-muted-foreground m-0 text-base leading-relaxed">
            No account, no build step, no lock-in. The whole flow lives in your browser.
          </p>
        </div>

        <div className="how-grid grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="relative mb-4">
                <span className="text-muted-foreground/20 block text-[5rem] leading-none font-extrabold tracking-tighter">
                  {s.n}
                </span>
                <span className="bg-primary absolute bottom-1 left-1 h-[3px] w-10 rounded-full" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-bold">{s.title}</h3>
              <p className="text-muted-foreground m-0 text-[0.9375rem] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
