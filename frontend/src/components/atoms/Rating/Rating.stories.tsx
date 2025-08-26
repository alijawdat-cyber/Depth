import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Atoms/Rating',
  component: Rating,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون التقييم لتقييم النجوم ومراجعات المنتجات وملاحظات المستخدمين. يدعم التقييمات الجزئية والرموز المخصصة والحالات التفاعلية. يحافظ على اتجاه LTR للنجوم حتى في واجهة RTL.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl', fontFamily: 'Dubai, sans-serif' }} className="rtl-container">
        <div style={{ direction: 'ltr', display: 'inline-block' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 5, step: 0.5 },
      description: 'قيمة التقييم الحالية',
    },
    count: {
      control: { type: 'range', min: 3, max: 10, step: 1 },
      description: 'عدد النجوم الأقصى',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم نجوم التقييم',
    },
    readOnly: {
      control: 'boolean',
      description: 'هل التقييم للقراءة فقط',
    },
    fractions: {
      control: 'select',
      options: [1, 2, 3, 4],
      description: 'عدد الأجزاء في كل نجمة',
    },
    highlightSelectedOnly: {
      control: 'boolean',
      description: 'إبراز التقييم المحدد فقط',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  render: function DefaultRating() {
    const [value, setValue] = React.useState(3);
    
    return (
      <div>
        <Rating
          value={value}
          onChange={setValue}
          count={5}
          size="md"
        />
        <div className="slider-value-display" style={{ textAlign: 'center', marginTop: '8px' }}>
          التقييم: {value} من 5
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'التقييم الأساسي التفاعلي مع عرض القيمة الحالية.' } }
  }
};

export const ReadOnly: Story = {
  args: {
    value: 4.5,
    count: 5,
    size: 'md',
    readOnly: true,
    fractions: 2,
  },
  parameters: {
    docs: { description: { story: 'تقييم للقراءة فقط مع دعم النصف نجمة.' } }
  }
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Extra Small</p>
        <Rating value={4} size="xs" readOnly />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Small</p>
        <Rating value={4} size="sm" readOnly />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Medium</p>
        <Rating value={4} size="md" readOnly />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Large</p>
        <Rating value={4} size="lg" readOnly />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Extra Large</p>
        <Rating value={4} size="xl" readOnly />
      </div>
    </div>
  ),
};

export const FractionalRating: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Half Stars (2 fractions)</p>
        <Rating value={3.5} fractions={2} size="lg" readOnly />
        <p style={{ margin: '8px 0 0 0', fontSize: 'var(--fs-xs)' }}>3.5 out of 5</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Quarter Stars (4 fractions)</p>
        <Rating value={2.75} fractions={4} size="lg" readOnly />
        <p style={{ margin: '8px 0 0 0', fontSize: 'var(--fs-xs)' }}>2.75 out of 5</p>
      </div>
    </div>
  ),
};

export const CustomCount: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>3 Stars Max</p>
        <Rating value={2} count={3} size="lg" readOnly />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>10 Stars Max</p>
        <Rating value={7} count={10} size="sm" readOnly />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: function InteractiveComponent() {
    const [rating, setRating] = React.useState(0);
    const [hovered, setHovered] = React.useState(-1);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-md)', fontWeight: 'var(--fw-semibold)' }}>
            Rate this product
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: 'var(--fs-sm)' }}>
            Click to select your rating
          </p>
        </div>
        
        <Rating
          value={rating}
          onChange={setRating}
          onHover={setHovered}
          size="xl"
          fractions={2}
        />
        
        <div style={{ textAlign: 'center', minHeight: '40px' }}>
          {hovered > 0 ? (
            <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
              Hovering: <strong>{hovered}</strong> stars
            </p>
          ) : rating > 0 ? (
            <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
              Your rating: <strong>{rating}</strong> out of 5 stars
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
              No rating selected
            </p>
          )}
        </div>
      </div>
    );
  },
};

export const CustomSymbols: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Hearts</p>
        <Rating 
          value={4}
          size="lg"
          readOnly
          emptySymbol="🤍"
          fullSymbol="❤️"
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-medium)' }}>Thumbs Up</p>
        <Rating 
          value={3}
          size="lg"
          readOnly
          emptySymbol="👎"
          fullSymbol="👍"
        />
      </div>
    </div>
  ),
};

export const ProductReview: Story = {
  render: () => (
    <div style={{ width: '320px', padding: '16px', borderRadius: 'var(--radius-md)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--fs-sm)',
          fontWeight: 'var(--fw-bold)'
        }}>
          👤
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)' }}>Sarah Johnson</span>
            <Rating value={5} size="sm" readOnly />
          </div>
          <p style={{ margin: '0 0 8px 0', fontSize: 'var(--fs-xs)' }}>2 days ago</p>
          <p style={{ margin: 0, fontSize: 'var(--fs-sm)', lineHeight: 1.5 }}>
            Amazing product! Exceeded my expectations. The quality is fantastic and delivery was super fast. 
            Highly recommend to everyone!
          </p>
        </div>
      </div>
    </div>
  ),
};
