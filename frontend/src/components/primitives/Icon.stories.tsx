import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon icon="Heart" size="sm" />
      <Icon icon="Heart" size="md" />
      <Icon icon="Heart" size="lg" />
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <span className="text-[var(--fg)]"><Icon icon="CheckCircle2" /></span>
      <span className="text-[var(--fg-muted)]"><Icon icon="Info" /></span>
      <span className="text-[var(--primary)]"><Icon icon="Star" /></span>
      <span className="text-[var(--warning)]"><Icon icon="AlertTriangle" /></span>
      <span className="text-[var(--danger)]"><Icon icon="XCircle" /></span>
    </div>
  ),
};
