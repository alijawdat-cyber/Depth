import type { Meta, StoryObj } from '@storybook/react';
import { UserMenu, type UserInfo } from './UserMenu';
import { action } from '@storybook/addon-actions';
import { User, Bell, CreditCard, Moon, LogOut } from 'lucide-react';

const meta: Meta<typeof UserMenu> = {
  title: 'Molecules/UserMenu',
  component: UserMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'قائمة المستخدم المنسدلة مع معلومات الحساب والإعدادات لكل الأدوار.',
      },
    },
  },
  argTypes: {
    isDarkMode: {
      control: 'boolean',
      description: 'حالة الوضع الليلي',
    },
    onThemeToggle: {
      action: 'theme toggled',
      description: 'دالة تغيير النمط',
    },
    onLogout: {
      action: 'logged out',
      description: 'دالة تسجيل الخروج',
    },
    onItemClick: {
      action: 'item clicked',
      description: 'دالة النقر على عنصر القائمة',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// بيانات المستخدمين التجريبية
const adminUser: UserInfo = {
  id: 'admin-1',
  name: 'أحمد العراقي',
  email: 'ahmed@depth.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  role: 'admin',
  plan: 'إدارة كاملة',
  isOnline: true
};

const clientUser: UserInfo = {
  id: 'client-1',
  name: 'سارة محمد',
  email: 'sara@client.com',
  role: 'client',
  plan: 'الباقة الذهبية',
  isOnline: true
};

const creatorUser: UserInfo = {
  id: 'creator-1',
  name: 'علي حسين',
  email: 'ali@creator.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  role: 'creator',
  isOnline: false
};

const salariedUser: UserInfo = {
  id: 'employee-1',
  name: 'فاطمة أحمد',
  email: 'fatima@company.com',
  role: 'salaried',
  plan: 'موظف بدوام كامل',
  isOnline: true
};

// Story أساسي - المدير
export const AdminUserMenu: Story = {
  args: {
    user: adminUser,
    isDarkMode: false,
    onThemeToggle: action('theme-toggled'),
    onLogout: action('logout-clicked'),
    onItemClick: action('item-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'قائمة المدير مع صلاحيات إدارة النظام.',
      },
    },
  },
};

// Story العميل
export const ClientUserMenu: Story = {
  args: {
    user: clientUser,
    isDarkMode: false,
    onThemeToggle: action('theme-toggled'),
    onLogout: action('logout-clicked'),
    onItemClick: action('item-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'قائمة العميل مع إعدادات الحساب والفواتير.',
      },
    },
  },
};

// Story منشئ المحتوى
export const CreatorUserMenu: Story = {
  args: {
    user: creatorUser,
    isDarkMode: false,
    onThemeToggle: action('theme-toggled'),
    onLogout: action('logout-clicked'),
    onItemClick: action('item-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'قائمة منشئ المحتوى مع أدوات مساحة العمل.',
      },
    },
  },
};

// Story الموظف براتب
export const SalariedEmployeeMenu: Story = {
  args: {
    user: salariedUser,
    isDarkMode: false,
    onThemeToggle: action('theme-toggled'),
    onLogout: action('logout-clicked'),
    onItemClick: action('item-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'قائمة الموظف براتب مع أدوات العمل.',
      },
    },
  },
};

// Story الوضع الليلي
export const DarkModeMenu: Story = {
  args: {
    user: adminUser,
    isDarkMode: true,
    onThemeToggle: action('theme-toggled'),
    onLogout: action('logout-clicked'),
    onItemClick: action('item-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'قائمة المستخدم في الوضع الليلي.',
      },
    },
    backgrounds: { default: 'dark' },
  },
};

// Story بدون صورة شخصية
export const WithoutAvatar: Story = {
  args: {
    user: {
      ...clientUser,
      avatar: undefined
    },
    isDarkMode: false,
    onThemeToggle: action('theme-toggled'),
    onLogout: action('logout-clicked'),
    onItemClick: action('item-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'قائمة المستخدم بدون صورة شخصية - تظهر الحرف الأول.',
      },
    },
  },
};

// Story مع عناصر قائمة مخصصة
export const CustomMenuItems: Story = {
  args: {
    user: adminUser,
    isDarkMode: false,
    menuItems: [
      {
        id: 'profile',
        type: 'link',
        label: 'إعدادات الحساب',
        icon: User,
        path: '/account',
        badge: 'جديد'
      },
      {
        id: 'notifications',
        type: 'link',
        label: 'الإشعارات',
        icon: Bell,
        path: '/notifications',
        badge: '12'
      },
      {
        id: 'divider1',
        type: 'divider'
      },
      {
        id: 'billing',
        type: 'link',
        label: 'الفواتير والدفع',
        icon: CreditCard,
        path: '/billing'
      },
      {
        id: 'theme-toggle',
        type: 'toggle',
        label: 'الوضع الليلي',
        icon: Moon,
        checked: false
      },
      {
        id: 'divider2',
        type: 'divider'
      },
      {
        id: 'logout',
        type: 'action',
        label: 'تسجيل الخروج',
        icon: LogOut,
        variant: 'danger'
      }
    ],
    onThemeToggle: action('theme-toggled'),
    onLogout: action('logout-clicked'),
    onItemClick: action('item-clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'قائمة مستخدم مع عناصر مخصصة وشارات.',
      },
    },
  },
};

// Story مقارنة الأدوار
export const RoleComparison: Story = {
  args: {
    user: adminUser,
    isDarkMode: false,
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div>
        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>المدير</h4>
        <UserMenu {...args} user={adminUser} />
      </div>
      <div>
        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>العميل</h4>
        <UserMenu {...args} user={clientUser} />
      </div>
      <div>
        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>المنشئ</h4>
        <UserMenu {...args} user={creatorUser} />
      </div>
      <div>
        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>الموظف</h4>
        <UserMenu {...args} user={salariedUser} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'مقارنة بين قوائم المستخدمين لكل الأدوار.',
      },
    },
  },
};
