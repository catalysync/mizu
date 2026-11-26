// Codegen for the component registry. Reads the React component folders, each
// component's Storybook stories and its exported MIZU_*_VARIANTS constant, then
// returns component-registry.json and src/schemas.ts. Output is deterministic:
// sorted, repo-relative paths and no timestamps.
//
//   node --experimental-strip-types packages/registry/scripts/generate.ts
//   (or `pnpm codegen:registry` from the repo root, which also runs prettier)
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const COMPONENTS_DIR = 'packages/react/src/components';
const STORIES_DIR = 'apps/storybook/stories';
const REGISTRY_DIR = fileURLToPath(new URL('../', import.meta.url));
const STATUSES = ['stable', 'experimental', 'deprecated'];

interface VariantMap {
  [group: string]: { [value: string]: string };
}

interface StoryInfo {
  file: string;
  title: string;
  status: string;
  exports: string[];
}

interface ComponentEntry {
  name: string;
  source: string;
  exports: string[];
  variants: VariantMap | null;
  story: StoryInfo | null;
}

function parseFile(absPath: string): ts.SourceFile {
  const text = readFileSync(absPath, 'utf8');
  return ts.createSourceFile(absPath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function hasExport(node: ts.Node): boolean {
  return (
    ts.canHaveModifiers(node) &&
    (ts.getModifiers(node) ?? []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
  );
}

function unwrap(expr: ts.Expression): ts.Expression {
  let e = expr;
  while (ts.isAsExpression(e) || ts.isSatisfiesExpression(e) || ts.isParenthesizedExpression(e)) {
    e = e.expression;
  }
  return e;
}

function literalText(node: ts.Node): string | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return undefined;
}

function propName(name: ts.PropertyName): string {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  throw new Error(`unsupported property name: ${name.getText()}`);
}

function resolveModule(fromDir: string, spec: string): string {
  const base = resolve(fromDir, spec);
  for (const candidate of [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts')]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`cannot resolve re-export ${spec} from ${fromDir}`);
}

// Named exports of a barrel. `export * from` is followed into the target file.
function barrelExports(absPath: string): string[] {
  const names: string[] = [];
  for (const st of parseFile(absPath).statements) {
    if (!ts.isExportDeclaration(st)) continue;
    if (!st.exportClause) {
      const target = st.moduleSpecifier;
      if (!target || !ts.isStringLiteral(target)) throw new Error(`${absPath}: bad export *`);
      names.push(...barrelExports(resolveModule(dirname(absPath), target.text)));
      continue;
    }
    if (ts.isNamedExports(st.exportClause)) {
      for (const el of st.exportClause.elements) names.push(el.name.text);
    }
  }
  return names;
}

// `export const MIZU_<KEY>_VARIANTS = { group: { value: 'class' } } as const`
function readVariantConstants(absPath: string): Map<string, VariantMap> {
  const found = new Map<string, VariantMap>();
  for (const st of parseFile(absPath).statements) {
    if (!ts.isVariableStatement(st) || !hasExport(st)) continue;
    for (const decl of st.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !/^MIZU_.+_VARIANTS$/.test(decl.name.text)) continue;
      if (!decl.initializer) continue;
      const obj = unwrap(decl.initializer);
      if (!ts.isObjectLiteralExpression(obj)) {
        throw new Error(`${absPath}: ${decl.name.text} must be an object literal`);
      }
      found.set(decl.name.text, readVariantMap(obj, `${absPath}: ${decl.name.text}`));
    }
  }
  return found;
}

function readVariantMap(obj: ts.ObjectLiteralExpression, where: string): VariantMap {
  const map: VariantMap = {};
  for (const group of obj.properties) {
    if (!ts.isPropertyAssignment(group)) {
      throw new Error(`${where}: every variant group must be a property assignment`);
    }
    const groupValue = unwrap(group.initializer);
    if (!ts.isObjectLiteralExpression(groupValue)) {
      throw new Error(`${where}: every variant group must be an object literal`);
    }
    const values: { [value: string]: string } = {};
    for (const v of groupValue.properties) {
      if (!ts.isPropertyAssignment(v)) {
        throw new Error(`${where}: variant values must be property assignments`);
      }
      const cls = literalText(unwrap(v.initializer));
      if (cls === undefined) {
        throw new Error(`${where}: variant values must be string literals`);
      }
      values[propName(v.name)] = cls;
    }
    map[propName(group.name)] = values;
  }
  return map;
}

function objectProp(obj: ts.ObjectLiteralExpression, key: string): ts.Expression | undefined {
  for (const p of obj.properties) {
    if (ts.isPropertyAssignment(p) && propName(p.name) === key) return unwrap(p.initializer);
  }
  return undefined;
}

// Reads `stories/<Name>.stories.tsx`: the meta title, the single lifecycle tag, and exports.
function readStory(absPath: string, rel: string): StoryInfo {
  const exportsList: string[] = [];
  let meta: ts.ObjectLiteralExpression | undefined;
  for (const st of parseFile(absPath).statements) {
    if (!ts.isVariableStatement(st)) continue;
    for (const decl of st.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
      if (decl.name.text === 'meta') {
        const value = unwrap(decl.initializer);
        if (ts.isObjectLiteralExpression(value)) meta = value;
      } else if (hasExport(st)) {
        exportsList.push(decl.name.text);
      }
    }
  }
  if (!meta) throw new Error(`${rel}: no meta object found`);

  const titleExpr = objectProp(meta, 'title');
  const title = titleExpr && literalText(titleExpr);
  if (title === undefined) throw new Error(`${rel}: meta.title must be a string literal`);

  const tagsExpr = objectProp(meta, 'tags');
  const tags =
    tagsExpr && ts.isArrayLiteralExpression(tagsExpr)
      ? tagsExpr.elements.map((e) => literalText(e) ?? '')
      : [];
  const statuses = tags.filter((t) => STATUSES.includes(t));
  if (statuses.length !== 1) {
    throw new Error(`${rel}: meta.tags needs exactly one of ${STATUSES.join(', ')}`);
  }
  return { file: rel, title, status: statuses[0], exports: exportsList };
}

// Component folder "IconButton" owns MIZU_ICON_BUTTON_VARIANTS.
function variantKey(dirName: string): string {
  return dirName.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
}

function sortedDirs(absDir: string): string[] {
  return readdirSync(absDir)
    .filter((n) => statSync(join(absDir, n)).isDirectory())
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

export interface RegistryOutput {
  json: string;
  schemas: string;
}

export function buildRegistry(root: string = ROOT): RegistryOutput {
  const componentsAbs = join(root, COMPONENTS_DIR);
  const components: ComponentEntry[] = [];

  for (const name of sortedDirs(componentsAbs)) {
    const dirAbs = join(componentsAbs, name);
    const indexAbs = join(dirAbs, 'index.ts');
    if (!existsSync(indexAbs)) throw new Error(`${COMPONENTS_DIR}/${name}: missing index.ts`);

    const constants = new Map<string, VariantMap>();
    for (const file of readdirSync(dirAbs).sort()) {
      if (!/\.tsx?$/.test(file) || /\.(test|stories)\./.test(file)) continue;
      for (const [k, v] of readVariantConstants(join(dirAbs, file))) constants.set(k, v);
    }
    const expected = `MIZU_${variantKey(name)}_VARIANTS`;
    let variants: VariantMap | null = null;
    if (constants.size > 0) {
      const unexpected = [...constants.keys()].filter((k) => k !== expected);
      if (unexpected.length > 0) {
        throw new Error(`${COMPONENTS_DIR}/${name}: expected ${expected}, found ${unexpected}`);
      }
      variants = constants.get(expected) ?? null;
    }

    const storyAbs = join(root, STORIES_DIR, `${name}.stories.tsx`);
    const storyRel = `${STORIES_DIR}/${name}.stories.tsx`;
    components.push({
      name,
      source: `${COMPONENTS_DIR}/${name}`,
      exports: barrelExports(indexAbs),
      variants,
      story: existsSync(storyAbs) ? readStory(storyAbs, storyRel) : null,
    });
  }

  const json = `${JSON.stringify({ schemaVersion: 1, components }, null, 2)}\n`;
  return { json, schemas: renderSchemas(components) };
}

function renderSchemas(components: ComponentEntry[]): string {
  const names = components.map((c) => c.name);
  const status: { [name: string]: string | null } = {};
  const variantSchemas: { [name: string]: { [group: string]: string[] } } = {};
  for (const c of components) {
    status[c.name] = c.story ? c.story.status : null;
    if (c.variants) {
      const groups: { [group: string]: string[] } = {};
      for (const [group, values] of Object.entries(c.variants)) groups[group] = Object.keys(values);
      variantSchemas[c.name] = groups;
    }
  }
  return [
    '// Generated by packages/registry/scripts/generate.ts. Do not edit by hand.',
    `export const COMPONENT_NAMES = ${JSON.stringify(names)} as const;`,
    'export type ComponentName = (typeof COMPONENT_NAMES)[number];',
    `export const COMPONENT_STATUSES = ${JSON.stringify(STATUSES)} as const;`,
    'export type ComponentStatus = (typeof COMPONENT_STATUSES)[number];',
    `export const COMPONENT_STATUS = ${JSON.stringify(status)} as const;`,
    `export const VARIANT_SCHEMAS = ${JSON.stringify(variantSchemas)} as const;`,
    'export type VariantSchemas = typeof VARIANT_SCHEMAS;',
    'export type VariantValue<',
    '  C extends keyof VariantSchemas,',
    '  G extends keyof VariantSchemas[C],',
    '> = VariantSchemas[C][G] extends readonly (infer V)[] ? V : never;',
    '',
  ].join('\n');
}

// Only the CLI entry writes files; tests import buildRegistry without side effects.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const out = buildRegistry();
  writeFileSync(join(REGISTRY_DIR, 'component-registry.json'), out.json);
  writeFileSync(join(REGISTRY_DIR, 'src/schemas.ts'), out.schemas);
  console.log(`registry: ${out.json.length} bytes json, ${out.schemas.length} bytes schemas`);
}
