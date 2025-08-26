import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { InputField } from "./InputField";
import { Mail, User, Phone, Search } from "lucide-react";

const meta: Meta<typeof InputField> = {
  title: "Atoms/InputField",
  component: InputField,
  tags: ["autodocs"],
  argTypes: {
    fieldSize: { 
      control: { type: "select" }, 
      options: ["xs", "sm", "md", "lg", "xl"] 
    },
    variant: { 
      control: { type: "select" }, 
      options: ["default", "filled", "unstyled"] 
    },
    type: { 
      control: { type: "select" }, 
      options: ["text", "password", "email", "tel", "search", "url", "number"] 
    },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    placeholder: "أدخل النص هنا",
  },
};
export default meta;

type Story = StoryObj<typeof InputField>;

export const Basic: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3" style={{ width: '300px' }}>
      <InputField {...args} fieldSize="xs" placeholder="صغير جداً (XS)" />
      <InputField {...args} fieldSize="sm" placeholder="صغير (SM)" />
      <InputField {...args} fieldSize="md" placeholder="متوسط (MD)" />
      <InputField {...args} fieldSize="lg" placeholder="كبير (LG)" />
      <InputField {...args} fieldSize="xl" placeholder="كبير جداً (XL)" />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3" style={{ width: '300px' }}>
      <InputField {...args} variant="default" placeholder="افتراضي" />
      <InputField {...args} variant="filled" placeholder="ممتلئ" />
      <InputField {...args} variant="unstyled" placeholder="بدون تصميم" />
    </div>
  ),
};

export const WithLabelsAndHelpers: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4" style={{ width: '300px' }}>
      <InputField 
        {...args} 
        label="الاسم"
        placeholder="أدخل اسمك"
        description="اسمك الكامل كما يظهر في الهوية"
      />
      <InputField 
        {...args} 
        label="البريد الإلكتروني"
        type="email"
        placeholder="example@domain.com"
        required
        description="سنرسل رسالة تأكيد لهذا البريد"
      />
      <InputField 
        {...args} 
        label="كلمة المرور"
        type="password"
        placeholder="كلمة المرور"
        error="يجب أن تحتوي على 8 أحرف على الأقل"
      />
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3" style={{ width: '300px' }}>
      <InputField 
        {...args} 
        leftSection={<User size={16} />}
        placeholder="الاسم"
      />
      <InputField 
        {...args} 
        leftSection={<Mail size={16} />}
        type="email"
        placeholder="البريد الإلكتروني"
      />
      <InputField 
        {...args} 
        leftSection={<Phone size={16} />}
        type="tel"
        placeholder="رقم الهاتف"
      />
      <InputField 
        {...args} 
        leftSection={<Search size={16} />}
        type="search"
        placeholder="البحث..."
      />
    </div>
  ),
};

export const InputTypes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3" style={{ width: '300px' }}>
      <InputField {...args} type="text" placeholder="نص عادي" label="نص" />
      <InputField {...args} type="password" placeholder="كلمة المرور" label="كلمة المرور" />
      <InputField {...args} type="email" placeholder="test@example.com" label="بريد إلكتروني" />
      <InputField {...args} type="tel" placeholder="+966 50 123 4567" label="هاتف" />
      <InputField {...args} type="number" placeholder="123" label="رقم" />
      <InputField {...args} type="url" placeholder="https://example.com" label="رابط" />
      <InputField {...args} type="search" placeholder="ابحث..." label="بحث" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3" style={{ width: '300px' }}>
      <InputField {...args} placeholder="حقل عادي" />
      <InputField {...args} disabled placeholder="معطل" />
      <InputField {...args} readOnly value="للقراءة فقط" />
      <InputField {...args} error="رسالة خطأ" placeholder="خطأ" />
      <InputField {...args} error value="قيمة خاطئة" />
    </div>
  ),
};

export const RTLDirectionHandling: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3" style={{ width: '300px' }}>
      <InputField {...args} defaultValue="مرحبا بكم في العالم" placeholder="نص عربي" />
      <InputField {...args} defaultValue="Hello World" placeholder="English text" />
      <InputField {...args} defaultValue="مرحبا Hello 123" placeholder="نص مختلط" />
      <InputField {...args} type="email" defaultValue="user@domain.com" placeholder="بريد إلكتروني" />
      <InputField {...args} type="tel" defaultValue="+966501234567" placeholder="رقم هاتف" />
    </div>
  ),
};
