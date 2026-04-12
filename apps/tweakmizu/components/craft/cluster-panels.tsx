'use client';

import { KnobPanel, type KnobSection } from './knob-panel';
import { useCraftStore } from '@/store/craft-store';
import {
  RadiusDemo,
  BorderWeightDemo,
  EasingDemo,
  DurationDemo,
  ShadowDemo,
  FocusStyleDemo,
  ScaleRatioDemo,
  DensityDemo,
} from './knob-demos';

// -- Shape -----------------------------------------------------------------

export function ShapePanel() {
  const shape = useCraftStore((s) => s.profile.shape);
  const u = useCraftStore((s) => s.updateCluster);
  const sections: KnobSection[] = [
    {
      title: 'Corner radius',
      hint: 'How rounded elements feel.',
      demo: <RadiusDemo />,
      type: 'chips',
      options: [
        { id: 'sharp', label: 'Sharp (0–2px)', hint: 'IBM Carbon, Braun' },
        { id: 'soft', label: 'Soft (4–8px)', hint: 'mizu default, Stripe' },
        { id: 'pillowy', label: 'Pillowy (12–20px)', hint: 'Notion, Linear' },
        { id: 'pill', label: 'Pill (999px)', hint: 'iOS toggles' },
      ],
      value: shape.radius,
      onChange: (v) => u('shape', { radius: v as typeof shape.radius }),
    },
    {
      title: 'Uniform radius',
      hint: 'Apply the same radius to all elements (vs. scaled per size).',
      type: 'toggle',
      value: shape.radiusUniform,
      onToggle: (v) => u('shape', { radiusUniform: v }),
    },
    {
      title: 'Border weight',
      hint: 'How thick borders appear.',
      demo: <BorderWeightDemo />,
      type: 'chips',
      options: [
        { id: 'none', label: 'None', hint: 'Shadow-only' },
        { id: 'thin', label: 'Thin (1px)', hint: 'Most DSes' },
        { id: 'medium', label: 'Medium (1.5px)', hint: 'Editorial' },
        { id: 'thick', label: 'Thick (2px)', hint: 'Brutalist' },
      ],
      value: shape.borderWeight,
      onChange: (v) => u('shape', { borderWeight: v as typeof shape.borderWeight }),
    },
    {
      title: 'Chrome style',
      hint: 'How depth and layering is expressed.',
      type: 'options',
      options: [
        { id: 'flat', label: 'Flat', hint: 'No visual layering — Linear, Notion' },
        { id: 'layered', label: 'Layered', hint: 'Subtle surface shifts — mizu default' },
        { id: 'material', label: 'Material', hint: 'Shadow-heavy cards — Material Design' },
        { id: 'paper', label: 'Paper', hint: 'Textured background — editorial' },
      ],
      value: shape.chrome,
      onChange: (v) => u('shape', { chrome: v as typeof shape.chrome }),
    },
  ];
  return (
    <KnobPanel
      title="Shape"
      description="The silhouette — corner radius, border weight, and how the system expresses depth and layering."
      sections={sections}
    />
  );
}

// -- Density ---------------------------------------------------------------

export function DensityPanel() {
  const density = useCraftStore((s) => s.profile.density);
  const u = useCraftStore((s) => s.updateCluster);
  const sections: KnobSection[] = [
    {
      title: 'Spacing base',
      hint: 'The pixel grid everything snaps to.',
      type: 'chips',
      options: [
        { id: '4', label: '4px', hint: 'Compact systems' },
        { id: '6', label: '6px', hint: 'Linear' },
        { id: '8', label: '8px', hint: 'Material, most DSes' },
      ],
      value: density.spacingBase,
      onChange: (v) => u('density', { spacingBase: v as typeof density.spacingBase }),
    },
    {
      title: 'Density mode',
      hint: 'How much breathing room between elements.',
      demo: <DensityDemo />,
      type: 'options',
      options: [
        { id: 'comfortable', label: 'Comfortable', hint: 'Airy, editorial — reading-heavy' },
        { id: 'default', label: 'Default', hint: 'Balanced — mizu sample' },
        { id: 'compact', label: 'Compact', hint: 'Tight — Linear, dashboards' },
        { id: 'data-dense', label: 'Data-dense', hint: 'Bloomberg, accounting ledgers' },
      ],
      value: density.density,
      onChange: (v) => u('density', { density: v as typeof density.density }),
    },
    {
      title: 'Airy type',
      hint: 'Extra breathing room around text blocks and headings.',
      type: 'toggle',
      value: density.airyType,
      onToggle: (v) => u('density', { airyType: v }),
    },
  ];
  return (
    <KnobPanel
      title="Density"
      description="The breathing room — spacing scale, density mode, and how tight the rhythm feels."
      sections={sections}
    />
  );
}

