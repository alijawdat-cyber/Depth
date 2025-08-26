import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import { User, Settings, Bell, Shield } from 'lucide-react';

const meta: Meta<typeof Tabs> = {
  title: 'Atoms/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'pills'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    placement: {
      control: 'select',
      options: ['left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
  {
    value: 'profile',
    label: 'الملف الشخصي',
    icon: <User size={16} />,
    children: (
      <div>
        <h3 style={{ margin: '0 0 16px 0' }}>الملف الشخصي</h3>
        <p style={{ margin: 0 }}>
          يمكنك هنا تعديل معلوماتك الشخصية مثل الاسم والبريد الإلكتروني والصورة الشخصية.
        </p>
      </div>
    ),
  },
  {
    value: 'settings',
    label: 'الإعدادات',
    icon: <Settings size={16} />,
    children: (
      <div>
        <h3 style={{ margin: '0 0 16px 0' }}>الإعدادات</h3>
        <p style={{ margin: 0 }}>
          اضبط إعدادات التطبيق حسب تفضيلاتك، مثل اللغة والإشعارات والخصوصية.
        </p>
      </div>
    ),
  },
  {
    value: 'notifications',
    label: 'الإشعارات',
    icon: <Bell size={16} />,
    children: (
      <div>
        <h3 style={{ margin: '0 0 16px 0' }}>الإشعارات</h3>
        <p style={{ margin: 0 }}>
          تحكم في أنواع الإشعارات التي تريد استلامها ومواعيد إرسالها.
        </p>
      </div>
    ),
  },
  {
    value: 'security',
    label: 'الأمان',
    icon: <Shield size={16} />,
    children: (
      <div>
        <h3 style={{ margin: '0 0 16px 0' }}>الأمان</h3>
        <p style={{ margin: 0 }}>
          قم بتحديث كلمة المرور وإعدادات المصادقة الثنائية لحماية حسابك.
        </p>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    defaultValue: 'profile',
  },
};

export const Outline: Story = {
  args: {
    items: defaultItems,
    variant: 'outline',
    defaultValue: 'profile',
  },
};

export const Pills: Story = {
  args: {
    items: defaultItems,
    variant: 'pills',
    defaultValue: 'profile',
  },
};

export const Vertical: Story = {
  args: {
    items: defaultItems,
    orientation: 'vertical',
    defaultValue: 'profile',
  },
};

export const VerticalLeft: Story = {
  args: {
    items: defaultItems,
    orientation: 'vertical',
    placement: 'left',
    defaultValue: 'profile',
  },
};

export const WithDisabled: Story = {
  args: {
    items: [
      ...defaultItems.slice(0, 2),
      {
        ...defaultItems[2],
        disabled: true,
      },
      defaultItems[3],
    ],
    defaultValue: 'profile',
  },
};

export const SimpleText: Story = {
  args: {
    items: [
      {
        value: 'tab1',
        label: 'التبويب الأول',
        children: <div>محتوى التبويب الأول</div>,
      },
      {
        value: 'tab2',
        label: 'التبويب الثاني',
        children: <div>محتوى التبويب الثاني</div>,
      },
      {
        value: 'tab3',
        label: 'التبويب الثالث',
        children: <div>محتوى التبويب الثالث</div>,
      },
    ],
    defaultValue: 'tab1',
  },
};
