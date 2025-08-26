import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون التبديل - يستخدم للتحكم في الحالات الثنائية مثل التشغيل/الإيقاف أو التفعيل/التعطيل.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم المفتاح',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
      description: 'لون المفتاح',
    },
    checked: {
      control: 'boolean',
      description: 'حالة المفتاح',
    },
    disabled: {
      control: 'boolean',
      description: 'تعطيل المفتاح',
    },
    required: {
      control: 'boolean',
      description: 'حقل مطلوب',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    label: 'تفعيل الإشعارات',
    size: 'md',
    color: 'primary',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle size="xs" label="صغير جداً (xs)" defaultChecked />
      <Toggle size="sm" label="صغير (sm)" defaultChecked />
      <Toggle size="md" label="متوسط (md)" defaultChecked />
      <Toggle size="lg" label="كبير (lg)" defaultChecked />
      <Toggle size="xl" label="كبير جداً (xl)" defaultChecked />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle color="primary" label="أساسي" defaultChecked />
      <Toggle color="secondary" label="ثانوي" defaultChecked />
      <Toggle color="success" label="نجاح" defaultChecked />
      <Toggle color="warning" label="تحذير" defaultChecked />
      <Toggle color="error" label="خطأ" defaultChecked />
    </div>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Toggle 
        label="تفعيل الإشعارات" 
        description="ستتلقى إشعارات عن النشاطات الجديدة"
        defaultChecked
      />
      <Toggle 
        label="الوضع المظلم" 
        description="استخدام الوضع المظلم للواجهة"
        color="secondary"
      />
      <Toggle 
        label="المصادقة الثنائية" 
        description="تفعيل طبقة حماية إضافية لحسابك"
        color="success"
        defaultChecked
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Toggle label="مفتاح عادي" />
      <Toggle label="مفتاح مفعل" defaultChecked />
      <Toggle label="مفتاح معطل" disabled />
      <Toggle label="مفتاح معطل ومفعل" disabled defaultChecked />
      <Toggle label="مطلوب" required />
      <Toggle label="مع خطأ" error="يجب تفعيل هذا الخيار" />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Toggle 
        label="الإشعارات"
        description="تفعيل/تعطيل الإشعارات"
        defaultChecked
      />
      
      <Toggle 
        label="الوضع المظلم"
        description="التبديل بين الوضع الفاتح والمظلم"
        color="secondary"
      />
      
      <Toggle 
        label="الحفظ التلقائي"
        description="حفظ التغييرات تلقائياً"
        color="success"
        defaultChecked
      />
    </div>
  ),
};

export const Settings: Story = {
  render: () => (
    <div style={{ 
      padding: '2rem',
      borderRadius: '0.5rem',
      maxWidth: '400px'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
        إعدادات الحساب
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Toggle 
          label="الإشعارات الفورية"
          description="تلقي إشعارات فورية على الهاتف والبريد الإلكتروني"
          defaultChecked
        />
        
        <Toggle 
          label="إشعارات التسويق"
          description="تلقي إشعارات حول العروض والخصومات"
          color="success"
        />
        
        <Toggle 
          label="المشاركة العامة للملف الشخصي"
          description="السماح للآخرين برؤية ملفك الشخصي"
          defaultChecked
        />
        
        <Toggle 
          label="الحفظ التلقائي"
          description="حفظ التغييرات تلقائياً أثناء الكتابة"
          color="secondary"
          defaultChecked
        />
        
        <Toggle 
          label="وضع المطور"
          description="تفعيل الميزات المتقدمة للمطورين"
          color="warning"
        />
      </div>
    </div>
  ),
};

export const FormIntegration: Story = {
  render: () => (
    <form style={{ 
      padding: '2rem',
      borderRadius: '0.5rem',
      maxWidth: '400px'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
        تفضيلات النشر
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Toggle 
          label="نشر فوري"
          description="نشر المحتوى فور إنشائه"
          required
        />
        
        <Toggle 
          label="السماح بالتعليقات"
          description="السماح للمستخدمين بالتعليق على المحتوى"
          defaultChecked
        />
        
        <Toggle 
          label="تفعيل المشاركة"
          description="السماح بمشاركة المحتوى على المنصات الأخرى"
          color="success"
          defaultChecked
        />
        
        <Toggle 
          label="إرسال إشعارات"
          description="إشعار المتابعين عند نشر محتوى جديد"
          color="primary"
        />
      </div>
      
      <button 
        type="submit"
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        حفظ الإعدادات
      </button>
    </form>
  ),
};
