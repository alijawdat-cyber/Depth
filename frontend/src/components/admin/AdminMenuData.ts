import { 
  Home, 
  Users, 
  Settings, 
  BarChart3, 
  DollarSign,
  Shield,
  Briefcase,
  Bell,
  ClipboardList
} from 'lucide-react';
import { MenuItem } from '@/components/molecules/AppSidebar/AppSidebar';

// بيانات القائمة الجانبية للإدمن
export const adminMenuData: MenuItem[] = [
  {
    id: 'dashboard',
    type: 'link',
    title: 'لوحة التحكم',
    icon: Home,
    path: '/admin',
    isActive: true,
  },
  {
    id: 'divider-1',
    type: 'divider',
    title: '',
  },
  {
    id: 'users-group',
    type: 'group', 
    title: 'إدارة المستخدمين',
    icon: Users,
    children: [
      {
        id: 'users-list',
        type: 'link',
        title: 'قائمة المستخدمين',
        path: '/admin/users',
        badge: '156',
      },
      {
        id: 'users-creators',
        type: 'link', 
        title: 'المبدعون',
        path: '/admin/users/creators',
        badge: '89',
      },
      {
        id: 'users-clients',
        type: 'link',
        title: 'العملاء',
        path: '/admin/users/clients', 
        badge: '67',
      }
    ]
  },
  {
    id: 'requests-group',
    type: 'group',
    title: 'إدارة الطلبات',
    icon: ClipboardList,
    children: [
      {
        id: 'requests-new',
        type: 'link',
        title: 'طلبات جديدة',
        path: '/admin/requests/new',
        badge: '24',
        isNew: true,
      },
      {
        id: 'requests-active',
        type: 'link',
        title: 'طلبات نشطة', 
        path: '/admin/requests/active',
        badge: '45',
      },
      {
        id: 'requests-assignment',
        type: 'link',
        title: 'تعيين المبدعين',
        path: '/admin/requests/assignment',
      }
    ]
  },
  {
    id: 'projects',
    type: 'link',
    title: 'إدارة المشاريع',
    icon: Briefcase,
    path: '/admin/projects',
    badge: '156',
  },
  {
    id: 'divider-2', 
    type: 'divider',
    title: '',
  },
  {
    id: 'financial-group',
    type: 'group',
    title: 'المالية والتسعير',
    icon: DollarSign,
    children: [
      {
        id: 'pricing',
        type: 'link',
        title: 'التسعير والهوامش',
        path: '/admin/pricing',
      },
      {
        id: 'payments',
        type: 'link',
        title: 'المدفوعات',
        path: '/admin/payments',
        badge: '12',
      },
      {
        id: 'invoices',
        type: 'link', 
        title: 'الفواتير',
        path: '/admin/invoices',
        badge: '8',
      }
    ]
  },
  {
    id: 'reports-group',
    type: 'group',
    title: 'التقارير والتحليلات',
    icon: BarChart3,
    children: [
      {
        id: 'analytics',
        type: 'link',
        title: 'التحليلات',
        path: '/admin/analytics',
      },
      {
        id: 'reports',
        type: 'link',
        title: 'التقارير',
        path: '/admin/reports',
      }
    ]
  },
  {
    id: 'divider-3',
    type: 'divider', 
    title: '',
  },
  {
    id: 'notifications',
    type: 'link',
    title: 'الإشعارات',
    icon: Bell,
    path: '/admin/notifications',
    badge: '3',
    isNew: true,
  },
  {
    id: 'settings',
    type: 'link',
    title: 'إعدادات النظام',
    icon: Settings,
    path: '/admin/settings',
  },
  {
    id: 'admins',
    type: 'link',
    title: 'إدارة الأدمنز',
    icon: Shield,
    path: '/admin/admins',
    roles: ['admin'], // Super Admin only
  }
];
