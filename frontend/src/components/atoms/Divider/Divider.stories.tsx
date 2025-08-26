import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Divider component provides visual separation between content sections. Supports horizontal and vertical orientations with labels and various styling options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Divider orientation',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size/thickness of the divider',
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Visual style of the line',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'neutral'],
      description: 'Color theme',
    },
    label: {
      control: 'text',
      description: 'Label text to display',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Position of the label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    size: 'xs',
    variant: 'solid',
    color: 'neutral',
  },
};

export const WithLabel: Story = {
  args: {
    orientation: 'horizontal',
    size: 'xs',
    variant: 'solid',
    color: 'neutral',
    label: 'Or continue with',
    labelPosition: 'center',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: 'var(--fs-sm)' }}>Extra Small</p>
        <Divider size="xs" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: 'var(--fs-sm)' }}>Small</p>
        <Divider size="sm" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: 'var(--fs-sm)' }}>Medium</p>
        <Divider size="md" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: 'var(--fs-sm)' }}>Large</p>
        <Divider size="lg" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: 'var(--fs-sm)' }}>Extra Large</p>
        <Divider size="xl" />
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <Divider color="neutral" label="Neutral" />
      <Divider color="primary" label="Primary" />
      <Divider color="success" label="Success" />
      <Divider color="warning" label="Warning" />
      <Divider color="error" label="Error" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <Divider variant="solid" label="Solid Line" />
      <Divider variant="dashed" label="Dashed Line" />
      <Divider variant="dotted" label="Dotted Line" />
    </div>
  ),
};

export const LabelPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <Divider label="Left Aligned" labelPosition="left" />
      <Divider label="Center Aligned" labelPosition="center" />
      <Divider label="Right Aligned" labelPosition="right" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '200px' }}>
      <div style={{ padding: '16px', fontSize: 'var(--fs-sm)' }}>
        Section 1
      </div>
      <Divider orientation="vertical" size="sm" />
      <div style={{ padding: '16px', fontSize: 'var(--fs-sm)' }}>
        Section 2
      </div>
      <Divider orientation="vertical" size="sm" color="primary" />
      <div style={{ padding: '16px', fontSize: 'var(--fs-sm)' }}>
        Section 3
      </div>
    </div>
  ),
};

export const CustomSpacing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <div>
        <p>Content before divider</p>
        <Divider my="24px" label="Large spacing" />
        <p>Content after divider</p>
      </div>
      
      <div>
        <p>Content before divider</p>
        <Divider my="8px" label="Small spacing" />
        <p>Content after divider</p>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div style={{ width: '400px', padding: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontFamily: 'var(--font-family)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)' }}>
        Account Settings
      </h3>
      
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-md)', fontWeight: 'var(--fw-medium)' }}>Profile Information</h4>
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>Update your account details and preferences</p>
      </div>
      
      <Divider my="20px" />
      
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-md)', fontWeight: 'var(--fw-medium)' }}>Security Settings</h4>
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>Manage your password and security preferences</p>
      </div>
      
      <Divider my="20px" color="primary" />
      
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-md)', fontWeight: 'var(--fw-medium)' }}>Notifications</h4>
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>Configure your notification settings</p>
      </div>
    </div>
  ),
};
