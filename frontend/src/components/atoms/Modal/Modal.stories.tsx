import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button';

const meta: Meta<typeof Modal> = {
  title: 'Atoms/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون النافذة المنبثقة - يستخدم لإظهار المحتوى في طبقة منفصلة مع إمكانية التفاعل وتخصيص الحجم.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'auto'],
    },
    padding: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    centered: {
      control: 'boolean',
    },
    closeOnClickOutside: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
    withCloseButton: {
      control: 'boolean',
    },
    fullScreen: {
      control: 'boolean',
    },
    withBorder: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// مكون مساعد للتحكم في حالة المودال
function ModalWrapper(props: Partial<React.ComponentProps<typeof Modal>> & { triggerText?: string }) {
  const [opened, setOpened] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setOpened(true)}>
        {props.triggerText || 'فتح النافذة'}
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        {...props}
      >
        {props.children || 'محتوى النافذة الافتراضي'}
      </Modal>
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <ModalWrapper
      {...args}
      title="عنوان النافذة"
    >
      <div>
        <p>محتوى النافذة المنبثقة يأتي هنا.</p>
        <p>يمكن أن يحتوي على أي عنصر تريده.</p>
      </div>
    </ModalWrapper>
  ),
};

export const Small: Story = {
  render: (args) => (
    <ModalWrapper
      {...args}
      title="نافذة صغيرة"
      size="sm"
    >
      <p>نافذة بحجم صغير للرسائل البسيطة.</p>
    </ModalWrapper>
  ),
};

export const Large: Story = {
  render: (args) => (
    <ModalWrapper
      {...args}
      title="نافذة كبيرة"
      size="lg"
    >
      <div>
        <p>نافذة كبيرة تتسع لمحتوى أكثر.</p>
        <p>يمكن استخدامها للنماذج الطويلة أو المحتوى التفصيلي.</p>
        <div style={{ marginTop: '20px' }}>
          <h4>قسم فرعي</h4>
          <p>المزيد من المحتوى هنا...</p>
        </div>
      </div>
    </ModalWrapper>
  ),
};

export const WithoutTitle: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <div style={{ textAlign: 'center' }}>
        <h3>نافذة بدون عنوان</h3>
        <p>يمكن إخفاء شريط العنوان عند الحاجة.</p>
      </div>
    </ModalWrapper>
  ),
};

export const ConfirmationDialog: Story = {
  render: (args) => (
    <ModalWrapper
      {...args}
      title="تأكيد الحذف"
      size="sm"
    >
      <div>
        <p>هل أنت متأكد من رغبتك في حذف هذا العنصر؟</p>
        <p>لا يمكن التراجع عن هذا الإجراء.</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <Button variant="outline">إلغاء</Button>
          <Button variant="primary">تأكيد الحذف</Button>
        </div>
      </div>
    </ModalWrapper>
  ),
};
