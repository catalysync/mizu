import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { VerticalBarChart } from './VerticalBarChart';
import { AreaChart } from './AreaChart';
import { PieChart } from './PieChart';
import { ComboChart } from './ComboChart';

const data = [
  { label: 'Jan', values: { rev: 10, cost: 4 } },
  { label: 'Feb', values: { rev: 14, cost: 5 } },
  { label: 'Mar', values: { rev: 18, cost: 6 } },
];
const dataConfig = { rev: { label: 'Revenue' }, cost: { label: 'Cost' } };

function Harness({ children }: { children: React.ReactNode }) {
  return <div style={{ width: 600, height: 320 }}>{children}</div>;
}

describe('chart loading state', () => {
  it('LineChart renders skeleton with role=status when loading', () => {
    render(
      <Harness>
        <LineChart aria-label="rev" dataConfig={{}} data={[]} loading />
      </Harness>,
    );
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('BarChart renders skeleton when loading', () => {
    render(
      <Harness>
        <BarChart aria-label="rev" dataConfig={{}} data={[]} loading />
      </Harness>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('PieChart renders skeleton when loading', () => {
    render(
      <Harness>
        <PieChart aria-label="share" data={[]} loading />
      </Harness>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('chart empty state', () => {
  it('shows emptyMessage when data is empty and not loading', () => {
    render(
      <Harness>
        <LineChart aria-label="rev" dataConfig={dataConfig} data={[]} emptyMessage="Nothing yet" />
      </Harness>,
    );
    expect(screen.getByText('Nothing yet')).toBeInTheDocument();
  });
});

describe('chart render smoke', () => {
  it('LineChart renders container with aria-label', () => {
    const { container } = render(
      <Harness>
        <LineChart aria-label="revenue line" dataConfig={dataConfig} data={data} />
      </Harness>,
    );
    expect(container.querySelector('[data-component="mizu-chart"]')).toHaveAttribute(
      'aria-label',
      'revenue line',
    );
  });

  it('BarChart renders container', () => {
    const { container } = render(
      <Harness>
        <BarChart aria-label="revenue bars" dataConfig={dataConfig} data={data} />
      </Harness>,
    );
    expect(container.querySelector('[data-component="mizu-chart"]')).toBeInTheDocument();
  });

  it('VerticalBarChart renders container', () => {
    const { container } = render(
      <Harness>
        <VerticalBarChart aria-label="revenue vbars" dataConfig={dataConfig} data={data} />
      </Harness>,
    );
    expect(container.querySelector('[data-component="mizu-chart"]')).toBeInTheDocument();
  });

  it('AreaChart renders container', () => {
    const { container } = render(
      <Harness>
        <AreaChart aria-label="revenue area" dataConfig={dataConfig} data={data} />
      </Harness>,
    );
    expect(container.querySelector('[data-component="mizu-chart"]')).toBeInTheDocument();
  });

  it('PieChart renders container', () => {
    const { container } = render(
      <Harness>
        <PieChart
          aria-label="product share"
          data={[
            { label: 'A', value: 10 },
            { label: 'B', value: 30 },
          ]}
        />
      </Harness>,
    );
    expect(container.querySelector('[data-component="mizu-chart"]')).toBeInTheDocument();
  });

  it('ComboChart renders container', () => {
    const { container } = render(
      <Harness>
        <ComboChart aria-label="combo" dataConfig={dataConfig} data={data} bars={['rev']} />
      </Harness>,
    );
    expect(container.querySelector('[data-component="mizu-chart"]')).toBeInTheDocument();
  });
});
