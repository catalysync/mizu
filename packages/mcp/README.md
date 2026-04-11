# @tweakmizu/mcp

Model Context Protocol server for tweakmizu. Connects Claude Desktop, Cursor, Windsurf, and any MCP-capable AI tool to the mizu design system substrate so subsequent AI edits inherit your project's grammar automatically.

## tools

- `get_substrate(projectRoot)` — read `.tweakmizu/substrate.json` from a tweakmizu-generated project
- `list_primitives()` — list mizu layout primitives (Stack, Inline, Cluster, Grid, Center, Split, Cover, Sidebar)
- `list_components()` — list mizu UI components from `@aspect/react`
- `suggest_pattern(description)` — return catalog pattern ids that match a plain-English UI description

## install

```bash
pnpm add -g @tweakmizu/mcp
```

## use with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or the Windows equivalent:

```json
{
  "mcpServers": {
    "tweakmizu": {
      "command": "tweakmizu-mcp"
    }
  }
}
```

## use with Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "tweakmizu": {
      "command": "tweakmizu-mcp"
    }
  }
}
```

## how it works

When you generate a project with tweakmizu, a `.tweakmizu/substrate.json` file ships in the zip. It declares the project's design system: tokens, primitives, patterns, rules.

With this MCP server connected, your AI tool can call `get_substrate` at the start of any session to load the substrate into context. Every subsequent edit then inherits the grammar automatically — no more fighting the model about spacing, variants, or layout.
