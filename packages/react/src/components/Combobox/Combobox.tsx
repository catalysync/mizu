import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from '../../utils/cn';
import { useFieldContext } from '../Field/field-context';

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
    const searchRef = React.useRef<HTMLInputElement>(null);

    const selected = React.useMemo<Set<string>>(() => {
      if (!valueProp) return new Set();
      return new Set(Array.isArray(valueProp) ? valueProp : [valueProp]);
    }, [valueProp]);

    const filtered = React.useMemo(
      () =>
        search
          ? options.filter(
              (o) =>
                o.label.toLowerCase().includes(search.toLowerCase()) ||
                o.description?.toLowerCase().includes(search.toLowerCase()),
            )
          : options,
      [options, search],
    );

    const toggle = (optValue: string) => {
      if (!onValueChange) return;
      if (multiple) {
        const next = new Set(selected);
        if (next.has(optValue)) next.delete(optValue);
        else next.add(optValue);
        onValueChange(Array.from(next));
      } else {
        onValueChange(optValue);
        setOpen(false);
      }
    };

    const removePill = (optValue: string) => {
      if (!onValueChange || !multiple) return;
      const next = new Set(selected);
      next.delete(optValue);
      onValueChange(Array.from(next));
    };

    const displayValue = React.useMemo(() => {
      if (selected.size === 0) return null;
      if (!multiple) {
        const opt = options.find((o) => selected.has(o.value));
        return opt?.label ?? null;
      }
      return null;
    }, [selected, multiple, options]);

    return (
      <div
        ref={ref}
        className={cn('mizu-combobox', className)}
        data-component="mizu-combobox"
        {...props}
      >
        <Popover.Root
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setSearch('');
          }}
        >
          <Popover.Trigger asChild>
            <button
              type="button"
              id={resolvedId}
              className="mizu-combobox__trigger"
              disabled={resolvedDisabled}
              data-required={resolvedRequired || undefined}
              data-invalid={resolvedInvalid || undefined}
              aria-describedby={resolvedDescribedBy}
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              {multiple && selected.size > 0 ? (
                <>
                  {Array.from(selected).map((v) => {
                    const opt = options.find((o) => o.value === v);
                    return (
                      <span key={v} className="mizu-combobox__pill">
                        {opt?.label ?? v}
                        <button
                          type="button"
                          className="mizu-combobox__pill-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePill(v);
                          }}
                          aria-label={`Remove ${opt?.label ?? v}`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </>
              ) : displayValue ? (
                <span>{displayValue}</span>
              ) : (
                <span className="mizu-combobox__placeholder">{placeholder}</span>
              )}
              <span className="mizu-combobox__chevron" aria-hidden="true">
                ▾
              </span>
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="mizu-combobox__content"
              sideOffset={4}
              align="start"
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                searchRef.current?.focus();
              }}
            >
              {searchable ? (
                <div className="mizu-combobox__search">
                  <input
                    ref={searchRef}
                    type="text"
                    className="mizu-combobox__search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    aria-label="Filter options"
                  />
                </div>
              ) : null}
              <div role="listbox" aria-multiselectable={multiple || undefined}>
                {filtered.length === 0 ? (
                  <div className="mizu-combobox__empty">{emptyMessage}</div>
                ) : (
                  filtered.map((opt) => {
                    const isSelected = selected.has(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        className="mizu-combobox__option"
                        data-selected={isSelected || undefined}
                        aria-selected={isSelected}
                        disabled={opt.disabled}
                        onClick={() => toggle(opt.value)}
                      >
                        <span className="mizu-combobox__option-check">{isSelected ? '✓' : ''}</span>
                        <span>
                          <span className="mizu-combobox__option-label">{opt.label}</span>
                          {opt.description ? (
                            <span className="mizu-combobox__option-description">
                              {opt.description}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    );
  },
);
Combobox.displayName = 'Combobox';
