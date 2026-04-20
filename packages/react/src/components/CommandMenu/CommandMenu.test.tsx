import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  CommandMenu,
  CommandMenuEmpty,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from './CommandMenu';

describe('CommandMenu', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <CommandMenu>
        <CommandMenuInput placeholder="Search..." />
        <CommandMenuList>
          <CommandMenuEmpty>No results</CommandMenuEmpty>
          <CommandMenuGroup>
            <CommandMenuItem>New file</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>,
    );
    expect(container).toBeTruthy();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <CommandMenu>
        <CommandMenuInput placeholder="Search..." />
        <CommandMenuList>
          <CommandMenuItem>New file</CommandMenuItem>
        </CommandMenuList>
      </CommandMenu>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
