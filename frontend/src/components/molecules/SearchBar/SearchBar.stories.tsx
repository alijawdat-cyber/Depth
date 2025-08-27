import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from './SearchBar';

const meta = {
  title: 'Design System/Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون SearchBar لإدخال البحث مع إمكانية الفلترة'
      }
    }
  },
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    filterable: { control: 'boolean' },
    activeFiltersCount: { control: { type: 'range', min: 0, max: 10 } },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
    onFilterClick: { action: 'filter clicked' }
  }
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// القصة الافتراضية
export const Default: Story = {
  args: {
    placeholder: 'البحث...'
  }
};

// مع قيمة مبدئية
export const WithValue: Story = {
  args: {
    value: 'نص البحث',
    placeholder: 'البحث...'
  }
};

// مع إمكانية الفلترة
export const WithFilter: Story = {
  args: {
    filterable: true,
    placeholder: 'البحث في المنتجات...'
  }
};

// مع فلاتر نشطة
export const WithActiveFilters: Story = {
  args: {
    filterable: true,
    activeFiltersCount: 3,
    placeholder: 'البحث...'
  }
};

// حالة معطل
export const Disabled: Story = {
  args: {
    disabled: true,
    filterable: true,
    placeholder: 'البحث معطل...'
  }
};

// مع فلاتر معطلة
export const DisabledWithFilters: Story = {
  args: {
    disabled: true,
    filterable: true,
    activeFiltersCount: 2,
    placeholder: 'البحث معطل...'
  }
};

// بحث في المستخدمين
export const UserSearch: Story = {
  args: {
    filterable: true,
    activeFiltersCount: 1,
    placeholder: 'البحث في المستخدمين...'
  }
};

// بحث في الطلبات
export const OrderSearch: Story = {
  args: {
    filterable: true,
    placeholder: 'البحث في الطلبات بالرقم أو اسم العميل...'
  }
};

// بحث في المنتجات
export const ProductSearch: Story = {
  args: {
    filterable: true,
    activeFiltersCount: 5,
    placeholder: 'البحث في المنتجات بالاسم أو الفئة...'
  }
};

// بحث عام
export const GeneralSearch: Story = {
  args: {
    placeholder: 'البحث عام...'
  }
};
