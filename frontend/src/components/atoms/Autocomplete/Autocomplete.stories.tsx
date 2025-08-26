import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Autocomplete } from './Autocomplete';

const meta: Meta<typeof Autocomplete> = {
  title: 'Atoms/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون البحث التلقائي يوفر حقل إدخال قابل للبحث مع قائمة منسدلة للاقتراحات. مثالي للنماذج التي تحتوي على مجموعات بيانات كبيرة أو وظائف البحث الديناميكي. يدعم البحث بالعربية مع الحفاظ على اتجاه LTR للبحث الفعّال.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl', fontFamily: 'Dubai, sans-serif' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    data: {
      control: 'object',
      description: 'Data for autocomplete options',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    label: {
      control: 'text',
      description: 'Label for the input',
    },
    description: {
      control: 'text',
      description: 'Description text',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether input is required',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Border radius',
    },
    limit: {
      control: { type: 'range', min: 3, max: 20, step: 1 },
      description: 'Maximum number of options to show',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

const countries = [
  'العراق', 'الكويت', 'السعودية', 'الإمارات', 'قطر', 'البحرين', 'عُمان', 
  'الأردن', 'لبنان', 'سوريا', 'فلسطين', 'مصر', 'السودان', 'ليبيا', 'تونس',
  'الجزائر', 'المغرب', 'موريتانيا', 'جيبوتي', 'الصومال', 'اليمن', 'تركيا', 
  'إيران', 'أفغانستان', 'باكستان', 'بنجلاديش', 'الهند', 'الصين', 'اليابان',
  'كوريا الجنوبية', 'تايلاند', 'فيتنام', 'إندونيسيا', 'ماليزيا', 'سنغافورة'
];

const users = [
  { value: 'ahmed', label: 'أحمد علي' },
  { value: 'fatima', label: 'فاطمة محمد' },
  { value: 'omar', label: 'عمر حسن' },
  { value: 'aisha', label: 'عائشة سالم' },
  { value: 'hassan', label: 'حسان أحمد' },
  { value: 'zainab', label: 'زينب خالد' },
  { value: 'yusuf', label: 'يوسف عبدالله' },
  { value: 'maryam', label: 'مريم إبراهيم' },
  { value: 'abdullah', label: 'عبدالله محمود' },
  { value: 'khadija', label: 'خديجة عمر' },
];

export const Default: Story = {
  args: {
    placeholder: 'ابحث عن دولة...',
    data: countries,
    size: 'sm',
    limit: 5,
  },
  parameters: {
    docs: { description: { story: 'المثال الأساسي لمكون البحث التلقائي مع قائمة الدول العربية.' } }
  }
};

export const WithLabel: Story = {
  args: {
    label: 'الدولة',
    placeholder: 'اختر دولتك',
    data: countries,
    size: 'sm',
    required: true,
  },
  parameters: {
    docs: { description: { story: 'مكون البحث مع عنوان ومؤشر الحقل المطلوب.' } }
  }
};

export const WithDescription: Story = {
  args: {
    label: 'الدولة',
    description: 'اختر الدولة التي تتواجد فيها حالياً',
    placeholder: 'ابحث عن دولة...',
    data: countries,
    size: 'sm',
  },
  parameters: {
    docs: { description: { story: 'مكون البحث مع نص توضيحي لمساعدة المستخدم.' } }
  }
};

export const WithError: Story = {
  args: {
    label: 'الدولة',
    placeholder: 'ابحث عن دولة...',
    data: countries,
    size: 'sm',
    error: 'يرجى اختيار دولة صحيحة',
    required: true,
  },
  parameters: {
    docs: { description: { story: 'مكون البحث في حالة الخطأ مع رسالة توضيحية.' } }
  }
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <Autocomplete data={countries} size="xs" placeholder="صغير جداً" label="صغير جداً" />
      <Autocomplete data={countries} size="sm" placeholder="صغير" label="صغير" />
      <Autocomplete data={countries} size="md" placeholder="متوسط" label="متوسط" />
      <Autocomplete data={countries} size="lg" placeholder="كبير" label="كبير" />
      <Autocomplete data={countries} size="xl" placeholder="كبير جداً" label="كبير جداً" />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'أحجام مختلفة لمكون البحث التلقائي من صغير جداً إلى كبير جداً.' } }
  }
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <Autocomplete data={countries} placeholder="الحالة الافتراضية" label="افتراضي" />
      <Autocomplete data={countries} placeholder="مع قيمة افتراضية" label="مع قيمة" defaultValue="العراق" />
      <Autocomplete data={countries} placeholder="حقل مطلوب" label="مطلوب" required />
      <Autocomplete data={countries} placeholder="معطّل" label="معطّل" disabled />
      <Autocomplete data={countries} placeholder="حالة خطأ" label="خطأ" error="هذا الحقل مطلوب" />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'حالات مختلفة لمكون البحث: افتراضي، مع قيمة، مطلوب، معطّل، وحالة الخطأ.' } }
  }
};

