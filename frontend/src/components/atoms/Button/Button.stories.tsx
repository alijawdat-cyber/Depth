import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { Sun, Moon, ChevronLeft } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "inline-radio" }, options: ["sm", "md", "lg"] },
    variant: { control: { type: "select" }, options: ["primary", "secondary", "outline", "ghost"] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  args: { children: "زر أساسي" },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="ghost">Ghost</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">صغير</Button>
      <Button {...args} size="md">متوسط</Button>
      <Button {...args} size="lg">كبير</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Button {...args} leftIcon={<ChevronLeft size={16} />}>رجوع</Button>
        <Button {...args} rightIcon={<ChevronLeft size={16} />}>التالي</Button>
      </div>
      <div className="flex gap-3">
        <Button {...args} variant="ghost" leftIcon={<Sun size={16} />}>فاتح</Button>
        <Button {...args} variant="ghost" leftIcon={<Moon size={16} />}>داكن</Button>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Button {...args}>افتراضي</Button>
      <Button {...args} disabled>معطّل</Button>
      <Button {...args} loading>تحميل…</Button>
    </div>
  ),
};
