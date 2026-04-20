import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Label } from './Label';

describe('Label', () => {
  it('renders a label element with the given text', () => {
    render(<Label htmlFor="name">Name</Label>);
    const label = screen.getByText('Name');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'name');
  });

  it('renders a visible asterisk + sr-only text when required', () => {
    render(<Label required>Email</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('(required)')).toBeInTheDocument();
  });

  it('uses a custom required label when provided', () => {
    render(
      <Label required requiredLabel="must fill in">
        Email
      </Label>,
    );
    expect(screen.getByText('must fill in')).toBeInTheDocument();
  });

  it('does not render the required marker by default', () => {
    render(<Label>Name</Label>);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
    expect(screen.queryByText('(required)')).not.toBeInTheDocument();
  });

  it('associates with an input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" />
      </>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="x" required>
          Required field
        </Label>
        <input id="x" type="text" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
