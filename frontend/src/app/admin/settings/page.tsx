'use client';

import React, { useState, useMemo } from 'react';
import {
  Title,
  Tabs,
  Grid,
  Group,
  Button,
  NumberInput,
  TextInput,
  Select,
  Switch,
  Slider,
  Text,
  Badge,
  ActionIcon,
  Modal,
  Stack,
  Alert,
  Table,
  Textarea,
  Progress,
  Tooltip
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  Settings,
  DollarSign,
  Calculator,
  Activity,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Edit,
  Database,
  Shield,
  Download,
  Upload,
  Power,
  Monitor,
  TrendingUp,
  BarChart3,
  Percent
} from 'lucide-react';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';
import styles from './SettingsPage.module.css';

// Types للإعدادات
interface SystemSettings {
  id: string;
  general: {
    systemName: string;
    version: string;
    environment: string;
    timezone: string;
    language: string;
    currency: string;
    maintenanceMode: boolean;
  };
  business: {
    agencyMarginPercent: number;
    minimumProject: number;
    maximumProject: number;
    paymentTerms: string;
    autoApprovalLimit: number;
    urgentFeeMultiplier: number;
    weekendFeeMultiplier: number;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
    auditLogging: boolean;
  };
  features: {
    multiLanguage: boolean;
    realTimeNotifications: boolean;
    videoProjects: boolean;
    mobileApp: boolean;
    apiAccess: boolean;
  };
  limits: {
    fileUploadMaxSize: string;
    storagePerUser: string;
    apiRateLimit: string;
  };
}

interface PricingModifier {
  id: string;
  category: 'processing' | 'experience' | 'equipment' | 'rush' | 'location';
  name: string;
  key: string;
  value: number;
  type: 'multiplier' | 'addition';
  description: string;
  isActive: boolean;
  lastUpdated: string;
}

interface SystemHealth {
  overall: {
    status: 'healthy' | 'warning' | 'error';
    score: number;
    lastCheck: string;
    uptime: string;
  };
  services: {
    api: { status: string; responseTime: string; errorRate: string };
    database: { status: string; connections: number; queryTime: string };
    firebase: { status: string; authenticatedUsers: number };
    storage: { status: string; usedSpace: string; usagePercentage: string };
  };
}

// بيانات وهمية للإعدادات
const mockSettings: SystemSettings = {
  id: 'sys_001',
  general: {
    systemName: 'Depth Creative Agency Platform',
    version: '2.0.1',
    environment: 'production',
    timezone: 'Asia/Baghdad',
    language: 'ar',
    currency: 'IQD',
    maintenanceMode: false
  },
  business: {
    agencyMarginPercent: 20,
    minimumProject: 100000,
    maximumProject: 50000000,
    paymentTerms: 'net_15',
    autoApprovalLimit: 2000000,
    urgentFeeMultiplier: 1.2,
    weekendFeeMultiplier: 1.1
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 3600,
    passwordMinLength: 8,
    requireSpecialChars: true,
    auditLogging: true
  },
  features: {
    multiLanguage: true,
    realTimeNotifications: true,
    videoProjects: true,
    mobileApp: false,
    apiAccess: true
  },
  limits: {
    fileUploadMaxSize: '50MB',
    storagePerUser: '5GB',
    apiRateLimit: '1000/hour'
  }
};

