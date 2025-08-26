import type { Meta, StoryObj } from '@storybook/react';
import { Indicator } from './Indicator';
import { 
  Bell, 
  Mail, 
  User, 
  ShoppingCart, 
  Settings,
  Heart,
  Star,
  MessageCircle
} from 'lucide-react';
import { Button } from '../Button';

const meta: Meta<typeof Indicator> = {
  title: 'Atoms/Indicator',
  component: Indicator,
  parameters: {
    layout: 'centered',
    direction: 'rtl', // دعم RTL
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم المؤشر',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'لون المؤشر',
    },
    position: {
      control: { type: 'select' },
      options: ['top-end', 'top-start', 'bottom-end', 'bottom-start', 'top-center', 'bottom-center', 'middle-end', 'middle-start'],
      description: 'موضع المؤشر',
    },
    disabled: {
      control: 'boolean',
      description: 'إخفاء المؤشر',
    },
    withBorder: {
      control: 'boolean',
      description: 'إضافة حدود',
    },
    processing: {
      control: 'boolean',
      description: 'حركة المعالجة',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '3',
    color: 'error',
    children: (
      <div style={{ direction: 'rtl' }}>
        <Bell size={24} />
      </div>
    ),
  },
};

export const WithDot: Story = {
  args: {
    color: 'success',
    children: (
      <div style={{ direction: 'rtl' }}>
        <User size={24} />
      </div>
    ),
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex gap-6 flex-wrap items-center" style={{ direction: 'rtl' }}>
      <div className="text-center">
        <Indicator color="primary" label="1">
          <Bell size={32} />
        </Indicator>
        <p className="mt-2 text-xs">أساسي</p>
      </div>
      
      <div className="text-center">
        <Indicator color="secondary" label="2">
          <Mail size={32} />
        </Indicator>
        <p className="mt-2 text-xs">ثانوي</p>
      </div>
      
      <div className="text-center">
        <Indicator color="success" label="✓">
          <User size={32} />
        </Indicator>
        <p className="mt-2 text-xs">نجاح</p>
      </div>
      
      <div className="text-center">
        <Indicator color="warning" label="!">
          <Settings size={32} />
        </Indicator>
        <p className="mt-2 text-xs">تحذير</p>
      </div>
      
      <div className="text-center">
        <Indicator color="error" label="5">
          <ShoppingCart size={32} />
        </Indicator>
        <p className="mt-2 text-xs">خطأ</p>
      </div>
      
      <div className="text-center">
        <Indicator color="info" label="i">
          <Heart size={32} />
        </Indicator>
        <p className="mt-2 text-xs">معلومات</p>
      </div>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-6 items-center" style={{ direction: 'rtl' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="text-center">
          <Indicator size={size} color="error" label="9">
            <Bell size={size === 'xs' ? 20 : size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 40 : 48} />
          </Indicator>
          <p className="mt-2 text-xs">{size}</p>
        </div>
      ))}
    </div>
  ),
};

export const AllPositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8" style={{ direction: 'rtl' }}>
      {([
        { pos: 'top-start', label: 'أعلى-بداية' },
        { pos: 'top-end', label: 'أعلى-نهاية' },
        { pos: 'top-center', label: 'أعلى-وسط' },
        { pos: 'bottom-start', label: 'أسفل-بداية' },
        { pos: 'bottom-end', label: 'أسفل-نهاية' },
        { pos: 'bottom-center', label: 'أسفل-وسط' },
        { pos: 'middle-start', label: 'وسط-بداية' },
        { pos: 'middle-end', label: 'وسط-نهاية' },
      ] as const).map(({ pos, label }) => (
        <div key={pos} className="text-center">
          <Indicator 
            position={pos} 
            color="primary" 
            label="3"
          >
            <div className="w-16 h-16 bg-surface-subtle rounded-lg flex items-center justify-center">
              <Star size={24} />
            </div>
          </Indicator>
          <p className="mt-2 text-xs">{label}</p>
        </div>
      ))}
    </div>
  ),
};

export const Processing: Story = {
  render: () => (
    <div className="flex gap-6 items-center" style={{ direction: 'rtl' }}>
      <div className="text-center">
        <Indicator color="primary" processing>
          <Bell size={32} />
        </Indicator>
        <p className="mt-2 text-xs">جاري المعالجة</p>
      </div>
      
      <div className="text-center">
        <Indicator color="success" processing label="3">
          <MessageCircle size={32} />
        </Indicator>
        <p className="mt-2 text-xs">معالجة مع عدد</p>
      </div>
    </div>
  ),
};

