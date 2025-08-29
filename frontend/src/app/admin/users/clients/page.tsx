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
  Avatar,
  SimpleGrid,
  Card,
  Rating,
  Progress,
  Table
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  Search, 
  Filter, 
  Eye, 
  UserX,
  MapPin,
  Building2,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  AlertTriangle,
  Crown,
  DollarSign,
  Activity,
  Shield
} from 'lucide-react';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';
import styles from './ClientsPage.module.css';

// Types للعملاء
interface Client extends Record<string, unknown> {
  id: string;
  userId: string;
  fullName: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  businessType: 'individual' | 'company' | 'agency';
  industry: string;
  logo?: string;
  
  // الموقع
  location: {
    governorate: string;
    area: string;
  };
  
  // الحالة والتواريخ
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  registeredAt: string;
  lastActive: string;
  approvedAt?: string;
  approvedBy?: string;
  
  // الإحصائيات المالية
  stats: {
    totalProjects: number;
    completedProjects: number;
    activeProjects: number;
    totalSpent: number;
    pendingPayments: number;
    avgProjectValue: number;
    lifetimeValue: number;
    paymentReliability: 'excellent' | 'good' | 'fair' | 'poor';
    creditStatus: 'excellent' | 'good' | 'warning' | 'poor';
  };
  
  // الرضا والتقييم
  satisfaction: {
    avgRating: number;
    totalReviews: number;
    recommendationRate: string;
    complaints: number;
  };
  
  // العلامات والتقييم
  flags: {
    verified: boolean;
    vip: boolean;
    risk: 'low' | 'medium' | 'high';
  };
  
  // التفضيلات المالية
  paymentTerms: 'advance_50' | 'advance_100' | 'net_15' | 'net_30';
  creditLimit?: number;
  
  // الفئات المفضلة
  preferredCategories?: {
    category: string;
    percentage: number;
    count: number;
  }[];
}

