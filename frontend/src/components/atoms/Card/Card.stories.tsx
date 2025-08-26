import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardSection } from './Card';
import { Button } from '../Button';
import Loader from '../Loader';
import { 
  User, 
  Settings, 
  Star, 
  Heart,
  MessageCircle,
  MoreVertical,
  Calendar,
  MapPin
} from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون البطاقة - حاوي متعدد الاستخدامات لعرض المحتوى بشكل منظم ومرئي جذاب.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'filled'],
      description: 'نمط البطاقة',
    },
    padding: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'المسافة الداخلية',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'انحناء الزوايا',
    },
    shadow: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم الظل',
    },
    withBorder: {
      control: 'boolean',
      description: 'إظهار الحدود',
    },
    loading: {
      control: 'boolean',
      description: 'حالة التحميل',
    },
    clickable: {
      control: 'boolean',
      description: 'قابلة للنقر',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: 'elevated',
    padding: 'md',
    radius: 'md',
    shadow: 'sm',
    withBorder: true,
    children: 'محتوى البطاقة الافتراضي',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card variant="elevated" padding="lg" style={{ width: 200 }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>بطاقة مرتفعة</h4>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          هذا محتوى تجريبي للبطاقة المرتفعة.
        </p>
      </Card>

      <Card variant="outline" padding="lg" style={{ width: 200 }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>بطاقة محددة</h4>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          هذا محتوى تجريبي للبطاقة المحددة.
        </p>
      </Card>

      <Card variant="filled" padding="lg" style={{ width: 200 }}>
        <h4 style={{ margin: '0 0 0.5rem 0' }}>بطاقة معبأة</h4>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          هذا محتوى تجريبي للبطاقة المعبأة.
        </p>
      </Card>
    </div>
  ),
};

export const WithSections: Story = {
  render: () => (
    <Card style={{ width: 350 }}>
      <CardSection>
        <div style={{ 
          height: '160px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: 500
        }}>
          منطقة الصورة أو المحتوى المرئي
        </div>
      </CardSection>

      <CardSection p="md">
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
          عنوان البطاقة
        </h3>
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', lineHeight: 1.5 }}>
          هذا النص التوضيحي للبطاقة يوضح كيفية استخدام الأقسام المختلفة داخل البطاقة لتنظيم المحتوى بشكل أفضل.
        </p>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm">إجراء رئيسي</Button>
          <Button variant="outline" size="sm">إجراء ثانوي</Button>
        </div>
      </CardSection>
    </Card>
  ),
};

export const UserProfileCard: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <CardSection>
        <div style={{ 
          height: '120px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: 500
        }}>
          صورة الغلاف
        </div>
      </CardSection>

      <CardSection p="md">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            <User size={32} />
          </div>
          
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
              أحمد محمد
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>
              مطور واجهات أمامية
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={14} />
            <span>الرياض، السعودية</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={14} />
            <span>انضم في 2023</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" leftSection={<User size={14} />}>
            عرض الملف الشخصي
          </Button>
          <Button variant="outline" size="sm" leftSection={<MessageCircle size={14} />}>
            إرسال رسالة
          </Button>
        </div>
      </CardSection>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card style={{ width: 280 }}>
      <CardSection>
        <div style={{ 
          height: '200px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: 500
        }}>
          صورة المنتج
        </div>
      </CardSection>

      <CardSection p="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
            اسم المنتج
          </h3>
          <Button variant="outline" size="xs">
            <MoreVertical size={12} />
          </Button>
        </div>
        
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', lineHeight: 1.4 }}>
          وصف مختصر للمنتج يوضح أهم ميزاته والفوائد التي يقدمها للمستخدم.
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            299 ريال
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <Star size={14} />
            <span>4.5 (125)</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button size="sm" fullWidth>
            إضافة للسلة
          </Button>
          <Button variant="outline" size="sm">
            <Heart size={14} />
          </Button>
        </div>
      </CardSection>
    </Card>
  ),
};

export const LoadingCard: Story = {
  render: () => (
    <Card loading style={{ width: 300, height: 200 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%'
      }}>
        <Loader size="lg" />
        <span style={{ fontSize: '0.875rem' }}>جاري تحميل البيانات...</span>
      </div>
    </Card>
  ),
};

export const ClickableCard: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card 
        clickable 
        style={{ width: 250, cursor: 'pointer' }}
        onClick={() => alert('تم النقر على البطاقة!')}
      >
        <CardSection p="md">
          <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={16} />
            بطاقة قابلة للنقر
          </h4>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            انقر على هذه البطاقة لتفعيل الحدث المرتبط بها.
          </p>
        </CardSection>
      </Card>

      <Card style={{ width: 250 }}>
        <CardSection p="md">
          <h4 style={{ margin: '0 0 0.5rem 0' }}>بطاقة عادية</h4>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            هذه بطاقة عادية غير قابلة للنقر.
          </p>
        </CardSection>
      </Card>
    </div>
  ),
};
