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
  Stack,
  Table,
  ScrollArea,
  NumberInput,
  Tabs,
  Grid,
  Card as MantineCard,
  Divider,
  Paper,
  Title,
  Alert
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  Search, 
  Edit, 
  Save, 
  Plus,
  Calculator,
  TrendingUp,
  DollarSign,
  Settings,
  Target,
  PieChart,
  BarChart3,
  RefreshCw,
  Download,
  Percent,
  Activity
} from 'lucide-react';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';
import styles from './PricingPage.module.css';

// أنواع البيانات للتسعير
interface CategoryPrice {
  id: string;
  categoryName: string;
  subcategoryName: string;
  basePrice: number;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
  description?: string;
}

interface Modifier {
  id: string;
  name: string;
  key: string;
  value: number;
  type: 'multiplier' | 'addition';
  category: 'processing' | 'experience' | 'equipment' | 'rush' | 'location';
  description?: string;
  isActive: boolean;
}

interface AgencyMargin {
  id: string;
  name: string;
  defaultMargin: number; // 0.10 - 0.50
  minMargin: number;
  maxMargin: number;
  rules: MarginRule[];
  isActive: boolean;
}

interface MarginRule {
  id: string;
  condition: string;
  modifier: number;
  description: string;
}

interface PricingStats {
  totalCategories: number;
  activeCategories: number;
  avgBasePrice: number;
  currentAgencyMargin: number;
  monthlyRevenue: number;
  profitMargin: number;
  pricingAccuracy: number;
  lastPriceUpdate: string;
}

interface PricingCalculation {
  categoryId: string;
  basePrice: number;
  ownershipFactor: number;
  processingMod: number;
  experienceMod: number;
  equipmentMod: number;
  rushMod: number;
  locationAddition: number;
  creatorPrice: number;
  agencyMargin: number;
  clientPrice: number;
}

// بيانات الإحصائيات
const pricingStats: PricingStats = {
  totalCategories: 24,
  activeCategories: 22,
  avgBasePrice: 15750,
  currentAgencyMargin: 32.5,
  monthlyRevenue: 890000,
  profitMargin: 67.8,
  pricingAccuracy: 94.2,
  lastPriceUpdate: '2025-08-25'
};

// بيانات الأسعار الأساسية (mock data)
const mockCategoryPrices: CategoryPrice[] = [
  {
    id: '1',
    categoryName: 'صورة',
    subcategoryName: 'فلات لاي',
    basePrice: 10000,
    isActive: true,
    lastUpdated: '2025-08-20',
    updatedBy: 'أحمد محمد',
    description: 'تصوير منتجات مسطحة بخلفية بيضاء'
  },
  {
    id: '2',
    categoryName: 'صورة',
    subcategoryName: 'قبل/بعد',
    basePrice: 15000,
    isActive: true,
    lastUpdated: '2025-08-18',
    updatedBy: 'أحمد محمد',
    description: 'تصوير قبل وبعد للمنتجات أو الخدمات'
  },
  {
    id: '3',
    categoryName: 'صورة', 
    subcategoryName: 'بورتريه',
    basePrice: 12000,
    isActive: true,
    lastUpdated: '2025-08-15',
    updatedBy: 'أحمد محمد',
    description: 'تصوير بورتريه شخصي أو مهني'
  },
  {
    id: '4',
    categoryName: 'صورة',
    subcategoryName: 'على موديل',
    basePrice: 20000,
    isActive: true,
    lastUpdated: '2025-08-22',
    updatedBy: 'أحمد محمد',
    description: 'تصوير منتجات على موديل حقيقي'
  },
  {
    id: '5',
    categoryName: 'صورة',
    subcategoryName: 'على مانيكان',
    basePrice: 15000,
    isActive: true,
    lastUpdated: '2025-08-19',
    updatedBy: 'أحمد محمد',
    description: 'تصوير ملابس على مانيكان'
  },
  {
    id: '6',
    categoryName: 'صورة',
    subcategoryName: 'صورة طعام',
    basePrice: 10000,
    isActive: true,
    lastUpdated: '2025-08-21',
    updatedBy: 'أحمد محمد',
    description: 'تصوير طعام ومشروبات'
  },
  {
    id: '7',
    categoryName: 'فيديو',
    subcategoryName: 'ريلز قصير',
    basePrice: 25000,
    isActive: true,
    lastUpdated: '2025-08-17',
    updatedBy: 'أحمد محمد',
    description: 'فيديو قصير للسوشال ميديا (15-30 ثانية)'
  },
  {
    id: '8',
    categoryName: 'فيديو',
    subcategoryName: 'فيديو متوسط',
    basePrice: 50000,
    isActive: true,
    lastUpdated: '2025-08-16',
    updatedBy: 'أحمد محمد',
    description: 'فيديو متوسط الطول (1-3 دقائق)'
  },
  {
    id: '9',
    categoryName: 'فيديو',
    subcategoryName: 'فيديو طويل',
    basePrice: 100000,
    isActive: true,
    lastUpdated: '2025-08-14',
    updatedBy: 'أحمد محمد',
    description: 'فيديو طويل (3+ دقائق)'
  },
  {
    id: '10',
    categoryName: 'تصميم',
    subcategoryName: 'لوجو',
    basePrice: 35000,
    isActive: true,
    lastUpdated: '2025-08-23',
    updatedBy: 'أحمد محمد',
    description: 'تصميم شعار تجاري أو شخصي'
  },
  {
    id: '11',
    categoryName: 'تصميم',
    subcategoryName: 'بوستر',
    basePrice: 15000,
    isActive: true,
    lastUpdated: '2025-08-20',
    updatedBy: 'أحمد محمد',
    description: 'تصميم بوستر أو منشور للسوشال ميديا'
  },
  {
    id: '12',
    categoryName: 'تصميم',
    subcategoryName: 'برشور',
    basePrice: 40000,
    isActive: true,
    lastUpdated: '2025-08-18',
    updatedBy: 'أحمد محمد',
    description: 'تصميم برشور تسويقي أو تعريفي'
  }
];