// Mock Data - بيانات العملاء
const mockClients: Client[] = [
  {
    id: 'cl_001',
    userId: 'u_001',
    fullName: 'محمد أحمد السوري',
    companyName: 'مطعم الشام الأصيل',
    contactName: 'محمد أحمد السوري',
    email: 'contact@alsham-restaurant.com',
    phone: '07801234567',
    businessType: 'company',
    industry: 'restaurants',
    logo: '/logos/alsham.jpg',
    location: {
      governorate: 'بغداد',
      area: 'الكرادة'
    },
    status: 'active',
    registeredAt: '2025-06-15T10:00:00Z',
    lastActive: '2025-08-27T14:30:00Z',
    approvedAt: '2025-06-16T09:30:00Z',
    approvedBy: 'admin@depth-agency.com',
    stats: {
      totalProjects: 13,
      completedProjects: 11,
      activeProjects: 2,
      totalSpent: 5485000,
      pendingPayments: 308000,
      avgProjectValue: 421538,
      lifetimeValue: 5485000,
      paymentReliability: 'excellent',
      creditStatus: 'excellent'
    },
    satisfaction: {
      avgRating: 4.8,
      totalReviews: 11,
      recommendationRate: '91%',
      complaints: 0
    },
    flags: {
      verified: true,
      vip: false,
      risk: 'low'
    },
    paymentTerms: 'net_15',
    creditLimit: 2000000,
    preferredCategories: [
      { category: 'photo', percentage: 70, count: 9 },
      { category: 'video', percentage: 30, count: 4 }
    ]
  },
  {
    id: 'cl_002',
    userId: 'u_002',
    fullName: 'سارة خالد الجبوري',
    companyName: 'بوتيك زهرة الياسمين',
    contactName: 'سارة خالد الجبوري',
    email: 'info@yasmine-boutique.com',
    phone: '07709876543',
    businessType: 'company',
    industry: 'fashion',
    logo: '/logos/yasmine.jpg',
    location: {
      governorate: 'بغداد',
      area: 'الجادرية'
    },
    status: 'active',
    registeredAt: '2025-03-20T11:15:00Z',
    lastActive: '2025-08-26T16:45:00Z',
    approvedAt: '2025-03-21T10:00:00Z',
    approvedBy: 'admin@depth-agency.com',
    stats: {
      totalProjects: 28,
      completedProjects: 25,
      activeProjects: 3,
      totalSpent: 8750000,
      pendingPayments: 0,
      avgProjectValue: 312500,
      lifetimeValue: 8750000,
      paymentReliability: 'excellent',
      creditStatus: 'excellent'
    },
    satisfaction: {
      avgRating: 4.9,
      totalReviews: 25,
      recommendationRate: '96%',
      complaints: 0
    },
    flags: {
      verified: true,
      vip: true,
      risk: 'low'
    },
    paymentTerms: 'advance_50',
    creditLimit: 5000000,
    preferredCategories: [
      { category: 'photo', percentage: 85, count: 24 },
      { category: 'design', percentage: 15, count: 4 }
    ]
  },
  {
    id: 'cl_003',
    userId: 'u_003',
    fullName: 'أحمد علي الكردي',
    companyName: 'عيادة النور للتجميل',
    contactName: 'د. أحمد علي الكردي',
    email: 'info@alnoor-clinic.com',
    phone: '07712345678',
    businessType: 'company',
    industry: 'beauty',
    location: {
      governorate: 'أربيل',
      area: 'المركز'
    },
    status: 'active',
    registeredAt: '2025-07-10T09:00:00Z',
    lastActive: '2025-08-25T12:30:00Z',
    approvedAt: '2025-07-11T14:20:00Z',
    approvedBy: 'admin@depth-agency.com',
    stats: {
      totalProjects: 7,
      completedProjects: 5,
      activeProjects: 2,
      totalSpent: 2150000,
      pendingPayments: 450000,
      avgProjectValue: 307142,
      lifetimeValue: 2150000,
      paymentReliability: 'good',
      creditStatus: 'good'
    },
    satisfaction: {
      avgRating: 4.6,
      totalReviews: 5,
      recommendationRate: '80%',
      complaints: 1
    },
    flags: {
      verified: true,
      vip: false,
      risk: 'low'
    },
    paymentTerms: 'net_30',
    creditLimit: 1000000
  },
  {
    id: 'cl_004',
    userId: 'u_004',
    fullName: 'فاطمة حسين الموسوي',
    companyName: '',
    contactName: 'فاطمة حسين الموسوي',
    email: 'fatima.individual@gmail.com',
    phone: '07887654321',
    businessType: 'individual',
    industry: 'personal',
    location: {
      governorate: 'النجف',
      area: 'المركز'
    },
    status: 'pending',
    registeredAt: '2025-08-20T16:30:00Z',
    lastActive: '2025-08-22T10:15:00Z',
    stats: {
      totalProjects: 0,
      completedProjects: 0,
      activeProjects: 0,
      totalSpent: 0,
      pendingPayments: 0,
      avgProjectValue: 0,
      lifetimeValue: 0,
      paymentReliability: 'fair',
      creditStatus: 'warning'
    },
    satisfaction: {
      avgRating: 0,
      totalReviews: 0,
      recommendationRate: '0%',
      complaints: 0
    },
    flags: {
      verified: false,
      vip: false,
      risk: 'medium'
    },
    paymentTerms: 'advance_100',
    creditLimit: 500000
  },
  {
    id: 'cl_005',
    userId: 'u_005',
    fullName: 'حسام محمد العبيدي',
    companyName: 'وكالة الإبداع الرقمي',
    contactName: 'حسام محمد العبيدي',
    email: 'contact@digital-creative.com',
    phone: '07798765432',
    businessType: 'agency',
    industry: 'marketing',
    location: {
      governorate: 'البصرة',
      area: 'العشار'
    },
    status: 'suspended',
    registeredAt: '2025-05-05T08:45:00Z',
    lastActive: '2025-08-10T14:20:00Z',
    approvedAt: '2025-05-06T11:30:00Z',
    approvedBy: 'admin@depth-agency.com',
    stats: {
      totalProjects: 15,
      completedProjects: 12,
      activeProjects: 0,
      totalSpent: 3200000,
      pendingPayments: 850000,
      avgProjectValue: 213333,
      lifetimeValue: 3200000,
      paymentReliability: 'poor',
      creditStatus: 'poor'
    },
    satisfaction: {
      avgRating: 3.2,
      totalReviews: 12,
      recommendationRate: '25%',
      complaints: 5
    },
    flags: {
      verified: true,
      vip: false,
      risk: 'high'
    },
    paymentTerms: 'advance_100',
    creditLimit: 0
  }
];

