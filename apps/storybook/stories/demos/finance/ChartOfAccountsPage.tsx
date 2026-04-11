import { AppContentHeader, Button, Card, CardBody, Inline, Stack } from '@aspect/react';
import { ChartOfAccounts } from '@aspect/finance';
import { accounts } from './data';

export function ChartOfAccountsPage() {
  return (
    <Stack gap="1.5rem">
      <AppContentHeader
        title="Chart of accounts"
        description="Hierarchical ledger of every account you track."
        actions={
          <Inline gap="0.5rem">
            <Button variant="ghost">Import</Button>
            <Button variant="primary">New account</Button>
          </Inline>
        }
      />

      <Card>
        <CardBody>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '5rem minmax(0, 1fr) 4rem 8rem',
              gap: 'var(--mizu-spacing-2)',
              padding: 'var(--mizu-spacing-2) var(--mizu-spacing-3) var(--mizu-spacing-1)',
              borderBottom: '1px solid var(--mizu-border-default)',
              color: 'var(--mizu-text-secondary)',
              fontFamily: 'var(--mizu-font-family-sans)',
              fontSize: 'var(--mizu-font-size-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <span>Code</span>
            <span>Name</span>
            <span>Type</span>
            <span style={{ textAlign: 'end' }}>Balance</span>
          </div>
          <ChartOfAccounts
            accounts={accounts}
            onAccountClick={() => {
              /* no-op in demo — real app would navigate to account detail */
            }}
          />
        </CardBody>
      </Card>
    </Stack>
  );
}
