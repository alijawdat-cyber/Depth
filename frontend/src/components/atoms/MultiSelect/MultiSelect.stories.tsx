import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MultiSelect } from './MultiSelect';

const meta = {
  title: 'Atoms/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
مكون الاختيار المتعدد - MultiSelect في Depth يوفر واجهة سهلة للاختيار من بين خيارات متعددة.

## الميزات الرئيسية:
- تصميم عربي مع دعم RTL كامل
- إمكانية البحث والفلترة
- أحجام متنوعة (xs, sm, md, lg, xl)
- ألوان مخصصة تتماشى مع هوية النظام
- دعم المجموعات والتصنيفات
- تخصيص العرض مع قوالب مخصصة
- إمكانية الوصول الكاملة مع دعم لوحة المفاتيح

## أمثلة الاستخدام:
- اختيار المهارات والخبرات
- تحديد الفئات والتصنيفات
- اختيار الموقع الجغرافي
- تحديد الاهتمامات والهوايات
- اختيار العلامات (Tags)
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم المكون',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'حالة التعطيل',
    },
    searchable: {
      control: { type: 'boolean' },
      description: 'إمكانية البحث',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'النص التوضيحي',
    },
    label: {
      control: { type: 'text' },
      description: 'نص التسمية',
    },
    description: {
      control: { type: 'text' },
      description: 'وصف إضافي',
    },
    error: {
      control: { type: 'text' },
      description: 'رسالة الخطأ',
    },
  },
  decorators: [
    (Story) => (
      <div dir="rtl" style={{ fontFamily: 'Dubai, sans-serif', width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const skillsData = [
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'php', label: 'PHP' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'database', label: 'قواعد البيانات' },
  { value: 'mobile', label: 'تطوير الجوال' },
  { value: 'design', label: 'التصميم' },
  { value: 'devops', label: 'DevOps' },
];

const citiesData = [
  { value: 'riyadh', label: 'الرياض', group: 'المنطقة الوسطى' },
  { value: 'jeddah', label: 'جدة', group: 'المنطقة الغربية' },
  { value: 'dammam', label: 'الدمام', group: 'المنطقة الشرقية' },
  { value: 'makkah', label: 'مكة المكرمة', group: 'المنطقة الغربية' },
  { value: 'madinah', label: 'المدينة المنورة', group: 'المنطقة الغربية' },
  { value: 'abha', label: 'أبها', group: 'المنطقة الجنوبية' },
  { value: 'tabuk', label: 'تبوك', group: 'المنطقة الشمالية' },
  { value: 'hail', label: 'حائل', group: 'المنطقة الشمالية' },
  { value: 'najran', label: 'نجران', group: 'المنطقة الجنوبية' },
  { value: 'qassim', label: 'القصيم', group: 'المنطقة الوسطى' },
];

const categoriesData = [
  { value: 'tech', label: 'التكنولوجيا', description: 'البرمجة والتقنية' },
  { value: 'business', label: 'الأعمال', description: 'ريادة الأعمال والإدارة' },
  { value: 'design', label: 'التصميم', description: 'التصميم الجرافيكي و UX/UI' },
  { value: 'marketing', label: 'التسويق', description: 'التسويق الرقمي والإعلان' },
  { value: 'finance', label: 'المالية', description: 'المحاسبة والاستثمار' },
  { value: 'education', label: 'التعليم', description: 'التدريب والتطوير' },
  { value: 'health', label: 'الصحة', description: 'الرعاية الصحية والطب' },
  { value: 'legal', label: 'القانون', description: 'الاستشارات القانونية' },
];

export const Default: Story = {
  args: { data: skillsData },
  render: function DefaultMultiSelect() {
    const [selected, setSelected] = React.useState(['react', 'nodejs']);
    
    return (
      <div>
        <MultiSelect
          label="اختر المهارات"
          placeholder="ابحث واختر المهارات..."
          data={skillsData}
          value={selected}
          onChange={setSelected}
          searchable
        />
        <div className="slider-value-display" style={{ marginTop: '12px' }}>
          المحدد ({selected.length}): {selected.join(', ')}
        </div>
      </div>
    );
  },
  parameters: {
    docs: { description: { story: 'MultiSelect تفاعلي مع عرض القيم المحددة.' } }
  }
};

export const Sizes: Story = {
  args: { data: skillsData, value: [] },
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-4">
        <MultiSelect
          size="xs"
          label="حجم صغير جداً"
          placeholder="اختر..."
          data={skillsData.slice(0, 5)}
          defaultValue={['react', 'vue']}
        />
        <MultiSelect
          size="sm"
          label="حجم صغير"
          placeholder="اختر..."
          data={skillsData.slice(0, 5)}
          defaultValue={['react', 'vue']}
        />
        <MultiSelect
          size="md"
          label="حجم متوسط"
          placeholder="اختر..."
          data={skillsData.slice(0, 5)}
          defaultValue={['react', 'vue']}
        />
        <MultiSelect
          size="lg"
          label="حجم كبير"
          placeholder="اختر..."
          data={skillsData.slice(0, 5)}
          defaultValue={['react', 'vue']}
        />
        <MultiSelect
          size="xl"
          label="حجم كبير جداً"
          placeholder="اختر..."
          data={skillsData.slice(0, 5)}
          defaultValue={['react', 'vue']}
        />
      </div>
    </div>
  ),
};

export const WithSearch: Story = {
  args: { data: skillsData, value: [] },
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-4">
        <MultiSelect
          label="المهارات التقنية"
          placeholder="ابحث واختر المهارات..."
          data={skillsData}
          searchable
          
          defaultValue={['react', 'nodejs', 'typescript']}
          description="يمكنك البحث عن المهارات وإضافتها"
        />
        
        <MultiSelect
          label="البحث في المدن"
          placeholder="ابحث عن المدينة..."
          data={citiesData}
          searchable
          
          defaultValue={['riyadh', 'jeddah']}
          description="اختر المدن التي تفضل العمل فيها"
        />
      </div>
    </div>
  ),
};

export const WithGroups: Story = {
  args: { data: citiesData, value: [] },
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <MultiSelect
        label="المدن المفضلة"
        placeholder="اختر المدن..."
        data={citiesData}
        searchable
        
        defaultValue={['riyadh', 'jeddah', 'dammam']}
        description="اختر المدن حسب المناطق الجغرافية"
      />
    </div>
  ),
};

