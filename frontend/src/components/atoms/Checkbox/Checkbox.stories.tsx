import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    direction: 'rtl',
    docs: {
      description: {
        component: 'مكون خانة الاختيار مع دعم RTL كامل وتفاعل بصري محسن',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم خانة الاختيار',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
      description: 'لون السمة',
    },
    label: {
      control: 'text',
      description: 'نص التسمية',
    },
    description: {
      control: 'text',
      description: 'وصف إضافي',
    },
    error: {
      control: 'text',
      description: 'رسالة خطأ',
    },
    disabled: {
      control: 'boolean',
      description: 'تعطيل الخانة',
    },
    indeterminate: {
      control: 'boolean',
      description: 'حالة متوسطة',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'أوافق على شروط الاستخدام',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithDescription: Story = {
  args: {
    label: 'تلقي رسائل إعلانية',
    description: 'سنرسل لك عروضاً وتحديثات حول منتجاتنا الجديدة',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const Sizes: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-4">
        <Checkbox size="xs" label="حجم صغير جداً (xs)" />
        <Checkbox size="sm" label="حجم صغير (sm)" />
        <Checkbox size="md" label="حجم متوسط (md)" />
        <Checkbox size="lg" label="حجم كبير (lg)" />
        <Checkbox size="xl" label="حجم كبير جداً (xl)" />
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-4">
        <Checkbox color="primary" label="لون أساسي" defaultChecked />
        <Checkbox color="secondary" label="لون ثانوي" defaultChecked />
        <Checkbox color="success" label="لون النجاح" defaultChecked />
        <Checkbox color="warning" label="لون التحذير" defaultChecked />
        <Checkbox color="error" label="لون الخطأ" defaultChecked />
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-4">
        <Checkbox label="غير محدد" />
        <Checkbox label="محدد" defaultChecked />
        <Checkbox label="متوسط (indeterminate)" indeterminate />
        <Checkbox label="معطل - غير محدد" disabled />
        <Checkbox label="معطل - محدد" disabled defaultChecked />
        <Checkbox label="معطل - متوسط" disabled indeterminate />
      </div>
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: 'أوافق على الشروط والأحكام',
    error: 'يجب الموافقة على الشروط للمتابعة',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const FormExample: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '400px' }}>
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">إعدادات الإشعارات</h3>
        
        <div className="space-y-4">
          <Checkbox
            label="إشعارات البريد الإلكتروني"
            description="تلقي إشعارات عبر البريد الإلكتروني"
            defaultChecked
          />
          
          <Checkbox
            label="إشعارات الهاتف الجوال"
            description="تلقي إشعارات push على الهاتف"
            defaultChecked
          />
          
          <Checkbox
            label="إشعارات التسويق"
            description="تلقي عروض ومواد تسويقية"
          />
          
          <div className="border-t pt-4 mt-4">
            <Checkbox
              label="إشعارات الأمان"
              description="تنبيهات مهمة حول أمان الحساب (لا يمكن إلغاؤها)"
              disabled
              defaultChecked
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const TermsAndConditions: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '500px' }}>
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">إنشاء حساب جديد</h3>
        
        <div className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="الاسم الكامل"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          <div>
            <input 
              type="email" 
              placeholder="البريد الإلكتروني"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          <div>
            <input 
              type="password" 
              placeholder="كلمة المرور"
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          <div className="space-y-3 pt-4">
            <Checkbox
              label="أوافق على شروط الاستخدام وسياسة الخصوصية"
              description="يجب الموافقة على الشروط للمتابعة"
              size="sm"
            />
            
            <Checkbox
              label="أرغب في تلقي النشرة الإخبارية والعروض الخاصة"
              description="يمكنك إلغاء الاشتراك في أي وقت"
              size="sm"
            />
            
            <Checkbox
              label="أوافق على معالجة بياناتي الشخصية لأغراض التسويق"
              size="sm"
            />
          </div>
          
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            إنشاء الحساب
          </button>
        </div>
      </div>
    </div>
  ),
};

