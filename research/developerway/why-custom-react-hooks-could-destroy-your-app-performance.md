---
title: "Why Custom React Hooks Could Destroy Your App Performance"
url: https://www.developerway.com/posts/why-custom-react-hooks-could-destroy-your-app-performance
date: 2022-01-24
slug: why-custom-react-hooks-could-destroy-your-app-performance
---

# Why Custom React Hooks Could Destroy Your App Performance

**Published:** 24-01-2022 | **Author:** Nadia Makarevich

## Introduction

Custom React hooks can become significant performance liabilities in applications requiring high responsiveness. While hooks enable elegant abstractions, they can inadvertently lift state management to inappropriate levels in the component hierarchy, causing widespread re-renders throughout an application.

## Building a Modal Dialog with Custom Hooks

### The Allure of Hooks-Based Implementation

The article demonstrates how a hook-based modal dialog appears perfect initially:

```tsx
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const Dialog = () => (
    <ModalBase onClosed={close} isOpen={isOpen} />
  );

  return { isOpen, Dialog, open, close };
};
```

The consumer code becomes minimal and elegant:

```tsx
const ConsumerComponent = () => {
  const { Dialog, open } = useModal();

  return (
    <>
      <button onClick={open}>Click me</button>
      <Dialog />
    </>
  );
};
```

## The Hidden Performance Problem

### State Lifting Issue

When integrating `useModal` into a complex, slow page component, a critical issue emerges. The hook's state changes trigger re-renders of the entire host component, regardless of whether that state affects other parts of the render tree.

The author states: "every state change in a hook will cause the 'host' component to re-render, regardless of whether this state is returned in the hook value and memoised or not."

### Why Memoization Fails

Attempting to fix the problem through memoization proves ineffective:

```tsx
return useMemo(
  () => ({
    isOpen,
    Dialog,
    open,
    close,
  }),
  [isOpen, Dialog],
);
```

This pattern fails because "it doesn't really matter, whether the state change in hooks is 'internal' or not."

## Solutions and Best Practices

### Moving State Downward

The primary solution involves extracting the hook to a smaller, dedicated component:

```tsx
const SettingsButton = () => {
  const { Dialog, open } = useModal();

  return (
    <>
      <button onClick={open}>Open settings</button>
      <Dialog />
    </>
  );
};
```

This isolates state changes to a component that won't impact the larger, slower parent.

### Handling Additional Functionality

When adding scroll tracking to modal content, maintaining performance requires extracting analytics into a separate component:

```tsx
const ModalBaseWithAnalytics = (props: ModalProps) => {
  const ref = useRef<HTMLElement>(null);
  const scroll = useScroll(ref);

  return <ModalBase {...props} ref={ref} />;
};
```

## Key Rules for Performant Hooks

1. **Every state change in a hook triggers host component re-renders**, regardless of whether that state affects the return value or gets memoized

2. **Chained hooks propagate state changes upstream** through the chain until reaching the host component, which then triggers downstream re-renders, "regardless of any memoisation applied in between"

3. When using custom hooks, ensure encapsulated state doesn't operate at inappropriate component hierarchy levels—move it "down" to smaller components when necessary

4. Never implement independent state operations in hooks that aren't exposed in return values

5. Ensure all hooks used within a hook follow the same performance principles

## Conclusion

Custom hooks provide excellent abstraction capabilities but require careful architectural consideration. The primary challenge involves preventing unintended state elevation that causes unnecessary re-renders throughout applications. Strategic component composition and deliberate state placement prove more effective than memoization for managing hook-related performance issues.
