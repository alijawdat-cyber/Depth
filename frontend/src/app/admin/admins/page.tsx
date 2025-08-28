'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  Group,
  Text,
  Title,
  ActionIcon,
  Stack,
  Badge,
  Button as MantineButton,
  Modal,
  TextInput,
  Checkbox,
  LoadingOverlay,
  Box,
  Alert,
  Paper,
  Divider,
  Avatar,
  Tooltip
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  Shield,
  UserPlus,
  Settings,
  Eye,
  UserX,
  AlertTriangle,
  Crown,
  Clock,
  Calendar,
  Phone,
  Mail,
  Check,
  X
} from 'lucide-react';

// استيراد المكونات الموجودة
import StatsCard from '@/components/molecules/StatsCard';
import { DataTable, DataTableColumn } from '@/components/molecules/DataTable/DataTable';

import styles from './AdminsPage.module.css';

// أنواع البيانات
interface AdminPermissions {
  canManageUsers: boolean;
  canManageProjects: boolean;
  canManagePayments: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
  canManageAdmins: boolean;
}

interface AdminUser extends Record<string, unknown> {
  id: string;
  userId: string;
  adminLevel: 'super_admin' | 'admin';
  profile: {
    fullName: string;
    email: string;
    phone: string;
  };
  isActive: boolean;
  addedBy?: string;
  permissions: AdminPermissions;
  lastLoginAt?: string;
  createdAt?: string;
  addedAt?: string;
}

interface AdminSummary {
  total: number;
  superAdmins: number;
  admins: number;
  active: number;
  inactive: number;
}

interface AdminsResponse {
  admins: AdminUser[];
  summary: AdminSummary;
}

// نموذج للأدمن الجديد
interface NewAdminForm {
  fullName: string;
  email: string;
  phone: string;
  adminLevel: 'admin';
  permissions: AdminPermissions;
}

// بيانات وهمية مؤقتة
const mockAdminsData: AdminsResponse = {
  admins: [
    {
      id: 'sa_001',
      userId: 'u_sa001',
      adminLevel: 'super_admin',
      profile: {
        fullName: 'علي الربيعي',
        email: 'admin@depth-agency.com',
        phone: '07719956000'
      },
      isActive: true,
      permissions: {
        canManageUsers: true,
        canManageProjects: true,
        canManagePayments: true,
        canViewReports: true,
        canManageSettings: true,
        canManageAdmins: true
      },
      lastLoginAt: '2025-09-02T15:30:00.000Z',
      createdAt: '2025-01-01T00:00:00.000Z'
    },
    {
      id: 'ad_002',
      userId: 'u_ad002',
      adminLevel: 'admin',
      profile: {
        fullName: 'سارة أحمد',
        email: 'sara@depth-agency.com',
        phone: '07801234567'
      },
      isActive: true,
      addedBy: 'sa_001',
      permissions: {
        canManageUsers: true,
        canManageProjects: true,
        canManagePayments: false,
        canViewReports: true,
        canManageSettings: false,
        canManageAdmins: false
      },
      lastLoginAt: '2025-09-02T14:20:00.000Z',
      addedAt: '2025-08-15T10:00:00.000Z'
    },
    {
      id: 'ad_003',
      userId: 'u_ad003',
      adminLevel: 'admin',
      profile: {
        fullName: 'محمد كاظم',
        email: 'mohammed@depth-agency.com',
        phone: '07701122334'
      },
      isActive: false,
      addedBy: 'sa_001',
      permissions: {
        canManageUsers: false,
        canManageProjects: true,
        canManagePayments: false,
        canViewReports: true,
        canManageSettings: false,
        canManageAdmins: false
      },
      lastLoginAt: '2025-08-30T09:15:00.000Z',
      addedAt: '2025-07-10T12:00:00.000Z'
    }
  ],
  summary: {
    total: 3,
    superAdmins: 1,
    admins: 2,
    active: 2,
    inactive: 1
  }
};

// الصلاحيات الافتراضية للأدمن الجديد
const defaultPermissions: AdminPermissions = {
  canManageUsers: true,
  canManageProjects: true,
  canManagePayments: false,
  canViewReports: true,
  canManageSettings: false,
  canManageAdmins: false
};

