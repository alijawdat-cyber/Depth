import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta = {
  title: 'Molecules/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'مكون StatusBadge لعرض حالات مختلفة مع أيقونات وألوان مناسبة'
      }
    }
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: [
        'active', 
        'inactive', 
        'pending', 
        'completed', 
        'failed', 
        'warning',
        'draft',
        'published',
        'archived',
        'processing'
      ]
    },
    withIcon: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    variant: {
      control: { type: 'select' },
      options: ['filled', 'light', 'outline']
    },
    label: { control: 'text' }
  }
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'active'
  }
};

export const Active: Story = {
  args: {
    status: 'active'
  }
};

export const Inactive: Story = {
  args: {
    status: 'inactive'
  }
};

export const Pending: Story = {
  args: {
    status: 'pending'
  }
};

export const Completed: Story = {
  args: {
    status: 'completed'
  }
};

export const Failed: Story = {
  args: {
    status: 'failed'
  }
};

export const Warning: Story = {
  args: {
    status: 'warning'
  }
};

export const Draft: Story = {
  args: {
    status: 'draft'
  }
};

export const Published: Story = {
  args: {
    status: 'published'
  }
};

export const Archived: Story = {
  args: {
    status: 'archived'
  }
};

export const Processing: Story = {
  args: {
    status: 'processing'
  }
};

export const SmallSize: Story = {
  args: {
    status: 'active',
    size: 'xs'
  }
};

export const LargeSize: Story = {
  args: {
    status: 'active',
    size: 'xl'
  }
};

export const FilledVariant: Story = {
  args: {
    status: 'active',
    variant: 'filled'
  }
};

export const OutlineVariant: Story = {
  args: {
    status: 'active',
    variant: 'outline'
  }
};

export const WithoutIcon: Story = {
  args: {
    status: 'active',
    withIcon: false
  }
};

export const CustomLabel: Story = {
  args: {
    status: 'active',
    label: 'متاح الآن'
  }
};
