'use client';

import React, { useState, useMemo } from 'react';
import { 
  SimpleGrid, 
  TextInput, 
  Select, 
  Button, 
  Group, 
  Modal, 
  Text, 
  Badge, 
  ActionIcon,
  Tooltip,
  Stack,
  Box,
  Avatar,
  Progress as MantineProgress,
  Table,
  ScrollArea,
  Menu
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MessageCircle, 
  CreditCard,
  Archive,
  MoreVertical,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Clock,
  Calendar,
  User,
  Building2,
  FileText,
  RefreshCw,
  Download
} from 'lucide-react';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';
import styles from './ProjectsPage.module.css';

// أنواع البيانات للمشاريع
interface Project {
  id: string;
  projectNumber: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'delivered' | 'completed' | 'cancelled' | 'paused';
  phase: 'planning' | 'pre_production' | 'production' | 'post_production' | 'delivery' | 'completed';
  client: {
    id: string;
    name: string;
    company: string;
    avatar?: string;
    email: string;
    phone: string;
  };
  creator: {
    id: string;
    name: string;
    specialization: string;
    avatar?: string;
    rating: number;
  };
  timeline: {
    startDate: string;
    deliveryDate: string;
    daysRemaining: number;
    progress: number; // 0-100
    isOverdue: boolean;
  };
  budget: {
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    currency: string;
  };
  category: string;
  subcategory: string;
  priority: 'normal' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
  tags?: string[];
}

// إحصائيات المشاريع
interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedThisMonth: number;
  overdueProjects: number;
  totalRevenue: number;
  onTimeDelivery: number; // percentage
  avgProjectDuration: number; // days
  pendingPayments: number;
}

// بيانات الإحصائيات التجريبية
const projectStats: ProjectStats = {
  totalProjects: 1847,
  activeProjects: 67,
  completedThisMonth: 45,
  overdueProjects: 8,
  totalRevenue: 28450000, // بالدينار العراقي
  onTimeDelivery: 94.2,
  avgProjectDuration: 6.2,
  pendingPayments: 8920000
};

