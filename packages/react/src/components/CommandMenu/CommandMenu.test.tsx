import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import {
  CommandMenu,
  CommandMenuInput,
  CommandMenuList,
  CommandMenuEmpty,
  CommandMenuItem,
} from './CommandMenu';

const renderCommandMenu = () =>
  render(
    <CommandMenu open>
      <CommandMenuInput placeholder="Search commands..." />
      <CommandMenuList>
        <CommandMenuEmpty>No results found.</CommandMenuEmpty>
        <CommandMenuItem>New File</CommandMenuItem>
        <CommandMenuItem>Open Settings</CommandMenuItem>
      </CommandMenuList>
    </CommandMenu>,
  );

describe('CommandMenu', () => {
  it('renders input and items', () => {
    renderCommandMenu();
    expect(screen.getByPlaceholderText('Search commands...')).toBeInTheDocument();
    expect(screen.getByText('New File')).toBeInTheDocument();
    expect(screen.getByText('Open Settings')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = renderCommandMenu();
    expect(await axe(container)).toHaveNoViolations();
  });
});
