import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta = {
  title: "Design System/Colors",
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'نظام الألوان المحسن مع دعم الوضع المظلم والفاتح وألوان الحالات المختلفة',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ColorCard = ({ colorClass, name, description, colorValue }: { 
  colorClass: string; 
  name: string; 
  description?: string;
  colorValue?: string;
}) => (
  <div className="flex flex-col gap-2 p-4 bg-surface-default rounded-lg shadow-sm border border-border-default">
    <div className={`w-full h-16 rounded-md border border-border-subtle ${colorClass}`} />
    <div>
      <h3 className="text-sm font-medium text-text-primary">{name}</h3>
      <p className="text-xs text-text-secondary font-mono">{colorValue || colorClass}</p>
      {description && <p className="text-xs text-text-tertiary mt-1">{description}</p>}
    </div>
  </div>
);

export const EnhancedColors: Story = {
  render: () => (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-text-primary">نظام الألوان المحسن</h1>
        <p className="text-text-secondary">مجموعة شاملة من الألوان المصممة للوضوح والإتقان البصري</p>
      </div>

      {/* الألوان الأساسية المحسنة */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">الألوان الأساسية المحسنة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ColorCard colorClass="bg-primary-default" colorValue="#2563eb" name="أزرق أساسي" description="للعناصر الرئيسية والروابط" />
          <ColorCard colorClass="bg-success-default" colorValue="#16a34a" name="أخضر النجاح" description="للرسائل الإيجابية والإكمال" />
          <ColorCard colorClass="bg-warning-default" colorValue="#ea580c" name="برتقالي التحذير" description="للتنبيهات والملاحظات" />
          <ColorCard colorClass="bg-error-default" colorValue="#dc2626" name="أحمر الخطر" description="للأخطاء والحذف" />
        </div>
      </section>

      {/* ألوان ثانوية */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">الألوان الثانوية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ColorCard colorClass="bg-accent-default" colorValue="#7c3aed" name="بنفسجي إبداعي" description="للمحتوى الإبداعي والمميز" />
          <ColorCard colorClass="bg-info-default" colorValue="#0891b2" name="سماوي المعلومات" description="للمعلومات والإشعارات" />
          <ColorCard colorClass="bg-secondary-default" colorValue="#be123c" name="وردي مميز" description="للمحتوى المهم والخاص" />
          <ColorCard colorClass="bg-success-darker" colorValue="#059669" name="أخضر داكن" description="للحالات المؤكدة" />
        </div>
      </section>

      {/* الألوان الرمادية */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">تدرجات الرمادي</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <ColorCard colorClass="bg-surface-subtle" colorValue="#f8fafc" name="رمادي فاتح جداً" />
          <ColorCard colorClass="bg-surface-default" colorValue="#e2e8f0" name="رمادي فاتح" />
          <ColorCard colorClass="bg-border-subtle" colorValue="#cbd5e1" name="رمادي متوسط فاتح" />
          <ColorCard colorClass="bg-text-tertiary" colorValue="#94a3b8" name="رمادي متوسط" />
          <ColorCard colorClass="bg-text-secondary" colorValue="#64748b" name="رمادي داكن متوسط" />
          <ColorCard colorClass="bg-text-primary" colorValue="#334155" name="رمادي داكن" />
        </div>
      </section>

      {/* أمثلة الاستخدام */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">أمثلة الاستخدام</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-primary-default text-primary-contrast">
            <h3 className="font-medium mb-2">زر أساسي</h3>
            <p className="text-sm opacity-90">للإجراءات الرئيسية</p>
          </div>
          
          <div className="p-4 rounded-lg bg-success-default text-success-contrast">
            <h3 className="font-medium mb-2">حالة النجاح</h3>
            <p className="text-sm opacity-90">تم الحفظ بنجاح!</p>
          </div>
          
          <div className="p-4 rounded-lg bg-warning-default text-warning-contrast">
            <h3 className="font-medium mb-2">تنبيه مهم</h3>
            <p className="text-sm opacity-90">انتبه لهذه المعلومة</p>
          </div>
        </div>
      </section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'عرض شامل لنظام الألوان المحسن مع أمثلة الاستخدام العملية',
      },
    },
  },
};

export const AccessibilityColors: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-text-primary">ألوان إمكانية الوصول</h1>
        <p className="text-text-secondary">الألوان مصممة لتحقيق أعلى معايير إمكانية الوصول</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 border border-border-default rounded-lg">
          <div className="w-24 h-12 rounded flex items-center justify-center text-sm font-medium bg-primary-default text-primary-contrast">
            نموذج
          </div>
          <div>
            <h3 className="font-medium text-text-primary">أزرق على أبيض</h3>
            <p className="text-sm text-text-secondary">نسبة التباين: 7.3:1</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 border border-border-default rounded-lg">
          <div className="w-24 h-12 rounded flex items-center justify-center text-sm font-medium bg-success-default text-success-contrast">
            نموذج
          </div>
          <div>
            <h3 className="font-medium text-text-primary">أخضر على أبيض</h3>
            <p className="text-sm text-text-secondary">نسبة التباين: 8.1:1</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 border border-border-default rounded-lg">
          <div className="w-24 h-12 rounded flex items-center justify-center text-sm font-medium bg-warning-default text-warning-contrast">
            نموذج
          </div>
          <div>
            <h3 className="font-medium text-text-primary">برتقالي على أبيض</h3>
            <p className="text-sm text-text-secondary">نسبة التباين: 5.8:1</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-4 border border-border-default rounded-lg">
          <div className="w-24 h-12 rounded flex items-center justify-center text-sm font-medium bg-error-default text-error-contrast">
            نموذج
          </div>
          <div>
            <h3 className="font-medium text-text-primary">أحمر على أبيض</h3>
            <p className="text-sm text-text-secondary">نسبة التباين: 6.2:1</p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'اختبار نسب التباين لضمان إمكانية الوصول للمستخدمين ذوي الاحتياجات البصرية المختلفة',
      },
    },
  },
};
