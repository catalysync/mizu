# Ethos

The principles below shape how mizu is built and how it should be used. Neither `README.md` nor `CLAUDE.md` has a section titled "ethos", so these eight rules are the explicit principles those files state, quoted as written. Each rule gives its source as `file:line`.

## What mizu is

1. "mizu is a base layer on top of Radix." — `README.md:11`

2. "mizu does not have a design language." — `README.md:13`

3. "Guidance about _visual style_ — colors, radii, motion curves, voice — is only ever a recommendation from the default sample. Override freely." — `README.md:15`

4. "mizu is for teams who want a design language, not a rebranded vendor house style." — `README.md:41`

## How it is built

5. "Compositional shell, not monolithic." — `CLAUDE.md:42`

6. "wrap a Radix primitive — never reinvent overlay positioning, focus trap, escape handling, or aria management" — `CLAUDE.md:72`

7. "Don't hard-code colors / sizes / spacings — reference `var(--mizu-*)` tokens" — `CLAUDE.md:143`

8. "Don't introduce styled-component themes, Radix's own theme, or Tailwind UI patterns wholesale — mizu has its own architecture; borrow ideas, not copies" — `CLAUDE.md:149`