export const WithDescriptions: Story = {
  args: { data: categoriesData, value: [] },
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <MultiSelect
        label="مجالات الاهتمام"
        placeholder="اختر المجالات..."
        data={categoriesData}
        searchable
        
        defaultValue={['tech', 'business', 'design']}
        description="اختر المجالات التي تهتم بها"
      />
    </div>
  ),
};

export const States: Story = {
  args: { data: skillsData, value: [] },
  render: () => (
    <div style={{ direction: 'rtl' }}>
      <div className="space-y-4">
        <MultiSelect
          label="حالة عادية"
          placeholder="اختر المهارات..."
          data={skillsData.slice(0, 8)}
          defaultValue={['react', 'vue']}
        />
        
        <MultiSelect
          label="مع وصف"
          placeholder="اختر المهارات..."
          data={skillsData.slice(0, 8)}
          defaultValue={['react', 'nodejs']}
          description="اختر المهارات التي تجيدها بشكل احترافي"
        />
        
        <MultiSelect
          label="معطل"
          placeholder="غير متاح..."
          data={skillsData.slice(0, 8)}
          defaultValue={['react', 'vue', 'angular']}
          disabled
          description="هذا الحقل معطل مؤقتاً"
        />
        
        <MultiSelect
          label="حالة خطأ"
          placeholder="اختر المهارات..."
          data={skillsData.slice(0, 8)}
          error="يجب اختيار مهارة واحدة على الأقل"
        />
      </div>
    </div>
  ),
};

