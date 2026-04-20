import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/Disclosure/Accordion',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible style={{ maxWidth: 480 }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is mizu?</AccordionTrigger>
        <AccordionContent>
          A code-first, framework-agnostic design system with tokens, CSS, React bindings, and a
          Tailwind v4 bridge.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I install it?</AccordionTrigger>
        <AccordionContent>
          Install the packages with <code>pnpm add @aspect/tokens @aspect/css @aspect/react</code>{' '}
          and import the CSS in your entry file.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Does it support dark mode?</AccordionTrigger>
        <AccordionContent>
          Yes. Add <code>data-theme=&quot;dark&quot;</code> to your root element and the token
          cascade handles the rest.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" style={{ maxWidth: 480 }}>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing</AccordionTrigger>
        <AccordionContent>Manage your subscription and payment methods.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="team">
        <AccordionTrigger>Team</AccordionTrigger>
        <AccordionContent>Invite members and manage roles.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="integrations">
        <AccordionTrigger>Integrations</AccordionTrigger>
        <AccordionContent>Connect third-party services to your workspace.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
