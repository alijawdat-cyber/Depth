import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Slider from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    direction: 'rtl', // دعم RTL
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: { type: 'number' },
      description: 'القيمة الدنيا',
    },
    max: {
      control: { type: 'number' },
      description: 'القيمة العليا',
    },
    step: {
      control: { type: 'number' },
      description: 'حجم الخطوة',
    },
    value: {
      control: { type: 'number' },
      description: 'القيمة الحالية',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم الشريط',
    },
    color: {
      control: 'text',
      description: 'لون السمة',
    },
    disabled: {
      control: 'boolean',
      description: 'تعطيل الشريط',
    },
    label: {
      control: 'text',
      description: 'تسمية الشريط',
    },
    marks: {
      control: 'object',
      description: 'العلامات على الشريط',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultSlider() {
    const [value, setValue] = React.useState(50);
    
    return (
      <div style={{ direction: 'rtl', width: '300px' }}>
        <Slider
          min={0}
          max={100}
          value={value}
          onChange={setValue}
          label="اختر القيمة"
        />
        <div className="slider-value-display">
          القيمة الحالية: {value}
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'المثال الأساسي للسلايدر مع إدارة الحالة التفاعلية.' } }
  }
};

export const WithMarks: Story = {
  render: function WithMarksSlider() {
    const [value, setValue] = React.useState(30);
    
    const marks = [
      { value: 0, label: '0%' },
      { value: 25, label: '25%' },
      { value: 50, label: '50%' },
      { value: 75, label: '75%' },
      { value: 100, label: '100%' },
    ];
    
    return (
      <div style={{ direction: 'rtl', width: '400px' }}>
        <Slider
          min={0}
          max={100}
          value={value}
          onChange={setValue}
          label="مستوى الصوت"
          marks={marks}
        />
        <div className="slider-value-display">
          مستوى الصوت: {value}%
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'سلايدر مع علامات مرئية لتوضيح القيم المهمة.' } }
  }
};

export const Sizes: Story = {
  render: function SizesSlider() {
    const [values, setValues] = React.useState({
      xs: 25,
      sm: 40,
      md: 60,
      lg: 75,
      xl: 90
    });
    
    return (
      <div style={{ direction: 'rtl', width: '400px' }}>
        <div className="space-y-6">
          <div>
            <div className="text-sm font-medium mb-2">حجم صغير جداً (xs)</div>
            <Slider 
              size="xs" 
              min={0} 
              max={100} 
              value={values.xs}
              onChange={(value) => setValues(prev => ({ ...prev, xs: value }))}
            />
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">حجم صغير (sm)</div>
            <Slider 
              size="sm" 
              min={0} 
              max={100} 
              value={values.sm}
              onChange={(value) => setValues(prev => ({ ...prev, sm: value }))}
            />
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">حجم متوسط (md)</div>
            <Slider 
              size="md" 
              min={0} 
              max={100} 
              value={values.md}
              onChange={(value) => setValues(prev => ({ ...prev, md: value }))}
            />
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">حجم كبير (lg)</div>
            <Slider 
              size="lg" 
              min={0} 
              max={100} 
              value={values.lg}
              onChange={(value) => setValues(prev => ({ ...prev, lg: value }))}
            />
          </div>
          
          <div>
            <div className="text-sm font-medium mb-2">حجم كبير جداً (xl)</div>
            <Slider 
              size="xl" 
              min={0} 
              max={100} 
              value={values.xl}
              onChange={(value) => setValues(prev => ({ ...prev, xl: value }))}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'أحجام مختلفة للسلايدر مع إمكانية التفاعل مع كل حجم.' } }
  }
};

export const Colors: Story = {
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="space-y-6">
        <div>
          <div className="text-sm font-medium mb-2">أساسي (افتراضي)</div>
          <Slider color="primary" min={0} max={100} defaultValue={30} />
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">ثانوي</div>
          <Slider color="secondary" min={0} max={100} defaultValue={50} />
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">نجاح</div>
          <Slider color="success" min={0} max={100} defaultValue={70} />
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">تحذير</div>
          <Slider color="warning" min={0} max={100} defaultValue={85} />
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">خطأ</div>
          <Slider color="error" min={0} max={100} defaultValue={60} />
        </div>
      </div>
    </div>
  ),
};

export const PriceRange: Story = {
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">فلترة السعر</h3>
        
        <div className="mb-4">
          <Slider
            min={0}
            max={1000}
            step={50}
            defaultValue={300}
            marks={[
              { value: 0, label: '0 ر.س' },
              { value: 250, label: '250 ر.س' },
              { value: 500, label: '500 ر.س' },
              { value: 750, label: '750 ر.س' },
              { value: 1000, label: '1000 ر.س' },
            ]}
            color="primary"
          />
        </div>
        
        <div className="text-center text-sm">
          <span>السعر المحدد: 300 ر.س</span>
        </div>
      </div>
    </div>
  ),
};

