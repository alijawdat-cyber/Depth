import type { Meta, StoryObj } from '@storybook/react';
import List, { ListItem } from './List';
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Heart,
  Download,
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  Zap,
  Shield
} from 'lucide-react';
import Badge from '../Badge';

const meta: Meta<typeof List> = {
  title: 'Atoms/List',
  component: List,
  parameters: {
    layout: 'centered',
    direction: 'rtl', // دعم RTL
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['ordered', 'unordered'],
      description: 'نوع القائمة',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم النص',
    },
    spacing: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'التباعد بين العناصر',
    },
    withPadding: {
      control: 'boolean',
      description: 'إضافة حشو',
    },
    center: {
      control: 'boolean',
      description: 'توسيط المحتوى',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ direction: 'rtl' }}>
      <List {...args}>
        <ListItem>العنصر الأول في القائمة</ListItem>
        <ListItem>العنصر الثاني في القائمة</ListItem>
        <ListItem>العنصر الثالث في القائمة</ListItem>
        <ListItem>العنصر الرابع في القائمة</ListItem>
      </List>
    </div>
  ),
  args: {
    type: 'unordered',
    size: 'sm',
    spacing: 'sm',
  },
};

export const OrderedList: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <List type="ordered" size="sm">
        <ListItem>قم بإنشاء حساب جديد</ListItem>
        <ListItem>أكمل عملية التحقق من الهوية</ListItem>
        <ListItem>اختر الخطة المناسبة لك</ListItem>
        <ListItem>ابدأ في استخدام الخدمة</ListItem>
      </List>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <List>
        <ListItem icon={<CheckCircle size={16} className="text-green-500" />}>
          تم إكمال المهمة الأولى بنجاح
        </ListItem>
        <ListItem icon={<CheckCircle size={16} className="text-green-500" />}>
          تم إكمال المهمة الثانية بنجاح
        </ListItem>
        <ListItem icon={<Clock size={16} className="text-yellow-500" />}>
          جاري العمل على المهمة الثالثة
        </ListItem>
        <ListItem icon={<AlertTriangle size={16} className="text-red-500" />}>
          المهمة الرابعة تحتاج مراجعة
        </ListItem>
      </List>
    </div>
  ),
};

export const FeatureList: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <h3 className="text-lg font-semibold mb-4">مميزات الخطة المتقدمة</h3>
      <List icon={<Star size={16} className="text-yellow-500" />} spacing="md">
        <ListItem>
          <div className="font-medium">مساحة تخزين غير محدودة</div>
          <div className="text-sm text-secondary">احفظ جميع ملفاتك بدون قيود</div>
        </ListItem>
        <ListItem>
          <div className="font-medium">دعم فني على مدار الساعة</div>
          <div className="text-sm text-secondary">فريق دعم متاح 24/7 لمساعدتك</div>
        </ListItem>
        <ListItem>
          <div className="font-medium">تشفير متقدم للبيانات</div>
          <div className="text-sm text-secondary">حماية قصوى لبياناتك الشخصية</div>
        </ListItem>
        <ListItem>
          <div className="font-medium">تطبيقات الهاتف المحمول</div>
          <div className="text-sm text-secondary">تطبيقات iOS و Android مجانية</div>
        </ListItem>
      </List>
    </div>
  ),
};

export const ContactInfo: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '400px' }}>
      <h3 className="text-lg font-semibold mb-4">معلومات الاتصال</h3>
      <List spacing="md">
        <ListItem icon={<User size={16} className="text-blue-500" />}>
          <div className="font-medium">أحمد محمد علي</div>
          <div className="text-sm text-secondary">مطور البرمجيات</div>
        </ListItem>
        <ListItem icon={<Mail size={16} className="text-green-500" />}>
          <div className="font-medium">ahmed@example.com</div>
          <div className="text-sm text-secondary">البريد الإلكتروني الرئيسي</div>
        </ListItem>
        <ListItem icon={<Phone size={16} className="text-orange-500" />}>
          <div className="font-medium">+966 50 123 4567</div>
          <div className="text-sm text-secondary">رقم الهاتف الجوال</div>
        </ListItem>
        <ListItem icon={<MapPin size={16} className="text-red-500" />}>
          <div className="font-medium">الرياض، السعودية</div>
          <div className="text-sm text-secondary">العنوان الحالي</div>
        </ListItem>
      </List>
    </div>
  ),
};

export const MenuList: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '300px' }}>
      <List>
        <ListItem icon={<User size={16} />}>
          <div className="flex justify-between items-center w-full">
            <span>الملف الشخصي</span>
            <ArrowRight size={14} className="text-secondary" />
          </div>
        </ListItem>
        <ListItem icon={<Settings size={16} />}>
          <div className="flex justify-between items-center w-full">
            <span>الإعدادات</span>
            <ArrowRight size={14} className="text-secondary" />
          </div>
        </ListItem>
        <ListItem icon={<Download size={16} />}>
          <div className="flex justify-between items-center w-full">
            <span>التحميلات</span>
            <Badge size="xs" color="blue">3</Badge>
          </div>
        </ListItem>
        <ListItem icon={<Heart size={16} />}>
          <div className="flex justify-between items-center w-full">
            <span>المفضلة</span>
            <Badge size="xs" color="red">12</Badge>
          </div>
        </ListItem>
      </List>
    </div>
  ),
};

