'use client';

import React, { useState, useMemo } from 'react';
import { 
  Grid, 
  Group, 
  Text, 
  ActionIcon,
  Stack,
  Button,
  Modal,
  Select,
  Table,
  Badge
} from '@mantine/core';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Eye,
  Edit,
  Trash
} from 'lucide-react';

// استيراد المكونات الموجودة
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';

import styles from './UsersPage.module.css';

// Types للمستخدمين
interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'client' | 'super_admin';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  phone?: string;
  lastLogin?: Date;
  createdAt: Date;
  projects?: number;
  earnings?: number;
}

// بيانات وهمية للمستخدمين
const mockUsers: User[] = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    email: 'ahmed@example.com',
    role: 'admin',
    status: 'active',
    phone: '07701234567',
    lastLogin: new Date('2025-08-27T10:30:00'),
    createdAt: new Date('2025-01-15'),
    projects: 12,
    earnings: 2500000
  },
  {
    id: '2', 
    name: 'فاطمة الزهراء',
    email: 'fatima@example.com',
    role: 'creator',
    status: 'active',
    phone: '07809876543',
    lastLogin: new Date('2025-08-27T09:15:00'),
    createdAt: new Date('2025-02-10'),
    projects: 34,
    earnings: 15750000
  },
  {
    id: '3',
    name: 'شركة البرج للمطاعم',
    email: 'info@alburj.com',
    role: 'client',
    status: 'active',
    phone: '07911122334',
    lastLogin: new Date('2025-08-26T16:45:00'),
    createdAt: new Date('2025-03-05'),
    projects: 8,
    earnings: 0
  },
  {
    id: '4',
    name: 'علي حسين كاظم', 
    email: 'ali@example.com',
    role: 'creator',
    status: 'pending',
    phone: '07712345678',
    lastLogin: new Date('2025-08-25T14:20:00'),
    createdAt: new Date('2025-08-20'),
    projects: 0,
    earnings: 0
  },
  {
    id: '5',
    name: 'سارة أكرم',
    email: 'sara@example.com', 
    role: 'creator',
    status: 'inactive',
    phone: '07887654321',
    lastLogin: new Date('2025-08-15T11:30:00'),
    createdAt: new Date('2025-04-12'),
    projects: 18,
    earnings: 8900000
  }
];

// إعدادات الأدوار
const roleOptions = [
  { value: 'all', label: 'كل الأدوار' },
  { value: 'admin', label: 'إدمن' },
  { value: 'creator', label: 'مبدع' },
  { value: 'client', label: 'عميل' },
  { value: 'super_admin', label: 'سوبر إدمن' }
];

const statusOptions = [
  { value: 'all', label: 'كل الحالات' },
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'غير نشط' },
  { value: 'pending', label: 'بانتظار المراجعة' }
];

