import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { AnnotationCard } from './AnnotationCard';

describe('AnnotationCard', () => {
  it('renders title and content', () => {
    render(
      <AnnotationCard title="Revenue spike">
        Revenue increased 24% compared to the previous period.
      </AnnotationCard>,
    );
    expect(screen.getByText('Revenue spike')).toBeInTheDocument();
    expect(screen.getByText(/increased 24%/)).toBeInTheDocument();
  });

  it('renders a skeleton when loading', () => {
    render(
      <AnnotationCard title="Revenue spike" loading>
        Body content
      </AnnotationCard>,
    );
    expect(screen.queryByText('Revenue spike')).not.toBeInTheDocument();
    expect(screen.queryByText('Body content')).not.toBeInTheDocument();
  });

  it('sets aria-busy and default loading label', () => {
    const { container } = render(
      <AnnotationCard title="Revenue spike" loading>
        Body
      </AnnotationCard>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(root).toHaveAttribute('aria-label', 'Loading Revenue spike');
  });

  it('has no axe violations in loading state', async () => {
    const { container } = render(
      <AnnotationCard title="Revenue spike" loading>
        Body
      </AnnotationCard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
