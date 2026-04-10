import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Card, CardHeader, CardBody, CardFooter } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <CardBody>Hello</CardBody>
      </Card>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders header title and description', () => {
    render(<CardHeader title="Title" description="Desc" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies interactive class', () => {
    const { container } = render(<Card interactive>Content</Card>);
    expect(container.firstChild).toHaveClass('mizu-card--interactive');
  });

  it('forwards className', () => {
    const { container } = render(<Card className="custom">X</Card>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('renders header without description', () => {
    render(<CardHeader title="Only title" />);
    expect(screen.getByText('Only title')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Card>
        <CardHeader title="Accessible" />
        <CardBody>Content</CardBody>
        <CardFooter>Foot</CardFooter>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
