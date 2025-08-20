import { telemetry } from '@/lib/telemetry/client';
import type { OnboardingFormData } from '@/types/onboarding';

export type FieldError = { field: string; code: string; message: string };
export type ValidationResult = { isValid: boolean; errors: FieldError[]; warnings: FieldError[] };

export const ERR_MSG_AR: Record<string, string> = {
  req: 'هذا الحقل مطلوب',
  email: 'صيغة البريد غير صحيحة',
  min8: 'يجب أن تكون 8 أحرف على الأقل',
  match: 'كلمتا السر غير متطابقتين',
  phone: 'رقم الهاتف غير صالح',
  agree: 'يجب الموافقة على الشروط',
  role: 'يجب اختيار التخصص',
  city: 'المدينة مطلوبة',
  categories: 'اختر مجالاً واحداً على الأقل',
  categories_max: 'لا يمكن اختيار أكثر من مجالين',
  lang_min: 'يجب اختيار لغة واحدة على الأقل',
  lang_max_4: 'لا يمكن اختيار أكثر من 4 لغات',
  exp_level: 'مستوى الخبرة مطلوب',
  processing_required: 'يجب تحديد مستوى الإخراج لكل مهارة',
  availability: 'نوع التوفر مطلوب',
  hours_range: 'عدد الساعات يجب أن يكون بين 1 و 60',
  day_required: 'اختر يوماً واحداً على الأقل للعمل',
  time_order: 'وقت البداية يجب أن يكون قبل وقت النهاية',
  time_overlap: 'هناك تداخل في أوقات يوم واحد'
};

const isEmpty = (v: unknown) => v == null || (typeof v === 'string' && v.trim() === '');
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isPhoneIQ = (s: string) => /^0?7\d{9}$/.test(s);

export function validateStructured(step: number, data: OnboardingFormData): ValidationResult {
  const errors: FieldError[] = [];
  const warnings: FieldError[] = [];
  const track = (f: string, c: string) => telemetry.validationFail(step, f, c);

  if (step === 1) {
    const acc = data.account;
    if (isEmpty(acc.fullName)) { errors.push({ field: 'account.fullName', code: 'req', message: ERR_MSG_AR.req }); track('account.fullName','req'); }
    if (isEmpty(acc.email) || !isEmail(acc.email)) { errors.push({ field: 'account.email', code: 'email', message: ERR_MSG_AR.email }); track('account.email','email'); }
    if (isEmpty(acc.password) || (acc.password?.length || 0) < 8) { errors.push({ field: 'account.password', code: 'min8', message: ERR_MSG_AR.min8 }); track('account.password','min8'); }
    if (acc.password !== acc.confirmPassword) { errors.push({ field: 'account.confirmPassword', code: 'match', message: ERR_MSG_AR.match }); track('account.confirmPassword','match'); }
    if (!isEmpty(acc.phone) && !isPhoneIQ(acc.phone)) { errors.push({ field: 'account.phone', code: 'phone', message: ERR_MSG_AR.phone }); track('account.phone','phone'); }
    if (!acc.agreeToTerms) { errors.push({ field: 'account.agreeToTerms', code: 'agree', message: ERR_MSG_AR.agree }); track('account.agreeToTerms','agree'); }
  } else if (step === 2) {
    const b = data.basicInfo;
    if (isEmpty(b.role)) errors.push({ field: 'basicInfo.role', code: 'role', message: ERR_MSG_AR.role });
    if (isEmpty(b.city)) errors.push({ field: 'basicInfo.city', code: 'city', message: ERR_MSG_AR.city });
    if (!Array.isArray(b.primaryCategories) || b.primaryCategories.length === 0) {
      errors.push({ field: 'basicInfo.primaryCategories', code: 'categories', message: ERR_MSG_AR.categories });
    } else if (b.primaryCategories.length > 2) {
      errors.push({ field: 'basicInfo.primaryCategories', code: 'categories_max', message: ERR_MSG_AR.categories_max });
    }
    const langs = b.languages || [];
    if (langs.length < 1) errors.push({ field: 'basicInfo.languages', code: 'lang_min', message: ERR_MSG_AR.lang_min });
    if (langs.length > 4) errors.push({ field: 'basicInfo.languages', code: 'lang_max_4', message: ERR_MSG_AR.lang_max_4 });
  } else if (step === 3) {
    const exp = data.experience;
    if (isEmpty(exp.experienceLevel)) errors.push({ field: 'experience.experienceLevel', code: 'exp_level', message: ERR_MSG_AR.exp_level });
    if (Array.isArray(exp.skills)) {
      exp.skills.forEach((skill, i) => {
        const processingValue = skill.processing || skill.outputLevel; // TODO remove outputLevel fallback after migration
        if (!processingValue || !['raw','raw_basic','full_retouch'].includes(processingValue)) {
          errors.push({ field: `experience.skills[${i}].processing`, code: 'processing_required', message: ERR_MSG_AR.processing_required });
        }
      });
    }
  } else if (step === 5) {
    const av = data.availability;
    if (isEmpty(av.availability)) errors.push({ field: 'availability.availability', code: 'availability', message: ERR_MSG_AR.availability });
    const active = (av.weeklyAvailability || []).filter(d => d.available && d.startTime && d.endTime);
    if (active.length === 0) errors.push({ field: 'availability.availability', code: 'day_required', message: ERR_MSG_AR.day_required });
    const byDay: Record<string, { start: number; end: number }[]> = {};
    active.forEach(slot => {
      const start = Date.parse(`2000-01-01T${slot.startTime}`);
      const end = Date.parse(`2000-01-01T${slot.endTime}`);
      if (isNaN(start) || isNaN(end) || start >= end) {
        errors.push({ field: 'availability.availability', code: 'time_order', message: ERR_MSG_AR.time_order });
        return;
      }
      const rec = { start, end };
      if (!byDay[slot.day]) byDay[slot.day] = [];
      byDay[slot.day].push(rec);
    });
    Object.keys(byDay).forEach(day => {
      const arr = byDay[day].sort((a,b)=>a.start-b.start);
      for (let i=1;i<arr.length;i++) if (arr[i].start < arr[i-1].end) { errors.push({ field: 'availability.availability', code: 'time_overlap', message: ERR_MSG_AR.time_overlap }); break; }
    });
    const hours = av.weeklyHours;
    if (typeof hours !== 'number' || hours < 1 || hours > 60) errors.push({ field: 'availability.weeklyHours', code: 'hours_range', message: ERR_MSG_AR.hours_range });
  }
  return { isValid: errors.length === 0, errors, warnings };
}
