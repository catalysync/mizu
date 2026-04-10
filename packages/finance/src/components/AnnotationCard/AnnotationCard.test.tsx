import { render, screen } from '@testing-library/react';
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
});
