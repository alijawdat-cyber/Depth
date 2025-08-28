'use client';

import React, { useState, useMemo } from 'react';
import { Table, Pagination, TextInput, ActionIcon, Group, Text, Stack, Flex, Box } from '@mantine/core';
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import styles from './DataTable.module.css';

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export interface DataTableProps {
  /** Table columns configuration */
  columns: DataTableColumn[];
  /** Table data array */
  data: Record<string, unknown>[];
  /** Whether the table is loading */
  loading?: boolean;
  /** Enable search functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Enable pagination */
  paginated?: boolean;
  /** Rows per page */
  pageSize?: number;
  /** Enable row selection */
  selectable?: boolean;
  /** Selected row IDs */
  selectedRows?: string[];
  /** Selection change handler */
  onSelectionChange?: (selectedRows: string[]) => void;
  /** Row click handler */
  onRowClick?: (row: Record<string, unknown>) => void;
  /** Empty state message */
  emptyText?: string;
  /** Table size */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Table variant */
  variant?: 'default' | 'striped' | 'bordered';
  /** Additional CSS classes */
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = 'البحث...',
  paginated = true,
  pageSize = 10,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  emptyText = 'لا توجد بيانات',
  size = 'sm',
  variant = 'default',
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key];
        if (value == null) return false;
        return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
      })
    );
  }, [data, searchQuery, columns]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, paginated]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleRowSelection = (rowId: string) => {
    if (!selectable || !onSelectionChange) return;

    const isSelected = selectedRows.includes(rowId);
    if (isSelected) {
      onSelectionChange(selectedRows.filter(id => id !== rowId));
    } else {
      onSelectionChange([...selectedRows, rowId]);
    }
  };

  const renderSortIcon = (column: DataTableColumn) => {
    if (!column.sortable) return null;
    
    if (sortColumn !== column.key) {
      return <ChevronUp className={styles.sortIcon} size={14} />;
    }
    
    return sortDirection === 'asc' 
      ? <ChevronUp className={`${styles.sortIcon} ${styles.active}`} size={14} />
      : <ChevronDown className={`${styles.sortIcon} ${styles.active}`} size={14} />;
  };

  return (
    <Stack className={`${styles.dataTable} ${className || ''}`}>
      {/* Search Bar */}
      {searchable && (
        <Flex justify="space-between" align="center" className={styles.searchSection}>
          <TextInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<Search size={16} />}
            rightSection={
              searchQuery && (
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </ActionIcon>
              )
            }
            className={styles.searchInput}
          />
          <Text size="sm" className="text-secondary">
            {sortedData.length} من النتائج
          </Text>
        </Flex>
      )}

      {/* Table */}
      <Box className={styles.tableWrapper}>
        <Table
          striped={variant === 'striped'}
          withTableBorder={variant === 'bordered'}
          className={styles.table}
        >
          <Table.Thead>
            <Table.Tr>
              {selectable && (
                <Table.Th className={styles.checkboxColumn}>
                  {/* Select All checkbox could go here */}
                </Table.Th>
              )}
              {columns.map((column) => (
                <Table.Th
                  key={column.key}
                  className={`${styles.headerCell} ${column.sortable ? styles.sortable : ''}`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <Group gap={4} wrap="nowrap">
                    <Text fw={600}>{column.label}</Text>
                    {renderSortIcon(column)}
                  </Group>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <Text ta="center" py="xl" c="dimmed">
                    جاري التحميل...
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : paginatedData.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <Text ta="center" py="xl" c="dimmed">
                    {emptyText}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedData.map((row, index) => (
                <Table.Tr
                  key={(row.id as string) || index}
                  className={`${styles.tableRow} ${onRowClick ? styles.clickable : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <Table.Td className={styles.checkboxColumn}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id as string)}
                        onChange={() => handleRowSelection(row.id as string)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Table.Td>
                  )}
                  {columns.map((column) => (
                    <Table.Td key={column.key} className={styles.cell}>
                      {column.render 
                        ? column.render(row[column.key], row) 
                        : String(row[column.key] ?? '')
                      }
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <Flex justify="center" align="center" className={styles.paginationSection}>
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            size="sm"
          />
        </Flex>
      )}
    </Stack>
  );
};
