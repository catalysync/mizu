import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { RadioGroup, RadioItem } from '../Radio';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select';
import { Switch } from '../Switch';
import { Textarea } from '../Textarea';
import { Field } from './Field';

describe('Field context integration — legacy controls', () => {
  it('Input inherits id/required/disabled/aria-invalid from Field', () => {
    render(
      <Field label="Email" required disabled errorMessage="Required">
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByLabelText(/Email/) as HTMLInputElement;
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('Textarea inherits from Field', () => {
    render(
      <Field label="Notes" required disabled>
        <Textarea />
      </Field>,
    );
    const ta = screen.getByLabelText(/Notes/) as HTMLTextAreaElement;
    expect(ta).toBeRequired();
    expect(ta).toBeDisabled();
  });

  it('Checkbox inherits from Field', () => {
    render(
      <Field label="Terms" required disabled>
        <Checkbox />
      </Field>,
    );
    const cb = screen.getByRole('checkbox');
    expect(cb).toBeDisabled();
    expect(cb).toBeRequired();
  });

  it('Switch inherits from Field', () => {
    render(
      <Field label="Notifications" required disabled>
        <Switch />
      </Field>,
    );
    const sw = screen.getByRole('switch');
    expect(sw).toBeDisabled();
    // Radix Switch is a button — jest-dom's toBeRequired can't see aria-required on it
    // eslint-disable-next-line jest-dom/prefer-required
    expect(sw).toHaveAttribute('aria-required', 'true');
  });

  it('RadioGroup inherits from Field', () => {
    render(
      <Field label="Plan" required disabled>
        <RadioGroup>
          <RadioItem value="basic" label="Basic" />
          <RadioItem value="pro" label="Pro" />
        </RadioGroup>
      </Field>,
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toBeRequired();
  });

  it('SelectTrigger inherits from Field', () => {
    render(
      <Field label="Currency" disabled errorMessage="Pick a currency">
        <Select>
          <SelectTrigger aria-label="Currency">
            <SelectValue placeholder="Pick" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">USD</SelectItem>
          </SelectContent>
        </Select>
      </Field>,
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });
});
