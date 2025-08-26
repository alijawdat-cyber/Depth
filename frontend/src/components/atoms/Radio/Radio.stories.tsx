import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Radio } from './Radio';

const meta = {
  title: 'Atoms/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
مكون زر الاختيار الواحد - Radio في Depth يوفر عناصر تحكم للاختيار الحصري بين عدة خيارات.

## الميزات الرئيسية:
- تصميم عربي مع دعم RTL كامل
- حالات متعددة (عادي، محدد، معطل، خطأ)
- أحجام متنوعة (xs, sm, md, lg, xl)
- ألوان مخصصة تتماشى مع هوية النظام
- دعم المجموعات والتحقق من صحة البيانات
- إمكانية الوصول الكاملة مع دعم لوحة المفاتيح

## أمثلة الاستخدام:
- نماذج الاختيار الحصري
- استطلاعات الرأي
- إعدادات التفضيلات
- خيارات الدفع
- تصنيف المحتوى
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم زر الاختيار',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
      description: 'لون زر الاختيار',
    },
    checked: {
      control: { type: 'boolean' },
      description: 'حالة التحديد',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'حالة التعطيل',
    },
    error: {
      control: { type: 'text' },
      description: 'رسالة الخطأ',
    },
    label: {
      control: { type: 'text' },
      description: 'نص التسمية',
    },
    description: {
      control: { type: 'text' },
      description: 'وصف إضافي',
    },
  },
  decorators: [
    (Story) => (
      <div dir="rtl" style={{ fontFamily: 'Dubai, sans-serif' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 'default-group' },
  render: function DefaultRadio() {
    const [selected, setSelected] = React.useState('option1');
    
    return (
      <div className="space-y-3">
        <Radio 
          label="الخيار الأول" 
          value="option1"
          checked={selected === 'option1'}
          onChange={() => setSelected('option1')}
        />
        <Radio 
          label="الخيار الثاني" 
          value="option2"
          checked={selected === 'option2'}
          onChange={() => setSelected('option2')}
        />
        <Radio 
          label="الخيار الثالث" 
          value="option3"
          checked={selected === 'option3'}
          onChange={() => setSelected('option3')}
        />
        <div className="slider-value-display">
          المحدد: {selected === 'option1' ? 'الخيار الأول' : selected === 'option2' ? 'الخيار الثاني' : 'الخيار الثالث'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'مجموعة أزرار اختيار تفاعلية مع إدارة الحالة.' } }
  }
};

export const Sizes: Story = {
  args: { value: 'size-demo' },
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-3">
        <Radio size="xs" label="حجم صغير جداً" value="xs" />
        <Radio size="sm" label="حجم صغير" value="sm" />
        <Radio size="md" label="حجم متوسط" value="md" />
        <Radio size="lg" label="حجم كبير" value="lg" />
        <Radio size="xl" label="حجم كبير جداً" value="xl" />
      </div>
    </div>
  ),
};

export const Colors: Story = {
  args: { value: 'color-demo' },
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-3">
        <Radio color="primary" label="اللون الأساسي" value="primary" checked />
        <Radio color="secondary" label="اللون الثانوي" value="secondary" checked />
        <Radio color="success" label="لون النجاح" value="success" checked />
        <Radio color="warning" label="لون التحذير" value="warning" checked />
        <Radio color="error" label="لون الخطأ" value="error" checked />
      </div>
    </div>
  ),
};

export const States: Story = {
  args: { value: 'state-demo' },
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-3">
        <Radio label="غير محدد" value="unchecked" />
        <Radio label="محدد" value="checked" checked />
        <Radio label="معطل" value="disabled" disabled />
        <Radio label="محدد ومعطل" value="checked-disabled" checked disabled />
        <Radio label="حالة خطأ" value="error" error="هذا الحقل مطلوب" />
        <Radio label="محدد مع خطأ" value="checked-error" checked error="خطأ في القيمة" />
      </div>
    </div>
  ),
};

