---
title: "React Components Composition: How to Get It Right"
url: https://www.developerway.com/posts/components-composition-how-to-get-it-right
date: 2022-04-12
slug: components-composition-how-to-get-it-right
---

# React Components Composition: How to Get It Right

**Published:** 12-04-2022
**Author:** Nadia Makarevich

## React Components Composition Patterns

### Simple Components

Simple components form React's basic building blocks. They accept props, manage state, and can be quite intricate despite their name.

```tsx
const Button = ({ title, onClick }) => <button onClick={onClick}>{title}</button>;
```

Any component rendering other components demonstrates composition. A Navigation component rendering Button is itself a simple component practicing composition:

```tsx
const Navigation = () => {
  return (
    <>
      <Button title="Create" onClick={onClickHandler} />
      {/* some other navigation code */}
    </>
  );
};
```

### Container Components

Container components represent a more advanced composition technique. They accept a special `children` prop with dedicated React syntax. If Button accepted `children` instead of `title`:

```tsx
const Button = ({ children, onClick }) => <button onClick={onClick}>{children}</button>;
```

The consumer-side syntax resembles normal HTML tags:

```tsx
const Navigation = () => {
  return (
    <>
      <Button onClick={onClickHandler}>Create</Button>
      {/* some other navigation code */}
    </>
  );
};
```

Multiple components can inhabit `children`. Navigation controls what goes inside; Button simply renders whatever the consumer provides:

```tsx
const Navigation = () => {
  return (
    <>
      <Button onClick={onClickHandler}>
        <Icon />
        <span>Create</span>
      </Button>
    </>
  );
};
```

Other patterns like higher-order components, component props, and context exist for specific scenarios. Simple and container components represent the two foundational pillars of React development.

## When to Extract Components

The core development rules follow these principles:

- Always begin implementation from the top
- Extract components only when actual necessity exists
- Start with simple components; introduce advanced techniques only when genuinely needed

The primary decomposition signal is **when components become too large**. A component fitting entirely on a laptop screen represents ideal sizing. Scrolling through code indicates oversizing.

### Practical Jira Page Example

Consider implementing a typical Jira issue page containing:

- Top navigation with logo, menus, create button, search bar
- Left sidebar with project name, collapsible sections with items
- Large page content area displaying issue information

Starting with one monolithic component would quickly become unwieldy. The solution involves creating focused sub-components: `Topbar`, `Sidebar`, and `Issue`:

```tsx
export const JiraIssuePage = () => {
  return (
    <div className="app">
      <Topbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          <Issue />
        </div>
      </div>
    </div>
  );
};
```

### The "Don't Stop Halfway" Rule

When extracting smaller components, avoid mixing implementation and composition styles. A component should either "implement various stuff" **or** "compose various components together"—not both.

Poor approach (mixes patterns):

```tsx
export const Topbar = () => {
  return (
    <div className="top-bar">
      <div className="logo">logo</div>
      <MainMenu />
      <button className="create-button">Create</button>
    </div>
  );
};
```

Better approach (pure composition):

```tsx
export const Topbar = () => {
  return (
    <div className="top-bar">
      <Logo />
      <MainMenu />
      <Create />
      {/* more top bar components */}
    </div>
  );
};
```

Similarly for sidebar:

```tsx
export const Sidebar = () => {
  return (
    <div className="sidebar">
      <Header />
      <PlanningSection />
      <DevelopmentSection />
      {/* other sections */}
    </div>
  );
};
```

## Introducing Container Components

Container components address scenarios where visual or behavioral logic should wrap consumer-controlled elements.

### Use Case: Collapsible Sections

Both Planning and Development sidebar sections share identical collapse behavior. Rather than duplicating logic:

```tsx
const CollapsableSection = ({ children, title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="sidebar-section">
      <div
        className="sidebar-section-title"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {title}
      </div>
      {!isCollapsed && <>{children}</>}
    </div>
  );
};
```

Now sections become simple wrappers:

```tsx
const PlanningSection = () => {
  return (
    <CollapsableSection title="Planning">
      <button className="board-picker">ELS board</button>
      <ul className="section-menu">
        {/* menu items */}
      </ul>
    </CollapsableSection>
  );
};
```

### Use Case: Page Layout

Multiple pages follow identical structure—sidebar and topbar remain constant while content changes. A layout container encapsulates this pattern:

```tsx
const JiraPageLayout = ({ children }) => {
  return (
    <div className="app">
      <Topbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};
```

Specific pages become minimal:

```tsx
export const JiraIssuePage = () => {
  return (
    <JiraPageLayout>
      <Issue />
    </JiraPageLayout>
  );
};
```

### Performance Consideration

Container components optimize performance when heavy state operations risk degrading responsiveness. For draggable sidebars with frequent mousemove events:

```tsx
const DraggableSidebar = ({ children }: { children: ReactNode }) => {
  const [width, setWidth] = useState(240);
  const [startMoving, setStartMoving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const changeWidth = (e: MouseEvent) => {
      if (!startMoving) return;
      if (!ref.current) return;
      const left = ref.current.getBoundingClientRect().left;
      const wi = e.clientX - left;
      setWidth(wi);
    };

    ref.current.addEventListener('mousemove', changeWidth);
    return () => ref.current?.removeEventListener('mousemove', changeWidth);
  }, [startMoving, ref]);

  return (
    <div
      className="sidebar"
      ref={ref}
      onMouseLeave={() => setStartMoving(false)}
      style={{ width: `${width}px` }}
    >
      <Handle onMouseDown={() => setStartMoving(true)} />
      {children}
    </div>
  );
};
```

The container re-renders frequently but cheaply (single div). Children remain unaffected by state changes.

## State Ownership

Extract components when managing irrelevant state. An "Add shortcuts" modal within a section component obscures section purpose:

```tsx
// Poor: unrelated state in section
const SomeSection = () => {
  const [showAddShortcuts, setShowAddShortcuts] = useState(false);
  return (
    <div className="sidebar-section">
      <ul className="section-menu">
        <li>
          <span onClick={() => setShowAddShortcuts(true)}>Add shortcuts</span>
        </li>
      </ul>
      {showAddShortcuts && <ModalDialog onClose={() => setShowAddShortcuts(false)} />}
    </div>
  );
};
```

Better approach isolates related functionality:

```tsx
// Better: related state in dedicated component
const AddShortcutItem = () => {
  const [showAddShortcuts, setShowAddShortcuts] = useState(false);
  return (
    <>
      <span onClick={() => setShowAddShortcuts(true)}>Add shortcuts</span>
      {showAddShortcuts && <ModalDialog onClose={() => setShowAddShortcuts(false)} />}
    </>
  );
};

const OtherSection = () => {
  return (
    <div className="sidebar-section">
      <ul className="section-menu">
        <li>
          <AddShortcutItem />
        </li>
      </ul>
    </div>
  );
};
```

## What Makes a Good Component?

**A good component is easily understood at first glance.** Quality components share these characteristics:

- **Size:** Readable without scrolling
- **Naming:** Self-describing (Sidebar, CreateIssue, not SidebarController)
- **State management:** No unrelated state handling
- **Implementation:** Clear and straightforward

## Summary

**What makes a good component?**

- Size allowing reading without scrolling
- Name indicating its purpose
- No irrelevant state management
- Easy-to-read implementation

**When to split components?**

- Component becomes too large
- Heavy state operations affecting performance
- Component manages unrelated state

**General composition rules:**

- Always start from the very top
- Extract components only when actual needs exist
- Begin with simple components; introduce advanced techniques only when necessary

The secret to scalable React apps: extracting good components at the right time.
