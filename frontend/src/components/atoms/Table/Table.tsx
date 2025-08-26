'use client';

import React from 'react';
import { Table as MantineTable } from '@mantine/core';
import type { TableProps as MantineTableProps } from '@mantine/core';

export interface TableProps extends MantineTableProps {
  /** Table data */
  data?: {
    head?: string[];
    body?: string[][];
  };
  /** Whether table should have striped rows */
  striped?: boolean;
  /** Whether table rows should be highlighted on hover */
  highlightOnHover?: boolean;
  /** Whether table should have border */
  withTableBorder?: boolean;
  /** Whether columns should have border */
  withColumnBorders?: boolean;
  /** Whether rows should have border */
  withRowBorders?: boolean;
  /** Table size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Vertical alignment of table content */
  verticalSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Horizontal spacing of table content */
  horizontalSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Table content */
  children?: React.ReactNode;
  /** Caption for the table */
  captionSide?: 'top' | 'bottom';
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ 
    data,
    striped = false,
    highlightOnHover = false,
    withTableBorder = true,
    withColumnBorders = false,
    withRowBorders = true,
    verticalSpacing = 'sm',
    horizontalSpacing = 'sm',
    captionSide = 'bottom',
    children,
    ...props 
  }, ref) => {
    return (
      <MantineTable
        ref={ref}
        striped={striped}
        highlightOnHover={highlightOnHover}
        withTableBorder={withTableBorder}
        withColumnBorders={withColumnBorders}
        withRowBorders={withRowBorders}
        verticalSpacing={verticalSpacing}
        horizontalSpacing={horizontalSpacing}
        captionSide={captionSide}
        style={{
          '--table-border-color': 'var(--depth-border)',
          '--table-striped-color': 'var(--depth-surface-hover)',
          '--table-hover-color': 'var(--depth-surface-hover)',
          ...props.style,
        }}
        {...props}
      >
        {data ? (
          <>
            {data.head && (
              <MantineTable.Thead>
                <MantineTable.Tr>
                  {data.head.map((header, index) => (
                    <MantineTable.Th key={index}>{header}</MantineTable.Th>
                  ))}
                </MantineTable.Tr>
              </MantineTable.Thead>
            )}
            {data.body && (
              <MantineTable.Tbody>
                {data.body.map((row, rowIndex) => (
                  <MantineTable.Tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <MantineTable.Td key={cellIndex}>{cell}</MantineTable.Td>
                    ))}
                  </MantineTable.Tr>
                ))}
              </MantineTable.Tbody>
            )}
          </>
        ) : (
          children
        )}
      </MantineTable>
    );
  }
);

Table.displayName = 'Table';

// Export table sub-components
export const TableThead = MantineTable.Thead;
export const TableTbody = MantineTable.Tbody;
export const TableTfoot = MantineTable.Tfoot;
export const TableTr = MantineTable.Tr;
export const TableTh = MantineTable.Th;
export const TableTd = MantineTable.Td;
export const TableCaption = MantineTable.Caption;
