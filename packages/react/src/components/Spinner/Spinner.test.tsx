import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { I18nProvider, enUS, type MizuLocale } from '../../i18n';
import { Spinner } from './Spinner';

const frenchLocale: MizuLocale = {
  ...enUS,
  locale: 'fr-FR',
  feedback: { ...enUS.feedback, loading: 'Chargement…' },
};

describe('Spinner', () => {
  it('renders with role="status" and the default locale label', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText(enUS.feedback.loading)).toBeInTheDocument();
  });

  it('takes the default label from the I18nProvider locale', () => {
    render(
      <I18nProvider locale={frenchLocale}>
        <Spinner />
      </I18nProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Chargement…');
    expect(screen.queryByText(enUS.feedback.loading)).not.toBeInTheDocument();
  });

  it('uses a custom label when provided', () => {
    render(<Spinner label="Fetching data" />);
    expect(screen.getByText('Fetching data')).toBeInTheDocument();
  });

  it('keeps an explicit label over the locale label', () => {
    render(
      <I18nProvider locale={frenchLocale}>
        <Spinner label="Fetching data" />
      </I18nProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Fetching data');
    expect(screen.queryByText('Chargement…')).not.toBeInTheDocument();
  });

  it('applies size variant class', () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.firstChild).toHaveClass('mizu-spinner--size-lg');
  });

  it('defaults to size sm', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('mizu-spinner--size-sm');
  });

  it('forwards className', () => {
    const { container } = render(<Spinner className="extra" />);
    expect(container.firstChild).toHaveClass('extra');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Spinner label="Loading results" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
