import type { OutputFile, RenderContext } from '@/lib/patterns/types';
import { definePattern } from '@/lib/patterns/types';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Inline,
  Input,
  Separator,
  Stack,
  Switch,
} from '@aspect/react';

function Preview() {
  return (
    <Stack gap="1.5rem">
      <Card>
        <CardHeader title="General" description="Configure your account settings." />
        <CardBody>
          <Stack gap="1rem">
            <Input label="Team name" defaultValue="Aspect Labs" />
            <Input label="Slug" defaultValue="aspect-labs" />
            <Input label="Default region" defaultValue="US East (Virginia)" />
          </Stack>
        </CardBody>
        <CardFooter>
          <Button size="sm" variant="ghost">
            Cancel
          </Button>
          <Button size="sm" variant="primary">
            Save
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader title="Notifications" description="Manage how you receive alerts." />
        <CardBody>
          <Stack gap="0.75rem">
            <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
              <span className="mizu-body--sm">Deploy succeeded</span>
              <Switch aria-label="Deploy succeeded" defaultChecked />
            </Inline>
            <Separator />
            <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
              <span className="mizu-body--sm">Deploy failed</span>
              <Switch aria-label="Deploy failed" defaultChecked />
            </Inline>
            <Separator />
            <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
              <span className="mizu-body--sm">Resource limit warnings</span>
              <Switch aria-label="Resource limit warnings" defaultChecked />
            </Inline>
            <Separator />
            <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
              <span className="mizu-body--sm">Weekly usage digest</span>
              <Switch aria-label="Weekly usage digest" />
            </Inline>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Danger zone" />
        <CardBody>
          <Inline gap="1rem" align="center" style={{ justifyContent: 'space-between' }}>
            <Stack gap="0.25rem">
              <span className="mizu-body--sm">
                <strong>Delete team</strong>
              </span>
              <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                Permanently delete this team and all its apps.
              </span>
            </Stack>
            <Button size="sm" variant="destructive">
              Delete team
            </Button>
          </Inline>
        </CardBody>
      </Card>
    </Stack>
  );
}

const TEMPLATE = `import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Inline,
  Input,
  Select,
  Separator,
  Stack,
  Switch,
} from '@aspect/react';

export default function SettingsPage() {
  return (
    <Stack gap="1.5rem">
      <Card>
        <CardHeader title="General" description="Configure your account settings." />
        <CardBody>
          <Stack gap="1rem">
            <Input label="Team name" defaultValue="Aspect Labs" />
            <Input label="Slug" defaultValue="aspect-labs" />
            <Select label="Default region">
              <option value="us-east">US East (Virginia)</option>
              <option value="us-west">US West (Oregon)</option>
              <option value="eu-west">EU West (Ireland)</option>
              <option value="ap-south">AP South (Mumbai)</option>
            </Select>
          </Stack>
        </CardBody>
        <CardFooter>
          <Button size="sm" variant="ghost">Cancel</Button>
          <Button size="sm" variant="primary">Save</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader title="Notifications" description="Manage how you receive alerts." />
        <CardBody>
          <Stack gap="0.75rem">
            <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
              <span className="mizu-body--sm">Deploy succeeded</span>
              <Switch aria-label="Deploy succeeded" defaultChecked />
            </Inline>
            <Separator />
            <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
              <span className="mizu-body--sm">Deploy failed</span>
              <Switch aria-label="Deploy failed" defaultChecked />
            </Inline>
            <Separator />
            <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
              <span className="mizu-body--sm">Resource limit warnings</span>
              <Switch aria-label="Resource limit warnings" defaultChecked />
            </Inline>
            <Separator />
            <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
              <span className="mizu-body--sm">Weekly usage digest</span>
              <Switch aria-label="Weekly usage digest" />
            </Inline>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Danger zone" />
        <CardBody>
          <Inline gap="1rem" align="center" style={{ justifyContent: 'space-between' }}>
            <Stack gap="0.25rem">
              <span className="mizu-body--sm"><strong>Delete team</strong></span>
              <span className="mizu-caption" style={{ color: 'var(--mizu-text-secondary)' }}>
                Permanently delete this team and all its apps.
              </span>
            </Stack>
            <Button size="sm" variant="destructive">Delete team</Button>
          </Inline>
        </CardBody>
      </Card>
    </Stack>
  );
}
`;

export const cloudSettings = definePattern({
  meta: {
    id: 'cloud.settings',
    name: 'Cloud Settings Page',
    description:
      'Settings page with General card (form), Notifications card (switch rows), and Danger zone (destructive action).',
    kind: 'page',
    industries: ['cloud', 'saas-admin'],
    tier: 'free',
    depends: [
      '@aspect/react#Card',
      '@aspect/react#Input',
      '@aspect/react#Select',
      '@aspect/react#Switch',
      '@aspect/react#Separator',
      '@aspect/react#Stack',
      '@aspect/react#Inline',
      '@aspect/react#Button',
    ],
    sources: [
      {
        system: 'mizu-storybook-cloud-demo',
        relationship: 'concept-reference',
        notes: 'Ported from apps/storybook/stories/demos/cloud/SettingsPage.tsx',
      },
      {
        system: 'github',
        relationship: 'ia-borrowed',
        notes:
          'General/Notifications/Danger zone section structure is borrowed from GitHub settings.',
      },
      {
        system: 'linear',
        relationship: 'visual-rhythm',
        notes: 'Card-based settings pattern with switch rows echoes Linear workspace settings.',
      },
    ],
  },
  Preview,
  renderReact(_ctx: RenderContext): OutputFile[] {
    return [
      {
        path: 'app/settings/page.tsx',
        contents: TEMPLATE,
      },
    ];
  },
});
