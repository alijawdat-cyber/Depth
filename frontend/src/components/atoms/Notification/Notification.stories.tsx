import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Notification } from './Notification';
import type { NotificationProps } from './Notification';
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Bell,
  Mail,
  Download
} from 'lucide-react';

const meta: Meta<typeof Notification> = {
  title: 'Atoms/Notification',
  component: Notification,
  parameters: {
    layout: 'centered',
    direction: 'rtl', // دعم RTL
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
      description: 'لون الإشعار',
    },
    title: {
      control: 'text',
      description: 'عنوان الإشعار',
    },
    withCloseButton: {
      control: 'boolean',
      description: 'إظهار زر الإغلاق',
    },
    autoClose: {
      control: { type: 'number', min: 0, max: 10000, step: 500 },
      description: 'الإغلاق التلقائي بالميلي ثانية',
    },
    loading: {
      control: 'boolean',
      description: 'حالة التحميل',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// مكون الإشعار المتفاعل
const InteractiveNotification = ({ initialVisible = true, ...props }: { initialVisible?: boolean } & Partial<NotificationProps>) => {
  const [visible, setVisible] = useState(initialVisible);
  
  if (!visible) {
    return (
      <div className="text-center p-4" style={{ direction: 'rtl' }}>
        <span className="text-secondary">تم إغلاق الإشعار.</span>
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
    <div style={{ direction: 'rtl' }}>
      <Notification
        {...props}
        onClose={() => setVisible(false)}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    title: 'معلومات مهمة',
    color: 'info',
    children: 'هذا إشعار معلوماتي يحتوي على تفاصيل مهمة للمستخدم.',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const Success: Story = {
  args: {
    title: 'تم بنجاح',
    color: 'success',
    icon: <CheckCircle size={16} />,
    children: 'تم إتمام العملية بنجاح!',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const Warning: Story = {
  args: {
    title: 'تحذير',
    color: 'warning',
    icon: <AlertTriangle size={16} />,
    children: 'يرجى مراجعة البيانات قبل المتابعة.',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const Error: Story = {
  args: {
    title: 'خطأ',
    color: 'error',
    icon: <AlertCircle size={16} />,
    children: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithAutoClose: Story = {
  render: () => (
    <InteractiveNotification
      title="إشعار تلقائي الإغلاق"
      color="info"
      icon={<Bell size={16} />}
      autoClose={3000}
      withCloseButton
    >
      سيتم إغلاق هذا الإشعار تلقائياً خلال 3 ثواني.
    </InteractiveNotification>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-lg" style={{ direction: 'rtl' }}>
      <Notification
        color="info"
        title="معلومات"
        icon={<Info size={16} />}
      >
        رسالة معلوماتية تحتوي على تفاصيل مفيدة.
      </Notification>
      
      <Notification
        color="success"
        title="نجح العملية"
        icon={<CheckCircle size={16} />}
      >
        تم إتمام العملية بنجاح!
      </Notification>
      
      <Notification
        color="warning"
        title="تحذير"
        icon={<AlertTriangle size={16} />}
      >
        يرجى توخي الحذر ومراجعة البيانات.
      </Notification>
      
      <Notification
        color="error"
        title="خطأ"
        icon={<AlertCircle size={16} />}
      >
        حدث خطأ ما. يرجى المحاولة مرة أخرى.
      </Notification>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    title: 'جاري التحميل...',
    color: 'info',
    loading: true,
    children: 'يرجى الانتظار أثناء معالجة طلبك.',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithoutIcon: Story = {
  args: {
    title: 'إشعار بسيط',
    color: 'info',
    children: 'هذا إشعار بسيط بدون أيقونة، يحتوي على العنوان والرسالة فقط.',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const SystemNotifications: Story = {
  render: () => (
    <div className="space-y-3 w-full max-w-lg" style={{ direction: 'rtl' }}>
      <Notification
        color="success"
        title="تم تحديث النظام"
        icon={<CheckCircle size={16} />}
        withCloseButton
      >
        تم تحديث النظام بنجاح إلى الإصدار 2.1.0.
      </Notification>
      
      <Notification
        color="info"
        title="رسالة جديدة"
        icon={<Mail size={16} />}
        withCloseButton
      >
        لديك رسالة جديدة من فريق الدعم.
      </Notification>
      
      <Notification
        color="warning"
        title="صيانة مجدولة"
        icon={<AlertTriangle size={16} />}
      >
        صيانة النظام مجدولة غداً في تمام الساعة 2:00 ص بتوقيت جرينتش.
      </Notification>
      
      <Notification
        color="info"
        title="تنزيل مكتمل"
        icon={<Download size={16} />}
        withCloseButton
      >
        تم تنزيل الملف بنجاح إلى مجلد التنزيلات.
      </Notification>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    title: 'تفاصيل مهمة',
    color: 'info',
    icon: <Info size={16} />,
    withCloseButton: true,
    children: (
      <>
        <p className="mb-2">
          هذا الإشعار يحتوي على رسالة طويلة مع فقرات متعددة لإظهار كيف يتعامل 
          المكون مع المحتوى الأكثر تفصيلاً.
        </p>
        <p className="mb-2">
          يمكنك تضمين أنواع مختلفة من المحتوى داخل الإشعارات، بما في ذلك النصوص، 
          والروابط، والعناصر المضمنة الأخرى.
        </p>
        <p>
          سيقوم الإشعار تلقائياً بضبط ارتفاعه ليستوعب جميع المحتوى مع الحفاظ 
          على التباعد المناسب وسهولة القراءة.
        </p>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};
