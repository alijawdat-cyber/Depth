import { Admin } from './types';

// ================================
// بيانات الأدمن
// ================================

export const mockAdmins: Admin[] = [
  {
    id: 'sa_001_ali',
    userId: 'u_admin_001',
    adminLevel: 'super_admin',
    fullName: 'علي جواد الربيعي',
    phone: '07701234567',
    permissions: {
      canManageUsers: true,
      canManageProjects: true,
      canManagePayments: true,
      canViewReports: true,
      canManageSettings: true,
      canManageAdmins: true,
    },
    isActive: true,
    lastLoginAt: '2025-08-29T10:30:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-08-29T10:30:00.000Z',
  },
  {
    id: 'ad_002_ahmed',
    userId: 'u_admin_002',
    adminLevel: 'admin',
    fullName: 'أحمد محمد حسن',
    phone: '07809876543',
    addedBy: 'sa_001_ali',
    permissions: {
      canManageUsers: true,
      canManageProjects: true,
      canManagePayments: false,
      canViewReports: true,
      canManageSettings: false,
      canManageAdmins: false,
    },
    isActive: true,
    lastLoginAt: '2025-08-29T09:15:00.000Z',
    createdAt: '2025-03-15T12:00:00.000Z',
    updatedAt: '2025-08-29T09:15:00.000Z',
  },
];
