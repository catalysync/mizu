---
title: "Higher-Order Components in React Hooks era"
url: https://www.developerway.com/posts/higher-order-components-in-react-hooks-era
date: 2022-02-27
slug: higher-order-components-in-react-hooks-era
---

# Higher-Order Components in React Hooks era

**Published:** 27-02-2022
**Author:** Nadia Makarevich

## What is a higher-order component?

According to React docs, a higher-order component is "an advanced technique to re-use components logic that is used for cross-cutting concerns." In simpler terms, it's a function that accepts a component as an argument, modifies it, and returns the enhanced version.

The simplest variant:

```tsx
const withSomeLogic = (Component) => {
  return (props) => <Component {...props} />;
};
```

Before hooks were introduced, higher-order components were widely used for accessing context and external data subscriptions. Examples include Redux `connect` and react-router's `withRouter` functions.

## Why hooks haven't made HOCs obsolete

While hooks replaced most shared logic concerns, three use cases still benefit from higher-order components:

1. Enhancing callbacks and React lifecycle events
2. Intercepting DOM events
3. Context selectors with performance optimization

## Use Case 1: Enhancing callbacks and lifecycle events

Instead of copy-pasting logging logic across multiple components, you can create a `withLoggingOnClick` function:

```tsx
type Base = { onClick: () => void };

export const withLoggingOnClick = <TProps extends Base>(
  Component: ComponentType<TProps>
) => {
  return (props: TProps) => {
    const onClick = () => {
      console.log('Log on click something');
      props.onClick();
    };

    return <Component {...props} onClick={onClick} />;
  };
};
```

You can add data via function arguments or inject it as props:

```tsx
const withLoggingOnClickWithProps = <TProps extends Base>(
  Component: ComponentType<TProps>
) => {
  return (props: TProps & { logText: string }) => {
    const onClick = () => {
      console.log('Log on click: ', props.logText);
      props.onClick();
    };

    return <Component {...props} onClick={onClick} />;
  };
};
```

Similarly, you can send logging events on component mount:

```tsx
export const withLoggingOnMount = <TProps extends unknown>(
  Component: ComponentType<TProps>
) => {
  return (props: TProps) => {
    useEffect(() => {
      console.log('log on mount');
    }, []);

    return <Component {...props} />;
  };
};
```

## Use Case 2: Intercepting DOM events

Higher-order components excel at intercepting DOM events globally. For example, suppressing keyboard shortcuts when a modal is open:

```tsx
export const withSupressKeyPress = <TProps extends unknown>(
  Component: ComponentType<TProps>
) => {
  return (props: TProps) => {
    const onKeyPress = (event) => {
      event.stopPropagation();
    };

    return (
      <div onKeyPress={onKeyPress}>
        <Component {...props} />
      </div>
    );
  };
};
```

Then apply it to any component:

```tsx
const ModalWithSupressedKeyPress = withSupressKeyPress(Modal);
const DropdownWithSupressedKeyPress = withSupressKeyPress(Dropdown);
```

## Use Case 3: Context selectors

When context values change, all consumers re-render regardless of whether they use the changed data. Higher-order components can solve this through memoization:

```tsx
export const withFormIdSelector = <TProps extends unknown>(
  Component: ComponentType<TProps & { formId: string }>
) => {
  const MemoisedComponent = React.memo(Component);

  return (props: TProps) => {
    const { id } = useFormContext();

    return <MemoisedComponent {...props} formId={id} />;
  };
};
```

For a generic solution:

```tsx
export const withContextSelector = <TProps extends unknown,
  TValue extends unknown>(
  Component: ComponentType<TProps & Record<string, TValue>>,
  selectors: Record<string, (data: Context) => TValue>,
): ComponentType<Record<string, TValue>> => {
  const MemoisedComponent = React.memo(Component);

  return (props: TProps & Record<string, TValue>) => {
    const data = useFormContext();

    const contextProps = Object.keys(selectors).reduce((acc, key) => {
      acc[key] = selectors[key](data);
      return acc;
    }, {});

    return <MemoisedComponent {...props} {...contextProps} />;
  };
};
```

Usage:

```tsx
const CountriesWithFormIdSelector = withContextSelector(
  CountriesWithFormId,
  {
    formId: (data) => data.id,
    countryName: (data) => data.country,
  }
);
```

## Summary

Higher-order components remain valuable in modern React for:

- Enhancing callbacks and lifecycle events with cross-cutting concerns like logging
- Intercepting DOM events across multiple components
- Creating context selectors that prevent unnecessary re-renders

They provide a way to share complex logic without modifying component source code.