export const WithBorder: Story = {
  render: () => (
    <div className="flex gap-6 items-center" style={{ direction: 'rtl' }}>
      <div className="text-center">
        <Indicator color="error" label="9" withBorder>
          <Bell size={32} />
        </Indicator>
        <p className="mt-2 text-xs">مع حدود</p>
      </div>
      
      <div className="text-center">
        <Indicator color="success" withBorder>
          <User size={32} />
        </Indicator>
        <p className="mt-2 text-xs">نقطة مع حدود</p>
      </div>
    </div>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <div className="flex gap-6 items-center" style={{ direction: 'rtl' }}>
      <div className="text-center">
        <Indicator color="error" label="5" disabled>
          <Bell size={32} />
        </Indicator>
        <p className="mt-2 text-xs">مخفي</p>
      </div>
      
      <div className="text-center">
        <Indicator color="error" label="5">
          <Bell size={32} />
        </Indicator>
        <p className="mt-2 text-xs">ظاهر</p>
      </div>
    </div>
  ),
};

export const NavigationExample: Story = {
  render: () => (
    <div className="bg-surface border border-border rounded-lg p-4" style={{ direction: 'rtl' }}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">شريط التنقل</h3>
        
        <div className="flex gap-4">
          <Indicator color="error" label="3" position="top-end">
            <Button variant="ghost" size="sm">
              <Bell size={18} />
            </Button>
          </Indicator>
          
          <Indicator color="primary" label="12" position="top-end">
            <Button variant="ghost" size="sm">
              <Mail size={18} />
            </Button>
          </Indicator>
          
          <Indicator color="warning" processing position="top-end">
            <Button variant="ghost" size="sm">
              <Settings size={18} />
            </Button>
          </Indicator>
          
          <Indicator color="success" dot position="top-end">
            <Button variant="ghost" size="sm">
              <User size={18} />
            </Button>
          </Indicator>
        </div>
      </div>
    </div>
  ),
};

export const ShoppingCartExample: Story = {
  render: () => (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      <div className="flex gap-4 items-center">
        <Indicator color="primary" label="2" position="top-end">
          <Button>
            <ShoppingCart size={18} className="ml-2" />
            السلة
          </Button>
        </Indicator>
        
        <Indicator color="error" label="99+" position="top-end">
          <Button variant="outline">
            <Heart size={18} className="ml-2" />
            المفضلة
          </Button>
        </Indicator>
        
        <Indicator color="success" dot processing position="top-end">
          <Button variant="outline">
            <MessageCircle size={18} className="ml-2" />
            الرسائل
          </Button>
        </Indicator>
      </div>
      
      <div className="text-sm text-secondary">
        مثال على استخدام المؤشرات في واجهة التسوق الإلكتروني
      </div>
    </div>
  ),
};

export const StatusIndicators: Story = {
  render: () => (
    <div className="space-y-4" style={{ direction: 'rtl' }}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 border border-border rounded-lg">
          <Indicator color="success" dot position="bottom-end">
            <div className="w-12 h-12 bg-success-subtle rounded-full mx-auto mb-2 flex items-center justify-center">
              <User size={24} className="text-success" />
            </div>
          </Indicator>
          <p className="text-sm font-medium">أحمد علي</p>
          <p className="text-xs text-secondary">متصل</p>
        </div>
        
        <div className="text-center p-4 border border-border rounded-lg">
          <Indicator color="warning" dot position="bottom-end">
            <div className="w-12 h-12 bg-warning-subtle rounded-full mx-auto mb-2 flex items-center justify-center">
              <User size={24} className="text-warning" />
            </div>
          </Indicator>
          <p className="text-sm font-medium">سارة محمد</p>
          <p className="text-xs text-secondary">مشغول</p>
        </div>
        
        <div className="text-center p-4 border border-border rounded-lg">
          <Indicator color="secondary" dot position="bottom-end">
            <div className="w-12 h-12 bg-secondary-subtle rounded-full mx-auto mb-2 flex items-center justify-center">
              <User size={24} className="text-secondary" />
            </div>
          </Indicator>
          <p className="text-sm font-medium">عمر حسن</p>
          <p className="text-xs text-secondary">غير متصل</p>
        </div>
        
        <div className="text-center p-4 border border-border rounded-lg">
          <Indicator color="error" dot position="bottom-end">
            <div className="w-12 h-12 bg-error-subtle rounded-full mx-auto mb-2 flex items-center justify-center">
              <User size={24} className="text-error" />
            </div>
          </Indicator>
          <p className="text-sm font-medium">نور أحمد</p>
          <p className="text-xs text-secondary">لا تزعج</p>
        </div>
      </div>
    </div>
  ),
};
