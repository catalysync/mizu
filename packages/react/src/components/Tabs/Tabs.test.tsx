import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

function Harness() {
  return (
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
        <TabsTrigger value="c">Tab C</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Body A</TabsContent>
      <TabsContent value="b">Body B</TabsContent>
      <TabsContent value="c">Body C</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders the default tab content', () => {
    render(<Harness />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Body A');
  });

  it('switches content when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Body B');
  });

  it('marks the active tab with aria-selected', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: 'Tab C' }));
    expect(screen.getByRole('tab', { name: 'Tab C' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