// بيانات المعاملات (mock data)
const mockModifiers: Modifier[] = [
  // معاملات المعالجة
  {
    id: 'proc_1',
    name: 'خام',
    key: 'raw',
    value: 0.9,
    type: 'multiplier',
    category: 'processing',
    description: 'الملفات الخام بدون معالجة',
    isActive: true
  },
  {
    id: 'proc_2', 
    name: 'أساسي',
    key: 'basic',
    value: 1.0,
    type: 'multiplier',
    category: 'processing',
    description: 'تعديلات أساسية',
    isActive: true
  },
  {
    id: 'proc_3',
    name: 'تصحيح ألوان',
    key: 'color_correction',
    value: 1.1,
    type: 'multiplier',
    category: 'processing',
    description: 'تصحيح ألوان متقدم',
    isActive: true
  },
  {
    id: 'proc_4',
    name: 'معالجة كاملة',
    key: 'full_retouch',
    value: 1.3,
    type: 'multiplier',
    category: 'processing', 
    description: 'معالجة كاملة ومتقدمة',
    isActive: true
  },
  {
    id: 'proc_5',
    name: 'تركيب متقدم',
    key: 'advanced_composite',
    value: 1.5,
    type: 'multiplier',
    category: 'processing',
    description: 'دمج وتركيب متقدم',
    isActive: true
  },
  
  // معاملات الخبرة
  {
    id: 'exp_1',
    name: 'مبتدئ',
    key: 'fresh',
    value: 1.0,
    type: 'multiplier',
    category: 'experience',
    description: '0-1 سنة خبرة',
    isActive: true
  },
  {
    id: 'exp_2',
    name: 'متمرس',
    key: 'experienced',
    value: 1.1,
    type: 'multiplier',
    category: 'experience',
    description: '1-3 سنوات خبرة',
    isActive: true
  },
  {
    id: 'exp_3',
    name: 'خبير',
    key: 'expert',
    value: 1.2,
    type: 'multiplier',
    category: 'experience',
    description: '3+ سنوات خبرة',
    isActive: true
  },
  
  // معاملات المعدات
  {
    id: 'eq_1',
    name: 'فضي',
    key: 'silver',
    value: 1.0,
    type: 'multiplier',
    category: 'equipment',
    description: 'معدات أساسية',
    isActive: true
  },
  {
    id: 'eq_2',
    name: 'ذهبي',
    key: 'gold',
    value: 1.1,
    type: 'multiplier',
    category: 'equipment',
    description: 'معدات متوسطة',
    isActive: true
  },
  {
    id: 'eq_3',
    name: 'بلاتيني',
    key: 'platinum',
    value: 1.2,
    type: 'multiplier',
    category: 'equipment',
    description: 'معدات احترافية',
    isActive: true
  },
  
  // معاملات الاستعجال
  {
    id: 'rush_1',
    name: 'عادي',
    key: 'normal',
    value: 1.0,
    type: 'multiplier',
    category: 'rush',
    description: 'توقيت عادي',
    isActive: true
  },
  {
    id: 'rush_2',
    name: 'مستعجل',
    key: 'rush',
    value: 1.2,
    type: 'multiplier',
    category: 'rush',
    description: 'مهلة قصيرة',
    isActive: true
  },
  
  // إضافات الموقع
  {
    id: 'loc_1',
    name: 'استوديو الوكالة',
    key: 'studio',
    value: 0,
    type: 'addition',
    category: 'location',
    description: 'في استوديو الوكالة',
    isActive: true
  },
  {
    id: 'loc_2',
    name: 'موقع العميل (داخل بغداد)',
    key: 'client',
    value: 0,
    type: 'addition',
    category: 'location',
    description: 'في موقع العميل داخل بغداد',
    isActive: true
  },
  {
    id: 'loc_3',
    name: 'أطراف بغداد',
    key: 'outskirts',
    value: 25000,
    type: 'addition',
    category: 'location',
    description: 'أطراف بغداد',
    isActive: true
  },
  {
    id: 'loc_4',
    name: 'محافظات مجاورة',
    key: 'nearby',
    value: 50000,
    type: 'addition',
    category: 'location',
    description: 'محافظات مجاورة لبغداد',
    isActive: true
  },
  {
    id: 'loc_5',
    name: 'محافظات بعيدة',
    key: 'far',
    value: 100000,
    type: 'addition',
    category: 'location',
    description: 'محافظات بعيدة',
    isActive: true
  }
];

