import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { Download, Settings, ArrowRight, Sun, Moon, ChevronLeft } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: 'padded',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1200px', height: '800px' },
        },
        wide: {
          name: 'Wide Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
      defaultViewport: 'desktop',
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--color-white)' },
        { name: 'dark', value: 'var(--color-black)' },
        { name: 'grey', value: 'var(--color-bg-subtle)' },
      ],
    },
    docs: {
      story: {
        inline: true,
        iframeHeight: 'auto',
        height: 'auto',
      },
      canvas: {
        sourceState: 'shown',
      },
      description: {
        component: 'مكون الأزرار المرن والقابل للتخصيص مع دعم كامل للألوان والأحجام المتعددة ودعم RTL',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: {
      control: { type: "select" },
      options: [
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "compact-xs",
        "compact-sm",
        "compact-md",
        "compact-lg",
        "compact-xl",
      ],
    },
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline", "ghost", "gradient", "danger"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    autoContrast: { control: "boolean" },
  },
  args: {
    children: "زر أساسي",
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  args: { children: "زر أساسي" },
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};

export const Variants: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
    docs: { 
      description: { 
        story: 'عرض جميع متغيرات الأزرار المتاحة مع التصميم المتجاوب.' 
      },
    },
  },
  render: (args) => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      maxWidth: '100%',
      padding: '1rem',
    }}>
      <Button {...args} variant="primary">أساسي</Button>
      <Button {...args} variant="secondary">ثانوي</Button>
      <Button {...args} variant="outline">محدد</Button>
      <Button {...args} variant="ghost">شفاف</Button>
      <Button {...args} variant="gradient">متدرج</Button>
      <Button {...args} variant="danger">خطر</Button>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: { 
      description: { 
        story: 'مقارنة بين الأحجام المختلفة للأزرار - من الصغير جداً إلى الكبير جداً.' 
      },
    },
  },
  render: (args) => (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      justifyContent: 'center',
    }}>
      <Button {...args} size="xs">صغير جداً</Button>
      <Button {...args} size="sm">صغير</Button>
      <Button {...args} size="md">متوسط</Button>
      <Button {...args} size="lg">كبير</Button>
      <Button {...args} size="xl">كبير جداً</Button>
    </div>
  ),
};

export const CompactSizes: Story = {
  parameters: {
    docs: { 
      description: { 
        story: 'الأحجام المضغوطة تحافظ على نفس حجم الخط مع تقليل الحشوة والارتفاع.' 
      },
    },
  },
  render: (args) => (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      justifyContent: 'center',
    }}>
      <Button {...args} size="compact-xs">مضغوط XS</Button>
      <Button {...args} size="compact-sm">مضغوط SM</Button>
      <Button {...args} size="compact-md">مضغوط MD</Button>
      <Button {...args} size="compact-lg">مضغوط LG</Button>
      <Button {...args} size="compact-xl">مضغوط XL</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} leftSection={<Download size={16} />}>تحميل</Button>
      <Button {...args} rightSection={<ArrowRight size={16} />}>التالي</Button>
      <Button {...args} leftSection={<Settings size={16} />} rightSection={<ArrowRight size={16} />}>
        الإعدادات
      </Button>
    </div>
  ),
};

export const GradientVariant: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="gradient">متدرج افتراضي</Button>
      <Button {...args} variant="gradient" gradient={{ from: 'var(--color-primary)', to: 'var(--color-alternate)', deg: 135 }}>
        متدرج مخصص
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>عادي</Button>
      <Button {...args} loading>جاري التحميل</Button>
      <Button {...args} disabled>معطل</Button>
      <Button {...args} loading loaderProps={{ type: 'dots' }}>نقاط</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Button {...args} fullWidth>زر بالعرض الكامل</Button>
    </div>
  ),
};

export const ThemeVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Button {...args} leftSection={<ChevronLeft size={16} />}>رجوع</Button>
        <Button {...args} rightSection={<ChevronLeft size={16} />}>التالي</Button>
      </div>
      <div className="flex gap-3">
        <Button {...args} variant="ghost" leftSection={<Sun size={16} />}>فاتح</Button>
        <Button {...args} variant="ghost" leftSection={<Moon size={16} />}>داكن</Button>
      </div>
    </div>
  ),
};
