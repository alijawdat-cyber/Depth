'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
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
  Avatar,
  Progress,
  Divider,
  SimpleGrid,
  Card,
  Rating,
  Table
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  Search, 
  Filter, 
  Eye, 
  UserCheck, 
  UserX,
  MapPin,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';

// Types
interface Creator extends Record<string, unknown> {
  id: string;
  userId: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  profileImage?: string;
  bio: string;
  location: {
    city: string;
    area: string;
  };
  specialties: string[];
  experienceLevel: 'fresh' | 'experienced' | 'expert';
  yearsOfExperience: number;
  equipmentTier: 'silver' | 'gold' | 'platinum';
  hasOwnEquipment: boolean;
  onboardingStatus: 'pending' | 'active' | 'completed' | 'approved' | 'rejected';
  onboardingStep: number;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  completedProjects: number;
  activeProjects: number;
  responseTimeHours: number;
  totalEarnings: number;
  monthlyEarnings: number;
  subcategories: CreatorSubcategory[];
  equipment: Equipment[];
  portfolioImages: string[];
  createdAt: string;
  lastActive: string;
}

interface CreatorSubcategory {
  id: string;
  subcategoryId: string;
  subcategoryName: string;
  processingLevel: 'raw' | 'basic' | 'color_correction' | 'full_retouch' | 'advanced_composite';
  skillLevel: number; // 0-100
  isPreferred: boolean;
  isActive: boolean;
}

interface Equipment {
  id: string;
  type: 'camera' | 'lens' | 'lighting' | 'microphone' | 'tripod' | 'other';
  brand: string;
  model: string;
  status: 'excellent' | 'good' | 'needs_approval';
  isApproved: boolean;
}

// Mock Data  
const mockCreators: Creator[] = [
  {
    id: 'c_001',
    userId: 'u_001',
    fullName: 'أحمد محمد الربيعي',
    displayName: 'أحمد المصور',
    email: 'ahmed.creator@gmail.com',
    phone: '07719956000',
    profileImage: '/avatars/ahmed.jpg',
    bio: 'مصور محترف متخصص في التصوير الفوتوغرافي للطعام والمنتجات مع خبرة 4 سنوات في السوق العراقي',
    location: {
      city: 'بغداد',
      area: 'الكرادة'
    },
    specialties: ['photo', 'video'],
    experienceLevel: 'experienced',
    yearsOfExperience: 4,
    equipmentTier: 'gold',
    hasOwnEquipment: true,
    onboardingStatus: 'approved',
    onboardingStep: 5,
    isAvailable: true,
    isVerified: true,
    rating: 4.8,
    totalReviews: 47,
    completedProjects: 47,
    activeProjects: 3,
    responseTimeHours: 2,
    totalEarnings: 2850000,
    monthlyEarnings: 680000,
    subcategories: [
      {
        id: 'cs_001',
        subcategoryId: 'sub_food',
        subcategoryName: 'تصوير طعام',
        processingLevel: 'color_correction',
        skillLevel: 90,
        isPreferred: true,
        isActive: true
      },
      {
        id: 'cs_002',
        subcategoryId: 'sub_product',
        subcategoryName: 'تصوير منتجات',
        processingLevel: 'full_retouch',
        skillLevel: 85,
        isPreferred: false,
        isActive: true
      }
    ],
    equipment: [
      {
        id: 'eq_001',
        type: 'camera',
        brand: 'Canon',
        model: 'R6',
        status: 'excellent',
        isApproved: true
      },
      {
        id: 'eq_002',
        type: 'lens',
        brand: 'Canon',
        model: '24-70mm f/2.8',
        status: 'good',
        isApproved: true
      }
    ],
    portfolioImages: ['/portfolio/ahmed_1.jpg', '/portfolio/ahmed_2.jpg'],
    createdAt: '2024-02-15T10:30:00Z',
    lastActive: '2025-08-27T14:30:00Z'
  },
  {
    id: 'c_002',
    userId: 'u_002', 
    fullName: 'فاطمة زهراء الموسوي',
    displayName: 'فاطمة كريتف',
    email: 'fatima.creative@gmail.com',
    phone: '07801234567',
    profileImage: '/avatars/fatima.jpg',
    bio: 'مصممة جرافيك ومونتيرة فيديو متخصصة في المحتوى الرقمي والإعلانات التجارية',
    location: {
      city: 'البصرة',
      area: 'العشار'
    },
    specialties: ['design', 'video'],
    experienceLevel: 'expert',
    yearsOfExperience: 6,
    equipmentTier: 'platinum',
    hasOwnEquipment: true,
    onboardingStatus: 'approved',
    onboardingStep: 5,
    isAvailable: false,
    isVerified: true,
    rating: 4.9,
    totalReviews: 68,
    completedProjects: 68,
    activeProjects: 2,
    responseTimeHours: 1,
    totalEarnings: 4120000,
    monthlyEarnings: 950000,
    subcategories: [
      {
        id: 'cs_003',
        subcategoryId: 'sub_logo',
        subcategoryName: 'تصميم شعارات',
        processingLevel: 'advanced_composite',
        skillLevel: 95,
        isPreferred: true,
        isActive: true
      },
      {
        id: 'cs_004',
        subcategoryId: 'sub_reels',
        subcategoryName: 'ريلز قصيرة',
        processingLevel: 'full_retouch',
        skillLevel: 88,
        isPreferred: true,
        isActive: true
      }
    ],
    equipment: [
      {
        id: 'eq_003',
        type: 'camera',
        brand: 'Sony',
        model: 'A7 IV',
        status: 'excellent',
        isApproved: true
      }
    ],
    portfolioImages: ['/portfolio/fatima_1.jpg', '/portfolio/fatima_2.jpg', '/portfolio/fatima_3.jpg'],
    createdAt: '2023-11-20T09:15:00Z',
    lastActive: '2025-08-26T16:45:00Z'
  },
  {
    id: 'c_003',
    userId: 'u_003',
    fullName: 'علي حسن الجبوري',
    displayName: 'علي فيديو برو',
    email: 'ali.videographer@gmail.com',
    phone: '07712345678',
    bio: 'مصور فيديو مبتدئ متحمس للتعلم والتطوير في مجال صناعة المحتوى المرئي',
    location: {
      city: 'النجف',
      area: 'المركز'
    },
    specialties: ['video'],
    experienceLevel: 'fresh',
    yearsOfExperience: 1,
    equipmentTier: 'silver',
    hasOwnEquipment: false,
    onboardingStatus: 'pending',
    onboardingStep: 3,
    isAvailable: true,
    isVerified: false,
    rating: 0,
    totalReviews: 0,
    completedProjects: 0,
    activeProjects: 0,
    responseTimeHours: 6,
    totalEarnings: 0,
    monthlyEarnings: 0,
    subcategories: [
      {
        id: 'cs_005',
        subcategoryId: 'sub_documentary',
        subcategoryName: 'وثائقي قصير',
        processingLevel: 'basic',
        skillLevel: 70,
        isPreferred: true,
        isActive: true
      }
    ],
    equipment: [],
    portfolioImages: ['/portfolio/ali_1.jpg'],
    createdAt: '2025-08-01T11:20:00Z',
    lastActive: '2025-08-27T10:15:00Z'
  }
];

