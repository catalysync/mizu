import { ChartOfAccounts } from '@aspect/finance';
import { AppContentHeader, Button, Card, CardBody, Inline, Stack } from '@aspect/react';
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
          <div className="finance-demo__coa-head">
            <span>Code</span>
            <span>Name</span>
            <span>Type</span>
            <span>Balance</span>
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
