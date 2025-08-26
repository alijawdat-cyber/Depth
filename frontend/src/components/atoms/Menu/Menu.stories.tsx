import type { Meta, StoryObj } from '@storybook/react';
import Menu, { MenuItem, MenuDivider, MenuLabel } from '../Menu';
import { Button } from '../Button';
import { 
  User, 
  Settings, 
  LogOut, 
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  Share,
  Archive,
  Star,
  Flag,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

const meta: Meta<typeof Menu> = {
  title: 'Atoms/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون القائمة المنسدلة - يستخدم لإظهار خيارات وإجراءات متعددة في مساحة محدودة. يدعم RTL بشكل كامل.'
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'bottom', 'left', 'right', 'top',
        'bottom-end', 'bottom-start',
        'left-end', 'left-start',
        'right-end', 'right-start',
        'top-end', 'top-start'
      ],
      description: 'موضع القائمة',
    },
    withArrow: {
      control: 'boolean',
      description: 'إظهار السهم',
    },
    shadow: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم الظل',
    },
    width: {
      control: 'number',
      description: 'عرض القائمة',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  args: {
    position: 'bottom-start',
    withArrow: false,
    shadow: 'md',
    width: 200,
  },
  render: (args) => (
    <Menu {...args}>
      <MenuItem leftSection={<User size={14} />}>
        الملف الشخصي
      </MenuItem>
      <MenuItem leftSection={<Settings size={14} />}>
        الإعدادات
      </MenuItem>
      <MenuDivider />
      <MenuItem leftSection={<LogOut size={14} />} color="red">
        تسجيل الخروج
      </MenuItem>
    </Menu>
  ),
};

export const WithCustomTrigger: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Menu trigger={<Button rightSection={<ChevronDown size={14} />}>خيارات المستخدم</Button>}>
        <MenuItem leftSection={<User size={14} />}>
          الملف الشخصي
        </MenuItem>
        <MenuItem leftSection={<Settings size={14} />}>
          الإعدادات
        </MenuItem>
        <MenuDivider />
        <MenuItem leftSection={<LogOut size={14} />} color="red">
          تسجيل الخروج
        </MenuItem>
      </Menu>

      <Menu trigger={
        <Button variant="outline" size="sm">
          <MoreVertical size={16} />
        </Button>
      }>
        <MenuItem leftSection={<Edit size={14} />}>
          تحرير
        </MenuItem>
        <MenuItem leftSection={<Copy size={14} />}>
          نسخ
        </MenuItem>
        <MenuItem leftSection={<Trash2 size={14} />} color="red">
          حذف
        </MenuItem>
      </Menu>
    </div>
  ),
};

export const WithLabelsAndDividers: Story = {
  render: () => (
    <Menu width={220}>
      <MenuLabel>إجراءات الملف</MenuLabel>
      <MenuItem leftSection={<Edit size={14} />}>
        تحرير الملف
      </MenuItem>
      <MenuItem leftSection={<Copy size={14} />}>
        نسخ الملف
      </MenuItem>
      <MenuItem leftSection={<Download size={14} />}>
        تحميل الملف
      </MenuItem>
      
      <MenuDivider />
      
      <MenuLabel>إجراءات المشاركة</MenuLabel>
      <MenuItem leftSection={<Share size={14} />}>
        مشاركة الملف
      </MenuItem>
      <MenuItem leftSection={<Archive size={14} />}>
        أرشفة الملف
      </MenuItem>
      
      <MenuDivider />
      
      <MenuLabel>إجراءات خطيرة</MenuLabel>
      <MenuItem leftSection={<Trash2 size={14} />} color="red">
        حذف الملف نهائياً
      </MenuItem>
    </Menu>
  ),
};

