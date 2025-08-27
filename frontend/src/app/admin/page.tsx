'use client';

import React from 'react';
import { Grid, Title, Text, Group } from '@mantine/core';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';
import { DataTable } from '@/components/molecules/DataTable/DataTable';
import { 
  Users, 
  FileText, 
  Briefcase, 
  DollarSign,
  Activity
} from 'lucide-react';
import styles from './AdminDashboard.module.css';

// بيانات الإحصائيات المؤقتة
const dashboardStats = [
  {
    title: 'طلبات جديدة',
    value: '24',
    icon: <FileText size={24} />,
    trend: {
      value: 12,
      direction: 'up' as const,
      label: 'من الأسبوع الماضي'
    },
    color: 'danger' as const,
  },
  {
    title: 'مشاريع نشطة',
    value: '156',
    icon: <Briefcase size={24} />,
    trend: {
      value: 5,
      direction: 'up' as const,
      label: 'نمو مستمر'
    },
    color: 'primary' as const,
  },
  {
    title: 'مبدعون نشطون',
    value: '89',
    icon: <Users size={24} />,
    trend: {
      value: 8,
      direction: 'up' as const,
      label: 'مبدعون جدد'
    },
    color: 'success' as const,
  },
  {
    title: 'إيرادات الشهر',
    value: '28.45M IQD',
    icon: <DollarSign size={24} />,
    trend: {
      value: 15,
      direction: 'up' as const,
      label: 'نمو ممتاز'
    },
    color: 'success' as const,
  },
];

// بيانات الأنشطة الحديثة
const recentActivities = [
  {
    id: '1042',
    client: 'مطعم البرج',
    type: 'تصوير طعام',
    status: 'جديد',
    time: 'منذ ساعة',
    priority: 'عالية'
  },
  {
    id: '1041',
    client: 'شركة الأمل',
    type: 'فيديو دعائي',
    status: 'مراجعة',
    time: 'منذ 3 ساعات',
    priority: 'متوسطة'
  },
  {
    id: '1040',
    client: 'فندق بابل',
    type: 'تصوير معماري',
    status: 'معتمد',
    time: 'أمس',
    priority: 'منخفضة'
  },
  {
    id: '1039',
    client: 'مركز التجارة',
    type: 'تصوير منتجات',
    status: 'مكتمل',
    time: 'منذ يومين',
    priority: 'منخفضة'
  }
];

// تكوين الجدول
const tableConfig = {
  columns: [
    { key: 'id', label: '#', width: '80px' },
    { key: 'client', label: 'العميل', sortable: true },
    { key: 'type', label: 'نوع الطلب', sortable: true },
    { key: 'status', label: 'الحالة', sortable: true },
    { key: 'time', label: 'الوقت', sortable: true },
    { key: 'priority', label: 'الأولوية', sortable: true }
  ],
  data: recentActivities,
  searchable: true,
  paginated: true,
  pageSize: 5
};

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <Group justify="space-between" align="center">
          <div>
            <Title order={1} className={styles.title}>
              لوحة التحكم الرئيسية
            </Title>
            <Text c="dimmed" className={styles.subtitle}>
              نظرة عامة على نشاطات منصة Depth
            </Text>
          </div>
          <Group>
            <Text size="sm" c="dimmed">
              آخر تحديث: منذ 5 دقائق
            </Text>
            <Activity size={16} />
          </Group>
        </Group>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsSection}>
        <Grid>
          {dashboardStats.map((stat, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
                color={stat.color}
                clickable
                onClick={() => console.log(`تم النقر على ${stat.title}`)}
              />
            </Grid.Col>
          ))}
        </Grid>
      </div>

      {/* Recent Activities Table */}
      <div className={styles.activitiesSection}>
        <Title order={2} mb="md" className={styles.sectionTitle}>
          آخر الأنشطة
        </Title>
        <DataTable
          {...tableConfig}
        />
      </div>
    </div>
  );
}
