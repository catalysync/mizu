import type { Meta, StoryObj } from '@storybook/react-vite';
import { Combobox, Field, Stack } from '@aspect/react';
import { useState } from 'react';

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany', description: 'Central Europe' },
  { value: 'fr', label: 'France', description: 'Western Europe' },
  { value: 'jp', label: 'Japan', description: 'East Asia' },
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
  { value: 'br', label: 'Brazil' },
];

const meta = {
  title: 'Components/Atoms/Combobox',
  component: Combobox,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field label="Country">
      <Combobox options={COUNTRIES} placeholder="Select a country..." />
    </Field>
  ),
};

export const WithValue: Story = {
  render: () => (
    <Field label="Country">
      <Combobox options={COUNTRIES} value="gb" />
    </Field>
  ),
};

export const MultiSelect: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['us', 'gb']);
    return (
      <Field label="Markets" description="Select all regions you operate in">
        <Combobox
          options={COUNTRIES}
          multiple
          value={value}
          onValueChange={(v) => setValue(v as string[])}
        />
      </Field>
    );
  },
};

export const WithDescriptions: Story = {
  render: () => (
    <Field label="Region">
      <Combobox options={COUNTRIES} placeholder="Pick a region..." />
    </Field>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field label="Country" disabled>
      <Combobox options={COUNTRIES} value="us" />
    </Field>
  ),
};

export const NoSearch: Story = {
  render: () => (
    <Field label="Size">
      <Combobox
        options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]}
        searchable={false}
        placeholder="Pick a size"
      />
    </Field>
  ),
};

export const FormExample: Story = {
  render: () => (
    <Stack gap="1rem" style={{ maxWidth: 360 }}>
      <Field label="Country" required>
        <Combobox options={COUNTRIES} />
      </Field>
      <Field label="Languages" description="Select all that apply">
        <Combobox
          options={[
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' },
            { value: 'es', label: 'Spanish' },
            { value: 'pt', label: 'Portuguese' },
            { value: 'ja', label: 'Japanese' },
          ]}
          multiple
          placeholder="Select languages..."
        />
      </Field>
    </Stack>
  ),
};
