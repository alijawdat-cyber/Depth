import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PinInput } from './PinInput';

const meta: Meta<typeof PinInput> = {
  title: 'Atoms/PinInput',
  component: PinInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'PinInput component for entering verification codes, PINs, or other secure codes. Features customizable length, type validation, and accessibility support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    length: {
      control: { type: 'range', min: 2, max: 10, step: 1 },
      description: 'Number of input fields',
    },
    type: {
      control: 'select',
      options: ['alphanumeric', 'number'],
      description: 'Input type validation',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of input fields',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether inputs are disabled',
    },
    error: {
      control: 'boolean',
      description: 'Whether to show error state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder character',
    },
    oneTimeCode: {
      control: 'boolean',
      description: 'Whether inputs are for one-time code',
    },
    mask: {
      control: 'boolean',
      description: 'Whether to mask input values',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Border radius',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PinInput>;

export const Default: Story = {
  args: {
    length: 4,
    type: 'number',
    size: 'md',
    placeholder: '○',
  },
};

export const SixDigit: Story = {
  args: {
    length: 6,
    type: 'number',
    size: 'md',
    placeholder: '○',
    oneTimeCode: true,
  },
};

export const Alphanumeric: Story = {
  args: {
    length: 5,
    type: 'alphanumeric',
    size: 'md',
    placeholder: '○',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Extra Small</p>
        <PinInput length={4} size="xs" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Small</p>
        <PinInput length={4} size="sm" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Medium</p>
        <PinInput length={4} size="md" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Large</p>
        <PinInput length={4} size="lg" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Extra Large</p>
        <PinInput length={4} size="xl" />
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Default</p>
        <PinInput length={4} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>With Value</p>
        <PinInput length={4} defaultValue="1234" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Error State</p>
        <PinInput length={4} error defaultValue="123" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Disabled</p>
        <PinInput length={4} disabled defaultValue="1234" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Masked</p>
        <PinInput length={4} mask defaultValue="1234" />
      </div>
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Extra Small Radius</p>
        <PinInput length={4} radius="xs" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Small Radius</p>
        <PinInput length={4} radius="sm" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Medium Radius</p>
        <PinInput length={4} radius="md" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Large Radius</p>
        <PinInput length={4} radius="lg" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Extra Large Radius</p>
        <PinInput length={4} radius="xl" />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: function InteractiveComponent() {
    const [value, setValue] = React.useState('');
    const [isComplete, setIsComplete] = React.useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-md)', fontWeight: 'var(--fw-semibold)' }}>
            Enter Verification Code
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: 'var(--fs-sm)' }}>
            We sent a 6-digit code to your phone
          </p>
        </div>
        
        <PinInput
          length={6}
          type="number"
          size="lg"
          value={value}
          onChange={setValue}
          onComplete={() => {
            setIsComplete(true);
            setTimeout(() => setIsComplete(false), 2000);
          }}
          oneTimeCode
        />
        
        {value && (
          <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
            Current value: <strong>{value}</strong>
          </p>
        )}
        
        {isComplete && (
          <p style={{ margin: 0, fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)' }}>
            ✅ Code completed!
          </p>
        )}
      </div>
    );
  },
};