// -- Type ------------------------------------------------------------------

export function TypePanel() {
  const type = useCraftStore((s) => s.profile.type);
  const u = useCraftStore((s) => s.updateCluster);
  const sections: KnobSection[] = [
    {
      title: 'Sans family',
      hint: 'Primary typeface — loaded from Google Fonts.',
      type: 'font-picker',
      category: 'sans',
      value: type.sansFamily,
      onChange: (v) => u('type', { sansFamily: v }),
    },
    {
      title: 'Type family kind',
      hint: 'The personality of your primary typeface.',
      type: 'options',
      options: [
        {
          id: 'sans-humanist',
          label: 'Humanist sans',
          hint: 'Inter, Source Sans — warm, readable',
        },
        {
          id: 'sans-geometric',
          label: 'Geometric sans',
          hint: 'DM Sans, Circular — clean, modern',
        },
        {
          id: 'sans-grotesque',
          label: 'Grotesque sans',
          hint: 'IBM Plex, Helvetica — neutral, professional',
        },
        {
          id: 'sans-display',
          label: 'Display sans',
          hint: 'Inter Display — tight tracking, bold headlines',
        },
      ],
      value: type.sansKind,
      onChange: (v) => u('type', { sansKind: v as typeof type.sansKind }),
    },
    {
      title: 'Mono family',
      hint: 'Monospace font for code and tabular data.',
      type: 'font-picker',
      category: 'mono',
      value: type.monoFamily,
      onChange: (v) => u('type', { monoFamily: v }),
    },
    {
      title: 'Scale ratio',
      hint: 'How quickly sizes grow between heading levels.',
      demo: <ScaleRatioDemo />,
      type: 'chips',
      options: [
        { id: 'minor-second', label: '1.067', hint: 'Tight' },
        { id: 'major-second', label: '1.125', hint: 'Compact' },
        { id: 'minor-third', label: '1.2', hint: 'Default' },
        { id: 'major-third', label: '1.25', hint: 'Expressive' },
        { id: 'perfect-fourth', label: '1.333', hint: 'Dramatic' },
      ],
      value: type.scaleRatio,
      onChange: (v) => u('type', { scaleRatio: v as typeof type.scaleRatio }),
    },
    {
      title: 'Weight vocabulary',
      hint: 'How many weight steps your type scale uses.',
      type: 'chips',
      options: [
        { id: 'duo', label: 'Duo (400/700)', hint: 'Minimal' },
        { id: 'trio', label: 'Trio (400/500/600)', hint: 'Most DSes' },
        { id: 'full', label: 'Full (300–900)', hint: 'Editorial' },
      ],
      value: type.weights,
      onChange: (v) => u('type', { weights: v as typeof type.weights }),
    },
    {
      title: 'Tight tracking',
      hint: 'Reduce letter-spacing on headings for a tighter, editorial feel.',
      type: 'toggle',
      value: type.trackingTight,
      onToggle: (v) => u('type', { trackingTight: v }),
    },
  ];
  return (
    <KnobPanel
      title="Type"
      description="The voice in text — family, scale ratio, weight vocabulary, and tracking."
      sections={sections}
    />
  );
}

// -- Motion ----------------------------------------------------------------

