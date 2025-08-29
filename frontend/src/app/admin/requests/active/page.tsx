'use client';

import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Title, 
  Group, 
  Button, 
  Select, 
  TextInput,
  Modal,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Card,
  Table,
  Pagination,
  Box,
  Avatar,
  SimpleGrid,
  Progress,
  RingProgress,
  Tooltip,
  Alert
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import styles from './ActiveRequestsPage.module.css';
import { 
  Search, 
  Filter, 
  Eye, 
  UserPlus,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  PlayCircle,
  DollarSign,
  Target,
  Activity,
  Settings,
  RefreshCw,
  Phone,
  Mail,
  Star,
  Zap,
  Timer
} from 'lucide-react';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';

// Types للطلبات النشطة
interface ActiveProject extends Record<string, unknown> {
  id: string;
  projectNumber: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  phase: 'planning' | 'production' | 'review' | 'delivery';
  
  // معلومات العميل
  client: {
    id: string;
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
  };
  
  // المبدع المسند
  creator?: {
    id: string;
    name: string;
    lastActive: string;
    status: 'available' | 'busy' | 'offline';
    rating: number;
    avatar?: string;
    specialization: string;
    completedProjects: number;
  };
  
  // معلومات الخدمة
  service: {
    category: 'photo' | 'video' | 'design' | 'editing';
    subcategory: string;
    location: 'studio' | 'client' | 'nearby' | 'outskirts' | 'far';
    processingLevel: string;
  };
  
  // التقدم والجدولة
  progress: {
    percentage: number;
    currentMilestone: string;
    nextMilestone: string;
    overallHealth: 'on_track' | 'at_risk' | 'delayed';
    completedMilestones: number;
    totalMilestones: number;
  };
  
  // المعلومات المالية
  pricing: {
    totalAmount: number;
    currency: 'IQD';
    paymentStatus: 'pending' | 'partial' | 'completed';
    advanceReceived: number;
    remainingAmount: number;
  };
  
  // الجدولة
  timeline: {
    startDate: string;
    deliveryDate: string;
    actualStartDate?: string;
    daysRemaining: number;
    bufferTime: string;
    isOverdue: boolean;
  };
  
  // العلامات والحالة
  flags: {
    priority: 'low' | 'normal' | 'high' | 'urgent';
    rush: boolean;
    clientVip: boolean;
    creatorTopPerformer: boolean;
  };
  
  createdAt: string;
  updatedAt: string;
}

