import * as React from 'react';
import { cn } from '../../utils/cn';

export type StepStatus = 'pending' | 'current' | 'complete' | 'error';

export interface StepFlowStep {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: StepStatus;
  disabled?: boolean;
}

export interface StepFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: StepFlowStep[];
  activeStep: string;
  onStepChange?: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  allowSkip?: boolean;
}

function resolveStatus(step: StepFlowStep, index: number, activeIndex: number): StepStatus {
  if (step.status) return step.status;
  if (index < activeIndex) return 'complete';
  if (index === activeIndex) return 'current';
  return 'pending';
}

export const StepFlow = React.forwardRef<HTMLDivElement, StepFlowProps>(
  (
    {
      className,
      steps,
      activeStep,
      onStepChange,
      orientation = 'horizontal',
      allowSkip = false,
      children,
      ...props
    },
    ref,
  ) => {
    const activeIndex = steps.findIndex((s) => s.id === activeStep);

    return (
      <div
        ref={ref}
        className={cn('mizu-step-flow', className)}
        data-component="mizu-step-flow"
        data-orientation={orientation}
        {...props}
      >
        <div className="mizu-step-flow__list" role="tablist" aria-orientation={orientation}>
          {steps.map((step, index) => {
            const status = resolveStatus(step, index, activeIndex);
            const isCurrent = status === 'current';
            const canJump = allowSkip || index <= activeIndex;
            const disabled = step.disabled || (!canJump && !isCurrent);
            return (
              <button
                key={step.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-controls={`${step.id}-panel`}
                id={`${step.id}-tab`}
                className="mizu-step-flow__step"
                data-status={status}
                disabled={disabled}
                onClick={() => onStepChange?.(step.id)}
              >
                <span className="mizu-step-flow__indicator" aria-hidden="true">
                  {status === 'complete' ? '✓' : status === 'error' ? '!' : index + 1}
                </span>
                <span>
                  <span className="mizu-step-flow__title">{step.title}</span>
                  {step.description != null ? (
                    <span className="mizu-step-flow__description">{step.description}</span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
        <div
          role="tabpanel"
          id={`${activeStep}-panel`}
          aria-labelledby={`${activeStep}-tab`}
          className="mizu-step-flow__panel"
        >
          {children}
        </div>
      </div>
    );
  },
);
StepFlow.displayName = 'StepFlow';
