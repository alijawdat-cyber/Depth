import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary', label: 'Primary' } };
export const Secondary: Story = { args: { variant: 'secondary', label: 'Secondary' } };
export const Outline: Story = { args: { variant: 'outline', label: 'Outline' } };
export const Ghost: Story = { args: { variant: 'ghost', label: 'Ghost' } };
export const Sizes: Story = {
  args: { label: 'MD' },
  render: () => (
    <div className="flex gap-[var(--space-4)]">
      <Button label="SM" size="sm" />
      <Button label="MD" size="md" />
      <Button label="LG" size="lg" />
    </div>
  )
};
