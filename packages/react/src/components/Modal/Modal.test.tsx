import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
} from './Modal';

function TestModal() {
  return (
    <Modal>
      <ModalTrigger>Open</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Test title</ModalTitle>
          <ModalDescription>Test description</ModalDescription>
        </ModalHeader>
      </ModalContent>
    </Modal>
  );
}

describe('Modal', () => {
  it('opens when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<TestModal />);
    await user.click(screen.getByText('Open'));
    expect(screen.getByText('Test title')).toBeInTheDocument();
  });

  it('has no a11y violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestModal />);
    await user.click(screen.getByText('Open'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
