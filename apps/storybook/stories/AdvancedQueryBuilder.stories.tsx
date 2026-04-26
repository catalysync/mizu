import type { Config, ImmutableTree, JsonGroup } from '@aspect/advanced-query-builder';
import { BasicConfig, MizuAdvancedQueryBuilder, Utils } from '@aspect/advanced-query-builder';
import { Card, Stack } from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const config: Config = {
  ...BasicConfig,
  fields: {
    status: {
      label: 'Status',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: [
          { value: 'running', title: 'Running' },
          { value: 'idle', title: 'Idle' },
          { value: 'crashed', title: 'Crashed' },
          { value: 'building', title: 'Building' },
        ],
      },
    },
    region: {
      label: 'Region',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: [
          { value: 'us-east', title: 'US East' },
          { value: 'us-west', title: 'US West' },
          { value: 'eu-west', title: 'EU West' },
          { value: 'ap-south', title: 'AP South' },
        ],
      },
    },
    framework: {
      label: 'Framework',
      type: 'text',
      valueSources: ['value'],
    },
    deploys: {
      label: 'Deploys',
      type: 'number',
      valueSources: ['value'],
      fieldSettings: { min: 0 },
    },
  },
};

const initialValue: JsonGroup = {
  id: '1',
  type: 'group',
  children1: [
    {
      type: 'rule',
      properties: {
        field: 'status',
        operator: 'select_equals',
        value: ['running'],
        valueSrc: ['value'],
        valueType: ['select'],
      },
    },
  ],
};

function AdvancedQueryBuilderDemo() {
  const [output, setOutput] = React.useState('');

  const handleChange = React.useCallback((tree: ImmutableTree, cfg: Config) => {
    const jsonLogic = Utils.jsonLogicFormat(tree, cfg);
    setOutput(JSON.stringify(jsonLogic, null, 2));
  }, []);

  return (
    <Stack gap="1rem">
      <MizuAdvancedQueryBuilder config={config} value={initialValue} onChange={handleChange} />
      {output && (
        <Card>
          <pre style={{ margin: 0, fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>{output}</pre>
        </Card>
      )}
    </Stack>
  );
}

const meta = {
  title: 'Components/Data Display/AdvancedQueryBuilder',
  tags: ['autodocs', 'experimental'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AdvancedQueryBuilderDemo />,
};