export const VolumeControl: Story = {
  render: () => (
    <div style={{ direction: 'rtl', width: '350px' }}>
      <div className="p-6 bg-surface-subtle rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">مستوى الصوت</h3>
          <span className="text-2xl font-bold text-primary">65%</span>
        </div>
        
        <Slider
          min={0}
          max={100}
          defaultValue={65}
          color="primary"
          size="lg"
        />
        
        <div className="flex justify-between text-xs text-secondary mt-2">
          <span>صامت</span>
          <span>عالي</span>
        </div>
      </div>
    </div>
  ),
};

export const TemperatureControl: Story = {
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="p-6 border rounded-lg">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">تحكم في درجة الحرارة</h3>
          <div className="text-3xl font-bold mt-2">
            <span className="text-warning">24°</span>
          </div>
        </div>
        
        <Slider
          min={16}
          max={30}
          defaultValue={24}
          color="warning"
          size="lg"
          marks={[
            { value: 16, label: '16°' },
            { value: 20, label: '20°' },
            { value: 24, label: '24°' },
            { value: 28, label: '28°' },
            { value: 30, label: '30°' },
          ]}
        />
        
        <div className="flex justify-between text-xs text-secondary mt-2">
          <span>❄️ بارد</span>
          <span>🌡️ معتدل</span>
          <span>🔥 ساخن</span>
        </div>
      </div>
    </div>
  ),
};

export const ProgressSlider: Story = {
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">تقدم المشروع</span>
            <span className="text-sm text-secondary">35% مكتمل</span>
          </div>
          <Slider
            min={0}
            max={100}
            defaultValue={35}
            color="success"
            marks={[
              { value: 0, label: 'البداية' },
              { value: 25, label: 'ربع' },
              { value: 50, label: 'نصف' },
              { value: 75, label: 'ثلاثة أرباع' },
              { value: 100, label: 'مكتمل' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-2">شريط معطل - قيمة منخفضة</div>
          <Slider min={0} max={100} defaultValue={25} disabled />
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">شريط معطل - قيمة متوسطة</div>
          <Slider min={0} max={100} defaultValue={60} disabled />
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">شريط معطل - قيمة عالية</div>
          <Slider min={0} max={100} defaultValue={80} disabled />
        </div>
      </div>
    </div>
  ),
};

export const CustomSteps: Story = {
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="space-y-6">
        <div>
          <div className="text-sm font-medium mb-2">خطوات كبيرة (step: 10)</div>
          <Slider
            min={0}
            max={100}
            step={10}
            defaultValue={50}
            marks={[
              { value: 0, label: '0' },
              { value: 25, label: '25' },
              { value: 50, label: '50' },
              { value: 75, label: '75' },
              { value: 100, label: '100' },
            ]}
          />
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">خطوات صغيرة (step: 1)</div>
          <Slider
            min={0}
            max={10}
            step={1}
            defaultValue={5}
            marks={[
              { value: 0, label: '0' },
              { value: 2, label: '2' },
              { value: 4, label: '4' },
              { value: 6, label: '6' },
              { value: 8, label: '8' },
              { value: 10, label: '10' },
            ]}
          />
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">خطوات عشرية (step: 0.1)</div>
          <Slider
            min={0}
            max={1}
            step={0.1}
            defaultValue={0.5}
            marks={[
              { value: 0, label: '0' },
              { value: 0.25, label: '0.25' },
              { value: 0.5, label: '0.5' },
              { value: 0.75, label: '0.75' },
              { value: 1, label: '1' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

export const ImageBrightness: Story = {
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="p-6 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">تحكم في سطوع الصورة</h3>
        
        <div 
          className="w-full h-40 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center text-white font-bold"
          style={{ 
            filter: 'brightness(100%)',
            transition: 'filter 0.2s ease'
          }}
        >
          صورة تجريبية
        </div>
        
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">السطوع</span>
            <span className="text-sm text-secondary">100%</span>
          </div>
        </div>
        
        <Slider
          min={0}
          max={200}
          defaultValue={100}
          color="primary"
          marks={[
            { value: 0, label: '0%' },
            { value: 50, label: '50%' },
            { value: 100, label: '100%' },
            { value: 150, label: '150%' },
            { value: 200, label: '200%' },
          ]}
        />
      </div>
    </div>
  ),
};