const CreatorsPage: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<string | null>('');
  const [statusFilter, setStatusFilter] = useState<string | null>('');
  const [equipmentFilter, setEquipmentFilter] = useState<string | null>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>('');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  
  // Modals
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);

  // Stats calculation
  const stats = useMemo(() => {
    const total = mockCreators.length;
    const approved = mockCreators.filter(c => c.onboardingStatus === 'approved').length;
    const pending = mockCreators.filter(c => c.onboardingStatus === 'pending').length;
    const available = mockCreators.filter(c => c.isAvailable).length;
    const expert = mockCreators.filter(c => c.experienceLevel === 'expert').length;

    return [
      { 
        title: 'الإجمالي', 
        value: total.toString(), 
        color: 'info' as const,
        icon: <Award size={20} />,
        description: 'جميع المبدعين'
      },
      { 
        title: 'معتمد', 
        value: approved.toString(), 
        color: 'success' as const,
        icon: <CheckCircle size={20} />,
        description: 'مبدعين معتمدين'
      },
      { 
        title: 'قيد المراجعة', 
        value: pending.toString(), 
        color: 'warning' as const,
        icon: <Clock size={20} />,
        description: 'بانتظار الموافقة'
      },
      { 
        title: 'متاح الآن', 
        value: available.toString(), 
        color: 'primary' as const,
        icon: <UserCheck size={20} />,
        description: 'جاهز للعمل'
      },
      { 
        title: 'خبير', 
        value: expert.toString(), 
        color: 'danger' as const,
        icon: <TrendingUp size={20} />,
        description: 'مستوى خبير'
      }
    ];
  }, []);

  // Filtered data
  const filteredCreators = useMemo(() => {
    return mockCreators.filter(creator => {
      const matchesSearch = !searchQuery || 
        creator.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesExperience = !experienceFilter || creator.experienceLevel === experienceFilter;
      const matchesStatus = !statusFilter || creator.onboardingStatus === statusFilter;
      const matchesEquipment = !equipmentFilter || creator.equipmentTier === equipmentFilter;
      const matchesAvailability = !availabilityFilter || 
        (availabilityFilter === 'available' && creator.isAvailable) ||
        (availabilityFilter === 'busy' && !creator.isAvailable);
      
      return matchesSearch && matchesExperience && matchesStatus && matchesEquipment && matchesAvailability;
    });
  }, [searchQuery, experienceFilter, statusFilter, equipmentFilter, availabilityFilter]);

  // Experience level display helper
  const getExperienceDisplay = (level: string) => {
    const experienceMap = {
      fresh: { label: 'مبتدئ', color: 'gray' },
      experienced: { label: 'متمرس', color: 'blue' },
      expert: { label: 'خبير', color: 'red' }
    };
    const config = experienceMap[level as keyof typeof experienceMap] || experienceMap.fresh;
    return <Badge color={config.color} size="sm">{config.label}</Badge>;
  };

  // Equipment tier display helper
  const getEquipmentTierDisplay = (tier: string) => {
    const tierMap = {
      silver: { label: '🥈 فضي', color: 'gray' },
      gold: { label: '🥇 ذهبي', color: 'yellow' },
      platinum: { label: '🏆 بلاتيني', color: 'violet' }
    };
    const config = tierMap[tier as keyof typeof tierMap] || tierMap.silver;
    return <Badge color={config.color} size="sm">{config.label}</Badge>;
  };

  // Specialties display helper
  const getSpecialtiesDisplay = (specialties: string[]) => {
    const specialtyIcons = {
      photo: '📷',
      video: '🎬', 
      design: '🎨',
      editing: '✂️'
    };
    
    return specialties.map(spec => (
      <Badge key={spec} variant="light" size="xs" className="badge neutral">
        {specialtyIcons[spec as keyof typeof specialtyIcons] || '🔧'} {spec}
      </Badge>
    ));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === 0) return '0 د.ع';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      {/* Header - يستخدم الكلاسات العالمية من globals.css مباشرة */}
      <div className="pageHeader">
        <Title order={1} className="pageTitle">
          إدارة المبدعين
        </Title>
        <Text className="pageDescription">
          مراجعة وإدارة ملفات المبدعين الفريلانسرز ومتابعة أدائهم
        </Text>
      </div>

      {/* Stats Cards */}
      <Grid className="statsGrid">
        {stats.map((stat, index) => (
          <Grid.Col key={index} span={{ base: 12, xs: 6, sm: 4, lg: 2.4 }}>
            <StatsCard {...stat} />
          </Grid.Col>
        ))}
      </Grid>

  {/* Filters */}
  <div className="card section filters">
        <Group gap="md">
          <TextInput
            placeholder="البحث في المبدعين..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<Search size={16} />}
          />
          
          <Select
            placeholder="مستوى الخبرة"
            value={experienceFilter}
            onChange={setExperienceFilter}
            data={[
              { value: '', label: 'جميع المستويات' },
              { value: 'fresh', label: 'مبتدئ' },
              { value: 'experienced', label: 'متمرس' },
              { value: 'expert', label: 'خبير' }
            ]}
          />
          
          <Select
            placeholder="الحالة"
            value={statusFilter}
            onChange={setStatusFilter}
            data={[
              { value: '', label: 'جميع الحالات' },
              { value: 'pending', label: 'قيد المراجعة' },
              { value: 'approved', label: 'معتمد' },
              { value: 'rejected', label: 'مرفوض' }
            ]}
          />
          
          <Select
            placeholder="المعدات"
            value={equipmentFilter}
            onChange={setEquipmentFilter}
            data={[
              { value: '', label: 'جميع المستويات' },
              { value: 'silver', label: 'فضي' },
              { value: 'gold', label: 'ذهبي' },
              { value: 'platinum', label: 'بلاتيني' }
            ]}
          />
          
          <Select
            placeholder="التوفر"
            value={availabilityFilter}
            onChange={setAvailabilityFilter}
            data={[
              { value: '', label: 'الجميع' },
              { value: 'available', label: 'متاح' },
              { value: 'busy', label: 'مشغول' }
            ]}
          />

          <Button leftSection={<Filter size={16} />} variant="light">
            فلاتر متقدمة
          </Button>
        </Group>
      </div>

      {/* Data Table */}
      <div className="card table">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>الملف الشخصي</Table.Th>
              <Table.Th>التقييم</Table.Th>
              <Table.Th>المهارات</Table.Th>
              <Table.Th>المحفظة</Table.Th>
              <Table.Th>الحالة المالية</Table.Th>
              <Table.Th>الحالة</Table.Th>
              <Table.Th>تاريخ التسجيل</Table.Th>
              <Table.Th>الإجراءات</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredCreators.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                  <Text c="dimmed">لا يوجد مبدعين</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredCreators.map((creator) => (
                <Table.Tr 
                  key={creator.id} 
                  onClick={() => {
                    setSelectedCreator(creator);
                    openDetails();
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <Table.Td>
                    <Group gap="md">
                      <Avatar size="md" radius="xl">
                        {creator.fullName.substring(0, 2)}
                      </Avatar>
                      <div>
                        <Text fw={500} size="sm">{creator.displayName}</Text>
                        <Text c="dimmed" size="xs">{creator.phone}</Text>
                        <Text c="dimmed" size="xs">{creator.location.city} - {creator.location.area}</Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap="xs" align="flex-start">
                      <Rating value={creator.rating} readOnly size="xs" />
                      <Text size="xs" c="dimmed">{creator.completedProjects} مشروع</Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {creator.specialties.slice(0, 2).map((specialty, index) => (
                        <Badge key={index} variant="light" size="xs">
                          {specialty}
                        </Badge>
                      ))}
                      {creator.specialties.length > 2 && (
                        <Badge variant="outline" size="xs">
                          +{creator.specialties.length - 2}
                        </Badge>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {creator.portfolioImages?.length || 0} عنصر
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap="xs" align="flex-start">
                      <Text size="sm" fw={500}>
                        {new Intl.NumberFormat('en-US').format(creator.monthlyEarnings)} د.ع
                      </Text>
                      <Text size="xs" c="dimmed">المكاسب الكلية</Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap="xs" align="flex-start">
                      <Badge 
                        color={
                          creator.onboardingStatus === 'approved' ? 'green' :
                          creator.onboardingStatus === 'pending' ? 'yellow' :
                          creator.onboardingStatus === 'rejected' ? 'red' : 'gray'
                        }
                      >
                        {creator.onboardingStatus === 'pending' ? 'قيد المراجعة' :
                         creator.onboardingStatus === 'approved' ? 'مفعّل' :
                         creator.onboardingStatus === 'rejected' ? 'مرفوض' : creator.onboardingStatus}
                      </Badge>
                      {creator.isAvailable ? (
                        <Badge color="green" size="xs">متاح</Badge>
                      ) : (
                        <Badge color="orange" size="xs">مشغول</Badge>
                      )}
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(creator.createdAt).toLocaleDateString('en-US')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon 
                        variant="subtle" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCreator(creator);
                          openDetails();
                        }}
                      >
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="subtle" 
                        color="green"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Approve creator:', creator.id);
                        }}
                      >
                        <UserCheck size={16} />
                      </ActionIcon>
                      <ActionIcon 
                        variant="subtle" 
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Reject creator:', creator.id);
                        }}
                      >
                        <UserX size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* Creator Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={`ملف المبدع: ${selectedCreator?.displayName}`}
        size="xl"
        centered
      >
        {selectedCreator && (
          <Stack gap="lg">
            {/* Profile Header */}
            <Card padding="lg" radius="md" withBorder>
              <Group justify="apart">
                <Group gap="lg">
                  <Avatar
                    src={selectedCreator.profileImage}
                    size={80}
                    radius="md"
                  >
                    {selectedCreator.fullName.charAt(0)}
                  </Avatar>
                  <div>
                    <Title order={3}>{selectedCreator.displayName}</Title>
                    <Text c="dimmed" size="sm" mb="xs">{selectedCreator.fullName}</Text>
                    <Group gap="xs" mb="xs">
                      <Phone size={14} />
                      <Text size="sm">{selectedCreator.phone}</Text>
                      <Mail size={14} />
                      <Text size="sm">{selectedCreator.email}</Text>
                    </Group>
                    <Group gap="xs">
                      <MapPin size={14} />
                      <Text size="sm">{selectedCreator.location.city} - {selectedCreator.location.area}</Text>
                    </Group>
                  </div>
                </Group>
                <Stack gap="xs" align="flex-end">
                  <Badge 
                    color={selectedCreator.onboardingStatus === 'approved' ? 'green' : 'yellow'}
                  >
                    {selectedCreator.onboardingStatus === 'approved' ? 'مفعّل' : 'قيد المراجعة'}
                  </Badge>
                  {selectedCreator.isAvailable ? (
                    <Badge color="green">متاح للعمل</Badge>
                  ) : (
                    <Badge color="orange">مشغول</Badge>
                  )}
                </Stack>
              </Group>
              
              <Divider my="md" />
              
              <Text size="sm" className="pageDescription">
                {selectedCreator.bio}
              </Text>
            </Card>

            {/* Stats Grid */}
            <SimpleGrid cols={{ base: 2, sm: 4 }}>
              <Card padding="md" radius="md" withBorder>
                <Text size="xs" c="dimmed" mb="xs">التقييم</Text>
                <Group gap="xs">
                  <Rating value={selectedCreator.rating} readOnly size="sm" />
                  <Text size="sm" fw={500}>{selectedCreator.rating}</Text>
                </Group>
                <Text size="xs" c="dimmed">({selectedCreator.totalReviews} تقييم)</Text>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Text size="xs" c="dimmed" mb="xs">المشاريع</Text>
                <Text size="lg" fw={700}>{selectedCreator.completedProjects}</Text>
                <Text size="xs" c="dimmed">مكتمل</Text>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Text size="xs" c="dimmed" mb="xs">الأرباح الشهرية</Text>
                <Text size="sm" fw={600}>{formatCurrency(selectedCreator.monthlyEarnings)}</Text>
                <Text size="xs" c="dimmed">الشهر الحالي</Text>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Text size="xs" c="dimmed" mb="xs">سرعة الاستجابة</Text>
                <Text size="lg" fw={700}>{selectedCreator.responseTimeHours}س</Text>
                <Text size="xs" c="dimmed">متوسط الرد</Text>
              </Card>
            </SimpleGrid>

            {/* Experience & Equipment */}
            <Group grow>
              <Card padding="md" radius="md" withBorder>
                <Text size="sm" c="dimmed" mb="xs">الخبرة</Text>
                <Group gap="xs" mb="xs">
                  {getExperienceDisplay(selectedCreator.experienceLevel)}
                  <Text size="sm">{selectedCreator.yearsOfExperience} سنوات</Text>
                </Group>
                <Group gap="xs">
                  {getSpecialtiesDisplay(selectedCreator.specialties)}
                </Group>
              </Card>
              
              <Card padding="md" radius="md" withBorder>
                <Text size="sm" c="dimmed" mb="xs">المعدات</Text>
                <Group gap="xs" mb="xs">
                  {getEquipmentTierDisplay(selectedCreator.equipmentTier)}
                </Group>
                <Text size="xs" c="dimmed">
                  {selectedCreator.hasOwnEquipment ? '✅ يملك معدات شخصية' : '🏢 يستخدم معدات الوكالة'}
                </Text>
              </Card>
            </Group>

            {/* Skills */}
            <Card padding="md" radius="md" withBorder>
              <Text size="sm" c="dimmed" mb="md">المهارات والفئات</Text>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {selectedCreator.subcategories.map((skill) => (
                  <div key={skill.id}>
                    <Group justify="apart" mb="xs">
                      <Text size="sm" fw={500}>{skill.subcategoryName}</Text>
                      <Badge 
                        color={skill.skillLevel >= 90 ? 'green' : skill.skillLevel >= 75 ? 'yellow' : 'red'}
                        size="xs"
                      >
                        {skill.skillLevel}%
                      </Badge>
                    </Group>
                    <Progress 
                      value={skill.skillLevel} 
                      size="xs" 
                      color={skill.skillLevel >= 90 ? 'green' : skill.skillLevel >= 75 ? 'yellow' : 'red'}
                      mb="xs"
                    />
                    <Group gap="xs">
                      <Badge variant="outline" size="xs">{skill.processingLevel}</Badge>
                      {skill.isPreferred && <Badge color="blue" size="xs">مفضل</Badge>}
                    </Group>
                  </div>
                ))}
              </SimpleGrid>
            </Card>

            {/* Portfolio */}
            {selectedCreator.portfolioImages.length > 0 && (
              <Card padding="md" radius="md" withBorder>
                <Group justify="between" mb="md">
                  <Text size="sm" c="dimmed">نماذج الأعمال</Text>
                  <Text 
                    component="a" 
                    href="#" 
                    size="xs"
                  >
                    <Group gap="xs">
                      <ExternalLink size={12} />
                      عرض الكل
                    </Group>
                  </Text>
                </Group>
                <Group gap="md">
                  {selectedCreator.portfolioImages.slice(0, 4).map((image, index) => (
                    <div key={index}>
                      <Image 
                        src={image} 
                        alt={`عمل ${index + 1}`} 
                        width={120}
                        height={90}
                      />
                    </div>
                  ))}
                </Group>
              </Card>
            )}
          </Stack>
        )}
      </Modal>
  </>
  );
};

export default CreatorsPage;
