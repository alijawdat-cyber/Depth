import type { Meta, StoryObj } from '@storybook/react';
import Badge from '../Badge';
import { Star, Check, X, AlertCircle } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون الشارة - يستخدم لإظهار المعلومات الإضافية أو الحالات بتصميم مدمج وجذاب.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم الشارة',
    },
    variant: {
      control: 'select',
      options: ['light', 'filled', 'outline', 'dot', 'gradient'],
      description: 'نوع الشارة البصري',
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'info', 'gray'],
      description: 'لون الشارة',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'انحناء الحواف',
    },
    fullWidth: {
      control: 'boolean',
      description: 'عرض كامل',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'شارة',
    size: 'sm',
    variant: 'light',
    color: 'primary',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge size="xs">صغير جداً</Badge>
      <Badge size="sm">صغير</Badge>
      <Badge size="md">متوسط</Badge>
      <Badge size="lg">كبير</Badge>
      <Badge size="xl">كبير جداً</Badge>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge variant="light">مضيء</Badge>
      <Badge variant="filled">ممتلئ</Badge>
      <Badge variant="outline">محدد</Badge>
      <Badge variant="dot">نقطة</Badge>
      <Badge variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>تدرج</Badge>
    </div>
  ),
};

export const Colors: Story = {
  args: {
    size: "lg"
  },

  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge color="primary">رئيسي</Badge>
      <Badge color="success">نجاح</Badge>
      <Badge color="warning">تحذير</Badge>
      <Badge color="error">خطأ</Badge>
      <Badge color="info">معلومة</Badge>
      <Badge color="gray">رمادي</Badge>
    </div>
  )
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge leftSection={<Star size={12} />} color="primary">مميز</Badge>
      <Badge leftSection={<Check size={12} />} color="success">مكتمل</Badge>
      <Badge leftSection={<X size={12} />} color="error">مرفوض</Badge>
      <Badge rightSection={<AlertCircle size={12} />} color="warning">تحذير</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge variant="filled" color="success" leftSection={<Check size={12} />}>نشط</Badge>
      <Badge variant="filled" color="error" leftSection={<X size={12} />}>متوقف</Badge>
      <Badge variant="light" color="warning" leftSection={<AlertCircle size={12} />}>في الانتظار</Badge>
      <Badge variant="outline" color="info">قيد المراجعة</Badge>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '200px' }}>
      <Badge fullWidth variant="filled" color="primary">
        شارة بعرض كامل
      </Badge>
    </div>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge radius="xs" variant="filled">حواف حادة</Badge>
      <Badge radius="sm" variant="filled">حواف صغيرة</Badge>
      <Badge radius="md" variant="filled">حواف متوسطة</Badge>
      <Badge radius="lg" variant="filled">حواف كبيرة</Badge>
      <Badge radius="xl" variant="filled">حواف دائرية</Badge>
    </div>
  ),
};

export const GradientBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge 
        variant="gradient" 
        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
        size="md"
      >
        أزرق → سماوي
      </Badge>
      <Badge 
        variant="gradient" 
        gradient={{ from: 'red', to: 'orange', deg: 45 }}
        size="md"
      >
        أحمر → برتقالي
      </Badge>
      <Badge 
        variant="gradient" 
        gradient={{ from: 'green', to: 'lime', deg: 135 }}
        size="md"
      >
        أخضر → ليموني
      </Badge>
      <Badge 
        variant="gradient" 
        gradient={{ from: 'purple', to: 'pink', deg: 180 }}
        size="md"
      >
        بنفسجي → وردي
      </Badge>
    </div>
  ),
};

export const ClickableBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge 
        variant="light" 
        color="primary" 
        onClick={() => alert('تم النقر على الشارة!')}
        style={{ cursor: 'pointer' }}
      >
        انقر هنا
      </Badge>
      <Badge 
        variant="filled" 
        color="success" 
        onClick={() => alert('شارة قابلة للنقر!')}
        style={{ cursor: 'pointer' }}
        leftSection={<Check size={12} />}
      >
        تأكيد
      </Badge>
      <Badge 
        variant="outline" 
        color="warning" 
        onClick={() => alert('تحذير!')}
        style={{ cursor: 'pointer' }}
        rightSection={<AlertCircle size={12} />}
      >
        تحذير
      </Badge>
    </div>
  ),
};

export const NotificationBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem' }}>
          الرسائل
        </button>
        <Badge 
          size="xs" 
          variant="filled" 
          color="error"
          style={{ 
            position: 'absolute', 
            top: '-8px', 
            right: '-8px',
            minWidth: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          5
        </Badge>
      </div>
      
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem' }}>
          الإشعارات
        </button>
        <Badge 
          size="xs" 
          variant="filled" 
          color="primary"
          style={{ 
            position: 'absolute', 
            top: '-8px', 
            right: '-8px',
            minWidth: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          12
        </Badge>
      </div>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem' }}>
          السلة
        </button>
        <Badge 
          variant="dot" 
          color="success"
          style={{ 
            position: 'absolute', 
            top: '0px', 
            right: '0px'
          }}
        />
      </div>
    </div>
  ),
};

export const TagStyleBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="light" color="blue" size="sm">تصميم</Badge>
      <Badge variant="light" color="green" size="sm">تطوير</Badge>
      <Badge variant="light" color="purple" size="sm">برمجة</Badge>
      <Badge variant="light" color="orange" size="sm">إدارة</Badge>
      <Badge variant="light" color="red" size="sm">عاجل</Badge>
      <Badge variant="light" color="teal" size="sm">اختبار</Badge>
      <Badge variant="light" color="pink" size="sm">مراجعة</Badge>
      <Badge variant="light" color="indigo" size="sm">نشر</Badge>
    </div>
  ),
};
