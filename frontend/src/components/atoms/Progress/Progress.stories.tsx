import type { Meta, StoryObj } from '@storybook/react';
import { Progress, Progress_Ring } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Atoms/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'أشرطة التقدم تُظهر حالة الإنجاز أو حالات التحميل. متوفرة بأشكال خطية ودائرية مع خيارات شاملة للتصميم والألوان.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl', fontFamily: 'Dubai, sans-serif' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'قيمة التقدم من 0 إلى 100',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم شريط التقدم',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
      description: 'لون المظهر',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'زاوية الحدود',
    },
    striped: {
      control: 'boolean',
      description: 'إظهار نمط الخطوط',
    },
    animate: {
      control: 'boolean',
      description: 'تحريك الخطوط',
    },
    label: {
      control: 'text',
      description: 'نص التسمية مع النسبة المئوية',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 65,
    size: 'md',
    color: 'primary',
  },
  parameters: {
    docs: { description: { story: 'شريط التقدم الأساسي مع قيمة 65%.' } }
  }
};

export const WithLabel: Story = {
  args: {
    value: 75,
    size: 'md',
    color: 'primary',
    label: 'تحميل البيانات',
  },
  parameters: {
    docs: { description: { story: 'شريط التقدم مع تسمية توضيحية.' } }
  }
};

export const Sizes: Story = {
  render: () => (
    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress value={45} size="xs" label="صغير جداً" />
      <Progress value={55} size="sm" label="صغير" />
      <Progress value={65} size="md" label="متوسط" />
      <Progress value={75} size="lg" label="كبير" />
      <Progress value={85} size="xl" label="كبير جداً" />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'أحجام مختلفة لأشرطة التقدم مع تسميات عربية.' } }
  }
};

export const Colors: Story = {
  render: () => (
    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress value={60} color="primary" label="أساسي" />
      <Progress value={70} color="secondary" label="ثانوي" />
      <Progress value={80} color="success" label="نجاح" />
      <Progress value={40} color="warning" label="تحذير" />
      <Progress value={30} color="error" label="خطأ" />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'ألوان مختلفة لأشرطة التقدم مع الدلالات البصرية.' } }
  }
};

export const StripedAnimated: Story = {
  render: () => (
    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress value={65} striped label="Striped" />
      <Progress value={75} striped animate label="Animated Stripes" color="success" />
      <Progress value={45} striped animate label="Warning Progress" color="warning" />
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress value={65} radius="xs" label="Extra Small Radius" />
      <Progress value={65} radius="sm" label="Small Radius" />
      <Progress value={65} radius="md" label="Medium Radius" />
      <Progress value={65} radius="lg" label="Large Radius" />
      <Progress value={65} radius="xl" label="Extra Large Radius" />
    </div>
  ),
};

// Ring Progress Stories
export const Ring_Default: StoryObj<typeof Progress_Ring> = {
  args: {
    sections: [{ value: 40, color: 'primary' }],
    size: 120,
    thickness: 12,
    label: '40%',
  },
};

export const Ring_MultiSection: StoryObj<typeof Progress_Ring> = {
  args: {
    sections: [
      { value: 40, color: 'primary' },
      { value: 25, color: 'success' },
      { value: 15, color: 'warning' }
    ],
    size: 120,
    thickness: 12,
    label: '80%',
  },
};

export const Ring_Sizes: StoryObj<typeof Progress_Ring> = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Progress_Ring sections={[{ value: 65 }]} size={80} thickness={8} label="65%" color="primary" />
      <Progress_Ring sections={[{ value: 75 }]} size={120} thickness={12} label="75%" color="success" />
      <Progress_Ring sections={[{ value: 85 }]} size={160} thickness={16} label="85%" color="warning" />
    </div>
  ),
};

export const Ring_Colors: StoryObj<typeof Progress_Ring> = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Progress_Ring sections={[{ value: 65 }]} color="primary" label="Primary" />
      <Progress_Ring sections={[{ value: 75 }]} color="success" label="Success" />
      <Progress_Ring sections={[{ value: 45 }]} color="warning" label="Warning" />
      <Progress_Ring sections={[{ value: 35 }]} color="error" label="Error" />
      <Progress_Ring sections={[{ value: 55 }]} color="secondary" label="Secondary" />
    </div>
  ),
};

export const Ring_CustomLabel: StoryObj<typeof Progress_Ring> = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Progress_Ring 
        sections={[{ value: 75, color: 'success' }]} 
        size={140}
        thickness={14}
        label={
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-family)' }}>
            <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>75%</div>
            <div style={{ fontSize: 'var(--fs-xs)' }}>Complete</div>
          </div>
        } 
      />
      <Progress_Ring 
        sections={[
          { value: 30, color: 'primary' },
          { value: 20, color: 'success' },
          { value: 15, color: 'warning' }
        ]} 
        size={140}
        thickness={14}
        label={
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-family)' }}>
            <div style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)' }}>65%</div>
            <div style={{ fontSize: 'var(--fs-xs)' }}>Multi-task</div>
          </div>
        } 
      />
    </div>
  ),
};
