/**
 * agent-tools — the Claude tool definitions for the craft studio agent.
 * Each tool maps to a mutation on the DesignLanguageProfile. The agent
 * picks which tools to call based on the user's natural-language request.
 *
 * Format: Anthropic SDK `tools` array, with JSON Schema input shapes
 * that match the zod schemas in profile.ts and app-schema.ts.
 */

import type Anthropic from '@anthropic-ai/sdk';

export const CRAFT_TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: 'set_foundation',
    description:
      'Update the Foundation cluster (seed color, brand hue, color mood, chroma, contrast, dark mode, extended palette). Call when the user describes brand colors, color mood, saturation, contrast preferences, or wants to add custom palette colors. seedColor is a hex like "#3b82f6" — when provided, brandHue is derived from it. colorMood controls the overall palette generation strategy. contrastLevel is a fine-grained slider from -1 (lower) to 1 (higher) within the chosen contrast tier. extendedColors are extra named colors beyond the primary seed (e.g. success green, warning amber).',
    input_schema: {
      type: 'object' as const,
      properties: {
        brandHue: { type: 'number', minimum: 0, maximum: 360 },
        seedColor: {
          type: 'string',
          pattern: '^#[0-9a-fA-F]{6}$',
          description: 'Hex color for the brand seed, e.g. "#3b82f6". Overrides brandHue.',
        },
        huePersonality: { type: 'string', enum: ['warm', 'cool', 'neutral', 'chromatic'] },
        chroma: { type: 'string', enum: ['muted', 'balanced', 'vibrant'] },
        colorMood: {
          type: 'string',
          enum: ['tonal', 'vibrant', 'muted', 'monochrome', 'expressive'],
          description:
            'Palette generation strategy. tonal = harmonious single-hue, vibrant = saturated multi-hue, muted = desaturated, monochrome = grays only, expressive = high-contrast complementary.',
        },
        contrast: {
          type: 'string',
          enum: ['aa-comfortable', 'aaa-conservative', 'editorial-high'],
        },
        contrastLevel: {
          type: 'number',
          minimum: -1,
          maximum: 1,
          description: 'Fine-grained contrast adjustment within the chosen tier. 0 = tier default.',
        },
        darkMode: { type: 'string', enum: ['parallel', 'inverted', 'dim', 'none'] },
        extendedColors: {
          type: 'array',
          maxItems: 8,
          description:
            'Extra named palette colors beyond the seed (e.g. success, warning). Each entry has a name, hex value, and whether to harmonize it with the seed.',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', minLength: 1, maxLength: 32 },
              hex: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
              harmonize: { type: 'boolean' },
            },
            required: ['name', 'hex', 'harmonize'],
          },
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'set_shape',
    description:
      'Update the Shape cluster (radius, border weight, chrome style). Call for rounded vs sharp, border thickness, layered vs flat discussions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        radius: { type: 'string', enum: ['sharp', 'soft', 'pillowy', 'pill'] },
        radiusUniform: { type: 'boolean' },
        borderWeight: { type: 'string', enum: ['none', 'thin', 'medium', 'thick'] },
        chrome: { type: 'string', enum: ['flat', 'layered', 'material', 'paper'] },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'set_density',
    description: 'Update the Density cluster (spacing base, density mode, airy type).',
    input_schema: {
      type: 'object' as const,
      properties: {
        spacingBase: { type: 'string', enum: ['4', '6', '8'] },
        density: { type: 'string', enum: ['comfortable', 'default', 'compact', 'data-dense'] },
        airyType: { type: 'boolean' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'set_type',
    description: 'Update the Type cluster (font family, scale ratio, weight vocabulary, tracking).',
    input_schema: {
      type: 'object' as const,
      properties: {
        sansFamily: { type: 'string' },
        sansKind: {
          type: 'string',
          enum: [
            'sans-humanist',
            'sans-geometric',
            'sans-grotesque',
            'sans-display',
            'serif',
            'mono-primary',
          ],
        },
        monoFamily: { type: 'string' },
        scaleRatio: {
          type: 'string',
          enum: ['minor-second', 'major-second', 'minor-third', 'major-third', 'perfect-fourth'],
        },
        weights: { type: 'string', enum: ['duo', 'trio', 'full'] },
        trackingTight: { type: 'boolean' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'set_motion',
    description: 'Update the Motion cluster (easing, duration, reduced motion).',
    input_schema: {
      type: 'object' as const,
      properties: {
        easing: { type: 'string', enum: ['calm', 'balanced', 'spring', 'snappy'] },
        duration: { type: 'string', enum: ['tight', 'medium', 'relaxed'] },
        reducedMotion: { type: 'string', enum: ['respect-subtle', 'kill-all'] },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'set_depth',
    description:
      'Update the Depth cluster (depth recipe, shadow flavor). Call for elevation, shadow, layering discussions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        recipe: { type: 'string', enum: ['shadows', 'borders', 'surfaces', 'flat'] },
        shadowFlavor: { type: 'string', enum: ['sharp-near', 'soft-diffuse', 'tinted', 'none'] },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'set_focus',
    description:
      'Update the Focus cluster (focus ring style, color, width). Call for accessibility or keyboard navigation discussions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        style: { type: 'string', enum: ['outline', 'shadow', 'bg-shift'] },
        color: { type: 'string', enum: ['accent', 'dedicated', 'high-contrast'] },
        width: { type: 'string', enum: ['1px', '2px', '3px'] },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'set_iconography',
    description:
      'Update the Iconography cluster (icon style, stroke weight, corner style, size scale).',
    input_schema: {
      type: 'object' as const,
      properties: {
        style: { type: 'string', enum: ['line', 'filled', 'duotone'] },
        strokeWeight: { type: 'string', enum: ['1', '1.5', '2', '2.5'] },
        cornerStyle: { type: 'string', enum: ['sharp', 'rounded', 'organic'] },
        sizeScale: { type: 'string', enum: ['16-20-24', '14-18-22'] },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'set_voice',
    description:
      'Update the Voice cluster (register, error tone, empty state style, destructive verb).',
    input_schema: {
      type: 'object' as const,
      properties: {
        register: { type: 'string', enum: ['formal', 'neutral', 'friendly', 'playful'] },
        errorTone: { type: 'string', enum: ['blame-user', 'blame-nothing', 'apologetic-system'] },
        emptyState: {
          type: 'string',
          enum: ['celebratory', 'factual', 'illustrated', 'minimal'],
        },
        destructiveVerb: { type: 'string', enum: ['delete', 'remove', 'archive'] },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'set_opinions',
    description:
      'Update the API opinions cluster (alert naming, button hierarchy, composition style, loading ownership).',
    input_schema: {
      type: 'object' as const,
      properties: {
        alertNamingProp: { type: 'string', enum: ['type', 'variant', 'tone', 'status'] },
        buttonHierarchyProp: { type: 'string', enum: ['variant', 'emphasis', 'priority'] },
        compositionStyle: { type: 'string', enum: ['compound', 'slot'] },
        loadingOwnership: { type: 'string', enum: ['design-system', 'consumer'] },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'update_identity',
    description:
      'Update the product identity (name, tagline, domain, audience, logo). Call when the user describes their product or picks a domain.',
    input_schema: {
      type: 'object' as const,
      properties: {
        productName: { type: 'string' },
        productTagline: { type: 'string' },
        domain: {
          type: 'string',
          enum: [
            'finance',
            'healthcare',
            'commerce',
            'dev-tools',
            'editorial',
            'ai-product',
            'saas-admin',
            'hr',
            'other',
          ],
        },
        audience: {
          type: 'string',
          enum: ['b2b-enterprise', 'b2b-smb', 'b2c-consumer', 'developer', 'internal'],
        },
        logo: { type: 'string' },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'add_page',
    description:
      'Add a new page to the application. Include a composition with header and sections.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string' },
        path: { type: 'string' },
        title: { type: 'string' },
        icon: { type: 'string' },
        navSection: { type: 'string', enum: ['primary', 'secondary'], default: 'primary' },
        headerTitle: { type: 'string' },
        headerDescription: { type: 'string' },
        headerActions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              variant: { type: 'string', enum: ['primary', 'secondary', 'ghost', 'destructive'] },
            },
            required: ['label', 'variant'],
          },
        },
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              kind: {
                type: 'string',
                enum: [
                  'kpi-row',
                  'table',
                  'form',
                  'detail-card',
                  'empty-state',
                  'text',
                  'activity-list',
                  'settings-form',
                  'wizard',
                ],
              },
              title: { type: 'string' },
              entityId: { type: 'string' },
              columnIds: { type: 'array', items: { type: 'string' } },
              body: { type: 'string' },
              kpis: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    label: { type: 'string' },
                    value: { type: 'string' },
                    delta: { type: 'string' },
                  },
                  required: ['label', 'value'],
                },
              },
            },
            required: ['id', 'kind'],
          },
        },
      },
      required: ['id', 'path', 'title'],
    },
  },
  {
    name: 'remove_page',
    description: 'Remove a page from the application by its ID.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    },
  },
  {
    name: 'reorder_nav',
    description: 'Reorder the navigation. Pass the page IDs in the desired order.',
    input_schema: {
      type: 'object' as const,
      properties: {
        order: { type: 'array', items: { type: 'string' } },
      },
      required: ['order'],
    },
  },
  {
    name: 'define_entity',
    description:
      'Define or replace a domain entity (e.g. Customer, Invoice, Transaction). Used for table data.',
    input_schema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        plural: { type: 'string' },
        fields: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              type: {
                type: 'string',
                enum: [
                  'string',
                  'text',
                  'number',
                  'currency',
                  'percent',
                  'date',
                  'badge',
                  'boolean',
                  'email',
                ],
              },
              badgeValues: { type: 'array', items: { type: 'string' } },
              required: { type: 'boolean' },
              primary: { type: 'boolean' },
            },
            required: ['id', 'label', 'type'],
          },
        },
      },
      required: ['id', 'name', 'plural', 'fields'],
    },
  },
  {
    name: 'add_table_column',
    description: 'Add a column to an existing entity by adding a field.',
    input_schema: {
      type: 'object' as const,
      properties: {
        entityId: { type: 'string' },
        field: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            label: { type: 'string' },
            type: {
              type: 'string',
              enum: [
                'string',
                'text',
                'number',
                'currency',
                'percent',
                'date',
                'badge',
                'boolean',
                'email',
              ],
            },
            badgeValues: { type: 'array', items: { type: 'string' } },
          },
          required: ['id', 'label', 'type'],
        },
      },
      required: ['entityId', 'field'],
    },
  },
];
