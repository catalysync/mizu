#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { DEFAULT_COMPONENTS, DEFAULT_PRIMITIVES, loadSubstrate } from './substrate.js';

const SERVER_INFO = {
  name: '@tweakmizu/mcp',
  version: '0.1.0',
};

const server = new Server(SERVER_INFO, {
  capabilities: {
    tools: {},
  },
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_substrate',
      description:
        'Read the .tweakmizu/substrate.json file at the given project root and return its contents. Use this to discover the design system grammar of a tweakmizu-generated project.',
      inputSchema: {
        type: 'object',
        required: ['projectRoot'],
        properties: {
          projectRoot: {
            type: 'string',
            description: 'Absolute filesystem path to the root of a tweakmizu-generated project.',
          },
        },
      },
    },
    {
      name: 'list_primitives',
      description:
        'List the mizu layout primitives available in @aspect/react. Use these instead of manual flex/grid CSS.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'list_components',
      description:
        'List the mizu UI components available in @aspect/react. Prefer these over raw HTML when generating UI.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'suggest_pattern',
      description:
        'Given a natural-language description of a page or section, return suggested pattern ids from the tweakmizu catalog.',
      inputSchema: {
        type: 'object',
        required: ['description'],
        properties: {
          description: {
            type: 'string',
            description: 'Plain English description of the UI the user wants.',
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get_substrate') {
    const projectRoot = String((args as { projectRoot?: string } | undefined)?.projectRoot ?? '');
    if (!projectRoot) {
      return {
        content: [{ type: 'text', text: 'Error: projectRoot is required' }],
        isError: true,
      };
    }
    try {
      const substrate = await loadSubstrate(projectRoot);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(substrate, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: could not load substrate at ${projectRoot}: ${
              error instanceof Error ? error.message : 'unknown'
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  if (name === 'list_primitives') {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              primitives: DEFAULT_PRIMITIVES,
              importPath: '@aspect/react',
              note: 'Use these for layout. Never write manual flex/grid CSS.',
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  if (name === 'list_components') {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              components: DEFAULT_COMPONENTS,
              importPath: '@aspect/react',
              industryPackages: {
                ecommerce: '@aspect/commerce',
                fintech: '@aspect/finance',
              },
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  if (name === 'suggest_pattern') {
    const description = String((args as { description?: string } | undefined)?.description ?? '');
    return {
      content: [
        {
          type: 'text',
          text: `Pattern suggestions for: "${description}"\n\nFor a real match, call the tweakmizu API at https://tweakmizu.vercel.app/api/studio/generate with a short intent spec. For offline use, pick from the catalog at https://tweakmizu.vercel.app/studio/catalog.\n\nCommon starting points:\n- cloud.apps: PaaS apps grid\n- saas.dashboard: KPI metric tiles\n- commerce.customers: customers table with plan badges\n- common.empty-state: friendly empty state`,
        },
      ],
    };
  }

  return {
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('tweakmizu-mcp failed to start:', error);
  process.exit(1);
});
