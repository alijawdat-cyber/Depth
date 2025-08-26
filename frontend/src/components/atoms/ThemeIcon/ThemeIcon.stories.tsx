import type { Meta, StoryObj } from '@storybook/react';
import ThemeIcon from './ThemeIcon';
import { 
  Heart, 
  Star, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  Download,
  Upload,
  Settings,
  Bell,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

const meta: Meta<typeof ThemeIcon> = {
  title: 'Atoms/ThemeIcon',
  component: ThemeIcon,
  parameters: {
    layout: 'centered',
    direction: 'rtl', // دعم RTL
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم الأيقونة',
    },
    radius: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'نصف القطر',
    },
    variant: {
      control: { type: 'select' },
      options: ['filled', 'light', 'outline', 'default', 'white', 'gradient'],
      description: 'متغير الأسلوب',
    },
    color: {
      control: 'text',
      description: 'اللون',
    },
    gradient: {
      control: 'object',
      description: 'التدرج',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'filled',
    color: 'blue',
    children: <Heart size={16} />,
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
      <div className="flex items-center gap-4">
        <div className="text-center">
          <ThemeIcon size="xs" color="blue">
            <Heart size={12} />
          </ThemeIcon>
          <div className="text-xs mt-2">صغير جداً</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon size="sm" color="blue">
            <Heart size={14} />
          </ThemeIcon>
          <div className="text-xs mt-2">صغير</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon size="md" color="blue">
            <Heart size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">متوسط</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon size="lg" color="blue">
            <Heart size={20} />
          </ThemeIcon>
          <div className="text-xs mt-2">كبير</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon size="xl" color="blue">
            <Heart size={24} />
          </ThemeIcon>
          <div className="text-xs mt-2">كبير جداً</div>
        </div>
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <ThemeIcon variant="filled" color="blue">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">مملوء</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon variant="light" color="blue">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">فاتح</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon variant="outline" color="blue">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">محدد</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon variant="default" color="blue">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">افتراضي</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon variant="white" color="blue">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">أبيض</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon variant="gradient" gradient={{ from: 'blue', to: 'purple' }}>
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">متدرج</div>
        </div>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <ThemeIcon color="blue">
            <Heart size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">أزرق</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon color="green">
            <CheckCircle size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">أخضر</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon color="red">
            <XCircle size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">أحمر</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon color="yellow">
            <AlertTriangle size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">أصفر</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon color="purple">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">بنفسجي</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon color="pink">
            <Heart size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">وردي</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon color="indigo">
            <Shield size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">نيلي</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon color="gray">
            <Info size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">رمادي</div>
        </div>
      </div>
    </div>
  ),
};

export const ContactInfo: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-4 max-w-sm">
        <div className="flex items-center gap-3">
          <ThemeIcon size="sm" color="blue" variant="light">
            <User size={14} />
          </ThemeIcon>
          <div>
            <div className="font-medium">أحمد محمد علي</div>
            <div className="text-sm text-secondary">مطور واجهات أمامية</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeIcon size="sm" color="green" variant="light">
            <Mail size={14} />
          </ThemeIcon>
          <div>
            <div className="font-medium">ahmed@example.com</div>
            <div className="text-sm text-secondary">البريد الإلكتروني</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeIcon size="sm" color="orange" variant="light">
            <Phone size={14} />
          </ThemeIcon>
          <div>
            <div className="font-medium">+966 50 123 4567</div>
            <div className="text-sm text-secondary">رقم الجوال</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeIcon size="sm" color="red" variant="light">
            <MapPin size={14} />
          </ThemeIcon>
          <div>
            <div className="font-medium">الرياض، المملكة العربية السعودية</div>
            <div className="text-sm text-secondary">العنوان</div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const StatusIndicators: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <ThemeIcon size="sm" color="green" variant="filled">
              <CheckCircle size={14} />
            </ThemeIcon>
            <span className="font-medium">تم بنجاح</span>
          </div>
          <p className="text-sm text-secondary">تمت العملية بنجاح وتم حفظ البيانات.</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <ThemeIcon size="sm" color="red" variant="filled">
              <XCircle size={14} />
            </ThemeIcon>
            <span className="font-medium">فشلت العملية</span>
          </div>
          <p className="text-sm text-secondary">حدث خطأ أثناء معالجة الطلب.</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <ThemeIcon size="sm" color="yellow" variant="filled">
              <AlertTriangle size={14} />
            </ThemeIcon>
            <span className="font-medium">تحذير</span>
          </div>
          <p className="text-sm text-secondary">يرجى التحقق من البيانات المدخلة.</p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <ThemeIcon size="sm" color="blue" variant="filled">
              <Info size={14} />
            </ThemeIcon>
            <span className="font-medium">معلومات</span>
          </div>
          <p className="text-sm text-secondary">تتوفر تحديثات جديدة للنظام.</p>
        </div>
      </div>
    </div>
  ),
};