export function MotionPanel() {
  const motion = useCraftStore((s) => s.profile.motion);
  const u = useCraftStore((s) => s.updateCluster);
  const sections: KnobSection[] = [
    {
      title: 'Easing family',
      hint: 'The feel of transitions — how elements accelerate and decelerate.',
      demo: <EasingDemo />,
      type: 'options',
      options: [
        { id: 'calm', label: 'Calm', hint: 'ease-out dominant — mizu, Stripe' },
        { id: 'balanced', label: 'Balanced', hint: 'ease-in-out — Notion, Craft' },
        { id: 'spring', label: 'Spring', hint: 'Bouncy overshoots — Linear, Framer' },
        { id: 'snappy', label: 'Snappy', hint: 'Near-instant — Bloomberg, data tools' },
      ],
      value: motion.easing,
      onChange: (v) => u('motion', { easing: v as typeof motion.easing }),
    },
    {
      title: 'Duration scale',
      hint: 'How fast transitions are.',
      demo: <DurationDemo />,
      type: 'chips',
      options: [
        { id: 'tight', label: 'Tight (80–220ms)', hint: 'Keyboard-speed tools' },
        { id: 'medium', label: 'Medium (120–320ms)', hint: 'Balanced — mizu default' },
        { id: 'relaxed', label: 'Relaxed (160–440ms)', hint: 'Editorial, storytelling' },
      ],
      value: motion.duration,
      onChange: (v) => u('motion', { duration: v as typeof motion.duration }),
    },
    {
      title: 'Reduced motion',
      hint: 'What happens when the user prefers reduced motion.',
      type: 'chips',
      options: [
        { id: 'respect-subtle', label: 'Subtle fallback', hint: 'Still animate minimally' },
        { id: 'kill-all', label: 'Kill all motion', hint: 'Zero animation' },
      ],
      value: motion.reducedMotion,
      onChange: (v) => u('motion', { reducedMotion: v as typeof motion.reducedMotion }),
    },
  ];
  return (
    <KnobPanel
      title="Motion"
      description="The temperament — easing curves, transition durations, and reduced-motion policy."
      note="Hover over buttons, nav items, and table rows in the preview to see transitions. Switch between Tight and Relaxed durations for the clearest difference."
      sections={sections}
    />
  );
}

// -- Depth -----------------------------------------------------------------

export function DepthPanel() {
  const depth = useCraftStore((s) => s.profile.depth);
  const u = useCraftStore((s) => s.updateCluster);
  const sections: KnobSection[] = [
    {
      title: 'Depth recipe',
      hint: 'How the system creates visual separation between layers.',
      type: 'options',
      options: [
        { id: 'shadows', label: 'Shadows', hint: 'Elevated cards — Material, Apple' },
        { id: 'borders', label: 'Borders', hint: 'Flat with outlines — mizu, Linear' },
        { id: 'surfaces', label: 'Surface shifts', hint: 'Background tint — Notion' },
        { id: 'flat', label: 'Flat', hint: 'No visual depth — Brutalist' },
      ],
      value: depth.recipe,
      onChange: (v) => u('depth', { recipe: v as typeof depth.recipe }),
    },
    {
      title: 'Shadow flavor',
      hint: 'The character of shadows when used.',
      demo: <ShadowDemo />,
      type: 'options',
      options: [
        { id: 'sharp-near', label: 'Sharp near', hint: 'Tight, close — Apple HIG' },
        { id: 'soft-diffuse', label: 'Soft diffuse', hint: 'Blurred, spread — mizu default' },
        { id: 'tinted', label: 'Tinted', hint: 'Color-tinted — editorial, branded' },
        { id: 'none', label: 'None', hint: 'No shadows at all' },
      ],
      value: depth.shadowFlavor,
      onChange: (v) => u('depth', { shadowFlavor: v as typeof depth.shadowFlavor }),
    },
  ];
  return (
    <KnobPanel
      title="Depth"
      description="Elevation and layering — shadows, borders, or surface shifts to separate foreground from background."
      sections={sections}
    />
  );
}

// -- Focus -----------------------------------------------------------------

export function FocusPanel() {
  const focus = useCraftStore((s) => s.profile.focus);
  const u = useCraftStore((s) => s.updateCluster);
  const sections: KnobSection[] = [
    {
      title: 'Focus style',
      hint: 'How focused elements are visually marked.',
      demo: <FocusStyleDemo />,
      type: 'chips',
      options: [
        { id: 'outline', label: 'Outline', hint: 'Classic — most DSes' },
        { id: 'shadow', label: 'Box shadow', hint: 'Softer — mizu, Radix' },
        { id: 'bg-shift', label: 'Background shift', hint: 'Subtle tint — Notion' },
      ],
      value: focus.style,
      onChange: (v) => u('focus', { style: v as typeof focus.style }),
    },
    {
      title: 'Focus color',
      hint: 'What color the focus indicator uses.',
      type: 'chips',
      options: [
        { id: 'accent', label: 'Accent', hint: 'Matches primary action' },
        { id: 'dedicated', label: 'Dedicated', hint: 'Separate focus token' },
        { id: 'high-contrast', label: 'High contrast', hint: 'Yellow — WCAG AAA' },
      ],
      value: focus.color,
      onChange: (v) => u('focus', { color: v as typeof focus.color }),
    },
    {
      title: 'Focus width',
      hint: 'How thick the focus ring is.',
      type: 'chips',
      options: [
        { id: '1px', label: '1px', hint: 'Subtle' },
        { id: '2px', label: '2px', hint: 'Default' },
        { id: '3px', label: '3px', hint: 'High visibility' },
      ],
      value: focus.width,
      onChange: (v) => u('focus', { width: v as typeof focus.width }),
    },
  ];
  return (
    <KnobPanel
      title="Focus"
      description="Accessibility voice — how keyboard focus is shown across the system."
      note="Focus rings appear on input fields and buttons when focused. Switch the preview to a page with forms (e.g. Settings) to see changes, or tab into an input."
      preferPreviewPage="settings"
      sections={sections}
    />
  );
}