export const WithDescriptions: Story = {
  args: { value: 'descriptions-demo' },
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="space-y-4">
        <Radio 
          label="خيار مجاني" 
          description="احصل على الميزات الأساسية مجاناً"
          value="free"
        />
        <Radio 
          label="خطة مميزة" 
          description="ميزات متقدمة مع دعم أولوية - 99 ريال/شهر"
          value="premium"
          checked
        />
        <Radio 
          label="خطة الأعمال" 
          description="حلول شاملة للشركات مع دعم مخصص - 299 ريال/شهر"
          value="business"
        />
      </div>
    </div>
  ),
};

export const PaymentMethods: Story = {
  args: { value: 'payment-demo' },
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-lg font-bold mb-4">اختر طريقة الدفع</h3>
        <div className="space-y-3">
          <div className="border rounded p-3">
            <Radio 
              name="payment"
              label="بطاقة ائتمانية" 
              description="فيزا، ماستركارد، أمريكان إكسبريس"
              value="credit-card"
              checked
            />
          </div>
          <div className="border rounded p-3">
            <Radio 
              name="payment"
              label="محفظة إلكترونية" 
              description="آبل باي، جوجل باي، سامسونج باي"
              value="e-wallet"
            />
          </div>
          <div className="border rounded p-3">
            <Radio 
              name="payment"
              label="تحويل بنكي" 
              description="تحويل مباشر من حسابك البنكي"
              value="bank-transfer"
            />
          </div>
          <div className="border rounded p-3">
            <Radio 
              name="payment"
              label="الدفع عند الاستلام" 
              description="ادفع نقداً عند وصول الطلب"
              value="cash-on-delivery"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Survey: Story = {
  args: { value: 'survey-demo' },
  render: () => (
    <div style={{ direction: 'rtl', width: '500px' }}>
      <div className="border rounded-lg p-6 bg-white">
        <h3 className="text-xl font-bold mb-6">استطلاع رضا العملاء</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">ما مدى رضاك عن خدماتنا؟</h4>
            <div className="space-y-2">
              <Radio name="satisfaction" label="راض جداً" value="very-satisfied" color="success" />
              <Radio name="satisfaction" label="راض" value="satisfied" color="primary" />
              <Radio name="satisfaction" label="محايد" value="neutral" color="secondary" />
              <Radio name="satisfaction" label="غير راض" value="unsatisfied" color="warning" />
              <Radio name="satisfaction" label="غير راض إطلاقاً" value="very-unsatisfied" color="error" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">هل تنصح الآخرين بخدماتنا؟</h4>
            <div className="space-y-2">
              <Radio name="recommend" label="بالتأكيد نعم" value="definitely-yes" />
              <Radio name="recommend" label="ربما" value="maybe" />
              <Radio name="recommend" label="لست متأكداً" value="unsure" />
              <Radio name="recommend" label="على الأرجح لا" value="probably-no" />
              <Radio name="recommend" label="بالتأكيد لا" value="definitely-no" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">كيف سمعت عنا؟</h4>
            <div className="space-y-2">
              <Radio name="source" label="وسائل التواصل الاجتماعي" value="social-media" />
              <Radio name="source" label="إعلانات جوجل" value="google-ads" />
              <Radio name="source" label="ترشيح من صديق" value="friend-referral" />
              <Radio name="source" label="موقع إلكتروني" value="website" />
              <Radio name="source" label="أخرى" value="other" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const UserPreferences: Story = {
  args: { value: 'preferences-demo' },
  render: () => (
    <div style={{ direction: 'rtl', width: '450px' }}>
      <div className="border rounded-lg p-5 bg-white">
        <h3 className="text-lg font-bold mb-5">إعدادات التفضيلات</h3>
        
        <div className="space-y-5">
          <div>
            <h4 className="font-medium mb-3">اللغة المفضلة</h4>
            <div className="space-y-2">
              <Radio name="language" label="العربية" value="ar" checked />
              <Radio name="language" label="English" value="en" />
              <Radio name="language" label="Français" value="fr" />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">المظهر</h4>
            <div className="space-y-2">
              <Radio name="theme" label="فاتح" value="light" />
              <Radio name="theme" label="داكن" value="dark" checked />
              <Radio name="theme" label="تلقائي (حسب النظام)" value="system" />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">طريقة عرض البيانات</h4>
            <div className="space-y-2">
              <Radio name="view" label="عرض الجدول" value="table" checked />
              <Radio name="view" label="عرض البطاقات" value="cards" />
              <Radio name="view" label="عرض القائمة" value="list" />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">التنبيهات</h4>
            <div className="space-y-2">
              <Radio name="notifications" label="جميع التنبيهات" value="all" />
              <Radio name="notifications" label="المهمة فقط" value="important" checked />
              <Radio name="notifications" label="إيقاف التنبيهات" value="none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ValidationErrors: Story = {
  args: { value: 'validation-demo' },
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-lg font-bold mb-4">نموذج مع أخطاء</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 text-red-600">اختر نوع العضوية *</h4>
            <div className="space-y-2 border border-red-200 rounded p-3 bg-red-50">
              <Radio 
                name="membership"
                label="عضوية فردية" 
                description="للأفراد والمستقلين"
                value="individual"
                error="يجب اختيار نوع العضوية"
              />
              <Radio 
                name="membership"
                label="عضوية شركات" 
                description="للشركات والمؤسسات"
                value="corporate"
                error="يجب اختيار نوع العضوية"
              />
              <Radio 
                name="membership"
                label="عضوية مؤسسية" 
                description="للمؤسسات الحكومية"
                value="institutional"
                error="يجب اختيار نوع العضوية"
              />
            </div>
            <p className="text-sm text-red-600 mt-1">يجب اختيار نوع العضوية</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">اختر المدينة</h4>
            <div className="space-y-2">
              <Radio name="city" label="الرياض" value="riyadh" />
              <Radio name="city" label="جدة" value="jeddah" checked />
              <Radio name="city" label="الدمام" value="dammam" />
              <Radio name="city" label="مكة المكرمة" value="makkah" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InteractiveForm: Story = {
  args: { value: 'demo' },
  render: () => {
    const InteractiveExample = () => {
      const [paymentMethod, setPaymentMethod] = useState('');
      const [subscription, setSubscription] = useState('basic');
      const [language] = useState('arabic');

      return (
        <div className="space-y-6 p-4 max-w-md">
          <h3 className="text-lg font-semibold mb-4">نموذج تفاعلي</h3>
          
          <div className="space-y-3">
            <h4 className="font-medium">طريقة الدفع:</h4>
            <Radio
              name="payment"
              label="بطاقة ائتمانية"
              value="credit"
              checked={paymentMethod === 'credit'}
              onChange={(value) => setPaymentMethod(value)}
              color="primary"
            />
            <Radio
              name="payment"
              label="محفظة إلكترونية"
              value="wallet"
              checked={paymentMethod === 'wallet'}
              onChange={(value) => setPaymentMethod(value)}
              color="primary"
            />
            <Radio
              name="payment"
              label="تحويل بنكي"
              value="transfer"
              checked={paymentMethod === 'transfer'}
              onChange={(value) => setPaymentMethod(value)}
              color="primary"
            />
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">نوع الاشتراك:</h4>
            <Radio
              name="subscription"
              label="أساسي - مجاني"
              description="ميزات محدودة"
              value="basic"
              checked={subscription === 'basic'}
              onChange={(value) => setSubscription(value)}
              color="success"
            />
            <Radio
              name="subscription"
              label="متقدم - 29 ريال"
              description="ميزات إضافية"
              value="advanced"
              checked={subscription === 'advanced'}
              onChange={(value) => setSubscription(value)}
              color="warning"
            />
          </div>
          
          <div className="mt-6 p-3 bg-gray-100 rounded-lg">
            <h4 className="font-medium mb-2">الاختيارات الحالية:</h4>
            <ul className="text-sm space-y-1">
              <li>طريقة الدفع: {paymentMethod || 'غير محدد'}</li>
              <li>الاشتراك: {subscription}</li>
              <li>اللغة: {language}</li>
            </ul>
          </div>
        </div>
      );
    };

    return <InteractiveExample />;
  },
  parameters: {
    docs: {
      description: {
        story: 'مثال تفاعلي يوضح كيفية استخدام Radio في النماذج مع إدارة الحالة',
      },
    },
  },
};
