import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Alert } from './Alert';
import type { AlertProps } from './Alert';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Bell,
  Shield
} from 'lucide-react';

const meta: Meta<typeof Alert> = {
  title: 'Atoms/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
مكون التنبيهات - Alert في Depth يوفر طريقة فعالة لعرض رسائل مهمة للمستخدمين.

## الميزات الرئيسية:
- تصميم عربي مع دعم RTL كامل
- أنواع تنبيهات متعددة (معلومات، نجاح، تحذير، خطأ)
- أشكال مختلفة (فاتح، مملوء، محدد، أبيض)
- إمكانية الإغلاق والتفاعل
- دعم الأيقونات والعناوين
- إمكانية الوصول الكاملة

## أمثلة الاستخدام:
- رسائل النجاح بعد العمليات
- تنبيهات الأخطاء والمشاكل
- معلومات مهمة للمستخدم
- تحذيرات الأمان
- إشعارات النظام
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['light', 'filled', 'outline', 'white'],
      description: 'نمط التنبيه البصري',
    },
    color: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
      description: 'لون التنبيه',
    },
    title: {
      control: 'text',
      description: 'عنوان التنبيه',
    },
    withCloseButton: {
      control: 'boolean',
      description: 'إظهار زر الإغلاق',
    },
  },
  decorators: [
    (Story) => (
      <div dir="rtl" style={{ fontFamily: 'Dubai, sans-serif' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'معلومات',
    color: 'info',
    children: 'هذا تنبيه معلوماتي افتراضي يحتوي على بعض المعلومات المهمة.',
  },
};

export const Success: Story = {
  args: {
    title: 'نجح',
    color: 'success',
    icon: <CheckCircle size={16} />,
    children: 'تمت العملية بنجاح!',
  },
};

export const Warning: Story = {
  args: {
    title: 'تحذير',
    color: 'warning',
    icon: <AlertTriangle size={16} />,
    children: 'يرجى مراجعة المدخلات قبل المتابعة.',
  },
};

export const Error: Story = {
  args: {
    title: 'خطأ',
    color: 'error',
    icon: <AlertCircle size={16} />,
    children: 'حدث خطأ أثناء معالجة طلبك.',
  },
};

export const WithCloseButton: Story = {
  args: {
    title: 'تنبيه قابل للإغلاق',
    color: 'info',
    icon: <Info size={16} />,
    withCloseButton: true,
    children: 'يمكن إغلاق هذا التنبيه بالنقر على زر الإغلاق.',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }} className="space-y-4 w-full max-w-lg">
      {(['light', 'filled', 'outline', 'white'] as const).map((variant) => (
        <Alert
          key={variant}
          variant={variant}
          color="info"
          title={`نمط ${variant === 'light' ? 'فاتح' : variant === 'filled' ? 'مملوء' : variant === 'outline' ? 'محدد' : 'أبيض'}`}
          icon={<Info size={16} />}
        >
          هذا مثال على تنبيه بالنمط {variant === 'light' ? 'الفاتح' : variant === 'filled' ? 'المملوء' : variant === 'outline' ? 'المحدد' : 'الأبيض'}.
        </Alert>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }} className="space-y-4 w-full max-w-lg">
      <Alert
        color="info"
        title="معلومات"
        icon={<Info size={16} />}
      >
        هذه رسالة معلوماتية تحتوي على تفاصيل مفيدة.
      </Alert>
      
      <Alert
        color="success"
        title="نجح"
        icon={<CheckCircle size={16} />}
      >
        تمت العملية بنجاح!
      </Alert>
      
      <Alert
        color="warning"
        title="تحذير"
        icon={<AlertTriangle size={16} />}
      >
        يرجى توخي الحذر ومراجعة المدخلات.
      </Alert>
      
      <Alert
        color="error"
        title="خطأ"
        icon={<AlertCircle size={16} />}
      >
        حدث خطأ ما. يرجى المحاولة مرة أخرى.
      </Alert>
    </div>
  ),
};

// مكون التنبيه القابل للإغلاق
const DismissibleAlert = ({ initialVisible = true, ...props }: { initialVisible?: boolean } & AlertProps) => {
  const [visible, setVisible] = useState(initialVisible);
  
  if (!visible) {
    return (
      <div style={{ direction: 'rtl' }} className="text-center p-4 text-secondary">
        تم إغلاق التنبيه. 
        <button 
          onClick={() => setVisible(true)}
          className="mr-2 text-primary hover:underline"
        >
          إظهار مرة أخرى
        </button>
      </div>
    );
  }
  
  return (
    <Alert
      {...props}
      withCloseButton
      onClose={() => setVisible(false)}
    />
  );
};

export const Dismissible: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <DismissibleAlert
        title="تنبيه قابل للإغلاق"
        color="info"
        icon={<Bell size={16} />}
      >
        يمكن إغلاق هذا التنبيه وإظهاره مرة أخرى لأغراض الاختبار.
      </DismissibleAlert>
    </div>
  ),
};

