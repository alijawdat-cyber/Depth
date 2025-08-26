import type { Meta, StoryObj } from '@storybook/react';
import Avatar from '../Avatar';
import { User, Settings, Camera } from 'lucide-react';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون الصورة الشخصية - يستخدم لإظهار صور المستخدمين مع دعم للأحرف الأولى والأيقونات الافتراضية.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم الصورة الشخصية',
    },
    variant: {
      control: 'select',
      options: ['filled', 'light', 'outline', 'transparent', 'gradient'],
      description: 'نوع الصورة الشخصية البصري',
    },
    color: {
      control: 'color',
      description: 'لون خلفية الصورة الشخصية للحالة الافتراضية',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'انحناء الحواف',
    },
    name: {
      control: 'text',
      description: 'اسم المستخدم لتوليد الأحرف الأولى',
    },
    initials: {
      control: 'text',
      description: 'أحرف أولى مخصصة',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: 'أحمد محمد',
    size: 'md',
    variant: 'light',
    color: 'blue',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    alt: 'صورة المستخدم',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar size="xs" name="أحمد محمد" />
      <Avatar size="sm" name="فاطمة علي" />
      <Avatar size="md" name="محمد يوسف" />
      <Avatar size="lg" name="عائشة حسن" />
      <Avatar size="xl" name="علي أحمد" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar variant="filled" name="أحمد محمد" color="blue" />
      <Avatar variant="light" name="فاطمة علي" color="green" />
      <Avatar variant="outline" name="محمد يوسف" color="red" />
      <Avatar variant="transparent" name="عائشة حسن" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar name="أحمد محمد" color="blue" />
      <Avatar name="فاطمة علي" color="green" />
      <Avatar name="محمد يوسف" color="red" />
      <Avatar name="عائشة حسن" color="orange" />
      <Avatar name="علي أحمد" color="purple" />
      <Avatar name="نورا سالم" color="pink" />
    </div>
  ),
};

export const WithInitials: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar initials="ام" color="blue" />
      <Avatar initials="فع" color="green" />
      <Avatar initials="مي" color="red" />
      <Avatar initials="عح" color="orange" />
    </div>
  ),
};

export const WithCustomPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar placeholder={<User size={20} />} color="blue" />
      <Avatar placeholder={<Settings size={20} />} color="green" />
      <Avatar placeholder={<Camera size={20} />} color="red" />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    name: 'أحمد محمد',
    size: 'lg',
    onClick: () => alert('تم النقر على الصورة الشخصية!'),
  },
  render: (args) => (
    <div style={{ textAlign: 'center' }}>
      <Avatar {...args} />
      <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
        انقر على الصورة الشخصية
      </p>
    </div>
  ),
};

export const BrokenImage: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar 
        src="broken-image-url.jpg" 
        name="أحمد محمد"
        onError={() => console.log('فشل تحميل الصورة')}
      />
      <Avatar 
        src="another-broken-url.jpg"
        placeholder={<User size={20} />}
        color="blue"
      />
    </div>
  ),
};
