import type { Meta, StoryObj } from '@storybook/react';
import { AppSidebar, type MenuItem } from './AppSidebar';
import { 
  Home, 
  Users, 
  BarChart3, 
  DollarSign,
  Briefcase,
  MessageSquare
} from 'lucide-react';

const meta: Meta<typeof AppSidebar> = {
  title: 'Molecules/AppSidebar',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'مكون الشريط الجانبي الموحد لكل أدوار المستخدمين مع إمكانية التخصيص والتنقل.',
      },
    },
  },
  argTypes: {
    userRole: {
      control: { type: 'select' },
      options: ['admin', 'client', 'creator', 'salaried'],
      description: 'دور المستخدم الحالي',
    },
    isOpen: {
      control: 'boolean',
      description: 'حالة فتح/إغلاق الشريط الجانبي',
    },
    onItemClick: {
      action: 'item clicked',
      description: 'دالة النقر على عنصر القائمة',
    },
    onClose: {
      action: 'sidebar closed',
      description: 'دالة إغلاق الشريط الجانبي',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story أساسي - Admin
export const AdminSidebar: Story = {
  args: {
    userRole: 'admin',
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'الشريط الجانبي للمدير مع كامل الصلاحيات والمجموعات.',
      },
    },
  },
};

// Story العميل
export const ClientSidebar: Story = {
  args: {
    userRole: 'client',
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'الشريط الجانبي للعميل مع القوائم المخصصة له.',
      },
    },
  },
};

// Story منشئ المحتوى
export const CreatorSidebar: Story = {
  args: {
    userRole: 'creator',
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'الشريط الجانبي لمنشئ المحتوى مع أدوات العمل.',
      },
    },
  },
};

// Story الموظف براتب
export const SalariedEmployeeSidebar: Story = {
  args: {
    userRole: 'salaried',
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'الشريط الجانبي للموظف براتب مع المهام والوقت.',
      },
    },
  },
};

// Story مع قائمة مخصصة
export const CustomMenuItems: Story = {
  args: {
    userRole: 'admin',
    isOpen: true,
    items: [
      {
        id: 'dashboard',
        type: 'link',
        title: 'الرئيسية',
        icon: Home,
        path: '/dashboard',
        isActive: true,
        roles: ['admin']
      },
      {
        id: 'divider1',
        type: 'divider',
        title: '',
        roles: ['admin']
      },
      {
        id: 'analytics-group',
        type: 'group',
        title: 'التحليلات والتقارير',
        icon: BarChart3,
        roles: ['admin'],
        children: [
          {
            id: 'reports',
            type: 'link',
            title: 'التقارير المالية',
            icon: DollarSign,
            path: '/reports/financial',
            badge: '5',
            roles: ['admin']
          },
          {
            id: 'analytics',
            type: 'link',
            title: 'تحليل المستخدمين',
            icon: Users,
            path: '/analytics/users',
            roles: ['admin']
          }
        ]
      },
      {
        id: 'projects',
        type: 'link',
        title: 'المشاريع',
        icon: Briefcase,
        path: '/projects',
        badge: 'جديد',
        isNew: true,
        roles: ['admin']
      }
    ] as MenuItem[]
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال على شريط جانبي بقائمة مخصصة مع مجموعات وشارات.',
      },
    },
  },
};

// Story الحالة المغلقة
export const ClosedSidebar: Story = {
  args: {
    userRole: 'client',
    isOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'الشريط الجانبي في الحالة المغلقة - مفيد للجوال.',
      },
    },
  },
};

// Story مع عناصر نشطة
export const WithActiveItems: Story = {
  args: {
    userRole: 'admin',
    isOpen: true,
    items: [
      {
        id: 'dashboard',
        type: 'link',
        title: 'لوحة التحكم',
        icon: Home,
        path: '/dashboard',
        roles: ['admin']
      },
      {
        id: 'users',
        type: 'link',
        title: 'المستخدمين',
        icon: Users,
        path: '/users',
        isActive: true,
        badge: '24',
        roles: ['admin']
      },
      {
        id: 'messages',
        type: 'link',
        title: 'الرسائل',
        icon: MessageSquare,
        path: '/messages',
        badge: 'جديد',
        isNew: true,
        roles: ['admin']
      }
    ] as MenuItem[]
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال على عناصر نشطة مع شارات وحالات مختلفة.',
      },
    },
  },
};

// Story للمقارنة بين الأدوار
export const RoleComparison: Story = {
  args: {
    userRole: 'admin',
    isOpen: true,
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '20px', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>المدير</h3>
        <AppSidebar {...args} userRole="admin" />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>العميل</h3>
        <AppSidebar {...args} userRole="client" />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>المنشئ</h3>
        <AppSidebar {...args} userRole="creator" />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>الموظف</h3>
        <AppSidebar {...args} userRole="salaried" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'مقارنة بين الأشرطة الجانبية لكل الأدوار.',
      },
    },
  },
};
