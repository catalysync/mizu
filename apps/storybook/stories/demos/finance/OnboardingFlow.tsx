import { TaxRateInput } from '@aspect/finance';
import {
  Button,
  Card,
  CardBody,
  Center,
  Field,
  Fieldset,
  Heading,
  Inline,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
  StepFlow,
  Switch,
  type StepFlowStep,
} from '@aspect/react';
import { useState } from 'react';

const STEPS: StepFlowStep[] = [
  {
    id: 'profile',
    title: 'Company profile',
    description: 'Name, address, contact',
  },
  {
    id: 'accounts',
    title: 'Chart of accounts',
    description: 'Pick a template',
  },
  {
    id: 'tax',
    title: 'Tax settings',
    description: 'Rates and filing',
  },
  {
    id: 'bank',
    title: 'Connect bank',
    description: 'Import transactions',
  },
];

export function OnboardingFlow() {
  const [active, setActive] = useState('profile');
  const index = STEPS.findIndex((s) => s.id === active);
  const isLast = index === STEPS.length - 1;

  return (
    <div data-mizu-theme="finance" className="finance-demo__onboarding">
      <Center maxInlineSize="48rem">
        <Stack gap="2rem">
          <Stack gap="0.5rem" className="finance-demo__onboarding-header">
            <Heading level={1} size="2xl">
              Set up your books
            </Heading>
            <p className="finance-demo__section-desc">
              Four short steps. About two minutes. You can change anything later.
            </p>
          </Stack>

          <StepFlow steps={STEPS} activeStep={active} onStepChange={setActive}>
            <Card>
              <CardBody>
                {active === 'profile' && <ProfileStep />}
                {active === 'accounts' && <AccountsStep />}
                {active === 'tax' && <TaxStep />}
                {active === 'bank' && <BankStep />}
              </CardBody>
            </Card>
          </StepFlow>

          <Inline gap="0.5rem" className="finance-demo__onboarding-nav">
            <Button
              variant="ghost"
              disabled={index === 0}
              onClick={() => setActive(STEPS[index - 1]?.id ?? active)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!isLast) setActive(STEPS[index + 1].id);
              }}
            >
              {isLast ? 'Finish setup' : 'Continue'}
            </Button>
          </Inline>
        </Stack>
      </Center>
    </div>
  );
}

function ProfileStep() {
  return (
    <Stack gap="1rem">
      <Heading level={2} size="md">
        Company profile
      </Heading>
      <Fieldset>
        <Stack gap="0.75rem">
          <Field label="Company name" required>
            <Input placeholder="Aspect Labs Inc." />
          </Field>
          <Field label="Contact email" required>
            <Input type="email" placeholder="hello@aspect.labs" />
          </Field>
          <Field label="Country" required>
            <Select defaultValue="us">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Stack>
      </Fieldset>
    </Stack>
  );
}

function AccountsStep() {
  const [template, setTemplate] = useState('consulting');
  return (
    <Stack gap="1rem">
      <Heading level={2} size="md">
        Chart of accounts template
      </Heading>
      <p className="finance-demo__section-desc">
        Pick a starting point. You can add, rename, or delete accounts later.
      </p>
      <Stack gap="0.5rem">
        {[
          { id: 'consulting', label: 'Consulting / professional services', desc: '28 accounts' },
          { id: 'saas', label: 'SaaS / subscription', desc: '32 accounts' },
          { id: 'retail', label: 'Retail / e-commerce', desc: '34 accounts' },
          { id: 'blank', label: 'Start blank', desc: '5 essentials only' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id)}
            data-active={template === t.id || undefined}
            className="finance-demo__template-option"
          >
            <strong>{t.label}</strong>
            <br />
            <span className="finance-demo__muted-sm">{t.desc}</span>
          </button>
        ))}
      </Stack>
    </Stack>
  );
}

function TaxStep() {
  return (
    <Stack gap="1rem">
      <Heading level={2} size="md">
        Tax settings
      </Heading>
      <Field
        label="Default tax rate"
        description="Applied to new invoice line items. Override per line as needed."
      >
        <TaxRateInput defaultValue={20} />
      </Field>
      <Field label="Tax ID" showOptionalHint>
        <Input placeholder="EIN 12-3456789" />
      </Field>
      <Inline gap="0.75rem" align="center">
        <Switch defaultChecked aria-label="Quarterly filing reminders" />
        <span>Email me quarterly filing reminders</span>
      </Inline>
    </Stack>
  );
}

function BankStep() {
  return (
    <Stack gap="1rem">
      <Heading level={2} size="md">
        Connect your bank
      </Heading>
      <p className="finance-demo__section-desc">
        We&apos;ll pull in your last 90 days of transactions and keep reconciliation current.
      </p>
      <Stack gap="0.5rem">
        {['Chase', 'Bank of America', 'Wells Fargo', 'Capital One', 'Mercury'].map((bank) => (
          <Inline key={bank} gap="1rem" align="center" className="finance-demo__bank-row">
            <strong>{bank}</strong>
            <Button variant="primary" size="sm">
              Connect
            </Button>
          </Inline>
        ))}
      </Stack>
      <p className="finance-demo__onboarding-note">
        Bank feeds powered by Plaid. You can skip this step and connect later.
      </p>
    </Stack>
  );
}