export const TaskList: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '400px' }}>
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">قائمة المهام اليومية</h3>
        
        <div className="space-y-3">
          <Checkbox
            label="مراجعة البريد الإلكتروني"
            defaultChecked
            color="success"
          />
          
          <Checkbox
            label="كتابة التقرير الشهري"
            color="primary"
          />
          
          <Checkbox
            label="الاتصال بالعملاء المحتملين"
            indeterminate
            color="warning"
          />
          
          <Checkbox
            label="تحديث قاعدة البيانات"
            color="primary"
          />
          
          <Checkbox
            label="حضور اجتماع الفريق (3:00 م)"
            defaultChecked
            color="success"
          />
          
          <Checkbox
            label="إعداد العرض التقديمي للغد"
            color="primary"
          />
          
          <div className="pt-4 mt-4 border-t">
            <div className="text-sm text-secondary">
              تم إنجاز 2 من 6 مهام
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const PermissionsSettings: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '500px' }}>
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">صلاحيات المستخدم</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">إدارة المحتوى</h4>
            <div className="space-y-2 pr-4">
              <Checkbox
                size="sm"
                label="إنشاء مقالات جديدة"
                defaultChecked
                color="success"
              />
              <Checkbox
                size="sm"
                label="تعديل المقالات الموجودة"
                defaultChecked
                color="success"
              />
              <Checkbox
                size="sm"
                label="حذف المقالات"
                color="primary"
              />
              <Checkbox
                size="sm"
                label="نشر المقالات"
                indeterminate
                color="warning"
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">إدارة المستخدمين</h4>
            <div className="space-y-2 pr-4">
              <Checkbox
                size="sm"
                label="عرض قائمة المستخدمين"
                defaultChecked
                color="success"
              />
              <Checkbox
                size="sm"
                label="إضافة مستخدمين جدد"
                color="primary"
              />
              <Checkbox
                size="sm"
                label="تعديل بيانات المستخدمين"
                disabled
                color="error"
              />
              <Checkbox
                size="sm"
                label="حذف المستخدمين"
                disabled
                color="error"
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">الإعدادات العامة</h4>
            <div className="space-y-2 pr-4">
              <Checkbox
                size="sm"
                label="تغيير إعدادات الموقع"
                disabled
                color="error"
              />
              <Checkbox
                size="sm"
                label="إدارة النسخ الاحتياطية"
                disabled
                color="error"
              />
              <Checkbox
                size="sm"
                label="عرض التقارير"
                defaultChecked
                color="success"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const InteractiveExample = () => {
      const [formData, setFormData] = useState({
        terms: false,
        newsletter: false,
        notifications: false,
      });

      return (
        <div className="space-y-4 p-4 max-w-md">
          <h3 className="text-lg font-semibold mb-4">نموذج تفاعلي</h3>
          
          <Checkbox
            label="أوافق على شروط الاستخدام"
            checked={formData.terms}
            onChange={(checked) => setFormData(prev => ({ ...prev, terms: checked }))}
            required
            color="primary"
          />
          
          <Checkbox
            label="أرغب في تلقي النشرة الإخبارية"
            description="سنرسل لك أحدث الأخبار والعروض"
            checked={formData.newsletter}
            onChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked }))}
            color="success"
          />
          
          <Checkbox
            label="تفعيل الإشعارات"
            description="تلقي إشعارات فورية عن التحديثات"
            checked={formData.notifications}
            onChange={(checked) => setFormData(prev => ({ ...prev, notifications: checked }))}
            color="warning"
          />
          
          <div className="mt-6 p-3 bg-gray-100 rounded-lg">
            <h4 className="font-medium mb-2">حالة النموذج:</h4>
            <ul className="text-sm space-y-1">
              <li>الموافقة على الشروط: {formData.terms ? '✅ مفعل' : '❌ غير مفعل'}</li>
              <li>النشرة الإخبارية: {formData.newsletter ? '✅ مفعل' : '❌ غير مفعل'}</li>
              <li>الإشعارات: {formData.notifications ? '✅ مفعل' : '❌ غير مفعل'}</li>
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
        story: 'مثال تفاعلي يوضح كيفية استخدام Checkbox في النماذج مع إدارة الحالة',
      },
    },
  },
};