// تنسيق التواريخ
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'غير محدد';
  return new Date(dateString).toLocaleDateString('ar-IQ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// تنسيق الوقت النسبي
const formatRelativeTime = (dateString: string | undefined) => {
  if (!dateString) return 'لم يسجل دخول';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'منذ قليل';
  if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
  if (diffInHours < 48) return 'أمس';
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `منذ ${diffInDays} يوم`;
};

export default function AdminsPage() {
  const [adminsData, setAdminsData] = useState<AdminsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  
  // نوافذ منبثقة
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] = useDisclosure(false);
  const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
  const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] = useDisclosure(false);
  
  // نموذج الأدمن الجديد
  const [newAdminForm, setNewAdminForm] = useState<NewAdminForm>({
    fullName: '',
    email: '',
    phone: '',
    adminLevel: 'admin',
    permissions: { ...defaultPermissions }
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [actionType, setActionType] = useState<'activate' | 'deactivate' | null>(null);

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchAdminsData();
  }, []);

  const fetchAdminsData = async () => {
    setLoading(true);
    try {
      // محاكاة API call
      // const response = await fetch('/api/admin/admins');
      // const data = await response.json();
      
      // استخدام البيانات المؤقتة
      setTimeout(() => {
        setAdminsData(mockAdminsData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setLoading(false);
    }
  };

  // التحقق من صحة النموذج
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newAdminForm.fullName.trim()) {
      errors.fullName = 'الاسم الكامل مطلوب';
    }

    if (!newAdminForm.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdminForm.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!newAdminForm.phone.trim()) {
      errors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^07[0-9]{9}$/.test(newAdminForm.phone)) {
      errors.phone = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 07 ويحتوي على 11 رقم)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // إضافة أدمن جديد
  const handleAddAdmin = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // محاكاة API call
      // const response = await fetch('/api/admin/admins', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newAdminForm)
      // });

      // محاكاة النجاح
      setTimeout(() => {
        notifications.show({
          title: 'تم بنجاح',
          message: 'تم إضافة الأدمن الجديد وإرسال دعوة Google OAuth',
          color: 'green',
          icon: <Check size={18} />
        });

        closeAddModal();
        resetForm();
        fetchAdminsData(); // إعادة جلب البيانات
        setSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding admin:', error);
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء إضافة الأدمن',
        color: 'red',
        icon: <X size={18} />
      });
      setSubmitting(false);
    }
  };

  // تفعيل/إلغاء تفعيل أدمن
  const handleToggleAdminStatus = async () => {
    if (!selectedAdmin || !actionType) return;

    setSubmitting(true);
    try {
      // محاكاة API call
      // const response = await fetch(`/api/admin/admins/${selectedAdmin.id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     isActive: actionType === 'activate',
      //     reason: actionType === 'activate' ? 'إعادة تفعيل' : 'إيقاف مؤقت'
      //   })
      // });

      setTimeout(() => {
        notifications.show({
          title: 'تم بنجاح',
          message: `تم ${actionType === 'activate' ? 'تفعيل' : 'إيقاف'} الأدمن`,
          color: 'green',
          icon: <Check size={18} />
        });

        closeConfirmModal();
        fetchAdminsData();
        setSubmitting(false);
        setActionType(null);
        setSelectedAdmin(null);
      }, 1500);
    } catch (error) {
      console.error('Error toggling admin status:', error);
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء تحديث الحالة',
        color: 'red',
        icon: <X size={18} />
      });
      setSubmitting(false);
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setNewAdminForm({
      fullName: '',
      email: '',
      phone: '',
      adminLevel: 'admin',
      permissions: { ...defaultPermissions }
    });
    setFormErrors({});
  };

  // تحديث صلاحية في النموذج
  const updatePermission = (key: keyof AdminPermissions, value: boolean) => {
    setNewAdminForm(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: value
      }
    }));
  };

  // عرض تفاصيل الأدمن
  const showAdminDetails = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    openDetailsModal();
  };

  // تأكيد تغيير الحالة
  const confirmStatusChange = (admin: AdminUser, action: 'activate' | 'deactivate') => {
    setSelectedAdmin(admin);
    setActionType(action);
    openConfirmModal();
  };

  // حساب إحصائيات الأدمنز
  const statsData = useMemo(() => {
    if (!adminsData) return [];

    return [
      {
        title: 'إجمالي الأدمنز',
        value: adminsData.summary.total,
        icon: <Shield size={20} />,
        color: 'primary' as const,
        trend: { value: 0, direction: 'neutral' as const, label: 'مستقر' }
      },
      {
        title: 'Super Admins',
        value: adminsData.summary.superAdmins,
        icon: <Crown size={20} />,
        color: 'warning' as const,
        trend: { value: 0, direction: 'neutral' as const, label: 'ثابت' }
      },
      {
        title: 'أدمنز نشطون',
        value: adminsData.summary.active,
        icon: <Check size={20} />,
        color: 'success' as const,
        trend: { value: 100, direction: 'up' as const, label: 'ممتاز' }
      },
      {
        title: 'غير نشطون',
        value: adminsData.summary.inactive,
        icon: <UserX size={20} />,
        color: 'danger' as const,
        trend: { value: adminsData.summary.inactive, direction: adminsData.summary.inactive > 0 ? 'up' as const : 'neutral' as const, label: adminsData.summary.inactive > 0 ? 'يحتاج متابعة' : 'جيد' }
      }
    ];
  }, [adminsData]);

  // إعداد أعمدة الجدول
  const tableColumns: DataTableColumn[] = [
    {
      key: 'profile',
      label: 'الأدمن',
      render: (_, row) => {
        const admin = row as unknown as AdminUser;
        return (
          <Group gap="sm">
            <Avatar
              size="sm"
              radius="sm"
              name={admin.profile.fullName}
              color="blue"
            />
            <Box>
              <Group gap="xs" align="center">
                <Text fw={600} size="sm">{admin.profile.fullName}</Text>
                {admin.adminLevel === 'super_admin' && (
                  <Tooltip label="Super Admin">
                    <Crown size={14} color="orange" />
                  </Tooltip>
                )}
              </Group>
              <Group gap="xs" align="center">
                <Mail size={12} />
                <Text size="xs" c="dimmed">{admin.profile.email}</Text>
              </Group>
            </Box>
          </Group>
        );
      }
    },
    {
      key: 'adminLevel',
      label: 'المستوى',
      render: (value) => (
        <Badge
          size="sm"
          variant="light"
          color={value === 'super_admin' ? 'orange' : 'blue'}
        >
          {value === 'super_admin' ? 'Super Admin' : 'Admin'}
        </Badge>
      )
    },
    {
      key: 'isActive',
      label: 'الحالة',
      render: (value) => (
        <Badge
          size="sm"
          variant="light"
          color={value ? 'green' : 'red'}
        >
          {value ? 'نشط' : 'غير نشط'}
        </Badge>
      )
    },
    {
      key: 'permissions',
      label: 'الصلاحيات',
      render: (_, row) => {
        const admin = row as unknown as AdminUser;
        const activePermissions = Object.values(admin.permissions).filter(Boolean).length;
        const totalPermissions = Object.keys(admin.permissions).length;
        
        return (
          <Group gap="xs" align="center">
            <Text size="sm" fw={500}>{activePermissions}/{totalPermissions}</Text>
            <Badge size="xs" variant="light" color="gray">
              {Math.round((activePermissions / totalPermissions) * 100)}%
            </Badge>
          </Group>
        );
      }
    },
    {
      key: 'lastLoginAt',
      label: 'آخر دخول',
      render: (value) => (
        <Group gap="xs" align="center">
          <Clock size={12} />
          <Text size="sm" c="dimmed">{formatRelativeTime(value as string)}</Text>
        </Group>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (_, row) => {
        const admin = row as unknown as AdminUser;
        return (
          <Group gap="xs">
            <Tooltip label="عرض التفاصيل">
              <ActionIcon
                size="sm"
                variant="light"
                color="blue"
                onClick={() => showAdminDetails(admin)}
              >
                <Eye size={14} />
              </ActionIcon>
            </Tooltip>
            
            {admin.adminLevel !== 'super_admin' && (
              <Tooltip label={admin.isActive ? 'إيقاف' : 'تفعيل'}>
                <ActionIcon
                  size="sm"
                  variant="light"
                  color={admin.isActive ? 'red' : 'green'}
                  onClick={() => confirmStatusChange(admin, admin.isActive ? 'deactivate' : 'activate')}
                >
                  {admin.isActive ? <UserX size={14} /> : <Check size={14} />}
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        );
      }
    }
  ];

  return (
    <div className={styles.adminsContainer}>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      
      {/* العنوان والأزرار */}
      <div className={styles.pageHeader}>
        <Group justify="space-between" align="flex-start">
          <Box>
            <Title order={2} className={styles.pageTitle}>
              إدارة الأدمنز
            </Title>
            <Text size="sm" c="dimmed" mt="xs">
              إدارة المدراء والصلاحيات - متاح للـ Super Admin فقط
            </Text>
          </Box>
          
          <MantineButton
            leftSection={<UserPlus size={18} />}
            onClick={openAddModal}
            color="blue"
            size="md"
          >
            إضافة أدمن جديد
          </MantineButton>
        </Group>

        {/* تنبيه الأمان */}
        <Alert
          variant="light"
          color="orange"
          title="تنبيه أمني"
          icon={<Shield size={16} />}
          className={styles.securityAlert}
        >
          هذه الصفحة متاحة فقط للـ Super Admin. جميع العمليات يتم تسجيلها في سجل التدقيق.
        </Alert>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className={styles.statsSection}>
        <Grid>
          {statsData.map((stat, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                color={stat.color}
              />
            </Grid.Col>
          ))}
        </Grid>
      </div>

      {/* جدول الأدمنز */}
      <div className={styles.tableSection}>
        <Paper className={styles.tableContainer} p="lg" radius="md" shadow="xs">
          <DataTable
            columns={tableColumns}
            data={adminsData?.admins || []}
            loading={loading}
            searchable={true}
            searchPlaceholder="البحث في الأدمنز..."
            emptyText="لا يوجد أدمنز"
            pageSize={10}
          />
        </Paper>
      </div>

      {/* نافذة إضافة أدمن جديد */}
      <Modal
        opened={addModalOpened}
        onClose={closeAddModal}
        title={
          <Group gap="sm">
            <UserPlus size={20} />
            <Text fw={600}>إضافة أدمن جديد</Text>
          </Group>
        }
        size="lg"
        centered
        closeOnClickOutside={!submitting}
        withCloseButton={!submitting}
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            سيتم إرسال دعوة Google OAuth للبريد الإلكتروني المحدد
          </Text>

          <Grid>
            <Grid.Col span={12}>
              <TextInput
                label="الاسم الكامل"
                placeholder="أدخل الاسم الكامل"
                required
                value={newAdminForm.fullName}
                onChange={(e) => setNewAdminForm(prev => ({ ...prev, fullName: e.target.value }))}
                error={formErrors.fullName}
                disabled={submitting}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="البريد الإلكتروني"
                placeholder="admin@depth-agency.com"
                required
                type="email"
                value={newAdminForm.email}
                onChange={(e) => setNewAdminForm(prev => ({ ...prev, email: e.target.value }))}
                error={formErrors.email}
                disabled={submitting}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6 }}>
              <TextInput
                label="رقم الهاتف"
                placeholder="07XXXXXXXXX"
                required
                value={newAdminForm.phone}
                onChange={(e) => setNewAdminForm(prev => ({ ...prev, phone: e.target.value }))}
                error={formErrors.phone}
                disabled={submitting}
              />
            </Grid.Col>
          </Grid>

          <Divider my="md" label="الصلاحيات" labelPosition="center" />

          <Grid>
            {Object.entries({
              canManageUsers: 'إدارة المستخدمين',
              canManageProjects: 'إدارة المشاريع', 
              canManagePayments: 'إدارة المدفوعات',
              canViewReports: 'عرض التقارير',
              canManageSettings: 'إدارة الإعدادات'
            }).map(([key, label]) => (
              <Grid.Col key={key} span={{ base: 12, sm: 6 }}>
                <Checkbox
                  label={label}
                  checked={newAdminForm.permissions[key as keyof AdminPermissions]}
                  onChange={(e) => updatePermission(key as keyof AdminPermissions, e.target.checked)}
                  disabled={submitting}
                />
              </Grid.Col>
            ))}
          </Grid>

          <Alert variant="light" color="blue" icon={<Settings size={16} />}>
            <Text size="sm">
              <strong>ملاحظة:</strong> صلاحية &quot;إدارة الأدمنز&quot; محجوزة للـ Super Admin فقط ولا يمكن منحها للأدمن العادي.
            </Text>
          </Alert>

          <Group justify="flex-end" mt="xl">
            <MantineButton
              variant="light"
              onClick={closeAddModal}
              disabled={submitting}
            >
              إلغاء
            </MantineButton>
            <MantineButton
              onClick={handleAddAdmin}
              loading={submitting}
              leftSection={<UserPlus size={16} />}
            >
              إضافة الأدمن
            </MantineButton>
          </Group>
        </Stack>
      </Modal>

      {/* نافذة تفاصيل الأدمن */}
      <Modal
        opened={detailsModalOpened}
        onClose={closeDetailsModal}
        title={
          <Group gap="sm">
            <Eye size={20} />
            <Text fw={600}>تفاصيل الأدمن</Text>
          </Group>
        }
        size="md"
        centered
      >
        {selectedAdmin && (
          <Stack gap="md">
            <Paper p="md" radius="md" bg="gray.0">
              <Group gap="md">
                <Avatar
                  size="lg"
                  radius="md"
                  name={selectedAdmin.profile.fullName}
                  color="blue"
                />
                <Box flex={1}>
                  <Group gap="xs" align="center" mb="xs">
                    <Text fw={700} size="lg">{selectedAdmin.profile.fullName}</Text>
                    {selectedAdmin.adminLevel === 'super_admin' && (
                      <Badge size="sm" color="orange" variant="light">
                        <Group gap={4}>
                          <Crown size={12} />
                          Super Admin
                        </Group>
                      </Badge>
                    )}
                  </Group>
                  <Stack gap={4}>
                    <Group gap="xs">
                      <Mail size={14} />
                      <Text size="sm">{selectedAdmin.profile.email}</Text>
                    </Group>
                    <Group gap="xs">
                      <Phone size={14} />
                      <Text size="sm">{selectedAdmin.profile.phone}</Text>
                    </Group>
                  </Stack>
                </Box>
              </Group>
            </Paper>

            <Grid>
              <Grid.Col span={6}>
                <Paper p="sm" radius="md" bg="blue.0">
                  <Group gap="xs" align="center">
                    <Calendar size={16} />
                    <Box>
                      <Text size="xs" c="dimmed">تاريخ الإنشاء</Text>
                      <Text size="sm" fw={500}>
                        {formatDate(selectedAdmin.createdAt || selectedAdmin.addedAt)}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              </Grid.Col>
              
              <Grid.Col span={6}>
                <Paper p="sm" radius="md" bg="green.0">
                  <Group gap="xs" align="center">
                    <Clock size={16} />
                    <Box>
                      <Text size="xs" c="dimmed">آخر دخول</Text>
                      <Text size="sm" fw={500}>
                        {formatRelativeTime(selectedAdmin.lastLoginAt)}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              </Grid.Col>
            </Grid>

            <Paper p="md" radius="md" bg="gray.0">
              <Text fw={600} mb="sm">الصلاحيات</Text>
              <Stack gap="xs">
                {Object.entries({
                  canManageUsers: 'إدارة المستخدمين',
                  canManageProjects: 'إدارة المشاريع',
                  canManagePayments: 'إدارة المدفوعات',
                  canViewReports: 'عرض التقارير',
                  canManageSettings: 'إدارة الإعدادات',
                  canManageAdmins: 'إدارة الأدمنز'
                }).map(([key, label]) => (
                  <Group key={key} gap="xs" justify="space-between">
                    <Text size="sm">{label}</Text>
                    <Badge
                      size="xs"
                      variant="light"
                      color={selectedAdmin.permissions[key as keyof AdminPermissions] ? 'green' : 'red'}
                    >
                      {selectedAdmin.permissions[key as keyof AdminPermissions] ? 'ممنوح' : 'مرفوض'}
                    </Badge>
                  </Group>
                ))}
              </Stack>
            </Paper>
          </Stack>
        )}
      </Modal>

      {/* نافذة تأكيد تغيير الحالة */}
      <Modal
        opened={confirmModalOpened}
        onClose={closeConfirmModal}
        title={
          <Group gap="sm">
            <AlertTriangle size={20} />
            <Text fw={600}>تأكيد العملية</Text>
          </Group>
        }
        size="sm"
        centered
        withCloseButton={!submitting}
      >
        {selectedAdmin && (
          <Stack gap="md">
            <Alert
              variant="light"
              color={actionType === 'activate' ? 'green' : 'red'}
              icon={actionType === 'activate' ? <Check size={16} /> : <UserX size={16} />}
            >
              هل أنت متأكد من {actionType === 'activate' ? 'تفعيل' : 'إيقاف'} الأدمن{' '}
              <strong>{selectedAdmin.profile.fullName}</strong>؟
            </Alert>

            <Text size="sm" c="dimmed">
              سيتم تسجيل هذا الإجراء في سجل التدقيق وإرسال إشعار للأدمن.
            </Text>

            <Group justify="flex-end">
              <MantineButton
                variant="light"
                onClick={closeConfirmModal}
                disabled={submitting}
              >
                إلغاء
              </MantineButton>
              <MantineButton
                color={actionType === 'activate' ? 'green' : 'red'}
                onClick={handleToggleAdminStatus}
                loading={submitting}
                leftSection={actionType === 'activate' ? <Check size={16} /> : <UserX size={16} />}
              >
                {actionType === 'activate' ? 'تفعيل' : 'إيقاف'} الأدمن
              </MantineButton>
            </Group>
          </Stack>
        )}
      </Modal>
    </div>
  );
}
