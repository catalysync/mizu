import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { DefinitionList } from './DefinitionList';

describe('DefinitionList', () => {
  it('renders items as dt/dd pairs', () => {
    render(
      <DefinitionList
        items={[
          { label: 'Status', value: 'Paid' },
          { label: 'Amount', value: '$1,200.00' },
        ]}
      />,
    );
    expect(screen.getByText('Status').tagName).toBe('DT');
    expect(screen.getByText('Paid').tagName).toBe('DD');
    expect(screen.getByText('Amount').tagName).toBe('DT');
    expect(screen.getByText('$1,200.00').tagName).toBe('DD');
  });

  it('defaults to horizontal orientation', () => {
    const { container } = render(<DefinitionList items={[{ label: 'A', value: 'B' }]} />);
    expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('supports vertical orientation with item wrappers', () => {
    const { container } = render(
      <DefinitionList
        orientation="vertical"
        items={[
          { label: 'Invoice', value: 'INV-001' },
          { label: 'Due', value: '2026-05-01' },
        ]}
      />,
    );
    expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical');
    const items = container.querySelectorAll('.mizu-definition-list__item');
    expect(items.length).toBe(2);
  });

  it('applies columns data attribute and wraps items', () => {
    const { container } = render(
      <DefinitionList
        columns={2}
        items={[
          { label: 'A', value: '1' },
          { label: 'B', value: '2' },
        ]}
      />,
    );
    expect(container.firstChild).toHaveAttribute('data-columns', '2');
    expect(container.querySelectorAll('.mizu-definition-list__item').length).toBe(2);
  });

  it('supports children instead of items', () => {
    render(
      <DefinitionList>
        <dt>Manual</dt>
        <dd>Value</dd>
      </DefinitionList>,
    );
    expect(screen.getByText('Manual')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <DefinitionList
        items={[
          { label: 'Account', value: 'Acme Inc' },
          { label: 'Balance', value: '$4,200.00' },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
