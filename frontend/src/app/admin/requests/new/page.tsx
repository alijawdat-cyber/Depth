'use client';

import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Title, 
  Grid, 
  Group, 
  Button, 
  Select, 
  TextInput,
  Modal,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Textarea,
  NumberInput,
  Divider,
  Table
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  Search, 
  Filter, 
  Eye, 
  ArrowRight, 
  X,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Calendar,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';
import styles from './RequestsPage.module.css';

// Types
interface ProjectRequest extends Record<string, unknown> {
  id: string;
  requestNumber: string;
  clientId: string;
  clientName: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  estimatedPrice?: number;
  assignedTo?: string;
  reviewNotes?: string;
  attachments: string[];
  createdAt: string;
  reviewedAt?: string;
  updatedAt: string;
}

// Mock Data
const mockRequests: ProjectRequest[] = [
  {
    id: 'req_001',
    requestNumber: 'REQ-2025-001042',
    clientId: 'cl_123abc',
    clientName: 'مطعم البرج الذهبي',
    categoryId: 'cat_photo',
    categoryName: 'تصوير',
    subcategoryId: 'subcat_food',
    subcategoryName: 'طعام',
    description: 'نحتاج تصوير قائمة الطعام الجديدة مع التركيز على الأطباق الشعبية العراقية',
    priority: 'high',
    status: 'pending',
    budget: { min: 500000, max: 800000 },
    deadline: '2025-09-15',
    attachments: ['menu-samples.pdf', 'restaurant-photos.zip'],
    createdAt: '2025-08-27T10:30:00Z',
    updatedAt: '2025-08-27T10:30:00Z'
  },
  {
    id: 'req_002',
    requestNumber: 'REQ-2025-001041',
    clientId: 'cl_456def',
    clientName: 'شركة الأمل للتسويق',
    categoryId: 'cat_video',
    categoryName: 'فيديو',
    subcategoryId: 'subcat_promo',
    subcategoryName: 'دعائي',
    description: 'فيديو ترويجي للحملة الجديدة، مدة 60 ثانية مع موسيقى تصويرية',
    priority: 'urgent',
    status: 'reviewing',
    budget: { min: 1200000, max: 1800000 },
    deadline: '2025-09-10',
    estimatedPrice: 1500000,
    assignedTo: 'admin@depth-agency.com',
    reviewNotes: 'تم مراجعة المتطلبات، بانتظار موافقة العميل على السعر',
    attachments: ['brand-guidelines.pdf'],
    createdAt: '2025-08-26T14:20:00Z',
    reviewedAt: '2025-08-27T09:15:00Z',
    updatedAt: '2025-08-27T09:15:00Z'
  },
  {
    id: 'req_003',
    requestNumber: 'REQ-2025-001040',
    clientId: 'cl_789ghi',
    clientName: 'معرض النور للسيارات',
    categoryId: 'cat_photo',
    categoryName: 'تصوير',
    subcategoryId: 'subcat_product',
    subcategoryName: 'منتجات',
    description: 'تصوير احترافي لـ 15 سيارة جديدة للمعرض مع خلفيات متنوعة',
    priority: 'normal',
    status: 'approved',
    budget: { min: 2000000, max: 2500000 },
    deadline: '2025-09-20',
    estimatedPrice: 2200000,
    assignedTo: 'admin@depth-agency.com',
    reviewNotes: 'تمت الموافقة، سيتم تحويل الطلب إلى مشروع',
    attachments: ['car-list.xlsx', 'location-photos.zip'],
    createdAt: '2025-08-25T16:45:00Z',
    reviewedAt: '2025-08-26T11:30:00Z',
    updatedAt: '2025-08-26T11:30:00Z'
  },
  {
    id: 'req_004',
    requestNumber: 'REQ-2025-001039',
    clientId: 'cl_101112',
    clientName: 'مركز التجميل العصري',
    categoryId: 'cat_photo',
    categoryName: 'تصوير',
    subcategoryId: 'subcat_fashion',
    subcategoryName: 'أزياء وجمال',
    description: 'جلسة تصوير لعرض خدمات المركز الجديدة',
    priority: 'low',
    status: 'rejected',
    budget: { min: 300000, max: 500000 },
    deadline: '2025-09-25',
    assignedTo: 'admin@depth-agency.com',
    reviewNotes: 'تم رفض الطلب - الميزانية غير كافية للمتطلبات المطلوبة',
    attachments: [],
    createdAt: '2025-08-24T12:10:00Z',
    reviewedAt: '2025-08-25T08:20:00Z',
    updatedAt: '2025-08-25T08:20:00Z'
  }
];

