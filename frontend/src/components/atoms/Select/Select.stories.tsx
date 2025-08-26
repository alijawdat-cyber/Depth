import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { GlobeIcon } from 'lucide-react';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fieldSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    searchable: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// البيانات التجريبية
const cities = [
  { value: 'baghdad', label: 'بغداد' },
  { value: 'basra', label: 'البصرة' },
  { value: 'erbil', label: 'أربيل' },
  { value: 'najaf', label: 'النجف' },
  { value: 'karbala', label: 'كربلاء' },
  { value: 'mosul', label: 'الموصل' },
  { value: 'kirkuk', label: 'كركوك' },
];

const countries = [
  { value: 'iq', label: 'العراق' },
  { value: 'sa', label: 'السعودية' },
  { value: 'ae', label: 'الإمارات' },
  { value: 'kw', label: 'الكويت' },
  { value: 'qa', label: 'قطر' },
  { value: 'bh', label: 'البحرين' },
  { value: 'om', label: 'عمان' },
];

export const Default: Story = {
  args: {
    data: cities,
    label: 'اختر المدينة',
    placeholder: 'اختر من القائمة...',
  },
};

export const WithDescription: Story = {
  args: {
    data: cities,
    label: 'المدينة',
    helperText: 'اختر المدينة التي تقيم فيها',
    placeholder: 'اختر مدينتك...',
  },
};

export const WithError: Story = {
  args: {
    data: cities,
    label: 'المدينة',
    error: 'يرجى اختيار مدينة',
    placeholder: 'اختر مدينتك...',
  },
};

export const WithLeftIcon: Story = {
  args: {
    data: countries,
    label: 'البلد',
    leftIcon: <GlobeIcon size={16} />,
    placeholder: 'اختر البلد...',
  },
};

export const Searchable: Story = {
  args: {
    data: cities,
    label: 'البحث في المدن',
    searchable: true,
    placeholder: 'ابحث أو اختر مدينة...',
  },
};

export const Clearable: Story = {
  args: {
    data: cities,
    label: 'المدينة (قابل للمسح)',
    clearable: true,
    placeholder: 'اختر مدينتك...',
    defaultValue: 'baghdad',
  },
};

export const Small: Story = {
  args: {
    data: cities,
    label: 'حجم صغير',
    fieldSize: 'sm',
    placeholder: 'اختر مدينتك...',
  },
};

export const Large: Story = {
  args: {
    data: cities,
    label: 'حجم كبير',
    fieldSize: 'lg',
    placeholder: 'اختر مدينتك...',
  },
};

export const Disabled: Story = {
  args: {
    data: cities,
    label: 'معطل',
    disabled: true,
    placeholder: 'غير متاح...',
  },
};

export const Required: Story = {
  args: {
    data: cities,
    label: 'المدينة',
    required: true,
    placeholder: 'اختر مدينتك...',
  },
};
