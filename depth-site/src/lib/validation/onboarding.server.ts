// سكيمات التحقق السيرفري للـ Onboarding - Phase 6
import { z } from 'zod';

// V2 Server validation is permanently enabled

// إعدادات ثابتة
const EXPERIENCE_LEVELS = ['مبتدئ', 'متوسط', 'متقدم', 'خبير'] as const;
const SKILL_LEVELS = ['مبتدئ', 'متوسط', 'متقدم'] as const;
const OUTPUT_LEVELS = ['raw', 'raw_basic', 'full_retouch'] as const;
const EQUIPMENT_USAGE = ['light', 'pro', 'heavy'] as const;
const EQUIPMENT_LEVEL = ['entry', 'mid', 'pro'] as const;
const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

// 1) Basic Info Schema
const BasicInfoSchema = z.object({
  role: z.string().min(1, 'التخصص مطلوب'),
  city: z.string().min(1, 'المدينة مطلوبة'),
  languages: z.array(z.string().min(1))
    .min(1, 'يجب اختيار لغة واحدة على الأقل')
    .max(4, 'لا يمكن اختيار أكثر من 4 لغات')
    .transform(langs => langs.map(lang => lang.trim().toLowerCase())),
  primaryCategories: z.array(z.string().min(1))
    .min(1, 'اختر مجالاً واحداً على الأقل')
    .max(2, 'لا يمكن اختيار أكثر من مجالين'),
  canTravel: z.boolean().default(false),
  timeZone: z.string().min(1, 'المنطقة الزمنية مطلوبة').default('Asia/Baghdad')
});

// 2) Experience Schema  
const SkillSchema = z.object({
  subcategoryId: z.string().min(1),
  level: z.enum(SKILL_LEVELS),
  years: z.number().optional(),
  // ✨ Sprint 3: Processing terminology (preferred) + backward compatibility
  processing: z.enum(OUTPUT_LEVELS).optional(),
  outputLevel: z.enum(OUTPUT_LEVELS).optional(), // للتوافق العكسي
  experienceFactor: z.number().optional()
});

const ExperienceSchema = z.object({
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  skills: z.array(SkillSchema).default([])
});

// 3) Equipment Schema
const EquipmentFactorRefSchema = z.object({
  usage: z.enum(EQUIPMENT_USAGE).optional(),
  level: z.enum(EQUIPMENT_LEVEL).optional(), 
  factor: z.number().optional()
}).optional();

const EquipmentItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  brand: z.string().optional(),
  model: z.string().optional(), 
  condition: z.string().optional(),
  factorRef: EquipmentFactorRefSchema
});

const EquipmentSchema = z.object({
  cameras: z.array(EquipmentItemSchema).default([]),
  lenses: z.array(EquipmentItemSchema).default([]),
  lighting: z.array(EquipmentItemSchema).default([]),
  audio: z.array(EquipmentItemSchema).default([]),
  accessories: z.array(EquipmentItemSchema).default([])
});

// 4) Availability Schema - الجزء الأهم في Phase 6
const TimeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):(00|30)$/, {
  message: 'الوقت يجب أن يكون بدقة 30 دقيقة (مثل 09:00 أو 14:30)'
});

const DayAvailabilitySchema = z.object({
  day: z.enum(WEEKDAYS),
  available: z.boolean(),
  startTime: TimeSchema.optional(),
  endTime: TimeSchema.optional()
}).refine((data) => {
  if (data.available) {
    return data.startTime && data.endTime;
  }
  return true;
}, {
  message: 'عند تفعيل اليوم يجب تحديد وقت البداية والنهاية'
}).refine((data) => {
  if (data.available && data.startTime && data.endTime) {
    return data.startTime < data.endTime;
  }
  return true;
}, {
  message: 'وقت البداية يجب أن يكون قبل وقت النهاية'
});

const AvailabilitySchema = z.object({
  weeklyAvailability: z.array(DayAvailabilitySchema),
  weeklyHours: z.number().optional() // سيتم اشتقاقه على السيرفر
}).refine((data) => {
  // فحص التداخل
  const overlapCheck = validateNoOverlap(data.weeklyAvailability);
  return overlapCheck.isValid;
}, {
  message: 'يوجد تداخل في أوقات العمل'
}).transform((data) => {
  // اشتقاق weeklyHours من الفترات
  const derivedHours = deriveWeeklyHours(data.weeklyAvailability);
  return {
    ...data,
    weeklyHours: Math.min(derivedHours, 60) // حد أقصى 60 ساعة
  };
});

// 5) Form Data Schema الشامل
const FormDataSchema = z.object({
  currentStep: z.number().min(1).max(5),
  completedSteps: z.array(z.number()),
  account: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional()
  }),
  basicInfo: BasicInfoSchema,
  experience: ExperienceSchema,
  equipment: EquipmentSchema,
  portfolio: z.object({
    socialMediaLinks: z.array(z.object({
      platform: z.string(),
      url: z.string().url()
    })).default([]),
    portfolioLinks: z.array(z.string().url()).default([])
  }).default({
    socialMediaLinks: [],
    portfolioLinks: []
  }),
  availability: AvailabilitySchema,
  urgentWork: z.boolean().optional()
}).strict(); // منع حقول إضافية

// دوال مساعدة
type DayAvailability = {
  day: string;
  available: boolean;
  startTime?: string;
  endTime?: string;
};

function deriveWeeklyHours(availability: DayAvailability[]): number {
  let totalMinutes = 0;
  
  for (const day of availability) {
    if (day.available && day.startTime && day.endTime) {
      const start = parseTime(day.startTime);
      const end = parseTime(day.endTime);
      
      // منع start === end حتى بعد التطبيع
      if (start >= end) continue;
      
      // حد أقصى للفترة: 24 ساعة
      const duration = Math.min(end - start, 24 * 60);
      totalMinutes += duration;
    }
  }
  
  // تحويل إلى ساعات + قص للحد الأقصى 60 + تقريب لأقرب 0.5
  const totalHours = totalMinutes / 60;
  const clampedHours = Math.min(totalHours, 60);
  return Math.round(clampedHours * 2) / 2; // تقريب لأقرب نصف ساعة
}

function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// فحص التداخل في نفس اليوم
function validateNoOverlap(availability: DayAvailability[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // تجميع الفترات حسب اليوم
  const daySlots: Record<string, Array<{start: number; end: number}>> = {};
  
  for (const day of availability) {
    if (day.available && day.startTime && day.endTime) {
      if (!daySlots[day.day]) daySlots[day.day] = [];
      
      const start = parseTime(day.startTime);
      const end = parseTime(day.endTime);
      daySlots[day.day].push({ start, end });
    }
  }
  
  // فحص التداخل داخل كل يوم
  for (const [dayName, slots] of Object.entries(daySlots)) {
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const slot1 = slots[i];
        const slot2 = slots[j];
        
        // فحص التداخل: slot1.start < slot2.end && slot2.start < slot1.end
        if (slot1.start < slot2.end && slot2.start < slot1.end) {
          errors.push(`تداخل أوقات في يوم ${dayName}`);
        }
      }
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// تصدير الأدوات
export {
  FormDataSchema,
  BasicInfoSchema,
  ExperienceSchema,
  EquipmentSchema,
  AvailabilitySchema,
  deriveWeeklyHours,
  validateNoOverlap,
  OUTPUT_LEVELS
};

// نوع TypeScript للاستخدام
export type ValidatedFormData = z.infer<typeof FormDataSchema>;
