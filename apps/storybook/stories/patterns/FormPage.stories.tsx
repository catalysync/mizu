import { FormGroup } from '@aspect/commerce';
import {
  AppBreadcrumbs,
  AppContentHeader,
  Button,
  Card,
  CardBody,
  CardHeader,
  Inline,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Stack,
  Switch,
  Textarea,
} from '@aspect/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Patterns/Form Page',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateResource: Story = {
  render: () => (
    <Stack gap="1.5rem" className="story-lg">
      <AppBreadcrumbs items={[{ label: 'Apps', href: '#' }, { label: 'Create app' }]} />
      <AppContentHeader title="Create app" description="Deploy a new application." />
      <Card>
        <CardHeader title="General" />
        <CardBody>
          <Stack gap="1rem">
            <FormGroup label="App name" htmlFor="f-name">
              <Input id="f-name" placeholder="my-awesome-app" />
            </FormGroup>
            <FormGroup
              label="Description"
              htmlFor="f-desc"
              help="Optional. Shown in the dashboard."
            >
              <Textarea id="f-desc" placeholder="What does this app do?" rows={3} />
            </FormGroup>
            <FormGroup label="Region" htmlFor="f-region">
              <Select>
                <SelectTrigger aria-label="Region" id="f-region">
                  <SelectValue placeholder="Choose region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east">US East</SelectItem>
                  <SelectItem value="us-west">US West</SelectItem>
                  <SelectItem value="eu-west">EU West</SelectItem>
                </SelectContent>
              </Select>
            </FormGroup>
          </Stack>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Settings" />
        <CardBody>
          <Stack gap="1rem">
            <Inline gap="0.5rem" align="center">
              <Switch id="f-auto" aria-label="Auto-deploy" defaultChecked />
              <label htmlFor="f-auto" className="mizu-body--sm">
                Auto-deploy on push to main
              </label>
            </Inline>
            <Inline gap="0.5rem" align="center">
              <Switch id="f-preview" aria-label="Preview deploys" />
              <label htmlFor="f-preview" className="mizu-body--sm">
                Enable preview deploys for PRs
              </label>
            </Inline>
          </Stack>
        </CardBody>
      </Card>
      <Separator />
      <Inline gap="0.5rem">
        <Button variant="primary">Create app</Button>
        <Button variant="ghost">Cancel</Button>
      </Inline>
    </Stack>
  ),
};
