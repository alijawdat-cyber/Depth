import type { Meta, StoryObj } from '@storybook/react';
import StatsCard from './StatsCard';
import { Users as UsersIcon, DollarSign, TrendingUp, FileText, Clock, CheckCircle } from 'lucide-react';

const meta = {
  title: 'Molecules/StatsCard',
  component: StatsCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'مكون بطاقة الإحصائيات موحد لعرض البيانات والمقاييس الهامة عبر كل الأدوار. يدعم الألوان المختلفة والاتجاهات والأيقونات.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'عنوان الإحصائية',
    },
    value: {
      control: 'text',
      description: 'القيمة الرئيسية (رقم أو نص)',
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'info', 'neutral'],
      description: 'لون البطاقة',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'حجم البطاقة',
    },
    clickable: {
      control: 'boolean',
      description: 'هل البطاقة قابلة للنقر؟',
    },
    loading: {
      control: 'boolean',
      description: 'حالة التحميل',
    },
    onClick: {
      action: 'clicked',
      description: 'دالة النقر على البطاقة',
    },
  },
} satisfies Meta<typeof StatsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story أساسية - المستخدمين
export const UsersStats: Story = {
  args: {
    title: 'إجمالي المستخدمين',
    value: '2,847',
    icon: <UsersIcon size={20} />,
    color: 'primary',
    trend: {
      value: 12.5,
      direction: 'up',
      label: 'هذا الشهر',
    },
    description: 'عدد المستخدمين المسجلين في النظام',
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال على بطاقة إحصائية لعدد المستخدمين مع اتجاه إيجابي.',
      },
    },
  },
};

// Story للمشاريع النشطة
export const ActiveProjects: Story = {
  args: {
    title: 'المشاريع النشطة',
    value: 45,
    icon: <FileText size={20} />,
    color: 'success',
    trend: {
      value: 8.3,
      direction: 'up',
      label: 'مقارنة بالأسبوع الماضي',
    },
    description: 'المشاريع قيد التنفيذ حالياً',
  },
  parameters: {
    docs: {
      description: {
        story: 'بطاقة للمشاريع النشطة باللون الأخضر للدلالة على النشاط.',
      },
    },
  },
};

// Story للإيرادات
export const Revenue: Story = {
  args: {
    title: 'الإيرادات الشهرية',
    value: '156,890 د.ع',
    icon: <DollarSign size={20} />,
    color: 'success',
    trend: {
      value: -5.2,
      direction: 'down',
      label: 'مقارنة بالشهر الماضي',
    },
    description: 'إجمالي الإيرادات المحققة هذا الشهر',
    clickable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'بطاقة الإيرادات مع اتجاه سلبي وقابلة للنقر لإظهار التفاصيل.',
      },
    },
  },
};

// Story للمهام المعلقة
export const PendingTasks: Story = {
  args: {
    title: 'المهام المعلقة',
    value: 23,
    icon: <Clock size={20} />,
    color: 'warning',
    trend: {
      value: 0,
      direction: 'neutral',
      label: 'لا تغيير',
    },
    description: 'المهام التي تتطلب انتباه فوري',
  },
  parameters: {
    docs: {
      description: {
        story: 'بطاقة تحذيرية للمهام المعلقة مع اتجاه محايد.',
      },
    },
  },
};

// Story للمهام المكتملة
export const CompletedTasks: Story = {
  args: {
    title: 'مهام مكتملة',
    value: '187',
    icon: <CheckCircle size={20} />,
    color: 'success',
    description: 'إجمالي المهام المكتملة هذا الأسبوع',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'بطاقة كبيرة للمهام المكتملة بدون اتجاه.',
      },
    },
  },
};

// Story خطيرة - أخطاء النظام
export const SystemErrors: Story = {
  args: {
    title: 'أخطاء النظام',
    value: 7,
    icon: <TrendingUp size={20} />,
    color: 'danger',
    trend: {
      value: 40,
      direction: 'up',
      label: 'اليوم',
    },
    description: 'أخطاء تتطلب تدخل فني عاجل',
    clickable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'بطاقة خطر للأخطاء النظام مع زيادة في العدد.',
      },
    },
  },
};

// Story صغيرة
export const SmallCard: Story = {
  args: {
    title: 'اليوم',
    value: '12',
    color: 'info',
    size: 'sm',
    description: 'طلبات جديدة',
  },
  parameters: {
    docs: {
      description: {
        story: 'بطاقة صغيرة الحجم بتصميم مدمج.',
      },
    },
  },
};

// Story بدون أيقونة
export const WithoutIcon: Story = {
  args: {
    title: 'معدل النجاح',
    value: '98.7%',
    color: 'success',
    trend: {
      value: 2.1,
      direction: 'up',
      label: 'تحسن مستمر',
    },
    description: 'نسبة نجاح العمليات',
  },
  parameters: {
    docs: {
      description: {
        story: 'بطاقة بدون أيقونة مع التركيز على النسبة المئوية.',
      },
    },
  },
};

// Story لحالة التحميل
export const LoadingState: Story = {
  args: {
    title: 'جاري التحميل...',
    value: '---',
    color: 'neutral',
    loading: true,
    description: 'البيانات قيد التحميل',
  },
  parameters: {
    docs: {
      description: {
        story: 'حالة التحميل مع skeleton effect.',
      },
    },
  },
};

// Story مجموعة بطاقات - Dashboard Admin
export const AdminDashboard: Story = {
  args: {
    title: "لوحة تحكم الادمن",
    value: "متعدد"
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', maxWidth: '1200px' }}>
      <StatsCard
        title="إجمالي المستخدمين"
        value="2,847"
        icon={<UsersIcon size={20} />}
        color="primary"
        trend={{ value: 12.5, direction: 'up', label: 'هذا الشهر' }}
        clickable
      />
      <StatsCard
        title="المشاريع النشطة"
        value={45}
        icon={<FileText size={20} />}
        color="success"
        trend={{ value: 8.3, direction: 'up', label: 'هذا الأسبوع' }}
        clickable
      />
      <StatsCard
        title="عروض أسعار معلقة"
        value={12}
        icon={<Clock size={20} />}
        color="warning"
        trend={{ value: -15, direction: 'down', label: 'انخفاض' }}
        clickable
      />
      <StatsCard
        title="الإيرادات الشهرية"
        value="156,890 د.ع"
        icon={<DollarSign size={20} />}
        color="success"
        trend={{ value: -5.2, direction: 'down', label: 'مقارنة بالشهر الماضي' }}
        clickable
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'مثال على لوحة تحكم الادمن مع 4 بطاقات إحصائيات رئيسية.',
      },
    },
  },
};

// Story مجموعة بطاقات - Dashboard Client
export const ClientDashboard: Story = {
  args: {
    title: "لوحة تحكم العميل",
    value: "متعدد"
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', maxWidth: '800px' }}>
      <StatsCard
        title="مشاريعي الحالية"
        value={3}
        icon={<FileText size={20} />}
        color="primary"
        clickable
      />
      <StatsCard
        title="طلبات الاقتباس"
        value={7}
        icon={<Clock size={20} />}
        color="warning"
        trend={{ value: 2, direction: 'up', label: 'طلبات جديدة' }}
        clickable
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'مثال على لوحة تحكم العميل مع بطاقتين للمشاريع والطلبات.',
      },
    },
  },
};
