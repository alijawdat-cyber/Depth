import type { Meta, StoryObj } from '@storybook/react';
import Timeline, { TimelineItem } from './Timeline';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  MapPin,
  User,
  Mail,
  Star,
  AlertCircle,
  Settings
} from 'lucide-react';
import Badge from '../Badge';

const meta: Meta<typeof Timeline> = {
  title: 'Atoms/Timeline',
  component: Timeline,
  parameters: {
    layout: 'centered',
    direction: 'rtl', // دعم RTL
  },
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: { type: 'number', min: -1, max: 10 },
      description: 'العنصر النشط',
    },
    bulletSize: {
      control: { type: 'number', min: 10, max: 40 },
      description: 'حجم النقطة',
    },
    lineWidth: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'سمك الخط',
    },
    color: {
      control: 'text',
      description: 'لون العناصر النشطة',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ direction: 'rtl' }}>
      <Timeline {...args}>
        <TimelineItem title="تم إنشاء الطلب">
          <div className="text-sm text-secondary">تم إنشاء الطلب بنجاح وإرساله للمعالجة</div>
        </TimelineItem>
        
        <TimelineItem title="تأكيد الدفع">
          <div className="text-sm text-secondary">تم تأكيد الدفع وقبول الطلب</div>
        </TimelineItem>
        
        <TimelineItem title="جاري التحضير">
          <div className="text-sm text-secondary">جاري تحضير الطلب في المتجر</div>
        </TimelineItem>
        
        <TimelineItem title="الشحن">
          <div className="text-sm text-secondary">تم شحن الطلب وهو في الطريق إليك</div>
        </TimelineItem>
      </Timeline>
    </div>
  ),
  args: {
    active: 1,
    color: 'blue',
  },
};

export const OrderTracking: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <Timeline active={2} color="green" bulletSize={24}>
        <TimelineItem 
          bullet={<CheckCircle size={14} />}
          title="تم تأكيد الطلب"
        >
          <div className="text-sm text-secondary mb-2">
            تم تأكيد طلبك #12345 وقبول الدفع
          </div>
          <div className="text-xs text-secondary">منذ ساعتين</div>
        </TimelineItem>
        
        <TimelineItem 
          bullet={<Package size={14} />}
          title="جاري التحضير"
        >
          <div className="text-sm text-secondary mb-2">
            يتم تحضير طلبك حالياً في المتجر
          </div>
          <div className="text-xs text-secondary">منذ ساعة</div>
        </TimelineItem>
        
        <TimelineItem 
          bullet={<Truck size={14} />}
          title="تم الشحن"
        >
          <div className="text-sm text-secondary mb-2">
            تم شحن طلبك مع شركة الشحن السريع
          </div>
          <div className="text-xs text-secondary">منذ 30 دقيقة</div>
          <div className="mt-2">
            <Badge size="sm" color="blue">رقم التتبع: TR123456789</Badge>
          </div>
        </TimelineItem>
        
        <TimelineItem 
          bullet={<MapPin size={14} />}
          title="التسليم"
          color="gray"
        >
          <div className="text-sm text-secondary">
            سيتم تسليم الطلب في غضون 24 ساعة
          </div>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

