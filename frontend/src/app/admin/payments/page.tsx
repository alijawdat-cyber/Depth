'use client';

import React, { useState } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Card,
  Text,
  Badge,
  Table,
  TextInput,
  Select,
  Modal,
  NumberInput,
  Textarea,
  ActionIcon,
  Menu,
  Pagination,
  Loader,
  Alert,
  Tabs,
  Grid,
  Stack,
  Divider,
  Paper,
  Avatar,
  Anchor,
  ScrollArea,
  Input
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import styles from './PaymentsPage.module.css';

// Types & Interfaces
interface Payment {
  id: string;
  invoiceId: string;
  clientId: string;
  amount: number;
  method: 'manual';
  reference?: string;
  receivedAt: Date;
  verifiedBy: string;
  verifiedAt?: Date;
  notes?: string;
  status: 'pending_verification' | 'verified' | 'disputed';
  createdAt: Date;
  updatedAt: Date;
  // Populated fields
  invoice?: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    status: string;
    issuedAt: Date;
  };
  client?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  verifier?: {
    name: string;
    email: string;
  };
}

interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  pendingVerification: number;
  todayPayments: number;
  monthlyPayments: number;
  averagePayment: number;
  verifiedPayments: number;
  disputedPayments: number;
}

interface PaymentFormData {
  invoiceId: string;
  amount: number;
  reference: string;
  receivedAt: string;
  notes: string;
}

interface PaymentFilters {
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  method: string;
}

// Mock Data
const mockStats: PaymentStats = {
  totalPayments: 156,
  totalAmount: 45280000,
  pendingVerification: 12,
  todayPayments: 8,
  monthlyPayments: 89,
  averagePayment: 290256,
  verifiedPayments: 132,
  disputedPayments: 2
};

const mockInvoices = [
  { value: 'inv_001', label: 'INV-2025-001234 - علي جواد (3,500,000 د.ع)' },
  { value: 'inv_002', label: 'INV-2025-001235 - فاطمة أحمد (2,800,000 د.ع)' },
  { value: 'inv_003', label: 'INV-2025-001236 - محمد حسين (4,200,000 د.ع)' },
  { value: 'inv_004', label: 'INV-2025-001237 - زينب سالم (1,950,000 د.ع)' },
];

const mockPayments: Payment[] = [
  {
    id: 'payment_001',
    invoiceId: 'inv_001',
    clientId: 'client_001',
    amount: 3500000,
    method: 'manual',
    reference: 'TXN20250828001',
    receivedAt: new Date('2025-08-28T10:30:00'),
    verifiedBy: 'admin_001',
    verifiedAt: new Date('2025-08-28T11:00:00'),
    notes: 'دفع كاش مباشر في المكتب',
    status: 'verified',
    createdAt: new Date('2025-08-28T10:30:00'),
    updatedAt: new Date('2025-08-28T11:00:00'),
    invoice: {
      id: 'inv_001',
      invoiceNumber: 'INV-2025-001234',
      totalAmount: 3500000,
      status: 'paid',
      issuedAt: new Date('2025-08-20')
    },
    client: {
      id: 'client_001',
      name: 'علي جواد محمد',
      email: 'ali.jawad@example.com',
      phone: '07701234567'
    },
    verifier: {
      name: 'أحمد محمود',
      email: 'ahmed@depth-agency.com'
    }
  },
  {
    id: 'payment_002',
    invoiceId: 'inv_002',
    clientId: 'client_002',
    amount: 2800000,
    method: 'manual',
    reference: 'TXN20250827002',
    receivedAt: new Date('2025-08-27T14:15:00'),
    verifiedBy: 'admin_001',
    status: 'pending_verification',
    createdAt: new Date('2025-08-27T14:15:00'),
    updatedAt: new Date('2025-08-27T14:15:00'),
    invoice: {
      id: 'inv_002',
      invoiceNumber: 'INV-2025-001235',
      totalAmount: 2800000,
      status: 'partially_paid',
      issuedAt: new Date('2025-08-22')
    },
    client: {
      id: 'client_002',
      name: 'فاطمة أحمد حسن',
      email: 'fatima.ahmed@example.com',
      phone: '07712345678'
    },
    verifier: {
      name: 'أحمد محمود',
      email: 'ahmed@depth-agency.com'
    }
  },
  {
    id: 'payment_003',
    invoiceId: 'inv_003',
    clientId: 'client_003',
    amount: 4200000,
    method: 'manual',
    reference: 'TXN20250826003',
    receivedAt: new Date('2025-08-26T09:45:00'),
    verifiedBy: 'admin_002',
    verifiedAt: new Date('2025-08-26T16:20:00'),
    notes: 'تحويل بنكي - تم التأكد من كشف الحساب',
    status: 'verified',
    createdAt: new Date('2025-08-26T09:45:00'),
    updatedAt: new Date('2025-08-26T16:20:00'),
    invoice: {
      id: 'inv_003',
      invoiceNumber: 'INV-2025-001236',
      totalAmount: 4200000,
      status: 'paid',
      issuedAt: new Date('2025-08-18')
    },
    client: {
      id: 'client_003',
      name: 'محمد حسين علي',
      email: 'mohamed.hussein@example.com',
      phone: '07723456789'
    },
    verifier: {
      name: 'سارة أحمد',
      email: 'sara@depth-agency.com'
    }
  },
  {
    id: 'payment_004',
    invoiceId: 'inv_004',
    clientId: 'client_004',
    amount: 1950000,
    method: 'manual',
    reference: 'TXN20250825004',
    receivedAt: new Date('2025-08-25T16:20:00'),
    verifiedBy: 'admin_001',
    status: 'pending_verification',
    createdAt: new Date('2025-08-25T16:20:00'),
    updatedAt: new Date('2025-08-25T16:20:00'),
    invoice: {
      id: 'inv_004',
      invoiceNumber: 'INV-2025-001237',
      totalAmount: 1950000,
      status: 'issued',
      issuedAt: new Date('2025-08-23')
    },
    client: {
      id: 'client_004',
      name: 'زينب سالم حسن',
      email: 'zainab.salem@example.com',
      phone: '07734567890'
    },
    verifier: {
      name: 'أحمد محمود',
      email: 'ahmed@depth-agency.com'
    }
  }
];

