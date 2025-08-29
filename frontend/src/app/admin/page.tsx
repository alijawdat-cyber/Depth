'use client';

import React from 'react';
import { Grid, Table } from '@mantine/core';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';
import { 
  Users, 
  FileText, 
  Briefcase, 
  DollarSign
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

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
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
        <h2 className={styles.sectionTitle}>
          آخر الأنشطة
        </h2>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>النشاط</Table.Th>
              <Table.Th>الوقت</Table.Th>
              <Table.Th>الحالة</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>لا توجد أنشطة حالياً</Table.Td>
              <Table.Td>-</Table.Td>
              <Table.Td>-</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
}
