'use client';

import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Title, 
  Group, 
  Button, 
  Table, 
  Badge, 
  Text,
  TextInput,
  Select,
  Tabs,
  Card,
  SimpleGrid,
  ActionIcon,
  Menu,
  Modal,
  Stack,
  NumberInput,
  Textarea,
  Divider,
  Drawer,
  ScrollArea,
  Alert,
  Pagination,
  ThemeIcon,
  Avatar
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconPlus, 
  IconSearch, 
  IconFilter, 
  IconDots, 
  IconEye, 
  IconEdit, 
  IconTrash, 
  IconDownload,
  IconFileInvoice,
  IconCash,
  IconClock,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconCalendar,
  IconUser,
  IconBuilding,
  IconCurrencyDinar
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import styles from './InvoicesPage.module.css';

// Types & Interfaces
interface Invoice {
  id: string;
  number: string;
  projectId: string;
  clientId: string;
  status: 'draft' | 'issued' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
  currency: 'IQD';
  amount: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
  dueDate?: Date;
  issuedAt?: Date;
  paymentTerms: 'advance_50' | 'advance_100' | 'net_15' | 'net_30';
  lineItems: LineItem[];
  relatedPaymentsCount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Populated data
  project?: {
    id: string;
    title: string;
    projectNumber: string;
    category: string;
  };
  client?: {
    id: string;
    name: string;
    company?: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  relatedPayments?: {
    id: string;
    amount: number;
    receivedAt: Date;
    status: string;
  }[];
}

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  paidInvoices: number;
  overdueInvoices: number;
  pendingInvoices: number;
  totalPaid: number;
  totalOverdue: number;
  averageInvoiceAmount: number;
  collectionRate: number;
  avgPaymentDays: number;
}

interface InvoiceFormData {
  projectId: string;
  clientId: string;
  paymentTerms: 'advance_50' | 'advance_100' | 'net_15' | 'net_30';
  dueDate?: Date;
  discount: number;
  notes?: string;
  lineItems: LineItem[];
}

interface InvoiceFilters {
  search: string;
  status: string;
  clientId: string;
  dateRange: [Date | null, Date | null];
  paymentTerms: string;
  amountRange: [number, number];
}

// Mock Data - الإحصائيات التجريبية
const invoiceStats: InvoiceStats = {
  totalInvoices: 127,
  totalAmount: 67850000,
  paidInvoices: 89,
  overdueInvoices: 8,
  pendingInvoices: 23,
  totalPaid: 52340000,
  totalOverdue: 4890000,
  averageInvoiceAmount: 534250,
  collectionRate: 89.3,
  avgPaymentDays: 12.4
};

// Mock Projects for invoice creation
const mockProjects = [
  { value: 'p_001', label: 'DP-2025-0345 - تصوير منتجات المطعم' },
  { value: 'p_002', label: 'DP-2025-0346 - مونتاج فيديو تسويقي' },
  { value: 'p_003', label: 'DP-2025-0347 - تصميم هوية بصرية' },
  { value: 'p_004', label: 'DP-2025-0348 - تصوير حفل زفاف' },
];

// Mock Clients 
const mockClients = [
  { value: 'cl_001', label: 'محمد أحمد السوري - مطعم الشام الأصيل' },
  { value: 'cl_002', label: 'فاطمة حسن العلي - شركة النور للتسويق' },
  { value: 'cl_003', label: 'علي محمود الجابر - مركز الأمل الطبي' },
  { value: 'cl_004', label: 'زينب سالم كريم - معرض الفن الحديث' },
];