export const WithoutTitle: Story = {
  args: {
    color: 'success',
    icon: <CheckCircle size={16} />,
    children: 'هذا تنبيه نجاح بدون عنوان، يحتوي فقط على محتوى الرسالة.',
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'تنبيه بسيط',
    color: 'info',
    children: 'هذا التنبيه لا يحتوي على أيقونة، فقط العنوان والرسالة.',
  },
};

export const LongContent: Story = {
  args: {
    title: 'معلومات تفصيلية',
    color: 'info',
    icon: <Info size={16} />,
    withCloseButton: true,
    children: (
      <>
        <p className="mb-2">
          يحتوي هذا التنبيه على رسالة أطول مع فقرات متعددة لتوضيح 
          كيفية تعامل المكون مع المحتوى الأكثر تفصيلاً.
        </p>
        <p className="mb-2">
          يمكنك تضمين أنواع مختلفة من المحتوى داخل التنبيهات، بما في ذلك النصوص 
          والروابط والعناصر المضمنة الأخرى.
        </p>
        <p>
          سيقوم التنبيه بضبط ارتفاعه تلقائياً لاستيعاب جميع المحتويات
          مع الحفاظ على المسافات المناسبة وسهولة القراءة.
        </p>
      </>
    ),
  },
};

export const InFormContext: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }} className="w-full max-w-md space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">تسجيل مستخدم جديد</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">كلمة المرور</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-border rounded-md"
              placeholder="أدخل كلمة المرور"
            />
          </div>
          
          <Alert
            color="warning"
            icon={<Shield size={16} />}
            title="تنبيه أمني"
          >
            يرجى استخدام كلمة مرور قوية تحتوي على 8 أحرف على الأقل، وتشمل أحرف كبيرة وصغيرة وأرقام ورموز خاصة.
          </Alert>
          
          <button className="w-full bg-primary text-primary-contrast px-4 py-2 rounded-md hover:bg-primary-hover">
            تسجيل
          </button>
        </div>
      </div>
    </div>
  ),
};

export const SystemNotifications: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }} className="space-y-3 w-full max-w-lg">
      <Alert
        variant="filled"
        color="success"
        title="تحديث النظام مكتمل"
        icon={<CheckCircle size={16} />}
        withCloseButton
      >
        تم تحديث النظام بنجاح إلى الإصدار 2.1.0.
      </Alert>
      
      <Alert
        variant="outline"
        color="warning"
        title="صيانة مجدولة"
        icon={<AlertTriangle size={16} />}
      >
        صيانة النظام مجدولة غداً في الساعة 2:00 صباحاً بتوقيت غرينتش.
      </Alert>
      
      <Alert
        variant="light"
        color="info"
        title="ميزة جديدة متاحة"
        icon={<Bell size={16} />}
        withCloseButton
      >
        تحقق من ميزة تحليلات لوحة التحكم الجديدة في القائمة الرئيسية.
      </Alert>
    </div>
  ),
};
