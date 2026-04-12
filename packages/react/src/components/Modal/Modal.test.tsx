import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalTrigger,
  ModalClose,
} from './Modal';

function TestModal({ size, open = true }: { size?: string; open?: boolean }) {
  return (
    <Modal open={open}>
      <ModalContent size={size as any}>
        <ModalHeader>
          <ModalTitle>Test title</ModalTitle>
          <ModalDescription>Test description</ModalDescription>
        </ModalHeader>
        <ModalBody>Body content</ModalBody>
        <ModalFooter>
          <ModalClose>Close</ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

describe('Modal', () => {
  it('renders the title', () => {
    render(<TestModal />);
    expect(screen.getByText('Test title')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<TestModal />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders body content', () => {
    render(<TestModal />);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<TestModal />);
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('renders the overlay', () => {
    render(<TestModal />);
    expect(document.querySelector('.mizu-dialog__overlay')).toBeInTheDocument();
  });

  it('renders a close button', () => {
    render(<TestModal />);
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('applies the md size by default', () => {
    render(<TestModal />);
    expect(document.querySelector('.mizu-dialog__content')).toHaveAttribute('data-size', 'md');
  });

  it('applies the sm size', () => {
    render(<TestModal size="sm" />);
    expect(document.querySelector('.mizu-dialog__content')).toHaveAttribute('data-size', 'sm');
  });

  it('applies the lg size', () => {
    render(<TestModal size="lg" />);
    expect(document.querySelector('.mizu-dialog__content')).toHaveAttribute('data-size', 'lg');
  });

  it('applies the xl size', () => {
    render(<TestModal size="xl" />);
    expect(document.querySelector('.mizu-dialog__content')).toHaveAttribute('data-size', 'xl');
  });

  it('applies the fullscreen size', () => {
    render(<TestModal size="fullscreen" />);
    expect(document.querySelector('.mizu-dialog__content')).toHaveAttribute(
      'data-size',
      'fullscreen',
    );
  });

  it('does not render content when closed', () => {
    render(<TestModal open={false} />);
    expect(screen.queryByText('Test title')).not.toBeInTheDocument();
  });

  it('renders with a trigger', () => {
    render(
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent>
          <ModalBody>Content</ModalBody>
        </ModalContent>
      </Modal>,
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('has header with mizu-dialog__header class', () => {
    render(<TestModal />);
    expect(document.querySelector('.mizu-dialog__header')).toBeInTheDocument();
  });

  it('has body with mizu-dialog__body class', () => {
    render(<TestModal />);
    expect(document.querySelector('.mizu-dialog__body')).toBeInTheDocument();
  });

  it('has footer with mizu-dialog__footer class', () => {
    render(<TestModal />);
    expect(document.querySelector('.mizu-dialog__footer')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    render(<TestModal />);
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('has no axe violations in sm size', async () => {
    render(<TestModal size="sm" />);
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('has no axe violations in fullscreen', async () => {
    render(<TestModal size="fullscreen" />);
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
