import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from './Modal';

function TestModal({ size, open = true }: { size?: string; open?: boolean }) {
  return (
    <Modal open={open}>
      <ModalContent size={size as 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'}>
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

describe('ModalContent overlay props', () => {
  it('applies overlayClassName and overlayProps to the scrim', () => {
    render(
      <Modal open>
        <ModalContent
          overlayClassName="brand-scrim"
          overlayProps={{ id: 'scrim', className: 'extra-scrim' }}
        >
          <ModalBody>Body</ModalBody>
        </ModalContent>
      </Modal>,
    );
    const overlay = document.getElementById('scrim');
    expect(overlay).toHaveClass('mizu-dialog__overlay', 'brand-scrim', 'extra-scrim');
  });

  it('keeps the default scrim class when no overlay props are passed', () => {
    render(<TestModal />);
    expect(document.querySelector('.mizu-dialog__overlay')).toHaveClass('mizu-dialog__overlay');
  });
});

describe('ModalContent closeButton', () => {
  it('renders no close icon when closeButton is false', () => {
    render(
      <Modal open>
        <ModalContent closeButton={false}>
          <ModalTitle>Only title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
    expect(document.querySelector('.mizu-dialog__close')).toBeNull();
  });

  it('renders the close icon by default', () => {
    render(
      <Modal open>
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('has no axe violations without the close icon', async () => {
    render(
      <Modal open>
        <ModalContent closeButton={false}>
          <ModalTitle>Only title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(await axe(document.body)).toHaveNoViolations();
  });
});

describe('ModalContent dismissable', () => {
  it('closes on Escape by default', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('ignores Escape when dismissable is false', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalContent dismissable={false}>
          <ModalTitle>Title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('ignores outside pointer presses when dismissable is false', async () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalContent dismissable={false}>
          <ModalTitle>Title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    // Radix registers its outside-press listener after mount; let it attach first.
    await new Promise((resolve) => setTimeout(resolve, 0));
    fireEvent.pointerDown(document.body);
    fireEvent.mouseDown(document.body);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closes on outside pointer presses by default', async () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalTitle>Title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    fireEvent.pointerDown(document.body);
    fireEvent.mouseDown(document.body);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('still closes through the close icon when dismissable is false', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalContent dismissable={false}>
          <ModalTitle>Title</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
