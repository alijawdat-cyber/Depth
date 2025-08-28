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
  RingProgress,
  Tooltip,
  Alert,
  NumberInput,
  Textarea,
  Divider,
  ScrollArea,
  Image,
  Table
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  Search, 
  Filter,
  Users,
  Clock,
  MapPin,
  Star,
  Award,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Briefcase
} from 'lucide-react';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';
import styles from './CreatorAssignmentPage.module.css';

// أنواع البيانات للتعيين
// بيانات الإحصائيات
interface AssignmentStats {
  totalPendingProjects: number;
  totalAvailableCreators: number;
  averageResponseRate: number;
  averageAssignmentTime: number;
  successfulAssignments: number;
  rejectionRate: number;
}

interface CreatorCandidate {
  id: string;
  name: string;
  avatar: string;
  specialization: string[];
  rating: number;
  completedProjects: number;
  location: {
    governorate: string;
    area: string;
  };
  availability: {
    status: 'available' | 'busy' | 'partially_available';
    startDate?: string;
    endDate?: string;
    notes?: string;
  };
  equipment: {
    camera: string;
    lighting: string;
    additional: string[];
    tier: 'silver' | 'gold' | 'platinum';
    tierModifier: number;
  };
  pricing: {
    baseRate: number;
    finalRate: number;
    currency: 'IQD';
    includes: string[];
  };
  portfolio: {
    projectId: string;
    images: string[];
    clientType: string;
    category: string;
  }[];
  matchScore: number;
  responseTime: string;
  reliability: 'excellent' | 'good' | 'average';
  experienceLevel: 'fresh' | 'experienced' | 'expert';
  rushAvailable: boolean;
  travelAvailable: boolean;
  lastActiveAt: string;
}

