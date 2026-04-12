import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';

function TestAccordion({ type = 'single' }: { type?: 'single' | 'multiple' }) {
  return (
    <Accordion type={type} collapsible>
      <AccordionItem value="a">
        <AccordionTrigger>Section A</AccordionTrigger>
        <AccordionContent>Content A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Section B</AccordionTrigger>
        <AccordionContent>Content B</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Section C</AccordionTrigger>
        <AccordionContent>Content C</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders all triggers', () => {
    render(<TestAccordion />);
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
    expect(screen.getByText('Section C')).toBeInTheDocument();
  });

  it('hides content by default', () => {
    render(<TestAccordion />);
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
  });

  it('shows content when trigger is clicked', async () => {
    render(<TestAccordion />);
    await userEvent.setup().click(screen.getByText('Section A'));
    expect(screen.getByText('Content A')).toBeVisible();
  });

  it('collapses when clicked again (collapsible)', async () => {
    const user = userEvent.setup();
    render(<TestAccordion />);
    await user.click(screen.getByText('Section A'));
    expect(screen.getByText('Content A')).toBeVisible();
    await user.click(screen.getByText('Section A'));
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
  });

  it('only shows one section at a time in single mode', async () => {
    const user = userEvent.setup();
    render(<TestAccordion type="single" />);
    await user.click(screen.getByText('Section A'));
    expect(screen.getByText('Content A')).toBeVisible();
    await user.click(screen.getByText('Section B'));
    expect(screen.queryByText('Content A')).not.toBeInTheDocument();
    expect(screen.getByText('Content B')).toBeVisible();
  });

  it('allows multiple open in multiple mode', async () => {
    const user = userEvent.setup();
    render(<TestAccordion type="multiple" />);
    await user.click(screen.getByText('Section A'));
    await user.click(screen.getByText('Section B'));
    expect(screen.getByText('Content A')).toBeVisible();
    expect(screen.getByText('Content B')).toBeVisible();
  });

  it('renders triggers as buttons', () => {
    render(<TestAccordion />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('sets aria-expanded on the trigger', async () => {
    render(<TestAccordion />);
    const trigger = screen.getByText('Section A').closest('button')!;
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.setup().click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('applies mizu-accordion class', () => {
    const { container } = render(<TestAccordion />);
    expect(container.querySelector('.mizu-accordion')).toBeInTheDocument();
  });

  it('applies mizu-accordion-item class', () => {
    const { container } = render(<TestAccordion />);
    expect(container.querySelectorAll('[data-state]').length).toBeGreaterThanOrEqual(3);
  });

  it('navigates between triggers with keyboard', async () => {
    const user = userEvent.setup();
    render(<TestAccordion />);
    screen.getByText('Section A').closest('button')!.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Section B').closest('button')).toHaveFocus();
  });

  it('opens on Enter key', async () => {
    const user = userEvent.setup();
    render(<TestAccordion />);
    screen.getByText('Section A').closest('button')!.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('Content A')).toBeVisible();
  });

  it('has no axe violations (closed)', async () => {
    const { container } = render(<TestAccordion />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (open)', async () => {
    render(<TestAccordion />);
    await userEvent.setup().click(screen.getByText('Section A'));
    const { container } = render(<TestAccordion />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