// بيانات المشاريع التجريبية
const mockProjects: Project[] = [
  {
    id: 'p_001',
    projectNumber: 'DP-2025-0345',
    title: 'تصوير منتجات المطعم - الدفعة الأولى',
    description: 'تصوير احترافي لـ 20 طبق من القائمة الجديدة',
    status: 'active' as const,
    phase: 'production' as const,
    client: {
      id: 'cl_001',
      name: 'محمد أحمد السوري',
      company: 'مطعم الشام الأصيل',
      avatar: '/avatars/client1.jpg',
      email: 'contact@alsham-restaurant.com',
      phone: '07801234567'
    },
    creator: {
      id: 'cr_001',
      name: 'فاطمة الزهراء',
      specialization: 'تصوير المنتجات الغذائية',
      avatar: '/avatars/fatima.jpg',
      rating: 4.9
    },
    timeline: {
      startDate: '2025-08-26T09:00:00Z',
      deliveryDate: '2025-09-01T18:00:00Z',
      daysRemaining: 4,
      progress: 75,
      isOverdue: false
    },
    budget: {
      totalAmount: 620000,
      paidAmount: 310000,
      pendingAmount: 310000,
      currency: 'IQD'
    },
    category: 'تصوير',
    subcategory: 'منتجات غذائية',
    priority: 'high' as const,
    createdAt: '2025-08-26T09:00:00Z',
    updatedAt: '2025-08-28T14:30:00Z',
    lastActivity: 'تم رفع 15 صورة للمراجعة',
    tags: ['مطعم', 'منتجات', 'احترافي']
  },
  {
    id: 'p_002',
    projectNumber: 'DP-2025-0346',
    title: 'تصميم هوية تجارية كاملة - شركة التقنية',
    description: 'تصميم شعار وهوية بصرية كاملة مع دليل الاستخدام',
    status: 'active' as const,
    phase: 'pre_production' as const,
    client: {
      id: 'cl_002',
      name: 'أحمد علي الكربلائي',
      company: 'شركة التقنية المتطورة',
      avatar: '/avatars/client2.jpg',
      email: 'info@techadvanced.iq',
      phone: '07709876543'
    },
    creator: {
      id: 'cr_002',
      name: 'علي حسين',
      specialization: 'مصمم هوية بصرية',
      avatar: '/avatars/ali.jpg',
      rating: 4.7
    },
    timeline: {
      startDate: '2025-08-25T09:00:00Z',
      deliveryDate: '2025-09-05T18:00:00Z',
      daysRemaining: 8,
      progress: 35,
      isOverdue: false
    },
    budget: {
      totalAmount: 980000,
      paidAmount: 490000,
      pendingAmount: 490000,
      currency: 'IQD'
    },
    category: 'تصميم',
    subcategory: 'هوية تجارية',
    priority: 'normal' as const,
    createdAt: '2025-08-25T09:00:00Z',
    updatedAt: '2025-08-28T11:20:00Z',
    lastActivity: 'تم تقديم 3 مفاهيم أولية للشعار',
    tags: ['هوية', 'شعار', 'شركة']
  },
  {
    id: 'p_003',
    projectNumber: 'DP-2025-0347',
    title: 'فيديو ترويجي لحدث افتتاح الفندق',
    description: 'إنتاج فيديو ترويجي احترافي مدته 3 دقائق لحفل الافتتاح',
    status: 'delivered' as const,
    phase: 'delivery' as const,
    client: {
      id: 'cl_003',
      name: 'سارة محمود',
      company: 'فندق بابل الذهبي',
      avatar: '/avatars/client3.jpg',
      email: 'marketing@babylon-hotel.com',
      phone: '07801357913'
    },
    creator: {
      id: 'cr_003',
      name: 'سارة أحمد',
      specialization: 'منتجة أفلام ترويجية',
      avatar: '/avatars/sara.jpg',
      rating: 4.8
    },
    timeline: {
      startDate: '2025-08-15T09:00:00Z',
      deliveryDate: '2025-08-27T18:00:00Z',
      daysRemaining: 0,
      progress: 100,
      isOverdue: false
    },
    budget: {
      totalAmount: 1250000,
      paidAmount: 1250000,
      pendingAmount: 0,
      currency: 'IQD'
    },
    category: 'فيديو',
    subcategory: 'ترويجي',
    priority: 'urgent' as const,
    createdAt: '2025-08-15T09:00:00Z',
    updatedAt: '2025-08-27T18:45:00Z',
    lastActivity: 'تم تسليم النسخة النهائية وموافقة العميل',
    tags: ['فيديو', 'فندق', 'ترويجي']
  },
  {
    id: 'p_004',
    projectNumber: 'DP-2025-0348',
    title: 'تصوير معماري لمجمع سكني جديد',
    description: 'تصوير احترافي للمجمع السكني الجديد من الداخل والخارج',
    status: 'paused' as const,
    phase: 'planning' as const,
    client: {
      id: 'cl_004',
      name: 'محمد سعد الجبوري',
      company: 'مجموعة الإعمار العراقية',
      avatar: '/avatars/client4.jpg',
      email: 'projects@imar-group.iq',
      phone: '07801456789'
    },
    creator: {
      id: 'cr_004',
      name: 'محمد الربيعي',
      specialization: 'مصور معماري',
      avatar: '/avatars/mohammed.jpg',
      rating: 4.6
    },
    timeline: {
      startDate: '2025-09-05T09:00:00Z',
      deliveryDate: '2025-09-15T18:00:00Z',
      daysRemaining: 18,
      progress: 10,
      isOverdue: false
    },
    budget: {
      totalAmount: 750000,
      paidAmount: 0,
      pendingAmount: 750000,
      currency: 'IQD'
    },
    category: 'تصوير',
    subcategory: 'معماري',
    priority: 'normal' as const,
    createdAt: '2025-08-28T09:00:00Z',
    updatedAt: '2025-08-28T09:00:00Z',
    lastActivity: 'مشروع معلق بانتظار موافقة العميل',
    tags: ['معماري', 'مجمع', 'سكني']
  },
  {
    id: 'p_005',
    projectNumber: 'DP-2025-0349',
    title: 'كتالوج منتجات إلكترونية',
    description: 'تصوير وتصميم كتالوج للمنتجات الإلكترونية الجديدة',
    status: 'active' as const,
    phase: 'production' as const,
    client: {
      id: 'cl_005',
      name: 'عمار حسن',
      company: 'متجر الإلكترونيات المتقدمة',
      avatar: '/avatars/client5.jpg',
      email: 'info@advanced-electronics.iq',
      phone: '07801123456'
    },
    creator: {
      id: 'cr_001',
      name: 'فاطمة الزهراء',
      specialization: 'تصوير المنتجات',
      avatar: '/avatars/fatima.jpg',
      rating: 4.9
    },
    timeline: {
      startDate: '2025-08-20T09:00:00Z',
      deliveryDate: '2025-08-30T18:00:00Z',
      daysRemaining: 2,
      progress: 85,
      isOverdue: false
    },
    budget: {
      totalAmount: 540000,
      paidAmount: 270000,
      pendingAmount: 270000,
      currency: 'IQD'
    },
    category: 'تصوير',
    subcategory: 'منتجات إلكترونية',
    priority: 'high' as const,
    createdAt: '2025-08-20T09:00:00Z',
    updatedAt: '2025-08-28T16:15:00Z',
    lastActivity: 'تم الانتهاء من 85% من التصوير',
    tags: ['إلكترونيات', 'كتالوج', 'منتجات']
  },
  {
    id: 'p_006',
    projectNumber: 'DP-2025-0350',
    title: 'حملة تسويقية متكاملة لعيادة أسنان',
    description: 'تصميم وتطوير حملة تسويقية شاملة مع صور ومواد ترويجية',
    status: 'cancelled' as const,
    phase: 'planning' as const,
    client: {
      id: 'cl_006',
      name: 'د. أحمد محمد الطبيب',
      company: 'عيادة الابتسامة المشرقة',
      avatar: '/avatars/client6.jpg',
      email: 'info@bright-smile-clinic.com',
      phone: '07801987654'
    },
    creator: {
      id: 'cr_002',
      name: 'علي حسين',
      specialization: 'حملات تسويقية',
      avatar: '/avatars/ali.jpg',
      rating: 4.7
    },
    timeline: {
      startDate: '2025-08-22T09:00:00Z',
      deliveryDate: '2025-09-10T18:00:00Z',
      daysRemaining: 0,
      progress: 5,
      isOverdue: false
    },
    budget: {
      totalAmount: 890000,
      paidAmount: 0,
      pendingAmount: 0,
      currency: 'IQD'
    },
    category: 'تصميم',
    subcategory: 'حملة تسويقية',
    priority: 'normal' as const,
    createdAt: '2025-08-22T09:00:00Z',
    updatedAt: '2025-08-26T14:00:00Z',
    lastActivity: 'تم إلغاء المشروع بطلب العميل',
    tags: ['عيادة', 'تسويق', 'ملغي']
  }
];