const ClientsPage: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string | null>('');
  const [industryFilter, setIndustryFilter] = useState<string | null>('');
  const [statusFilter] = useState<string | null>('');
  const [paymentReliabilityFilter, setPaymentReliabilityFilter] = useState<string | null>('');
  const [vipFilter, setVipFilter] = useState<string | null>('');
  const [riskFilter, setRiskFilter] = useState<string | null>('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Modals
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [vipManagementOpened, { open: openVipManagement, close: closeVipManagement }] = useDisclosure(false);
  const [suspendOpened, { open: openSuspend, close: closeSuspend }] = useDisclosure(false);

  // Stats calculation
  const stats = useMemo(() => {
    const total = mockClients.length;
    const active = mockClients.filter(c => c.status === 'active').length;
    const vip = mockClients.filter(c => c.flags.vip).length;
    const pending = mockClients.filter(c => c.status === 'pending').length;
    
    const monthlyRevenue = mockClients.reduce((sum, c) => 
      c.status === 'active' ? sum + (c.stats.lifetimeValue / 12) : sum, 0);
    
    const totalSpent = mockClients.reduce((sum, c) => sum + c.stats.totalSpent, 0);
    const avgProjectValue = totalSpent / mockClients.reduce((sum, c) => sum + c.stats.totalProjects, 1);
    
    const excellentPayment = mockClients.filter(c => 
      c.stats.paymentReliability === 'excellent').length;
    const paymentReliabilityRate = Math.round((excellentPayment / total) * 100);

    return [
      { 
        title: 'إجمالي العملاء', 
        value: total.toString(), 
        color: 'info' as const,
        icon: <Building2 size={20} />,
        description: 'جميع العملاء'
      },
      { 
        title: 'نشط', 
        value: active.toString(), 
        color: 'success' as const,
        icon: <CheckCircle size={20} />,
        description: 'عملاء نشطين'
      },
      { 
        title: 'VIP', 
        value: vip.toString(), 
        color: 'warning' as const,
        icon: <Crown size={20} />,
        description: 'عملاء مميزين'
      },
      { 
        title: 'قيد المراجعة', 
        value: pending.toString(), 
        color: 'primary' as const,
        icon: <Clock size={20} />,
        description: 'بانتظار الموافقة'
      },
      { 
        title: 'الإيرادات الشهرية', 
        value: `${(monthlyRevenue / 1000000).toFixed(1)}M`, 
        color: 'success' as const,
        icon: <DollarSign size={20} />,
        description: 'دينار عراقي'
      },
      { 
        title: 'متوسط المشروع', 
        value: `${Math.round(avgProjectValue / 1000)}K`, 
        color: 'info' as const,
        icon: <TrendingUp size={20} />,
        description: 'دينار عراقي'
      },
      { 
        title: 'موثوقية الدفع', 
        value: `${paymentReliabilityRate}%`, 
        color: 'success' as const,
        icon: <CreditCard size={20} />,
        description: 'معدل ممتاز'
      },
      { 
        title: 'معدل الاحتفاظ', 
        value: '89%', 
        color: 'primary' as const,
        icon: <Activity size={20} />,
        description: 'عملاء متكررين'
      }
    ];
  }, []);

  // Filtered data
  const filteredClients = useMemo(() => {
    return mockClients.filter(client => {
      const matchesSearch = !searchQuery || 
        client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBusinessType = !businessTypeFilter || client.businessType === businessTypeFilter;
      const matchesIndustry = !industryFilter || client.industry === industryFilter;
      const matchesStatus = !statusFilter || client.status === statusFilter;
      const matchesPaymentReliability = !paymentReliabilityFilter || 
        client.stats.paymentReliability === paymentReliabilityFilter;
      const matchesVip = !vipFilter || 
        (vipFilter === 'vip' && client.flags.vip) ||
        (vipFilter === 'regular' && !client.flags.vip);
      const matchesRisk = !riskFilter || client.flags.risk === riskFilter;
      
      return matchesSearch && matchesBusinessType && matchesIndustry && 
             matchesStatus && matchesPaymentReliability && matchesVip && matchesRisk;
    });
  }, [searchQuery, businessTypeFilter, industryFilter, statusFilter, 
      paymentReliabilityFilter, vipFilter, riskFilter]);

  // Helper functions
  const getBusinessTypeDisplay = (type: string) => {
    const typeMap = {
      individual: { label: 'فرد', color: 'gray', icon: '👤' },
      company: { label: 'شركة', color: 'blue', icon: '🏢' },
      agency: { label: 'وكالة', color: 'violet', icon: '🎯' }
    };
    const config = typeMap[type as keyof typeof typeMap] || typeMap.individual;
    return (
      <Badge color={config.color} size="sm" leftSection={config.icon}>
        {config.label}
      </Badge>
    );
  };

  const getIndustryDisplay = (industry: string) => {
    const industryMap: Record<string, { label: string; color: string; icon: string }> = {
      restaurants: { label: 'مطاعم', color: 'orange', icon: '🍽️' },
      fashion: { label: 'أزياء', color: 'pink', icon: '👗' },
      beauty: { label: 'تجميل', color: 'grape', icon: '💄' },
      marketing: { label: 'تسويق', color: 'teal', icon: '📈' },
      personal: { label: 'شخصي', color: 'gray', icon: '✨' },
      real_estate: { label: 'عقارات', color: 'yellow', icon: '🏠' }
    };
    const config = industryMap[industry] || { label: industry, color: 'gray', icon: '🔧' };
    return (
      <Badge color={config.color} size="xs" leftSection={config.icon}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentReliabilityDisplay = (reliability: string) => {
    const reliabilityMap = {
      excellent: { label: 'ممتاز', color: 'green' },
      good: { label: 'جيد', color: 'blue' },
      fair: { label: 'مقبول', color: 'yellow' },
      poor: { label: 'ضعيف', color: 'red' }
    };
    const config = reliabilityMap[reliability as keyof typeof reliabilityMap] || reliabilityMap.fair;
    return <Badge color={config.color} size="xs">{config.label}</Badge>;
  };

  const getCreditStatusDisplay = (status: string) => {
    const statusMap = {
      excellent: { label: 'ممتاز', color: 'green' },
      good: { label: 'جيد', color: 'blue' },
      warning: { label: 'تحذير', color: 'yellow' },
      poor: { label: 'ضعيف', color: 'red' }
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.warning;
    return <Badge color={config.color} size="xs">{config.label}</Badge>;
  };

  const getRiskDisplay = (risk: string) => {
    const riskMap = {
      low: { label: 'منخفض', color: 'green', icon: <Shield size={12} /> },
      medium: { label: 'متوسط', color: 'yellow', icon: <AlertTriangle size={12} /> },
      high: { label: 'عالي', color: 'red', icon: <AlertTriangle size={12} /> }
    };
    const config = riskMap[risk as keyof typeof riskMap] || riskMap.medium;
    return (
      <Badge color={config.color} size="xs" leftSection={config.icon}>
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
    return new Intl.NumberFormat('en-US').format(amount) + ' د.ع';
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  // Table columns  
  interface TableColumn {
    key: string;
    label: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  }

  const columns: TableColumn[] = [
    {
      key: 'profile',
      label: 'الملف الشخصي',
      render: (_, row) => {
        const client = row as unknown as Client;
        return (
          <Group gap="sm">
            <Avatar
              src={client.logo}
              size={40}
              radius="md"
            >
              {client.companyName ? client.companyName.charAt(0) : client.fullName.charAt(0)}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                {client.companyName || client.fullName}
              </Text>
              <Text size="xs" c="dimmed">{client.contactName}</Text>
              <Group gap="xs" mt={2}>
                <MapPin size={12} />
                <Text size="xs" c="dimmed">
                  {client.location.governorate} - {client.location.area}
                </Text>
              </Group>
            </div>
          </Group>
        );
      }
    },
    {
      key: 'business',
      label: 'نوع النشاط',
      render: (_, row) => {
        const client = row as unknown as Client;
        return (
          <Stack gap="xs" align="flex-start">
            {getBusinessTypeDisplay(client.businessType)}
            {getIndustryDisplay(client.industry)}
          </Stack>
        );
      }
    },
    {
      key: 'financial',
      label: 'الحالة المالية',
      render: (_, row) => {
        const client = row as unknown as Client;
        return (
          <Stack gap="xs" align="flex-start">
            <Group gap="xs">
              {getPaymentReliabilityDisplay(client.stats.paymentReliability)}
              {getCreditStatusDisplay(client.stats.creditStatus)}
            </Group>
            {client.flags.vip && (
              <Badge color="yellow" size="xs" leftSection={<Crown size={12} />}>
                VIP
              </Badge>
            )}
          </Stack>
        );
      }
    },
    {
      key: 'stats',
      label: 'الإحصائيات',
      render: (_, row) => {
        const client = row as unknown as Client;
        return (
          <Stack gap="xs" align="flex-start">
            <Text size="xs">
              <strong>{client.stats.totalProjects}</strong> مشروع إجمالي
            </Text>
            <Text size="xs">
              <strong>{client.stats.activeProjects}</strong> نشط الآن
            </Text>
            <Text size="xs" c={client.stats.completedProjects > 0 ? 'green' : 'dimmed'}>
              <strong>{client.stats.completedProjects}</strong> مكتمل
            </Text>
          </Stack>
        );
      }
    },
    {
      key: 'financial_value',
      label: 'القيمة المالية',
      render: (_, row) => {
        const client = row as unknown as Client;
        return (
          <Stack gap="xs" align="flex-start">
            <Text size="xs" fw={600}>
              {formatCurrency(client.stats.totalSpent)}
            </Text>
            <Text size="xs" c="dimmed">
              متوسط: {formatCurrency(client.stats.avgProjectValue)}
            </Text>
            {client.stats.pendingPayments > 0 && (
              <Text size="xs" c="orange">
                معلق: {formatCurrency(client.stats.pendingPayments)}
              </Text>
            )}
          </Stack>
        );
      }
    },
    {
      key: 'satisfaction',
      label: 'الرضا والتقييم',
      render: (_, row) => {
        const client = row as unknown as Client;
        if (client.satisfaction.totalReviews === 0) {
          return <Text size="sm" c="dimmed">لا يوجد تقييم</Text>;
        }
        return (
          <Stack gap="xs" align="flex-start">
            <Group gap="xs">
              <Rating value={client.satisfaction.avgRating} readOnly size="xs" />
              <Text size="sm" fw={500}>{client.satisfaction.avgRating}</Text>
            </Group>
            <Text size="xs" c="dimmed">
              ({client.satisfaction.totalReviews} تقييم)
            </Text>
            {client.satisfaction.complaints > 0 && (
              <Text size="xs" c="red">
                {client.satisfaction.complaints} شكوى
              </Text>
            )}
          </Stack>
        );
      }
    },
    {
      key: 'activity',
      label: 'آخر نشاط',
      render: (_, row) => {
        const client = row as unknown as Client;
        return (
          <Stack gap="xs" align="flex-start">
            <Text size="xs">
              آخر دخول: {formatDate(client.lastActive)}
            </Text>
            <Text size="xs" c="dimmed">
              انضم: {formatDate(client.registeredAt)}
            </Text>
            <Badge 
              color={
                client.status === 'active' ? 'green' : 
                client.status === 'pending' ? 'yellow' : 
                client.status === 'suspended' ? 'red' : 'gray'
              }
              variant="light"
              size="sm"
            >
              {client.status === 'active' ? 'نشط' : 
               client.status === 'pending' ? 'معلق' : 
               client.status === 'suspended' ? 'موقوف' : 'غير نشط'}
            </Badge>
          </Stack>
        );
      }
    },
    {
      key: 'risk',
      label: 'تقييم المخاطر',
      render: (_, row) => {
        const client = row as unknown as Client;
        return (
          <Stack gap="xs" align="flex-start">
            {getRiskDisplay(client.flags.risk)}
            {client.flags.verified && (
              <Badge color="green" size="xs">موثق</Badge>
            )}
            {client.creditLimit && (
              <Text size="xs" c="dimmed">
                حد ائتماني: {formatCurrency(client.creditLimit)}
              </Text>
            )}
          </Stack>
        );
      }
    },
    {
      key: 'actions',
      label: 'إجراءات',
      render: (_, row) => {
        const client = row as unknown as Client;
        return (
          <Group gap="xs">
            <ActionIcon
              size="sm"
              variant="light"
              color="blue"
              onClick={() => {
                setSelectedClient(client);
                openDetails();
              }}
            >
              <Eye size={14} />
            </ActionIcon>
            
            <ActionIcon
              size="sm"
              variant="light"
              color="yellow"
              onClick={() => {
                setSelectedClient(client);
                openVipManagement();
              }}
            >
              <Crown size={14} />
            </ActionIcon>
            
            {client.status !== 'suspended' && (
              <ActionIcon
                size="sm"
                variant="light"
                color="red"
                onClick={() => {
                  setSelectedClient(client);
                  openSuspend();
                }}
              >
                <UserX size={14} />
              </ActionIcon>
            )}
          </Group>
        );
      }
    }
  ];

  // Handlers
  const handleVipToggle = (upgrade: boolean) => {
    console.log(`${upgrade ? 'Upgrading' : 'Downgrading'} client to ${upgrade ? 'VIP' : 'Regular'}:`, selectedClient?.id);
    closeVipManagement();
    // Here you would call the API to update VIP status
  };

  const handleSuspendClient = () => {
    console.log('Suspending client:', selectedClient?.id);
    closeSuspend();
    // Here you would call the API to suspend the client
  };

  return (
    <Container size="xl" className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <Title order={1} className={styles.pageTitle}>
          إدارة العملاء
        </Title>
        <Text className={styles.pageDescription}>
          مراجعة وإدارة ملفات العملاء ومتابعة أدائهم المالي والتجاري
        </Text>
      </div>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 2, xs: 4, lg: 8 }} className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </SimpleGrid>

      {/* Filters */}
      <div className={styles.filters}>
        <Group justify="space-between" className={styles.filtersHeader}>
          <Group gap="md">
            <TextInput
              placeholder="البحث في العملاء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<Search size={16} />}
              className={styles.searchInput}
            />
            
            <Select
              placeholder="نوع النشاط"
              value={businessTypeFilter}
              onChange={setBusinessTypeFilter}
              data={[
                { value: '', label: 'جميع الأنواع' },
                { value: 'individual', label: 'فرد' },
                { value: 'company', label: 'شركة' },
                { value: 'agency', label: 'وكالة' }
              ]}
              className={styles.filterSelect}
            />
            
            <Select
              placeholder="المجال"
              value={industryFilter}
              onChange={setIndustryFilter}
              data={[
                { value: '', label: 'جميع المجالات' },
                { value: 'restaurants', label: 'مطاعم' },
                { value: 'fashion', label: 'أزياء' },
                { value: 'beauty', label: 'تجميل' },
                { value: 'marketing', label: 'تسويق' },
                { value: 'personal', label: 'شخصي' },
                { value: 'real_estate', label: 'عقارات' }
              ]}
              className={styles.filterSelect}
            />
            
            <Select
              placeholder="موثوقية الدفع"
              value={paymentReliabilityFilter}
              onChange={setPaymentReliabilityFilter}
              data={[
                { value: '', label: 'جميع المستويات' },
                { value: 'excellent', label: 'ممتاز' },
                { value: 'good', label: 'جيد' },
                { value: 'fair', label: 'مقبول' },
                { value: 'poor', label: 'ضعيف' }
              ]}
              className={styles.filterSelect}
            />
            
            <Select
              placeholder="VIP"
              value={vipFilter}
              onChange={setVipFilter}
              data={[
                { value: '', label: 'الجميع' },
                { value: 'vip', label: 'VIP' },
                { value: 'regular', label: 'عادي' }
              ]}
              className={styles.filterSelect}
            />
            
            <Select
              placeholder="المخاطر"
              value={riskFilter}
              onChange={setRiskFilter}
              data={[
                { value: '', label: 'جميع المستويات' },
                { value: 'low', label: 'منخفض' },
                { value: 'medium', label: 'متوسط' },
                { value: 'high', label: 'عالي' }
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
            {filteredClients.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                  <Text c="dimmed">لا يوجد عملاء</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredClients.map((row) => (
                <Table.Tr 
                  key={row.id} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedClient(row);
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

      {/* Client Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={`ملف العميل: ${selectedClient?.companyName || selectedClient?.fullName}`}
        size="xl"
        centered
      >
        {selectedClient && (
          <Stack gap="lg">
            {/* Client Header */}
            <Card padding="lg" radius="md" withBorder>
              <Group justify="apart">
                <Group gap="lg">
                  <Avatar
                    src={selectedClient.logo}
                    size={80}
                    radius="md"
                  >
                    {selectedClient.companyName ? 
                      selectedClient.companyName.charAt(0) : 
                      selectedClient.fullName.charAt(0)
                    }
                  </Avatar>
                  <div>
                    <Title order={3}>
                      {selectedClient.companyName || selectedClient.fullName}
                    </Title>
                    <Text c="dimmed" size="sm" mb="xs">{selectedClient.contactName}</Text>
                    <Group gap="xs" mb="xs">
                      <Phone size={14} />
                      <Text size="sm">{selectedClient.phone}</Text>
                      <Mail size={14} />
                      <Text size="sm">{selectedClient.email}</Text>
                    </Group>
                    <Group gap="xs">
                      <MapPin size={14} />
                      <Text size="sm">
                        {selectedClient.location.governorate} - {selectedClient.location.area}
                      </Text>
                    </Group>
                  </div>
                </Group>
                <Stack gap="xs" align="flex-end">
                  <Group gap="xs">
                    {getBusinessTypeDisplay(selectedClient.businessType)}
                    {getIndustryDisplay(selectedClient.industry)}
                  </Group>
                  {selectedClient.flags.vip && (
                    <Badge color="yellow" leftSection={<Crown size={12} />}>
                      VIP Client
                    </Badge>
                  )}
                  <Badge 
                    color={
                      selectedClient.status === 'active' ? 'green' : 
                      selectedClient.status === 'pending' ? 'yellow' : 
                      selectedClient.status === 'suspended' ? 'red' : 'gray'
                    }
                    variant="light"
                  >
                    {selectedClient.status === 'active' ? 'نشط' : 
                     selectedClient.status === 'pending' ? 'معلق' : 
                     selectedClient.status === 'suspended' ? 'موقوف' : 'غير نشط'}
                  </Badge>
                </Stack>
              </Group>
            </Card>

            {/* Financial Stats */}
            <SimpleGrid cols={{ base: 2, sm: 4 }}>
              <Card padding="md" radius="md" withBorder>
                <Text size="xs" c="dimmed" mb="xs">إجمالي الإنفاق</Text>
                <Text size="lg" fw={700}>
                  {formatCurrency(selectedClient.stats.totalSpent)}
                </Text>
                <Text size="xs" c="dimmed">
                  متوسط المشروع: {formatCurrency(selectedClient.stats.avgProjectValue)}
                </Text>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Text size="xs" c="dimmed" mb="xs">المشاريع</Text>
                <Text size="lg" fw={700}>{selectedClient.stats.totalProjects}</Text>
                <Group gap="xs">
                  <Text size="xs" c="green">{selectedClient.stats.completedProjects} مكتمل</Text>
                  <Text size="xs" c="blue">{selectedClient.stats.activeProjects} نشط</Text>
                </Group>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Text size="xs" c="dimmed" mb="xs">الرضا</Text>
                <Group gap="xs">
                  <Rating value={selectedClient.satisfaction.avgRating} readOnly size="sm" />
                  <Text size="sm" fw={500}>{selectedClient.satisfaction.avgRating}</Text>
                </Group>
                <Text size="xs" c="dimmed">
                  ({selectedClient.satisfaction.totalReviews} تقييم)
                </Text>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Text size="xs" c="dimmed" mb="xs">الحالة المالية</Text>
                <Stack gap="xs">
                  {getPaymentReliabilityDisplay(selectedClient.stats.paymentReliability)}
                  {getCreditStatusDisplay(selectedClient.stats.creditStatus)}
                </Stack>
              </Card>
            </SimpleGrid>

            {/* Payment Terms & Risk Assessment */}
            <Group grow>
              <Card padding="md" radius="md" withBorder>
                <Text size="sm" c="dimmed" mb="xs">شروط الدفع</Text>
                <Badge color="blue" mb="xs">
                  {selectedClient.paymentTerms === 'advance_50' ? 'دفعة مقدمة 50%' :
                   selectedClient.paymentTerms === 'advance_100' ? 'دفع كامل مقدماً' :
                   selectedClient.paymentTerms === 'net_15' ? 'صافي 15 يوم' :
                   'صافي 30 يوم'}
                </Badge>
                {selectedClient.creditLimit && (
                  <Text size="xs" c="dimmed">
                    الحد الائتماني: {formatCurrency(selectedClient.creditLimit)}
                  </Text>
                )}
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Text size="sm" c="dimmed" mb="xs">تقييم المخاطر</Text>
                <Group gap="xs" mb="xs">
                  {getRiskDisplay(selectedClient.flags.risk)}
                  {selectedClient.flags.verified && (
                    <Badge color="green" size="xs">موثق</Badge>
                  )}
                </Group>
                {selectedClient.satisfaction.complaints > 0 && (
                  <Text size="xs" c="red">
                    {selectedClient.satisfaction.complaints} شكوى مسجلة
                  </Text>
                )}
              </Card>
            </Group>

            {/* Preferred Categories */}
            {selectedClient.preferredCategories && (
              <Card padding="md" radius="md" withBorder>
                <Text size="sm" c="dimmed" mb="md">الفئات المفضلة</Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  {selectedClient.preferredCategories.map((category, index) => (
                    <div key={index} className={styles.categoryItem}>
                      <Group justify="apart" mb="xs">
                        <Text size="sm" fw={500}>{category.category}</Text>
                        <Text size="xs" c="dimmed">{category.percentage}%</Text>
                      </Group>
                      <Progress 
                        value={category.percentage} 
                        size="xs" 
                        color="blue"
                        mb="xs"
                      />
                      <Text size="xs" c="dimmed">{category.count} مشروع</Text>
                    </div>
                  ))}
                </SimpleGrid>
              </Card>
            )}
          </Stack>
        )}
      </Modal>

      {/* VIP Management Modal */}
      <Modal
        opened={vipManagementOpened}
        onClose={closeVipManagement}
        title="إدارة VIP"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            إدارة حالة VIP للعميل <strong>{selectedClient?.companyName || selectedClient?.fullName}</strong>
          </Text>
          
          <Card padding="md" withBorder>
            <Text size="sm" mb="xs">الحالة الحالية:</Text>
            {selectedClient?.flags.vip ? (
              <Badge color="yellow" leftSection={<Crown size={12} />}>
                عميل VIP
              </Badge>
            ) : (
              <Badge color="gray">عميل عادي</Badge>
            )}
          </Card>
          
          <Card padding="md" withBorder>
            <Text size="sm" mb="xs">المعايير:</Text>
            <Stack gap="xs">
              <Text size="xs">
                💰 إجمالي الإنفاق: {formatCurrency(selectedClient?.stats.totalSpent || 0)}
              </Text>
              <Text size="xs">
                📊 عدد المشاريع: {selectedClient?.stats.totalProjects || 0}
              </Text>
              <Text size="xs">
                ⭐ التقييم: {selectedClient?.satisfaction.avgRating || 0}/5
              </Text>
              <Text size="xs">
                💳 موثوقية الدفع: {selectedClient?.stats.paymentReliability || 'غير محدد'}
              </Text>
            </Stack>
          </Card>
          
          <Group justify="flex-end" gap="md">
            <Button variant="light" onClick={closeVipManagement}>
              إلغاء
            </Button>
            {selectedClient?.flags.vip ? (
              <Button color="gray" onClick={() => handleVipToggle(false)}>
                إلغاء VIP
              </Button>
            ) : (
              <Button color="yellow" onClick={() => handleVipToggle(true)}>
                ترقية إلى VIP
              </Button>
            )}
          </Group>
        </Stack>
      </Modal>

      {/* Suspend Client Modal */}
      <Modal
        opened={suspendOpened}
        onClose={closeSuspend}
        title="تعليق العميل"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            هل أنت متأكد من تعليق العميل <strong>{selectedClient?.companyName || selectedClient?.fullName}</strong>؟
          </Text>
          
          <Text size="sm" c="red.7">
            سيتم إيقاف جميع المشاريع النشطة وإشعار العميل بالتعليق.
          </Text>
          
          <Group justify="flex-end" gap="md">
            <Button variant="light" onClick={closeSuspend}>
              إلغاء
            </Button>
            <Button 
              onClick={handleSuspendClient} 
              color="red"
            >
              تعليق العميل
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ClientsPage;
