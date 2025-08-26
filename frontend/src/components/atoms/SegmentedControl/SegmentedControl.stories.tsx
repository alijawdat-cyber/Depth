import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SegmentedControl } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Atoms/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SegmentedControl component for selecting between multiple mutually exclusive options. Perfect for tabs, view toggles, and filtering controls.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Data for segments',
    },
    value: {
      control: 'text',
      description: 'Current selected value',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the control',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the control',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether control is disabled',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether control takes full width',
    },
    radius: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Border radius',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  args: {
    data: ['Daily', 'Weekly', 'Monthly'],
    defaultValue: 'Weekly',
    size: 'sm',
  },
};

export const WithObjects: Story = {
  args: {
    data: [
      { label: 'List View', value: 'list' },
      { label: 'Grid View', value: 'grid' },
      { label: 'Card View', value: 'card' },
    ],
    defaultValue: 'grid',
    size: 'sm',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Extra Small</p>
        <SegmentedControl data={['Option 1', 'Option 2', 'Option 3']} size="xs" defaultValue="Option 2" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Small</p>
        <SegmentedControl data={['Option 1', 'Option 2', 'Option 3']} size="sm" defaultValue="Option 2" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Medium</p>
        <SegmentedControl data={['Option 1', 'Option 2', 'Option 3']} size="md" defaultValue="Option 2" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Large</p>
        <SegmentedControl data={['Option 1', 'Option 2', 'Option 3']} size="lg" defaultValue="Option 2" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Extra Large</p>
        <SegmentedControl data={['Option 1', 'Option 2', 'Option 3']} size="xl" defaultValue="Option 2" />
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    data: [
      { label: 'Profile Settings', value: 'profile' },
      { label: 'Account Security', value: 'security' },
      { label: 'Notifications', value: 'notifications' },
      { label: 'Privacy', value: 'privacy' },
    ],
    orientation: 'vertical',
    defaultValue: 'profile',
    size: 'sm',
  },
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <SegmentedControl
        data={['Overview', 'Analytics', 'Reports']}
        fullWidth
        defaultValue="Analytics"
        size="md"
      />
    </div>
  ),
};

export const WithDisabledOptions: Story = {
  args: {
    data: [
      { label: 'Available', value: 'available' },
      { label: 'Coming Soon', value: 'coming', disabled: true },
      { label: 'Active', value: 'active' },
      { label: 'Maintenance', value: 'maintenance', disabled: true },
    ],
    defaultValue: 'active',
    size: 'sm',
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Default</p>
        <SegmentedControl data={['Option 1', 'Option 2', 'Option 3']} defaultValue="Option 2" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Disabled</p>
        <SegmentedControl data={['Option 1', 'Option 2', 'Option 3']} defaultValue="Option 2" disabled />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Read Only</p>
        <SegmentedControl data={['Option 1', 'Option 2', 'Option 3']} defaultValue="Option 2" readOnly />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: function InteractiveComponent() {
    const [viewMode, setViewMode] = React.useState('grid');
    const [timeRange, setTimeRange] = React.useState('week');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 'var(--fs-md)', fontWeight: 'var(--fw-semibold)' }}>
            View Mode
          </h3>
          <SegmentedControl
            data={[
              { label: '📋 List', value: 'list' },
              { label: '📊 Grid', value: 'grid' },
              { label: '📁 Card', value: 'card' },
            ]}
            value={viewMode}
            onChange={setViewMode}
            size="md"
          />
          <p style={{ margin: '12px 0 0 0', fontSize: 'var(--fs-sm)' }}>
            Current view: <strong>{viewMode}</strong>
          </p>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 'var(--fs-md)', fontWeight: 'var(--fw-semibold)' }}>
            Time Range
          </h3>
          <SegmentedControl
            data={['Day', 'Week', 'Month', 'Year']}
            value={timeRange}
            onChange={setTimeRange}
            size="sm"
          />
          <p style={{ margin: '12px 0 0 0', fontSize: 'var(--fs-sm)' }}>
            Selected range: <strong>{timeRange}</strong>
          </p>
        </div>
      </div>
    );
  },
};

export const InContext: Story = {
  render: function ContextComponent() {
    const [activeTab, setActiveTab] = React.useState('overview');

    const renderContent = () => {
      switch (activeTab) {
        case 'overview':
          return (
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-md)', fontWeight: 'var(--fw-semibold)' }}>
                Overview
              </h4>
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)', lineHeight: 1.5 }}>
                Welcome to your dashboard overview. Here you can see the most important metrics and recent activity.
              </p>
            </div>
          );
        case 'analytics':
          return (
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-md)', fontWeight: 'var(--fw-semibold)' }}>
                Analytics
              </h4>
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)', lineHeight: 1.5 }}>
                View detailed analytics and performance metrics for your account and projects.
              </p>
            </div>
          );
        case 'settings':
          return (
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-md)', fontWeight: 'var(--fw-semibold)' }}>
                Settings
              </h4>
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)', lineHeight: 1.5 }}>
                Manage your account settings, preferences, and configuration options.
              </p>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div style={{ width: '400px', padding: '20px', borderRadius: 'var(--radius-md)' }}>
        <SegmentedControl
          data={[
            { label: 'Overview', value: 'overview' },
            { label: 'Analytics', value: 'analytics' },
            { label: 'Settings', value: 'settings' },
          ]}
          value={activeTab}
          onChange={setActiveTab}
          fullWidth
          size="sm"
        />
        
        <div style={{ marginTop: '20px', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
          {renderContent()}
        </div>
      </div>
    );
  },
};