export const ActionButtons: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="flex flex-wrap gap-3">
        <div className="text-center">
          <button className="hover:scale-105 transition-transform">
            <ThemeIcon size="lg" color="blue" variant="light">
              <Download size={20} />
            </ThemeIcon>
          </button>
          <div className="text-xs mt-2">تحميل</div>
        </div>
        
        <div className="text-center">
          <button className="hover:scale-105 transition-transform">
            <ThemeIcon size="lg" color="green" variant="light">
              <Upload size={20} />
            </ThemeIcon>
          </button>
          <div className="text-xs mt-2">رفع</div>
        </div>
        
        <div className="text-center">
          <button className="hover:scale-105 transition-transform">
            <ThemeIcon size="lg" color="gray" variant="light">
              <Settings size={20} />
            </ThemeIcon>
          </button>
          <div className="text-xs mt-2">إعدادات</div>
        </div>
        
        <div className="text-center">
          <button className="hover:scale-105 transition-transform">
            <ThemeIcon size="lg" color="orange" variant="light">
              <Bell size={20} />
            </ThemeIcon>
          </button>
          <div className="text-xs mt-2">إشعارات</div>
        </div>
        
        <div className="text-center">
          <button className="hover:scale-105 transition-transform">
            <ThemeIcon size="lg" color="purple" variant="light">
              <Calendar size={20} />
            </ThemeIcon>
          </button>
          <div className="text-xs mt-2">تقويم</div>
        </div>
        
        <div className="text-center">
          <button className="hover:scale-105 transition-transform">
            <ThemeIcon size="lg" color="indigo" variant="light">
              <Clock size={20} />
            </ThemeIcon>
          </button>
          <div className="text-xs mt-2">وقت</div>
        </div>
      </div>
    </div>
  ),
};

export const GradientIcons: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="flex gap-4">
        <div className="text-center">
          <ThemeIcon 
            size="lg" 
            variant="gradient" 
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            <Heart size={20} />
          </ThemeIcon>
          <div className="text-xs mt-2">أزرق إلى سماوي</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon 
            size="lg" 
            variant="gradient" 
            gradient={{ from: 'red', to: 'pink' }}
          >
            <Star size={20} />
          </ThemeIcon>
          <div className="text-xs mt-2">أحمر إلى وردي</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon 
            size="lg" 
            variant="gradient" 
            gradient={{ from: 'green', to: 'yellow' }}
          >
            <CheckCircle size={20} />
          </ThemeIcon>
          <div className="text-xs mt-2">أخضر إلى أصفر</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon 
            size="lg" 
            variant="gradient" 
            gradient={{ from: 'purple', to: 'indigo' }}
          >
            <Shield size={20} />
          </ThemeIcon>
          <div className="text-xs mt-2">بنفسجي إلى نيلي</div>
        </div>
      </div>
    </div>
  ),
};

export const RadiusVariations: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <ThemeIcon radius="xs" color="blue">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">حاد</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon radius="sm" color="blue">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">صغير</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon radius="md" color="blue">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">متوسط</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon radius="lg" color="blue">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">كبير</div>
        </div>
        
        <div className="text-center">
          <ThemeIcon radius="xl" color="blue">
            <Star size={16} />
          </ThemeIcon>
          <div className="text-xs mt-2">دائري</div>
        </div>
      </div>
    </div>
  ),
};