export const Requirements: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <h3 className="text-lg font-semibold mb-4">متطلبات النظام</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">الحد الأدنى</h4>
          <List size="sm" spacing="xs">
            <ListItem>معالج Intel Core i3 أو AMD Ryzen 3</ListItem>
            <ListItem>ذاكرة وصول عشوائي 4 جيجا بايت</ListItem>
            <ListItem>مساحة فارغة 20 جيجا بايت</ListItem>
            <ListItem>بطاقة رسوميات DirectX 11</ListItem>
            <ListItem>Windows 10 أو أحدث</ListItem>
          </List>
        </div>
        
        <div>
          <h4 className="font-medium mb-3">المستوى المُوصى به</h4>
          <List size="sm" spacing="xs">
            <ListItem>معالج Intel Core i7 أو AMD Ryzen 7</ListItem>
            <ListItem>ذاكرة وصول عشوائي 16 جيجا بايت</ListItem>
            <ListItem>مساحة فارغة 50 جيجا بايت SSD</ListItem>
            <ListItem>بطاقة رسوميات GTX 1060 أو أفضل</ListItem>
            <ListItem>Windows 11</ListItem>
          </List>
        </div>
      </div>
    </div>
  ),
};

export const ProductFeatures: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <h3 className="text-lg font-semibold mb-4">مميزات المنتج</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Zap size={18} className="text-yellow-500" />
            الأداء
          </h4>
          <List icon={<CheckCircle size={14} className="text-green-500" />} size="sm">
            <ListItem>سرعة معالجة فائقة</ListItem>
            <ListItem>استجابة فورية للأوامر</ListItem>
            <ListItem>تحسين استهلاك البطارية</ListItem>
          </List>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Shield size={18} className="text-blue-500" />
            الأمان
          </h4>
          <List icon={<CheckCircle size={14} className="text-green-500" />} size="sm">
            <ListItem>تشفير من طرف إلى طرف</ListItem>
            <ListItem>مصادقة ثنائية العامل</ListItem>
            <ListItem>نسخ احتياطية آمنة</ListItem>
          </List>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <User size={18} className="text-purple-500" />
            سهولة الاستخدام
          </h4>
          <List icon={<CheckCircle size={14} className="text-green-500" />} size="sm">
            <ListItem>واجهة مستخدم بديهية</ListItem>
            <ListItem>دليل المستخدم التفاعلي</ListItem>
            <ListItem>دعم اللغة العربية الكامل</ListItem>
          </List>
        </div>
      </div>
    </div>
  ),
};

export const ActivityLog: Story = {
  render: () => (
    <div style={{ direction: 'rtl', maxWidth: '500px' }}>
      <h3 className="text-lg font-semibold mb-4">سجل النشاطات</h3>
      <List spacing="md">
        <ListItem>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium">تسجيل دخول جديد</div>
              <div className="text-sm text-secondary">من الرياض، السعودية</div>
              <div className="text-xs text-secondary">منذ 5 دقائق</div>
            </div>
          </div>
        </ListItem>
        
        <ListItem>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Download size={14} className="text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium">تحميل ملف</div>
              <div className="text-sm text-secondary">document.pdf (2.5 MB)</div>
              <div className="text-xs text-secondary">منذ ساعة</div>
            </div>
          </div>
        </ListItem>
        
        <ListItem>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Settings size={14} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium">تغيير الإعدادات</div>
              <div className="text-sm text-secondary">تحديث إعدادات الخصوصية</div>
              <div className="text-xs text-secondary">منذ يومين</div>
            </div>
          </div>
        </ListItem>
        
        <ListItem>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar size={14} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium">إضافة حدث جديد</div>
              <div className="text-sm text-secondary">اجتماع فريق التطوير</div>
              <div className="text-xs text-secondary">منذ 3 أيام</div>
            </div>
          </div>
        </ListItem>
      </List>
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">حجم صغير جداً (xs)</h4>
          <List size="xs" spacing="xs">
            <ListItem>عنصر بحجم صغير جداً</ListItem>
            <ListItem>عنصر آخر بحجم صغير جداً</ListItem>
          </List>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">حجم صغير (sm)</h4>
          <List size="sm" spacing="sm">
            <ListItem>عنصر بحجم صغير</ListItem>
            <ListItem>عنصر آخر بحجم صغير</ListItem>
          </List>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">حجم متوسط (md)</h4>
          <List size="md" spacing="md">
            <ListItem>عنصر بحجم متوسط</ListItem>
            <ListItem>عنصر آخر بحجم متوسط</ListItem>
          </List>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">حجم كبير (lg)</h4>
          <List size="lg" spacing="lg">
            <ListItem>عنصر بحجم كبير</ListItem>
            <ListItem>عنصر آخر بحجم كبير</ListItem>
          </List>
        </div>
      </div>
    </div>
  ),
};
