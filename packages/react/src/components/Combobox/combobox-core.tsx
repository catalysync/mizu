import * as Popover from '@radix-ui/react-popover';
import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import * as React from 'react';

// Shared by Combobox and Autocomplete. cmdk's root owns arrow/Home/End/Enter handling and
// the listbox; the input is ours because cmdk's Command.Input hard-codes aria-expanded=true
// and points aria-labelledby at its own empty label, which would hide the Field label.

export interface ComboboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  listId?: string;
  open: boolean;
}

export const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ listId, open, ...props }, ref) => {
    // cmdk's selectedItemId is computed before the highlighted item has committed
    // aria-selected, so it can lag a render behind. Read the committed DOM after each
    // highlight change instead. Must render inside a cmdk root.
    const highlight = useCommandState((state) => state.value);
    const [activeId, setActiveId] = React.useState<string>();
    React.useEffect(() => {
      if (!open || !listId) {
        setActiveId(undefined);
        return;
      }
      const list = document.getElementById(listId);
      setActiveId(list?.querySelector<HTMLElement>('[cmdk-item][aria-selected="true"]')?.id);
    }, [highlight, open, listId]);

    return (
      <input
        ref={ref}
        type="text"
        role="combobox"
        autoComplete="off"
        spellCheck={false}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? activeId : undefined}
        {...props}
        onKeyDown={(e) => {
          // cmdk turns Home/End into list navigation; in an editable field they move the caret.
          if ((e.key === 'Home' || e.key === 'End') && !props.readOnly) e.stopPropagation();
          // cmdk always preventDefaults Enter. With nothing highlighted there is nothing to
          // select, so let Enter reach the form (implicit submit) instead.
          if (e.key === 'Enter' && (!open || !activeId)) e.stopPropagation();
          props.onKeyDown?.(e);
        }}
      />
    );
  },
);
ComboboxInput.displayName = 'ComboboxInput';

export interface ComboboxListboxProps {
  block: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  listRef: React.Ref<HTMLDivElement>;
  multiple?: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}

export const ComboboxListbox = ({
  block,
  anchorRef,
  listRef,
  multiple,
  emptyMessage,
  children,
}: ComboboxListboxProps) => (
  <Popover.Portal>
    <Popover.Content
      className={`${block}__content`}
      aria-label="Suggestions"
      sideOffset={4}
      align="start"
      // Focus stays in the input; the list is driven through aria-activedescendant.
      onOpenAutoFocus={(e) => e.preventDefault()}
      // Clicks on the input must not dismiss and then immediately reopen the list.
      onInteractOutside={(e) => {
        if (anchorRef.current?.contains(e.target as Node)) e.preventDefault();
      }}
    >
      <CommandPrimitive.List
        ref={listRef}
        className={`${block}__list`}
        aria-multiselectable={multiple || undefined}
      >
        {children}
      </CommandPrimitive.List>
      <CommandPrimitive.Empty className={`${block}__empty`}>{emptyMessage}</CommandPrimitive.Empty>
    </Popover.Content>
  </Popover.Portal>
);
ComboboxListbox.displayName = 'ComboboxListbox';
