import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { AreaChart } from './AreaChart';
import { BarChart } from './BarChart';
import { ComboChart } from './ComboChart';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { VerticalBarChart } from './VerticalBarChart';

const data = [
  { label: 'Jan', values: { rev: 10, cost: 4 } },
  { label: 'Feb', values: { rev: 14, cost: 5 } },
  { label: 'Mar', values: { rev: 18, cost: 6 } },
];
const dataConfig = { rev: { label: 'Revenue' }, cost: { label: 'Cost' } };
const pie = [
  { label: 'A', value: 10 },
  { label: 'B', value: 30 },
];

function Harness({ children }: { children: React.ReactNode }) {
  return <div style={{ width: 600, height: 320 }}>{children}</div>;
}

// Each chart: a labelled group, no role="img", and a data table carrying the values.
function expectAccessibleChart(container: HTMLElement, label: string, rows: number) {
  expect(container.querySelector('[role="img"]')).toBeNull();
  const group = screen.getByRole('group', { name: label });
  const table = within(group).getByRole('table', { name: label });
  expect(within(table).getAllByRole('row')).toHaveLength(rows + 1);
  return table;
}

describe('chart accessibility', () => {
  it('LineChart exposes a labelled group with a data table', async () => {
    const { container } = render(
      <Harness>
        <LineChart aria-label="rev line" dataConfig={dataConfig} data={data} />
      </Harness>,
    );
    const table = expectAccessibleChart(container, 'rev line', data.length);
    expect(within(table).getByRole('columnheader', { name: 'Revenue' })).toBeInTheDocument();
    expect(within(table).getByRole('rowheader', { name: 'Feb' })).toBeInTheDocument();
    expect(within(table).getByRole('cell', { name: '14' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('BarChart exposes a labelled group with a data table', async () => {
    const { container } = render(
      <Harness>
        <BarChart aria-label="rev bars" dataConfig={dataConfig} data={data} />
      </Harness>,
    );
    expectAccessibleChart(container, 'rev bars', data.length);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('VerticalBarChart exposes a labelled group with a data table', async () => {
    const { container } = render(
      <Harness>
        <VerticalBarChart aria-label="rev vbars" dataConfig={dataConfig} data={data} />
      </Harness>,
    );
    expectAccessibleChart(container, 'rev vbars', data.length);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('AreaChart exposes a labelled group with a data table', async () => {
    const { container } = render(
      <Harness>
        <AreaChart aria-label="rev area" dataConfig={dataConfig} data={data} />
      </Harness>,
    );
    expectAccessibleChart(container, 'rev area', data.length);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ComboChart exposes a labelled group with a data table', async () => {
    const { container } = render(
      <Harness>
        <ComboChart aria-label="combo" dataConfig={dataConfig} data={data} bars={['rev']} />
      </Harness>,
    );
    expectAccessibleChart(container, 'combo', data.length);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('PieChart exposes a labelled group with a label/value table', async () => {
    const { container } = render(
      <Harness>
        <PieChart aria-label="share" data={pie} valueFormatter={(v) => `${v}%`} />
      </Harness>,
    );
    const table = expectAccessibleChart(container, 'share', pie.length);
    expect(within(table).getByRole('cell', { name: '30%' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