// بيانات المعاملات
const mockModifiers: PricingModifier[] = [
  { id: 'mod_001', category: 'processing', name: 'خام', key: 'raw', value: 0.9, type: 'multiplier', description: 'بدون معالجة', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_002', category: 'processing', name: 'أساسي', key: 'basic', value: 1.0, type: 'multiplier', description: 'تعديلات أساسية', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_003', category: 'processing', name: 'تصحيح ألوان', key: 'color_correction', value: 1.1, type: 'multiplier', description: 'تصحيح لوني متقدم', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_004', category: 'processing', name: 'معالجة كاملة', key: 'full_retouch', value: 1.3, type: 'multiplier', description: 'معالجة شاملة', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_005', category: 'processing', name: 'تركيب متقدم', key: 'advanced_composite', value: 1.5, type: 'multiplier', description: 'دمج وتركيب', isActive: true, lastUpdated: '2025-08-20' },
  
  { id: 'mod_006', category: 'experience', name: 'مبتدئ', key: 'fresh', value: 1.0, type: 'multiplier', description: '0-1 سنة', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_007', category: 'experience', name: 'متمرس', key: 'experienced', value: 1.1, type: 'multiplier', description: '1-3 سنوات', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_008', category: 'experience', name: 'خبير', key: 'expert', value: 1.2, type: 'multiplier', description: '3+ سنوات', isActive: true, lastUpdated: '2025-08-20' },
  
  { id: 'mod_009', category: 'equipment', name: 'فضي', key: 'silver', value: 1.0, type: 'multiplier', description: 'معدات أساسية', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_010', category: 'equipment', name: 'ذهبي', key: 'gold', value: 1.1, type: 'multiplier', description: 'معدات متوسطة', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_011', category: 'equipment', name: 'بلاتيني', key: 'platinum', value: 1.2, type: 'multiplier', description: 'معدات احترافية', isActive: true, lastUpdated: '2025-08-20' },
  
  { id: 'mod_012', category: 'rush', name: 'عادي', key: 'normal', value: 1.0, type: 'multiplier', description: 'جدول عادي', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_013', category: 'rush', name: 'مستعجل', key: 'rush', value: 1.2, type: 'multiplier', description: 'تسليم سريع', isActive: true, lastUpdated: '2025-08-20' },
  
  { id: 'mod_014', category: 'location', name: 'استوديو', key: 'studio', value: 0, type: 'addition', description: 'داخل الاستوديو', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_015', category: 'location', name: 'موقع العميل', key: 'client', value: 0, type: 'addition', description: 'مركز المدينة', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_016', category: 'location', name: 'أطراف المدينة', key: 'outskirts', value: 25000, type: 'addition', description: 'خارج المركز', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_017', category: 'location', name: 'قريب', key: 'nearby', value: 50000, type: 'addition', description: 'مناطق مجاورة', isActive: true, lastUpdated: '2025-08-20' },
  { id: 'mod_018', category: 'location', name: 'بعيد', key: 'far', value: 100000, type: 'addition', description: 'محافظات أخرى', isActive: true, lastUpdated: '2025-08-20' }
];

// بيانات صحة النظام
const mockSystemHealth: SystemHealth = {
  overall: {
    status: 'healthy',
    score: 95,
    lastCheck: '2025-08-28T16:50:00Z',
    uptime: '99.8%'
  },
  services: {
    api: { status: 'healthy', responseTime: '120ms', errorRate: '0.1%' },
    database: { status: 'healthy', connections: 45, queryTime: '50ms' },
    firebase: { status: 'healthy', authenticatedUsers: 187 },
    storage: { status: 'warning', usedSpace: '87.5GB', usagePercentage: '87.5%' }
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(mockSettings);
  const [modifiers, setModifiers] = useState<PricingModifier[]>(mockModifiers);
  const [systemHealth] = useState<SystemHealth>(mockSystemHealth);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('business');
  const [editingModifier, setEditingModifier] = useState<string | null>(null);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  
  const [maintenanceOpened, { open: openMaintenance, close: closeMaintenance }] = useDisclosure(false);

  // إحصائيات سريعة
  const settingsStats = useMemo(() => [
    {
      title: 'هامش الوكالة الحالي',
      value: `${settings.business.agencyMarginPercent}%`,
      icon: <Percent size={24} />,
      trend: { value: 0, direction: 'neutral' as const, label: 'ثابت' },
      color: 'primary' as const,
    },
    {
      title: 'المشاريع المتأثرة',
      value: '0',
      icon: <BarChart3 size={24} />,
      trend: { value: 0, direction: 'neutral' as const, label: 'لا توجد تغييرات' },
      color: 'success' as const,
    },
    {
      title: 'صحة النظام',
      value: systemHealth.overall.status === 'healthy' ? 'صحي' : 'تحذير',
      icon: <Monitor size={24} />,
      trend: { value: systemHealth.overall.score, direction: 'neutral' as const, label: `نقاط: ${systemHealth.overall.score}` },
      color: systemHealth.overall.status === 'healthy' ? 'success' as const : 'warning' as const,
    },
    {
      title: 'آخر نسخة احتياطية',
      value: 'منذ ساعة',
      icon: <Database size={24} />,
      trend: { value: 0, direction: 'neutral' as const, label: 'تلقائي' },
      color: 'success' as const,
    }
  ], [settings.business.agencyMarginPercent, systemHealth]);

  // حفظ الإعدادات
  const saveSettings = async (newSettings: Partial<SystemSettings>) => {
    setLoading(true);
    try {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(prev => ({ ...prev, ...newSettings }));
      setShowSaveIndicator(true);
      setTimeout(() => setShowSaveIndicator(false), 3000);
      notifications.show({
        title: 'تم الحفظ',
        message: 'تم حفظ الإعدادات بنجاح',
        color: 'green',
        icon: <CheckCircle size={16} />
      });
    } catch {
      notifications.show({
        title: 'خطأ',
        message: 'فشل في حفظ الإعدادات',
        color: 'red',
        icon: <AlertTriangle size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  // تحديث معامل
  const updateModifier = async (id: string, newValue: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setModifiers(prev => prev.map(mod => 
        mod.id === id ? { ...mod, value: newValue, lastUpdated: new Date().toISOString().split('T')[0] } : mod
      ));
      setEditingModifier(null);
      notifications.show({
        title: 'تم التحديث',
        message: 'تم تحديث المعامل بنجاح',
        color: 'green'
      });
    } catch {
      notifications.show({
        title: 'خطأ',
        message: 'فشل في تحديث المعامل',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  // تفعيل وضع الصيانة
  const toggleMaintenance = async (enabled: boolean) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(prev => ({
        ...prev,
        general: { ...prev.general, maintenanceMode: enabled }
      }));
      notifications.show({
        title: enabled ? 'تم تفعيل وضع الصيانة' : 'تم إلغاء وضع الصيانة',
        message: enabled ? 'النظام الآن في وضع الصيانة' : 'النظام عاد للعمل العادي',
        color: enabled ? 'orange' : 'green'
      });
      closeMaintenance();
    } catch {
      notifications.show({
        title: 'خطأ',
        message: 'فشل في تغيير وضع الصيانة',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      {/* مؤشر الحفظ */}
      <div className={`${styles.saveIndicator} ${showSaveIndicator ? styles.visible : ''}`}>
        تم حفظ التغييرات ✓
      </div>

      {/* رأس الصفحة */}
      <div className={styles.pageHeader}>
        <div>
          <Title order={1} className={styles.pageTitle}>إعدادات النظام</Title>
          <Text className={styles.pageDescription}>
            إدارة الإعدادات العامة ومعاملات التسعير ومراقبة النظام
          </Text>
        </div>
        <Group className={styles.headerActions}>
          <Button
            variant="light"
            leftSection={<RefreshCw size={16} />}
            onClick={() => window.location.reload()}
            loading={loading}
          >
            تحديث
          </Button>
          <Button
            leftSection={<Save size={16} />}
            onClick={() => saveSettings(settings)}
            loading={loading}
          >
            حفظ الكل
          </Button>
        </Group>
      </div>

      {/* إحصائيات سريعة */}
      <div className={styles.statsSection}>
        <Grid>
          {settingsStats.map((stat, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                color={stat.color}
                clickable={false}
              />
            </Grid.Col>
          ))}
        </Grid>
      </div>

      {/* التبويبات الرئيسية */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'business')}>
        <Tabs.List grow>
          <Tabs.Tab value="business" leftSection={<DollarSign size={16} />}>
            الأعمال والتسعير
          </Tabs.Tab>
          <Tabs.Tab value="modifiers" leftSection={<Calculator size={16} />}>
            معاملات التسعير
          </Tabs.Tab>
          <Tabs.Tab value="system" leftSection={<Settings size={16} />}>
            إعدادات النظام
          </Tabs.Tab>
          <Tabs.Tab value="maintenance" leftSection={<Activity size={16} />}>
            الصيانة والمراقبة
          </Tabs.Tab>
        </Tabs.List>

        {/* تبويب الأعمال والتسعير */}
        <Tabs.Panel value="business" pt="lg">
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>
                  <DollarSign size={20} />
                  إعدادات هامش الوكالة
                </h3>
                <p className={styles.sectionDescription}>
                  النسبة المئوية الموحدة التي تطبق على جميع المشاريع (النطاق المسموح: 10% - 50%)
                </p>
              </div>
            </div>

            <div className={styles.marginContainer}>
              <div className={styles.marginValue}>
                {settings.business.agencyMarginPercent}%
              </div>
              
              <Slider
                className={styles.marginSlider}
                value={settings.business.agencyMarginPercent}
                onChange={(value) => setSettings(prev => ({
                  ...prev,
                  business: { ...prev.business, agencyMarginPercent: value }
                }))}
                min={10}
                max={50}
                step={1}
                marks={[
                  { value: 10, label: '10%' },
                  { value: 20, label: '20%' },
                  { value: 30, label: '30%' },
                  { value: 40, label: '40%' },
                  { value: 50, label: '50%' }
                ]}
                size="lg"
                color="blue"
              />

              <div className={styles.marginImpact}>
                <div className={styles.impactItem}>
                  <div className={styles.impactValue}>320,000 د.ع</div>
                  <div className={styles.impactLabel}>مثال: سعر المبدع</div>
                </div>
                <div className={styles.impactItem}>
                  <div className={styles.impactValue}>+{new Intl.NumberFormat('en-US').format(Math.round(320000 * settings.business.agencyMarginPercent / 100))} د.ع</div>
                  <div className={styles.impactLabel}>هامش الوكالة</div>
                </div>
                <div className={styles.impactItem}>
                  <div className={styles.impactValue}>{new Intl.NumberFormat('en-US').format(Math.round(320000 * (1 + settings.business.agencyMarginPercent / 100)))} د.ع</div>
                  <div className={styles.impactLabel}>السعر النهائي</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <TrendingUp size={20} />
                حدود المشاريع والموافقات
              </h3>
            </div>

            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>الحد الأدنى للمشروع</label>
                <NumberInput
                  value={settings.business.minimumProject}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, minimumProject: Number(value) }
                  }))}
                  min={50000}
                  max={1000000}
                  step={10000}
                  thousandSeparator=","
                  suffix=" د.ع"
                />
                <p className={styles.settingDescription}>أقل قيمة مقبولة للمشروع</p>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>الحد الأقصى للمشروع</label>
                <NumberInput
                  value={settings.business.maximumProject}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, maximumProject: Number(value) }
                  }))}
                  min={1000000}
                  max={100000000}
                  step={1000000}
                  thousandSeparator=","
                  suffix=" د.ع"
                />
                <p className={styles.settingDescription}>أعلى قيمة مقبولة للمشروع</p>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>حد الموافقة التلقائية</label>
                <NumberInput
                  value={settings.business.autoApprovalLimit}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, autoApprovalLimit: Number(value) }
                  }))}
                  min={100000}
                  max={10000000}
                  step={100000}
                  thousandSeparator=","
                  suffix=" د.ع"
                />
                <p className={styles.settingDescription}>المشاريع تحت هذا المبلغ تُعتمد تلقائياً</p>
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>شروط الدفع الافتراضية</label>
                <Select
                  value={settings.business.paymentTerms}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    business: { ...prev.business, paymentTerms: value || 'net_15' }
                  }))}
                  data={[
                    { value: 'advance_50', label: 'دفعة مقدمة 50%' },
                    { value: 'advance_100', label: 'دفعة مقدمة 100%' },
                    { value: 'net_15', label: 'صافي 15 يوم' },
                    { value: 'net_30', label: 'صافي 30 يوم' }
                  ]}
                />
                <p className={styles.settingDescription}>شروط الدفع الافتراضية للعملاء الجدد</p>
              </div>
            </div>
          </div>
        </Tabs.Panel>

        {/* تبويب معاملات التسعير */}
        <Tabs.Panel value="modifiers" pt="lg">
          {['processing', 'experience', 'equipment', 'rush', 'location'].map(category => {
            const categoryModifiers = modifiers.filter(mod => mod.category === category);
            const categoryNames = {
              processing: 'معاملات المعالجة',
              experience: 'معاملات الخبرة',
              equipment: 'معاملات المعدات',
              rush: 'معاملات الاستعجال',
              location: 'إضافات الموقع'
            };

            return (
              <div key={category} className={styles.settingsSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <Calculator size={20} />
                    {categoryNames[category as keyof typeof categoryNames]}
                  </h3>
                </div>

                <Table className={styles.modifiersTable}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>الاسم</Table.Th>
                      <Table.Th>المفتاح</Table.Th>
                      <Table.Th>القيمة</Table.Th>
                      <Table.Th>النوع</Table.Th>
                      <Table.Th>الوصف</Table.Th>
                      <Table.Th>آخر تحديث</Table.Th>
                      <Table.Th>إجراءات</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {categoryModifiers.map(modifier => (
                      <Table.Tr key={modifier.id} className={styles.modifierRow}>
                        <Table.Td>
                          <div className={styles.modifierName}>{modifier.name}</div>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light" size="sm">{modifier.key}</Badge>
                        </Table.Td>
                        <Table.Td>
                          {editingModifier === modifier.id ? (
                            <NumberInput
                              size="xs"
                              value={modifier.value}
                              onChange={(value) => {
                                setModifiers(prev => prev.map(mod => 
                                  mod.id === modifier.id ? { ...mod, value: Number(value) } : mod
                                ));
                              }}
                              min={modifier.type === 'multiplier' ? 0.1 : 0}
                              max={modifier.type === 'multiplier' ? 3.0 : 200000}
                              step={modifier.type === 'multiplier' ? 0.1 : 5000}
                              decimalScale={modifier.type === 'multiplier' ? 1 : 0}
                              style={{ width: 100 }}
                            />
                          ) : (
                            <div className={styles.modifierValue}>
                              {modifier.type === 'multiplier' 
                                ? modifier.value.toFixed(1) 
                                : new Intl.NumberFormat('en-US').format(modifier.value)
                              }
                              {modifier.type === 'addition' && ' د.ع'}
                            </div>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Badge 
                            color={modifier.type === 'multiplier' ? 'blue' : 'green'} 
                            variant="light" 
                            size="sm"
                          >
                            {modifier.type === 'multiplier' ? 'ضرب' : 'إضافة'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">{modifier.description}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs" c="dimmed">{modifier.lastUpdated}</Text>
                        </Table.Td>
                        <Table.Td>
                          <div className={styles.modifierActions}>
                            {editingModifier === modifier.id ? (
                              <>
                                <Tooltip label="حفظ">
                                  <ActionIcon 
                                    color="green" 
                                    variant="light" 
                                    size="sm"
                                    onClick={() => updateModifier(modifier.id, modifier.value)}
                                    loading={loading}
                                  >
                                    <CheckCircle size={14} />
                                  </ActionIcon>
                                </Tooltip>
                                <Tooltip label="إلغاء">
                                  <ActionIcon 
                                    color="gray" 
                                    variant="light" 
                                    size="sm"
                                    onClick={() => setEditingModifier(null)}
                                  >
                                    <AlertTriangle size={14} />
                                  </ActionIcon>
                                </Tooltip>
                              </>
                            ) : (
                              <Tooltip label="تعديل">
                                <ActionIcon 
                                  color="blue" 
                                  variant="light" 
                                  size="sm"
                                  onClick={() => setEditingModifier(modifier.id)}
                                >
                                  <Edit size={14} />
                                </ActionIcon>
                              </Tooltip>
                            )}
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            );
          })}
        </Tabs.Panel>

        {/* تبويب إعدادات النظام */}
        <Tabs.Panel value="system" pt="lg">
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Settings size={20} />
                الإعدادات العامة
              </h3>
            </div>

            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>اسم النظام</label>
                <TextInput
                  value={settings.general.systemName}
                  onChange={(event) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, systemName: event.currentTarget.value }
                  }))}
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>الإصدار</label>
                <TextInput value={settings.general.version} disabled />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>المنطقة الزمنية</label>
                <Select
                  value={settings.general.timezone}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, timezone: value || 'Asia/Baghdad' }
                  }))}
                  data={[
                    { value: 'Asia/Baghdad', label: 'بغداد (GMT+3)' },
                    { value: 'Asia/Riyadh', label: 'الرياض (GMT+3)' },
                    { value: 'Asia/Dubai', label: 'دبي (GMT+4)' }
                  ]}
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>العملة الافتراضية</label>
                <Select
                  value={settings.general.currency}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    general: { ...prev.general, currency: value || 'IQD' }
                  }))}
                  data={[
                    { value: 'IQD', label: 'دينار عراقي (IQD)' },
                    { value: 'USD', label: 'دولار أمريكي (USD)' },
                    { value: 'SAR', label: 'ريال سعودي (SAR)' }
                  ]}
                />
              </div>
            </div>
          </div>

          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Shield size={20} />
                إعدادات الأمان
              </h3>
            </div>

            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <Switch
                  label="المصادقة الثنائية"
                  description="تفعيل المصادقة الثنائية لجميع المستخدمين"
                  checked={settings.security.twoFactorAuth}
                  onChange={(event) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, twoFactorAuth: event.currentTarget.checked }
                  }))}
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>مهلة انتهاء الجلسة (ثانية)</label>
                <NumberInput
                  value={settings.security.sessionTimeout}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, sessionTimeout: Number(value) }
                  }))}
                  min={300}
                  max={86400}
                  step={300}
                />
                <p className={styles.settingDescription}>
                  {Math.round(settings.security.sessionTimeout / 60)} دقيقة
                </p>
              </div>

              <div className={styles.settingItem}>
                <Switch
                  label="سجل التدقيق"
                  description="تسجيل جميع العمليات الحساسة"
                  checked={settings.security.auditLogging}
                  onChange={(event) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, auditLogging: event.currentTarget.checked }
                  }))}
                />
              </div>

              <div className={styles.settingItem}>
                <Switch
                  label="أحرف خاصة في كلمة المرور"
                  description="إجبار استخدام أحرف خاصة في كلمات المرور"
                  checked={settings.security.requireSpecialChars}
                  onChange={(event) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, requireSpecialChars: event.currentTarget.checked }
                  }))}
                />
              </div>
            </div>
          </div>

          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Upload size={20} />
                حدود الرفع والتخزين
              </h3>
            </div>

            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>الحد الأقصى لرفع الملفات</label>
                <Select
                  value={settings.limits.fileUploadMaxSize}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    limits: { ...prev.limits, fileUploadMaxSize: value || '50MB' }
                  }))}
                  data={[
                    { value: '10MB', label: '10 ميجابايت' },
                    { value: '25MB', label: '25 ميجابايت' },
                    { value: '50MB', label: '50 ميجابايت' },
                    { value: '100MB', label: '100 ميجابايت' }
                  ]}
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>مساحة التخزين لكل مستخدم</label>
                <Select
                  value={settings.limits.storagePerUser}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    limits: { ...prev.limits, storagePerUser: value || '5GB' }
                  }))}
                  data={[
                    { value: '1GB', label: '1 جيجابايت' },
                    { value: '2GB', label: '2 جيجابايت' },
                    { value: '5GB', label: '5 جيجابايت' },
                    { value: '10GB', label: '10 جيجابايت' }
                  ]}
                />
              </div>

              <div className={styles.settingItem}>
                <label className={styles.settingLabel}>حد استخدام API</label>
                <Select
                  value={settings.limits.apiRateLimit}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    limits: { ...prev.limits, apiRateLimit: value || '1000/hour' }
                  }))}
                  data={[
                    { value: '500/hour', label: '500 طلب/ساعة' },
                    { value: '1000/hour', label: '1000 طلب/ساعة' },
                    { value: '2000/hour', label: '2000 طلب/ساعة' },
                    { value: '5000/hour', label: '5000 طلب/ساعة' }
                  ]}
                />
              </div>
            </div>
          </div>
        </Tabs.Panel>

        {/* تبويب الصيانة والمراقبة */}
        <Tabs.Panel value="maintenance" pt="lg">
          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Monitor size={20} />
                صحة النظام
              </h3>
              <Badge 
                color={systemHealth.overall.status === 'healthy' ? 'green' : 'orange'} 
                size="lg"
              >
                {systemHealth.overall.status === 'healthy' ? 'صحي' : 'تحذير'}
              </Badge>
            </div>

            <div className={styles.systemHealth}>
              <div className={styles.healthCard}>
                <div className={`${styles.healthStatus} ${styles.healthy}`}>
                  API
                </div>
                <div className={styles.healthMetric}>
                  الاستجابة: {systemHealth.services.api.responseTime}
                </div>
                <div className={styles.healthMetric}>
                  الأخطاء: {systemHealth.services.api.errorRate}
                </div>
              </div>

              <div className={styles.healthCard}>
                <div className={`${styles.healthStatus} ${styles.healthy}`}>
                  قاعدة البيانات
                </div>
                <div className={styles.healthMetric}>
                  الاتصالات: {systemHealth.services.database.connections}
                </div>
                <div className={styles.healthMetric}>
                  الاستعلام: {systemHealth.services.database.queryTime}
                </div>
              </div>

              <div className={styles.healthCard}>
                <div className={`${styles.healthStatus} ${styles.healthy}`}>
                  Firebase
                </div>
                <div className={styles.healthMetric}>
                  المستخدمون: {systemHealth.services.firebase.authenticatedUsers}
                </div>
              </div>

              <div className={styles.healthCard}>
                <div className={`${styles.healthStatus} ${styles.warning}`}>
                  التخزين
                </div>
                <div className={styles.healthMetric}>
                  المستخدم: {systemHealth.services.storage.usedSpace}
                </div>
                <div className={styles.healthMetric}>
                  النسبة: {systemHealth.services.storage.usagePercentage}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Power size={20} />
                وضع الصيانة
              </h3>
              <Switch
                checked={settings.general.maintenanceMode}
                onChange={() => openMaintenance()}
                color={settings.general.maintenanceMode ? 'red' : 'green'}
                size="lg"
              />
            </div>

            <div className={`${styles.maintenanceToggle} ${settings.general.maintenanceMode ? styles.active : ''}`}>
              <div className={styles.maintenanceHeader}>
                <span className={styles.maintenanceTitle}>
                  {settings.general.maintenanceMode ? 'النظام في وضع الصيانة' : 'النظام يعمل بشكل طبيعي'}
                </span>
                <Badge color={settings.general.maintenanceMode ? 'red' : 'green'}>
                  {settings.general.maintenanceMode ? 'صيانة' : 'نشط'}
                </Badge>
              </div>
              <p className={styles.maintenanceDescription}>
                {settings.general.maintenanceMode 
                  ? 'المستخدمون لا يمكنهم الوصول للنظام حالياً. فقط الأدمنز يمكنهم تسجيل الدخول.'
                  : 'جميع المستخدمين يمكنهم الوصول للنظام والعمل بشكل طبيعي.'
                }
              </p>
            </div>
          </div>

          <div className={styles.settingsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Database size={20} />
                النسخ الاحتياطية
              </h3>
              <Group>
                <Button 
                  variant="light" 
                  leftSection={<Download size={16} />}
                  size="sm"
                >
                  تحميل النسخة الأخيرة
                </Button>
                <Button 
                  leftSection={<Upload size={16} />}
                  size="sm"
                >
                  إنشاء نسخة احتياطية
                </Button>
              </Group>
            </div>

            <Alert icon={<Database size={16} />} title="آخر نسخة احتياطية" color="green">
              تم إنشاء آخر نسخة احتياطية منذ ساعة واحدة (2.3 GB). 
              النسخ التلقائية تتم يومياً في الساعة 2:00 صباحاً.
            </Alert>

            <div style={{ marginTop: 16 }}>
              <Text size="sm" c="dimmed" mb="xs">تقدم النسخة الاحتياطية التلقائية</Text>
              <Progress value={85} color="green" size="md" />
              <Text size="xs" c="dimmed" mt="xs">الباقي: 15 دقيقة (85% مكتمل)</Text>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>

      {/* مودال وضع الصيانة */}
      <Modal 
        opened={maintenanceOpened} 
        onClose={closeMaintenance} 
        title="تفعيل وضع الصيانة"
        size="md"
      >
        <Stack>
          <Alert icon={<AlertTriangle size={16} />} color="orange">
            تحذير: تفعيل وضع الصيانة سيمنع جميع المستخدمين من الوصول للنظام باستثناء الأدمنز.
          </Alert>

          <Textarea
            label="رسالة الصيانة (اختيارية)"
            placeholder="النظام تحت الصيانة المجدولة. سيعود خلال ساعتين."
            minRows={3}
          />

          <NumberInput
            label="المدة المتوقعة (دقائق)"
            placeholder="120"
            min={5}
            max={1440}
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={closeMaintenance}>
              إلغاء
            </Button>
            <Button 
              color="orange" 
              onClick={() => toggleMaintenance(!settings.general.maintenanceMode)}
              loading={loading}
            >
              {settings.general.maintenanceMode ? 'إلغاء الصيانة' : 'تفعيل الصيانة'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
