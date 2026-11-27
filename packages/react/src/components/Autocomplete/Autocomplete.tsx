import * as Popover from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';
import { cn } from '../../utils/cn';
import type { ComboboxOption } from '../Combobox/Combobox';
import { ComboboxInput, ComboboxListbox } from '../Combobox/combobox-core';
import { useFieldContext } from '../Field/field-context';

export interface AutocompleteProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'onSelect' | 'type' | 'role'
> {
  options: ComboboxOption[];
  /** Free text in the input. Controlled when provided. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called when the user picks a suggestion (Enter on the highlighted one, or click). */
  onOptionSelect?: (option: ComboboxOption) => void;
  emptyMessage?: string;
}

export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      className,
      options,
      value: valueProp,
      defaultValue = '',
      onValueChange,
      onOptionSelect,
      emptyMessage = 'No matches.',
      disabled: disabledProp,
      required: requiredProp,
      id: idProp,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      onKeyDown,
      onClick,
      ...props
    },
    ref,
  ) => {
    const ctx = useFieldContext();
    const resolvedId = idProp ?? ctx?.controlId;
    const resolvedDisabled = disabledProp ?? ctx?.disabled ?? false;
    const resolvedRequired = requiredProp ?? ctx?.required ?? false;
    const resolvedInvalid = ariaInvalidProp ?? (ctx?.invalid || undefined);
    const resolvedDescribedBy =
      [ctx?.descriptionId, ctx?.errorId, ariaDescribedByProp].filter(Boolean).join(' ') ||
      undefined;

    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const text = valueProp ?? uncontrolled;
    const setText = (next: string) => {
      if (valueProp === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState('');
    const [listId, setListId] = React.useState<string>();
    const anchorRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useCallback((el: HTMLDivElement | null) => setListId(el?.id), []);

    const setOpenState = (next: boolean) => {
      setOpen(next);
      if (!next) setActive('');
    };

    const filtered = React.useMemo(() => {
      const query = text.trim().toLowerCase();
      if (!query) return options;
      return options.filter(
        (o) =>
          o.label.toLowerCase().includes(query) || o.description?.toLowerCase().includes(query),
      );
    }, [options, text]);

    const choose = (opt: ComboboxOption) => {
      setText(opt.label);
      onOptionSelect?.(opt);
      setOpenState(false);
    };

    return (
      <CommandPrimitive
        shouldFilter={false}
        loop
        value={active}
        onValueChange={setActive}
        className="mizu-autocomplete"
        data-component="mizu-autocomplete"
      >
        <Popover.Root open={open} onOpenChange={setOpenState}>
          <Popover.Anchor asChild>
            <ComboboxInput
              ref={(node: HTMLInputElement | null) => {
                anchorRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) ref.current = node;
              }}
              id={resolvedId}
              className={cn('mizu-autocomplete__input', className)}
              listId={listId}
              open={open}
              value={text}
              disabled={resolvedDisabled}
              aria-required={resolvedRequired || undefined}
              aria-invalid={resolvedInvalid || undefined}
              aria-describedby={resolvedDescribedBy}
              data-required={resolvedRequired || undefined}
              data-invalid={resolvedInvalid || undefined}
              onChange={(e) => {
                setText(e.target.value);
                setOpen(true);
              }}
              onClick={(e) => {
                onClick?.(e);
                if (!resolvedDisabled) setOpen(true);
              }}
              onKeyDown={(e) => {
                onKeyDown?.(e);
                if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) setOpen(true);
              }}
              {...props}
            />
          </Popover.Anchor>
          <ComboboxListbox
            block="mizu-autocomplete"
            anchorRef={anchorRef}
            listRef={listRef}
            emptyMessage={emptyMessage}
          >
            {filtered.map((opt) => (
              <CommandPrimitive.Item
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                onSelect={() => choose(opt)}
                className="mizu-autocomplete__option"
              >
                <span className="mizu-autocomplete__option-label">{opt.label}</span>
                {opt.description ? (
                  <span className="mizu-autocomplete__option-description">{opt.description}</span>
                ) : null}
              </CommandPrimitive.Item>
            ))}
          </ComboboxListbox>
        </Popover.Root>
      </CommandPrimitive>
    );
  },
);
Autocomplete.displayName = 'Autocomplete';