export default function PaymentsPage() {
  // State Management
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [stats, setStats] = useState<PaymentStats>(mockStats);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const itemsPerPage = 10;

  // Form State
  const [formData, setFormData] = useState<PaymentFormData>({
    invoiceId: '',
    amount: 0,
    reference: '',
    receivedAt: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Filters State
  const [filters, setFilters] = useState<PaymentFilters>({
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    method: 'all'
  });

  // Modals
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [viewModalOpened, { open: openViewModal, close: closeViewModal }] = useDisclosure(false);
  const [verifyModalOpened, { open: openVerifyModal, close: closeVerifyModal }] = useDisclosure(false);

  // Computed Values
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !filters.search || 
      payment.client?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      payment.invoice?.invoiceNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || payment.status === filters.status;
    
    const matchesDateFrom = !filters.dateFrom || 
      payment.receivedAt >= new Date(filters.dateFrom);
    
    const matchesDateTo = !filters.dateTo || 
      payment.receivedAt <= new Date(filters.dateTo);

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Event Handlers
  const handleAddPayment = async () => {
    if (!formData.invoiceId || !formData.amount || !formData.reference) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPayment: Payment = {
        id: `payment_${Date.now()}`,
        invoiceId: formData.invoiceId,
        clientId: 'client_new',
        amount: formData.amount,
        method: 'manual',
        reference: formData.reference,
        receivedAt: new Date(formData.receivedAt),
        verifiedBy: 'current_admin',
        status: 'pending_verification',
        notes: formData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: 'client_new',
          name: 'عميل جديد',
          email: 'new@example.com',
          phone: '07700000000'
        },
        invoice: {
          id: formData.invoiceId,
          invoiceNumber: 'INV-2025-NEW',
          totalAmount: formData.amount,
          status: 'partially_paid',
          issuedAt: new Date()
        }
      };

      setPayments(prev => [newPayment, ...prev]);
      setStats(prev => ({
        ...prev,
        totalPayments: prev.totalPayments + 1,
        pendingVerification: prev.pendingVerification + 1,
        totalAmount: prev.totalAmount + formData.amount
      }));

      alert('تم إضافة الدفعة بنجاح');
      resetForm();
      closeAddModal();
    } catch {
      alert('حدث خطأ في تسجيل الدفعة');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { 
              ...payment, 
              status: 'verified' as const,
              verifiedAt: new Date(),
              updatedAt: new Date()
            }
          : payment
      ));

      setStats(prev => ({
        ...prev,
        pendingVerification: Math.max(0, prev.pendingVerification - 1),
        verifiedPayments: prev.verifiedPayments + 1
      }));

      alert('تم تأكيد الدفعة بنجاح');
      closeVerifyModal();
    } catch {
      alert('حدث خطأ في التحقق من الدفعة');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      method: 'all'
    });
    setCurrentPage(1);
  };

  const resetForm = () => {
    setFormData({
      invoiceId: '',
      amount: 0,
      reference: '',
      receivedAt: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  // Utility Functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'green';
      case 'pending_verification': return 'yellow';
      case 'disputed': return 'red';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'مؤكد';
      case 'pending_verification': return 'بانتظار التحقق';
      case 'disputed': return 'محل نزاع';
      default: return 'غير معروف';
    }
  };

  return (
    <Container 
      size="xl" 
      className={`${styles.container} ${styles.focusStyles} ${styles.rtlSupport}`}
    >
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1} className={styles.pageTitle}>
            إدارة المدفوعات
          </Title>
          <Text className={styles.pageDescription}>
            تسجيل وتتبع جميع المدفوعات الواردة من العملاء
          </Text>
        </div>
        <Group>
          <Button 
            variant="light"
            onClick={() => window.location.reload()}
          >
            🔄 تحديث
          </Button>
          <Button
            onClick={openAddModal}
            className={styles.primaryButton}
          >
            ➕ إضافة دفعة جديدة
          </Button>
        </Group>
      </Group>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')} className={styles.tabs}>
        <Tabs.List>
          <Tabs.Tab value="overview">
            📊 نظرة عامة
          </Tabs.Tab>
          <Tabs.Tab value="payments">
            💳 المدفوعات ({filteredPayments.length})
          </Tabs.Tab>
          <Tabs.Tab value="pending">
            ⏰ بانتظار التحقق ({stats.pendingVerification})
          </Tabs.Tab>
          <Tabs.Tab value="reports">
            📋 التقارير
          </Tabs.Tab>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Panel value="overview">
          <Stack gap="xl" mt="xl">
            {/* Statistics Cards */}
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card className={styles.statCard}>
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                        إجمالي المدفوعات
                      </Text>
                      <Text fw={700} size="xl">
                        {stats.totalPayments}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {formatCurrency(stats.totalAmount)}
                      </Text>
                    </div>
                    <div style={{ fontSize: '2rem' }}>💳</div>
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card className={styles.statCard}>
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                        بانتظار التحقق
                      </Text>
                      <Text fw={700} size="xl" c="yellow">
                        {stats.pendingVerification}
                      </Text>
                      <Text size="xs" c="dimmed">
                        يحتاج تأكيد
                      </Text>
                    </div>
                    <div style={{ fontSize: '2rem' }}>⏰</div>
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card className={styles.statCard}>
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                        مدفوعات اليوم
                      </Text>
                      <Text fw={700} size="xl" c="green">
                        {stats.todayPayments}
                      </Text>
                      <Text size="xs" c="dimmed">
                        جديد اليوم
                      </Text>
                    </div>
                    <div style={{ fontSize: '2rem' }}>✅</div>
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Card className={styles.statCard}>
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                        متوسط الدفعة
                      </Text>
                      <Text fw={700} size="xl">
                        {formatCurrency(stats.averagePayment)}
                      </Text>
                      <Text size="xs" c="dimmed">
                        لكل دفعة
                      </Text>
                    </div>
                    <div style={{ fontSize: '2rem' }}>💰</div>
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>

            {/* Recent Payments */}
            <Card className={styles.recentPayments}>
              <Group justify="space-between" mb="md">
                <Text fw={600} size="lg">آخر المدفوعات</Text>
                <Anchor component="button" onClick={() => setActiveTab('payments')}>
                  عرض الكل
                </Anchor>
              </Group>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>العميل</Table.Th>
                    <Table.Th>الفاتورة</Table.Th>
                    <Table.Th>المبلغ</Table.Th>
                    <Table.Th>التاريخ</Table.Th>
                    <Table.Th>الحالة</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {payments.slice(0, 5).map((payment) => (
                    <Table.Tr key={payment.id}>
                      <Table.Td>
                        <Group gap="xs">
                          <Avatar size="sm" name={payment.client?.name} color="blue" />
                          <Text size="sm" fw={500}>{payment.client?.name}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {payment.invoice?.invoiceNumber}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={600}>
                          {formatCurrency(payment.amount)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {formatDateShort(payment.receivedAt)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          size="sm" 
                          color={getStatusColor(payment.status)}
                        >
                          {getStatusLabel(payment.status)}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Payments Tab */}
        <Tabs.Panel value="payments">
          <Stack gap="lg" mt="xl">
            {/* Filters */}
            <Card className={styles.filtersCard}>
              <Group justify="space-between" mb="md">
                <Text fw={600}>البحث والتصفية</Text>
                <Button variant="light" size="xs" onClick={resetFilters}>
                  إعادة تعيين
                </Button>
              </Group>
              <Grid>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    placeholder="البحث بالاسم، الفاتورة، أو المرجع..."
                    value={filters.search}
                    onChange={(event) => setFilters(prev => ({ 
                      ...prev, 
                      search: event.currentTarget.value 
                    }))}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
                  <Select
                    placeholder="الحالة"
                    data={[
                      { value: 'all', label: 'جميع الحالات' },
                      { value: 'verified', label: 'مؤكد' },
                      { value: 'pending_verification', label: 'بانتظار التحقق' },
                      { value: 'disputed', label: 'محل نزاع' }
                    ]}
                    value={filters.status}
                    onChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      status: value || 'all' 
                    }))}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Input
                    type="date"
                    placeholder="من تاريخ"
                    value={filters.dateFrom}
                    onChange={(event) => setFilters(prev => ({ 
                      ...prev, 
                      dateFrom: event.currentTarget.value 
                    }))}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Input
                    type="date"
                    placeholder="إلى تاريخ"
                    value={filters.dateTo}
                    onChange={(event) => setFilters(prev => ({ 
                      ...prev, 
                      dateTo: event.currentTarget.value 
                    }))}
                  />
                </Grid.Col>
              </Grid>
            </Card>

            {/* Payments Table */}
            <Card className={styles.tableCard}>
              <Group justify="space-between" mb="md">
                <Text fw={600}>
                  المدفوعات ({filteredPayments.length})
                </Text>
                <Group>
                  <Badge variant="light" color="blue">
                    الصفحة {currentPage} من {totalPages}
                  </Badge>
                  <Button variant="light" size="xs">
                    📥 تصدير
                  </Button>
                </Group>
              </Group>
              
              <ScrollArea>
                <Table highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>العميل</Table.Th>
                      <Table.Th>الفاتورة</Table.Th>
                      <Table.Th>المبلغ</Table.Th>
                      <Table.Th>رقم المرجع</Table.Th>
                      <Table.Th>تاريخ الاستلام</Table.Th>
                      <Table.Th>الحالة</Table.Th>
                      <Table.Th>تم التحقق بواسطة</Table.Th>
                      <Table.Th>إجراءات</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedPayments.map((payment) => (
                      <Table.Tr key={payment.id}>
                        <Table.Td>
                          <Group gap="xs">
                            <Avatar 
                              size="sm" 
                              name={payment.client?.name} 
                              color="blue" 
                            />
                            <div>
                              <Text size="sm" fw={500}>
                                {payment.client?.name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {payment.client?.phone}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <div>
                            <Text size="sm" fw={500}>
                              {payment.invoice?.invoiceNumber}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {formatCurrency(payment.invoice?.totalAmount || 0)}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={600} c="green">
                            {formatCurrency(payment.amount)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" style={{ fontFamily: 'monospace' }}>
                            {payment.reference}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">
                            {formatDate(payment.receivedAt)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            size="sm" 
                            color={getStatusColor(payment.status)}
                          >
                            {getStatusLabel(payment.status)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {payment.verifier ? (
                            <div>
                              <Text size="sm" fw={500}>
                                {payment.verifier.name}
                              </Text>
                              {payment.verifiedAt && (
                                <Text size="xs" c="dimmed">
                                  {formatDateShort(payment.verifiedAt)}
                                </Text>
                              )}
                            </div>
                          ) : (
                            <Text size="sm" c="dimmed">
                              لم يتم التحقق
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="light" size="sm">
                                ⋮
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item 
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  openViewModal();
                                }}
                              >
                                👁️ عرض التفاصيل
                              </Menu.Item>
                              {payment.status === 'pending_verification' && (
                                <Menu.Item 
                                  color="green"
                                  onClick={() => {
                                    setSelectedPayment(payment);
                                    openVerifyModal();
                                  }}
                                >
                                  ✅ تأكيد الدفعة
                                </Menu.Item>
                              )}
                              <Menu.Item>
                                🔗 عرض الفاتورة
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item color="blue">
                                ✏️ تعديل
                              </Menu.Item>
                              <Menu.Item color="red">
                                🗑️ حذف
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

              {filteredPayments.length === 0 && (
                <Paper p="xl" style={{ textAlign: 'center' }}>
                  <Text c="dimmed" size="lg">
                    لا توجد مدفوعات مطابقة للمعايير المحددة
                  </Text>
                  <Button variant="light" mt="md" onClick={resetFilters}>
                    إعادة تعيين المرشحات
                  </Button>
                </Paper>
              )}
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Pending Tab */}
        <Tabs.Panel value="pending">
          <Stack gap="lg" mt="xl">
            <Alert 
              title="المدفوعات المعلقة"
              color="yellow"
            >
              يوجد {stats.pendingVerification} دفعة بحاجة للتحقق والتأكيد
            </Alert>

            <Card className={styles.tableCard}>
              <Text fw={600} mb="md">
                المدفوعات بانتظار التحقق ({stats.pendingVerification})
              </Text>
              
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>العميل</Table.Th>
                    <Table.Th>المبلغ</Table.Th>
                    <Table.Th>تاريخ الاستلام</Table.Th>
                    <Table.Th>الملاحظات</Table.Th>
                    <Table.Th>إجراءات</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {payments
                    .filter(payment => payment.status === 'pending_verification')
                    .map((payment) => (
                    <Table.Tr key={payment.id}>
                      <Table.Td>
                        <Group gap="xs">
                          <Avatar 
                            size="sm" 
                            name={payment.client?.name} 
                            color="yellow" 
                          />
                          <div>
                            <Text size="sm" fw={500}>
                              {payment.client?.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {payment.invoice?.invoiceNumber}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={600} c="yellow">
                          {formatCurrency(payment.amount)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {formatDate(payment.receivedAt)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed" lineClamp={2}>
                          {payment.notes || 'لا توجد ملاحظات'}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            size="xs"
                            color="green"
                            onClick={() => {
                              setSelectedPayment(payment);
                              openVerifyModal();
                            }}
                          >
                            ✅ تأكيد
                          </Button>
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => {
                              setSelectedPayment(payment);
                              openViewModal();
                            }}
                          >
                            👁️ تفاصيل
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {payments.filter(p => p.status === 'pending_verification').length === 0 && (
                <Paper p="xl" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', opacity: 0.5 }}>✅</div>
                  <Text c="dimmed" size="lg" mt="md">
                    جميع المدفوعات مؤكدة!
                  </Text>
                  <Text c="dimmed" size="sm">
                    لا توجد مدفوعات بحاجة للتحقق في الوقت الحالي
                  </Text>
                </Paper>
              )}
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Reports Tab */}
        <Tabs.Panel value="reports">
          <Stack gap="lg" mt="xl">
            <Text size="lg" fw={600}>
              التقارير المالية - قريباً
            </Text>
            <Paper p="xl" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', opacity: 0.5 }}>📊</div>
              <Text c="dimmed" mt="md">
                سيتم إضافة التقارير المالية التفصيلية في التحديث القادم
              </Text>
            </Paper>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Add Payment Modal */}
      <Modal
        opened={addModalOpened}
        onClose={closeAddModal}
        title="إضافة دفعة جديدة"
        size="lg"
        centered
      >
        <Stack gap="md">
          <Select
            label="الفاتورة"
            placeholder="اختر الفاتورة المراد تسجيل دفعة لها"
            data={mockInvoices}
            searchable
            required
            value={formData.invoiceId}
            onChange={(value) => setFormData(prev => ({ ...prev, invoiceId: value || '' }))}
          />

          <NumberInput
            label="المبلغ (د.ع)"
            placeholder="أدخل مبلغ الدفعة"
            required
            min={1}
            step={1000}
            thousandSeparator=","
            value={formData.amount}
            onChange={(value) => setFormData(prev => ({ ...prev, amount: Number(value) }))}
          />

          <TextInput
            label="رقم المرجع"
            placeholder="مثال: TXN20250828001"
            required
            value={formData.reference}
            onChange={(event) => setFormData(prev => ({ ...prev, reference: event.currentTarget.value }))}
          />

          <Input.Wrapper label="تاريخ الاستلام" required>
            <Input
              type="date"
              value={formData.receivedAt}
              onChange={(event) => setFormData(prev => ({ ...prev, receivedAt: event.currentTarget.value }))}
            />
          </Input.Wrapper>

          <Textarea
            label="الملاحظات (اختياري)"
            placeholder="أي ملاحظات إضافية حول الدفعة..."
            rows={3}
            value={formData.notes}
            onChange={(event) => setFormData(prev => ({ ...prev, notes: event.currentTarget.value }))}
          />

          <Divider />

          <Group justify="flex-end">
            <Button variant="light" onClick={closeAddModal}>
              إلغاء
            </Button>
            <Button
              loading={loading}
              onClick={handleAddPayment}
            >
              ✅ إضافة الدفعة
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Payment Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeViewModal}
        title="تفاصيل الدفعة"
        size="md"
        centered
      >
        {selectedPayment && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={600}>معرف الدفعة:</Text>
              <Text style={{ fontFamily: 'monospace' }}>{selectedPayment.id}</Text>
            </Group>

            <Group justify="space-between">
              <Text fw={600}>العميل:</Text>
              <div style={{ textAlign: 'right' }}>
                <Text>{selectedPayment.client?.name}</Text>
                <Text size="sm" c="dimmed">{selectedPayment.client?.email}</Text>
              </div>
            </Group>

            <Group justify="space-between">
              <Text fw={600}>الفاتورة:</Text>
              <div style={{ textAlign: 'right' }}>
                <Text>{selectedPayment.invoice?.invoiceNumber}</Text>
                <Text size="sm" c="dimmed">
                  {formatCurrency(selectedPayment.invoice?.totalAmount || 0)}
                </Text>
              </div>
            </Group>

            <Group justify="space-between">
              <Text fw={600}>مبلغ الدفعة:</Text>
              <Text fw={700} c="green" size="lg">
                {formatCurrency(selectedPayment.amount)}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text fw={600}>رقم المرجع:</Text>
              <Text style={{ fontFamily: 'monospace' }}>{selectedPayment.reference}</Text>
            </Group>

            <Group justify="space-between">
              <Text fw={600}>تاريخ الاستلام:</Text>
              <Text>{formatDate(selectedPayment.receivedAt)}</Text>
            </Group>

            <Group justify="space-between">
              <Text fw={600}>الحالة:</Text>
              <Badge color={getStatusColor(selectedPayment.status)}>
                {getStatusLabel(selectedPayment.status)}
              </Badge>
            </Group>

            {selectedPayment.verifier && (
              <Group justify="space-between">
                <Text fw={600}>تم التحقق بواسطة:</Text>
                <div style={{ textAlign: 'right' }}>
                  <Text>{selectedPayment.verifier.name}</Text>
                  {selectedPayment.verifiedAt && (
                    <Text size="sm" c="dimmed">
                      {formatDate(selectedPayment.verifiedAt)}
                    </Text>
                  )}
                </div>
              </Group>
            )}

            {selectedPayment.notes && (
              <>
                <Text fw={600}>الملاحظات:</Text>
                <Paper p="sm" bg="gray.1">
                  <Text size="sm">{selectedPayment.notes}</Text>
                </Paper>
              </>
            )}

            <Divider />

            <Group justify="flex-end">
              {selectedPayment.status === 'pending_verification' && (
                <Button
                  color="green"
                  onClick={() => {
                    closeViewModal();
                    openVerifyModal();
                  }}
                >
                  ✅ تأكيد الدفعة
                </Button>
              )}
              <Button variant="light" onClick={closeViewModal}>
                إغلاق
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Verify Payment Modal */}
      <Modal
        opened={verifyModalOpened}
        onClose={closeVerifyModal}
        title="تأكيد الدفعة"
        size="sm"
        centered
      >
        {selectedPayment && (
          <Stack gap="md">
            <Alert color="yellow">
              ⚠️ هل أنت متأكد من تأكيد هذه الدفعة؟
            </Alert>

            <Group justify="space-between">
              <Text fw={600}>العميل:</Text>
              <Text>{selectedPayment.client?.name}</Text>
            </Group>

            <Group justify="space-between">
              <Text fw={600}>المبلغ:</Text>
              <Text fw={700} c="green">
                {formatCurrency(selectedPayment.amount)}
              </Text>
            </Group>

            <Group justify="space-between">
              <Text fw={600}>رقم المرجع:</Text>
              <Text style={{ fontFamily: 'monospace' }}>{selectedPayment.reference}</Text>
            </Group>

            <Divider />

            <Group justify="flex-end">
              <Button variant="light" onClick={closeVerifyModal}>
                إلغاء
              </Button>
              <Button
                color="green"
                loading={loading}
                onClick={() => handleVerifyPayment(selectedPayment.id)}
              >
                ✅ تأكيد الدفعة
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {loading && (
        <div className={styles.loadingOverlay}>
          <Loader size="lg" />
        </div>
      )}
    </Container>
  );
}
