import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { Badge, Group, ActionIcon, Text } from '@mantine/core';
import { Edit, Trash2, Eye } from 'lucide-react';

const meta = {
  title: 'Design System/Molecules/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'مكون DataTable لعرض البيانات في جدول مع إمكانيات البحث والترتيب والتصفح'
      }
    }
  },
  argTypes: {
    loading: { control: 'boolean' },
    searchable: { control: 'boolean' },
    paginated: { control: 'boolean' },
    selectable: { control: 'boolean' },
    pageSize: { control: { type: 'range', min: 5, max: 50 } },
    variant: {
      control: { type: 'select' },
      options: ['default', 'striped', 'bordered']
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg']
    }
  }
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const sampleUsers = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    role: 'مدير',
    status: 'نشط',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20 14:30'
  },
  {
    id: '2',
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    role: 'محرر',
    status: 'نشط',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-19 09:15'
  },
  {
    id: '3',
    name: 'محمد حسن',
    email: 'mohamed@example.com',
    role: 'عضو',
    status: 'غير نشط',
    joinDate: '2024-01-05',
    lastLogin: '2024-01-18 16:45'
  },
  {
    id: '4',
    name: 'عائشة أحمد',
    email: 'aisha@example.com',
    role: 'مراجع',
    status: 'نشط',
    joinDate: '2024-01-12',
    lastLogin: '2024-01-20 11:20'
  },
  {
    id: '5',
    name: 'علي محمود',
    email: 'ali@example.com',
    role: 'عضو',
    status: 'معلق',
    joinDate: '2024-01-08',
    lastLogin: '2024-01-17 13:10'
  }
];

const sampleOrders = [
  {
    id: 'ORD-001',
    customer: 'شركة التقنية المتقدمة',
    amount: 1500.00,
    status: 'مكتمل',
    date: '2024-01-20',
    items: 5
  },
  {
    id: 'ORD-002',
    customer: 'مؤسسة الإبداع',
    amount: 2300.50,
    status: 'قيد المعالجة',
    date: '2024-01-19',
    items: 8
  },
  {
    id: 'ORD-003',
    customer: 'شركة النجاح',
    amount: 890.25,
    status: 'ملغي',
    date: '2024-01-18',
    items: 3
  }
];

// Basic columns for users
const userColumns = [
  { key: 'name', label: 'الاسم', sortable: true },
  { key: 'email', label: 'البريد الإلكتروني', sortable: true },
  { key: 'role', label: 'الدور', sortable: true },
  {
    key: 'status',
    label: 'الحالة',
    render: (value: unknown) => (
      <Badge 
        color={value === 'نشط' ? 'green' : value === 'غير نشط' ? 'red' : 'yellow'}
        variant="light"
      >
        {String(value)}
      </Badge>
    )
  },
  { key: 'joinDate', label: 'تاريخ الانضمام', sortable: true },
  { key: 'lastLogin', label: 'آخر دخول', sortable: true }
];

// Enhanced columns with actions
const enhancedUserColumns = [
  { key: 'name', label: 'الاسم', sortable: true },
  { key: 'email', label: 'البريد الإلكتروني', sortable: true },
  {
    key: 'status',
    label: 'الحالة',
    render: (value: unknown) => (
      <Badge 
        color={value === 'نشط' ? 'green' : value === 'غير نشط' ? 'red' : 'yellow'}
        variant="light"
      >
        {String(value)}
      </Badge>
    )
  },
  {
    key: 'actions',
    label: 'الإجراءات',
    render: () => (
      <Group gap="xs">
        <ActionIcon size="sm" variant="light" color="blue">
          <Eye size={14} />
        </ActionIcon>
        <ActionIcon size="sm" variant="light" color="green">
          <Edit size={14} />
        </ActionIcon>
        <ActionIcon size="sm" variant="light" color="red">
          <Trash2 size={14} />
        </ActionIcon>
      </Group>
    )
  }
];

// Order columns
const orderColumns = [
  { key: 'id', label: 'رقم الطلب', sortable: true },
  { key: 'customer', label: 'العميل', sortable: true },
  {
    key: 'amount',
    label: 'المبلغ',
    sortable: true,
    render: (value: unknown) => (
      <Text fw={600} c="green.7">
        {Number(value).toFixed(2)} ر.س
      </Text>
    )
  },
  {
    key: 'status',
    label: 'الحالة',
    render: (value: unknown) => (
      <Badge 
        color={
          value === 'مكتمل' ? 'green' : 
          value === 'قيد المعالجة' ? 'blue' : 'red'
        }
        variant="light"
      >
        {String(value)}
      </Badge>
    )
  },
  { key: 'date', label: 'التاريخ', sortable: true },
  { key: 'items', label: 'عدد العناصر', sortable: true }
];

// Stories
export const Default: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    searchPlaceholder: 'البحث في المستخدمين...'
  }
};

export const WithActions: Story = {
  args: {
    columns: enhancedUserColumns,
    data: sampleUsers,
    searchPlaceholder: 'البحث في المستخدمين...',
    onRowClick: (row) => console.log('Row clicked:', row)
  }
};

export const OrdersTable: Story = {
  args: {
    columns: orderColumns,
    data: sampleOrders,
    searchPlaceholder: 'البحث في الطلبات...',
    pageSize: 5
  }
};

export const Striped: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    variant: 'striped',
    searchPlaceholder: 'البحث...'
  }
};

export const Bordered: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    variant: 'bordered',
    searchPlaceholder: 'البحث...'
  }
};

export const Selectable: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    selectable: true,
    selectedRows: ['1', '3'],
    onSelectionChange: (selected) => console.log('Selection changed:', selected),
    searchPlaceholder: 'البحث...'
  }
};

export const Loading: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    loading: true,
    searchPlaceholder: 'البحث...'
  }
};

export const Empty: Story = {
  args: {
    columns: userColumns,
    data: [],
    emptyText: 'لم يتم العثور على مستخدمين',
    searchPlaceholder: 'البحث...'
  }
};

export const NonSearchable: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    searchable: false
  }
};

export const NonPaginated: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    paginated: false,
    searchPlaceholder: 'البحث...'
  }
};

export const SmallPageSize: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    pageSize: 3,
    searchPlaceholder: 'البحث...'
  }
};

export const LargeSize: Story = {
  args: {
    columns: userColumns,
    data: sampleUsers,
    size: 'lg',
    searchPlaceholder: 'البحث...'
  }
};
