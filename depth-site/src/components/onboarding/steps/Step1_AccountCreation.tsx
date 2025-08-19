// الخطوة الأولى: إنشاء الحساب
'use client';

import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Shield, CheckCircle } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { InputField, CheckboxField } from '../shared/FormField';
import { StepHeader } from '../OnboardingLayout';
import Link from 'next/link';

export default function Step1_AccountCreation() {
  const { formData, updateAccountData, getFieldError, getFieldErrorV2, markFieldTouched } = useOnboarding();
  const FF_VALIDATION_V2 = process.env.NEXT_PUBLIC_ONBOARDING_VALIDATION_V2 === 'true';
  const getError = FF_VALIDATION_V2 && getFieldErrorV2 ? getFieldErrorV2 : getFieldError;
  const { account } = formData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <StepHeader
        title="إنشاء حسابك"
        subtitle="ابدأ رحلتك المهنية معنا بإنشاء حساب آمن"
        icon={User}
        step={1}
        totalSteps={5}
      />

      {/* Form Fields */}
      <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto px-2 sm:px-0">
        {/* الاسم الكامل */}
        <InputField
          label="الاسم الكامل"
          value={account.fullName}
          onChange={(value) => updateAccountData({ fullName: value })}
          onBlur={() => markFieldTouched('account.fullName')}
          placeholder="أحمد محمد علي"
          icon={<User size={18} />}
          required
          error={getError('account.fullName') || getFieldError('الاسم')}
          description="اسمك كما تريد أن يظهر للعملاء"
        />

        {/* البريد الإلكتروني */}
        <InputField
          label="البريد الإلكتروني"
          type="email"
          value={account.email}
          onChange={(value) => updateAccountData({ email: value })}
          onBlur={() => markFieldTouched('account.email')}
          placeholder="ahmed@example.com"
          icon={<Mail size={18} />}
          required
          error={getError('account.email') || getFieldError('البريد') || getFieldError('الإلكتروني')}
          description="سيُستخدم لتسجيل الدخول واستلام الإشعارات"
          name="email"
          autoComplete="email"
        />

        {/* رقم الهاتف */}
        <InputField
          label="رقم الهاتف/واتساب"
          type="tel"
          value={account.phone}
          onChange={(value) => updateAccountData({ phone: value })}
          onBlur={() => markFieldTouched('account.phone')}
          placeholder="+964 770 123 4567"
          icon={<Phone size={18} />}
          required
          error={getError('account.phone') || getFieldError('الهاتف')}
          description="للتواصل السريع وتأكيد المشاريع"
          name="phone"
          autoComplete="tel"
        />

        {/* كلمات المرور */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="w-full">
            <InputField
              label="كلمة المرور"
              type="password"
              value={account.password}
              onChange={(value) => updateAccountData({ password: value })}
              onBlur={() => markFieldTouched('account.password')}
              placeholder="كلمة مرور قوية"
              icon={<Lock size={18} />}
              showPasswordToggle
              required
              error={getError('account.password') || getFieldError('كلمة المرور') || getFieldError('قصيرة')}
              description="8 أحرف على الأقل"
              name="new-password"
              autoComplete="new-password"
            />
          </div>

          <div className="w-full">
            <InputField
              label="تأكيد كلمة المرور"
              type="password"
              value={account.confirmPassword}
              onChange={(value) => updateAccountData({ confirmPassword: value })}
              onBlur={() => markFieldTouched('account.confirmPassword')}
              placeholder="إعادة كتابة كلمة المرور"
              icon={<Lock size={18} />}
              showPasswordToggle
              required
              error={getError('account.confirmPassword') || getFieldError('متطابقة')}
              description="يجب أن تطابق كلمة المرور"
              name="confirm-password"
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* الموافقة على الشروط */}
        <CheckboxField
          label="أوافق على شروط الخدمة وسياسة الخصوصية"
          value={account.agreeToTerms}
          onChange={(checked) => {
            updateAccountData({ agreeToTerms: checked });
            markFieldTouched('account.agreeToTerms');
          }}
          required
          error={getError('account.agreeToTerms') || getFieldError('الشروط')}
          description={
            <span>
              بالموافقة، أنت تقبل{' '}
              <Link href="/legal#terms" className="text-[var(--accent-500)] hover:underline">
                شروط الخدمة
              </Link>
              {' و '}
              <Link href="/legal#privacy" className="text-[var(--accent-500)] hover:underline">
                سياسة الخصوصية
              </Link>
            </span>
          }
        />
      </div>

      {/* Security Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-[var(--accent-50)] border border-[var(--accent-200)] rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[var(--accent-500)] rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--accent-800)] mb-2">
                🔒 حسابك آمن معنا
              </h3>
              <ul className="space-y-2 text-sm text-[var(--accent-700)]">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  تشفير كلمات المرور بأحدث التقنيات
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  حماية البيانات الشخصية وفقاً لمعايير GDPR
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  عدم مشاركة معلوماتك مع أطراف ثالثة
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  إمكانية حذف الحساب والبيانات في أي وقت
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Login Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-[var(--muted)]">
          لديك حساب بالفعل؟{' '}
          <Link 
            href="/auth/signin?callbackUrl=/creators/onboarding" 
            className="text-[var(--accent-500)] hover:underline font-medium"
          >
            تسجيل الدخول
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