// هوامش الوكالة (mock data)
const mockAgencyMargins: AgencyMargin[] = [
  {
    id: 'default',
    name: 'هامش افتراضي',
    defaultMargin: 0.325, // 32.5%
    minMargin: 0.10,
    maxMargin: 0.50,
    rules: [
      {
        id: 'rule_1',
        condition: 'مشروع جديد للعميل',
        modifier: 0.05,
        description: 'زيادة 5% للعملاء الجدد'
      },
      {
        id: 'rule_2',
        condition: 'عميل VIP',
        modifier: 0.08,
        description: 'زيادة 8% للعملاء المميزين'
      },
      {
        id: 'rule_3',
        condition: 'مشروع مستعجل 24 ساعة',
        modifier: 0.10,
        description: 'زيادة 10% للمشاريع المستعجلة'
      }
    ],
    isActive: true
  }
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingPrice, setEditingPrice] = useState<CategoryPrice | null>(null);
  const [editingModifier, setEditingModifier] = useState<Modifier | null>(null);
  const [calculatorData, setCalculatorData] = useState<Partial<PricingCalculation>>({});
  
  const [editPriceOpened, { open: openEditPrice, close: closeEditPrice }] = useDisclosure(false);
  const [editModifierOpened, { open: openEditModifier, close: closeEditModifier }] = useDisclosure(false);
  const [calculatorOpened, { open: openCalculator, close: closeCalculator }] = useDisclosure(false);

  // فلترة أسعار الفئات
  const filteredPrices = useMemo(() => {
    return mockCategoryPrices.filter(price => {
      const matchesSearch = price.subcategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           price.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || price.categoryName === selectedCategory;
      return matchesSearch && matchesCategory && price.isActive;
    });
  }, [searchTerm, selectedCategory]);

  // فلترة المعاملات حسب الفئة
  const getModifiersByCategory = (category: string) => {
    return mockModifiers.filter(mod => mod.category === category && mod.isActive);
  };

  // حساب السعر
  const calculatePrice = (data: Partial<PricingCalculation>): PricingCalculation => {
    const {
      basePrice = 0,
      ownershipFactor = 1.0,
      processingMod = 1.0,
      experienceMod = 1.0,
      equipmentMod = 1.0,
      rushMod = 1.0,
      locationAddition = 0,
      agencyMargin = 0.325
    } = data;

    const creatorPrice = Math.round((basePrice * ownershipFactor * processingMod * experienceMod * equipmentMod * rushMod + locationAddition) / 500) * 500;
    const clientPrice = Math.round(creatorPrice * (1 + agencyMargin) / 500) * 500;

    return {
      categoryId: data.categoryId || '',
      basePrice,
      ownershipFactor,
      processingMod,
      experienceMod,
      equipmentMod,
      rushMod,
      locationAddition,
      creatorPrice,
      agencyMargin,
      clientPrice
    };
  };

  // تحديث سعر فئة
  const handleUpdatePrice = (updatedPrice: CategoryPrice) => {
    // هنا سيتم استدعاء API لتحديث السعر
    console.log('تحديث سعر:', updatedPrice);
    closeEditPrice();
    setEditingPrice(null);
  };

  // تحديث معامل
  const handleUpdateModifier = (updatedModifier: Modifier) => {
    // هنا سيتم استدعاء API لتحديث المعامل
    console.log('تحديث معامل:', updatedModifier);
    closeEditModifier();
    setEditingModifier(null);
  };

  // تنسيق العملة
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={styles.pricingContainer}>
      {/* عنوان الصفحة */}
      <div className={styles.pageHeader}>
        <div>
          <Title className={styles.pageTitle}>التسعير والهوامش</Title>
          <Text className={styles.pageDescription}>
            إدارة شاملة لأسعار الخدمات والمعاملات وهوامش الوكالة
          </Text>
        </div>
        <Group gap="md">
          <Button leftSection={<RefreshCw size={16} />} variant="light">
            تحديث الأسعار
          </Button>
          <Button leftSection={<Download size={16} />} variant="light">
            تصدير
          </Button>
          <Button leftSection={<Calculator size={16} />} onClick={openCalculator}>
            حاسبة التسعير
          </Button>
        </Group>
      </div>

      {/* إحصائيات التسعير */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 6 }} className={styles.statsGrid}>
        <StatsCard
          title="إجمالي الفئات"
          value={pricingStats.totalCategories}
          icon={<Target size={24} />}
          color="primary"
          trend={{
            value: 2,
            direction: 'up',
            label: 'فئات جديدة'
          }}
        />
        
        <StatsCard
          title="متوسط السعر الأساسي"
          value={formatCurrency(pricingStats.avgBasePrice)}
          icon={<DollarSign size={24} />}
          color="success"
          trend={{
            value: 8.5,
            direction: 'up',
            label: 'زيادة هذا الشهر'
          }}
        />
        
        <StatsCard
          title="هامش الوكالة الحالي"
          value={`${pricingStats.currentAgencyMargin}%`}
          icon={<Percent size={24} />}
          color="info"
          trend={{
            value: 2.3,
            direction: 'up',
            label: 'تحسن الهامش'
          }}
        />
        
        <StatsCard
          title="الإيرادات الشهرية"
          value={formatCurrency(pricingStats.monthlyRevenue)}
          icon={<TrendingUp size={24} />}
          color="warning"
          trend={{
            value: 12.4,
            direction: 'up',
            label: 'نمو شهري'
          }}
        />
        
        <StatsCard
          title="هامش الربح"
          value={`${pricingStats.profitMargin}%`}
          icon={<PieChart size={24} />}
          color="success"
          trend={{
            value: 4.2,
            direction: 'up',
            label: 'تحسن مستمر'
          }}
        />
        
        <StatsCard
          title="دقة التسعير"
          value={`${pricingStats.pricingAccuracy}%`}
          icon={<Activity size={24} />}
          color="primary"
          trend={{
            value: 1.8,
            direction: 'up',
            label: 'تحسن الدقة'
          }}
        />
      </SimpleGrid>

      {/* التبويبات الرئيسية */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'overview')} className={styles.mainTabs}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<BarChart3 size={16} />}>
            نظرة عامة
          </Tabs.Tab>
          <Tabs.Tab value="base-prices" leftSection={<DollarSign size={16} />}>
            الأسعار الأساسية
          </Tabs.Tab>
          <Tabs.Tab value="modifiers" leftSection={<Settings size={16} />}>
            المعاملات والضوابط
          </Tabs.Tab>
          <Tabs.Tab value="margins" leftSection={<Percent size={16} />}>
            هوامش الوكالة
          </Tabs.Tab>
        </Tabs.List>

        {/* تبويب النظرة العامة */}
        <Tabs.Panel value="overview">
          <div className={styles.overviewContent}>
            <Grid>
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <MantineCard>
                  <Title order={3} mb="md">التوزيع السعري للفئات</Title>
                  <div className={styles.pricingChart}>
                    {/* هنا سيتم إضافة مخطط بياني */}
                    <Alert icon={<BarChart3 size={16} />} title="مخطط التوزيع السعري">
                      سيتم إضافة مخطط بياني يوضح توزيع الأسعار عبر الفئات المختلفة
                    </Alert>
                  </div>
                </MantineCard>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Stack gap="md">
                  <MantineCard>
                    <Title order={4} mb="md">التحديثات الأخيرة</Title>
                    <Stack gap="xs">
                      <Text size="sm">
                        <strong>فلات لاي:</strong> تحديث إلى {formatCurrency(10000)}
                      </Text>
                      <Text size="sm">
                        <strong>لوجو:</strong> تحديث إلى {formatCurrency(35000)}
                      </Text>
                      <Text size="sm">
                        <strong>على موديل:</strong> تحديث إلى {formatCurrency(20000)}
                      </Text>
                    </Stack>
                  </MantineCard>
                  
                  <MantineCard>
                    <Title order={4} mb="md">معاملات نشطة</Title>
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text size="sm">معاملات المعالجة</Text>
                        <Badge size="sm">5 معاملات</Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">معاملات الخبرة</Text>
                        <Badge size="sm">3 معاملات</Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">معاملات المعدات</Text>
                        <Badge size="sm">3 معاملات</Badge>
                      </Group>
                    </Stack>
                  </MantineCard>
                </Stack>
              </Grid.Col>
            </Grid>
          </div>
        </Tabs.Panel>

        {/* تبويب الأسعار الأساسية */}
        <Tabs.Panel value="base-prices">
          <div className={styles.basePricesContent}>
            {/* فلاتر البحث والتصفية */}
            <Paper className={styles.filtersSection}>
              <Group justify="space-between" mb="md">
                <Title order={3} className={styles.filtersTitle}>
                  <DollarSign size={20} />
                  الأسعار الأساسية
                </Title>
                <Button leftSection={<Plus size={16} />} size="sm">
                  إضافة سعر جديد
                </Button>
              </Group>
              
              <Group gap="md" className={styles.filtersGrid}>
                <TextInput
                  placeholder="البحث في الأسعار..."
                  leftSection={<Search size={16} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.currentTarget.value)}
                  className={styles.searchInput}
                />
                <Select
                  placeholder="الفئة"
                  data={[
                    { value: 'all', label: 'جميع الفئات' },
                    { value: 'صورة', label: 'صورة' },
                    { value: 'فيديو', label: 'فيديو' },
                    { value: 'تصميم', label: 'تصميم' },
                    { value: 'مونتاج', label: 'مونتاج' }
                  ]}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value || 'all')}
                />
              </Group>
            </Paper>

            {/* جدول الأسعار الأساسية */}
            <Paper className={styles.basePricesTable}>
              <ScrollArea>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الفئة الرئيسية</Table.Th>
                      <Table.Th>الفئة الفرعية</Table.Th>
                      <Table.Th>السعر الأساسي</Table.Th>
                      <Table.Th>الوصف</Table.Th>
                      <Table.Th>آخر تحديث</Table.Th>
                      <Table.Th>محدث بواسطة</Table.Th>
                      <Table.Th>الحالة</Table.Th>
                      <Table.Th>الإجراءات</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredPrices.map((price) => (
                      <Table.Tr key={price.id}>
                        <Table.Td>{price.categoryName}</Table.Td>
                        <Table.Td>
                          <Text fw={600}>{price.subcategoryName}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={700} c="blue">
                            {formatCurrency(price.basePrice)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed" lineClamp={1}>
                            {price.description}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{price.lastUpdated}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{price.updatedBy}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={price.isActive ? 'green' : 'gray'}
                            variant="light"
                            size="sm"
                          >
                            {price.isActive ? 'نشط' : 'معطل'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs" justify="center">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              size="sm"
                              onClick={() => {
                                setEditingPrice(price);
                                openEditPrice();
                              }}
                            >
                              <Edit size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="light"
                              color="green"
                              size="sm"
                              onClick={() => {
                                const calculation = calculatePrice({
                                  categoryId: price.id,
                                  basePrice: price.basePrice
                                });
                                setCalculatorData(calculation);
                                openCalculator();
                              }}
                            >
                              <Calculator size={16} />
                            </ActionIcon>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>

                {filteredPrices.length === 0 && (
                  <div className={styles.emptyState}>
                    <DollarSign size={48} />
                    <Title order={3}>لا توجد أسعار</Title>
                    <Text c="dimmed">
                      لم يتم العثور على أسعار تطابق المعايير المحددة
                    </Text>
                    <Button leftSection={<Plus size={16} />}>
                      إضافة سعر جديد
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </Paper>
          </div>
        </Tabs.Panel>

        {/* تبويب المعاملات والضوابط */}
        <Tabs.Panel value="modifiers">
          <div className={styles.modifiersContent}>
            <Title order={3} mb="lg">المعاملات والضوابط</Title>
            
            <Stack gap="lg">
              {/* معاملات المعالجة */}
              <MantineCard>
                <Group justify="space-between" mb="md">
                  <Title order={4}>معاملات المعالجة</Title>
                  <Button size="sm" variant="light" leftSection={<Plus size={16} />}>
                    إضافة معامل
                  </Button>
                </Group>
                
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الاسم</Table.Th>
                      <Table.Th>المفتاح</Table.Th>
                      <Table.Th>القيمة</Table.Th>
                      <Table.Th>الوصف</Table.Th>
                      <Table.Th>الإجراءات</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {getModifiersByCategory('processing').map((modifier) => (
                      <Table.Tr key={modifier.id}>
                        <Table.Td>{modifier.name}</Table.Td>
                        <Table.Td>
                          <Badge variant="outline" size="sm">{modifier.key}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} c={modifier.value > 1 ? 'green' : modifier.value < 1 ? 'red' : 'blue'}>
                            {modifier.type === 'multiplier' ? `×${modifier.value}` : `+${formatCurrency(modifier.value)}`}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">{modifier.description}</Text>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => {
                              setEditingModifier(modifier);
                              openEditModifier();
                            }}
                          >
                            <Edit size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </MantineCard>

              {/* معاملات الخبرة */}
              <MantineCard>
                <Group justify="space-between" mb="md">
                  <Title order={4}>معاملات الخبرة</Title>
                  <Button size="sm" variant="light" leftSection={<Plus size={16} />}>
                    إضافة معامل
                  </Button>
                </Group>
                
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الاسم</Table.Th>
                      <Table.Th>المفتاح</Table.Th>
                      <Table.Th>القيمة</Table.Th>
                      <Table.Th>الوصف</Table.Th>
                      <Table.Th>الإجراءات</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {getModifiersByCategory('experience').map((modifier) => (
                      <Table.Tr key={modifier.id}>
                        <Table.Td>{modifier.name}</Table.Td>
                        <Table.Td>
                          <Badge variant="outline" size="sm">{modifier.key}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} c={modifier.value > 1 ? 'green' : 'blue'}>
                            ×{modifier.value}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">{modifier.description}</Text>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => {
                              setEditingModifier(modifier);
                              openEditModifier();
                            }}
                          >
                            <Edit size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </MantineCard>

              {/* معاملات المعدات */}
              <MantineCard>
                <Group justify="space-between" mb="md">
                  <Title order={4}>معاملات المعدات</Title>
                  <Button size="sm" variant="light" leftSection={<Plus size={16} />}>
                    إضافة معامل
                  </Button>
                </Group>
                
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الاسم</Table.Th>
                      <Table.Th>المفتاح</Table.Th>
                      <Table.Th>القيمة</Table.Th>
                      <Table.Th>الوصف</Table.Th>
                      <Table.Th>الإجراءات</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {getModifiersByCategory('equipment').map((modifier) => (
                      <Table.Tr key={modifier.id}>
                        <Table.Td>{modifier.name}</Table.Td>
                        <Table.Td>
                          <Badge variant="outline" size="sm">{modifier.key}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} c={modifier.value > 1 ? 'green' : 'blue'}>
                            ×{modifier.value}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">{modifier.description}</Text>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => {
                              setEditingModifier(modifier);
                              openEditModifier();
                            }}
                          >
                            <Edit size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </MantineCard>

              {/* معاملات الاستعجال */}
              <MantineCard>
                <Group justify="space-between" mb="md">
                  <Title order={4}>معاملات الاستعجال</Title>
                  <Button size="sm" variant="light" leftSection={<Plus size={16} />}>
                    إضافة معامل
                  </Button>
                </Group>
                
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الاسم</Table.Th>
                      <Table.Th>المفتاح</Table.Th>
                      <Table.Th>القيمة</Table.Th>
                      <Table.Th>الوصف</Table.Th>
                      <Table.Th>الإجراءات</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {getModifiersByCategory('rush').map((modifier) => (
                      <Table.Tr key={modifier.id}>
                        <Table.Td>{modifier.name}</Table.Td>
                        <Table.Td>
                          <Badge variant="outline" size="sm">{modifier.key}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} c={modifier.value > 1 ? 'orange' : 'blue'}>
                            ×{modifier.value}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">{modifier.description}</Text>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => {
                              setEditingModifier(modifier);
                              openEditModifier();
                            }}
                          >
                            <Edit size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </MantineCard>

              {/* إضافات الموقع */}
              <MantineCard>
                <Group justify="space-between" mb="md">
                  <Title order={4}>إضافات الموقع</Title>
                  <Button size="sm" variant="light" leftSection={<Plus size={16} />}>
                    إضافة موقع
                  </Button>
                </Group>
                
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الاسم</Table.Th>
                      <Table.Th>المفتاح</Table.Th>
                      <Table.Th>القيمة</Table.Th>
                      <Table.Th>الوصف</Table.Th>
                      <Table.Th>الإجراءات</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {getModifiersByCategory('location').map((modifier) => (
                      <Table.Tr key={modifier.id}>
                        <Table.Td>{modifier.name}</Table.Td>
                        <Table.Td>
                          <Badge variant="outline" size="sm">{modifier.key}</Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text fw={600} c={modifier.value > 0 ? 'orange' : 'green'}>
                            {modifier.value > 0 ? `+${formatCurrency(modifier.value)}` : 'مجاناً'}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">{modifier.description}</Text>
                        </Table.Td>
                        <Table.Td>
                          <ActionIcon
                            variant="light"
                            size="sm"
                            onClick={() => {
                              setEditingModifier(modifier);
                              openEditModifier();
                            }}
                          >
                            <Edit size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </MantineCard>
            </Stack>
          </div>
        </Tabs.Panel>

        {/* تبويب هوامش الوكالة */}
        <Tabs.Panel value="margins">
          <div className={styles.marginsContent}>
            <Group justify="space-between" mb="lg">
              <Title order={3}>هوامش الوكالة</Title>
              <Button leftSection={<Plus size={16} />}>
                إضافة هامش جديد
              </Button>
            </Group>
            
            {mockAgencyMargins.map((margin) => (
              <MantineCard key={margin.id} mb="lg">
                <Group justify="space-between" mb="md">
                  <Title order={4}>{margin.name}</Title>
                  <Group>
                    <Badge color="blue" size="lg">
                      {(margin.defaultMargin * 100).toFixed(1)}%
                    </Badge>
                    <ActionIcon variant="light">
                      <Edit size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
                
                <Group mb="md">
                  <Stack gap="xs">
                    <Text size="sm">
                      <strong>الهامش الافتراضي:</strong> {(margin.defaultMargin * 100).toFixed(1)}%
                    </Text>
                    <Text size="sm">
                      <strong>النطاق:</strong> {(margin.minMargin * 100).toFixed(0)}% - {(margin.maxMargin * 100).toFixed(0)}%
                    </Text>
                  </Stack>
                </Group>
                
                <Divider my="md" />
                
                <Title order={5} mb="md">قواعد التعديل</Title>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الشرط</Table.Th>
                      <Table.Th>التعديل</Table.Th>
                      <Table.Th>الوصف</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {margin.rules.map((rule) => (
                      <Table.Tr key={rule.id}>
                        <Table.Td>{rule.condition}</Table.Td>
                        <Table.Td>
                          <Text fw={600} c="blue">
                            +{(rule.modifier * 100).toFixed(1)}%
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">{rule.description}</Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </MantineCard>
            ))}
          </div>
        </Tabs.Panel>
      </Tabs>

      {/* مودال تعديل السعر */}
      <Modal
        opened={editPriceOpened}
        onClose={closeEditPrice}
        title="تعديل سعر الفئة"
        size="md"
        className={styles.editPriceModal}
      >
        {editingPrice && (
          <Stack gap="md">
            <Group justify="apart">
              <Text fw={600}>{editingPrice.categoryName} - {editingPrice.subcategoryName}</Text>
              <Badge color="blue">{editingPrice.id}</Badge>
            </Group>
            
            <NumberInput
              label="السعر الأساسي (IQD)"
              value={editingPrice.basePrice}
              onChange={(value) => setEditingPrice({
                ...editingPrice,
                basePrice: Number(value) || 0
              })}
              min={0}
              step={500}
              thousandSeparator=","
            />
            
            <TextInput
              label="الوصف"
              value={editingPrice.description || ''}
              onChange={(e) => setEditingPrice({
                ...editingPrice,
                description: e.currentTarget.value
              })}
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeEditPrice}>
                إلغاء
              </Button>
              <Button leftSection={<Save size={16} />} onClick={() => handleUpdatePrice(editingPrice)}>
                حفظ التغييرات
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* مودال تعديل المعامل */}
      <Modal
        opened={editModifierOpened}
        onClose={closeEditModifier}
        title="تعديل المعامل"
        size="md"
        className={styles.editModifierModal}
      >
        {editingModifier && (
          <Stack gap="md">
            <Group justify="apart">
              <Text fw={600}>{editingModifier.name}</Text>
              <Badge variant="outline">{editingModifier.key}</Badge>
            </Group>
            
            <NumberInput
              label={editingModifier.type === 'multiplier' ? 'القيمة (معامل)' : 'القيمة (IQD)'}
              value={editingModifier.value}
              onChange={(value) => setEditingModifier({
                ...editingModifier,
                value: Number(value) || 0
              })}
              min={0}
              step={editingModifier.type === 'multiplier' ? 0.1 : 1000}
              decimalScale={editingModifier.type === 'multiplier' ? 2 : 0}
            />
            
            <TextInput
              label="الوصف"
              value={editingModifier.description || ''}
              onChange={(e) => setEditingModifier({
                ...editingModifier,
                description: e.currentTarget.value
              })}
            />
            
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeEditModifier}>
                إلغاء
              </Button>
              <Button leftSection={<Save size={16} />} onClick={() => handleUpdateModifier(editingModifier)}>
                حفظ التغييرات
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* مودال حاسبة التسعير */}
      <Modal
        opened={calculatorOpened}
        onClose={closeCalculator}
        title="حاسبة التسعير"
        size="lg"
        className={styles.calculatorModal}
      >
        <div className={styles.calculatorContent}>
          <Alert icon={<Calculator size={16} />} color="blue" mb="md">
            استخدم الحاسبة لمحاكاة أسعار المشاريع بناءً على المعاملات المختلفة
          </Alert>
          
          <Grid>
            <Grid.Col span={6}>
              <Stack gap="md">
                <Select
                  label="الفئة الفرعية"
                  placeholder="اختر الفئة"
                  data={mockCategoryPrices.map(p => ({
                    value: p.id,
                    label: `${p.categoryName} - ${p.subcategoryName}`
                  }))}
                  value={calculatorData.categoryId}
                  onChange={(value) => {
                    const price = mockCategoryPrices.find(p => p.id === value);
                    if (price) {
                      setCalculatorData(prev => ({
                        ...prev,
                        categoryId: value || '',
                        basePrice: price.basePrice
                      }));
                    }
                  }}
                />
                
                <NumberInput
                  label="السعر الأساسي"
                  value={calculatorData.basePrice || 0}
                  readOnly
                  thousandSeparator=","
                />
                
                <Select
                  label="ملكية المعدات"
                  data={[
                    { value: '1.0', label: 'بمعدات خاصة' },
                    { value: '0.9', label: 'بدون معدات (معدات الوكالة)' }
                  ]}
                  value={String(calculatorData.ownershipFactor || 1.0)}
                  onChange={(value) => setCalculatorData(prev => ({
                    ...prev,
                    ownershipFactor: Number(value) || 1.0
                  }))}
                />
                
                <Select
                  label="مستوى المعالجة"
                  data={getModifiersByCategory('processing').map(m => ({
                    value: String(m.value),
                    label: m.name
                  }))}
                  value={String(calculatorData.processingMod || 1.0)}
                  onChange={(value) => setCalculatorData(prev => ({
                    ...prev,
                    processingMod: Number(value) || 1.0
                  }))}
                />
                
                <Select
                  label="مستوى الخبرة"
                  data={getModifiersByCategory('experience').map(m => ({
                    value: String(m.value),
                    label: m.name
                  }))}
                  value={String(calculatorData.experienceMod || 1.0)}
                  onChange={(value) => setCalculatorData(prev => ({
                    ...prev,
                    experienceMod: Number(value) || 1.0
                  }))}
                />
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={6}>
              <Stack gap="md">
                <Select
                  label="مستوى المعدات"
                  data={getModifiersByCategory('equipment').map(m => ({
                    value: String(m.value),
                    label: m.name
                  }))}
                  value={String(calculatorData.equipmentMod || 1.0)}
                  onChange={(value) => setCalculatorData(prev => ({
                    ...prev,
                    equipmentMod: Number(value) || 1.0
                  }))}
                />
                
                <Select
                  label="نوع التوقيت"
                  data={getModifiersByCategory('rush').map(m => ({
                    value: String(m.value),
                    label: m.name
                  }))}
                  value={String(calculatorData.rushMod || 1.0)}
                  onChange={(value) => setCalculatorData(prev => ({
                    ...prev,
                    rushMod: Number(value) || 1.0
                  }))}
                />
                
                <Select
                  label="الموقع"
                  data={getModifiersByCategory('location').map(m => ({
                    value: `${m.id}_${m.value}`,
                    label: `${m.name} (${m.value > 0 ? `+${formatCurrency(m.value)}` : 'مجاناً'})`
                  }))}
                  value={`location_${calculatorData.locationAddition || 0}`}
                  onChange={(value) => {
                    const selectedValue = value ? Number(value.split('_')[1]) : 0;
                    setCalculatorData(prev => ({
                      ...prev,
                      locationAddition: selectedValue
                    }));
                  }}
                />
                
                <NumberInput
                  label="هامش الوكالة (%)"
                  value={(calculatorData.agencyMargin || 0.325) * 100}
                  onChange={(value) => setCalculatorData(prev => ({
                    ...prev,
                    agencyMargin: (Number(value) || 32.5) / 100
                  }))}
                  min={10}
                  max={50}
                  step={0.5}
                  suffix="%"
                />
                
                <Divider />
                
                {calculatorData.basePrice && (
                  <MantineCard className={styles.calculationResults}>
                    <Title order={5} mb="md">النتائج:</Title>
                    {(() => {
                      const result = calculatePrice(calculatorData);
                      return (
                        <Stack gap="xs">
                          <Group justify="space-between">
                            <Text>سعر المبدع:</Text>
                            <Text fw={600} c="blue">
                              {formatCurrency(result.creatorPrice)}
                            </Text>
                          </Group>
                          <Group justify="space-between">
                            <Text>سعر العميل:</Text>
                            <Text fw={700} c="green" size="lg">
                              {formatCurrency(result.clientPrice)}
                            </Text>
                          </Group>
                          <Group justify="space-between">
                            <Text size="sm" c="dimmed">هامش الوكالة:</Text>
                            <Text size="sm" c="dimmed">
                              {formatCurrency(result.clientPrice - result.creatorPrice)}
                            </Text>
                          </Group>
                        </Stack>
                      );
                    })()}
                  </MantineCard>
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </div>
      </Modal>
    </div>
  );
}