export const JobApplicationForm: Story = {
  args: { data: [], value: [] },
  render: () => (
    <div style={{ direction: 'rtl', width: '500px' }}>
      <div className="border rounded-lg p-6 bg-white">
        <h3 className="text-xl font-bold mb-6">نموذج طلب الوظيفة</h3>
        
        <div className="space-y-5">
          <MultiSelect
            label="المهارات التقنية *"
            placeholder="اختر مهاراتك التقنية..."
            data={skillsData}
            searchable
            
            defaultValue={['react', 'nodejs', 'typescript', 'database']}
            description="اختر جميع المهارات التقنية التي تجيدها"
          />
          
          <MultiSelect
            label="المدن المفضلة للعمل *"
            placeholder="اختر المدن..."
            data={citiesData}
            searchable
            
            defaultValue={['riyadh', 'jeddah']}
            description="اختر المدن التي تفضل العمل فيها"
          />
          
          <MultiSelect
            label="مجالات الاهتمام"
            placeholder="اختر المجالات..."
            data={categoriesData}
            searchable
            
            defaultValue={['tech', 'business']}
            description="اختر المجالات التي تهتم بالعمل فيها (اختياري)"
          />
          
          <MultiSelect
            label="اللغات"
            placeholder="اختر اللغات..."
            data={[
              { value: 'ar', label: 'العربية' },
              { value: 'en', label: 'الإنجليزية' },
              { value: 'fr', label: 'الفرنسية' },
              { value: 'de', label: 'الألمانية' },
              { value: 'es', label: 'الإسبانية' },
              { value: 'it', label: 'الإيطالية' },
            ]}
            searchable
            defaultValue={['ar', 'en']}
            description="اختر اللغات التي تجيدها"
          />
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
            تقديم الطلب
          </button>
        </div>
      </div>
    </div>
  ),
};

export const ProjectFilters: Story = {
  args: { data: [], value: [] },
  render: () => (
    <div style={{ direction: 'rtl', width: '450px' }}>
      <div className="border rounded-lg p-5 bg-white">
        <h3 className="text-lg font-bold mb-5">فلاتر المشاريع</h3>
        
        <div className="space-y-4">
          <MultiSelect
            label="التقنيات المستخدمة"
            placeholder="فلتر حسب التقنية..."
            data={skillsData}
            searchable
            
            size="sm"
            defaultValue={['react', 'nodejs']}
          />
          
          <MultiSelect
            label="الفئة"
            placeholder="فلتر حسب الفئة..."
            data={categoriesData}
            searchable
            
            size="sm"
            defaultValue={['tech']}
          />
          
          <MultiSelect
            label="الموقع"
            placeholder="فلتر حسب الموقع..."
            data={citiesData}
            searchable
            
            size="sm"
            defaultValue={['riyadh', 'jeddah', 'dammam']}
          />
          
          <MultiSelect
            label="نوع العمل"
            placeholder="اختر نوع العمل..."
            data={[
              { value: 'full-time', label: 'دوام كامل' },
              { value: 'part-time', label: 'دوام جزئي' },
              { value: 'contract', label: 'عقد مؤقت' },
              { value: 'freelance', label: 'عمل حر' },
              { value: 'internship', label: 'تدريب' },
            ]}
            size="sm"
            defaultValue={['full-time', 'contract']}
          />
        </div>
        
        <div className="mt-5 pt-4 border-t flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700 transition-colors">
            تطبيق الفلاتر
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-1.5 text-sm rounded hover:bg-gray-50 transition-colors">
            إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  ),
};