export default function CreatorAssignmentPage() {
  // حالة الصفحة الأساسية
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // المودال للتعيين
  const [assignmentOpened, { open: openAssignment, close: closeAssignment }] = useDisclosure(false);
  const [portfolioOpened, { open: openPortfolio, close: closePortfolio }] = useDisclosure(false);
  const [messageOpened, { open: openMessage, close: closeMessage }] = useDisclosure(false);
  
  // بيانات تجريبية للمشاريع المعلقة
  const pendingProjects = useMemo(() => [
    {
      id: 'p_001',
      projectNumber: 'DP2025-0156',
      title: 'تصوير منيو مطعم الأصالة',
      client: 'مطعم الأصالة',
      category: 'photo',
      subcategory: 'food_photography',
      processingLevel: 'full_retouch' as const,
      location: {
        governorate: 'بغداد',
        area: 'الكرادة'
      },
      budget: 650000,
      timeline: {
        startDate: '2025-08-30',
        deadline: '2025-09-03',
        duration: 4
      },
      requirements: ['تصوير احترافي', 'خلفية بيضاء', 'إضاءة استوديو'],
      status: 'pending_assignment' as const,
      priority: 'high' as const,
      createdAt: '2025-08-28T10:30:00Z',
      description: 'مطلوب تصوير 25 طبق للمنيو الجديد مع معالجة كاملة'
    },
    {
      id: 'p_002',
      projectNumber: 'DP2025-0157',
      title: 'حملة تسويقية لمجوهرات الماس',
      client: 'معرض الماس للمجوهرات',
      category: 'photo',
      subcategory: 'jewelry_photography',
      processingLevel: 'advanced_composite' as const,
      location: {
        governorate: 'بغداد',
        area: 'المنصور'
      },
      budget: 1200000,
      timeline: {
        startDate: '2025-09-01',
        deadline: '2025-09-08',
        duration: 7
      },
      requirements: ['تصوير مجوهرات', 'إضاءة متخصصة', 'معالجة متقدمة'],
      status: 'pending_assignment' as const,
      priority: 'urgent' as const,
      createdAt: '2025-08-28T14:15:00Z',
      description: 'تصوير مجموعة جديدة من المجوهرات للحملة الإعلانية'
    },
    {
      id: 'p_003',
      projectNumber: 'DP2025-0158',
      title: 'تصوير منتجات أزياء شتوية',
      client: 'بوتيك الأناقة',
      category: 'photo',
      subcategory: 'fashion_photography',
      processingLevel: 'color_correction' as const,
      location: {
        governorate: 'البصرة',
        area: 'العشار'
      },
      budget: 800000,
      timeline: {
        startDate: '2025-09-05',
        deadline: '2025-09-12',
        duration: 7
      },
      requirements: ['تصوير أزياء', 'موديلز', 'خلفيات متنوعة'],
      status: 'pending_assignment' as const,
      priority: 'normal' as const,
      createdAt: '2025-08-28T16:45:00Z',
      description: 'تصوير مجموعة الأزياء الشتوية الجديدة مع موديلز'
    }
  ], []);

  // بيانات تجريبية للمرشحين - مع تصحيح الأنواع
  const creatorCandidates = useMemo(() => [
    {
      id: 'c_001',
      name: 'فاطمة الزهراء',
      avatar: '/avatars/fatima.jpg',
      specialization: ['food_photography', 'product_photography'],
      rating: 4.9,
      completedProjects: 87,
      location: { governorate: 'بغداد', area: 'الكرادة' },
      availability: { status: 'available' as const, startDate: '2025-08-29', notes: 'متاحة فوراً' },
      equipment: { camera: 'Sony A7R IV', lighting: 'Professional Studio Setup', additional: ['Props', 'Backdrop', 'Tripods'], tier: 'platinum' as const, tierModifier: 1.3 },
      pricing: { baseRate: 380000, finalRate: 494000, currency: 'IQD' as const, includes: ['تصوير احترافي', 'معالجة كاملة', 'مراجعتين'] },
      portfolio: [{ projectId: 'p_prev_001', images: ['/portfolio/fatima1.jpg', '/portfolio/fatima2.jpg'], clientType: 'restaurant', category: 'food_photography' }],
      matchScore: 98,
      responseTime: 'خلال ساعتين عادة',
      reliability: 'excellent' as const,
      experienceLevel: 'expert' as const,
      rushAvailable: true,
      travelAvailable: true,
      lastActiveAt: '2025-08-28T09:30:00Z'
    },
    {
      id: 'c_002',
      name: 'علي حسين',
      avatar: '/avatars/ali.jpg',
      specialization: ['jewelry_photography', 'luxury_products'],
      rating: 4.7,
      completedProjects: 124,
      location: { governorate: 'بغداد', area: 'المنصور' },
      availability: { status: 'partially_available' as const, startDate: '2025-08-31', notes: 'متاح بعد انتهاء مشروع حالي' },
      equipment: { camera: 'Canon R5', lighting: 'Specialized Jewelry Lighting', additional: ['Macro Lenses', 'Light Box', 'Reflectors'], tier: 'gold' as const, tierModifier: 1.1 },
      pricing: { baseRate: 420000, finalRate: 462000, currency: 'IQD' as const, includes: ['تصوير متخصص', 'معالجة احترافية', 'تسليم سريع'] },
      portfolio: [{ projectId: 'p_prev_002', images: ['/portfolio/ali1.jpg', '/portfolio/ali2.jpg'], clientType: 'jewelry', category: 'jewelry_photography' }],
      matchScore: 92,
      responseTime: 'خلال 3-4 ساعات عادة',
      reliability: 'excellent' as const,
      experienceLevel: 'expert' as const,
      rushAvailable: false,
      travelAvailable: true,
      lastActiveAt: '2025-08-28T08:15:00Z'
    },
    {
      id: 'c_003',
      name: 'سارة أحمد',
      avatar: '/avatars/sara.jpg',
      specialization: ['fashion_photography', 'portrait_photography'],
      rating: 4.5,
      completedProjects: 65,
      location: { governorate: 'البصرة', area: 'العشار' },
      availability: { status: 'available' as const, startDate: '2025-09-02', notes: 'متاحة مع تخطيط مسبق' },
      equipment: { camera: 'Nikon Z9', lighting: 'Portable Studio Kit', additional: ['Fashion Props', 'Multiple Backdrops'], tier: 'gold' as const, tierModifier: 1.1 },
      pricing: { baseRate: 320000, finalRate: 352000, currency: 'IQD' as const, includes: ['تصوير أزياء', 'معالجة أساسية', 'مراجعة واحدة'] },
      portfolio: [{ projectId: 'p_prev_003', images: ['/portfolio/sara1.jpg', '/portfolio/sara2.jpg'], clientType: 'fashion', category: 'fashion_photography' }],
      matchScore: 85,
      responseTime: 'خلال 4-6 ساعات عادة',
      reliability: 'good' as const,
      experienceLevel: 'experienced' as const,
      rushAvailable: true,
      travelAvailable: false,
      lastActiveAt: '2025-08-28T07:45:00Z'
    },
    {
      id: 'c_004',
      name: 'محمد الربيعي',
      avatar: '/avatars/mohammed.jpg',
      specialization: ['product_photography', 'commercial_photography'],
      rating: 4.6,
      completedProjects: 98,
      location: { governorate: 'بغداد', area: 'الجادرية' },
      availability: { status: 'busy' as const, startDate: '2025-09-10', notes: 'مشغول بمشروع كبير حالياً' },
      equipment: { camera: 'Canon R6 Mark II', lighting: 'Professional Kit', additional: ['Product Tables', 'Seamless Paper'], tier: 'gold' as const, tierModifier: 1.1 },
      pricing: { baseRate: 350000, finalRate: 385000, currency: 'IQD' as const, includes: ['تصوير تجاري', 'معالجة متوسطة', 'مراجعتين'] },
      portfolio: [{ projectId: 'p_prev_004', images: ['/portfolio/mohammed1.jpg', '/portfolio/mohammed2.jpg'], clientType: 'commercial', category: 'product_photography' }],
      matchScore: 78,
      responseTime: 'خلال 6-8 ساعات عادة',
      reliability: 'good' as const,
      experienceLevel: 'experienced' as const,
      rushAvailable: false,
      travelAvailable: true,
      lastActiveAt: '2025-08-27T20:30:00Z'
    }
  ], []);

  // إحصائيات التعيين
  const assignmentStats: AssignmentStats = {
    totalPendingProjects: pendingProjects.length,
    totalAvailableCreators: creatorCandidates.filter(c => c.availability.status === 'available').length,
    averageResponseRate: 87.3,
    averageAssignmentTime: 4.2,
    successfulAssignments: 156,
    rejectionRate: 12.7
  };

  // الحالة المختارة للتعيين
  const [selectedCreator, setSelectedCreator] = useState<CreatorCandidate | null>(null);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [proposedRate, setProposedRate] = useState<number>(0);

  // فلترة المرشحين حسب المشروع المختار
  const filteredCandidates = useMemo(() => {
    if (!selectedProject) return creatorCandidates;
    
    const project = pendingProjects.find(p => p.id === selectedProject);
    if (!project) return creatorCandidates;

    let filtered = creatorCandidates.filter(candidate => {
      // فلترة حسب التخصص
      const hasSpecialization = candidate.specialization.includes(project.subcategory);
      
      // فلترة حسب الموقع (يفضل نفس المحافظة)
      const sameLocation = candidate.location.governorate === project.location.governorate;
      
        // فلترة حسب مستوى المعالجة والمعدات
        const hasAdvancedEquipment = candidate.equipment.tier === 'platinum' || 
          (project.processingLevel === 'color_correction' && candidate.equipment.tier === 'gold');      return hasSpecialization || sameLocation || hasAdvancedEquipment;
    });

    // البحث النصي
    if (searchQuery) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        candidate.location.governorate.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // ترتيب حسب نقاط المطابقة والتقييم
    return filtered.sort((a, b) => {
      if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
      if (a.rating !== b.rating) return b.rating - a.rating;
      return a.availability.status === 'available' ? -1 : 1;
    });
  }, [selectedProject, searchQuery, creatorCandidates, pendingProjects]);

  // دالة للتعيين
  const handleAssignCreator = async () => {
    if (!selectedCreator || !selectedProject) return;

    try {
      // هنا ستكون API call حقيقية
      console.log('تعيين المبدع:', {
        creatorId: selectedCreator.id,
        projectId: selectedProject,
        notes: assignmentNotes,
        proposedRate: proposedRate
      });
      
      // إظهار رسالة نجاح
      alert(`تم تعيين ${selectedCreator.name} للمشروع بنجاح!`);
      closeAssignment();
      setAssignmentNotes('');
      setProposedRate(0);
    } catch (error) {
      console.error('خطأ في التعيين:', error);
      alert('حدث خطأ أثناء التعيين');
    }
  };

  // دالة لإعادة الترشيح
  const handleReNominate = (projectId: string) => {
    // إعادة تحديث قائمة المرشحين
    console.log('إعادة ترشيح للمشروع:', projectId);
    alert('تم إعادة الترشيح - سيتم عرض مرشحين جدد قريباً');
  };

  // أعمدة جدول المرشحين - استبدال بجدول بسيط
  const renderCandidateRow = (candidate: CreatorCandidate) => {
    const statusColors = {
      available: 'green',
      partially_available: 'yellow',
      busy: 'red'
    };
    const statusLabels = {
      available: 'متاح',
      partially_available: 'متاح جزئياً',
      busy: 'مشغول'
    };
    const tierColors = {
      platinum: 'grape',
      gold: 'yellow',
      silver: 'gray'
    };

    return (
      <tr key={candidate.id}>
        <td>
          <div className={styles.creatorInfo}>
            <Avatar src={candidate.avatar} size="md" radius="xl" />
            <div className={styles.creatorDetails}>
              <Text size="sm" fw={600}>{candidate.name}</Text>
              <Text size="xs" c="dimmed">
                {candidate.specialization.slice(0, 2).join(', ')}
              </Text>
              <Group gap={4} mt={2}>
                <Star size={12} className={styles.starIcon} />
                <Text size="xs">{candidate.rating}</Text>
                <Text size="xs" c="dimmed">({candidate.completedProjects} مشروع)</Text>
              </Group>
            </div>
          </div>
        </td>
        <td>
          <div className={styles.matchScore}>
            <RingProgress
              size={50}
              thickness={4}
              sections={[{ 
                value: candidate.matchScore, 
                color: candidate.matchScore >= 90 ? 'green' : candidate.matchScore >= 70 ? 'yellow' : 'red' 
              }]}
              label={
                <Text size="xs" ta="center" fw={600}>
                  {candidate.matchScore}%
                </Text>
              }
            />
          </div>
        </td>
        <td>
          <div>
            <Badge color={statusColors[candidate.availability.status]} variant="light">
              {statusLabels[candidate.availability.status]}
            </Badge>
            {candidate.availability.startDate && (
              <Text size="xs" c="dimmed" mt={2}>
                من {new Date(candidate.availability.startDate).toLocaleDateString('ar')}
              </Text>
            )}
          </div>
        </td>
        <td>
          <div className={styles.locationInfo}>
            <Group gap={4}>
              <MapPin size={14} />
              <div>
                <Text size="sm">{candidate.location.governorate}</Text>
                <Text size="xs" c="dimmed">{candidate.location.area}</Text>
              </div>
            </Group>
          </div>
        </td>
        <td>
          <div className={styles.pricingInfo}>
            <Text size="sm" fw={600}>
              {candidate.pricing.finalRate.toLocaleString()} د.ع
            </Text>
            <Text size="xs" c="dimmed">
              أساسي: {candidate.pricing.baseRate.toLocaleString()}
            </Text>
          </div>
        </td>
        <td>
          <Tooltip label={`كاميرا: ${candidate.equipment.camera}\nإضاءة: ${candidate.equipment.lighting}`}>
            <Badge color={tierColors[candidate.equipment.tier]} variant="light">
              {candidate.equipment.tier}
            </Badge>
          </Tooltip>
        </td>
        <td>
          <Text size="sm">{candidate.responseTime}</Text>
        </td>
        <td>
          <Group gap={8}>
            <Tooltip label="تعيين">
              <ActionIcon
                variant="light"
                color="green"
                onClick={() => {
                  setSelectedCreator(candidate);
                  setProposedRate(candidate.pricing.finalRate);
                  openAssignment();
                }}
                disabled={candidate.availability.status === 'busy'}
              >
                <CheckCircle size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="عرض الأعمال">
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => {
                  setSelectedCreator(candidate);
                  openPortfolio();
                }}
              >
                <Eye size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="مراسلة">
              <ActionIcon
                variant="light"
                color="indigo"
                onClick={() => {
                  setSelectedCreator(candidate);
                  openMessage();
                }}
              >
                <MessageCircle size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </td>
      </tr>
    );
  };

  return (
    <Container size="xl" className={styles.container}>
      {/* العنوان الرئيسي */}
      <div className={styles.pageHeader}>
        <Title order={1} className={styles.pageTitle}>
          تعيين المبدعين
        </Title>
        <Text className={styles.pageDescription}>
          اختر أفضل المبدعين للمشاريع المعلقة باستخدام نظام المطابقة الذكي
        </Text>
      </div>

      {/* بطاقات الإحصائيات */}
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} className={styles.statsGrid}>
        <StatsCard
          title="مشاريع معلقة"
          value={assignmentStats.totalPendingProjects.toString()}
          icon={<Briefcase size={20} />}
          color="primary"
        />
        <StatsCard
          title="مبدعين متاحين"
          value={assignmentStats.totalAvailableCreators.toString()}
          icon={<Users size={20} />}
          color="success"
        />
        <StatsCard
          title="معدل الاستجابة"
          value={`${assignmentStats.averageResponseRate}%`}
          icon={<CheckCircle size={20} />}
          color="info"
        />
        <StatsCard
          title="متوسط زمن التعيين"
          value={`${assignmentStats.averageAssignmentTime}س`}
          icon={<Clock size={20} />}
          color="warning"
        />
        <StatsCard
          title="تعيينات ناجحة"
          value={assignmentStats.successfulAssignments.toString()}
          icon={<Award size={20} />}
          color="success"
        />
        <StatsCard
          title="معدل الرفض"
          value={`${assignmentStats.rejectionRate}%`}
          icon={<AlertCircle size={20} />}
          color="danger"
        />
      </SimpleGrid>

      {/* قسم الفلاتر */}
      <Card className={styles.filtersSection}>
        <Text size="lg" fw={600} mb="md">اختيار المشروع والفلترة</Text>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} className={styles.filtersGrid}>
          <Select
            label="المشروع"
            placeholder="اختر مشروع للتعيين"
            value={selectedProject}
            onChange={(value) => setSelectedProject(value || '')}
            data={pendingProjects.map(p => ({
              value: p.id,
              label: `${p.projectNumber} - ${p.title}`
            }))}
            leftSection={<Briefcase size={16} />}
          />
          
          <TextInput
            label="بحث في المبدعين"
            placeholder="اسم، تخصص، أو موقع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<Search size={16} />}
          />
          
          <Select
            label="مستوى الخبرة"
            placeholder="جميع المستويات"
            data={[
              { value: 'fresh', label: 'مبتدئ' },
              { value: 'experienced', label: 'ذو خبرة' },
              { value: 'expert', label: 'خبير' }
            ]}
            leftSection={<Award size={16} />}
          />
          
          <Select
            label="حالة التوفر"
            placeholder="جميع الحالات"
            data={[
              { value: 'available', label: 'متاح' },
              { value: 'partially_available', label: 'متاح جزئياً' },
              { value: 'busy', label: 'مشغول' }
            ]}
            leftSection={<Clock size={16} />}
          />
        </SimpleGrid>
      </Card>

      {/* معلومات المشروع المختار */}
      {selectedProject && (
        <Card className={styles.projectInfo}>
          {(() => {
            const project = pendingProjects.find(p => p.id === selectedProject);
            if (!project) return null;
            
            return (
              <>
                <Group justify="space-between" mb="md">
                  <div>
                    <Text size="lg" fw={600}>{project.title}</Text>
                    <Text size="sm" c="dimmed">{project.client} • {project.projectNumber}</Text>
                  </div>
                  <Badge color={project.priority === 'urgent' ? 'red' : project.priority === 'high' ? 'orange' : 'blue'}>
                    {project.priority === 'urgent' ? 'عاجل' : project.priority === 'high' ? 'مهم' : 'عادي'}
                  </Badge>
                </Group>
                
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="md">
                  <div>
                    <Text size="xs" c="dimmed">الفئة</Text>
                    <Text size="sm">{project.category} • {project.subcategory}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">الموقع</Text>
                    <Text size="sm">{project.location.governorate} - {project.location.area}</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">الميزانية</Text>
                    <Text size="sm">{project.budget.toLocaleString()} د.ع</Text>
                  </div>
                  <div>
                    <Text size="xs" c="dimmed">المدة</Text>
                    <Text size="sm">{project.timeline.duration} أيام</Text>
                  </div>
                </SimpleGrid>
                
                <Text size="sm" mb="md">{project.description}</Text>
                
                <Group gap={8}>
                  {project.requirements.map((req, index) => (
                    <Badge key={index} variant="light" size="sm">
                      {req}
                    </Badge>
                  ))}
                </Group>
              </>
            );
          })()}
        </Card>
      )}

      {/* جدول المرشحين */}
      <Card className={styles.candidatesSection}>
        <Group justify="space-between" mb="md">
          <div>
            <Text size="lg" fw={600}>المبدعون المرشحون</Text>
            <Text size="sm" c="dimmed">
              عُثر على {filteredCandidates.length} مرشح
              {selectedProject && ` للمشروع المختار`}
            </Text>
          </div>
          
          {selectedProject && (
            <Group gap={8}>
              <Button
                variant="light"
                leftSection={<RefreshCw size={16} />}
                onClick={() => handleReNominate(selectedProject)}
              >
                إعادة ترشيح
              </Button>
              <Button
                variant="light"
                leftSection={<Filter size={16} />}
              >
                فلاتر متقدمة
              </Button>
            </Group>
          )}
        </Group>

        {filteredCandidates.length === 0 ? (
          <Alert color="yellow" icon={<AlertCircle size={16} />}>
            {selectedProject ? 'لا توجد مرشحين مناسبين للمشروع المختار' : 'يرجى اختيار مشروع لعرض المرشحين المناسبين'}
          </Alert>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>المبدع</Table.Th>
                <Table.Th>نسبة المطابقة</Table.Th>
                <Table.Th>التوفر</Table.Th>
                <Table.Th>الموقع</Table.Th>
                <Table.Th>السعر</Table.Th>
                <Table.Th>المعدات</Table.Th>
                <Table.Th>زمن الاستجابة</Table.Th>
                <Table.Th>الإجراءات</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredCandidates.map(candidate => renderCandidateRow(candidate))}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      {/* مودال التعيين */}
      <Modal
        opened={assignmentOpened}
        onClose={closeAssignment}
        title="تعيين مبدع للمشروع"
        size="lg"
      >
        {selectedCreator && (
          <Stack>
            <Group>
              <Avatar src={selectedCreator.avatar} size="lg" radius="xl" />
              <div>
                <Text size="lg" fw={600}>{selectedCreator.name}</Text>
                <Text size="sm" c="dimmed">
                  {selectedCreator.specialization.join(', ')}
                </Text>
                <Group gap={4} mt={4}>
                  <Star size={14} className={styles.starIcon} />
                  <Text size="sm">{selectedCreator.rating}</Text>
                  <Text size="sm" c="dimmed">
                    ({selectedCreator.completedProjects} مشروع مكتمل)
                  </Text>
                </Group>
              </div>
            </Group>

            <Divider />

            <SimpleGrid cols={2}>
              <div>
                <Text size="sm" fw={600}>السعر المقترح</Text>
                <NumberInput
                  value={proposedRate}
                  onChange={(val) => setProposedRate(Number(val) || 0)}
                  thousandSeparator=","
                  suffix=" د.ع"
                  min={0}
                />
              </div>
              <div>
                <Text size="sm" fw={600}>حالة التوفر</Text>
                <Text size="sm" c={selectedCreator.availability.status === 'available' ? 'green' : 'yellow'}>
                  {selectedCreator.availability.status === 'available' ? 'متاح فوراً' : 'متاح جزئياً'}
                </Text>
              </div>
            </SimpleGrid>

            <Textarea
              label="ملاحظات إضافية"
              placeholder="أي تعليمات خاصة للمبدع..."
              value={assignmentNotes}
              onChange={(e) => setAssignmentNotes(e.target.value)}
              minRows={3}
            />

            <Alert color="blue" icon={<CheckCircle size={16} />}>
              سيتم إرسال إشعار للمبدع فور التعيين وإنشاء عقد تلقائياً
            </Alert>

            <Group justify="flex-end">
              <Button variant="outline" onClick={closeAssignment}>
                إلغاء
              </Button>
              <Button onClick={handleAssignCreator} leftSection={<CheckCircle size={16} />}>
                تأكيد التعيين
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* مودال عرض الأعمال */}
      <Modal
        opened={portfolioOpened}
        onClose={closePortfolio}
        title="أعمال المبدع السابقة"
        size="xl"
      >
        {selectedCreator && (
          <Stack>
            <Group>
              <Avatar src={selectedCreator.avatar} size="md" radius="xl" />
              <div>
                <Text size="lg" fw={600}>{selectedCreator.name}</Text>
                <Text size="sm" c="dimmed">معرض الأعمال</Text>
              </div>
            </Group>

            <ScrollArea h={400}>
              <SimpleGrid cols={2} spacing="md">
                {selectedCreator.portfolio.map((item, index) => (
                  <Card key={index} padding="sm" withBorder>
                    <div className={styles.portfolioItem}>
                      {item.images.map((image, imgIndex) => (
                        <Image
                          key={imgIndex}
                          src={image}
                          alt={`عمل ${index + 1}`}
                          radius="sm"
                          h={120}
                          fallbackSrc="/placeholder-image.jpg"
                        />
                      ))}
                    </div>
                    <Text size="sm" mt="xs">
                      نوع العميل: {item.clientType}
                    </Text>
                    <Text size="xs" c="dimmed">
                      الفئة: {item.category}
                    </Text>
                  </Card>
                ))}
              </SimpleGrid>
            </ScrollArea>

            <Group justify="flex-end">
              <Button variant="outline" onClick={closePortfolio}>
                إغلاق
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* مودال المراسلة */}
      <Modal
        opened={messageOpened}
        onClose={closeMessage}
        title="مراسلة المبدع"
        size="md"
      >
        {selectedCreator && (
          <Stack>
            <Group>
              <Avatar src={selectedCreator.avatar} size="md" radius="xl" />
              <div>
                <Text size="lg" fw={600}>{selectedCreator.name}</Text>
                <Text size="sm" c="dimmed">آخر نشاط: منذ ساعتين</Text>
              </div>
            </Group>

            <Textarea
              label="رسالتك"
              placeholder="اكتب رسالة للمبدع..."
              minRows={4}
            />

            <Alert color="blue">
              سيتم إرسال الرسالة عبر النظام والبريد الإلكتروني
            </Alert>

            <Group justify="flex-end">
              <Button variant="outline" onClick={closeMessage}>
                إلغاء
              </Button>
              <Button leftSection={<MessageCircle size={16} />}>
                إرسال الرسالة
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
