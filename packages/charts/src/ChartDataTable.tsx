import * as React from 'react';

export interface ChartDataTableProps {
  caption: string;
  columns: React.ReactNode[];
  rows: React.ReactNode[][];
}

/**
 * Visually hidden table that carries the chart's values for screen readers
 * and anyone who wants the raw numbers. The chart itself is SVG and is not
 * announced as a data structure.
 */
export function ChartDataTable({ caption, columns, rows }: ChartDataTableProps) {
  return (
    <table className="mizu-sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) =>
              cellIndex === 0 ? (
                <th key={cellIndex} scope="row">
                  {cell}
                </th>
              ) : (
                <td key={cellIndex}>{cell}</td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