const RequestsNewPage: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>('');
  const [priorityFilter, setPriorityFilter] = useState<string | null>('');
  const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);
  
  // Modals
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [convertOpened, { open: openConvert, close: closeConvert }] = useDisclosure(false);
  const [rejectOpened, { open: openReject, close: closeReject }] = useDisclosure(false);
  
  // Forms
  const [rejectReason, setRejectReason] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | string>('');
  const [reviewNotes, setReviewNotes] = useState('');

  // Stats calculation
  const stats = useMemo(() => {
    const total = mockRequests.length;
    const pending = mockRequests.filter(r => r.status === 'pending').length;
    const reviewing = mockRequests.filter(r => r.status === 'reviewing').length;
    const approved = mockRequests.filter(r => r.status === 'approved').length;
    const rejected = mockRequests.filter(r => r.status === 'rejected').length;

    return [
      { 
        title: 'جديد', 
        value: pending.toString(), 
        color: 'danger' as const,
        icon: <Clock size={20} />,
        description: 'طلبات في الانتظار'
      },
      { 
        title: 'مراجعة', 
        value: reviewing.toString(), 
        color: 'warning' as const,
        icon: <Eye size={20} />,
        description: 'تحت المراجعة'
      },
      { 
        title: 'معتمد', 
        value: approved.toString(), 
        color: 'success' as const,
        icon: <CheckCircle size={20} />,
        description: 'تم الاعتماد'
      },
      { 
        title: 'مرفوض', 
        value: rejected.toString(), 
        color: 'neutral' as const,
        icon: <XCircle size={20} />,
        description: 'طلبات مرفوضة'
      },
      { 
        title: 'الإجمالي', 
        value: total.toString(), 
        color: 'info' as const,
        icon: <FileText size={20} />,
        description: 'جميع الطلبات'
      }
    ];
  }, []);

  // Filtered data
  const filteredRequests = useMemo(() => {
    return mockRequests.filter(request => {
      const matchesSearch = !searchQuery || 
        request.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !statusFilter || request.status === statusFilter;
      const matchesPriority = !priorityFilter || request.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchQuery, statusFilter, priorityFilter]);

  // Priority display helper
  const getPriorityDisplay = (priority: string) => {
    const priorityMap = {
      low: { label: 'منخفض', color: 'gray' },
      normal: { label: 'عادي', color: 'blue' },
      high: { label: 'عالي', color: 'orange' },
      urgent: { label: 'عاجل', color: 'red' }
    };
    const config = priorityMap[priority as keyof typeof priorityMap] || priorityMap.normal;
    return <Badge color={config.color} size="sm">{config.label}</Badge>;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Table columns
  interface TableColumn {
    key: string;
    label: string;
    width?: number;
    render?: (value: unknown, row?: Record<string, unknown>) => React.ReactNode;
  }

  const columns: TableColumn[] = [
    {
      key: 'requestNumber',
      label: '#',
      width: 140,
      render: (value) => (
        <Text size="sm" fw={500} className={styles.requestNumber}>
          {value as string}
        </Text>
      )
    },
    {
      key: 'clientName',
      label: 'العميل',
      render: (value) => (
        <Group gap="xs">
          <User size={16} />
          <Text size="sm">{value as string}</Text>
        </Group>
      )
    },
    {
      key: 'categoryName',
      label: 'النوع',
      render: (value, row) => (
        <Text size="sm">
          {(row as ProjectRequest).categoryName === 'تصوير' ? '📷' : '🎬'} {value as string}/{(row as ProjectRequest).subcategoryName}
        </Text>
      )
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => {
        const status = value as 'pending' | 'reviewing' | 'approved' | 'rejected';
        return (
          <Badge 
            color={
              status === 'approved' ? 'green' : 
              status === 'reviewing' ? 'yellow' : 
              status === 'rejected' ? 'red' : 'blue'
            }
            variant="light"
            size="sm"
          >
            {status === 'pending' ? 'معلق' :
             status === 'reviewing' ? 'مراجعة' :
             status === 'approved' ? 'معتمد' : 'مرفوض'}
          </Badge>
        );
      }
    },
    {
      key: 'priority',
      label: 'الأولوية',
      render: (value) => getPriorityDisplay(value as string)
    },
    {
      key: 'createdAt',
      label: 'التاريخ',
      render: (value) => (
        <Group gap="xs">
          <Calendar size={14} />
          <Text size="xs">
            {new Date(value as string).toLocaleDateString('ar-IQ')}
          </Text>
        </Group>
      )
    },
    {
      key: 'actions',
      label: 'إجراءات',
      width: 160,
      render: (_, row) => (
        <Group gap="xs">
          <ActionIcon
            size="sm"
            variant="light"
            color="blue"
            onClick={() => {
              setSelectedRequest(row as unknown as ProjectRequest);
              openDetails();
            }}
          >
            <Eye size={14} />
          </ActionIcon>
          
          {(row as unknown as ProjectRequest).status === 'pending' && (
            <ActionIcon
              size="sm"
              variant="light"
              color="green"
              onClick={() => {
                setSelectedRequest(row as unknown as ProjectRequest);
                setEstimatedPrice('');
                setReviewNotes('');
                openConvert();
              }}
            >
              <ArrowRight size={14} />
            </ActionIcon>
          )}
          
          {(row as unknown as ProjectRequest).status === 'pending' && (
            <ActionIcon
              size="sm"
              variant="light"
              color="red"
              onClick={() => {
                setSelectedRequest(row as unknown as ProjectRequest);
                setRejectReason('');
                openReject();
              }}
            >
              <X size={14} />
            </ActionIcon>
          )}
        </Group>
      )
    }
  ];

  // Handlers
  const handleConvertToProject = () => {
    console.log('Converting request to project:', {
      requestId: selectedRequest?.id,
      estimatedPrice,
      reviewNotes
    });
    closeConvert();
    // Here you would call the API to convert the request
  };

  const handleRejectRequest = () => {
    console.log('Rejecting request:', {
      requestId: selectedRequest?.id,
      reason: rejectReason
    });
    closeReject();
    // Here you would call the API to reject the request
  };

  return (
    <Container size="xl" className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <Title order={1} className={styles.pageTitle}>
          إدارة الطلبات الجديدة
        </Title>
        <Text className={styles.pageDescription}>
          مراجعة وإدارة طلبات المشاريع الواردة من العملاء
        </Text>
      </div>

      {/* Stats Cards */}
      <Grid className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Grid.Col key={index} span={{ base: 12, xs: 6, sm: 4, lg: 2.4 }}>
            <StatsCard {...stat} />
          </Grid.Col>
        ))}
      </Grid>

      {/* Filters */}
      <div className={styles.filters}>
        <Group justify="space-between" className={styles.filtersHeader}>
          <Group gap="md">
            <TextInput
              placeholder="البحث في الطلبات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<Search size={16} />}
              className={styles.searchInput}
            />
            
            <Select
              placeholder="الحالة"
              value={statusFilter}
              onChange={setStatusFilter}
              data={[
                { value: '', label: 'جميع الحالات' },
                { value: 'pending', label: 'جديد' },
                { value: 'reviewing', label: 'مراجعة' },
                { value: 'approved', label: 'معتمد' },
                { value: 'rejected', label: 'مرفوض' }
              ]}
              className={styles.filterSelect}
            />
            
            <Select
              placeholder="الأولوية"
              value={priorityFilter}
              onChange={setPriorityFilter}
              data={[
                { value: '', label: 'جميع الأولويات' },
                { value: 'low', label: 'منخفض' },
                { value: 'normal', label: 'عادي' },
                { value: 'high', label: 'عالي' },
                { value: 'urgent', label: 'عاجل' }
              ]}
              className={styles.filterSelect}
            />
          </Group>

          <Button leftSection={<Filter size={16} />} variant="light">
            فلاتر متقدمة
          </Button>
        </Group>
      </div>

      {/* Data Table */}
      <div className={styles.tableContainer}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column.key}>{column.label}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredRequests.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                  <Text c="dimmed">لا توجد طلبات</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredRequests.map((row) => (
                <Table.Tr 
                  key={row.id} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedRequest(row);
                    openDetails();
                  }}
                >
                  {columns.map((column) => (
                    <Table.Td key={column.key}>
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
      </div>

      {/* Request Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={`تفاصيل الطلب ${selectedRequest?.requestNumber}`}
        size="lg"
        centered
      >
        {selectedRequest && (
          <Stack gap="md">
            <Group justify="apart">
              <Group gap="xs">
                <User size={16} />
                <Text fw={500}>{selectedRequest.clientName}</Text>
              </Group>
              <Badge 
                color={
                  selectedRequest.status === 'approved' ? 'green' : 
                  selectedRequest.status === 'reviewing' ? 'yellow' : 
                  selectedRequest.status === 'rejected' ? 'red' : 'blue'
                }
                variant="light"
              >
                {selectedRequest.status === 'pending' ? 'معلق' :
                 selectedRequest.status === 'reviewing' ? 'مراجعة' :
                 selectedRequest.status === 'approved' ? 'معتمد' : 'مرفوض'}
              </Badge>
            </Group>
            
            <Divider />
            
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">نوع الخدمة</Text>
                <Text size="sm">
                  {selectedRequest.categoryName} / {selectedRequest.subcategoryName}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">الأولوية</Text>
                {getPriorityDisplay(selectedRequest.priority)}
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">الميزانية المتوقعة</Text>
                <Text size="sm">
                  {formatCurrency(selectedRequest.budget.min)} - {formatCurrency(selectedRequest.budget.max)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">التسليم المطلوب</Text>
                <Text size="sm">
                  {new Date(selectedRequest.deadline).toLocaleDateString('ar-IQ')}
                </Text>
              </Grid.Col>
            </Grid>
            
            <div>
              <Text size="sm" c="dimmed" mb="xs">وصف المشروع</Text>
              <Text size="sm" className={styles.description}>
                {selectedRequest.description}
              </Text>
            </div>
            
            {selectedRequest.attachments.length > 0 && (
              <div>
                <Text size="sm" c="dimmed" mb="xs">المرفقات</Text>
                <Stack gap="xs">
                  {selectedRequest.attachments.map((attachment, index) => (
                    <Text key={index} size="xs" c="blue" td="underline">
                      📎 {attachment}
                    </Text>
                  ))}
                </Stack>
              </div>
            )}
            
            {selectedRequest.reviewNotes && (
              <div>
                <Text size="sm" c="dimmed" mb="xs">ملاحظات المراجعة</Text>
                <Text size="sm" className={styles.reviewNotes}>
                  {selectedRequest.reviewNotes}
                </Text>
              </div>
            )}
          </Stack>
        )}
      </Modal>

      {/* Convert to Project Modal */}
      <Modal
        opened={convertOpened}
        onClose={closeConvert}
        title="تحويل إلى مشروع"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            هل أنت متأكد من تحويل هذا الطلب إلى مشروع؟
          </Text>
          
          <NumberInput
            label="السعر المقدر"
            placeholder="أدخل السعر بالدينار العراقي"
            value={estimatedPrice}
            onChange={setEstimatedPrice}
            min={0}
            leftSection={<DollarSign size={16} />}
            thousandSeparator=","
          />
          
          <Textarea
            label="ملاحظات المراجعة"
            placeholder="أضف أي ملاحظات للعميل..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.currentTarget.value)}
            minRows={3}
            leftSection={<MessageSquare size={16} />}
          />
          
          <Group justify="flex-end" gap="md">
            <Button variant="light" onClick={closeConvert}>
              إلغاء
            </Button>
            <Button onClick={handleConvertToProject} color="green">
              تحويل إلى مشروع
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Reject Request Modal */}
      <Modal
        opened={rejectOpened}
        onClose={closeReject}
        title="رفض الطلب"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            يرجى تحديد سبب رفض هذا الطلب:
          </Text>
          
          <Textarea
            label="سبب الرفض"
            placeholder="اشرح سبب رفض الطلب..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.currentTarget.value)}
            minRows={4}
            required
          />
          
          <Group justify="flex-end" gap="md">
            <Button variant="light" onClick={closeReject}>
              إلغاء
            </Button>
            <Button 
              onClick={handleRejectRequest} 
              color="red"
              disabled={!rejectReason.trim()}
            >
              رفض الطلب
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default RequestsNewPage;