export const UserProfileForm: Story = {
  args: { data: [], value: [] },
  render: () => (
    <div style={{ direction: 'rtl', width: '500px' }}>
      <div className="border rounded-lg p-6 bg-white">
        <h3 className="text-xl font-bold mb-6">الملف الشخصي</h3>
        
        <div className="space-y-5">
          <MultiSelect
            label="الاهتمامات والهوايات"
            placeholder="اختر اهتماماتك..."
            data={[
              { value: 'reading', label: 'القراءة' },
              { value: 'sports', label: 'الرياضة' },
              { value: 'music', label: 'الموسيقى' },
              { value: 'travel', label: 'السفر' },
              { value: 'photography', label: 'التصوير' },
              { value: 'cooking', label: 'الطبخ' },
              { value: 'gaming', label: 'الألعاب' },
              { value: 'art', label: 'الفن' },
              { value: 'nature', label: 'الطبيعة' },
              { value: 'technology', label: 'التكنولوجيا' },
            ]}
            searchable
            
            defaultValue={['reading', 'technology', 'travel']}
            description="اختر ما يعكس شخصيتك واهتماماتك"
          />
          
          <MultiSelect
            label="أنواع المحتوى المفضل"
            placeholder="اختر أنواع المحتوى..."
            data={[
              { value: 'articles', label: 'المقالات' },
              { value: 'videos', label: 'الفيديوهات' },
              { value: 'podcasts', label: 'البودكاست' },
              { value: 'courses', label: 'الدورات التدريبية' },
              { value: 'webinars', label: 'الندوات الإلكترونية' },
              { value: 'ebooks', label: 'الكتب الإلكترونية' },
              { value: 'infographics', label: 'الإنفوجرافيك' },
              { value: 'case-studies', label: 'دراسات الحالة' },
            ]}
            searchable
            defaultValue={['articles', 'videos', 'courses']}
            description="ساعدنا في تخصيص المحتوى المناسب لك"
          />
          
          <MultiSelect
            label="أوقات الإشعارات المفضلة"
            placeholder="اختر الأوقات..."
            data={[
              { value: 'morning', label: 'الصباح (6 - 12)' },
              { value: 'afternoon', label: 'بعد الظهر (12 - 6)' },
              { value: 'evening', label: 'المساء (6 - 10)' },
              { value: 'night', label: 'الليل (10 - 12)' },
            ]}
            defaultValue={['morning', 'evening']}
            description="متى تفضل استلام الإشعارات؟"
          />
        </div>
        
        <div className="mt-6 pt-4 border-t flex gap-3">
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
            حفظ التغييرات
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 transition-colors">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  ),
};

export const ValidationExample: Story = {
  args: { data: [], value: [] },
  render: () => (
    <div style={{ direction: 'rtl', width: '400px' }}>
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="text-lg font-bold mb-4">نموذج مع التحقق</h3>
        
        <div className="space-y-4">
          <MultiSelect
            label="المهارات المطلوبة *"
            placeholder="اختر المهارات..."
            data={skillsData.slice(0, 10)}
            searchable
            error="يجب اختيار 3 مهارات على الأقل"
            description="اختر المهارات التي تجيدها بشكل احترافي"
          />
          
          <MultiSelect
            label="المدن المتاحة"
            placeholder="اختر المدن..."
            data={citiesData.slice(0, 6)}
            searchable
            defaultValue={['riyadh', 'jeddah']}
            description="المدن التي يمكنك العمل فيها"
          />
          
          <MultiSelect
            label="التخصص الأكاديمي *"
            placeholder="اختر التخصص..."
            data={[
              { value: 'cs', label: 'علوم الحاسوب' },
              { value: 'se', label: 'هندسة البرمجيات' },
              { value: 'it', label: 'تقنية المعلومات' },
              { value: 'ce', label: 'هندسة الحاسوب' },
              { value: 'is', label: 'نظم المعلومات' },
              { value: 'other', label: 'أخرى' },
            ]}
            error="يجب اختيار التخصص الأكاديمي"
          />
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-red-600 mb-3">يرجى تصحيح الأخطاء أعلاه قبل المتابعة</p>
          <button 
            className="bg-gray-300 text-gray-500 px-6 py-2 rounded cursor-not-allowed"
            disabled
          >
            إرسال النموذج
          </button>
        </div>
      </div>
    </div>
  ),
};
