import type { Meta, StoryObj } from '@storybook/react';
import Popover from './Popover';
import { Button } from '../Button';
import { Avatar } from '@mantine/core';
import { 
  Settings, 
  User, 
  LogOut, 
  Info, 
  Star, 
  Heart,
  ShoppingCart,
  Bell
} from 'lucide-react';

const meta: Meta<typeof Popover> = {
  title: 'Atoms/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl', fontFamily: 'Dubai, sans-serif', padding: '50px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    position: {
      control: { type: 'select' },
      options: [
        'top', 'right', 'bottom', 'left', 
        'top-start', 'top-end', 
        'right-start', 'right-end',
        'bottom-start', 'bottom-end',
        'left-start', 'left-end'
      ],
      description: 'موضع النافذة المنبثقة',
    },
    trigger: {
      control: { type: 'select' },
      options: ['click', 'hover', 'focus'],
      description: 'الحدث المُحفِّز',
    },
    width: {
      control: { type: 'number', min: 100, max: 500 },
      description: 'عرض النافذة المنبثقة',
    },
    offset: {
      control: { type: 'number', min: 0, max: 50 },
      description: 'المسافة من المُحفِّز',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: 'bottom',
    trigger: 'click',
    width: 200,
    content: 'هذا محتوى النافذة المنبثقة الافتراضية',
  },
  render: (args) => (
    <div style={{ direction: 'rtl', padding: '50px' }}>
      <Popover {...args}>
        <Button>انقر هنا</Button>
      </Popover>
    </div>
  ),
};

export const OnHover: Story = {
  args: {
    position: 'top',
    trigger: 'hover',
    width: 250,
    content: (
      <div className="p-3">
        <div className="font-semibold mb-2">معلومات المستخدم</div>
        <p className="text-sm text-secondary">
          مرر بالماوس لعرض المزيد من التفاصيل حول هذا العنصر.
        </p>
      </div>
    ),
  },
  render: (args) => (
    <div style={{ direction: 'rtl', padding: '50px' }}>
      <Popover {...args}>
        <Button variant="outline">مرر بالماوس</Button>
      </Popover>
    </div>
  ),
};

export const UserMenu: Story = {
  render: () => (
    <div style={{ direction: 'rtl', padding: '50px' }}>
      <Popover
        position="bottom-end"
        width={280}
        content={
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b">
              <Avatar size="sm" color="blue">أ</Avatar>
              <div>
                <div className="font-semibold">أحمد محمد</div>
                <div className="text-xs text-secondary">ahmed@example.com</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="ghost" fullWidth>
                <User size={16} className="ml-2" />
                الملف الشخصي
              </Button>
              <Button variant="ghost" fullWidth>
                <Settings size={16} className="ml-2" />
                الإعدادات
              </Button>
              <Button variant="ghost" fullWidth className="text-red-600 hover:bg-red-50">
                <LogOut size={16} className="ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        }
      >
        <Button variant="ghost" className="rounded-full">
          <Avatar size="sm" color="blue">أ</Avatar>
        </Button>
      </Popover>
    </div>
  ),
};

export const ProductQuickView: Story = {
  render: () => (
    <div style={{ direction: 'rtl', padding: '50px' }}>
      <Popover
        position="right"
        width={320}
        content={
          <div className="p-4">
            <div className="bg-surface-subtle h-32 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-4xl">📱</span>
            </div>
            
            <h3 className="font-semibold mb-2">آيفون 15 برو</h3>
            <p className="text-sm text-secondary mb-3">
              أحدث هاتف ذكي من آبل مع كاميرا متقدمة وأداء استثنائي.
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-success">4,999 ر.س</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm">4.8</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="xs" fullWidth>
                <ShoppingCart size={14} className="ml-1" />
                أضف للسلة
              </Button>
              <Button size="xs" variant="outline">
                <Heart size={14} />
              </Button>
            </div>
          </div>
        }
      >
        <Button variant="outline">عرض سريع</Button>
      </Popover>
    </div>
  ),
};

export const NotificationPopover: Story = {
  render: () => (
    <div style={{ direction: 'rtl', padding: '50px' }}>
      <Popover
        position="bottom-start"
        width={350}
        content={
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">الإشعارات</h3>
              <Button size="xs" variant="ghost">
                تحديد الكل كمقروء
              </Button>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <div className="flex gap-3 p-2 rounded-lg bg-blue-50">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">
                    طلب جديد تم استلامه
                  </div>
                  <div className="text-xs text-secondary">
                    منذ 5 دقائق
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 p-2 rounded-lg hover:bg-surface-subtle">
                <div className="w-2 h-2 bg-transparent rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">
                    تحديث في حالة الشحن
                  </div>
                  <div className="text-xs text-secondary">
                    منذ ساعة
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 p-2 rounded-lg hover:bg-surface-subtle">
                <div className="w-2 h-2 bg-transparent rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">
                    عرض خاص ينتهي قريباً
                  </div>
                  <div className="text-xs text-secondary">
                    منذ يومين
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <Button variant="ghost" fullWidth size="xs">
                عرض جميع الإشعارات
              </Button>
            </div>
          </div>
        }
      >
        <Button variant="ghost" className="relative">
          <Bell size={20} />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </div>
        </Button>
      </Popover>
    </div>
  ),
};

export const HelpTooltip: Story = {
  render: () => (
    <div style={{ direction: 'rtl', padding: '50px' }}>
      <div className="flex items-center gap-2">
        <span>كلمة المرور</span>
        <Popover
          position="top"
          trigger="hover"
          width={300}
          content={
            <div className="p-3">
              <div className="font-semibold mb-2">متطلبات كلمة المرور:</div>
              <ul className="text-sm space-y-1 text-secondary">
                <li>• على الأقل 8 أحرف</li>
                <li>• حرف كبير واحد على الأقل</li>
                <li>• رقم واحد على الأقل</li>
                <li>• رمز خاص واحد على الأقل</li>
              </ul>
            </div>
          }
        >
          <Button size="xs" variant="ghost" className="rounded-full w-5 h-5 p-0">
            <Info size={12} />
          </Button>
        </Popover>
      </div>
    </div>
  ),
};

export const DifferentPositions: Story = {
  render: () => (
    <div style={{ direction: 'rtl', padding: '100px' }}>
      <div className="grid grid-cols-3 gap-4 place-items-center">
        <Popover position="top-start" content="أعلى - بداية">
          <Button size="xs" variant="outline">أعلى بداية</Button>
        </Popover>
        
        <Popover position="top" content="أعلى - وسط">
          <Button size="xs" variant="outline">أعلى وسط</Button>
        </Popover>
        
        <Popover position="top-end" content="أعلى - نهاية">
          <Button size="xs" variant="outline">أعلى نهاية</Button>
        </Popover>
        
        <Popover position="left" content="يسار">
          <Button size="xs" variant="outline">يسار</Button>
        </Popover>
        
        <Button size="xs" disabled>مركز</Button>
        
        <Popover position="right" content="يمين">
          <Button size="xs" variant="outline">يمين</Button>
        </Popover>
        
        <Popover position="bottom-start" content="أسفل - بداية">
          <Button size="xs" variant="outline">أسفل بداية</Button>
        </Popover>
        
        <Popover position="bottom" content="أسفل - وسط">
          <Button size="xs" variant="outline">أسفل وسط</Button>
        </Popover>
        
        <Popover position="bottom-end" content="أسفل - نهاية">
          <Button size="xs" variant="outline">أسفل نهاية</Button>
        </Popover>
      </div>
    </div>
  ),
};
