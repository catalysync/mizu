import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import * as pkg from '../../index';
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
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
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

  it('puts className on the scroll wrapper, not the table', () => {
    const { container } = render(
      <Table className="custom">
        <TableBody>
          <TableRow>
            <TableCell>X</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(container.querySelector('.mizu-table-wrapper')).toHaveClass('custom');
    expect(screen.getByRole('table')).not.toHaveClass('custom');
  });

  it('forwards ref to the scroll wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Table ref={ref}>
        <TableBody>
          <TableRow>
            <TableCell>X</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('mizu-table-wrapper');
  });

  it('applies bordered, striped and stickyFirstColumn as modifier classes', () => {
    render(
      <Table bordered striped stickyFirstColumn>
        <TableBody>
          <TableRow>
            <TableCell>X</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const table = screen.getByRole('table');
    expect(table).toHaveClass(
      'mizu-table--bordered',
      'mizu-table--striped',
      'mizu-table--sticky-first',
    );
  });

  it('applies no modifier classes by default', () => {
    render(<BasicTable />);
    const table = screen.getByRole('table');
    expect(table).not.toHaveClass('mizu-table--bordered');
    expect(table).not.toHaveClass('mizu-table--striped');
    expect(table).not.toHaveClass('mizu-table--sticky-first');
  });

  it('renders the caption prop as a <caption> inside the table', () => {
    render(
      <Table caption="Customer list">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const table = screen.getByRole('table');
    expect(table.querySelector(':scope > caption')).toHaveTextContent('Customer list');
    expect(table).toHaveAccessibleName('Customer list');
  });

  it('has no axe violations with the caption prop', async () => {
    const { container } = render(
      <Table caption="Customer list">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations', async () => {
    const { container } = render(<BasicTable />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations with caption', async () => {
    const { container } = render(
      <Table>
        <TableCaption>List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
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

describe('Table section and cell names', () => {
  // TableHeader is the <thead> section and TableHead is the <th> cell, the
  // names most React table APIs use. They were reversed, which produced a
  // <th> where <thead> was meant (invalid DOM) for anyone typing them.
  it('TableHeader renders <thead> and TableHead renders <th>', () => {
    const { container } = render(
      <Table>
        <TableHeader data-testid="section">
          <TableRow>
            <TableHead data-testid="cell">Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByTestId('section').tagName).toBe('THEAD');
    expect(screen.getByTestId('cell').tagName).toBe('TH');
    expect(container.querySelector('table > thead > tr > th')).not.toBeNull();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });

  it('exports both names from the package entry', () => {
    expect(pkg.TableHeader.displayName).toBe('TableHeader');
    expect(pkg.TableHead.displayName).toBe('TableHead');
  });

  it('has no axe violations with the corrected names', async () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
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

describe('TableHead scope', () => {
  it('defaults header cells to scope="col"', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col');
  });

  it('lets callers set scope="row"', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableHead scope="row">Ada</TableHead>
            <TableCell>Engineer</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('rowheader', { name: 'Ada' })).toHaveAttribute('scope', 'row');
  });
});