// -- Iconography -----------------------------------------------------------

export function IconographyPanel() {
  const icon = useCraftStore((s) => s.profile.iconography);
  const u = useCraftStore((s) => s.updateCluster);
  const sections: KnobSection[] = [
    {
      title: 'Icon style',
      hint: 'The visual weight and fill treatment.',
      type: 'chips',
      options: [
        { id: 'line', label: 'Line', hint: 'Lucide, Tabler' },
        { id: 'filled', label: 'Filled', hint: 'Heroicons solid' },
        { id: 'duotone', label: 'Duotone', hint: 'Phosphor' },
      ],
      value: icon.style,
      onChange: (v) => u('iconography', { style: v as typeof icon.style }),
    },
    {
      title: 'Stroke weight',
      hint: 'How thick icon strokes are.',
      type: 'chips',
      options: [
        { id: '1', label: '1', hint: 'Thin — editorial' },
        { id: '1.5', label: '1.5', hint: 'Light — Lucide default' },
        { id: '2', label: '2', hint: 'Medium — mizu default' },
        { id: '2.5', label: '2.5', hint: 'Bold — emphasis' },
      ],
      value: icon.strokeWeight,
      onChange: (v) => u('iconography', { strokeWeight: v as typeof icon.strokeWeight }),
    },
    {
      title: 'Corner style',
      hint: 'How icon corners are treated.',
      type: 'chips',
      options: [
        { id: 'sharp', label: 'Sharp', hint: 'Geometric, precise' },
        { id: 'rounded', label: 'Rounded', hint: 'Lucide default' },
        { id: 'organic', label: 'Organic', hint: 'Hand-drawn feel' },
      ],
      value: icon.cornerStyle,
      onChange: (v) => u('iconography', { cornerStyle: v as typeof icon.cornerStyle }),
    },
    {
      title: 'Size scale',
      hint: 'The default icon size trio (sm / md / lg).',
      type: 'chips',
      options: [
        { id: '16-20-24', label: '16 / 20 / 24', hint: 'Standard' },
        { id: '14-18-22', label: '14 / 18 / 22', hint: 'Compact' },
      ],
      value: icon.sizeScale,
      onChange: (v) => u('iconography', { sizeScale: v as typeof icon.sizeScale }),
    },
  ];
  return (
    <KnobPanel
      title="Iconography"
      description="Icon style, stroke weight, and corner treatment."
      note="These settings define the icon language in the exported design system. The preview uses text labels — icons render in the generated monorepo with the chosen Lucide/Phosphor style."
      sections={sections}
    />
  );
}

// -- Voice -----------------------------------------------------------------

