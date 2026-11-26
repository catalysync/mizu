import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { AppLayout } from './AppLayout';
import { AppSidebar, AppSidebarItem, AppSidebarSection } from './AppSidebar';

const icon = <svg aria-hidden="true" viewBox="0 0 16 16" />;

describe('AppSidebar', () => {
  it('names every link in a collapsed sidebar and has no axe violations', async () => {
    const { container } = render(
      <AppLayout defaultSidebarCollapsed>
        <AppSidebar>
          <AppSidebarSection label="Workspace">
            <AppSidebarItem href="/home" icon={icon} active>
              Home
            </AppSidebarItem>
            <AppSidebarItem href="/projects" icon={icon}>
              Projects
            </AppSidebarItem>
          </AppSidebarSection>
        </AppSidebar>
      </AppLayout>,
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('names each section group after its label', () => {
    render(
      <AppSidebar>
        <AppSidebarSection label="Reports">
          <AppSidebarItem href="/r">Revenue</AppSidebarItem>
        </AppSidebarSection>
      </AppSidebar>,
    );
    const group = screen.getByRole('group', { name: 'Reports' });
    expect(group).toContainElement(screen.getByRole('link', { name: 'Revenue' }));
  });

  it('gives an unlabelled section no accessible name reference', () => {
    const { container } = render(
      <AppSidebar>
        <AppSidebarSection>
          <AppSidebarItem href="/x">X</AppSidebarItem>
        </AppSidebarSection>
      </AppSidebar>,
    );
    const group = container.querySelector('[role="group"]');
    expect(group).not.toHaveAttribute('aria-labelledby');
  });

  it('renders as a router-style child with asChild and keeps the item classes', () => {
    render(
      <AppSidebar>
        <AppSidebarItem asChild icon={icon} active className="extra">
          <button type="button" data-testid="nav">
            Settings
          </button>
        </AppSidebarItem>
      </AppSidebar>,
    );
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveClass('mizu-app-sidebar__item', 'extra');
    expect(button).toHaveAttribute('aria-current', 'page');
    expect(button.querySelector('.mizu-app-sidebar__item-label')).toHaveTextContent('Settings');
    expect(button.querySelector('.mizu-app-sidebar__item-icon')).not.toBeNull();
  });

  it('forwards refs to the rendered anchor and the asChild element', () => {
    const anchorRef = { current: null as HTMLAnchorElement | null };
    const childRef = { current: null as HTMLButtonElement | null };
    render(
      <AppSidebar>
        <AppSidebarItem ref={anchorRef} href="/a">
          A
        </AppSidebarItem>
        <AppSidebarItem asChild ref={childRef as React.Ref<HTMLAnchorElement>}>
          <button type="button">B</button>
        </AppSidebarItem>
      </AppSidebar>,
    );
    expect(anchorRef.current?.tagName).toBe('A');
    expect(childRef.current?.tagName).toBe('BUTTON');
  });
});
