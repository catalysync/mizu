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

  it('applies the variant and size classes, defaulting to underline and md', () => {
    const { container, rerender } = render(<Harness />);
    const root = container.querySelector('[data-component="mizu-tabs"]');
    expect(root).toHaveClass('mizu-tabs--underline', 'mizu-tabs--md');
    rerender(
      <Tabs defaultValue="a" variant="segmented" size="lg">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(container.querySelector('[data-component="mizu-tabs"]')).toHaveClass(
      'mizu-tabs--segmented',
      'mizu-tabs--lg',
    );
    expect(container.querySelector('[data-component="mizu-tabs"]')).not.toHaveClass(
      'mizu-tabs--underline',
    );
  });

  it('skips disabled tabs when moving with the arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b" disabled>
            Tab B
          </TabsTrigger>
          <TabsTrigger value="c">Tab C</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    await user.click(screen.getByRole('tab', { name: 'Tab A' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tab C' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Tab B' })).toBeDisabled();
  });

  it('moves between tabs with ArrowDown and ArrowUp when vertical', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a" orientation="vertical">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
          <TabsTrigger value="c">Tab C</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Body A</TabsContent>
        <TabsContent value="b">Body B</TabsContent>
        <TabsContent value="c">Body C</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    await user.click(screen.getByRole('tab', { name: 'Tab A' }));
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Tab C' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Body B');
  });

  it('ignores ArrowLeft and ArrowRight when vertical', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a" orientation="vertical">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Body A</TabsContent>
        <TabsContent value="b">Body B</TabsContent>
      </Tabs>,
    );
    await user.click(screen.getByRole('tab', { name: 'Tab A' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus();
  });

  it('has no axe violations when vertical', async () => {
    const { container } = render(
      <Tabs defaultValue="a" orientation="vertical" variant="segmented">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b" disabled>
            Tab B
          </TabsTrigger>
        </TabsList>
        <TabsContent value="a">Body A</TabsContent>
      </Tabs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
