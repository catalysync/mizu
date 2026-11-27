import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Field } from '../Field';
import { Textarea } from './Textarea';

// jsdom has no layout, so the auto-resize tests stub what the component measures: scrollHeight for
// the content and offsetHeight for the box at maxRows.
function stubLayout(scrollHeight: number, maxBoxHeight = 0) {
  const real = window.getComputedStyle;
  vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
    const style = real(el);
    return new Proxy(style, {
      get(target, prop) {
        if (prop === 'paddingTop' || prop === 'paddingBottom') return '4px';
        if (prop === 'boxSizing') return 'border-box';
        const v = Reflect.get(target, prop);
        return typeof v === 'function' ? v.bind(target) : v;
      },
    });
  });
  Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  });
  Object.defineProperty(HTMLTextAreaElement.prototype, 'offsetHeight', {
    configurable: true,
    get: () => maxBoxHeight,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  // @ts-expect-error - remove the stubs so other tests see jsdom's defaults
  delete HTMLTextAreaElement.prototype.scrollHeight;
  // @ts-expect-error - same
  delete HTMLTextAreaElement.prototype.offsetHeight;
});

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea aria-label="Notes" />);
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('renders with a placeholder', () => {
    render(<Textarea placeholder="Enter notes" aria-label="Notes" />);
    expect(screen.getByPlaceholderText('Enter notes')).toBeInTheDocument();
  });

  it('renders a controlled value', () => {
    render(<Textarea value="Hello" onChange={() => {}} aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
  });

  it('renders a defaultValue', () => {
    render(<Textarea defaultValue="Default" aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveValue('Default');
  });

  it('applies the mizu-textarea class', () => {
    render(<Textarea aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveClass('mizu-textarea');
  });

  it('sets rows attribute', () => {
    render(<Textarea rows={5} aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('sets disabled', () => {
    render(<Textarea disabled aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets required', () => {
    render(<Textarea required aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('fires onChange', async () => {
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} aria-label="Notes" />);
    await userEvent.setup().type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('fires onBlur', () => {
    const onBlur = vi.fn();
    render(<Textarea onBlur={onBlur} aria-label="Notes" />);
    fireEvent.blur(screen.getByRole('textbox'));
    expect(onBlur).toHaveBeenCalledOnce();
  });

  it('merges custom className', () => {
    render(<Textarea className="custom" aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Notes" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('reads required + disabled from Field context', () => {
    render(
      <Field label="Notes" required disabled>
        <Textarea />
      </Field>,
    );
    const ta = screen.getByLabelText(/Notes/);
    expect(ta).toBeRequired();
    expect(ta).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Textarea aria-label="Notes" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations (disabled)', async () => {
    const { container } = render(<Textarea aria-label="Notes" disabled />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses minRows as the initial row count', () => {
    render(<Textarea minRows={4} rows={2} aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
  });

  it('marks the element when autoResize is on', () => {
    render(<Textarea autoResize aria-label="Notes" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-auto-resize', 'true');
  });

  it('grows to the content height when autoResize is on', () => {
    stubLayout(200 + 8, 600); // ten lines of content plus 4px top and bottom padding
    render(<Textarea autoResize aria-label="Notes" defaultValue="x" />);
    const el = screen.getByRole('textbox');
    expect(el).toHaveStyle({ height: '208px', overflowY: 'hidden' });
  });

  it('stops at maxRows and scrolls the rest', () => {
    stubLayout(600 + 8, 108); // thirty lines of content; five lines plus padding is 108px
    render(<Textarea autoResize maxRows={5} aria-label="Notes" defaultValue="x" />);
    const el = screen.getByRole('textbox');
    expect(el).toHaveStyle({ height: '108px', overflowY: 'auto' });
  });

  it('does not set an inline height without autoResize', () => {
    stubLayout(400);
    render(<Textarea aria-label="Notes" defaultValue="x" />);
    expect(screen.getByRole('textbox').getAttribute('style') ?? '').not.toMatch(/height/);
  });

  it('has no axe violations with autoResize', async () => {
    const { container } = render(<Textarea autoResize aria-label="Notes" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('clears the inline height when autoResize is turned off', () => {
    stubLayout(200 + 8, 600);
    const { rerender } = render(<Textarea autoResize aria-label="Notes" defaultValue="x" />);
    expect(screen.getByRole('textbox')).toHaveStyle({ height: '208px' });
    rerender(<Textarea aria-label="Notes" defaultValue="x" />);
    expect(screen.getByRole('textbox').getAttribute('style') ?? '').not.toMatch(/height/);
  });
});