export function VoicePanel() {
  const voice = useCraftStore((s) => s.profile.voice);
  const u = useCraftStore((s) => s.updateCluster);
  const sections: KnobSection[] = [
    {
      title: 'Register',
      hint: 'The overall tone of UI copy.',
      type: 'options',
      options: [
        { id: 'formal', label: 'Formal', hint: 'Enterprise, gov, finance' },
        { id: 'neutral', label: 'Neutral', hint: 'Professional default — mizu' },
        { id: 'friendly', label: 'Friendly', hint: 'Consumer SaaS, Notion' },
        { id: 'playful', label: 'Playful', hint: 'Consumer products, games' },
      ],
      value: voice.register,
      onChange: (v) => u('voice', { register: v as typeof voice.register }),
    },
    {
      title: 'Error tone',
      hint: 'How error messages address the user.',
      type: 'options',
      options: [
        { id: 'blame-user', label: 'Direct (blame user)', hint: '"You must enter a valid email"' },
        { id: 'blame-nothing', label: 'Neutral', hint: '"Enter a valid email address"' },
        { id: 'apologetic-system', label: 'Apologetic', hint: '"We couldn\'t process that email"' },
      ],
      value: voice.errorTone,
      onChange: (v) => u('voice', { errorTone: v as typeof voice.errorTone }),
    },
    {
      title: 'Destructive verb',
      hint: 'The default word for destructive actions.',
      type: 'chips',
      options: [
        { id: 'delete', label: 'Delete', hint: 'Permanent' },
        { id: 'remove', label: 'Remove', hint: 'From context' },
        { id: 'archive', label: 'Archive', hint: 'Recoverable' },
      ],
      value: voice.destructiveVerb,
      onChange: (v) => u('voice', { destructiveVerb: v as typeof voice.destructiveVerb }),
    },
    {
      title: 'Empty state style',
      hint: 'The personality of empty/zero-data states.',
      type: 'options',
      options: [
        {
          id: 'celebratory',
          label: 'Celebratory',
          hint: 'Confetti, success vibes — consumer apps',
        },
        { id: 'factual', label: 'Factual', hint: 'Plain description — mizu default' },
        { id: 'illustrated', label: 'Illustrated', hint: 'Custom illustrations — Notion, Stripe' },
        { id: 'minimal', label: 'Minimal', hint: 'Just text — data tools' },
      ],
      value: voice.emptyState,
      onChange: (v) => u('voice', { emptyState: v as typeof voice.emptyState }),
    },
  ];
  return (
    <KnobPanel
      title="Voice"
      description="The tone of UI copy — register, error messaging style, and vocabulary choices."
      note="Voice settings shape the copy in the exported design system (error messages, empty states, button labels). The preview uses placeholder text."
      sections={sections}
    />
  );
}

// -- Opinions --------------------------------------------------------------

export function OpinionsPanel() {
  const opinions = useCraftStore((s) => s.profile.opinions);
  const u = useCraftStore((s) => s.updateCluster);
  const sections: KnobSection[] = [
    {
      title: 'Alert tone prop name',
      hint: 'What the severity prop is called on Alert-type components.',
      type: 'chips',
      options: [
        { id: 'type', label: 'type', hint: 'Cloudscape' },
        { id: 'variant', label: 'variant', hint: 'shadcn' },
        { id: 'tone', label: 'tone', hint: 'mizu, Polaris' },
        { id: 'status', label: 'status', hint: 'Chakra' },
      ],
      value: opinions.alertNamingProp,
      onChange: (v) => u('opinions', { alertNamingProp: v as typeof opinions.alertNamingProp }),
    },
    {
      title: 'Button hierarchy prop',
      hint: 'How button emphasis levels are expressed.',
      type: 'chips',
      options: [
        { id: 'variant', label: 'variant', hint: 'primary/secondary — most DSes' },
        { id: 'emphasis', label: 'emphasis', hint: 'high/medium/low' },
        { id: 'priority', label: 'priority', hint: 'Ranked numerically' },
      ],
      value: opinions.buttonHierarchyProp,
      onChange: (v) =>
        u('opinions', { buttonHierarchyProp: v as typeof opinions.buttonHierarchyProp }),
    },
    {
      title: 'Composition style',
      hint: 'How complex components expose their structure.',
      type: 'options',
      options: [
        { id: 'compound', label: 'Compound components', hint: '<Card.Header> — mizu, Radix' },
        { id: 'slot', label: 'Slot props', hint: '<Card header="..."> — Cloudscape, Ant' },
      ],
      value: opinions.compositionStyle,
      onChange: (v) => u('opinions', { compositionStyle: v as typeof opinions.compositionStyle }),
    },
    {
      title: 'Loading ownership',
      hint: 'Does the DS own loading states or the consumer?',
      type: 'chips',
      options: [
        { id: 'design-system', label: 'Design system', hint: 'loading prop on Button — mizu' },
        { id: 'consumer', label: 'Consumer', hint: 'Render your own spinner' },
      ],
      value: opinions.loadingOwnership,
      onChange: (v) => u('opinions', { loadingOwnership: v as typeof opinions.loadingOwnership }),
    },
  ];
  return (
    <KnobPanel
      title="API opinions"
      description="How the component API surface reflects beliefs — prop naming, composition patterns, and ownership boundaries."
      note="These choices affect the generated component code (prop names, composition patterns). They don't change the visual preview."
      sections={sections}
    />
  );
}
