import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, Skeleton_Text, Skeleton_Circle } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'مكونات السكلتون توفر عناصر نائبة أثناء التحميل تحاكي شكل المحتوى الفعلي. متوفرة بأشكال أساسية ونصية ودائرية.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl', fontFamily: 'Dubai, sans-serif', width: '100%', maxWidth: '600px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    height: {
      control: 'text',
      description: 'ارتفاع السكلتون',
    },
    width: {
      control: 'text',
      description: 'عرض السكلتون',
    },
    animate: {
      control: 'boolean',
      description: 'هل يتحرك السكلتون',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'زاوية الحدود',
    },
    visible: {
      control: 'boolean',
      description: 'هل السكلتون مرئي',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    height: 20,
    width: '100%',
    animate: true,
    radius: 'sm',
    visible: true,
  },
  parameters: {
    docs: { description: { story: 'السكلتون الأساسي مع الحركة.' } }
  }
};

export const WithContent: Story = {
  args: {
    height: 20,
    width: '100%',
    animate: true,
    visible: false,
    children: 'هذا هو المحتوى الفعلي الذي يظهر عند اكتمال التحميل',
  },
  parameters: {
    docs: { description: { story: 'السكلتون مع المحتوى الفعلي عند الانتهاء من التحميل.' } }
  }
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <div style={{ fontSize: 'var(--fs-sm)', marginBottom: '8px' }}>أحجام مختلفة:</div>
      <Skeleton height={10} animate={true} visible={true} />
      <Skeleton height={20} animate={true} visible={true} />
      <Skeleton height={30} animate={true} visible={true} />
      <Skeleton height={40} animate={true} visible={true} />
      <Skeleton height={50} animate={true} visible={true} />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'أحجام مختلفة للسكلتون من الصغير للكبير.' } }
  }
};

export const Widths: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <Skeleton height={20} width="100%" />
      <Skeleton height={20} width="75%" />
      <Skeleton height={20} width="50%" />
      <Skeleton height={20} width="25%" />
      <Skeleton height={20} width={200} />
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <Skeleton height={30} radius="xs" />
      <Skeleton height={30} radius="sm" />
      <Skeleton height={30} radius="md" />
      <Skeleton height={30} radius="lg" />
      <Skeleton height={30} radius="xl" />
    </div>
  ),
};

export const NoAnimation: Story = {
  args: {
    height: 30,
    width: '100%',
    animate: false,
    radius: 'sm',
  },
};

// Text Skeleton Stories
export const Text_Default: StoryObj<typeof Skeleton_Text> = {
  args: {
    lines: 3,
    animate: true,
    visible: true,
  },
};

export const Text_Lines: StoryObj<typeof Skeleton_Text> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      <div>
        <h4 style={{ marginBottom: '8px', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>1 Line</h4>
        <Skeleton_Text lines={1} />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>3 Lines</h4>
        <Skeleton_Text lines={3} />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>5 Lines</h4>
        <Skeleton_Text lines={5} />
      </div>
    </div>
  ),
};

export const Text_WithContent: StoryObj<typeof Skeleton_Text> = {
  args: {
    lines: 3,
    visible: false,
    children: (
      <div>
        <p>This is the actual text content that appears when loading is complete.</p>
        <p>It can be multiple paragraphs or any other text-based content.</p>
        <p>The skeleton will automatically match the expected layout.</p>
      </div>
    ),
  },
};

// Circle Skeleton Stories  
export const Circle_Default: StoryObj<typeof Skeleton_Circle> = {
  args: {
    size: 40,
    animate: true,
    visible: true,
  },
};

export const Circle_Sizes: StoryObj<typeof Skeleton_Circle> = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <Skeleton_Circle size={24} />
      <Skeleton_Circle size={32} />
      <Skeleton_Circle size={40} />
      <Skeleton_Circle size={56} />
      <Skeleton_Circle size={72} />
      <Skeleton_Circle size={96} />
    </div>
  ),
};

export const Circle_WithContent: StoryObj<typeof Skeleton_Circle> = {
  args: {
    size: 48,
    visible: false,
    children: (
      <div style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: 'var(--fs-lg)',
        fontWeight: 'var(--fw-bold)'
      }}>
        JD
      </div>
    ),
  },
};

// Combined Layout Examples
export const CardLayout: Story = {
  render: () => (
    <div style={{ width: '320px', padding: '16px', borderRadius: 'var(--radius-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <Skeleton_Circle size={48} />
        <div style={{ flex: 1 }}>
          <Skeleton height="16px" width="60%" style={{ marginBottom: '8px' }} />
          <Skeleton height="12px" width="40%" />
        </div>
      </div>
      
      <Skeleton height="200px" width="100%" radius="md" style={{ marginBottom: '16px' }} />
      
      <Skeleton_Text lines={3} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <Skeleton height="32px" width="80px" radius="md" />
        <Skeleton height="32px" width="32px" radius="md" />
      </div>
    </div>
  ),
};

export const ListLayout: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '12px 0',
          borderBottom: index < 3 ? '1px solid var(--color-neutral-200)' : 'none'
        }}>
          <Skeleton_Circle size={40} />
          <div style={{ flex: 1 }}>
            <Skeleton height="14px" width="70%" style={{ marginBottom: '6px' }} />
            <Skeleton height="12px" width="50%" />
          </div>
          <Skeleton height="24px" width="60px" radius="sm" />
        </div>
      ))}
    </div>
  ),
};
