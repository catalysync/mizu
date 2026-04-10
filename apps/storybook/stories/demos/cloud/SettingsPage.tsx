import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Switch,
  Button,
  Stack,
  Inline,
  Separator,
  Select,
} from '@aspect/react';

export function SettingsPage() {
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
