# tweakcn → tweakmizu gap audit

Exhaustive audit of features and behaviors from tweakcn that may or may not
belong in tweakmizu. Use this as a triage list: mark things to skip, defer,
or port.

**Legend**

- ✅ done
- 🟡 partial / stub
- (bare) not started

---

## Landing & marketing (1–20)

1. ✅ Sticky header with scroll-aware backdrop blur
2. ✅ Mobile hamburger menu
3. ✅ Dark mode toggle in header
4. ✅ Hero with gradient wordmark + preset pills
5. ✅ Features grid
6. ✅ How-it-works 3-step
7. ✅ FAQ accordion
8. ✅ Gradient CTA section
9. ✅ Footer with 3-column layout
10. Testimonials marquee (dual-row, auto-scrolling, pause on hover)
11. AI generation teaser section on landing
12. GitHub stars count fetched live in header
13. Hero theme preset carousel that auto-rotates showing each preset styled
14. Animated motion/react fade-ins (we use CSS `fade-up` only)
15. "Pricing" link / page
16. Trusted-by / social proof row (avatars)
17. Discord / Twitter / X links in footer
18. OG image generation for social sharing (1200×630)
19. Apple touch icon, favicons, `site.webmanifest`
20. Analytics scaffolding (we intentionally skip)

## Editor — control panel (21–55)

21. ✅ Three tabs: Colors / Typography / Other
22. ✅ Color pickers for every semantic token
23. ✅ Radius sliders (sm/md/lg/xl)
24. ✅ Motion sliders (duration-fast/normal)
25. ✅ Collapsible sections
26. ✅ Undo/Redo buttons
27. ✅ Reset-to-preset
28. ✅ Preset selector with search + cycle + randomize
29. HSL adjustment sliders — hue shift, saturation scale, lightness scale applied across all colors at once
30. HSL preset buttons — Grayscale, Vibrant, Hue Invert, Dimmer, Brighter, etc. (~13 recipes)
31. Contrast checker — WCAG AA ratios for every paired fg/bg combo, pass/fail badges
32. Contrast checker filter — "all" vs "issues only"
33. Shadow control — color picker + opacity/blur/spread/offset-x/offset-y sliders
34. Letter spacing slider (needs letter-spacing token in mizu)
35. Spacing scale slider
36. Debounced color input — prevents thrashing the store
37. Color inspector highlight — clicking a class in the inspector overlay scrolls matching picker into view
38. Sidebar color sync toggle (mizu has no sidebar tokens — skippable)
39. 🟡 Font picker combobox (data layer done, UI still raw text input)
40. Alternative palette mode — pick from the full Tailwind palette instead of hex
41. Popular-fonts section vs full search
42. Font preview on hover
43. Font weight/variant picker per family
44. Category filter on font picker — sans / serif / mono / display / handwriting
45. Slider+numeric input combo (we have plain sliders)
46. ✅ URL-synced tab state (nuqs)
47. Preferences store — color format, export options, package manager persisted
48. 🟡 Color format selector — hex / rgb / hsl / oklch (default hex, no UI toggle yet)
49. Tailwind v3 vs v4 toggle (skip — mizu is v4-only)
50. Animated section expand on inspector focus
51. More-options dropdown in action bar
52. Inspector mode toggle — click components in preview to see CSS classes
53. Inspector overlay — hover highlight, class name hover-card, click-to-focus
54. Save checkpoint / restore checkpoint — finer than full reset
55. Color control focus store — pub/sub for highlighting specific pickers from other components

## Editor — action bar & dialogs (56–75)

56. ✅ Undo / Redo
57. ✅ Reset
58. ✅ Import CSS dialog
59. ✅ Share URL (copy to clipboard)
60. ✅ Code export dialog
61. ✅ Dark mode toggle in editor chrome
62. Save theme dialog (replace with localStorage-named themes)
63. Published-theme state + Publish button (needs DB)
64. Open-in-v0 button
65. MCP dialog — expose theme as an MCP tool
66. Save-as-new vs update-existing flow
67. CSS import dialog with parse preview (show what will be applied before applying)
68. CSS import detects light/dark blocks (we are single-mode)
69. Toast notifications for action results
70. ✅ Unsaved changes indicator next to theme name
71. Checkpoint system — snapshot before risky ops (AI generate, preset swap)
72. 🟡 Fullscreen preview toggle (button exists, native Fullscreen API)
73. Open-in-figma button
74. Share dialog (vs direct copy) — shows the URL with copy button
75. Copy registry URL for `npx shadcn add` (skip — not a shadcn registry)

