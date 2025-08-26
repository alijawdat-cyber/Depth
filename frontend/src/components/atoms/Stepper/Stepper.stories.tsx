import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Stepper, Step } from './Stepper';
import type { StepperProps } from './Stepper';
import { Check, X, User, CreditCard, Gift } from 'lucide-react';

const meta: Meta<typeof Stepper> = {
  title: 'Atoms/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
مكون السلسلة المدرجة - Stepper في Depth يوفر واجهة لعرض خطوات العملية بشكل تفاعلي.

## الميزات الرئيسية:
- تصميم عربي مع دعم RTL كامل
- اتجاهات متعددة (أفقي، عمودي)
- أحجام متنوعة (xs, sm, md, lg, xl)
- ألوان مخصصة مع تجاوب لوني
- إمكانية التنقل بين الخطوات
- دعم الأيقونات والأوصاف
- حالات متنوعة (مكتمل، نشط، معطل، خطأ)

## أمثلة الاستخدام:
- عمليات التسجيل والإعداد
- سير العمل متعدد الخطوات
- معالج الطلبات والشراء
- إجراءات التحقق والموافقة
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
      description: 'الخطوة النشطة حالياً',
    },
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
      description: 'اتجاه العرض',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم المكون',
    },
    iconPosition: {
      control: { type: 'radio' },
      options: ['left', 'right'],
      description: 'موضع الأيقونة',
    },
    allowNextStepsSelect: {
      control: 'boolean',
      description: 'السماح بالنقر على الخطوات التالية',
    },
    color: {
      control: 'color',
      description: 'لون الخطوات النشطة',
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

// مكون السلسلة التفاعلي
const InteractiveStepper = ({ initialStep = 0, ...props }: { initialStep?: number } & Partial<StepperProps>) => {
  const [active, setActive] = useState(initialStep);
  
  return (
    <div style={{ direction: 'rtl' }} className="w-full max-w-md">
      <Stepper
        {...props}
        active={active}
        onStepClick={setActive}
      >
        <Step label="الخطوة الأولى" description="إنشاء حساب">
          <div className="pt-4">
            <p className="text-sm text-secondary mb-4">
              أدخل معلوماتك الشخصية لإنشاء حسابك
            </p>
            <Button onClick={() => setActive(1)}>الخطوة التالية</Button>
          </div>
        </Step>
        
        <Step label="الخطوة الثانية" description="تأكيد البريد الإلكتروني">
          <div className="pt-4">
            <p className="text-sm text-secondary mb-4">
              تحقق من بريدك الإلكتروني وانقر على رابط التأكيد
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActive(0)}>رجوع</Button>
              <Button onClick={() => setActive(2)}>الخطوة التالية</Button>
            </div>
          </div>
        </Step>
        
        <Step label="الخطوة الأخيرة" description="الوصول الكامل">
          <div className="pt-4">
            <p className="text-sm text-secondary mb-4">
              لديك الآن وصول كامل لحسابك!
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActive(1)}>رجوع</Button>
              <Button onClick={() => setActive(0)}>إعادة تعيين</Button>
            </div>
          </div>
        </Step>
      </Stepper>
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveStepper />,
};

export const Vertical: Story = {
  render: () => (
    <InteractiveStepper 
      orientation="vertical"
      initialStep={1}
    />
  ),
};

// مكون السلسلة بأيقونات مخصصة
const CustomIconStepper = () => {
  const [active, setActive] = useState(0);
  
  return (
    <div style={{ direction: 'rtl' }} className="w-full max-w-md">
      <Stepper
        active={active}
        onStepClick={setActive}
        completedIcon={<Check size={16} />}
        color="var(--depth-success)"
      >
        <Step 
          label="الحساب" 
          description="المعلومات الشخصية"
          icon={<User size={18} />}
        >
          <div className="pt-4">
            <p className="text-sm text-secondary mb-4">
              إنشاء حسابك بالمعلومات الشخصية
            </p>
            <Button onClick={() => setActive(1)}>متابعة</Button>
          </div>
        </Step>
        
        <Step 
          label="الدفع" 
          description="تفاصيل الفوترة"
          icon={<CreditCard size={18} />}
        >
          <div className="pt-4">
            <p className="text-sm text-secondary mb-4">
              أضافة معلومات الدفع الخاصة بك
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActive(0)}>رجوع</Button>
              <Button onClick={() => setActive(2)}>متابعة</Button>
            </div>
          </div>
        </Step>
        
        <Step 
          label="مكتمل" 
          description="مرحباً بك"
          icon={<Gift size={18} />}
        >
          <div className="pt-4">
            <p className="text-sm text-secondary mb-4">
              حسابك جاهز! مرحباً بك في منصتنا.
            </p>
            <Button onClick={() => setActive(0)}>البدء من جديد</Button>
          </div>
        </Step>
      </Stepper>
    </div>
  );
};

export const WithCustomIcons: Story = {
  render: () => <CustomIconStepper />,
};