// Mock Invoice Data
const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    number: 'INV-2025-0142',
    projectId: 'p_001',
    clientId: 'cl_001', 
    status: 'overdue',
    currency: 'IQD',
    amount: {
      subtotal: 850000,
      discount: 0,
      tax: 0,
      total: 850000
    },
    dueDate: new Date('2025-08-27'),
    issuedAt: new Date('2025-08-20'),
    paymentTerms: 'net_15',
    lineItems: [
      {
        description: 'تصوير منتجات غذائية - 20 طبق',
        quantity: 20,
        unitPrice: 35000,
        total: 700000
      },
      {
        description: 'تحرير وتعديل الصور',
        quantity: 1,
        unitPrice: 150000,
        total: 150000
      }
    ],
    relatedPaymentsCount: 0,
    notes: 'يرجى السداد في أقرب وقت ممكن',
    createdAt: new Date('2025-08-20T09:00:00'),
    updatedAt: new Date('2025-08-20T09:00:00'),
    project: {
      id: 'p_001',
      title: 'تصوير منتجات المطعم',
      projectNumber: 'DP-2025-0345',
      category: 'تصوير'
    },
    client: {
      id: 'cl_001',
      name: 'محمد أحمد السوري',
      company: 'مطعم الشام الأصيل',
      email: 'contact@alsham-restaurant.com',
      phone: '07801234567',
      avatar: '/avatars/client1.jpg'
    },
    relatedPayments: []
  },
  {
    id: 'inv_002',
    number: 'INV-2025-0138',
    projectId: 'p_002',
    clientId: 'cl_002',
    status: 'paid',
    currency: 'IQD',
    amount: {
      subtotal: 425000,
      discount: 25000,
      tax: 0,
      total: 400000
    },
    dueDate: new Date('2025-09-05'),
    issuedAt: new Date('2025-08-15'),
    paymentTerms: 'net_30',
    lineItems: [
      {
        description: 'مونتاج فيديو تسويقي - 2 دقيقة',
        quantity: 1,
        unitPrice: 350000,
        total: 350000
      },
      {
        description: 'إضافة مؤثرات صوتية',
        quantity: 1,
        unitPrice: 75000,
        total: 75000
      }
    ],
    relatedPaymentsCount: 2,
    notes: 'تم الدفع على دفعتين',
    createdAt: new Date('2025-08-15T14:30:00'),
    updatedAt: new Date('2025-08-25T11:20:00'),
    project: {
      id: 'p_002',
      title: 'مونتاج فيديو تسويقي',
      projectNumber: 'DP-2025-0346',
      category: 'مونتاج'
    },
    client: {
      id: 'cl_002',
      name: 'فاطمة حسن العلي',
      company: 'شركة النور للتسويق',
      email: 'fatima@alnoor-marketing.com',
      phone: '07712345678',
      avatar: '/avatars/client2.jpg'
    },
    relatedPayments: [
      {
        id: 'pay_001',
        amount: 200000,
        receivedAt: new Date('2025-08-18'),
        status: 'verified'
      },
      {
        id: 'pay_002', 
        amount: 200000,
        receivedAt: new Date('2025-08-25'),
        status: 'verified'
      }
    ]
  },
  {
    id: 'inv_003',
    number: 'INV-2025-0140',
    projectId: 'p_003',
    clientId: 'cl_003',
    status: 'partially_paid',
    currency: 'IQD',
    amount: {
      subtotal: 950000,
      discount: 50000,
      tax: 0,
      total: 900000
    },
    dueDate: new Date('2025-09-10'),
    issuedAt: new Date('2025-08-25'),
    paymentTerms: 'advance_50',
    lineItems: [
      {
        description: 'تصميم هوية بصرية كاملة',
        quantity: 1,
        unitPrice: 700000,
        total: 700000
      },
      {
        description: 'تصميم مواد إعلانية',
        quantity: 5,
        unitPrice: 50000,
        total: 250000
      }
    ],
    relatedPaymentsCount: 1,
    notes: 'دفع مقدم 50% - المتبقي عند التسليم',
    createdAt: new Date('2025-08-25T10:00:00'),
    updatedAt: new Date('2025-08-26T16:45:00'),
    project: {
      id: 'p_003',
      title: 'تصميم هوية بصرية',
      projectNumber: 'DP-2025-0347',
      category: 'تصميم'
    },
    client: {
      id: 'cl_003',
      name: 'علي محمود الجابر',
      company: 'مركز الأمل الطبي',
      email: 'info@alamal-medical.com',
      phone: '07723456789'
    },
    relatedPayments: [
      {
        id: 'pay_003',
        amount: 450000,
        receivedAt: new Date('2025-08-26'),
        status: 'verified'
      }
    ]
  },
  {
    id: 'inv_004',
    number: 'INV-2025-0141',
    projectId: 'p_004',
    clientId: 'cl_004',
    status: 'issued',
    currency: 'IQD',
    amount: {
      subtotal: 1200000,
      discount: 0,
      tax: 0,
      total: 1200000
    },
    dueDate: new Date('2025-09-12'),
    issuedAt: new Date('2025-08-28'),
    paymentTerms: 'net_15',
    lineItems: [
      {
        description: 'تصوير حفل زفاف - تغطية كاملة',
        quantity: 1,
        unitPrice: 800000,
        total: 800000
      },
      {
        description: 'تحرير فيديو ذكريات',
        quantity: 1,
        unitPrice: 400000,
        total: 400000
      }
    ],
    relatedPaymentsCount: 0,
    notes: 'موعد الحفل: 5 سبتمبر 2025',
    createdAt: new Date('2025-08-28T08:00:00'),
    updatedAt: new Date('2025-08-28T08:00:00'),
    project: {
      id: 'p_004',
      title: 'تصوير حفل زفاف',
      projectNumber: 'DP-2025-0348',
      category: 'تصوير'
    },
    client: {
      id: 'cl_004',
      name: 'زينب سالم كريم',
      company: 'معرض الفن الحديث',
      email: 'zeinab@modernart-gallery.com',
      phone: '07734567890'
    },
    relatedPayments: []
  }
];

