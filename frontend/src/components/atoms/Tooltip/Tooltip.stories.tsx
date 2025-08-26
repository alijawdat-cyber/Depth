import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from '../Tooltip';
import { Button } from '../Button';
import { Info, HelpCircle, Settings, Star } from 'lucide-react';

const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون التلميح - يستخدم لإظهار معلومات إضافية عند التمرير أو التركيز على العناصر.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'bottom', 'left', 'right', 'top',
        'bottom-end', 'bottom-start',
        'left-end', 'left-start',
        'right-end', 'right-start',
        'top-end', 'top-start'
      ],
      description: 'موضع التلميح',
    },
    withArrow: {
      control: 'boolean',
      description: 'إظهار السهم',
    },
    multiline: {
      control: 'boolean',
      description: 'دعم أسطر متعددة',
    },
    openDelay: {
      control: 'number',
      description: 'تأخير الإظهار (ميلي ثانية)',
    },
    closeDelay: {
      control: 'number',
      description: 'تأخير الإخفاء (ميلي ثانية)',
    },
    disabled: {
      control: 'boolean',
      description: 'تعطيل التلميح',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    label: 'هذا تلميح بسيط',
    position: 'top',
    withArrow: true,
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button>مرر الماوس هنا</Button>
    </Tooltip>
  ),
};

export const Positions: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem',
      padding: '3rem',
      minHeight: '400px',
      alignItems: 'center',
      justifyItems: 'center'
    }}>
      {/* Row 1 */}
      <Tooltip label="تلميح في الأعلى يسار" position="top-start">
        <Button size="sm">أعلى-يسار</Button>
      </Tooltip>
      
      <Tooltip label="تلميح في الأعلى وسط" position="top">
        <Button size="sm">أعلى</Button>
      </Tooltip>
      
      <Tooltip label="تلميح في الأعلى يمين" position="top-end">
        <Button size="sm">أعلى-يمين</Button>
      </Tooltip>

      {/* Row 2 */}
      <Tooltip label="تلميح على اليسار أعلى" position="left-start">
        <Button size="sm">يسار-أعلى</Button>
      </Tooltip>
      
      <div style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 500 }}>
        مواضع التلميح
      </div>
      
      <Tooltip label="تلميح على اليمين أعلى" position="right-start">
        <Button size="sm">يمين-أعلى</Button>
      </Tooltip>

      {/* Row 3 */}
      <Tooltip label="تلميح على اليسار وسط" position="left">
        <Button size="sm">يسار</Button>
      </Tooltip>
      
      <div></div>
      
      <Tooltip label="تلميح على اليمين وسط" position="right">
        <Button size="sm">يمين</Button>
      </Tooltip>

      {/* Row 4 */}
      <Tooltip label="تلميح على اليسار أسفل" position="left-end">
        <Button size="sm">يسار-أسفل</Button>
      </Tooltip>
      
      <div></div>
      
      <Tooltip label="تلميح على اليمين أسفل" position="right-end">
        <Button size="sm">يمين-أسفل</Button>
      </Tooltip>

      {/* Row 5 */}
      <Tooltip label="تلميح في الأسفل يسار" position="bottom-start">
        <Button size="sm">أسفل-يسار</Button>
      </Tooltip>
      
      <Tooltip label="تلميح في الأسفل وسط" position="bottom">
        <Button size="sm">أسفل</Button>
      </Tooltip>
      
      <Tooltip label="تلميح في الأسفل يمين" position="bottom-end">
        <Button size="sm">أسفل-يمين</Button>
      </Tooltip>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Tooltip label="معلومات إضافية حول هذا العنصر">
        <Button leftSection={<Info size={16} />} variant="outline">
          معلومات
        </Button>
      </Tooltip>
      
      <Tooltip label="احصل على المساعدة حول هذه الميزة">
        <Button leftSection={<HelpCircle size={16} />} variant="outline">
          مساعدة
        </Button>
      </Tooltip>
      
      <Tooltip label="فتح إعدادات التطبيق">
        <Button leftSection={<Settings size={16} />} variant="outline">
          الإعدادات
        </Button>
      </Tooltip>
      
      <Tooltip label="إضافة إلى المفضلة">
        <Button leftSection={<Star size={16} />} variant="outline">
          مفضلة
        </Button>
      </Tooltip>
    </div>
  ),
};

