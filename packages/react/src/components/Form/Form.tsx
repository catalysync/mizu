import * as React from 'react';
import { cn } from '../../utils/cn';

export type FormLayout = 'stack' | 'grid';

export interface FormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  layout?: FormLayout;
  columns?: 2 | 3;
  actions?: React.ReactNode;
  actionsAlign?: 'start' | 'end' | 'between';
  errorSummary?: React.ReactNode;
  disabled?: boolean;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      className,
      title,
      description,
      layout = 'stack',
      columns = 2,
      actions,
      actionsAlign = 'end',
      errorSummary,
      disabled,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const isGrid = layout === 'grid';
    return (
      <form
        ref={ref}
        className={cn('mizu-form', className)}
        data-component="mizu-form"
        data-layout={layout}
        data-disabled={disabled || undefined}
        noValidate
        style={
          isGrid
            ? ({ ['--_cols' as string]: String(columns), ...style } as React.CSSProperties)
            : style
        }
        {...props}
      >
        {title != null || description != null ? (
          <header className="mizu-form__header" data-layout={layout}>
            {title != null ? <h2 className="mizu-form__title">{title}</h2> : null}
            {description != null ? <p className="mizu-form__description">{description}</p> : null}
          </header>
        ) : null}
        {errorSummary != null ? (
          <div className="mizu-form__error" role="alert">
            {errorSummary}
          </div>
        ) : null}
        {disabled ? (
          <fieldset disabled style={{ display: 'contents', border: 0, padding: 0, margin: 0 }}>
            {children}
          </fieldset>
        ) : (
          children
        )}
        {actions != null ? (
          <footer className="mizu-form__footer" data-layout={layout} data-align={actionsAlign}>
            {actions}
          </footer>
        ) : null}
      </form>
    );
  },
);
Form.displayName = 'Form';

export { Form };