export const WithObjects: Story = {
  args: {
    label: 'تخصيص للمستخدم',
    placeholder: 'ابحث عن المستخدمين...',
    data: users,
    size: 'sm',
    description: 'اختر مستخدماً لتخصيص هذه المهمة له',
  },
  parameters: {
    docs: { description: { story: 'استخدام مكون البحث مع كائنات معقدة (قيمة وعنوان منفصلان).' } }
  }
};

export const CustomLimit: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '300px' }}>
      <Autocomplete data={countries} placeholder="عرض 3 خيارات كحد أقصى" label="الحد: 3" limit={3} />
      <Autocomplete data={countries} placeholder="عرض 8 خيارات كحد أقصى" label="الحد: 8" limit={8} />
      <Autocomplete data={countries} placeholder="عرض 15 خياراً كحد أقصى" label="الحد: 15" limit={15} />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'التحكم في عدد النتائج المعروضة في القائمة المنسدلة.' } }
  }
};

export const Interactive: Story = {
  render: function InteractiveComponent() {
    const [value, setValue] = React.useState('');

    const filteredData = countries.filter(country =>
      country.includes(value)
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
        <Autocomplete
          label="البحث التفاعلي للدول"
          placeholder="اكتب للبحث..."
          data={filteredData}
          value={value}
          onChange={setValue}
          onFocus={() => console.log('تم التركيز')}
          onBlur={() => console.log('تم إلغاء التركيز')}
          limit={8}
          size="md"
        />
        
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>
            القيمة الحالية:
          </p>
          <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
            {value || 'لا يوجد اختيار'}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'مثال تفاعلي يوضح كيفية التعامل مع حالة المكون وتصفية البيانات ديناميكياً.' } }
  }
};

export const FormContext: Story = {
  render: function FormComponent() {
    const [formData, setFormData] = React.useState({
      country: '',
      assignedTo: '',
      category: '',
    });

    const categories = [
      'التكنولوجيا', 'التصميم', 'التسويق', 'المبيعات', 'الدعم الفني', 
      'المالية', 'الموارد البشرية', 'القانونية', 'العمليات', 'البحث والتطوير'
    ];

    return (
      <form style={{ width: '400px', padding: '24px', borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)' }}>
          معلومات المشروع
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <Autocomplete
            label="الدولة"
            placeholder="ابحث عن دولة..."
            data={countries}
            value={formData.country}
            onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
            required
            size="sm"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Autocomplete
            label="تخصيص إلى"
            placeholder="ابحث في أعضاء الفريق..."
            data={users}
            value={formData.assignedTo}
            onChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
            description="اختر عضو فريق لتخصيص هذا المشروع له"
            size="sm"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Autocomplete
            label="الفئة"
            placeholder="اختر فئة..."
            data={categories}
            value={formData.category}
            onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            required
            size="sm"
          />
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)' }}>
            بيانات النموذج:
          </h4>
          <pre style={{ 
            margin: 0, 
            fontSize: 'var(--fs-xs)', 
            fontFamily: 'monospace',
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </form>
    );
  },
  parameters: {
    docs: { description: { story: 'مثال شامل لاستخدام مكون البحث في نموذج متكامل مع عدة حقول وإدارة الحالة.' } }
  }
};