export const MultilineTooltips: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      <Tooltip 
        label="هذا تلميح قصير ومفيد"
        multiline={false}
      >
        <Button>تلميح قصير</Button>
      </Tooltip>
      
      <Tooltip 
        label="هذا تلميح طويل يحتوي على معلومات مفصلة أكثر ويمكن أن يمتد عبر عدة أسطر لتوفير شرح شامل للمستخدم حول الميزة أو الوظيفة."
        multiline={true}
        w={250}
      >
        <Button>تلميح متعدد الأسطر</Button>
      </Tooltip>
      
      <Tooltip 
        label={
          <div>
            <strong>تلميح منسق</strong>
            <br />
            يمكن أن يحتوي على HTML
            <br />
            • عنصر أول
            <br />
            • عنصر ثاني
          </div>
        }
        multiline={true}
        w={200}
      >
        <Button>تلميح منسق</Button>
      </Tooltip>
    </div>
  ),
};

export const DelayedTooltips: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Tooltip 
        label="يظهر فوراً"
        openDelay={0}
        closeDelay={0}
      >
        <Button variant="outline">فوري</Button>
      </Tooltip>
      
      <Tooltip 
        label="يظهر بعد 500 ميلي ثانية"
        openDelay={500}
        closeDelay={0}
      >
        <Button variant="outline">تأخير متوسط</Button>
      </Tooltip>
      
      <Tooltip 
        label="يظهر بعد ثانية واحدة"
        openDelay={1000}
        closeDelay={0}
      >
        <Button variant="outline">تأخير طويل</Button>
      </Tooltip>
      
      <Tooltip 
        label="يختفي ببطء"
        openDelay={0}
        closeDelay={1000}
      >
        <Button variant="outline">إخفاء بطيء</Button>
      </Tooltip>
    </div>
  ),
};

export const DisabledTooltip: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Tooltip 
        label="هذا تلميح نشط"
        disabled={false}
      >
        <Button>تلميح نشط</Button>
      </Tooltip>
      
      <Tooltip 
        label="هذا تلميح معطل"
        disabled={true}
      >
        <Button variant="outline">تلميح معطل</Button>
      </Tooltip>
    </div>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Tooltip 
        label="تلميح كبير الحجم"
        fz="lg"
      >
        <Button>خط كبير</Button>
      </Tooltip>
      
      <Tooltip 
        label="تلميح صغير الحجم"
        fz="xs"
      >
        <Button>خط صغير</Button>
      </Tooltip>
      
      <Tooltip 
        label="تلميح بدون سهم"
        withArrow={false}
      >
        <Button variant="outline">بدون سهم</Button>
      </Tooltip>
      
      <Tooltip 
        label="تلميح مع سهم كبير"
        withArrow={true}
        arrowSize={8}
      >
        <Button variant="outline">سهم كبير</Button>
      </Tooltip>
    </div>
  ),
};

export const InteractiveElements: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Tooltip label="تلميح لزر عادي">
        <Button>زر</Button>
      </Tooltip>
      
      <Tooltip label="تلميح لرابط">
        <a 
          href="#" 
          style={{ 
            padding: '0.5rem 1rem',
            textDecoration: 'none',
            borderRadius: '0.25rem'
          }}
          onClick={(e) => e.preventDefault()}
        >
          رابط
        </a>
      </Tooltip>
      
      <Tooltip label="تلميح لحقل إدخال">
        <input 
          type="text" 
          placeholder="اكتب شيئاً..."
          style={{ 
            padding: '0.5rem',
            borderRadius: '0.25rem',
            minWidth: '150px'
          }}
        />
      </Tooltip>
      
      <Tooltip label="تلميح لأيقونة">
        <div style={{ 
          padding: '0.5rem',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Info size={24} />
        </div>
      </Tooltip>
    </div>
  ),
};
