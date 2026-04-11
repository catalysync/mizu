import { useState } from 'react';
import {
  AppContentHeader,
  Button,
  Card,
  CardBody,
  Fieldset,
  Field,
  Form,
  Input,
  Inline,
  Stack,
  Switch,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@aspect/react';
import { TaxRateInput } from '@aspect/finance';

type Section = 'general' | 'tax' | 'integrations' | 'users' | 'billing' | 'data';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'tax', label: 'Tax' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'users', label: 'Users' },
  { id: 'billing', label: 'Billing' },
  { id: 'data', label: 'Data export' },
];

export function SettingsPage() {
  const [active, setActive] = useState<Section>('general');
  return (
    <Stack gap="1.5rem">
      <AppContentHeader
        title="Settings"
        description="Manage your company profile, tax rules, users, and integrations."
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '12rem minmax(0, 1fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        <nav aria-label="Settings sections">
          <Stack gap="0.125rem">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                data-active={active === s.id || undefined}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'start',
                  padding: '0.5rem 0.75rem',
                  background: active === s.id ? 'var(--mizu-surface-secondary)' : 'transparent',
                  color:
                    active === s.id ? 'var(--mizu-text-primary)' : 'var(--mizu-text-secondary)',
                  border: 0,
                  borderRadius: 'var(--mizu-radius-md)',
                  cursor: 'pointer',
                  fontWeight: active === s.id ? 500 : 400,
                  fontFamily: 'var(--mizu-font-family-sans)',
                  fontSize: 'var(--mizu-font-size-sm)',
                }}
              >
                {s.label}
              </button>
            ))}
          </Stack>
        </nav>
        <Card>
          <CardBody>
            {active === 'general' && <GeneralSection />}
            {active === 'tax' && <TaxSection />}
            {active === 'integrations' && <IntegrationsSection />}
            {active === 'users' && <UsersSection />}
            {active === 'billing' && <BillingSection />}
            {active === 'data' && <DataSection />}
          </CardBody>
        </Card>
      </div>
    </Stack>
  );
}

function GeneralSection() {
  return (
    <Form
      title="Company profile"
      description="Displayed on invoices, reports, and the customer portal."
      onSubmit={(e) => e.preventDefault()}
      actions={
        <Inline gap="0.5rem">
          <Button variant="ghost" type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save changes
          </Button>
        </Inline>
      }
    >
      <Fieldset legend="Identity">
        <Stack gap="0.75rem">
          <Field label="Company name" required>
            <Input defaultValue="Aspect Labs Inc." />
          </Field>
          <Field label="Email" required>
            <Input type="email" defaultValue="hello@aspect.labs" />
          </Field>
          <Field label="Website" showOptionalHint>
            <Input defaultValue="https://aspect.labs" />
          </Field>
        </Stack>
      </Fieldset>
      <Fieldset legend="Address">
        <Stack gap="0.75rem">
          <Field label="Street" required>
            <Input defaultValue="101 Harbor Way" />
          </Field>
          <Inline gap="0.75rem">
            <div style={{ flex: 1 }}>
              <Field label="City" required>
                <Input defaultValue="Portland" />
              </Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Postal code" required>
                <Input defaultValue="97201" />
              </Field>
            </div>
          </Inline>
          <Field label="Country" required>
            <Select defaultValue="us">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Stack>
      </Fieldset>
    </Form>
  );
}

function TaxSection() {
  return (
    <Form
      title="Tax settings"
      description="Default tax rates applied to new invoices and line items."
      onSubmit={(e) => e.preventDefault()}
      actions={
        <Button variant="primary" type="submit">
          Save changes
        </Button>
      }
    >
      <Field label="Default tax rate" description="Applied to new invoice line items">
        <TaxRateInput defaultValue={20} />
      </Field>
      <Field label="Tax ID" showOptionalHint>
        <Input defaultValue="EIN 12-3456789" />
      </Field>
      <Fieldset legend="Reporting">
        <Stack gap="0.5rem">
          <Inline gap="0.75rem" align="center">
            <Switch defaultChecked aria-label="Collect tax on exports" />
            <span>Collect tax on exports</span>
          </Inline>
          <Inline gap="0.75rem" align="center">
            <Switch aria-label="File quarterly automatically" />
            <span>File quarterly tax returns automatically</span>
          </Inline>
        </Stack>
      </Fieldset>
    </Form>
  );
}

function IntegrationsSection() {
  return (
    <Stack gap="1rem">
      <h3 style={{ margin: 0 }}>Integrations</h3>
      <p style={{ color: 'var(--mizu-text-secondary)', margin: 0 }}>
        Connect your bank, payment processor, and accounting tools.
      </p>
      {[
        { name: 'Stripe', connected: true, desc: 'Card payments and payouts' },
        { name: 'Plaid', connected: true, desc: 'Bank feeds and reconciliation' },
        { name: 'Xero', connected: false, desc: 'General ledger sync' },
        { name: 'HubSpot', connected: false, desc: 'Customer sync' },
      ].map((i) => (
        <Card key={i.name}>
          <CardBody>
            <Inline gap="1rem" align="center" style={{ justifyContent: 'space-between' }}>
              <Stack gap="0.125rem">
                <strong>{i.name}</strong>
                <span style={{ color: 'var(--mizu-text-secondary)', fontSize: '0.875rem' }}>
                  {i.desc}
                </span>
              </Stack>
              <Button variant={i.connected ? 'ghost' : 'primary'} size="sm">
                {i.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </Inline>
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}

function UsersSection() {
  return (
    <Form
      title="Team"
      description="Invite teammates and manage their role."
      onSubmit={(e) => e.preventDefault()}
      actions={
        <Button variant="primary" type="submit">
          Send invite
        </Button>
      }
    >
      <Field label="Email address" required>
        <Input type="email" placeholder="teammate@company.com" />
      </Field>
      <Field label="Role" required>
        <Select defaultValue="bookkeeper">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="accountant">Accountant</SelectItem>
            <SelectItem value="bookkeeper">Bookkeeper</SelectItem>
            <SelectItem value="viewer">View only</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Personal note" description="Included in the invitation email" showOptionalHint>
        <Textarea rows={3} defaultValue="Welcome to the team." />
      </Field>
    </Form>
  );
}

function BillingSection() {
  return (
    <Stack gap="1rem">
      <h3 style={{ margin: 0 }}>Billing</h3>
      <p style={{ color: 'var(--mizu-text-secondary)', margin: 0 }}>
        You're on the <strong>Team</strong> plan — $49/month, billed annually.
      </p>
      <Inline gap="0.5rem">
        <Button variant="primary">Change plan</Button>
        <Button variant="ghost">View invoices</Button>
      </Inline>
    </Stack>
  );
}

function DataSection() {
  return (
    <Stack gap="1rem">
      <h3 style={{ margin: 0 }}>Data export</h3>
      <p style={{ color: 'var(--mizu-text-secondary)', margin: 0 }}>
        Download a full copy of your data in CSV or JSON.
      </p>
      <Inline gap="0.5rem">
        <Button variant="primary">Export as CSV</Button>
        <Button variant="ghost">Export as JSON</Button>
      </Inline>
    </Stack>
  );
}
