import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody } from './Sheet';

function TestSheet({ side = 'right', open = true }: { side?: string; open?: boolean }) {
  return (
    <Sheet open={open}>
      <SheetContent side={side as 'left' | 'right' | 'top' | 'bottom'}>
        <SheetHeader>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>Sheet description</SheetDescription>
        </SheetHeader>
        <SheetBody>Body content</SheetBody>
      </SheetContent>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('renders title when open', () => {
    render(<TestSheet />);
    expect(screen.getByText('Sheet title')).toBeInTheDocument();
  });

  it('renders description when open', () => {
    render(<TestSheet />);
    expect(screen.getByText('Sheet description')).toBeInTheDocument();
  });

  it('renders body content', () => {
    render(<TestSheet />);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<TestSheet open={false} />);
    expect(screen.queryByText('Sheet title')).not.toBeInTheDocument();
  });

  it('renders overlay', () => {
    render(<TestSheet />);
    expect(document.querySelector('.mizu-sheet__overlay')).toBeInTheDocument();
  });

  it('applies right side by default', () => {
    render(<TestSheet />);
    expect(document.querySelector('.mizu-sheet__content')).toHaveAttribute('data-side', 'right');
  });

  it('applies left side', () => {
    render(<TestSheet side="left" />);
    expect(document.querySelector('.mizu-sheet__content')).toHaveAttribute('data-side', 'left');
  });

  it('applies top side', () => {
    render(<TestSheet side="top" />);
    expect(document.querySelector('.mizu-sheet__content')).toHaveAttribute('data-side', 'top');
  });

  it('applies bottom side', () => {
    render(<TestSheet side="bottom" />);
    expect(document.querySelector('.mizu-sheet__content')).toHaveAttribute('data-side', 'bottom');
  });

  it('renders a close button', () => {
    render(<TestSheet />);
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('renders header with class', () => {
    render(<TestSheet />);
    expect(document.querySelector('.mizu-sheet__header')).toBeInTheDocument();
  });

  it('renders body with class', () => {
    render(<TestSheet />);
    expect(document.querySelector('.mizu-sheet__body')).toBeInTheDocument();
  });

  it('has no axe violations (right)', async () => {
    render(<TestSheet />);
    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('has no axe violations (left)', async () => {
    render(<TestSheet side="left" />);
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
