import * as Popover from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';
import { ComboboxInput, ComboboxListbox } from './combobox-core';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  options: ComboboxOption[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      className,
      options,
      value: valueProp,
      onValueChange,
      multiple = false,
      searchable = true,
      placeholder = 'Select…',
      emptyMessage = 'No options found.',
      searchPlaceholder = 'Search…',
      disabled: disabledProp,
      required: requiredProp,
      id: idProp,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
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

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    // cmdk keeps its highlight across open/close; clearing it on close makes the first option
    // active again on the next open.
    const [active, setActive] = React.useState('');
    const [listId, setListId] = React.useState<string>();
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useCallback((el: HTMLDivElement | null) => setListId(el?.id), []);

    const setOpenState = (next: boolean) => {
      setOpen(next);
      if (!next) {
        setSearch('');
        setActive('');
      }
    };

    const selected = React.useMemo<Set<string>>(() => {
      if (!valueProp) return new Set();
      return new Set(Array.isArray(valueProp) ? valueProp : [valueProp]);
    }, [valueProp]);

    const filtered = React.useMemo(() => {
      if (!search) return options;
      const query = search.toLowerCase();
      return options.filter(
        (o) =>
          o.label.toLowerCase().includes(query) || o.description?.toLowerCase().includes(query),
      );
    }, [options, search]);

    const toggle = (optValue: string) => {
      if (!onValueChange) return;
      if (multiple) {
        const next = new Set(selected);
        if (next.has(optValue)) next.delete(optValue);
        else next.add(optValue);
        onValueChange(Array.from(next));
      } else {
        onValueChange(optValue);
        setOpenState(false);
      }
    };

    const removePill = (optValue: string) => {
      if (!onValueChange || !multiple) return;
      const next = new Set(selected);
      next.delete(optValue);
      onValueChange(Array.from(next));
    };

    const displayValue = React.useMemo(() => {
      if (selected.size === 0 || multiple) return null;
      const opt = options.find((o) => selected.has(o.value));
      return opt?.label ?? null;
    }, [selected, multiple, options]);

    const hasSelection = selected.size > 0;
    const inputValue = open && searchable ? search : (displayValue ?? '');

    return (
      <CommandPrimitive
        ref={ref}
        shouldFilter={false}
        loop
        value={active}
        onValueChange={setActive}
        className={cn('mizu-combobox', className)}
        data-component="mizu-combobox"
        {...props}
      >
        <Popover.Root open={open} onOpenChange={setOpenState}>
          <Popover.Anchor asChild>
            <div
              ref={anchorRef}
              className="mizu-combobox__control"
              data-required={resolvedRequired || undefined}
              data-invalid={resolvedInvalid || undefined}
              data-disabled={resolvedDisabled || undefined}
            >
              {multiple
                ? Array.from(selected).map((v) => {
                    const opt = options.find((o) => o.value === v);
                    return (
                      <span key={v} className="mizu-combobox__pill">
                        {opt?.label ?? v}
                        <button
                          type="button"
                          className="mizu-combobox__pill-remove"
                          disabled={resolvedDisabled}
                          onClick={() => removePill(v)}
                          // cmdk's root turns Enter into "select highlighted option" and would
                          // swallow the native click, so keep Enter on the button.
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.stopPropagation();
                          }}
                          aria-label={`Remove ${opt?.label ?? v}`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })
                : null}
              <ComboboxInput
                ref={inputRef}
                id={resolvedId}
                className="mizu-combobox__input"
                listId={listId}
                open={open}
                value={inputValue}
                readOnly={!searchable}
                disabled={resolvedDisabled}
                aria-required={resolvedRequired || undefined}
                aria-invalid={resolvedInvalid || undefined}
                aria-describedby={resolvedDescribedBy}
                placeholder={
                  open && searchable ? searchPlaceholder : hasSelection ? undefined : placeholder
                }
                onClick={() => {
                  if (!resolvedDisabled) setOpen(true);
                }}
                onChange={(e) => {
                  if (!searchable) return;
                  setSearch(e.target.value);
                  setOpen(true);
                }}
                onKeyDown={(e) => {
                  if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) setOpen(true);
                }}
              />
              <span className="mizu-combobox__chevron" aria-hidden="true">
                ▾
              </span>
            </div>
          </Popover.Anchor>
          <ComboboxListbox
            block="mizu-combobox"
            anchorRef={anchorRef}
            listRef={listRef}
            multiple={multiple}
            emptyMessage={emptyMessage}
          >
            {filtered.map((opt) => {
              const isSelected = selected.has(opt.value);
              return (
                <CommandPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  onSelect={() => toggle(opt.value)}
                  className="mizu-combobox__option"
                  aria-checked={isSelected}
                >
                  <span className="mizu-combobox__option-check" aria-hidden="true">
                    {isSelected ? '✓' : ''}
                  </span>
                  <span>
                    <span className="mizu-combobox__option-label">{opt.label}</span>
                    {opt.description ? (
                      <span className="mizu-combobox__option-description">{opt.description}</span>
                    ) : null}
                  </span>
                </CommandPrimitive.Item>
              );
            })}
          </ComboboxListbox>
        </Popover.Root>
      </CommandPrimitive>
    );
  },
);
Combobox.displayName = 'Combobox';
