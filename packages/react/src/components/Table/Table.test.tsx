import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table';

function BasicTable() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Email</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell>ada@example.com</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Alan</TableCell>
          <TableCell>alan@example.com</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe('Table', () => {
  it('renders a table element', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders header cells', () => {
    render(<BasicTable />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders body cells', () => {
    render(<BasicTable />);
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('alan@example.com')).toBeInTheDocument();
  });

  it('renders rows', () => {
    render(<BasicTable />);
    expect(screen.getAllByRole('row').length).toBe(3);
  });

  it('wraps table in a scroll wrapper', () => {
    const { container } = render(<BasicTable />);
    expect(container.querySelector('.mizu-table-wrapper')).toBeInTheDocument();
  });

  it('applies the mizu-table class', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table')).toHaveClass('mizu-table');
  });

  it('applies sticky header class', () => {
    render(
      <Table stickyHeader>
        <TableBody>
          <TableRow>
            <TableCell>X</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table')).toHaveClass('mizu-table--sticky');
  });

  it('does not apply sticky class by default', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table')).not.toHaveClass('mizu-table--sticky');
  });

  it('applies compact density', () => {
    render(
      <Table density="compact">
        <TableBody>
          <TableRow>
            <TableCell>X</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table')).toHaveAttribute('data-density', 'compact');
  });

  it('applies comfortable density', () => {
    render(
      <Table density="comfortable">
        <TableBody>
          <TableRow>
            <TableCell>X</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table')).toHaveAttribute('data-density', 'comfortable');
  });

  it('does not set density attr for default', () => {
    render(<BasicTable />);
    expect(screen.getByRole('table')).not.toHaveAttribute('data-density');
  });

  it('marks selected rows with data-selected', () => {
    render(
      <Table>
        <TableBody>
          <TableRow selected>
            <TableCell>Selected</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Not selected</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const rows = screen.getAllByRole('row');
    expect(rows[0]).toHaveAttribute('data-selected', 'true');
    expect(rows[1]).not.toHaveAttribute('data-selected');
  });

  it('renders a caption', () => {
    render(
      <Table>
        <TableCaption>Customer list</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>X</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText('Customer list')).toBeInTheDocument();
  });

  it('merges custom className on Table', () => {
    render(
      <Table className="custom">
        <TableBody>
          <TableRow>
            <TableCell>X</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('table')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>X</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<BasicTable />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations with caption', async () => {
    const { container } = render(
      <Table>
        <TableCaption>List</TableCaption>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
