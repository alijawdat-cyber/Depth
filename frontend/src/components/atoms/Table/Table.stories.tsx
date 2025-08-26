import type { Meta, StoryObj } from '@storybook/react';
import { 
  Table, 
  TableThead, 
  TableTbody, 
  TableTr, 
  TableTh, 
  TableTd,
  TableCaption 
} from './Table';
import { Button } from '../Button';
import Badge from '../Badge';
import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

const meta: Meta<typeof Table> = {
  title: 'Atoms/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    direction: 'rtl', // دعم RTL
  },
  tags: ['autodocs'],
  argTypes: {
    striped: {
      control: 'boolean',
      description: 'صفوف مخططة',
    },
    highlightOnHover: {
      control: 'boolean',
      description: 'تمييز عند التمرير',
    },
    withTableBorder: {
      control: 'boolean',
      description: 'حدود الجدول',
    },
    withColumnBorders: {
      control: 'boolean',
      description: 'حدود الأعمدة',
    },
    withRowBorders: {
      control: 'boolean',
      description: 'حدود الصفوف',
    },
    verticalSpacing: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'التباعد العمودي',
    },
    horizontalSpacing: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'التباعد الأفقي',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = {
  head: ['الاسم', 'البريد الإلكتروني', 'الدور', 'الحالة', 'تاريخ الانضمام'],
  body: [
    ['أحمد علي محمد', 'ahmed.ali@example.com', 'مدير', 'نشط', '2024-01-15'],
    ['سارة محمد حسن', 'sara.mohammed@example.com', 'محرر', 'نشط', '2024-02-20'],
    ['عمر حسان أحمد', 'omar.hassan@example.com', 'مستخدم', 'غير نشط', '2024-03-10'],
    ['نور الدين يوسف', 'nour.yousef@example.com', 'محرر', 'نشط', '2024-04-05'],
    ['فاطمة الزهراء', 'fatima.zahra@example.com', 'مستخدم', 'نشط', '2024-05-12'],
  ],
};

export const Default: Story = {
  args: {
    data: sampleData,
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const BasicTable: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>المنتج</TableTh>
            <TableTh>السعر</TableTh>
            <TableTh>الكمية</TableTh>
            <TableTh>المجموع</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          <TableTr>
            <TableTd>كتاب البرمجة</TableTd>
            <TableTd>85 ر.س</TableTd>
            <TableTd>2</TableTd>
            <TableTd>170 ر.س</TableTd>
          </TableTr>
          <TableTr>
            <TableTd>دورة تطوير الويب</TableTd>
            <TableTd>250 ر.س</TableTd>
            <TableTd>1</TableTd>
            <TableTd>250 ر.س</TableTd>
          </TableTr>
          <TableTr>
            <TableTd>مؤتمر التقنية</TableTd>
            <TableTd>500 ر.س</TableTd>
            <TableTd>1</TableTd>
            <TableTd>500 ر.س</TableTd>
          </TableTr>
        </TableTbody>
      </Table>
    </div>
  ),
};

