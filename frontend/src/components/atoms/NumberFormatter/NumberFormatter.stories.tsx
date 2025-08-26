import type { Meta, StoryObj } from '@storybook/react';
import NumberFormatter from './NumberFormatter';
import { Card } from '../Card';

const meta: Meta<typeof NumberFormatter> = {
  title: 'Atoms/NumberFormatter',
  component: NumberFormatter,
  parameters: {
    layout: 'centered',
    direction: 'rtl', // دعم RTL
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'القيمة الرقمية',
    },
    numberStyle: {
      control: { type: 'select' },
      options: ['decimal', 'currency', 'percent', 'unit'],
      description: 'نمط التنسيق',
    },
    currency: {
      control: 'text',
      description: 'رمز العملة',
    },
    locale: {
      control: { type: 'select' },
      options: ['ar-SA', 'en-US', 'ar-EG', 'ar-AE'],
      description: 'اللغة والمنطقة',
    },
    decimalScale: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'عدد المنازل العشرية',
    },
    prefix: {
      control: 'text',
      description: 'البادئة',
    },
    suffix: {
      control: 'text',
      description: 'اللاحقة',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 1234567.89,
    numberStyle: 'decimal',
    locale: 'ar-SA',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const Currency: Story = {
  args: {
    value: 1540000,
    numberStyle: 'currency',
    currency: 'IQD',
    locale: 'ar-IQ',
    decimalScale: 0,
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const IraqiDinarExamples: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-4">
        <div className="p-4 bg-surface-subtle rounded-lg">
          <div className="text-sm text-secondary mb-1">مبلغ بسيط</div>
          <div className="text-xl font-bold">
            <NumberFormatter 
              value={5000} 
              numberStyle="currency"
              currency="IQD"
              locale="ar-IQ"
              decimalScale={0}
            />
          </div>
        </div>
        
        <div className="p-4 bg-surface-subtle rounded-lg">
          <div className="text-sm text-secondary mb-1">مبلغ متوسط</div>
          <div className="text-xl font-bold">
            <NumberFormatter 
              value={250000} 
              numberStyle="currency"
              currency="IQD"
              locale="ar-IQ"
              decimalScale={0}
            />
          </div>
        </div>
        
        <div className="p-4 bg-surface-subtle rounded-lg">
          <div className="text-sm text-secondary mb-1">مبلغ كبير</div>
          <div className="text-xl font-bold">
            <NumberFormatter 
              value={1540000} 
              numberStyle="currency"
              currency="IQD"
              locale="ar-IQ"
              decimalScale={0}
            />
          </div>
        </div>
        
        <div className="p-4 bg-surface-subtle rounded-lg">
          <div className="text-sm text-secondary mb-1">مبلغ ضخم</div>
          <div className="text-xl font-bold">
            <NumberFormatter 
              value={15400000} 
              numberStyle="currency"
              currency="IQD"
              locale="ar-IQ"
              decimalScale={0}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Percentage: Story = {
  args: {
    value: 0.1534,
    numberStyle: 'percent',
    locale: 'ar-SA',
    decimalScale: 2,
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithPrefixSuffix: Story = {
  args: {
    value: 25,
    prefix: 'حوالي ',
    suffix: ' كيلو',
    locale: 'ar-SA',
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const LargeNumbers: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-4 text-center">
        <div className="p-4 bg-surface-subtle rounded-lg">
          <div className="text-sm text-secondary mb-1">عدد المشاهدات</div>
          <div className="text-2xl font-bold">
            <NumberFormatter 
              value={1234567} 
              locale="ar-SA"
              decimalScale={0}
            />
          </div>
        </div>
        
        <div className="p-4 bg-surface-subtle rounded-lg">
          <div className="text-sm text-secondary mb-1">إجمالي المبيعات</div>
          <div className="text-2xl font-bold text-success">
            <NumberFormatter 
              value={5678901.23} 
              numberStyle="currency"
              currency="SAR"
              locale="ar-SA"
            />
          </div>
        </div>
        
        <div className="p-4 bg-surface-subtle rounded-lg">
          <div className="text-sm text-secondary mb-1">معدل النمو</div>
          <div className="text-2xl font-bold text-success">
            <NumberFormatter 
              value={0.2156} 
              numberStyle="percent"
              locale="ar-SA"
              prefix="+"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const DifferentLocales: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">السعودية (ar-SA)</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-secondary">رقم: </span>
              <NumberFormatter value={1234567.89} locale="ar-SA" />
            </div>
            <div>
              <span className="text-sm text-secondary">عملة: </span>
              <NumberFormatter 
                value={1299.99} 
                numberStyle="currency" 
                currency="SAR" 
                locale="ar-SA" 
              />
            </div>
            <div>
              <span className="text-sm text-secondary">نسبة: </span>
              <NumberFormatter 
                value={0.15} 
                numberStyle="percent" 
                locale="ar-SA" 
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-3">الإمارات (ar-AE)</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-secondary">رقم: </span>
              <NumberFormatter value={1234567.89} locale="ar-AE" />
            </div>
            <div>
              <span className="text-sm text-secondary">عملة: </span>
              <NumberFormatter 
                value={1299.99} 
                numberStyle="currency" 
                currency="AED" 
                locale="ar-AE" 
              />
            </div>
            <div>
              <span className="text-sm text-secondary">نسبة: </span>
              <NumberFormatter 
                value={0.15} 
                numberStyle="percent" 
                locale="ar-AE" 
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const FinancialDashboard: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center">
          <div className="text-sm text-secondary mb-2">إجمالي الإيرادات</div>
          <div className="text-3xl font-bold text-success mb-1">
            <NumberFormatter 
              value={850000000} 
              numberStyle="currency"
              currency="IQD"
              locale="ar-IQ"
              decimalScale={0}
            />
          </div>
          <div className="text-xs text-success">
            <NumberFormatter 
              value={0.089} 
              numberStyle="percent"
              locale="ar-IQ"
              prefix="+"
            /> من الشهر الماضي
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-sm text-secondary mb-2">عدد الطلبات</div>
          <div className="text-3xl font-bold mb-1">
            <NumberFormatter 
              value={15847} 
              locale="ar-IQ"
              decimalScale={0}
            />
          </div>
          <div className="text-xs text-warning">
            <NumberFormatter 
              value={-0.023} 
              numberStyle="percent"
              locale="ar-IQ"
            /> من الشهر الماضي
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-sm text-secondary mb-2">متوسط قيمة الطلب</div>
          <div className="text-3xl font-bold mb-1">
            <NumberFormatter 
              value={53650} 
              numberStyle="currency"
              currency="IQD"
              locale="ar-IQ"
              decimalScale={0}
            />
          </div>
          <div className="text-xs text-success">
            <NumberFormatter 
              value={0.156} 
              numberStyle="percent"
              locale="ar-IQ"
              prefix="+"
            /> من الشهر الماضي
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const ProductPricing: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">جهاز كمبيوتر محمول</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary line-through">
                <NumberFormatter 
                  value={2500000} 
                  numberStyle="currency"
                  currency="IQD"
                  locale="ar-IQ"
                  decimalScale={0}
                />
              </span>
              <span className="text-lg font-bold text-success">
                <NumberFormatter 
                  value={2100000} 
                  numberStyle="currency"
                  currency="IQD"
                  locale="ar-IQ"
                  decimalScale={0}
                />
              </span>
            </div>
          </div>
          <div className="text-sm text-success">
            وفر <NumberFormatter 
              value={400000} 
              numberStyle="currency"
              currency="IQD"
              locale="ar-IQ"
              decimalScale={0}
            /> 
            (<NumberFormatter 
              value={0.16} 
              numberStyle="percent"
              locale="ar-IQ"
            />)
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">هاتف ذكي</h3>
            <div className="text-lg font-bold">
              <NumberFormatter 
                value={850000} 
                numberStyle="currency"
                currency="IQD"
                locale="ar-IQ"
                decimalScale={0}
              />
            </div>
          </div>
          <div className="text-sm text-secondary">
            أقساط شهرية من 
            <NumberFormatter 
              value={70000} 
              numberStyle="currency"
              currency="IQD"
              locale="ar-IQ"
              decimalScale={0}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">ساعة ذكية</h3>
            <div className="text-lg font-bold">
              <NumberFormatter 
                value={350000} 
                numberStyle="currency"
                currency="IQD"
                locale="ar-IQ"
                decimalScale={0}
              />
            </div>
          </div>
          <div className="text-xs text-info">
            شحن مجاني
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const FileSize: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-surface-subtle rounded-lg">
          <span>document.pdf</span>
          <span className="text-sm">
            <NumberFormatter 
              value={1048576} 
              locale="ar-SA"
              decimalScale={0}
              suffix=" بايت"
            />
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-surface-subtle rounded-lg">
          <span>image.jpg</span>
          <span className="text-sm">
            <NumberFormatter 
              value={2.5} 
              locale="ar-SA"
              decimalScale={1}
              suffix=" ميجا بايت"
            />
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-surface-subtle rounded-lg">
          <span>video.mp4</span>
          <span className="text-sm">
            <NumberFormatter 
              value={1.2} 
              locale="ar-SA"
              decimalScale={2}
              suffix=" جيجا بايت"
            />
          </span>
        </div>
      </div>
    </div>
  ),
};
