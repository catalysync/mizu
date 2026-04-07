---
title: "React Component as Prop: The Right Way"
url: https://www.developerway.com/posts/react-component-as-prop-the-right-way
date: 2022-02-15
slug: react-component-as-prop-the-right-way
---

# React Component as Prop: The Right Way

**Published:** 15-02-2022
**Author:** Nadia Makarevich

## Overview

This article explores three patterns for passing React components as props: as Elements, as Components, and as Functions. The author demonstrates each approach using practical examples with Material UI icons and examines their trade-offs.

## Why Pass Components as Props?

Rather than hardcoding components or managing them through limited prop APIs (like `iconName` and `iconProps`), passing components as props provides flexibility and avoids bundle bloat. This approach allows parent components to remain agnostic about which specific components they render.

## Three Patterns Compared

### 1. Icon as React Element

```tsx
type ButtonProps = {
  children: ReactNode;
  icon: ReactElement<IconProps>;
};

export const ButtonWithIconElement = ({
  children,
  icon,
}: ButtonProps) => {
  return (
    <button>
      {icon}
      {children}
    </button>
  );
};
```

**Usage:**
```tsx
<ButtonWithIconElement icon={<AccessAlarmIconGoogle />}>
  button here
</ButtonWithIconElement>
```

### 2. Icon as a Component

```tsx
type ButtonProps = {
  children: ReactNode;
  Icon: ComponentType<IconProps>;
};

export const ButtonWithIconComponent = ({
  children,
  Icon,
}: ButtonProps) => {
  return (
    <button>
      <Icon />
      {children}
    </button>
  );
};
```

**Usage:**
```tsx
import AccessAlarmIconGoogle from '@mui/icons-material/AccessAlarm';

<ButtonWithIconComponent Icon={AccessAlarmIconGoogle}>
  button here
</ButtonWithIconComponent>;
```

### 3. Icon as a Function (Render Props)

```tsx
type ButtonProps = {
  children: ReactNode;
  renderIcon: () => ReactElement<IconProps>;
};

export const ButtonWithIconRenderFunc = ({
  children,
  renderIcon,
}: ButtonProps) => {
  const icon = renderIcon();
  return (
    <button>
      {icon}
      {children}
    </button>
  );
};
```

**Usage:**
```tsx
<ButtonWithIconRenderFunc
  renderIcon={() => <AccessAlarmIconGoogle />}
>
  button here
</ButtonWithIconRenderFunc>
```

## Handling Icon Customization

### Setting Default Values

**Element Pattern:** Uses `React.cloneElement` to override props:
```tsx
const clonedIcon = React.cloneElement(icon, {
  fontSize: icon.props.fontSize || 'small',
});
```

**Component Pattern:** Passes props directly to the component, but wrapper components must spread props through:
```tsx
const AccessAlarmIcon = (props) => (
  <AccessAlarmIconGoogle {...props} color="error" />
);
```

**Function Pattern:** Passes settings as arguments:
```tsx
<ButtonWithIconRenderFunc
  renderIcon={(settings) => (
    <AccessAlarmIconGoogle
      fontSize={settings.fontSize}
      color="success"
    />
  )}
>
  button here
</ButtonWithIconRenderFunc>
```

## Managing Hover States

When button hover state needs to affect the icon, all three patterns require wrapping the original icon in a component that accepts the hover state and adjusts rendering accordingly.

**Element Pattern:** Create a wrapper component with `isHovered` prop:
```tsx
const AlarmIconWithHoverForElement = (props) => {
  return (
    <AccessAlarmIconGoogle
      {...props}
      color={props.isHovered ? 'primary' : 'warning'}
    />
  );
};
```

**Component Pattern:** Reuse the same wrapper component:
```tsx
<ButtonWithIconComponent
  Icon={AlarmIconWithHoverForElement}
>
  button here
</ButtonWithIconComponent>
```

**Function Pattern:** Use settings object:
```tsx
<ButtonWithIconRenderFunc
  renderIcon={(settings) => (
    <AccessAlarmIconGoogle
      fontSize={settings.fontSize}
      color={settings.isHovered ? "primary" : "warning"}
    />
  )}
>
```

## Summary and Recommendations

The author concludes that "all of them are more or less the same" and states there is "no right answer here." However, general usage guidelines are provided:

- **Element pattern** (`<Button icon={<Icon />} />`): Simple rendering without prop modification
- **Component pattern** (`<Button Icon={Icon} />`): Heavy customization with full user override flexibility
- **Function pattern** (`<Button renderIcon={() => <Icon />} />`): When component state drives icon changes

The key takeaway is that all three patterns enable the same flexibility and can handle identical use cases. Choice depends on team preference, consistency, and specific architectural needs rather than technical superiority.