// Mock Data - الطلبات النشطة
const mockActiveProjects: ActiveProject[] = [
  {
    id: 'p_001',
    projectNumber: 'DP-2025-0345',
    title: 'تصوير منتجات المطعم - الدفعة الأولى',
    status: 'active',
    phase: 'production',
    client: {
      id: 'cl_001',
      companyName: 'مطعم الشام الأصيل',
      contactName: 'محمد أحمد السوري',
      email: 'contact@alsham-restaurant.com',
      phone: '07801234567'
    },
    creator: {
      id: 'c_001',
      name: 'فاطمة الزهراء',
      lastActive: '2025-08-28T14:30:00Z',
      status: 'busy',
      rating: 4.9,
      avatar: '/avatars/fatima.jpg',
      specialization: 'Food Photography',
      completedProjects: 87
    },
    service: {
      category: 'photo',
      subcategory: 'food',
      location: 'client',
      processingLevel: 'full_retouch'
    },
    progress: {
      percentage: 65,
      currentMilestone: 'المعالجة والتعديل',
      nextMilestone: 'التسليم النهائي',
      overallHealth: 'on_track',
      completedMilestones: 2,
      totalMilestones: 3
    },
    pricing: {
      totalAmount: 620000,
      currency: 'IQD',
      paymentStatus: 'partial',
      advanceReceived: 310000,
      remainingAmount: 310000
    },
    timeline: {
      startDate: '2025-08-28T09:00:00Z',
      deliveryDate: '2025-09-01T18:00:00Z',
      actualStartDate: '2025-08-28T09:30:00Z',
      daysRemaining: 2,
      bufferTime: '6 ساعات',
      isOverdue: false
    },
    flags: {
      priority: 'normal',
      rush: false,
      clientVip: false,
      creatorTopPerformer: true
    },
    createdAt: '2025-08-26T10:00:00Z',
    updatedAt: '2025-08-28T14:30:00Z'
  },
  {
    id: 'p_002', 
    projectNumber: 'DP-2025-0346',
    title: 'حملة فيديو دعائية - بوتيك زهرة الياسمين',
    status: 'active',
    phase: 'planning',
    client: {
      id: 'cl_002',
      companyName: 'بوتيك زهرة الياسمين',
      contactName: 'سارة خالد الجبوري',
      email: 'info@yasmine-boutique.com',
      phone: '07709876543'
    },
    creator: {
      id: 'c_002',
      name: 'أحمد محمد الربيعي',
      lastActive: '2025-08-28T16:00:00Z',
      status: 'available',
      rating: 4.7,
      specialization: 'Commercial Video',
      completedProjects: 63
    },
    service: {
      category: 'video',
      subcategory: 'commercial',
      location: 'studio',
      processingLevel: 'advanced_composite'
    },
    progress: {
      percentage: 15,
      currentMilestone: 'التخطيط والإعداد',
      nextMilestone: 'جلسة التصوير',
      overallHealth: 'on_track',
      completedMilestones: 0,
      totalMilestones: 4
    },
    pricing: {
      totalAmount: 1250000,
      currency: 'IQD',
      paymentStatus: 'partial',
      advanceReceived: 625000,
      remainingAmount: 625000
    },
    timeline: {
      startDate: '2025-08-28T08:00:00Z',
      deliveryDate: '2025-09-05T17:00:00Z',
      actualStartDate: '2025-08-28T08:15:00Z',
      daysRemaining: 7,
      bufferTime: '1 يوم',
      isOverdue: false
    },
    flags: {
      priority: 'high',
      rush: false,
      clientVip: true,
      creatorTopPerformer: false
    },
    createdAt: '2025-08-27T14:00:00Z',
    updatedAt: '2025-08-28T16:00:00Z'
  },
  {
    id: 'p_003',
    projectNumber: 'DP-2025-0340',
    title: 'تصميم هوية بصرية - عيادة النور للتجميل',
    status: 'active',
    phase: 'review',
    client: {
      id: 'cl_003',
      companyName: 'عيادة النور للتجميل',
      contactName: 'د. أحمد علي الكردي',
      email: 'info@alnoor-clinic.com',
      phone: '07712345678'
    },
    creator: {
      id: 'c_003',
      name: 'ليلى حسن البصري',
      lastActive: '2025-08-28T13:45:00Z',
      status: 'busy',
      rating: 4.8,
      specialization: 'Brand Design',
      completedProjects: 45
    },
    service: {
      category: 'design',
      subcategory: 'branding',
      location: 'studio',
      processingLevel: 'advanced_composite'
    },
    progress: {
      percentage: 85,
      currentMilestone: 'مراجعة العميل',
      nextMilestone: 'التسليم النهائي',
      overallHealth: 'at_risk',
      completedMilestones: 3,
      totalMilestones: 4
    },
    pricing: {
      totalAmount: 890000,
      currency: 'IQD',
      paymentStatus: 'pending',
      advanceReceived: 0,
      remainingAmount: 890000
    },
    timeline: {
      startDate: '2025-08-20T09:00:00Z',
      deliveryDate: '2025-08-29T17:00:00Z',
      actualStartDate: '2025-08-20T10:30:00Z',
      daysRemaining: 1,
      bufferTime: '4 ساعات',
      isOverdue: false
    },
    flags: {
      priority: 'normal',
      rush: false,
      clientVip: false,
      creatorTopPerformer: false
    },
    createdAt: '2025-08-18T11:00:00Z',
    updatedAt: '2025-08-28T13:45:00Z'
  },
  {
    id: 'p_004',
    projectNumber: 'DP-2025-0342',
    title: 'مونتاج فيديو إعلاني - شركة البناء الحديثة',
    status: 'active',
    phase: 'delivery',
    client: {
      id: 'cl_004',
      companyName: 'شركة البناء الحديثة',
      contactName: 'عماد صالح الموسوي',
      email: 'contact@modernbuild.com',
      phone: '07891234567'
    },
    service: {
      category: 'editing',
      subcategory: 'commercial',
      location: 'studio',
      processingLevel: 'color_correction'
    },
    progress: {
      percentage: 95,
      currentMilestone: 'التسليم النهائي',
      nextMilestone: 'اعتماد العميل',
      overallHealth: 'delayed',
      completedMilestones: 4,
      totalMilestones: 5
    },
    pricing: {
      totalAmount: 780000,
      currency: 'IQD',
      paymentStatus: 'completed',
      advanceReceived: 780000,
      remainingAmount: 0
    },
    timeline: {
      startDate: '2025-08-22T10:00:00Z',
      deliveryDate: '2025-08-28T16:00:00Z',
      actualStartDate: '2025-08-22T11:00:00Z',
      daysRemaining: -1,
      bufferTime: '0',
      isOverdue: true
    },
    flags: {
      priority: 'urgent',
      rush: true,
      clientVip: false,
      creatorTopPerformer: false
    },
    createdAt: '2025-08-20T09:00:00Z',
    updatedAt: '2025-08-28T17:00:00Z'
  },
  {
    id: 'p_005',
    projectNumber: 'DP-2025-0348',
    title: 'جلسة تصوير منتجات - متجر الأناقة',
    status: 'active',
    phase: 'planning',
    client: {
      id: 'cl_005',
      companyName: 'متجر الأناقة للأزياء',
      contactName: 'زينب محمود العراقي',
      email: 'orders@elegance-store.com',
      phone: '07787654321'
    },
    service: {
      category: 'photo',
      subcategory: 'products',
      location: 'studio',
      processingLevel: 'basic'
    },
    progress: {
      percentage: 5,
      currentMilestone: 'التحضير والتنسيق',
      nextMilestone: 'جلسة التصوير',
      overallHealth: 'on_track',
      completedMilestones: 0,
      totalMilestones: 3
    },
    pricing: {
      totalAmount: 450000,
      currency: 'IQD',
      paymentStatus: 'pending',
      advanceReceived: 0,
      remainingAmount: 450000
    },
    timeline: {
      startDate: '2025-08-29T09:00:00Z',
      deliveryDate: '2025-09-02T15:00:00Z',
      daysRemaining: 4,
      bufferTime: '1 يوم',
      isOverdue: false
    },
    flags: {
      priority: 'low',
      rush: false,
      clientVip: false,
      creatorTopPerformer: false
    },
    createdAt: '2025-08-28T15:00:00Z',
    updatedAt: '2025-08-28T15:00:00Z'
  }
];