export const MenuPositions: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '3rem',
      padding: '4rem',
      minHeight: '500px',
      alignItems: 'center',
      justifyItems: 'center'
    }}>
      {/* Row 1 */}
      <Menu 
        position="top-start"
        trigger={<Button size="sm">أعلى-يسار</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>
      
      <Menu 
        position="top"
        trigger={<Button size="sm">أعلى</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>
      
      <Menu 
        position="top-end"
        trigger={<Button size="sm">أعلى-يمين</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>

      {/* Row 2 */}
      <Menu 
        position="left-start"
        trigger={<Button size="sm">يسار-أعلى</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>
      
      <div style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 500 }}>
        مواضع القائمة
      </div>
      
      <Menu 
        position="right-start"
        trigger={<Button size="sm">يمين-أعلى</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>

      {/* Row 3 */}
      <Menu 
        position="left"
        trigger={<Button size="sm">يسار</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>
      
      <div></div>
      
      <Menu 
        position="right"
        trigger={<Button size="sm">يمين</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>

      {/* Row 4 */}
      <Menu 
        position="left-end"
        trigger={<Button size="sm">يسار-أسفل</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>
      
      <div></div>
      
      <Menu 
        position="right-end"
        trigger={<Button size="sm">يمين-أسفل</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>

      {/* Row 5 */}
      <Menu 
        position="bottom-start"
        trigger={<Button size="sm">أسفل-يسار</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>
      
      <Menu 
        position="bottom"
        trigger={<Button size="sm">أسفل</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>
      
      <Menu 
        position="bottom-end"
        trigger={<Button size="sm">أسفل-يمين</Button>}
      >
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>
    </div>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <Menu>
      <MenuItem leftSection={<Edit size={14} />}>
        تحرير (متاح)
      </MenuItem>
      <MenuItem leftSection={<Copy size={14} />} disabled>
        نسخ (معطل)
      </MenuItem>
      <MenuItem leftSection={<Download size={14} />}>
        تحميل (متاح)
      </MenuItem>
      <MenuDivider />
      <MenuItem leftSection={<Share size={14} />} disabled>
        مشاركة (معطل)
      </MenuItem>
      <MenuItem leftSection={<Trash2 size={14} />} color="red">
        حذف (متاح)
      </MenuItem>
    </Menu>
  ),
};

export const ClickableActions: Story = {
  render: () => (
    <Menu>
      <MenuItem 
        leftSection={<Star size={14} />}
        onClick={() => alert('تم إضافة العنصر للمفضلة!')}
      >
        إضافة للمفضلة
      </MenuItem>
      <MenuItem 
        leftSection={<Flag size={14} />}
        onClick={() => alert('تم الإبلاغ عن العنصر!')}
      >
        إبلاغ عن محتوى
      </MenuItem>
      <MenuItem 
        leftSection={<Archive size={14} />}
        onClick={() => alert('تم أرشفة العنصر!')}
      >
        أرشفة
      </MenuItem>
      <MenuDivider />
      <MenuItem 
        leftSection={<Copy size={14} />}
        onClick={() => {
          navigator.clipboard.writeText('تم نسخ النص!');
          alert('تم النسخ للحافظة!');
        }}
      >
        نسخ الرابط
      </MenuItem>
    </Menu>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <Menu width={180} withArrow shadow="xs">
        <MenuLabel>قائمة بسيطة</MenuLabel>
        <MenuItem>خيار 1</MenuItem>
        <MenuItem>خيار 2</MenuItem>
      </Menu>

      <Menu width={250} withArrow shadow="xl">
        <MenuLabel>قائمة كبيرة</MenuLabel>
        <MenuItem leftSection={<User size={14} />}>
          ملف شخصي مفصل
        </MenuItem>
        <MenuItem leftSection={<Settings size={14} />}>
          إعدادات متقدمة
        </MenuItem>
        <MenuDivider />
        <MenuItem leftSection={<LogOut size={14} />} color="red">
          تسجيل خروج آمن
        </MenuItem>
      </Menu>

      <Menu 
        width={200}
        position="top"
        trigger={<Button variant="outline">قائمة علوية</Button>}
      >
        <MenuItem>يفتح للأعلى</MenuItem>
        <MenuItem>مع مسافة إضافية</MenuItem>
      </Menu>
    </div>
  ),
};

export const ContextMenu: Story = {
  render: () => (
    <div style={{
      padding: '2rem',
      borderRadius: '0.5rem',
      textAlign: 'center',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem'
    }}>
      <p>مثال على القائمة السياقية</p>
      
      <Menu
        trigger={<Button variant="outline">فتح القائمة</Button>}
        width={200}
      >
        <MenuLabel>إجراءات سياقية</MenuLabel>
        <MenuItem leftSection={<Copy size={14} />}>
          نسخ المحتوى
        </MenuItem>
        <MenuItem leftSection={<Edit size={14} />}>
          تحرير النص
        </MenuItem>
        <MenuDivider />
        <MenuItem leftSection={<Download size={14} />}>
          تحميل كصورة
        </MenuItem>
        <MenuItem leftSection={<Share size={14} />}>
          مشاركة
        </MenuItem>
        <MenuDivider />
        <MenuItem leftSection={<Trash2 size={14} />} color="red">
          حذف المحتوى
        </MenuItem>
      </Menu>
    </div>
  ),
};