export default function ProjectsPage() {
  // حالة الصفحة الأساسية
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [categoryFilter, setCategoryFilter] = useState<string>('الكل');
  const [priorityFilter, setPriorityFilter] = useState<string>('الكل');
  const [phaseFilter, setPhaseFilter] = useState<string>('الكل');

  // المودالات
  const [projectDetailsOpened, { open: openProjectDetails, close: closeProjectDetails }] = useDisclosure(false);
  const [statusUpdateOpened, { open: openStatusUpdate, close: closeStatusUpdate }] = useDisclosure(false);
  const [paymentOpened, { open: openPayment, close: closePayment }] = useDisclosure(false);
  const [messageOpened, { open: openMessage, close: closeMessage }] = useDisclosure(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // تصفية المشاريع
  const filteredProjects = useMemo(() => {
    return mockProjects.filter(project => {
      // فلتر البحث النصي
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !project.client.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !project.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !project.projectNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // فلتر الحالة
      if (statusFilter !== 'الكل') {
        const statusMap: Record<string, string> = {
          'معلق': 'pending',
          'نشط': 'active', 
          'مُسلم': 'delivered',
          'مكتمل': 'completed',
          'ملغي': 'cancelled',
          'متوقف': 'paused'
        };
        if (project.status !== statusMap[statusFilter]) return false;
      }

      // فلتر الفئة
      if (categoryFilter !== 'الكل' && project.category !== categoryFilter) {
        return false;
      }

      // فلتر الأولوية
      if (priorityFilter !== 'الكل') {
        const priorityMap: Record<string, string> = {
          'عادي': 'normal',
          'عالي': 'high',
          'مستعجل': 'urgent'
        };
        if (project.priority !== priorityMap[priorityFilter]) return false;
      }

      // فلتر المرحلة
      if (phaseFilter !== 'الكل') {
        const phaseMap: Record<string, string> = {
          'تخطيط': 'planning',
          'ما قبل الإنتاج': 'pre_production',
          'إنتاج': 'production',
          'ما بعد الإنتاج': 'post_production',
          'تسليم': 'delivery',
          'مكتمل': 'completed'
        };
        if (project.phase !== phaseMap[phaseFilter]) return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, categoryFilter, priorityFilter, phaseFilter]);

  // دوال المودالات والأحداث
  const handleProjectAction = (project: Project, action: string) => {
    setSelectedProject(project);
    switch (action) {
      case 'details':
        openProjectDetails();
        break;
      case 'status':
        openStatusUpdate();
        break;
      case 'payment':
        openPayment();
        break;
      case 'message':
        openMessage();
        break;
      default:
        console.log(`إجراء ${action} على المشروع ${project.title}`);
    }
  };

  // دالة تنسيق العملة
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' د.ع';
  };

  // دالة تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // دالة الحصول على لون الحالة
  const getStatusColor = (status: string): "blue" | "green" | "yellow" | "red" | "gray" => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'active': return 'blue';
      case 'delivered': return 'green';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      case 'paused': return 'gray';
      default: return 'gray';
    }
  };

  // دالة الحصول على نص الحالة
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'معلق',
      'active': 'نشط',
      'delivered': 'مُسلم', 
      'completed': 'مكتمل',
      'cancelled': 'ملغي',
      'paused': 'متوقف'
    };
    return statusMap[status] || status;
  };

  // دالة الحصول على لون الأولوية
  const getPriorityColor = (priority: string): "blue" | "yellow" | "red" => {
    switch (priority) {
      case 'normal': return 'blue';
      case 'high': return 'yellow';
      case 'urgent': return 'red';
      default: return 'blue';
    }
  };

  // دالة الحصول على نص الأولوية
  const getPriorityText = (priority: string) => {
    const priorityMap: Record<string, string> = {
      'normal': 'عادي',
      'high': 'عالي',
      'urgent': 'مستعجل'
    };
    return priorityMap[priority] || priority;
  };

  return (
    <div className={styles.projectsContainer}>
      {/* رأس الصفحة */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>إدارة المشاريع</h1>
          <p className={styles.pageDescription}>
            متابعة وإدارة جميع المشاريع النشطة والمكتملة في المنصة
          </p>
        </div>
        <Group>
          <Button leftSection={<RefreshCw size={16} />} variant="light">
            تحديث
          </Button>
          <Button leftSection={<Download size={16} />} variant="light">
            تصدير
          </Button>
          <Button leftSection={<FileText size={16} />}>
            مشروع جديد
          </Button>
        </Group>
      </div>

      {/* بطاقات الإحصائيات */}
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} className={styles.statsGrid}>
        <StatsCard
          title="مشاريع نشطة"
          value={projectStats.activeProjects.toString()}
          icon={<Briefcase size={20} />}
          color="primary"
          trend={{
            value: 12.5,
            direction: 'up',
            label: 'من الشهر الماضي'
          }}
        />
        <StatsCard
          title="مكتملة هذا الشهر"
          value={projectStats.completedThisMonth.toString()}
          icon={<CheckCircle size={20} />}
          color="success"
          trend={{
            value: 8.3,
            direction: 'up',
            label: 'زيادة في الإنجاز'
          }}
        />
        <StatsCard
          title="متأخرة عن الموعد"
          value={projectStats.overdueProjects.toString()}
          icon={<AlertTriangle size={20} />}
          color="warning"
          trend={{
            value: 2.1,
            direction: 'down',
            label: 'تحسن في المواعيد'
          }}
        />
        <StatsCard
          title="إجمالي الإيرادات"
          value={`${(projectStats.totalRevenue / 1000000).toFixed(1)}م د.ع`}
          icon={<DollarSign size={20} />}
          color="info"
          trend={{
            value: 15.7,
            direction: 'up',
            label: 'نمو الإيرادات'
          }}
        />
        <StatsCard
          title="معدل الإنجاز في الوقت"
          value={`${projectStats.onTimeDelivery}%`}
          icon={<Clock size={20} />}
          color="success"
          trend={{
            value: 1.2,
            direction: 'up',
            label: 'تحسن الالتزام'
          }}
        />
        <StatsCard
          title="متوسط مدة المشروع"
          value={`${projectStats.avgProjectDuration} أيام`}
          icon={<Calendar size={20} />}
          color="neutral"
          trend={{
            value: 0.8,
            direction: 'down',
            label: 'تحسن الكفاءة'
          }}
        />
      </SimpleGrid>

      {/* قسم الفلاتر */}
      <div className={styles.filtersSection}>
        <Group className={styles.filtersTitle}>
          <Filter size={18} />
          <Text fw={600}>فلاتر البحث والتصفية</Text>
        </Group>
        
        <div className={styles.filtersGrid}>
          <TextInput
            placeholder="البحث في المشاريع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<Search size={16} />}
            className={styles.searchInput}
          />
          
          <Select
            placeholder="الحالة"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || 'الكل')}
            data={['الكل', 'معلق', 'نشط', 'مُسلم', 'مكتمل', 'ملغي', 'متوقف']}
          />
          
          <Select
            placeholder="الفئة"
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value || 'الكل')}
            data={['الكل', 'تصوير', 'تصميم', 'فيديو']}
          />
          
          <Select
            placeholder="الأولوية"
            value={priorityFilter}
            onChange={(value) => setPriorityFilter(value || 'الكل')}
            data={['الكل', 'عادي', 'عالي', 'مستعجل']}
          />
          
          <Select
            placeholder="المرحلة"
            value={phaseFilter}
            onChange={(value) => setPhaseFilter(value || 'الكل')}
            data={['الكل', 'تخطيط', 'ما قبل الإنتاج', 'إنتاج', 'ما بعد الإنتاج', 'تسليم', 'مكتمل']}
          />
        </div>

        <Group className={styles.filtersActions}>
          <Button 
            variant="light" 
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('الكل');
              setCategoryFilter('الكل');
              setPriorityFilter('الكل');
              setPhaseFilter('الكل');
            }}
          >
            مسح الفلاتر
          </Button>
          <Text size="sm" c="dimmed">
            عرض {filteredProjects.length} من {mockProjects.length} مشروع
          </Text>
        </Group>
      </div>

      {/* جدول المشاريع */}
      <div className={styles.projectsTable}>
        <ScrollArea>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>رقم المشروع</Table.Th>
                <Table.Th>تفاصيل المشروع</Table.Th>
                <Table.Th>العميل</Table.Th>
                <Table.Th>المبدع</Table.Th>
                <Table.Th>الحالة</Table.Th>
                <Table.Th>التقدم</Table.Th>
                <Table.Th>موعد التسليم</Table.Th>
                <Table.Th>الميزانية</Table.Th>
                <Table.Th>الأولوية</Table.Th>
                <Table.Th>آخر تحديث</Table.Th>
                <Table.Th>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredProjects.map((project) => (
                <Table.Tr key={project.id}>
                  {/* رقم المشروع */}
                  <Table.Td>
                    <Stack gap={2}>
                      <Text fw={600} size="sm">
                        {project.projectNumber}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {formatDate(project.createdAt)}
                      </Text>
                    </Stack>
                  </Table.Td>

                  {/* تفاصيل المشروع */}
                  <Table.Td>
                    <Box maw={200}>
                      <Text fw={600} size="sm" truncate="end">
                        {project.title}
                      </Text>
                      <Text size="xs" c="dimmed" truncate="end">
                        {project.category} • {project.subcategory}
                      </Text>
                      {project.lastActivity && (
                        <Text size="xs" c="blue" truncate="end">
                          {project.lastActivity}
                        </Text>
                      )}
                    </Box>
                  </Table.Td>

                  {/* العميل */}
                  <Table.Td>
                    <Group gap={8}>
                      <Avatar src={project.client.avatar} size={32}>
                        <Building2 size={16} />
                      </Avatar>
                      <Stack gap={2}>
                        <Text fw={500} size="sm">
                          {project.client.company}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {project.client.name}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>

                  {/* المبدع */}
                  <Table.Td>
                    <Group gap={8}>
                      <Avatar src={project.creator.avatar} size={32}>
                        <User size={16} />
                      </Avatar>
                      <Stack gap={2}>
                        <Text fw={500} size="sm">
                          {project.creator.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          ⭐ {project.creator.rating}
                        </Text>
                      </Stack>
                    </Group>
                  </Table.Td>

                  {/* الحالة */}
                  <Table.Td>
                    <Badge color={getStatusColor(project.status)} variant="light">
                      {getStatusText(project.status)}
                    </Badge>
                  </Table.Td>

                  {/* التقدم */}
                  <Table.Td>
                    <Stack gap={4}>
                      <MantineProgress 
                        value={project.timeline.progress} 
                        size="sm"
                        color={project.timeline.progress >= 75 ? 'green' : 
                               project.timeline.progress >= 50 ? 'blue' : 
                               project.timeline.progress >= 25 ? 'yellow' : 'red'}
                      />
                      <Text size="xs" ta="center">
                        {project.timeline.progress}%
                      </Text>
                    </Stack>
                  </Table.Td>

                  {/* موعد التسليم */}
                  <Table.Td>
                    <Stack gap={2}>
                      <Text size="sm" fw={project.timeline.isOverdue ? 600 : 400} 
                            c={project.timeline.isOverdue ? 'red' : undefined}>
                        {formatDate(project.timeline.deliveryDate)}
                      </Text>
                      <Text size="xs" c={project.timeline.daysRemaining <= 2 ? 'red' : 'dimmed'}>
                        {project.timeline.daysRemaining > 0 
                          ? `${project.timeline.daysRemaining} أيام متبقية`
                          : 'انتهى الموعد'
                        }
                      </Text>
                    </Stack>
                  </Table.Td>

                  {/* الميزانية */}
                  <Table.Td>
                    <Stack gap={2}>
                      <Text size="sm" fw={600}>
                        {formatCurrency(project.budget.totalAmount)}
                      </Text>
                      <Text size="xs" c="green">
                        مدفوع: {formatCurrency(project.budget.paidAmount)}
                      </Text>
                      {project.budget.pendingAmount > 0 && (
                        <Text size="xs" c="orange">
                          معلق: {formatCurrency(project.budget.pendingAmount)}
                        </Text>
                      )}
                    </Stack>
                  </Table.Td>

                  {/* الأولوية */}
                  <Table.Td>
                    <Badge color={getPriorityColor(project.priority)} variant="light">
                      {getPriorityText(project.priority)}
                    </Badge>
                  </Table.Td>

                  {/* آخر تحديث */}
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {formatDate(project.updatedAt)}
                    </Text>
                  </Table.Td>

                  {/* الإجراءات */}
                  <Table.Td>
                    <Group gap={4}>
                      <Tooltip label="عرض التفاصيل">
                        <ActionIcon 
                          variant="light" 
                          size="sm"
                          onClick={() => handleProjectAction(project, 'details')}
                        >
                          <Eye size={14} />
                        </ActionIcon>
                      </Tooltip>
                      
                      <Tooltip label="تحديث الحالة">
                        <ActionIcon 
                          variant="light" 
                          size="sm"
                          onClick={() => handleProjectAction(project, 'status')}
                        >
                          <Edit size={14} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="إدارة المدفوعات">
                        <ActionIcon 
                          variant="light" 
                          size="sm"
                          onClick={() => handleProjectAction(project, 'payment')}
                        >
                          <CreditCard size={14} />
                        </ActionIcon>
                      </Tooltip>

                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="light" size="sm">
                            <MoreVertical size={14} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item 
                            leftSection={<MessageCircle size={14} />}
                            onClick={() => handleProjectAction(project, 'message')}
                          >
                            مراسلة الفريق
                          </Menu.Item>
                          <Menu.Item 
                            leftSection={<FileText size={14} />}
                            onClick={() => console.log('تقرير المشروع')}
                          >
                            تقرير المشروع
                          </Menu.Item>
                          <Menu.Item 
                            leftSection={<Archive size={14} />}
                            onClick={() => console.log('أرشفة المشروع')}
                          >
                            أرشفة المشروع
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>

        {filteredProjects.length === 0 && (
          <div className={styles.emptyState}>
            <Briefcase size={48} opacity={0.3} />
            <Text size="lg" fw={600} c="dimmed">
              لا توجد مشاريع مطابقة للفلاتر المحددة
            </Text>
            <Text size="sm" c="dimmed">
              جرب تعديل معايير البحث أو مسح الفلاتر
            </Text>
          </div>
        )}
      </div>

      {/* مودال تفاصيل المشروع */}
      <Modal
        opened={projectDetailsOpened}
        onClose={closeProjectDetails}
        title={
          <Group>
            <Eye size={18} />
            <Text fw={600}>تفاصيل المشروع</Text>
          </Group>
        }
        size="xl"
        centered
      >
        {selectedProject && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text fw={600} size="lg">{selectedProject.title}</Text>
                <Text c="dimmed">{selectedProject.projectNumber}</Text>
              </div>
              <Badge color={getStatusColor(selectedProject.status)} size="lg">
                {getStatusText(selectedProject.status)}
              </Badge>
            </Group>

            <Text>{selectedProject.description}</Text>

            <SimpleGrid cols={2}>
              <div>
                <Text fw={600} mb={4}>معلومات العميل</Text>
                <Group>
                  <Avatar src={selectedProject.client.avatar} size={40}>
                    <Building2 size={20} />
                  </Avatar>
                  <div>
                    <Text fw={500}>{selectedProject.client.company}</Text>
                    <Text size="sm" c="dimmed">{selectedProject.client.name}</Text>
                    <Text size="xs" c="dimmed">{selectedProject.client.email}</Text>
                  </div>
                </Group>
              </div>

              <div>
                <Text fw={600} mb={4}>معلومات المبدع</Text>
                <Group>
                  <Avatar src={selectedProject.creator.avatar} size={40}>
                    <User size={20} />
                  </Avatar>
                  <div>
                    <Text fw={500}>{selectedProject.creator.name}</Text>
                    <Text size="sm" c="dimmed">{selectedProject.creator.specialization}</Text>
                    <Text size="xs" c="dimmed">⭐ {selectedProject.creator.rating}</Text>
                  </div>
                </Group>
              </div>
            </SimpleGrid>

            <div>
              <Text fw={600} mb={8}>تقدم المشروع</Text>
              <MantineProgress 
                value={selectedProject.timeline.progress} 
                size="lg"
                color={selectedProject.timeline.progress >= 75 ? 'green' : 'blue'}
              />
              <Group justify="space-between" mt={4}>
                <Text size="sm">التقدم: {selectedProject.timeline.progress}%</Text>
                <Text size="sm" c={selectedProject.timeline.daysRemaining <= 2 ? 'red' : undefined}>
                  {selectedProject.timeline.daysRemaining > 0 
                    ? `${selectedProject.timeline.daysRemaining} أيام متبقية`
                    : 'انتهى الموعد'
                  }
                </Text>
              </Group>
            </div>

            <SimpleGrid cols={3}>
              <div>
                <Text fw={600}>إجمالي الميزانية</Text>
                <Text size="xl" c="blue">{formatCurrency(selectedProject.budget.totalAmount)}</Text>
              </div>
              <div>
                <Text fw={600}>المبلغ المدفوع</Text>
                <Text size="xl" c="green">{formatCurrency(selectedProject.budget.paidAmount)}</Text>
              </div>
              <div>
                <Text fw={600}>المعلق</Text>
                <Text size="xl" c="orange">{formatCurrency(selectedProject.budget.pendingAmount)}</Text>
              </div>
            </SimpleGrid>

            <Group justify="flex-end">
              <Button variant="light" onClick={closeProjectDetails}>
                إغلاق
              </Button>
              <Button onClick={() => {
                closeProjectDetails();
                openStatusUpdate();
              }}>
                تحديث المشروع
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* مودال تحديث الحالة */}
      <Modal
        opened={statusUpdateOpened}
        onClose={closeStatusUpdate}
        title={
          <Group>
            <Edit size={18} />
            <Text fw={600}>تحديث حالة المشروع</Text>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="md">
          <Text>تحديث حالة المشروع قريباً...</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={closeStatusUpdate}>إلغاء</Button>
            <Button>حفظ التغييرات</Button>
          </Group>
        </Stack>
      </Modal>

      {/* مودال إدارة المدفوعات */}
      <Modal
        opened={paymentOpened}
        onClose={closePayment}
        title={
          <Group>
            <CreditCard size={18} />
            <Text fw={600}>إدارة المدفوعات</Text>
          </Group>
        }
        size="lg"
        centered
      >
        <Stack gap="md">
          <Text>إدارة المدفوعات قريباً...</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={closePayment}>إغلاق</Button>
          </Group>
        </Stack>
      </Modal>

      {/* مودال المراسلة */}
      <Modal
        opened={messageOpened}
        onClose={closeMessage}
        title={
          <Group>
            <MessageCircle size={18} />
            <Text fw={600}>مراسلة الفريق</Text>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="md">
          <Text>نظام المراسلة قريباً...</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={closeMessage}>إغلاق</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
