import type { Entity, EntityField } from './app-schema';

/**
 * Deterministic mock data generator — given an Entity schema, emit N rows
 * that look plausible for the preview. Deterministic so the same profile
 * always produces the same preview (idempotent for screenshots + tests).
 */

const FIRST_NAMES = [
  'Ada',
  'Alan',
  'Grace',
  'Linus',
  'Edsger',
  'Donald',
  'Margaret',
  'Radia',
  'Barbara',
  'Dennis',
  'Ken',
  'Brian',
  'Leslie',
  'Niklaus',
  'John',
  'Rebecca',
];

const LAST_NAMES = [
  'Lovelace',
  'Turing',
  'Hopper',
  'Torvalds',
  'Dijkstra',
  'Knuth',
  'Hamilton',
  'Perlman',
  'Liskov',
  'Ritchie',
  'Thompson',
  'Kernighan',
  'Lamport',
  'Wirth',
  'McCarthy',
  'Parks',
];

const COMPANIES = [
  'Acme Holdings',
  'Harbor & Co.',
  'Fleet Labs',
  'Tidewater Group',
  'Kiln Studio',
  'Magnolia Ltd',
  'Northlight Co-op',
  'Perch Digital',
  'Slate Works',
  'Redwood Partners',
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function seededValue(field: EntityField, rowIndex: number): string {
  switch (field.type) {
    case 'string': {
      if (field.id === 'name' || field.id === 'customerName') {
        return `${pick(FIRST_NAMES, rowIndex)} ${pick(LAST_NAMES, rowIndex + 3)}`;
      }
      if (field.id === 'company') return pick(COMPANIES, rowIndex);
      return `Row ${rowIndex + 1}`;
    }
    case 'text':
      return `Item ${rowIndex + 1} description.`;
    case 'email': {
      const first = pick(FIRST_NAMES, rowIndex).toLowerCase();
      const last = pick(LAST_NAMES, rowIndex + 3).toLowerCase();
      return `${first}.${last}@example.com`;
    }
    case 'number':
      return String(100 + rowIndex * 17);
    case 'currency': {
      const amt = 250 + ((rowIndex * 467) % 9750);
      return `$${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
    case 'percent': {
      const pct = (rowIndex * 7) % 100;
      return `${pct}%`;
    }
    case 'date': {
      const d = new Date(2026, 3, 1 + (rowIndex % 28));
      return d.toISOString().slice(0, 10);
    }
    case 'badge': {
      const values = field.badgeValues ?? ['active'];
      return pick(values, rowIndex);
    }
    case 'boolean':
      return rowIndex % 2 === 0 ? 'Yes' : 'No';
  }
}

export interface MockRow {
  id: string;
  [fieldId: string]: string;
}

export function generateRows(entity: Entity, count: number): MockRow[] {
  const rows: MockRow[] = [];
  for (let i = 0; i < count; i++) {
    const row: MockRow = { id: `${entity.id}-${i + 1}` };
    for (const field of entity.fields) {
      row[field.id] = seededValue(field, i);
    }
    rows.push(row);
  }
  return rows;
}