export default function UsersPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // حساب الإحصائيات
  const stats = useMemo(() => {
    const totalUsers = mockUsers.length;
    const activeUsers = mockUsers.filter(u => u.status === 'active').length;
    const creators = mockUsers.filter(u => u.role === 'creator').length;
    const clients = mockUsers.filter(u => u.role === 'client').length;

    return {
      total: totalUsers,
      active: activeUsers,
      creators,
      clients
    };
  }, []);

  // فلترة البيانات
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      const statusMatch = statusFilter === 'all' || user.status === statusFilter;
      return roleMatch && statusMatch;
    });
  }, [roleFilter, statusFilter]);

  // تكوين أعمدة الجدول
  interface TableColumn {
    key: string;
    label: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  }

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'المستخدم',
      render: (_, row) => {
        const user = row as User;
        return (
          <Group gap="sm">
            <div className={styles.userAvatar}>
              {user.name.charAt(0)}
            </div>
            <div>
              <Text fw={500} size="sm">{user.name}</Text>
              <Text size="xs" c="dimmed">{user.email}</Text>
            </div>
          </Group>
        );
      }
    },
    {
      key: 'role',
      label: 'الدور',
      render: (value) => {
        const roleLabels = {
          admin: 'إدمن',
          creator: 'مبدع',
          client: 'عميل',
          super_admin: 'سوبر إدمن'
        };
        return (
          <Text size="sm" fw={500}>
            {roleLabels[value as keyof typeof roleLabels]}
          </Text>
        );
      }
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (value) => {
        const status = value as 'active' | 'inactive' | 'pending';
        return (
          <Badge 
            color={
              status === 'active' ? 'green' : 
              status === 'inactive' ? 'gray' : 'yellow'
            }
            variant="light"
            size="sm"
          >
            {status === 'active' ? 'نشط' : 
             status === 'inactive' ? 'غير نشط' : 'معلق'}
          </Badge>
        );
      }
    },
    {
      key: 'projects',
      label: 'المشاريع',
      render: (value) => (
        <Text size="sm" ta="center">
          {(value as number) || 0}
        </Text>
      )
    },
    {
      key: 'lastLogin',
      label: 'آخر دخول',
      render: (value) => {
        if (!value) return <Text size="xs" c="dimmed">لم يدخل</Text>;
        const date = value as Date;
        return (
          <Text size="xs" c="dimmed">
            {date.toLocaleDateString('ar-IQ')}
          </Text>
        );
      }
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (_, row) => {
        const user = row as User;
        return (
          <Group gap={4} justify="center">
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={(e) => {
                e.stopPropagation();
                handleViewUser(user);
              }}
            >
              <Eye size={14} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(user);
              }}
            >
              <Edit size={14} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              c="red"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(user);
              }}
            >
              <Trash size={14} />
            </ActionIcon>
          </Group>
        );
      }
    }
  ];

  // معالجات الأحداث
  const handleViewUser = (user: User) => {
    console.log('عرض المستخدم:', user);
    // سيتم ربطه بصفحة تفاصيل المستخدم لاحقاً
  };

  const handleEditUser = (user: User) => {
    console.log('تعديل المستخدم:', user);
    // سيتم ربطه بصفحة تعديل المستخدم لاحقاً
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      console.log('حذف المستخدم:', userToDelete);
      // سيتم ربطه بـ API لاحقاً
    }
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleCreateUser = () => {
    console.log('إنشاء مستخدم جديد');
    // سيتم ربطه بصفحة إنشاء مستخدم لاحقاً
  };

  return (
    <div className={styles.usersPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <Text size="xl" fw={700} className={styles.pageTitle}>
            إدارة المستخدمين
          </Text>
          <Text size="sm" c="dimmed">
            إدارة كل المستخدمين المسجلين في المنصة
          </Text>
        </div>
        <Button
          leftSection={<UserPlus size={16} />}
          onClick={handleCreateUser}
        >
          إضافة مستخدم
        </Button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsSection}>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <StatsCard
              title="إجمالي المستخدمين"
              value={stats.total.toString()}
              icon={<Users size={20} />}
              color="primary"
              clickable
              onClick={() => console.log('عرض كل المستخدمين')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <StatsCard
              title="المستخدمين النشطين"
              value={stats.active.toString()}
              icon={<Users size={20} />}
              color="success"
              trend={{
                value: 8,
                direction: 'up',
                label: 'نمو هذا الشهر'
              }}
              clickable
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <StatsCard
              title="المبدعين"
              value={stats.creators.toString()}
              icon={<Shield size={20} />}
              color="info"
              clickable
              onClick={() => setRoleFilter('creator')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <StatsCard
              title="العملاء"
              value={stats.clients.toString()}
              icon={<Users size={20} />}
              color="warning"
              clickable
              onClick={() => setRoleFilter('client')}
            />
          </Grid.Col>
        </Grid>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <Group gap="md">
          <Select
            placeholder="فلترة حسب الدور"
            data={roleOptions}
            value={roleFilter}
            onChange={(value) => setRoleFilter(value || 'all')}
            className={styles.filterSelect}
          />
          <Select
            placeholder="فلترة حسب الحالة"
            data={statusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || 'all')}
            className={styles.filterSelect}
          />
        </Group>
      </div>

      {/* Users Table */}
      <div className={styles.tableSection}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {columns.map((column) => (
                <Table.Th key={column.key}>{column.label}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredUsers.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                  <Text c="dimmed">لا توجد مستخدمين</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredUsers.map((row) => (
                <Table.Tr 
                  key={row.id} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleViewUser(row)}
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

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="تأكيد الحذف"
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            هل أنت متأكد من حذف المستخدم <strong>{userToDelete?.name}</strong>؟
            هذا الإجراء لا يمكن التراجع عنه.
          </Text>
          <Group gap="sm" justify="end">
            <Button 
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button 
              variant="danger"
              onClick={confirmDelete}
            >
              حذف
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
