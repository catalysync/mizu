import type { Meta, StoryObj } from '@storybook/react-vite';
import { formatAccounting } from '@aspect/finance';
import { profitAndLoss, balanceSheet, type ReportRow } from './data';

function ReportDocument() {
  const renderRow = (row: ReportRow, i: number) => {
    switch (row.type) {
      case 'section':
        return (
          <tr key={i} className="mizu-report__section-header">
            <td colSpan={3}>{row.label}</td>
          </tr>
        );
      case 'item':
        return (
          <tr
            key={i}
            className={`mizu-report__row ${row.drillDown ? 'mizu-report__row--link' : ''} ${row.negative ? 'mizu-report__row--negative' : ''}`}
          >
            <td>{row.label}</td>
            <td>{formatAccounting(row.current)}</td>
            <td>{formatAccounting(row.prior)}</td>
          </tr>
        );
      case 'subtotal':
        return (
          <tr key={i} className="mizu-report__subtotal">
            <td>{row.label}</td>
            <td>{formatAccounting(row.current)}</td>
            <td>{formatAccounting(row.prior)}</td>
          </tr>
        );
      case 'total':
        return (
          <tr key={i} className="mizu-report__total">
            <td>{row.label}</td>
            <td>{formatAccounting(row.current)}</td>
            <td>{formatAccounting(row.prior)}</td>
          </tr>
        );
    }
  };

  return (
    <div data-mizu-theme="reports" data-mizu-density="comfortable">
      <div className="mizu-report">
        <div className="mizu-report__header">
          <div className="mizu-report__company">Aspect Technologies Inc.</div>
          <div className="mizu-report__title">Profit and Loss</div>
          <div className="mizu-report__period">January – March 2026</div>
        </div>
        <table className="mizu-report__table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Current Period</th>
              <th>Prior Period</th>
            </tr>
          </thead>
          <tbody>{profitAndLoss.map(renderRow)}</tbody>
        </table>
      </div>
    </div>
  );
}

const meta = {
  title: 'Demos/Reports',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light', values: [{ name: 'light', value: '#f3f4f6' }] },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProfitAndLoss: Story = {
  render: () => <ReportDocument />,
};

function BalanceSheetDocument() {
  const renderRow = (row: ReportRow, i: number) => {
    switch (row.type) {
      case 'section':
        return (
          <tr key={i} className="mizu-report__section-header">
            <td colSpan={3}>{row.label}</td>
          </tr>
        );
      case 'item':
        return (
          <tr
            key={i}
            className={`mizu-report__row ${row.drillDown ? 'mizu-report__row--link' : ''}`}
          >
            <td>{row.label}</td>
            <td>{formatAccounting(row.current)}</td>
            <td>{formatAccounting(row.prior)}</td>
          </tr>
        );
      case 'subtotal':
        return (
          <tr key={i} className="mizu-report__subtotal">
            <td>{row.label}</td>
            <td>{formatAccounting(row.current)}</td>
            <td>{formatAccounting(row.prior)}</td>
          </tr>
        );
      case 'total':
        return (
          <tr key={i} className="mizu-report__total">
            <td>{row.label}</td>
            <td>{formatAccounting(row.current)}</td>
            <td>{formatAccounting(row.prior)}</td>
          </tr>
        );
    }
  };

  return (
    <div data-mizu-theme="reports" data-mizu-density="comfortable">
      <div className="mizu-report">
        <div className="mizu-report__header">
          <div className="mizu-report__company">Aspect Technologies Inc.</div>
          <div className="mizu-report__title">Balance Sheet</div>
          <div className="mizu-report__period">As of March 31, 2026</div>
        </div>
        <table className="mizu-report__table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Current Period</th>
              <th>Prior Period</th>
            </tr>
          </thead>
          <tbody>{balanceSheet.map(renderRow)}</tbody>
        </table>
      </div>
    </div>
  );
}

export const BalanceSheet: Story = {
  render: () => <BalanceSheetDocument />,
};
