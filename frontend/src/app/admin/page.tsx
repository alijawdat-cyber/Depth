'use client';

import React from 'react';
import { Table } from '@mantine/core';
import { StatsCard } from '@/components/molecules/StatsCard/StatsCard';
import { 
  Users, 
  FileText, 
  Briefcase,
  DollarSign
} from 'lucide-react';

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
    <div className="pageContainer">
      {/* Stats Cards */}
      <div className="grid gridCols4 gridGapLg mbXl">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="colSpan1">
            <StatsCard
              key={index}
              {...stat}
              clickable
              onClick={() => console.log(`Clicked on ${stat.title}`)}
            />
          </div>
        ))}
      </div>

      {/* Recent Activities Table */}
      <div className="card">
        <h2 className="pageTitle mbMd">
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
