"use client";

// صفحة تسجيل المبدعين - متوافقة مع docs/roles/creator/02-Role-Workflows.md
// الغرض: تسجيل المبدعين الجدد وتوجيههم لنموذج الانضمام
// التدفق: تسجيل → تأكيد البريد/الهاتف → توجيه لـ intake form

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorBoundary';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  Camera,
  Palette,
  Video,
  Settings,
  CheckCircle,
  ArrowRight,
  Globe
} from 'lucide-react';

interface SignupFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'photographer' | 'videographer' | 'designer' | 'producer';
  city: string;
  agreeToTerms: boolean;
}

export default function CreatorSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'photographer',
    city: '',
    agreeToTerms: false
  });

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) return 'الاسم الكامل مطلوب';
    if (!formData.email.trim()) return 'البريد الإلكتروني مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'البريد الإلكتروني غير صحيح';
    if (!formData.phone.trim()) return 'رقم الهاتف مطلوب';
    if (formData.password.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (formData.password !== formData.confirmPassword) return 'كلمات المرور غير متطابقة';
    if (!formData.city.trim()) return 'المدينة مطلوبة';
    if (!formData.agreeToTerms) return 'يجب الموافقة على الشروط والأحكام';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // إنشاء حساب المبدع
      const response = await fetch('/api/creators/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          city: formData.city
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'فشل في إنشاء الحساب');
      }

      // تسجيل دخول تلقائي
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (signInResult?.error) {
        throw new Error('تم إنشاء الحساب لكن فشل تسجيل الدخول');
      }

      // توجيه لنموذج الانضمام
      router.push(`/creators/intake?welcome=true`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await signIn('google', { 
        callbackUrl: '/creators/intake?welcome=true&provider=google' 
      });
    } catch (err) {
      setError('فشل في التسجيل عبر Google');
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      photographer: Camera,
      videographer: Video,
      designer: Palette,
      producer: Settings
    };
    return icons[role as keyof typeof icons] || Camera;
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      photographer: 'مصور',
      videographer: 'مصور فيديو',
      designer: 'مصمم',
      producer: 'منتج'
    };
    return labels[role as keyof typeof labels] || 'مصور';
  };

  if (loading) {
    return <PageLoader text="جاري إنشاء حسابك..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] to-[var(--accent-50)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent-500)] rounded-2xl mb-4">
            <User size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">
            انضم كمبدع محترف
          </h1>
          <p className="text-[var(--muted)]">
            ابدأ رحلتك مع Depth واعرض مواهبك للعالم
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--elev)] p-6 shadow-lg">
          {/* Error Message */}
          {error && (
            <ErrorMessage
              message={error}
              onClose={() => setError(null)}
              className="mb-6"
            />
          )}

          {/* Google Signup */}
          <Button
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full mb-6 h-12"
            disabled={loading}
          >
            <Globe size={20} />
            التسجيل عبر Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--elev)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--card)] text-[var(--muted)]">أو</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                الاسم الكامل *
              </label>
              <div className="relative">
                <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full pr-10 pl-4 py-3 border border-[var(--elev)] rounded-lg bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                البريد الإلكتروني *
              </label>
              <div className="relative">
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pr-10 pl-4 py-3 border border-[var(--elev)] rounded-lg bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                رقم الهاتف *
              </label>
              <div className="relative">
                <Phone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pr-10 pl-4 py-3 border border-[var(--elev)] rounded-lg bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                  placeholder="+964 xxx xxx xxxx"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                التخصص *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['photographer', 'videographer', 'designer', 'producer'] as const).map((role) => {
                  const Icon = getRoleIcon(role);
                  const isSelected = formData.role === role;
                  
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-[var(--accent-500)] bg-[var(--accent-50)] text-[var(--accent-700)]' 
                          : 'border-[var(--elev)] bg-[var(--bg)] text-[var(--muted)] hover:border-[var(--accent-300)]'
                      }`}
                    >
                      <Icon size={20} className="mx-auto mb-1" />
                      <div className="text-xs font-medium">{getRoleLabel(role)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                المدينة *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-3 border border-[var(--elev)] rounded-lg bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                required
              >
                <option value="">اختر المدينة</option>
                <option value="baghdad">بغداد</option>
                <option value="basra">البصرة</option>
                <option value="erbil">أربيل</option>
                <option value="sulaymaniyah">السليمانية</option>
                <option value="najaf">النجف</option>
                <option value="karbala">كربلاء</option>
                <option value="mosul">الموصل</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                كلمة المرور *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pr-10 pl-10 py-3 border border-[var(--elev)] rounded-lg bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                  placeholder="8 أحرف على الأقل"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">
                تأكيد كلمة المرور *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pr-10 pl-10 py-3 border border-[var(--elev)] rounded-lg bg-[var(--bg)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                  placeholder="أعد كتابة كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                className="mt-0.5 h-4 w-4 text-[var(--accent-500)] border-[var(--elev)] rounded focus:ring-[var(--accent-500)]"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-[var(--text)]">
                أوافق على{' '}
                <Link href="/terms" className="text-[var(--accent-500)] hover:underline">
                  الشروط والأحكام
                </Link>
                {' '}و{' '}
                <Link href="/privacy" className="text-[var(--accent-500)] hover:underline">
                  سياسة الخصوصية
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={loading}
            >
              {loading ? 'جاري إنشاء الحساب...' : (
                <>
                  إنشاء الحساب
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-[var(--elev)]">
            <p className="text-sm text-[var(--muted)]">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/signin" className="text-[var(--accent-500)] hover:underline font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--muted)] mb-4">ماذا ستحصل عليه:</p>
          <div className="flex justify-center gap-6 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-green-500" />
              مشاريع حصرية
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-green-500" />
              أسعار عادلة
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-green-500" />
              دعم مستمر
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
