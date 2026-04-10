import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from './Modal';

function TestModal({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Modal onOpenChange={onOpenChange}>
      <ModalTrigger>Open</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Test title</ModalTitle>
          <ModalDescription>Test description</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose>Cancel</ModalClose>
        </ModalFooter>
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

  it('renders dialog role with title and description', async () => {
    const user = userEvent.setup();
    render(<TestModal />);
    await user.click(screen.getByText('Open'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('closes on escape key', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<TestModal onOpenChange={onOpenChange} />);
    await user.click(screen.getByText('Open'));
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes when close button is clicked', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<TestModal onOpenChange={onOpenChange} />);
    await user.click(screen.getByText('Open'));
    await user.click(screen.getByText('Cancel'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('forwards ref to content', async () => {
    const ref = { current: null as HTMLDivElement | null };
    const user = userEvent.setup();
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent ref={ref}>
          <ModalTitle>Ref test</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    await user.click(screen.getByText('Open'));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no a11y violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(<TestModal />);
    await user.click(screen.getByText('Open'));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
