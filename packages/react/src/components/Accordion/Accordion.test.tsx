import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';

describe('Accordion', () => {
  const renderAccordion = () =>
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

  it('renders trigger buttons', () => {
    renderAccordion();
    expect(screen.getByRole('button', { name: 'Section 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Section 2' })).toBeInTheDocument();
  });

  it('expands content on trigger click', async () => {
    renderAccordion();
    const trigger = screen.getByRole('button', { name: 'Section 1' });
    await userEvent.click(trigger);
    expect(screen.getByText('Content 1')).toBeVisible();
  });

  it('has no a11y violations', async () => {
    const { container } = renderAccordion();
    expect(await axe(container)).toHaveNoViolations();
  });
});