// Utility Functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-IQ', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(amount) + ' د.ع';
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const getStatusColor = (status: Invoice['status']) => {
  const colors = {
    draft: 'gray',
    issued: 'blue',
    partially_paid: 'yellow', 
    paid: 'green',
    overdue: 'red',
    cancelled: 'dark'
  };
  return colors[status] || 'gray';
};

const getStatusLabel = (status: Invoice['status']) => {
  const labels = {
    draft: 'مسودة',
    issued: 'صادرة',
    partially_paid: 'مدفوعة جزئياً',
    paid: 'مدفوعة',
    overdue: 'متأخرة',
    cancelled: 'ملغاة'
  };
  return labels[status] || status;
};

const getPaymentTermsLabel = (terms: string) => {
  const labels = {
    advance_50: 'مقدم 50%',
    advance_100: 'مقدم 100%',
    net_15: 'خلال 15 يوم',
    net_30: 'خلال 30 يوم'
  };
  return labels[terms as keyof typeof labels] || terms;
};

// Main Component
export default function InvoicesPage() {
  // State Management
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filters, setFilters] = useState<InvoiceFilters>({
    search: '',
    status: 'all',
    clientId: 'all',
    dateRange: [null, null],
    paymentTerms: 'all',
    amountRange: [0, 10000000]
  });
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals and Drawers
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
  const [detailsDrawerOpened, { open: openDetailsDrawer, close: closeDetailsDrawer }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  // Form State
  const [formData, setFormData] = useState<InvoiceFormData>({
    projectId: '',
    clientId: '',
    paymentTerms: 'net_15',
    dueDate: undefined,
    discount: 0,
    notes: '',
    lineItems: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }]
  });

  // Filtered and Paginated Data
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter(invoice => 
        invoice.number.toLowerCase().includes(filters.search.toLowerCase()) ||
        invoice.client?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        invoice.client?.company?.toLowerCase().includes(filters.search.toLowerCase()) ||
        invoice.project?.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }

    // Filter by client
    if (filters.clientId !== 'all') {
      filtered = filtered.filter(invoice => invoice.clientId === filters.clientId);
    }

    // Filter by payment terms
    if (filters.paymentTerms !== 'all') {
      filtered = filtered.filter(invoice => invoice.paymentTerms === filters.paymentTerms);
    }

    return filtered;
  }, [invoices, filters]);

  // Paginated data
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInvoices.slice(startIndex, endIndex);
  }, [filteredInvoices, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Tab-specific counts
  const tabCounts = useMemo(() => {
    return {
      all: invoices.length,
      issued: invoices.filter(inv => inv.status === 'issued').length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length,
      partially_paid: invoices.filter(inv => inv.status === 'partially_paid').length,
      draft: invoices.filter(inv => inv.status === 'draft').length
    };
  }, [invoices]);

  // Event Handlers
  const handleCreateInvoice = () => {
    // TODO: API call to create invoice
    console.log('Creating invoice:', formData);
    
    notifications.show({
      title: 'تم إنشاء الفاتورة',
      message: 'تم إنشاء الفاتورة بنجاح وإرسالها للعميل',
      color: 'green',
      icon: <IconCheck size={16} />
    });
    
    closeCreateModal();
    setFormData({
      projectId: '',
      clientId: '',
      paymentTerms: 'net_15',
      dueDate: undefined,
      discount: 0,
      notes: '',
      lineItems: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    openDetailsDrawer();
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    // Populate form with invoice data
    setFormData({
      projectId: invoice.projectId,
      clientId: invoice.clientId,
      paymentTerms: invoice.paymentTerms,
      dueDate: invoice.dueDate,
      discount: invoice.amount.discount,
      notes: invoice.notes || '',
      lineItems: invoice.lineItems
    });
    openEditModal();
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    // TODO: Add confirmation modal
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
    notifications.show({
      title: 'تم حذف الفاتورة',
      message: 'تم حذف الفاتورة بنجاح',
      color: 'red'
    });
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    setFormData(prev => {
      const newLineItems = [...prev.lineItems];
      newLineItems[index] = { ...newLineItems[index], [field]: value };
      
      // Recalculate total for this line item
      if (field === 'quantity' || field === 'unitPrice') {
        newLineItems[index].total = newLineItems[index].quantity * newLineItems[index].unitPrice;
      }
      
      return { ...prev, lineItems: newLineItems };
    });
  };

  const removeLineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  // Calculate total amount
  const calculateTotal = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal - formData.discount;
    return { subtotal, total };
  };

  return (
    <Container fluid className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Group justify="space-between">
          <div>
            <Title order={2} className={styles.title}>
              <IconFileInvoice size={28} className={styles.titleIcon} />
              إدارة الفواتير
            </Title>
            <Text c="dimmed" mt={4}>
              إدارة وتتبع فواتير المشاريع والمدفوعات
            </Text>
          </div>
          <Button 
            leftSection={<IconPlus size={16} />}
            onClick={openCreateModal}
            className={styles.createButton}
          >
            إنشاء فاتورة جديدة
          </Button>
        </Group>
      </div>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        <Card className={styles.statsCard}>
          <Group>
            <ThemeIcon size="lg" variant="light" color="blue">
              <IconFileInvoice size={20} />
            </ThemeIcon>
            <div>
              <Text size="sm" c="dimmed">إجمالي الفواتير</Text>
              <Text size="xl" fw={700}>{invoiceStats.totalInvoices}</Text>
            </div>
          </Group>
        </Card>

        <Card className={styles.statsCard}>
          <Group>
            <ThemeIcon size="lg" variant="light" color="green">
              <IconCurrencyDinar size={20} />
            </ThemeIcon>
            <div>
              <Text size="sm" c="dimmed">إجمالي المبالغ</Text>
              <Text size="xl" fw={700}>{formatCurrency(invoiceStats.totalAmount)}</Text>
            </div>
          </Group>
        </Card>

        <Card className={styles.statsCard}>
          <Group>
            <ThemeIcon size="lg" variant="light" color="red">
              <IconAlertTriangle size={20} />
            </ThemeIcon>
            <div>
              <Text size="sm" c="dimmed">فواتير متأخرة</Text>
              <Text size="xl" fw={700}>{invoiceStats.overdueInvoices}</Text>
            </div>
          </Group>
        </Card>

        <Card className={styles.statsCard}>
          <Group>
            <ThemeIcon size="lg" variant="light" color="yellow">
              <IconClock size={20} />
            </ThemeIcon>
            <div>
              <Text size="sm" c="dimmed">نسبة التحصيل</Text>
              <Text size="xl" fw={700}>{invoiceStats.collectionRate}%</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Card className={styles.filtersCard} mb="md">
        <Group>
          <TextInput
            placeholder="البحث في الفواتير..."
            leftSection={<IconSearch size={16} />}
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.currentTarget.value }))}
            style={{ minWidth: 250 }}
          />
          
          <Select
            placeholder="حالة الفاتورة"
            data={[
              { value: 'all', label: 'جميع الحالات' },
              { value: 'draft', label: 'مسودة' },
              { value: 'issued', label: 'صادرة' },
              { value: 'partially_paid', label: 'مدفوعة جزئياً' },
              { value: 'paid', label: 'مدفوعة' },
              { value: 'overdue', label: 'متأخرة' },
              { value: 'cancelled', label: 'ملغاة' }
            ]}
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value || 'all' }))}
            leftSection={<IconFilter size={16} />}
          />

          <Select
            placeholder="العميل"
            data={[
              { value: 'all', label: 'جميع العملاء' },
              ...mockClients
            ]}
            value={filters.clientId}
            onChange={(value) => setFilters(prev => ({ ...prev, clientId: value || 'all' }))}
            leftSection={<IconUser size={16} />}
          />
          
          <Select
            placeholder="شروط الدفع"
            data={[
              { value: 'all', label: 'جميع الشروط' },
              { value: 'advance_50', label: 'مقدم 50%' },
              { value: 'advance_100', label: 'مقدم 100%' },
              { value: 'net_15', label: 'خلال 15 يوم' },
              { value: 'net_30', label: 'خلال 30 يوم' }
            ]}
            value={filters.paymentTerms}
            onChange={(value) => setFilters(prev => ({ ...prev, paymentTerms: value || 'all' }))}
            leftSection={<IconCash size={16} />}
          />
        </Group>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'all')} className={styles.tabs}>
        <Tabs.List>
          <Tabs.Tab value="all">
            الكل ({tabCounts.all})
          </Tabs.Tab>
          <Tabs.Tab value="issued">
            صادرة ({tabCounts.issued})
          </Tabs.Tab>
          <Tabs.Tab value="paid">
            مدفوعة ({tabCounts.paid})
          </Tabs.Tab>
          <Tabs.Tab value="overdue">
            متأخرة ({tabCounts.overdue})
          </Tabs.Tab>
          <Tabs.Tab value="partially_paid">
            مدفوعة جزئياً ({tabCounts.partially_paid})
          </Tabs.Tab>
          <Tabs.Tab value="draft">
            مسودة ({tabCounts.draft})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={activeTab} pt="md">
          {/* Invoices Table */}
          <Card className={styles.tableCard}>
            <ScrollArea>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>رقم الفاتورة</Table.Th>
                    <Table.Th>العميل</Table.Th>
                    <Table.Th>المشروع</Table.Th>
                    <Table.Th>المبلغ</Table.Th>
                    <Table.Th>الحالة</Table.Th>
                    <Table.Th>تاريخ الإصدار</Table.Th>
                    <Table.Th>تاريخ الاستحقاق</Table.Th>
                    <Table.Th>المدفوعات</Table.Th>
                    <Table.Th>الإجراءات</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {paginatedInvoices.map((invoice) => (
                    <Table.Tr key={invoice.id}>
                      <Table.Td>
                        <Text fw={500}>{invoice.number}</Text>
                      </Table.Td>
                      
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar 
                            src={invoice.client?.avatar} 
                            size={32} 
                            radius="xl" 
                          />
                          <div>
                            <Text size="sm" fw={500}>{invoice.client?.name}</Text>
                            <Text size="xs" c="dimmed">{invoice.client?.company}</Text>
                          </div>
                        </Group>
                      </Table.Td>

                      <Table.Td>
                        <div>
                          <Text size="sm" fw={500}>{invoice.project?.title}</Text>
                          <Text size="xs" c="dimmed">{invoice.project?.projectNumber}</Text>
                        </div>
                      </Table.Td>

                      <Table.Td>
                        <Text fw={700} c={invoice.status === 'paid' ? 'green' : 'dark'}>
                          {formatCurrency(invoice.amount.total)}
                        </Text>
                        {invoice.amount.discount > 0 && (
                          <Text size="xs" c="dimmed">
                            خصم: {formatCurrency(invoice.amount.discount)}
                          </Text>
                        )}
                      </Table.Td>

                      <Table.Td>
                        <Badge 
                          color={getStatusColor(invoice.status)}
                          variant="light"
                        >
                          {getStatusLabel(invoice.status)}
                        </Badge>
                      </Table.Td>

                      <Table.Td>
                        <Text size="sm">
                          {invoice.issuedAt ? formatDate(invoice.issuedAt) : '-'}
                        </Text>
                      </Table.Td>

                      <Table.Td>
                        <Text 
                          size="sm" 
                          c={invoice.status === 'overdue' ? 'red' : 'dark'}
                        >
                          {invoice.dueDate ? formatDate(invoice.dueDate) : '-'}
                        </Text>
                      </Table.Td>

                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {invoice.relatedPaymentsCount} مدفوعة
                        </Text>
                        {invoice.relatedPayments && invoice.relatedPayments.length > 0 && (
                          <Text size="xs" c="dimmed">
                            آخر دفع: {formatDate(invoice.relatedPayments[invoice.relatedPayments.length - 1].receivedAt)}
                          </Text>
                        )}
                      </Table.Td>

                      <Table.Td>
                        <Menu position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" c="gray">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item 
                              leftSection={<IconEye size={14} />}
                              onClick={() => handleViewDetails(invoice)}
                            >
                              عرض التفاصيل
                            </Menu.Item>
                            <Menu.Item 
                              leftSection={<IconEdit size={14} />}
                              onClick={() => handleEditInvoice(invoice)}
                            >
                              تعديل
                            </Menu.Item>
                            <Menu.Item 
                              leftSection={<IconDownload size={14} />}
                            >
                              تحميل PDF
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item 
                              leftSection={<IconTrash size={14} />}
                              c="red"
                              onClick={() => handleDeleteInvoice(invoice.id)}
                            >
                              حذف
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>

            {/* Pagination */}
            {totalPages > 1 && (
              <Group justify="center" mt="md">
                <Pagination
                  total={totalPages}
                  value={currentPage}
                  onChange={setCurrentPage}
                  size="sm"
                />
              </Group>
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>

      {/* Create Invoice Modal */}
      <Modal
        opened={createModalOpened}
        onClose={closeCreateModal}
        title="إنشاء فاتورة جديدة"
        size="xl"
        className={styles.modal}
      >
        <Stack gap="md">
          <Group grow>
            <Select
              label="المشروع"
              placeholder="اختر المشروع"
              data={mockProjects}
              value={formData.projectId}
              onChange={(value) => setFormData(prev => ({ ...prev, projectId: value || '' }))}
              required
              leftSection={<IconBuilding size={16} />}
            />
            
            <Select
              label="العميل"
              placeholder="اختر العميل"
              data={mockClients}
              value={formData.clientId}
              onChange={(value) => setFormData(prev => ({ ...prev, clientId: value || '' }))}
              required
              leftSection={<IconUser size={16} />}
            />
          </Group>

          <Group grow>
            <Select
              label="شروط الدفع"
              data={[
                { value: 'advance_50', label: 'مقدم 50%' },
                { value: 'advance_100', label: 'مقدم 100%' },
                { value: 'net_15', label: 'خلال 15 يوم' },
                { value: 'net_30', label: 'خلال 30 يوم' }
              ]}
              value={formData.paymentTerms}
              onChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value as 'advance_50' | 'advance_100' | 'net_15' | 'net_30' || 'net_15' }))}
              leftSection={<IconCash size={16} />}
            />
            
            <TextInput
              label="تاريخ الاستحقاق"
              placeholder="اختر التاريخ"
              value={formData.dueDate?.toLocaleDateString() || ''}
              onChange={(e) => {
                const date = e.currentTarget.value ? new Date(e.currentTarget.value) : undefined;
                setFormData(prev => ({ ...prev, dueDate: date }));
              }}
              leftSection={<IconCalendar size={16} />}
            />
          </Group>

          <Divider label="بنود الفاتورة" labelPosition="center" />

          {/* Line Items */}
          {formData.lineItems.map((item, index) => (
            <Card key={index} withBorder className={styles.lineItemCard}>
              <Group justify="space-between" mb="sm">
                <Text size="sm" fw={500}>البند {index + 1}</Text>
                {formData.lineItems.length > 1 && (
                  <ActionIcon 
                    color="red" 
                    variant="light"
                    onClick={() => removeLineItem(index)}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                )}
              </Group>
              
              <Group grow>
                <TextInput
                  placeholder="وصف الخدمة"
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.currentTarget.value)}
                />
                
                <NumberInput
                  placeholder="الكمية"
                  min={1}
                  value={item.quantity}
                  onChange={(value) => updateLineItem(index, 'quantity', Number(value))}
                />
                
                <NumberInput
                  placeholder="سعر الوحدة"
                  min={0}
                  value={item.unitPrice}
                  onChange={(value) => updateLineItem(index, 'unitPrice', Number(value))}
                />
                
                <TextInput
                  placeholder="المجموع"
                  value={formatCurrency(item.total)}
                  readOnly
                />
              </Group>
            </Card>
          ))}

            <Button 
              variant="light"
              leftSection={<IconPlus size={16} />}
              onClick={addLineItem}
            >
              إضافة بند جديد
            </Button>

          <Group grow>
            <NumberInput
              label="الخصم"
              placeholder="0"
              min={0}
              value={formData.discount}
              onChange={(value) => setFormData(prev => ({ ...prev, discount: Number(value) }))}
              leftSection={<IconCurrencyDinar size={16} />}
            />
            
            <div className={styles.totalSummary}>
              <Text size="sm" c="dimmed">المجموع الفرعي: {formatCurrency(calculateTotal().subtotal)}</Text>
              <Text size="sm" c="dimmed">الخصم: {formatCurrency(formData.discount)}</Text>
              <Text size="lg" fw={700}>الإجمالي: {formatCurrency(calculateTotal().total)}</Text>
            </div>
          </Group>

          <Textarea
            label="ملاحظات"
            placeholder="ملاحظات إضافية..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.currentTarget.value }))}
            rows={3}
          />

          <Group justify="end">
            <Button variant="outline" onClick={closeCreateModal}>
              إلغاء
            </Button>
            <Button onClick={handleCreateInvoice}>
              إنشاء الفاتورة
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Invoice Details Drawer */}
      <Drawer
        opened={detailsDrawerOpened}
        onClose={closeDetailsDrawer}
        title="تفاصيل الفاتورة"
        position="left"
        size="lg"
        className={styles.drawer}
      >
        {selectedInvoice && (
          <Stack gap="md">
            {/* Invoice Header */}
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xl" fw={700}>{selectedInvoice.number}</Text>
                  <Text c="dimmed">{selectedInvoice.project?.projectNumber}</Text>
                </div>
                <Badge 
                  color={getStatusColor(selectedInvoice.status)}
                  size="lg"
                >
                  {getStatusLabel(selectedInvoice.status)}
                </Badge>
              </Group>
            </Card>

            {/* Client Info */}
            <Card withBorder>
              <Text size="sm" fw={500} mb="sm">معلومات العميل</Text>
              <Group>
                <Avatar 
                  src={selectedInvoice.client?.avatar} 
                  size={50} 
                  radius="xl" 
                />
                <div>
                  <Text fw={500}>{selectedInvoice.client?.name}</Text>
                  <Text size="sm" c="dimmed">{selectedInvoice.client?.company}</Text>
                  <Text size="sm" c="dimmed">{selectedInvoice.client?.email}</Text>
                  <Text size="sm" c="dimmed">{selectedInvoice.client?.phone}</Text>
                </div>
              </Group>
            </Card>

            {/* Project Info */}
            <Card withBorder>
              <Text size="sm" fw={500} mb="sm">معلومات المشروع</Text>
              <Text fw={500}>{selectedInvoice.project?.title}</Text>
              <Text size="sm" c="dimmed">{selectedInvoice.project?.projectNumber}</Text>
              <Text size="sm" c="dimmed">الفئة: {selectedInvoice.project?.category}</Text>
            </Card>

            {/* Amount Details */}
            <Card withBorder>
              <Text size="sm" fw={500} mb="sm">تفاصيل المبلغ</Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">المجموع الفرعي</Text>
                  <Text size="sm">{formatCurrency(selectedInvoice.amount.subtotal)}</Text>
                </Group>
                {selectedInvoice.amount.discount > 0 && (
                  <Group justify="space-between">
                    <Text size="sm" c="red">الخصم</Text>
                    <Text size="sm" c="red">-{formatCurrency(selectedInvoice.amount.discount)}</Text>
                  </Group>
                )}
                <Divider />
                <Group justify="space-between">
                  <Text fw={700}>الإجمالي</Text>
                  <Text fw={700} size="lg">{formatCurrency(selectedInvoice.amount.total)}</Text>
                </Group>
              </Stack>
            </Card>

            {/* Line Items */}
            <Card withBorder>
              <Text size="sm" fw={500} mb="sm">بنود الفاتورة</Text>
              {selectedInvoice.lineItems.map((item, index) => (
                <Group key={index} justify="space-between" p="xs" className={styles.lineItem}>
                  <div>
                    <Text size="sm" fw={500}>{item.description}</Text>
                    <Text size="xs" c="dimmed">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </Text>
                  </div>
                  <Text size="sm" fw={500}>{formatCurrency(item.total)}</Text>
                </Group>
              ))}
            </Card>

            {/* Payment Info */}
            <Card withBorder>
              <Text size="sm" fw={500} mb="sm">معلومات الدفع</Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">شروط الدفع</Text>
                  <Text size="sm">{getPaymentTermsLabel(selectedInvoice.paymentTerms)}</Text>
                </Group>
                {selectedInvoice.issuedAt && (
                  <Group justify="space-between">
                    <Text size="sm">تاريخ الإصدار</Text>
                    <Text size="sm">{formatDate(selectedInvoice.issuedAt)}</Text>
                  </Group>
                )}
                {selectedInvoice.dueDate && (
                  <Group justify="space-between">
                    <Text size="sm">تاريخ الاستحقاق</Text>
                    <Text 
                      size="sm" 
                      c={selectedInvoice.status === 'overdue' ? 'red' : 'dark'}
                    >
                      {formatDate(selectedInvoice.dueDate)}
                    </Text>
                  </Group>
                )}
                <Group justify="space-between">
                  <Text size="sm">عدد المدفوعات</Text>
                  <Text size="sm">{selectedInvoice.relatedPaymentsCount}</Text>
                </Group>
              </Stack>
            </Card>

            {/* Related Payments */}
            {selectedInvoice.relatedPayments && selectedInvoice.relatedPayments.length > 0 && (
              <Card withBorder>
                <Text size="sm" fw={500} mb="sm">المدفوعات المرتبطة</Text>
                {selectedInvoice.relatedPayments.map((payment) => (
                  <Group key={payment.id} justify="space-between" p="xs" className={styles.paymentItem}>
                    <div>
                      <Text size="sm" fw={500}>{formatCurrency(payment.amount)}</Text>
                      <Text size="xs" c="dimmed">{formatDate(payment.receivedAt)}</Text>
                    </div>
                    <Badge 
                      color={payment.status === 'verified' ? 'green' : 'yellow'}
                      size="sm"
                    >
                      {payment.status === 'verified' ? 'مدقق' : 'معلق'}
                    </Badge>
                  </Group>
                ))}
              </Card>
            )}

            {/* Notes */}
            {selectedInvoice.notes && (
              <Card withBorder>
                <Text size="sm" fw={500} mb="sm">ملاحظات</Text>
                <Text size="sm">{selectedInvoice.notes}</Text>
              </Card>
            )}

            {/* Actions */}
            <Group justify="end">
              <Button 
                variant="outline"
                leftSection={<IconDownload size={16} />}
              >
                تحميل PDF
              </Button>
              <Button 
                leftSection={<IconEdit size={16} />}
                onClick={() => {
                  handleEditInvoice(selectedInvoice);
                  closeDetailsDrawer();
                }}
              >
                تعديل الفاتورة
              </Button>
            </Group>
          </Stack>
        )}
      </Drawer>

      {/* Edit Invoice Modal */}
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="تعديل الفاتورة"
        size="xl"
        className={styles.modal}
      >
        {/* Same form content as create modal - can be extracted to component */}
        <Stack gap="md">
          <Alert color="blue" icon={<IconFileInvoice size={16} />}>
            تعديل فاتورة: {selectedInvoice?.number}
          </Alert>
          
          {/* Form content similar to create modal */}
          {/* ... (same structure as create modal) */}
          
          <Group justify="end">
            <Button variant="outline" onClick={closeEditModal}>
              إلغاء
            </Button>
            <Button onClick={() => {
              // TODO: Handle edit
              closeEditModal();
              notifications.show({
                title: 'تم تحديث الفاتورة',
                message: 'تم تحديث الفاتورة بنجاح',
                color: 'green'
              });
            }}>
              حفظ التغييرات
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
