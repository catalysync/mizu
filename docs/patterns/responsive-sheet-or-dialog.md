# Responsive sheet or dialog

A recipe, not a component. Show the same content as a centered dialog on wide screens and as a bottom sheet on narrow ones. It is composed from `Modal`, `Sheet` and `useMediaQuery` from `@mizunagara/react`.

The live version is at `/patterns/responsive-sheet-or-dialog` in the docs site. The code is in `apps/docs/app/patterns/responsive-sheet-or-dialog/responsive-dialog.tsx`.

## Code

```tsx
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  useMediaQuery,
} from '@mizunagara/react';

// Media queries cannot read CSS custom properties, so the breakpoint is a literal.
const NARROW_QUERY = '(max-width: 640px)';

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  children,
  footer,
}) {
  const isNarrow = useMediaQuery(NARROW_QUERY);

  // Modal and Sheet are both aliases of Radix Dialog.Root. Sharing one root keeps
  // `open` stable when the viewport crosses the breakpoint; only the content swaps.
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {trigger && <ModalTrigger asChild>{trigger}</ModalTrigger>}
      {isNarrow ? (
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <SheetBody>{children}</SheetBody>
          {/* ModalFooter is the shared footer styling; sheets have no footer part of their own. */}
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </SheetContent>
      ) : (
        <ModalContent size="md">
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {description && <ModalDescription>{description}</ModalDescription>}
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </ModalContent>
      )}
    </Modal>
  );
}
```

## Usage

The caller owns the open state and passes the trigger as a prop, so the trigger sits inside the Radix root and focus returns to it on close:

```tsx
const [open, setOpen] = useState(false);

<ResponsiveDialog
  open={open}
  onOpenChange={setOpen}
  title="Edit profile"
  description="Changes apply to your account immediately."
  trigger={<Button>Edit profile</Button>}
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={() => setOpen(false)}>
        Save
      </Button>
    </>
  }
>
  <p>Form fields go here.</p>
</ResponsiveDialog>;
```

## Choosing the breakpoint

`640px` is a starting point. Pick the width where a centered dialog stops fitting your content, and change `NARROW_QUERY` in one place.

## Guidelines

- Keep the content in one `ResponsiveDialog`. Two copies drift apart.
- Do not render both branches at once or hide one with CSS. Both would mount and fight over focus.
- Do not nest a dialog inside this one.
- Keep the primary action in `footer`. On a sheet it sits at the bottom of the screen.
- Keep the body short. The sheet body scrolls; the footer stays in place.

## Accessibility

- Both branches are Radix dialogs. Focus is trapped while open, Escape closes, and focus returns to the trigger when it is passed as `trigger`.
- `ModalTitle` or `SheetTitle` gives the dialog its accessible name. Always pass `title`.
- If the viewport crosses the breakpoint while open, the content remounts. Focus lands on the first focusable element in the dialog, which may not be the one the user had selected.
