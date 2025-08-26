import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Burger } from './Burger';
import type { BurgerProps } from './Burger';

const meta: Meta<typeof Burger> = {
  title: 'Atoms/Burger',
  component: Burger,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    opened: {
      control: 'boolean',
      description: 'Whether the burger menu is opened',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the burger menu',
    },
    color: {
      control: 'color',
      description: 'Color of the burger lines',
    },
    transitionDuration: {
      control: { type: 'range', min: 0, max: 1000, step: 50 },
      description: 'Animation duration in milliseconds',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive template for stories with state
const BurgerTemplate = (args: Partial<BurgerProps>) => {
  const [opened, setOpened] = useState(args?.opened || false);

  return (
    <Burger
      {...args}
      opened={opened}
      onClick={() => setOpened(!opened)}
    />
  );
};

// Hook component for complex stories
const BurgerWithState = ({ initialOpened = false, ...props }: { initialOpened?: boolean } & Partial<BurgerProps>) => {
  const [opened, setOpened] = useState(initialOpened);
  return (
    <Burger
      {...props}
      opened={opened}
      onClick={() => setOpened(!opened)}
    />
  );
};

export const Default: Story = {
  render: BurgerTemplate,
  args: {
    opened: false,
    size: 'md',
  },
};

export const Opened: Story = {
  render: BurgerTemplate,
  args: {
    opened: true,
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} style={{ textAlign: 'center' }}>
          <BurgerWithState size={size} />
          <div className="text-xs mt-2">
            {size}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const CustomColor: Story = {
  render: BurgerTemplate,
  args: {
    opened: false,
    size: 'lg',
    color: 'var(--depth-primary)',
  },
};

export const FastTransition: Story = {
  render: BurgerTemplate,
  args: {
    opened: false,
    size: 'lg',
    transitionDuration: 100,
  },
};

export const SlowTransition: Story = {
  render: BurgerTemplate,
  args: {
    opened: false,
    size: 'lg',
    transitionDuration: 800,
  },
};

export const InNavigationContext: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-3 bg-surface border border-border rounded-md">
      <BurgerWithState size="md" />
      <div className="text-base font-semibold">
        Navigation Menu
      </div>
    </div>
  ),
};