export const ProjectProgress: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '500px' }}>
      <Timeline active={3} color="blue">
        <TimelineItem 
          title="بدء المشروع" 
          bullet={<CheckCircle size={14} />}
        >
          <div className="text-sm text-secondary mb-2">
            تم بدء المشروع وتشكيل فريق العمل
          </div>
          <div className="text-xs text-secondary">1 يناير 2024</div>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge size="xs" color="green">مكتمل</Badge>
          </div>
        </TimelineItem>
        
        <TimelineItem 
          title="مرحلة التصميم" 
          bullet={<CheckCircle size={14} />}
        >
          <div className="text-sm text-secondary mb-2">
            إنجاز تصميم الواجهات وتجربة المستخدم
          </div>
          <div className="text-xs text-secondary">15 فبراير 2024</div>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge size="xs" color="green">مكتمل</Badge>
            <Badge size="xs" color="blue">مراجع</Badge>
          </div>
        </TimelineItem>
        
        <TimelineItem 
          title="مرحلة التطوير" 
          bullet={<CheckCircle size={14} />}
        >
          <div className="text-sm text-secondary mb-2">
            تطوير الواجهة الأمامية والخلفية
          </div>
          <div className="text-xs text-secondary">1 مارس - 30 أبريل 2024</div>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge size="xs" color="green">مكتمل</Badge>
          </div>
        </TimelineItem>
        
        <TimelineItem 
          title="مرحلة الاختبار" 
          bullet={<Clock size={14} />}
          color="yellow"
        >
          <div className="text-sm text-secondary mb-2">
            اختبار النظام واكتشاف الأخطاء
          </div>
          <div className="text-xs text-secondary">1 مايو - 15 مايو 2024</div>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge size="xs" color="yellow">جاري</Badge>
          </div>
        </TimelineItem>
        
        <TimelineItem 
          title="النشر" 
          bullet={<Settings size={14} />}
          color="gray"
        >
          <div className="text-sm text-secondary mb-2">
            نشر النظام في الإنتاج
          </div>
          <div className="text-xs text-secondary">20 مايو 2024</div>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge size="xs" color="gray">مجدول</Badge>
          </div>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

export const UserActivity: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '400px' }}>
      <Timeline bulletSize={20}>
        <TimelineItem 
          bullet={<User size={12} />} 
          title="تم إنشاء حساب جديد"
          color="green"
        >
          <div className="text-sm text-secondary">
            المستخدم: أحمد محمد
          </div>
          <div className="text-xs text-secondary">منذ 5 دقائق</div>
        </TimelineItem>
        
        <TimelineItem 
          bullet={<Mail size={12} />} 
          title="تم إرسال بريد ترحيبي"
          color="blue"
        >
          <div className="text-sm text-secondary">
            إلى: ahmed@example.com
          </div>
          <div className="text-xs text-secondary">منذ 3 دقائق</div>
        </TimelineItem>
        
        <TimelineItem 
          bullet={<CheckCircle size={12} />} 
          title="تفعيل البريد الإلكتروني"
          color="green"
        >
          <div className="text-sm text-secondary">
            تم تفعيل الحساب بنجاح
          </div>
          <div className="text-xs text-secondary">منذ دقيقتين</div>
        </TimelineItem>
        
        <TimelineItem 
          bullet={<Star size={12} />} 
          title="أول عملية شراء"
          color="yellow"
        >
          <div className="text-sm text-secondary">
            شراء منتج بقيمة 299 ر.س
          </div>
          <div className="text-xs text-secondary">منذ دقيقة</div>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

