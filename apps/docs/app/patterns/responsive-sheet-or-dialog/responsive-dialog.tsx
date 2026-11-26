'use client';

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
import { useState, type ReactNode } from 'react';

// Media queries cannot read CSS custom properties, so the breakpoint is a literal.
const NARROW_QUERY = '(max-width: 640px)';

export interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Element that opens the dialog. Rendered as a Radix trigger so focus returns to it on close. */
  trigger?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  children,
  footer,
}: ResponsiveDialogProps) {
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

export function ResponsiveDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Edit profile"
      description="Changes apply to your account immediately."
      trigger={<Button variant="primary">Edit profile</Button>}
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
      <p>
        Narrow the window below 640px to see this render as a bottom sheet. It stays open while you
        resize.
      </p>
    </ResponsiveDialog>
  );
}
