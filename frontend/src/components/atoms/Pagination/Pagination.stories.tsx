import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';
import type { PaginationProps } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Atoms/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    total: {
      control: { type: 'number', min: 1, max: 100, step: 1 },
      description: 'Total number of pages',
    },
    siblings: {
      control: { type: 'number', min: 0, max: 3, step: 1 },
      description: 'Number of siblings on each side',
    },
    boundaries: {
      control: { type: 'number', min: 0, max: 3, step: 1 },
      description: 'Number of elements on edges',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of pagination',
    },
    withEdges: {
      control: 'boolean',
      description: 'Show first/last buttons',
    },
    withControls: {
      control: 'boolean',
      description: 'Show previous/next buttons',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Hook component for interactive stories
const PaginationWithState = ({ initialPage = 1, total = 10, ...props }: { initialPage?: number; total?: number } & Partial<PaginationProps>) => {
  const [activePage, setActivePage] = useState(initialPage);
  
  return (
    <Pagination
      {...props}
      total={total}
      value={activePage}
      onChange={setActivePage}
    />
  );
};

export const Default: Story = {
  render: () => <PaginationWithState total={10} />,
};

export const WithEdges: Story = {
  render: () => (
    <PaginationWithState 
      total={20}
      withEdges
      siblings={2}
      boundaries={2}
    />
  ),
};

export const NoControls: Story = {
  render: () => (
    <PaginationWithState 
      total={10}
      withControls={false}
    />
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="text-center">
          <div className="text-sm font-medium mb-2">{size}</div>
          <PaginationWithState 
            total={10}
            size={size}
            initialPage={3}
          />
        </div>
      ))}
    </div>
  ),
};

export const LargePage: Story = {
  render: () => (
    <PaginationWithState 
      total={100}
      initialPage={45}
      siblings={1}
      boundaries={1}
      withEdges
    />
  ),
};

export const CustomSpacing: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-sm font-medium mb-2">Small Gap</div>
        <PaginationWithState 
          total={10}
          gap="xs"
          initialPage={3}
        />
      </div>
      <div className="text-center">
        <div className="text-sm font-medium mb-2">Large Gap</div>
        <PaginationWithState 
          total={10}
          gap="xl"
          initialPage={3}
        />
      </div>
    </div>
  ),
};

// Data table pagination component
const DataTableWithPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 247;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mock table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-lg font-semibold">User List</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {Array.from({ length: itemsPerPage }, (_, i) => (
              <div key={i} className="flex justify-between items-center py-2 px-3 bg-surface-subtle rounded">
                <span>User {startItem + i}</span>
                <span className="text-sm text-secondary">user{startItem + i}@example.com</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Pagination with info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-secondary">
          Showing {startItem}-{endItem} of {totalItems} results
        </div>
        <Pagination
          value={currentPage}
          onChange={setCurrentPage}
          total={totalPages}
          siblings={1}
          boundaries={1}
          withEdges
        />
      </div>
    </div>
  );
};

export const InDataTableContext: Story = {
  render: () => <DataTableWithPagination />,
};