## Editor — preview panel (76–100)

76. ✅ Preview of mizu components
77. ✅ Color palette view
78. Multiple preview tabs: Custom / Cards / Dashboard / Mail / Pricing / Typography
79. Dashboard demo — full app shell with charts, nav, data table
80. Mail client demo — multi-pane layout
81. Music player demo
82. Tasks / data table demo — filters, pagination, row actions
83. Cards grid demo — many card variants (stats, activity, calendar, etc.)
84. Typography showcase
85. Pricing preview — fake landing pricing table
86. Inspector overlay (see 52/53)
87. Live website preview iframe — paste an external URL, inject your theme
88. Horizontal scroll containers for wide previews on narrow screens
89. Theme inspector with class annotations
90. Contrast indicator on text-over-background swatches
91. Per-component zoom / viewport width toggle (desktop / tablet / mobile)
92. Dot-grid preview background
93. ✅ Table demo uses `mizu-table-wrapper` with sample data
94. AI chat demo as a preview option
95. ✅ Color palette grid with hex labels
96. Noise effect overlays (decorative SVG noise)
97. Frame highlight / spotlight on hover
98. Tabs scroll area — horizontal-scrolling tabs on narrow viewports
99. Per-demo "open in v0" button
100.  Custom component slot — paste arbitrary JSX/HTML and preview

## AI generation (101–120)

101. Prompt → theme text generation (planned via Claude)
102. Image → theme — upload image, extract palette + vibe
103. Chat interface with persistent multi-turn history in IndexedDB
104. Streaming responses — progressive theme updates
105. Mentions in prompts — reference existing presets
106. Enhance prompt button — rewrite short prompt into detailed one
107. Stop/abort in-flight generation
108. Edit + regenerate past user messages
109. Retry past assistant response
110. Checkpoint restoration — one-click undo of an AI generation
111. Pre-built prompt suggestions — "Create", "Remix", "Tweak" starting points
112. Image upload with drag-and-drop
113. SVG sanitization before sending to model
114. Client-side rate limiting (no backend)
115. System prompt with brand harmony / contrast minimums / font pairing rules
116. Structured output via Zod schema — model returns `ThemeStyleProps` directly
117. Error banner with dismissable retry
118. Request abort via `AbortController`
119. Per-request usage tracking (tokens in/out) displayed as "X generations left today"
120. Rotating loading messages during stream

## Export & code (121–135)

121. ✅ Plain CSS output to `:root`
122. ✅ Scoped output to `[data-mizu-identity]`
123. ✅ Copy to clipboard with feedback
124. Export as full `mizu.css` file
125. Export as JS module — `export const theme = {...}`
126. Export as React Native object (matches `@aspect/tokens/rn`)
127. Export as DTCG JSON (matches `@aspect/tokens/json`)
128. Export as Tailwind v4 `@theme` block
129. `layout.tsx` boilerplate that imports the fonts our theme uses
130. Registry command — `npx shadcn add ...` (skip)
131. Code panel tabs — css / config / layout / json side-by-side
132. Syntax highlighting in the export dialog
133. 🟡 Diff-only export — only overrides from the selected preset (half done when scope=identity)
134. Download as `.css` file instead of copy
135. Theme minification option

## Community & sharing (136–145)

136. ✅ Share-via-URL (query param)
137. Community themes gallery (needs DB)
138. Like / star a theme (needs DB)
139. Tag system — filter by "dark", "minimal", "brutalist", etc. (needs DB)
140. Permalink page at `/themes/<id>` with OG image preview (needs DB)
141. Community themes sidebar — filter by "all / mine / liked" (needs DB)
142. Time-range popular — weekly / monthly / all-time (needs DB)
143. Keyboard navigation for theme previews (arrow keys)
144. Embed live-preview script — `<script>` you paste into any site to inject your theme
145. Theme permalink OG image generated via `next/og` — mini mock in 1200×630

## Settings / account (146–155)

146. Settings page (requires auth — skip or move to localStorage)
147. Local saved themes — rename, delete, export, re-import
148. AI usage dashboard — request count, token usage (DB-bound)
149. "Clear all local state" dangerzone button
150. Custom theme tagging (local)
151. Theme rename dialog
152. Theme duplicate (fork a preset to tweak it)
153. Export all local themes as a single JSON backup
154. Import all themes from a JSON backup
155. Keyboard shortcuts help dialog

