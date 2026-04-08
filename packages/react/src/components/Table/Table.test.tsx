import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from './Table';

const Sample = () => (
  <Table>
    <TableHead>
      <TableRow>
        <TableHeader>Name</TableHeader>
        <TableHeader>Status</TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>app-1</TableCell>
        <TableCell>running</TableCell>
      </TableRow>
      <TableRow selected>
        <TableCell>app-2</TableCell>
        <TableCell>idle</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

describe('Table', () => {
  it('renders header and body cells', () => {
    render(<Sample />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByText('app-1')).toBeInTheDocument();
  });

  it('marks selected rows via data attribute', () => {
    render(<Sample />);
    const rows = screen.getAllByRole('row');
    expect(rows[2]).toHaveAttribute('data-selected', 'true');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Sample />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
