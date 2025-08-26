import type { Meta, StoryObj } from '@storybook/react';
import Loader from '../Loader';
import { Button } from '../Button';

const meta: Meta<typeof Loader> = {
  title: 'Atoms/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون التحميل - يستخدم لإظهار حالة التحميل أو المعالجة للمستخدم.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم مؤشر التحميل',
    },
    type: {
      control: 'select',
      options: ['oval', 'bars', 'dots'],
      description: 'نوع الرسوم المتحركة',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {
    size: 'md',
    type: 'oval',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Loader size="xs" />
        <span style={{ fontSize: '0.75rem' }}>صغير جداً (xs)</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Loader size="sm" />
        <span style={{ fontSize: '0.875rem' }}>صغير (sm)</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Loader size="md" />
        <span style={{ fontSize: '0.875rem' }}>متوسط (md)</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Loader size="lg" />
        <span style={{ fontSize: '0.875rem' }}>كبير (lg)</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Loader size="xl" />
        <span style={{ fontSize: '0.875rem' }}>كبير جداً (xl)</span>
      </div>
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <Loader type="oval" size="lg" />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>بيضاوي (oval)</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <Loader type="bars" size="lg" />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>أشرطة (bars)</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <Loader type="dots" size="lg" />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>نقاط (dots)</span>
      </div>
    </div>
  ),
};

export const InlineWithText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Loader size="sm" />
        <span>جاري التحميل...</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Loader size="sm" type="dots" />
        <span>جاري حفظ البيانات...</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Loader size="sm" type="bars" />
        <span>جاري رفع الملف...</span>
      </div>
    </div>
  ),
};

export const InButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button leftSection={<Loader size="xs" />}>
        جاري الحفظ...
      </Button>
      
      <Button 
        variant="outline"
        leftSection={<Loader size="xs" type="dots" />}
      >
        جاري التحميل...
      </Button>
      
      <Button 
        rightSection={<Loader size="xs" type="bars" />}
      >
        جاري الإرسال...
      </Button>
    </div>
  ),
};

export const CenteredFullPage: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      minHeight: '300px',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <Loader size="xl" />
      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
        جاري تحميل البيانات
      </h3>
      <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>
        يرجى الانتظار بينما نحضر المحتوى لك...
      </p>
    </div>
  ),
};

export const WithOverlay: Story = {
  render: () => (
    <div style={{ position: 'relative' }}>
      <div style={{
        padding: '2rem',
        borderRadius: '0.5rem',
        minHeight: '200px',
        opacity: 0.5,
      }}>
        <h3>محتوى الصفحة</h3>
        <p>هذا محتوى تجريبي مع حالة تحميل.</p>
        <Button disabled>بدء التحميل</Button>
      </div>
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        borderRadius: '0.5rem'
      }}>
        <Loader size="lg" />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          جاري المعالجة...
        </span>
      </div>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Loader size="lg" />
        <span style={{ fontSize: '0.75rem' }}>افتراضي</span>
      </div>
    </div>
  ),
};

export const ConditionalLoading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <Loader size="lg" />
      <p style={{ fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>
        مؤشر التحميل يظهر دائماً في هذا المثال
      </p>
    </div>
  ),
};
