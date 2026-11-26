import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Rows shown when the field is empty. Overrides `rows`. */
  minRows?: number;
  /** Stop growing after this many rows and scroll instead. */
  maxRows?: number;
  /** Grow the height with the content instead of showing a fixed box. */
  autoResize?: boolean;
}

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/**
 * Sets the inline height to fit the content, between `rows` (minRows) and `maxRows`. Measuring
 * the element is more reliable than guessing from `line-height`, which is often `normal`.
 */
function fitHeight(el: HTMLTextAreaElement, maxRows: number | undefined) {
  el.style.height = 'auto';
  const cs = getComputedStyle(el);
  const px = (v: string) => parseFloat(v) || 0;
  const paddingY = px(cs.paddingTop) + px(cs.paddingBottom);
  const borderY = px(cs.borderTopWidth) + px(cs.borderBottomWidth);
  const borderBox = cs.boxSizing === 'border-box';

  // scrollHeight includes padding but not border; convert it to the box the inline height sets.
  let height = el.scrollHeight + (borderBox ? borderY : -paddingY);
  let overflowing = false;

  if (maxRows != null) {
    // With `rows` set to maxRows and no inline height, the box is exactly that many lines tall.
    const rows = el.rows;
    el.rows = maxRows;
    el.style.height = 'auto';
    const maxBox = borderBox ? el.offsetHeight : el.offsetHeight - paddingY - borderY;
    el.rows = rows;
    overflowing = height > maxBox;
    height = Math.min(height, maxBox);
  }

  el.style.height = `${Math.max(0, height)}px`;
  el.style.overflowY = overflowing ? 'auto' : 'hidden';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      id,
      required,
      disabled,
      rows,
      minRows,
      maxRows,
      autoResize = false,
      onInput,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref,
  ) => {
    const ctx = useFieldContext();
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const resolvedId = id ?? ctx?.controlId;
    const resolvedRequired = required ?? ctx?.required;
    const resolvedDisabled = disabled ?? ctx?.disabled;
    const resolvedInvalid = ariaInvalidProp ?? (ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    // A controlled value can change without an input event, so fit after every render. The input
    // handler below covers typing; this covers resets and programmatic updates.
    useIsomorphicLayoutEffect(() => {
      const el = innerRef.current;
      if (!autoResize || !el) return;
      fitHeight(el, maxRows);
    });

    // Width changes re-wrap lines, so the height has to follow even when the text is unchanged.
    React.useEffect(() => {
      const el = innerRef.current;
      if (!autoResize || !el || typeof ResizeObserver === 'undefined') return;
      let lastWidth = el.clientWidth;
      const observer = new ResizeObserver(() => {
        if (el.clientWidth === lastWidth) return;
        lastWidth = el.clientWidth;
        fitHeight(el, maxRows);
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, [autoResize, maxRows]);

    return (
      <textarea
        ref={innerRef}
        id={resolvedId}
        required={resolvedRequired}
        disabled={resolvedDisabled}
        rows={minRows ?? rows}
        aria-invalid={resolvedInvalid}
        aria-describedby={resolvedDescribedBy}
        data-component="mizu-textarea"
        data-auto-resize={autoResize || undefined}
        onInput={(event) => {
          if (autoResize && innerRef.current) fitHeight(innerRef.current, maxRows);
          onInput?.(event);
        }}
        className={cn('mizu-textarea', className)}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
