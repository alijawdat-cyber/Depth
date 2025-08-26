import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Drawer } from './Drawer';
import type { DrawerProps } from './Drawer';
import { Button } from '../Button';
import { 
  Menu, 
  User, 
  Settings, 
  Bell, 
  Mail, 
  ShoppingCart as CartIcon,
  Search,
  Filter
} from 'lucide-react';

const meta: Meta<typeof Drawer> = {
  title: 'Atoms/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    direction: 'rtl', // دعم RTL
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: { type: 'radio' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'موضع الدرج',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'حجم الدرج',
    },
    withCloseButton: {
      control: 'boolean',
      description: 'إظهار زر الإغلاق',
    },
    closeOnClickOutside: {
      control: 'boolean',
      description: 'الإغلاق عند النقر خارجاً',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'الإغلاق عند الضغط على Escape',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// مكون الدرج المتفاعل
const InteractiveDrawer = ({ 
  position = 'right', 
  size = 'md',
  title = 'قائمة التنقل',
  children,
  ...props 
}: Partial<DrawerProps> & { children?: React.ReactNode }) => {
  const [opened, setOpened] = useState(false);
  
  return (
    <div style={{ direction: 'rtl' }}>
      <Button onClick={() => setOpened(true)}>
        <Menu size={16} className="ml-2" />
        فتح الدرج
      </Button>
      
      <Drawer
        {...props}
        opened={opened}
        onClose={() => setOpened(false)}
        position={position}
        size={size}
        title={title}
      >
        {children}
      </Drawer>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <InteractiveDrawer>
      <div className="space-y-4">
        <p>محتوى الدرج الافتراضي</p>
        <Button variant="outline">إجراء</Button>
      </div>
    </InteractiveDrawer>
  ),
};

export const RightSide: Story = {
  render: () => (
    <InteractiveDrawer position="right" title="القائمة الجانبية">
      <div className="space-y-4">
        <div className="p-4 bg-surface-subtle rounded">
          <h3 className="font-medium mb-2">الإجراءات السريعة</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <User size={16} className="ml-2" />
              الملف الشخصي
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Settings size={16} className="ml-2" />
              الإعدادات
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Bell size={16} className="ml-2" />
              الإشعارات
            </Button>
          </div>
        </div>
        
        <div className="p-4 bg-surface-subtle rounded">
          <h3 className="font-medium mb-2">العناصر الأخيرة</h3>
          <div className="space-y-1 text-sm">
            <div className="p-2 hover:bg-surface rounded cursor-pointer">مشروع الألفا</div>
            <div className="p-2 hover:bg-surface rounded cursor-pointer">لوحة المستخدم</div>
            <div className="p-2 hover:bg-surface rounded cursor-pointer">تقرير التحليلات</div>
          </div>
        </div>
      </div>
    </InteractiveDrawer>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <InteractiveDrawer position="left" title="قائمة التصفية">
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">البحث</h3>
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input 
              type="text" 
              placeholder="ابحث هنا..."
              className="w-full pr-10 pl-3 py-2 border border-border rounded-md"
              style={{ direction: 'rtl' }}
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">التصنيف</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="ml-2" />
              <span>الجميع</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="ml-2" defaultChecked />
              <span>نشط</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="ml-2" />
              <span>غير نشط</span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">التاريخ</h3>
          <div className="space-y-2">
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-border rounded-md"
            />
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-border rounded-md"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button className="flex-1">
            <Filter size={16} className="ml-2" />
            تطبيق التصفية
          </Button>
          <Button variant="outline" className="flex-1">
            إعادة تعيين
          </Button>
        </div>
      </div>
    </InteractiveDrawer>
  ),
};

export const TopPosition: Story = {
  render: () => (
    <InteractiveDrawer position="top" size="lg" title="شريط الإشعارات">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-3 bg-success-subtle rounded">
            <Mail size={20} className="ml-3 text-success" />
            <div>
              <div className="font-medium">رسالة جديدة</div>
              <div className="text-sm text-secondary">لديك 3 رسائل غير مقروءة</div>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-warning-subtle rounded">
            <Bell size={20} className="ml-3 text-warning" />
            <div>
              <div className="font-medium">تذكير</div>
              <div className="text-sm text-secondary">اجتماع في خلال 15 دقيقة</div>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-info-subtle rounded">
            <CartIcon size={20} className="ml-3 text-info" />
            <div>
              <div className="font-medium">طلب جديد</div>
              <div className="text-sm text-secondary">تم استلام طلب #1234</div>
            </div>
          </div>
        </div>
      </div>
    </InteractiveDrawer>
  ),
};

export const BottomPosition: Story = {
  render: () => (
    <InteractiveDrawer position="bottom" size="sm" title="معلومات إضافية">
      <div className="p-4 text-center">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">هل تحتاج مساعدة؟</h3>
          <p className="text-secondary">
            يمكنك التواصل مع فريق الدعم للحصول على المساعدة
          </p>
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button>اتصل بالدعم</Button>
          <Button variant="outline">عرض التوثيق</Button>
        </div>
      </div>
    </InteractiveDrawer>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4" style={{ direction: 'rtl' }}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <div key={size}>
            <InteractiveDrawer 
              size={size} 
              title={`حجم ${size.toUpperCase()}`}
            >
              <div className="p-4">
                <p>هذا درج بحجم {size}</p>
                <p className="text-sm text-secondary mt-2">
                  يمكنك تغيير الحجم حسب المحتوى المطلوب عرضه
                </p>
              </div>
            </InteractiveDrawer>
          </div>
        ))}
        
        <div>
          <InteractiveDrawer size="full" title="حجم كامل">
            <div className="p-4">
              <p>هذا درج بحجم الشاشة الكاملة</p>
              <p className="text-sm text-secondary mt-2">
                مفيد للمحتوى الذي يحتاج مساحة كبيرة
              </p>
            </div>
          </InteractiveDrawer>
        </div>
      </div>
    </div>
  ),
};

export const ShoppingCart: Story = {
  render: () => (
    <InteractiveDrawer 
      position="right" 
      size="md" 
      title="سلة التسوق"
    >
      <div className="space-y-4">
        <div className="p-4 bg-surface-subtle rounded">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">العناصر (3)</h3>
            <Button variant="outline" size="sm">إفراغ السلة</Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-surface rounded">
              <div className="w-12 h-12 bg-surface-subtle rounded"></div>
              <div className="flex-1">
                <div className="font-medium">منتج رائع</div>
                <div className="text-sm text-secondary">الكمية: 2</div>
              </div>
              <div className="font-semibold">120 ر.س</div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-surface rounded">
              <div className="w-12 h-12 bg-surface-subtle rounded"></div>
              <div className="flex-1">
                <div className="font-medium">منتج آخر</div>
                <div className="text-sm text-secondary">الكمية: 1</div>
              </div>
              <div className="font-semibold">85 ر.س</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-surface-subtle rounded">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span>205 ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>الشحن:</span>
              <span>25 ر.س</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>المجموع الكلي:</span>
              <span>230 ر.س</span>
            </div>
          </div>
          
          <Button className="w-full">
            <CartIcon size={16} className="ml-2" />
            إتمام الشراء
          </Button>
        </div>
      </div>
    </InteractiveDrawer>
  ),
};