const ActiveRequestsPage: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string | null>('');
  const [healthFilter, setHealthFilter] = useState<string | null>('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>('');
  const [creatorFilter, setCreatorFilter] = useState<string | null>('');
  const [paymentFilter, setPaymentFilter] = useState<string | null>('');
  const [priorityFilter] = useState<string | null>('');
  const [selectedProject, setSelectedProject] = useState<ActiveProject | null>(null);
  
  // Modals
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [assignOpened, { open: openAssign, close: closeAssign }] = useDisclosure(false);
  const [phaseOpened, { open: openPhase, close: closePhase }] = useDisclosure(false);
  const [scheduleOpened, { open: openSchedule, close: closeSchedule }] = useDisclosure(false);

  // Stats calculation
  const stats = useMemo(() => {
    const total = mockActiveProjects.length;
    const inProduction = mockActiveProjects.filter(p => p.phase === 'production').length;
    const needsAssignment = mockActiveProjects.filter(p => !p.creator).length;
    const overdue = mockActiveProjects.filter(p => p.timeline.isOverdue).length;
    const atRisk = mockActiveProjects.filter(p => p.progress.overallHealth === 'at_risk').length;
    const delayed = mockActiveProjects.filter(p => p.progress.overallHealth === 'delayed').length;
    
    const totalRevenue = mockActiveProjects.reduce((sum, p) => sum + p.pricing.totalAmount, 0);
    const avgCompletion = Math.round(
      mockActiveProjects.reduce((sum, p) => sum + p.progress.percentage, 0) / total
    );

    return [
      { 
        title: 'إجمالي نشط', 
        value: total.toString(), 
        color: 'info' as const,
        icon: <Activity size={20} />,
        description: 'مشروع جاري'
      },
      { 
        title: 'قيد التنفيذ', 
        value: inProduction.toString(), 
        color: 'primary' as const,
        icon: <PlayCircle size={20} />,
        description: 'مرحلة الإنتاج'
      },
      { 
        title: 'بحاجة تعيين', 
        value: needsAssignment.toString(), 
        color: 'warning' as const,
        icon: <UserPlus size={20} />,
        description: 'بدون مبدع'
      },
      { 
        title: 'متأخرة ومعرضة للخطر', 
        value: (overdue + atRisk + delayed).toString(), 
        color: 'danger' as const,
        icon: <AlertTriangle size={20} />,
        description: 'تحتاج متابعة'
      },
      { 
        title: 'إيرادات متوقعة', 
        value: `${(totalRevenue / 1000000).toFixed(1)}M`, 
        color: 'success' as const,
        icon: <DollarSign size={20} />,
        description: 'دينار عراقي'
      },
      { 
        title: 'معدل الإنجاز', 
        value: `${avgCompletion}%`, 
        color: 'primary' as const,
        icon: <Target size={20} />,
        description: 'متوسط التقدم'
      }
    ];
  }, []);

  // Filtered data
  const filteredProjects = useMemo(() => {
    return mockActiveProjects.filter(project => {
      const matchesSearch = !searchQuery || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.creator?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPhase = !phaseFilter || project.phase === phaseFilter;
      const matchesHealth = !healthFilter || project.progress.overallHealth === healthFilter;
      const matchesCategory = !categoryFilter || project.service.category === categoryFilter;
      const matchesCreator = !creatorFilter || 
        (creatorFilter === 'assigned' && project.creator) ||
        (creatorFilter === 'unassigned' && !project.creator) ||
        (project.creator?.id === creatorFilter);
      const matchesPayment = !paymentFilter || project.pricing.paymentStatus === paymentFilter;
      const matchesPriority = !priorityFilter || project.flags.priority === priorityFilter;
      
      return matchesSearch && matchesPhase && matchesHealth && 
             matchesCategory && matchesCreator && matchesPayment && matchesPriority;
    });
  }, [searchQuery, phaseFilter, healthFilter, categoryFilter, creatorFilter, paymentFilter, priorityFilter]);

  // Helper functions
  const getCategoryDisplay = (category: string, subcategory: string) => {
    const categoryMap = {
      photo: { label: 'تصوير', color: 'blue', icon: '📷' },
      video: { label: 'فيديو', color: 'grape', icon: '🎬' },
      design: { label: 'تصميم', color: 'teal', icon: '🎨' },
      editing: { label: 'مونتاج', color: 'orange', icon: '✂️' }
    };
    const config = categoryMap[category as keyof typeof categoryMap] || categoryMap.photo;
    return (
      <Stack gap="xs" align="flex-start">
        <Badge color={config.color} size="sm" leftSection={config.icon}>
          {config.label}
        </Badge>
        <Text size="xs" c="dimmed">{subcategory}</Text>
      </Stack>
    );
  };

  const getPhaseDisplay = (phase: string, progress: number) => {
    const phaseMap = {
      planning: { label: 'تخطيط', color: 'gray', icon: <Settings size={12} /> },
      production: { label: 'إنتاج', color: 'blue', icon: <PlayCircle size={12} /> },
      review: { label: 'مراجعة', color: 'yellow', icon: <Eye size={12} /> },
      delivery: { label: 'تسليم', color: 'green', icon: <CheckCircle size={12} /> }
    };
    const config = phaseMap[phase as keyof typeof phaseMap] || phaseMap.planning;
    return (
      <Stack gap="xs" align="flex-start">
        <Badge color={config.color} size="sm" leftSection={config.icon}>
          {config.label}
        </Badge>
        <Progress value={progress} size="xs" w={60} color={config.color} />
        <Text size="xs" c="dimmed">{progress}%</Text>
      </Stack>
    );
  };

  const getHealthDisplay = (health: string, isOverdue: boolean) => {
    if (isOverdue) {
      return (
        <Badge color="red" size="sm" leftSection={<AlertTriangle size={12} />}>
          متأخر
        </Badge>
      );
    }
    
    const healthMap = {
      on_track: { label: 'مستقر', color: 'green', icon: <CheckCircle size={12} /> },
      at_risk: { label: 'معرض للخطر', color: 'yellow', icon: <AlertTriangle size={12} /> },
      delayed: { label: 'متأخر', color: 'red', icon: <Clock size={12} /> }
    };
    const config = healthMap[health as keyof typeof healthMap] || healthMap.on_track;
    return (
      <Badge color={config.color} size="sm" leftSection={config.icon}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityDisplay = (priority: string, rush: boolean) => {
    if (rush) {
      return (
        <Badge color="red" size="xs" leftSection={<Zap size={10} />}>
          مستعجل
        </Badge>
      );
    }
    
    const priorityMap = {
      low: { label: 'منخفضة', color: 'gray' },
      normal: { label: 'عادية', color: 'blue' },
      high: { label: 'عالية', color: 'orange' },
      urgent: { label: 'عاجل', color: 'red' }
    };
    const config = priorityMap[priority as keyof typeof priorityMap] || priorityMap.normal;
    return (
      <Badge color={config.color} size="xs">
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '0 د.ع';
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M د.ع`;
    }
    if (amount >= 1000) {
      return `${Math.round(amount / 1000)}K د.ع`;
    }
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const formatTimeRemaining = (days: number) => {
    if (days < 0) return `متأخر ${Math.abs(days)} يوم`;
    if (days === 0) return 'اليوم';
    if (days === 1) return 'غداً';
    return `${days} يوم`;
  };

  // Table columns
  interface TableColumn {
    key: string;
    label: string;
    width?: number;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  }

  const columns: TableColumn[] = [
    {
      key: 'project',
      label: 'معلومات المشروع',
      width: 300,
      render: (_, row) => {
        const project = row as unknown as ActiveProject;
        return (
          <Stack gap="xs">
            <Group justify="apart">
              <Text size="sm" fw={600}>{project.projectNumber}</Text>
              {project.flags.clientVip && (
                <Badge color="yellow" size="xs">VIP</Badge>
              )}
            </Group>
            <Text size="sm" lineClamp={2}>{project.title}</Text>
            <Group gap="xs">
              <Text size="xs" c="dimmed">{project.client.companyName}</Text>
              <Text size="xs" c="dimmed">•</Text>
              <Text size="xs" c="dimmed">{project.client.contactName}</Text>
            </Group>
            {getPriorityDisplay(project.flags.priority, project.flags.rush)}
          </Stack>
        );
      }
    },
    {
      key: 'service',
      label: 'نوع الخدمة',
      render: (_, row) => {
        const project = row as unknown as ActiveProject;
        return getCategoryDisplay(project.service.category, project.service.subcategory);
      }
    },
    {
      key: 'creator',
      label: 'المبدع المسند',
      render: (_, row) => {
        const project = row as unknown as ActiveProject;
        if (!project.creator) {
          return (
            <Alert color="yellow" p="xs">
              <Text size="sm">غير مسند</Text>
            </Alert>
          );
        }
        
        return (
          <Group gap="sm">
            <Avatar
              src={project.creator.avatar}
              size={32}
              radius="sm"
            >
              {project.creator.name.charAt(0)}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>{project.creator.name}</Text>
              <Text size="xs" c="dimmed">{project.creator.specialization}</Text>
              <Group gap="xs" mt={2}>
                <Group gap={2}>
                  <Star size={10} fill="currentColor" />
                  <Text size="xs">{project.creator.rating}</Text>
                </Group>
                <Badge 
                  color={
                    project.creator.status === 'available' ? 'green' : 
                    project.creator.status === 'busy' ? 'yellow' : 'gray'
                  }
                  size="xs"
                  variant="light"
                >
                  {project.creator.status === 'available' ? 'نشط' : 
                   project.creator.status === 'busy' ? 'مشغول' : 'غير نشط'}
                </Badge>
                {project.flags.creatorTopPerformer && (
                  <Badge color="gold" size="xs">نجم</Badge>
                )}
              </Group>
            </div>
          </Group>
        );
      }
    },
    {
      key: 'progress',
      label: 'المرحلة والتقدم',
      render: (_, row) => {
        const project = row as unknown as ActiveProject;
        return (
          <Stack gap="xs" align="flex-start">
            {getPhaseDisplay(project.phase, project.progress.percentage)}
            <Text size="xs" c="dimmed">
              {project.progress.currentMilestone}
            </Text>
            <Text size="xs" c="blue">
              التالي: {project.progress.nextMilestone}
            </Text>
          </Stack>
        );
      }
    },
    {
      key: 'health',
      label: 'حالة الصحة',
      render: (_, row) => {
        const project = row as unknown as ActiveProject;
        return (
          <Stack gap="xs" align="flex-start">
            {getHealthDisplay(project.progress.overallHealth, project.timeline.isOverdue)}
            <Text size="xs" c="dimmed">
              {project.progress.completedMilestones}/{project.progress.totalMilestones} معالم
            </Text>
          </Stack>
        );
      }
    },
    {
      key: 'timeline',
      label: 'الجدولة',
      render: (_, row) => {
        const project = row as unknown as ActiveProject;
        return (
          <Stack gap="xs" align="flex-start">
            <Group gap="xs">
              <Calendar size={12} />
              <Text size="xs">
                البدء: {formatDate(project.timeline.startDate)}
              </Text>
            </Group>
            <Group gap="xs">
              <Timer size={12} />
              <Text size="xs" c={project.timeline.daysRemaining < 1 ? "red" : "dimmed"}>
                {formatTimeRemaining(project.timeline.daysRemaining)}
              </Text>
            </Group>
            <Text size="xs" c="dimmed">
              التسليم: {formatDate(project.timeline.deliveryDate)}
            </Text>
            {project.timeline.bufferTime && (
              <Text size="xs" c="green">
                مهلة: {project.timeline.bufferTime}
              </Text>
            )}
          </Stack>
        );
      }
    },
    {
      key: 'financial',
      label: 'القيمة المالية',
      render: (_, row) => {
        const project = row as unknown as ActiveProject;
        return (
          <Stack gap="xs" align="flex-start">
            <Text size="sm" fw={600}>
              {formatCurrency(project.pricing.totalAmount)}
            </Text>
            <Badge 
              color={
                project.pricing.paymentStatus === 'completed' ? 'green' :
                project.pricing.paymentStatus === 'partial' ? 'yellow' : 'red'
              }
              size="xs"
              variant="light"
            >
              {project.pricing.paymentStatus === 'completed' ? 'مكتمل' :
               project.pricing.paymentStatus === 'partial' ? 'جزئي' : 'فشل'}
            </Badge>
            {project.pricing.paymentStatus !== 'completed' && (
              <Text size="xs" c="orange">
                متبقي: {formatCurrency(project.pricing.remainingAmount)}
              </Text>
            )}
          </Stack>
        );
      }
    },
    {
      key: 'actions',
      label: 'إجراءات',
      width: 140,
      render: (_, row) => {
        const project = row as unknown as ActiveProject;
        return (
          <Group gap="xs">
            <Tooltip label="تفاصيل المشروع">
              <ActionIcon
                size="sm"
                variant="light"
                color="blue"
                onClick={() => {
                  setSelectedProject(project);
                  openDetails();
                }}
              >
                <Eye size={14} />
              </ActionIcon>
            </Tooltip>
            
            <Tooltip label="تعيين/تغيير المبدع">
              <ActionIcon
                size="sm"
                variant="light"
                color="green"
                onClick={() => {
                  setSelectedProject(project);
                  openAssign();
                }}
              >
                <UserPlus size={14} />
              </ActionIcon>
            </Tooltip>
            
            <Tooltip label="تحديث المرحلة">
              <ActionIcon
                size="sm"
                variant="light"
                color="orange"
                onClick={() => {
                  setSelectedProject(project);
                  openPhase();
                }}
              >
                <RefreshCw size={14} />
              </ActionIcon>
            </Tooltip>
            
            <Tooltip label="إدارة الجدولة">
              <ActionIcon
                size="sm"
                variant="light"
                color="violet"
                onClick={() => {
                  setSelectedProject(project);
                  openSchedule();
                }}
              >
                <Calendar size={14} />
              </ActionIcon>
            </Tooltip>
          </Group>
        );
      }
    }
  ];

  // Handlers
  const handleAssignCreator = (creatorId: string) => {
    console.log('Assigning creator:', creatorId, 'to project:', selectedProject?.id);
    closeAssign();
    // Here you would call the API to assign the creator
  };

  const handleUpdatePhase = (newPhase: string, reason: string) => {
    console.log('Updating phase:', newPhase, 'reason:', reason, 'for project:', selectedProject?.id);
    closePhase();
    // Here you would call the API to update project phase
  };

  const handleUpdateSchedule = (newDeliveryDate: string, reason: string) => {
    console.log('Updating schedule:', newDeliveryDate, 'reason:', reason, 'for project:', selectedProject?.id);
    closeSchedule();
    // Here you would call the API to update project timeline
  };

  return (
    <Container size="xl" className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <Group justify="apart">
          <div>
            <Title order={1} className={styles.pageTitle}>
              إدارة الطلبات النشطة
            </Title>
            <Text className={styles.pageDescription}>
              متابعة وإدارة المشاريع قيد التنفيذ مع أدوات تعيين المبدعين ومراقبة التقدم
            </Text>
          </div>
          <Button leftSection={<RefreshCw size={16} />} variant="light">
            تحديث البيانات
          </Button>
        </Group>
      </div>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 2, xs: 3, lg: 6 }} className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </SimpleGrid>

      {/* Filters */}
      <div className={styles.filters}>
        <Group justify="space-between" className={styles.filtersHeader}>
          <Group gap="md">
            <TextInput
              placeholder="البحث في المشاريع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<Search size={16} />}
              className={styles.searchInput}
            />
            
            <Select
              placeholder="المرحلة"
              value={phaseFilter}
              onChange={setPhaseFilter}
              data={[
                { value: '', label: 'جميع المراحل' },
                { value: 'planning', label: 'تخطيط' },
                { value: 'production', label: 'إنتاج' },
                { value: 'review', label: 'مراجعة' },
                { value: 'delivery', label: 'تسليم' }
              ]}
              className={styles.filterSelect}
            />
            
            <Select
              placeholder="حالة الصحة"
              value={healthFilter}
              onChange={setHealthFilter}
              data={[
                { value: '', label: 'جميع الحالات' },
                { value: 'on_track', label: 'مستقر' },
                { value: 'at_risk', label: 'معرض للخطر' },
                { value: 'delayed', label: 'متأخر' }
              ]}
              className={styles.filterSelect}
            />
            
            <Select
              placeholder="نوع الخدمة"
              value={categoryFilter}
              onChange={setCategoryFilter}
              data={[
                { value: '', label: 'جميع الأنواع' },
                { value: 'photo', label: 'تصوير' },
                { value: 'video', label: 'فيديو' },
                { value: 'design', label: 'تصميم' },
                { value: 'editing', label: 'مونتاج' }
              ]}
              className={styles.filterSelect}
            />
            
            <Select
              placeholder="المبدع"
              value={creatorFilter}
              onChange={setCreatorFilter}
              data={[
                { value: '', label: 'الجميع' },
                { value: 'assigned', label: 'مسند' },
                { value: 'unassigned', label: 'غير مسند' }
              ]}
              className={styles.filterSelect}
            />
            
            <Select
              placeholder="الدفع"
              value={paymentFilter}
              onChange={setPaymentFilter}
              data={[
                { value: '', label: 'جميع الحالات' },
                { value: 'pending', label: 'معلق' },
                { value: 'partial', label: 'جزئي' },
                { value: 'completed', label: 'مكتمل' }
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
            {filteredProjects.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                  <Text c="dimmed">لا يوجد طلبات نشطة</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredProjects.map((row) => (
                <Table.Tr 
                  key={row.id} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedProject(row);
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

      {/* Project Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={`تفاصيل المشروع: ${selectedProject?.projectNumber}`}
        size="xl"
        centered
      >
        {selectedProject && (
          <Stack gap="lg">
            {/* Project Overview */}
            <Card padding="lg" radius="md" withBorder>
              <Group justify="apart" mb="md">
                <div>
                  <Title order={3}>{selectedProject.title}</Title>
                  <Text c="dimmed" size="sm">{selectedProject.projectNumber}</Text>
                </div>
                <Group gap="xs">
                  {getPhaseDisplay(selectedProject.phase, selectedProject.progress.percentage)}
                  {getHealthDisplay(selectedProject.progress.overallHealth, selectedProject.timeline.isOverdue)}
                </Group>
              </Group>
              
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <div>
                  <Text size="sm" c="dimmed" mb="xs">العميل</Text>
                  <Text size="sm" fw={600}>{selectedProject.client.companyName}</Text>
                  <Text size="sm">{selectedProject.client.contactName}</Text>
                  <Group gap="xs" mt="xs">
                    <Mail size={12} />
                    <Text size="xs" c="dimmed">{selectedProject.client.email}</Text>
                  </Group>
                  <Group gap="xs">
                    <Phone size={12} />
                    <Text size="xs" c="dimmed">{selectedProject.client.phone}</Text>
                  </Group>
                </div>
                
                <div>
                  <Text size="sm" c="dimmed" mb="xs">المبدع المسند</Text>
                  {selectedProject.creator ? (
                    <>
                      <Text size="sm" fw={600}>{selectedProject.creator.name}</Text>
                      <Text size="sm">{selectedProject.creator.specialization}</Text>
                      <Group gap="xs" mt="xs">
                        <Star size={12} fill="currentColor" />
                        <Text size="xs">{selectedProject.creator.rating}</Text>
                        <Text size="xs" c="dimmed">({selectedProject.creator.completedProjects} مشروع)</Text>
                      </Group>
                    </>
                  ) : (
                    <Alert color="yellow">
                      لم يتم تعيين مبدع بعد
                    </Alert>
                  )}
                </div>
              </SimpleGrid>
            </Card>

            {/* Progress Details */}
            <Card padding="lg" radius="md" withBorder>
              <Text size="sm" c="dimmed" mb="md">تفاصيل التقدم</Text>
              <Group justify="apart" mb="md">
                <Text size="lg" fw={600}>
                  {selectedProject.progress.percentage}% مكتمل
                </Text>
                <RingProgress
                  size={80}
                  thickness={8}
                  sections={[
                    { value: selectedProject.progress.percentage, color: 'blue' }
                  ]}
                  label={
                    <Text size="xs" ta="center">
                      {selectedProject.progress.percentage}%
                    </Text>
                  }
                />
              </Group>
              
              <Stack gap="sm">
                <Group justify="apart">
                  <Text size="sm">المعلم الحالي:</Text>
                  <Text size="sm" fw={500}>{selectedProject.progress.currentMilestone}</Text>
                </Group>
                <Group justify="apart">
                  <Text size="sm">التالي:</Text>
                  <Text size="sm" c="blue">{selectedProject.progress.nextMilestone}</Text>
                </Group>
                <Group justify="apart">
                  <Text size="sm">معالم مكتملة:</Text>
                  <Text size="sm">
                    {selectedProject.progress.completedMilestones} من {selectedProject.progress.totalMilestones}
                  </Text>
                </Group>
              </Stack>
            </Card>

            {/* Timeline and Financial */}
            <Group grow>
              <Card padding="md" radius="md" withBorder>
                <Text size="sm" c="dimmed" mb="xs">الجدولة</Text>
                <Stack gap="xs">
                  <Text size="sm">
                    <strong>البدء:</strong> {formatDate(selectedProject.timeline.startDate)}
                  </Text>
                  <Text size="sm">
                    <strong>التسليم:</strong> {formatDate(selectedProject.timeline.deliveryDate)}
                  </Text>
                  <Text size="sm" c={selectedProject.timeline.daysRemaining < 1 ? "red" : undefined}>
                    <strong>متبقي:</strong> {formatTimeRemaining(selectedProject.timeline.daysRemaining)}
                  </Text>
                  {selectedProject.timeline.bufferTime && (
                    <Text size="sm" c="green">
                      <strong>مهلة إضافية:</strong> {selectedProject.timeline.bufferTime}
                    </Text>
                  )}
                </Stack>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Text size="sm" c="dimmed" mb="xs">المعلومات المالية</Text>
                <Stack gap="xs">
                  <Text size="sm">
                    <strong>القيمة الإجمالية:</strong> {formatCurrency(selectedProject.pricing.totalAmount)}
                  </Text>
                  <Text size="sm">
                    <strong>المستلم:</strong> {formatCurrency(selectedProject.pricing.advanceReceived)}
                  </Text>
                  <Text size="sm">
                    <strong>المتبقي:</strong> {formatCurrency(selectedProject.pricing.remainingAmount)}
                  </Text>
                  <Badge 
                    color={
                      selectedProject.pricing.paymentStatus === 'completed' ? 'green' :
                      selectedProject.pricing.paymentStatus === 'partial' ? 'yellow' : 'red'
                    }
                    variant="light"
                  >
                    {selectedProject.pricing.paymentStatus === 'completed' ? 'مكتمل' :
                     selectedProject.pricing.paymentStatus === 'partial' ? 'جزئي' : 'فشل'}
                  </Badge>
                </Stack>
              </Card>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Assign Creator Modal - Simplified for now */}
      <Modal
        opened={assignOpened}
        onClose={closeAssign}
        title="تعيين مبدع"
        size="lg"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            تعيين مبدع جديد للمشروع <strong>{selectedProject?.title}</strong>
          </Text>
          
          <Alert color="blue">
            <Text size="sm">
              سيتم عرض قائمة المبدعين المتاحين هنا مع التقييمات والخبرة
            </Text>
          </Alert>
          
          <Group justify="flex-end" gap="md">
            <Button variant="light" onClick={closeAssign}>
              إلغاء
            </Button>
            <Button onClick={() => handleAssignCreator('sample_creator_id')}>
              تعيين المبدع
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Update Phase Modal - Simplified for now */}
      <Modal
        opened={phaseOpened}
        onClose={closePhase}
        title="تحديث المرحلة"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            تحديث مرحلة المشروع <strong>{selectedProject?.projectNumber}</strong>
          </Text>
          
          <Alert color="blue">
            <Text size="sm">
              المرحلة الحالية: <strong>{selectedProject?.phase}</strong>
            </Text>
          </Alert>
          
          <Group justify="flex-end" gap="md">
            <Button variant="light" onClick={closePhase}>
              إلغاء
            </Button>
            <Button onClick={() => handleUpdatePhase('production', 'تم الانتهاء من التخطيط')}>
              تحديث المرحلة
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Schedule Management Modal - Simplified for now */}
      <Modal
        opened={scheduleOpened}
        onClose={closeSchedule}
        title="إدارة الجدولة"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            تعديل جدولة المشروع <strong>{selectedProject?.projectNumber}</strong>
          </Text>
          
          <Alert color="yellow">
            <Text size="sm">
              تاريخ التسليم الحالي: {selectedProject && formatDate(selectedProject.timeline.deliveryDate)}
            </Text>
          </Alert>
          
          <Group justify="flex-end" gap="md">
            <Button variant="light" onClick={closeSchedule}>
              إلغاء
            </Button>
            <Button onClick={() => handleUpdateSchedule('2025-09-05', 'طلب العميل')}>
              حفظ التعديل
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ActiveRequestsPage;