export const CompanyHistory: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '600px' }}>
      <Timeline active={-1} color="indigo" lineWidth={3}>
        <TimelineItem 
          title="تأسيس الشركة"
          bullet={<div className="w-3 h-3 bg-indigo-500 rounded-full"></div>}
        >
          <div className="text-sm text-secondary mb-2">
            تم تأسيس الشركة في مدينة الرياض بهدف تقديم حلول تقنية مبتكرة
          </div>
          <div className="text-sm font-semibold">2018</div>
        </TimelineItem>
        
        <TimelineItem 
          title="إطلاق أول منتج"
          bullet={<div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
        >
          <div className="text-sm text-secondary mb-2">
            إطلاق منصة إدارة المشاريع التي حصلت على استحسان كبير من العملاء
          </div>
          <div className="text-sm font-semibold">2019</div>
        </TimelineItem>
        
        <TimelineItem 
          title="التوسع الإقليمي"
          bullet={<div className="w-3 h-3 bg-green-500 rounded-full"></div>}
        >
          <div className="text-sm text-secondary mb-2">
            فتح مكاتب في دبي والقاهرة وتوسيع نطاق الخدمات لتشمل منطقة الشرق الأوسط
          </div>
          <div className="text-sm font-semibold">2020</div>
        </TimelineItem>
        
        <TimelineItem 
          title="جولة التمويل الأولى"
          bullet={<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>}
        >
          <div className="text-sm text-secondary mb-2">
            الحصول على تمويل بقيمة 5 مليون دولار لتطوير المنتجات الجديدة
          </div>
          <div className="text-sm font-semibold">2021</div>
        </TimelineItem>
        
        <TimelineItem 
          title="الاكتتاب العام"
          bullet={<div className="w-3 h-3 bg-purple-500 rounded-full"></div>}
        >
          <div className="text-sm text-secondary mb-2">
            طرح الشركة في البورصة السعودية وتحقيق نجاح كبير في الاكتتاب
          </div>
          <div className="text-sm font-semibold">2023</div>
        </TimelineItem>
        
        <TimelineItem 
          title="خطط المستقبل"
          bullet={<div className="w-3 h-3 bg-gray-400 rounded-full"></div>}
          color="gray"
        >
          <div className="text-sm text-secondary mb-2">
            خطط للتوسع عالمياً وإطلاق منتجات جديدة في مجال الذكاء الاصطناعي
          </div>
          <div className="text-sm font-semibold">2024-2025</div>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

export const SystemLogs: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '500px' }}>
      <Timeline bulletSize={16}>
        <TimelineItem 
          bullet={<CheckCircle size={10} className="text-green-600" />} 
          title="تم بدء تشغيل النظام"
          color="green"
        >
          <div className="text-sm text-secondary font-mono">
            [INFO] Server started successfully on port 3000
          </div>
          <div className="text-xs text-secondary">09:00:00</div>
        </TimelineItem>
        
        <TimelineItem 
          bullet={<AlertCircle size={10} className="text-yellow-600" />} 
          title="تحذير: استخدام ذاكرة عالي"
          color="yellow"
        >
          <div className="text-sm text-secondary font-mono">
            [WARN] Memory usage: 85% - Consider scaling up
          </div>
          <div className="text-xs text-secondary">09:15:23</div>
        </TimelineItem>
        
        <TimelineItem 
          bullet={<CheckCircle size={10} className="text-blue-600" />} 
          title="تم إضافة مستخدم جديد"
          color="blue"
        >
          <div className="text-sm text-secondary font-mono">
            [INFO] New user registered: user_12345
          </div>
          <div className="text-xs text-secondary">09:32:15</div>
        </TimelineItem>
        
        <TimelineItem 
          bullet={<AlertCircle size={10} className="text-red-600" />} 
          title="خطأ: فشل في الاتصال بقاعدة البيانات"
          color="red"
        >
          <div className="text-sm text-secondary font-mono">
            [ERROR] Database connection timeout
          </div>
          <div className="text-xs text-secondary">09:45:01</div>
        </TimelineItem>
        
        <TimelineItem 
          bullet={<CheckCircle size={10} className="text-green-600" />} 
          title="تم حل المشكلة"
          color="green"
        >
          <div className="text-sm text-secondary font-mono">
            [INFO] Database connection restored
          </div>
          <div className="text-xs text-secondary">09:47:33</div>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

export const MinimalTimeline: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <Timeline bulletSize={12} lineWidth={1} color="gray">
        <TimelineItem title="المهمة الأولى">
          <div className="text-sm text-secondary">وصف المهمة الأولى</div>
        </TimelineItem>
        
        <TimelineItem title="المهمة الثانية">
          <div className="text-sm text-secondary">وصف المهمة الثانية</div>
        </TimelineItem>
        
        <TimelineItem title="المهمة الثالثة">
          <div className="text-sm text-secondary">وصف المهمة الثالثة</div>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};
