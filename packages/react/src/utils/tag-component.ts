export function tagComponent(name: string) {
  return { 'data-component': `mizu-${name}` } as const;
}