export const StripedTable: Story = {
  args: {
    data: sampleData,
    striped: true,
    highlightOnHover: true,
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithBorders: Story = {
  args: {
    data: sampleData,
    withTableBorder: true,
    withColumnBorders: true,
    withRowBorders: true,
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const CompactTable: Story = {
  args: {
    data: sampleData,
    verticalSpacing: 'xs',
    horizontalSpacing: 'xs',
    striped: true,
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const SpaciousTable: Story = {
  args: {
    data: sampleData,
    verticalSpacing: 'xl',
    horizontalSpacing: 'xl',
    highlightOnHover: true,
  },
  decorators: [
    (Story) => (
      <div style={{ direction: 'rtl' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithActions: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <Table striped highlightOnHover>
        <TableThead>
          <TableTr>
            <TableTh>اسم المستخدم</TableTh>
            <TableTh>البريد الإلكتروني</TableTh>
            <TableTh>الدور</TableTh>
            <TableTh>الحالة</TableTh>
            <TableTh>الإجراءات</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          <TableTr>
            <TableTd>أحمد محمد</TableTd>
            <TableTd>ahmed@example.com</TableTd>
            <TableTd>مدير</TableTd>
            <TableTd>
              <Badge color="green" variant="filled">نشط</Badge>
            </TableTd>
            <TableTd>
              <div className="flex gap-2">
                <Button size="xs" variant="outline">
                  <Eye size={12} className="ml-1" />
                  عرض
                </Button>
                <Button size="xs" variant="outline">
                  <Edit size={12} className="ml-1" />
                  تعديل
                </Button>
                <Button size="xs" variant="outline" className="text-red-600 hover:bg-red-50">
                  <Trash2 size={12} className="ml-1" />
                  حذف
                </Button>
              </div>
            </TableTd>
          </TableTr>
          <TableTr>
            <TableTd>سارة أحمد</TableTd>
            <TableTd>sara@example.com</TableTd>
            <TableTd>محرر</TableTd>
            <TableTd>
              <Badge color="green" variant="filled">نشط</Badge>
            </TableTd>
            <TableTd>
              <div className="flex gap-2">
                <Button size="xs" variant="outline">
                  <Eye size={12} className="ml-1" />
                  عرض
                </Button>
                <Button size="xs" variant="outline">
                  <Edit size={12} className="ml-1" />
                  تعديل
                </Button>
                <Button size="xs" variant="outline" className="text-red-600 hover:bg-red-50">
                  <Trash2 size={12} className="ml-1" />
                  حذف
                </Button>
              </div>
            </TableTd>
          </TableTr>
          <TableTr>
            <TableTd>عمر حسن</TableTd>
            <TableTd>omar@example.com</TableTd>
            <TableTd>مستخدم</TableTd>
            <TableTd>
              <Badge color="red" variant="filled">غير نشط</Badge>
            </TableTd>
            <TableTd>
              <div className="flex gap-2">
                <Button size="xs" variant="outline">
                  <Eye size={12} className="ml-1" />
                  عرض
                </Button>
                <Button size="xs" variant="outline">
                  <Edit size={12} className="ml-1" />
                  تعديل
                </Button>
                <Button size="xs" variant="outline" className="text-red-600 hover:bg-red-50">
                  <Trash2 size={12} className="ml-1" />
                  حذف
                </Button>
              </div>
            </TableTd>
          </TableTr>
        </TableTbody>
      </Table>
    </div>
  ),
};

export const SalesReport: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <Table striped withTableBorder>
        <TableCaption>تقرير المبيعات الشهرية - ديسمبر 2024</TableCaption>
        <TableThead>
          <TableTr>
            <TableTh>المنتج</TableTh>
            <TableTh>وحدات مباعة</TableTh>
            <TableTh>السعر الوحدة</TableTh>
            <TableTh>إجمالي المبيعات</TableTh>
            <TableTh>النسبة المئوية</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          <TableTr>
            <TableTd>
              <div className="font-semibold">كورس البرمجة المتقدمة</div>
              <div className="text-xs text-secondary">دورة تدريبية شاملة</div>
            </TableTd>
            <TableTd>245</TableTd>
            <TableTd>899 ر.س</TableTd>
            <TableTd>
              <div className="font-semibold text-success">220,255 ر.س</div>
            </TableTd>
            <TableTd>
              <Badge color="green" variant="light">45.2%</Badge>
            </TableTd>
          </TableTr>
          <TableTr>
            <TableTd>
              <div className="font-semibold">كتاب تطوير التطبيقات</div>
              <div className="text-xs text-secondary">إصدار رقمي ومطبوع</div>
            </TableTd>
            <TableTd>156</TableTd>
            <TableTd>125 ر.س</TableTd>
            <TableTd>
              <div className="font-semibold text-success">19,500 ر.س</div>
            </TableTd>
            <TableTd>
              <Badge color="blue" variant="light">28.7%</Badge>
            </TableTd>
          </TableTr>
          <TableTr>
            <TableTd>
              <div className="font-semibold">ورشة عمل التصميم</div>
              <div className="text-xs text-secondary">ورشة تفاعلية لمدة يومين</div>
            </TableTd>
            <TableTd>89</TableTd>
            <TableTd>750 ر.س</TableTd>
            <TableTd>
              <div className="font-semibold text-success">66,750 ر.س</div>
            </TableTd>
            <TableTd>
              <Badge color="yellow" variant="light">18.9%</Badge>
            </TableTd>
          </TableTr>
          <TableTr>
            <TableTd>
              <div className="font-semibold">استشارة تقنية</div>
              <div className="text-xs text-secondary">جلسات فردية مخصصة</div>
            </TableTd>
            <TableTd>32</TableTd>
            <TableTd>450 ر.س</TableTd>
            <TableTd>
              <div className="font-semibold text-success">14,400 ر.س</div>
            </TableTd>
            <TableTd>
              <Badge color="gray" variant="light">7.2%</Badge>
            </TableTd>
          </TableTr>
        </TableTbody>
      </Table>
      
      <div className="mt-4 p-4 bg-surface-subtle rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold">إجمالي المبيعات:</span>
          <span className="text-xl font-bold text-success">320,905 ر.س</span>
        </div>
      </div>
    </div>
  ),
};

export const StudentGrades: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <Table highlightOnHover withRowBorders>
        <TableThead>
          <TableTr>
            <TableTh>اسم الطالب</TableTh>
            <TableTh>الرقم الجامعي</TableTh>
            <TableTh>الرياضيات</TableTh>
            <TableTh>الفيزياء</TableTh>
            <TableTh>الكيمياء</TableTh>
            <TableTh>المعدل</TableTh>
            <TableTh>التقدير</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          <TableTr>
            <TableTd>
              <div className="font-medium">علي أحمد محمد</div>
              <div className="text-xs text-secondary">كلية الهندسة</div>
            </TableTd>
            <TableTd>2021001</TableTd>
            <TableTd>95</TableTd>
            <TableTd>92</TableTd>
            <TableTd>88</TableTd>
            <TableTd>
              <div className="font-semibold">91.7</div>
            </TableTd>
            <TableTd>
              <Badge color="green" variant="filled">ممتاز</Badge>
            </TableTd>
          </TableTr>
          <TableTr>
            <TableTd>
              <div className="font-medium">فاطمة سعد حسن</div>
              <div className="text-xs text-secondary">كلية العلوم</div>
            </TableTd>
            <TableTd>2021002</TableTd>
            <TableTd>87</TableTd>
            <TableTd>89</TableTd>
            <TableTd>85</TableTd>
            <TableTd>
              <div className="font-semibold">87.0</div>
            </TableTd>
            <TableTd>
              <Badge color="blue" variant="filled">جيد جداً</Badge>
            </TableTd>
          </TableTr>
          <TableTr>
            <TableTd>
              <div className="font-medium">محمد عبدالله يوسف</div>
              <div className="text-xs text-secondary">كلية الطب</div>
            </TableTd>
            <TableTd>2021003</TableTd>
            <TableTd>78</TableTd>
            <TableTd>82</TableTd>
            <TableTd>79</TableTd>
            <TableTd>
              <div className="font-semibold">79.7</div>
            </TableTd>
            <TableTd>
              <Badge color="yellow" variant="filled">جيد</Badge>
            </TableTd>
          </TableTr>
          <TableTr>
            <TableTd>
              <div className="font-medium">نور الهدى إبراهيم</div>
              <div className="text-xs text-secondary">كلية الآداب</div>
            </TableTd>
            <TableTd>2021004</TableTd>
            <TableTd>65</TableTd>
            <TableTd>68</TableTd>
            <TableTd>72</TableTd>
            <TableTd>
              <div className="font-semibold">68.3</div>
            </TableTd>
            <TableTd>
              <Badge color="orange" variant="filled">مقبول</Badge>
            </TableTd>
          </TableTr>
        </TableTbody>
      </Table>
    </div>
  ),
};

export const InventoryTable: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <Table striped highlightOnHover withTableBorder>
        <TableThead>
          <TableTr>
            <TableTh>رمز المنتج</TableTh>
            <TableTh>اسم المنتج</TableTh>
            <TableTh>الفئة</TableTh>
            <TableTh>المخزون الحالي</TableTh>
            <TableTh>الحد الأدنى</TableTh>
            <TableTh>الحالة</TableTh>
            <TableTh></TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          <TableTr>
            <TableTd>
              <code className="text-xs bg-surface-subtle px-2 py-1 rounded">PRD-001</code>
            </TableTd>
            <TableTd>
              <div className="font-medium">جهاز كمبيوتر محمول</div>
              <div className="text-xs text-secondary">HP EliteBook 840</div>
            </TableTd>
            <TableTd>أجهزة كمبيوتر</TableTd>
            <TableTd>25</TableTd>
            <TableTd>10</TableTd>
            <TableTd>
              <Badge color="green" variant="light">متوفر</Badge>
            </TableTd>
            <TableTd>
              <Button size="xs" variant="ghost">
                <MoreVertical size={14} />
              </Button>
            </TableTd>
          </TableTr>
          <TableTr>
            <TableTd>
              <code className="text-xs bg-surface-subtle px-2 py-1 rounded">PRD-002</code>
            </TableTd>
            <TableTd>
              <div className="font-medium">طابعة ليزر</div>
              <div className="text-xs text-secondary">Canon LBP6030</div>
            </TableTd>
            <TableTd>طابعات</TableTd>
            <TableTd>8</TableTd>
            <TableTd>15</TableTd>
            <TableTd>
              <Badge color="red" variant="light">نفدت الكمية</Badge>
            </TableTd>
            <TableTd>
              <Button size="xs" variant="ghost">
                <MoreVertical size={14} />
              </Button>
            </TableTd>
          </TableTr>
          <TableTr>
            <TableTd>
              <code className="text-xs bg-surface-subtle px-2 py-1 rounded">PRD-003</code>
            </TableTd>
            <TableTd>
              <div className="font-medium">فأرة لاسلكية</div>
              <div className="text-xs text-secondary">Logitech MX Master</div>
            </TableTd>
            <TableTd>ملحقات</TableTd>
            <TableTd>12</TableTd>
            <TableTd>20</TableTd>
            <TableTd>
              <Badge color="yellow" variant="light">منخفض</Badge>
            </TableTd>
            <TableTd>
              <Button size="xs" variant="ghost">
                <MoreVertical size={14} />
              </Button>
            </TableTd>
          </TableTr>
        </TableTbody>
      </Table>
    </div>
  ),
};