## Keyboard & state (156–170)

156. Cmd/Ctrl+Z undo, Cmd/Ctrl+Shift+Z redo
157. Cmd/Ctrl+K command menu — quick theme/preset switcher, actions
158. Cmd/Ctrl+S save shortcut
159. Cmd/Ctrl+/ open help
160. ✅ Escape closes dialogs/popovers (Radix)
161. Left/Right arrow cycles presets when dropdown open
162. ✅ Persisted editor state to localStorage
163. Version migration for old localStorage keys
164. Debounced autosave of state
165. ✅ History size cap (30)
166. ✅ 500ms coalesce window for history entries
167. Session-scoped vs persisted state split (some things shouldn't persist)
168. Multi-tab sync via `BroadcastChannel`
169. Conflict warning when opening a shared URL that would clobber unsaved changes
170. Ephemeral "what if" branch — preview without committing to history

## Legal / SEO / meta (171–180)

171. ✅ Privacy policy page
172. ✅ sitemap.xml
173. ✅ robots.txt
174. ✅ 404 not-found page with nav back
175. Canonical URLs in metadata
176. JSON-LD structured data (SoftwareApplication / Product)
177. RSS feed of new community themes (needs DB)
178. Open Graph image for the landing page
179. Twitter card with custom summary image
180. `manifest.webmanifest` + PWA install prompt

## Public API / registry / integration (181–195)

181. Public REST API — `GET /api/v1/themes`, `/:id`, `/me` (needs DB)
182. OAuth 2.0 authorize + token + userinfo endpoints for 3rd party apps
183. Token revocation endpoint (RFC 7009)
184. Bearer auth + scopes on API routes
185. shadcn-compatible registry at `/r/registry.json` (skip)
186. Per-theme registry endpoint at `/r/themes/<id>.json`
187. Polar / Stripe webhook + subscription sync (skip — no payments)
188. Build script that regenerates registry from `defaultPresets`
189. Figma plugin onboarding page
190. VS Code extension integration
191. Docker Compose for self-hosted dev
192. ✅ `/api/fonts` Google Fonts proxy
193. Rate-limit middleware via Vercel KV / Upstash
194. Signed share links — HMAC the payload so tampered URLs fail gracefully
195. Telemetry opt-out in settings

## Utilities / foundational (196–200)

196. ✅ HSL / RGB / OKLCH round-trip via `culori` (already imported for export)
197. More forgiving CSS parser than our regex — handles multi-block files, numeric HSL shorthand
198. Shadow scale generator — compute an 8-tier shadow scale from a single base + opacity
199. View transitions on preset swap — smooth cross-fade via `document.startViewTransition`
200. Color-blindness simulator toggle — daltonism filter on the preview (deuter-/prot-/tritanopia)

---

## Configs & tooling (201–230)

These are config-level items the feature-focused audit didn't surface. Most
inherit from the mizu monorepo root (eslint, prettier, husky, tsconfig),
which is an advantage — tweakcn repeats per-package config that we get for
free. A few are still missing inside `apps/tweakmizu` specifically.

### Next.js config

201. Turbopack SVGR loader in `next.config.ts` — tweakcn configures `@svgr/webpack` so `.svg` files can be imported as React components. We have no SVG imports yet, but if we start using icon files from `assets/` we'll need either this loader or we inline the SVG into JSX.
202. `next.config.ts` image remote patterns — tweakcn doesn't use them but any `<Image>` to an external OG or avatar needs `remotePatterns` whitelisting.
203. `experimental.optimizePackageImports` — worth adding `['@aspect/react', 'lucide-react']` to shrink client bundle.
204. Font optimization via `next/font/google` — tweakcn preloads fonts via raw `<link>` in `layout.tsx` head, but `next/font` hashes/inlines them and removes the layout shift. We also use raw `<link>`. Worth considering a switch.
205. `output: 'standalone'` for Docker deployments (skip — Vercel doesn't need it).
206. `headers()` config in `next.config.ts` for CSP / Permissions-Policy / X-Frame-Options. Tweakcn doesn't add these; we should, since we're public.

### TypeScript

207. ✅ `tsconfig.json` paths `@/*` alias — matches tweakcn exactly.
208. `strict: true` ✅ (both have it).
209. Tweakcn uses `target: "ES2017"` — we inherit the same; worth revisiting to `ES2022` now that Next 15 targets modern browsers.
210. No `tsconfig` project references — each app type-checks in isolation. That's fine for us.

### ESLint

211. Inherit from monorepo root `eslint.config.mjs` ✅ — we don't need our own like tweakcn does.
212. Tweakcn disables `@next/next/no-img-element` and `@next/next/no-page-custom-font`. We haven't run into either warning yet but may want to disable similarly.
213. Tweakcn's underscore-prefix rule for unused vars (`argsIgnorePattern: "^_"`) — nice ergonomics, worth porting to the root config.
214. ✅ `react-hooks/exhaustive-deps` as warn — we already get this via `eslint-plugin-react-hooks` at the root.

### Prettier

215. Inherit from monorepo root ✅ — we have one prettier config for the whole repo.
216. `prettier-plugin-tailwindcss` — sorts Tailwind utility classes by the official order. **Not currently in our monorepo prettier config** — worth adding since we just refactored everything to utility classes.
217. Tweakcn uses `singleQuote: false` (double quotes) — we use single quotes. Keep single.
218. `printWidth: 100` — we use 100 too.
219. `pluginSearchDirs: false` — avoids Prettier auto-loading plugins from random node_modules. Tweakcn has it; we should too if we add the Tailwind plugin.

### Husky / lint-staged

220. Monorepo root has `husky` pre-commit ✅ — runs lint-staged formatting on changed files (we see it on every commit in the command output).
221. Tweakcn runs the full `npm run lint` in pre-commit. Ours runs `prettier --write` via lint-staged. Tweakcn's is stricter (catches eslint errors before commit).
222. Consider adding `eslint --fix` to lint-staged for changed files.

### PostCSS / Tailwind

223. ✅ `postcss.config.mjs` with `@tailwindcss/postcss` — matches tweakcn.
224. Tweakcn uses `tw-animate-css` plugin for extra animation utilities (`animate-in`, `fade-in-0`, etc.). We don't have it yet — worth adding if we want Radix state-in/state-out transitions without hand-writing keyframes.
225. ✅ `@theme inline` block in `globals.css` for Tailwind v4 bridge.

### pnpm / package.json

226. Tweakcn has a `prebuild` hook that regenerates the theme registry JSON. We don't need this since we compile the registry JSON into TS (`utils/theme-presets.ts`), but if we ever want a public registry endpoint we'd want the same pattern.
227. Tweakcn has a `postbuild` hook that minifies `public/live-preview.js` with terser. Skip — no live-preview embed script yet (see audit item #144).
228. Tweakcn's `prepare: husky` script — we already have this at the monorepo root.
229. `pnpm-workspace.yaml` — our monorepo already covers `apps/tweakmizu` via `apps/*`.
230. We should add tweakmizu to `turbo.json` if there's special cache-excluding needed — currently it inherits default `dist/**` and `.next/**` outputs which is fine.

### Other tweakcn infra we intentionally don't need

- `drizzle.config.ts` — no DB
- `docker-compose.yml` — no Postgres service
- `components.json` (shadcn config) — no shadcn registry; we use `@aspect/react`
- `middleware.ts` — no auth-protected routes
- `routes.ts` — no auth redirect helpers
- `public/live-preview.js` — no embed script yet (item #144)

---

## Quick tally

- **Already ✅:** 1-9, 21-28, 46, 56-61, 70, 76-77, 93, 95, 121-123, 136, 160, 162, 165-166, 171-174, 192, 196
- **Partial 🟡:** 39 (font picker UI), 48 (color format), 72 (fullscreen), 133 (diff export)
- **Requires DB/auth (skip or defer):** 62, 63, 137–142, 146, 148, 177, 181–187
- **Tweakcn-specific or Tailwind v3 (skip):** 38, 49, 75, 130, 185–186
- **Meaningful next wins (no backend):** 10, 31, 33, 39-UI, 44, 52, 64, 78–83, 94, 100, 124–128, 147, 156–158, 199
- **Quick config wins:** 201 (SVGR), 203 (optimizePackageImports), 206 (security headers), 216 (prettier-plugin-tailwindcss), 221 (stricter pre-commit), 224 (tw-animate-css)