export const ColorVariations: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }} className="space-y-8">
      <div>
        <div className="text-sm font-medium mb-3 text-right">اللون الأساسي</div>
        <Stepper active={1} color="#2563eb">
          <Step label="الأول" description="إنشاء حساب" />
          <Step label="الثاني" description="تأكيد البريد" />
          <Step label="الأخير" description="الوصول الكامل" />
        </Stepper>
      </div>
      
      <div>
        <div className="text-sm font-medium mb-3 text-right">اللون الأخضر</div>
        <Stepper active={1} color="#16a34a">
          <Step label="الأول" description="معلومات أساسية" />
          <Step label="الثاني" description="التحقق" />
          <Step label="الأخير" description="اكتمال" />
        </Stepper>
      </div>
      
      <div>
        <div className="text-sm font-medium mb-3 text-right">اللون البنفسجي</div>
        <Stepper active={2} color="#7c3aed">
          <Step label="البداية" description="إعداد أولي" />
          <Step label="المتابعة" description="التكوين" />
          <Step label="النهاية" description="الانتهاء" />
        </Stepper>
      </div>
      
      <div>
        <div className="text-sm font-medium mb-3 text-right">اللون البرتقالي</div>
        <Stepper active={0} color="#ea580c">
          <Step label="الخطوة 1" description="البدء" />
          <Step label="الخطوة 2" description="المعالجة" />
          <Step label="الخطوة 3" description="الإنجاز" />
        </Stepper>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }} className="space-y-6">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="w-full">
          <div className="text-sm font-medium mb-3 text-right">حجم {size}</div>
          <Stepper active={1} size={size}>
            <Step label="الأول" description="إنشاء حساب" />
            <Step label="الثاني" description="تأكيد البريد" />
            <Step label="الأخير" description="الوصول" />
          </Stepper>
        </div>
      ))}
    </div>
  ),
};

export const AllowFutureSteps: Story = {
  render: () => (
    <InteractiveStepper 
      allowNextStepsSelect
      initialStep={0}
    />
  ),
};

// مكون السلسلة مع خطأ
const ErrorStepper = () => {
  const [active, setActive] = useState(1);
  
  return (
    <div style={{ direction: 'rtl' }} className="w-full max-w-md">
      <Stepper
        active={active}
        onStepClick={setActive}
      >
        <Step 
          label="الخطوة الأولى" 
          description="اكتملت بنجاح"
          color="var(--depth-success)"
        />
        
        <Step 
          label="الخطوة الثانية" 
          description="حدث خطأ ما"
          color="var(--depth-error)"
          icon={<X size={16} />}
        >
          <div className="pt-4">
            <p className="text-sm text-error mb-4">
              حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActive(0)}>رجوع</Button>
              <Button onClick={() => setActive(2)}>إعادة المحاولة</Button>
            </div>
          </div>
        </Step>
        
        <Step 
          label="الخطوة الأخيرة" 
          description="في الانتظار"
        />
      </Stepper>
    </div>
  );
};

export const WithError: Story = {
  render: () => <ErrorStepper />,
};

// مكون تدفق الدفع
const CheckoutFlowComponent = () => {
  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState({
    shipping: false,
    payment: false,
    review: false,
  });
  
  const nextStep = () => setActive(active + 1);
  const prevStep = () => setActive(active - 1);
  
  return (
    <div style={{ direction: 'rtl' }} className="w-full max-w-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">عملية الدفع</h2>
        <p className="text-sm text-secondary">أكمل طلبك في 4 خطوات بسيطة</p>
      </div>
      
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={formData.shipping && formData.payment}
      >
        <Step 
          label="الشحن" 
          description="أدخل عنوانك"
          icon={<User size={16} />}
        >
          <div className="pt-4 space-y-4">
            <div className="p-4 bg-surface-subtle rounded-lg">
              <h3 className="font-medium mb-2">معلومات الشحن</h3>
              <p className="text-sm text-secondary">
                الرجاء إدخال عنوان الشحن وطريقة التوصيل المفضلة.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => {
                setFormData(prev => ({ ...prev, shipping: true }));
                nextStep();
              }}>
                متابعة
              </Button>
            </div>
          </div>
        </Step>
        
        <Step 
          label="الدفع" 
          description="اختر طريقة الدفع"
          icon={<CreditCard size={16} />}
        >
          <div className="pt-4 space-y-4">
            <div className="p-4 bg-surface-subtle rounded-lg">
              <h3 className="font-medium mb-2">طريقة الدفع</h3>
              <p className="text-sm text-secondary">
                اختر طريقة الدفع المفضلة وأدخل تفاصيل الدفع.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={prevStep}>رجوع</Button>
              <Button onClick={() => {
                setFormData(prev => ({ ...prev, payment: true }));
                nextStep();
              }}>
                متابعة
              </Button>
            </div>
          </div>
        </Step>
        
        <Step 
          label="مراجعة" 
          description="تأكيد الطلب"
        >
          <div className="pt-4 space-y-4">
            <div className="p-4 bg-surface-subtle rounded-lg">
              <h3 className="font-medium mb-2">مراجعة الطلب</h3>
              <p className="text-sm text-secondary">
                يرجى مراجعة تفاصيل طلبك قبل تأكيد الشراء.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={prevStep}>رجوع</Button>
              <Button onClick={nextStep}>تأكيد الطلب</Button>
            </div>
          </div>
        </Step>
        
        <Step 
          label="مكتمل" 
          description="تم تأكيد الطلب"
          icon={<Check size={16} />}
        >
          <div className="pt-4 space-y-4">
            <div className="p-4 bg-success-subtle rounded-lg">
              <h3 className="font-medium mb-2">تم تأكيد الطلب!</h3>
              <p className="text-sm">
                شكراً لك على طلبك. ستتلقى رسالة تأكيد بالبريد الإلكتروني قريباً.
              </p>
            </div>
            <Button onClick={() => {
              setActive(0);
              setFormData({ shipping: false, payment: false, review: false });
            }}>
              بدء طلب جديد
            </Button>
          </div>
        </Step>
      </Stepper>
    </div>
  );
};

export const CheckoutFlow: Story = {
  render: () => <CheckoutFlowComponent />,
  parameters: {
    docs: {
      description: {
        story: 'تدفق دفع متكامل مع التفاعل والتنقل بين الخطوات بسلاسة',
      },
    },
  },
};
