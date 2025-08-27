import type { Meta, StoryObj } from '@storybook/react';
import AppHeader from './AppHeader';

const meta = {
  title: 'Molecules/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'مكون Header موحد للتطبيق يستخدم عبر كل الأدوار (Admin, Client, Creator, Salaried). يحتوي على الشعار والعنوان وقائمة المستخدم والإشعارات.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'عنوان التطبيق الظاهر في الهيدر',
    },
    userName: {
      control: 'text',
      description: 'اسم المستخدم',
    },
    userEmail: {
      control: 'text',
      description: 'ايميل المستخدم',
    },
    userCompany: {
      control: 'text',
      description: 'اسم الشركة',
    },
    notifications: {
      control: 'number',
      description: 'عدد الإشعارات غير المقروءة',
    },
    hideBurger: {
      control: 'boolean',
      description: 'إخفاء زر القائمة الجانبية',
    },
    onMenuClick: {
      action: 'menu clicked',
      description: 'وظيفة فتح القائمة الجانبية',
    },
    onNotificationsClick: {
      action: 'notifications clicked',
      description: 'وظيفة فتح الإشعارات',
    },
    onLogout: {
      action: 'logout clicked',
      description: 'وظيفة تسجيل الخروج',
    },
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story أساسية - Admin
export const AdminHeader: Story = {
  args: {
    title: 'لوحة تحكم الادمن',
    userName: 'أحمد المدير',
    userEmail: 'admin@depth.com',
    userCompany: 'منصة Depth',
    notifications: 3,
    hideBurger: false,
    onMenuClick: () => console.log('فتح القائمة الجانبية'),
    onNotificationsClick: () => console.log('فتح الإشعارات'),
    onLogout: () => console.log('تسجيل خروج الادمن'),
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال على header الادمن مع إشعارات وقائمة مستخدم كاملة.',
      },
    },
  },
};

// Story للعميل
export const ClientHeader: Story = {
  args: {
    title: 'لوحة العميل',
    userName: 'سارة العميلة',
    userEmail: 'sara@company.com',
    userCompany: 'شركة الأمل',
    notifications: 5,
    hideBurger: false,
    onMenuClick: () => console.log('فتح قائمة العميل'),
    onNotificationsClick: () => console.log('إشعارات العميل'),
    onLogout: () => console.log('خروج العميل'),
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال على header العميل مع عدد إشعارات أكبر.',
      },
    },
  },
};

// Story للمبدع
export const CreatorHeader: Story = {
  args: {
    title: 'لوحة المبدع',
    userName: 'محمد المصور',
    userEmail: 'mohammed@creator.com',
    userCompany: 'استوديو الإبداع',
    notifications: 2,
    hideBurger: false,
    onMenuClick: () => console.log('فتح قائمة المبدع'),
    onNotificationsClick: () => console.log('إشعارات المبدع'),
    onLogout: () => console.log('خروج المبدع'),
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال على header المبدع مع معلومات الاستوديو.',
      },
    },
  },
};

// Story للموظف المرتب
export const SalariedHeader: Story = {
  args: {
    title: 'مهامي اليوم',
    userName: 'علي الموظف',
    userEmail: 'ali@depth.com',
    userCompany: 'منصة Depth',
    notifications: 1,
    hideBurger: false,
    onMenuClick: () => console.log('فتح قائمة الموظف'),
    onNotificationsClick: () => console.log('إشعارات الموظف'),
    onLogout: () => console.log('خروج الموظف'),
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال على header الموظف المرتب مع عنوان خاص بالمهام.',
      },
    },
  },
};

// Story بدون إشعارات
export const NoNotifications: Story = {
  args: {
    title: 'لوحة التحكم',
    userName: 'المستخدم الجديد',
    userEmail: 'user@example.com',
    notifications: 0,
    hideBurger: false,
    onMenuClick: () => console.log('فتح القائمة'),
    onLogout: () => console.log('تسجيل الخروج'),
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال على header بدون إشعارات وبدون شركة.',
      },
    },
  },
};

// Story بدون زر القائمة
export const WithoutBurger: Story = {
  args: {
    title: 'صفحة بسيطة',
    userName: 'المستخدم',
    userEmail: 'user@site.com',
    userCompany: 'الشركة',
    notifications: 0,
    hideBurger: true,
    onLogout: () => console.log('تسجيل الخروج'),
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال على header بدون زر القائمة الجانبية (للصفحات المستقلة).',
      },
    },
  },
};

// Story مع إجراءات مخصصة
export const WithCustomActions: Story = {
  args: {
    title: 'لوحة متقدمة',
    userName: 'المدير المتقدم',
    userEmail: 'advanced@admin.com',
    userCompany: 'شركة التقنية',
    notifications: 7,
    hideBurger: false,
    actions: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className="btn-primary"
          onClick={() => console.log('إجراء مخصص 1')}
        >
          إجراء مخصص
        </button>
        <button 
          className="btn-secondary"
          onClick={() => console.log('إجراء مخصص 2')}
        >
          تصدير
        </button>
        <style jsx>{`
          .btn-primary {
            background: var(--color-action-primary-bg);
            color: var(--color-action-primary-fg);
            border: none;
            border-radius: var(--radius-sm);
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
          }
          .btn-secondary {
            background: var(--color-action-secondary-bg);
            color: var(--color-action-secondary-fg);
            border: 1px solid var(--color-bd-default);
            border-radius: var(--radius-sm);
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
          }
        `}</style>
      </div>
    ),
    onMenuClick: () => console.log('فتح القائمة'),
    onNotificationsClick: () => console.log('فتح الإشعارات'),
    onLogout: () => console.log('تسجيل الخروج'),
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال على header مع إجراءات إضافية مخصصة (أزرار، قوائم، إلخ).',
      },
    },
  },
};

// Story للاختبار على الموبايل
export const MobileView: Story = {
  args: {
    title: 'تطبيق الجوال',
    userName: 'مستخدم الموبايل',
    userEmail: 'mobile@user.com',
    userCompany: 'شركة الموبايل',
    notifications: 12,
    hideBurger: false,
    onMenuClick: () => console.log('فتح قائمة الموبايل'),
    onNotificationsClick: () => console.log('إشعارات الموبايل'),
    onLogout: () => console.log('خروج الموبايل'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'مثال على header في عرض الموبايل - يظهر زر القائمة ويخفي تفاصيل المستخدم.',
      },
    },
  },
};
