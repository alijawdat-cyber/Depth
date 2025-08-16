"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff,
  Camera,
  Video,
  Palette,
  Settings,
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Award,
  Plane
} from 'lucide-react';

interface SignupFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'photographer' | 'videographer' | 'designer' | 'producer';
  city: string;
  canTravel: boolean;
  agreeToTerms: boolean;
}

export default function CreatorSignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'photographer',
    city: '',
    canTravel: false,
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) return 'الاسم الكامل مطلوب';
    if (!formData.email.trim()) return 'البريد الإلكتروني مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'البريد الإلكتروني غير صحيح';
    if (!formData.phone.trim()) return 'رقم الهاتف مطلوب';
    if (!formData.city.trim()) return 'المدينة مطلوبة';
    if (!formData.password) return 'كلمة المرور مطلوبة';
    if (formData.password.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (formData.password !== formData.confirmPassword) return 'كلمات المرور غير متطابقة';
    if (!formData.agreeToTerms) return 'يجب الموافقة على شروط المبدعين';
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
          city: formData.city,
          canTravel: formData.canTravel
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

      // توجيه لنموذج الانضمام التفصيلي
      router.push('/creators/intake?welcome=true');

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
    } catch {
      setError('فشل في التسجيل عبر Google');
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'photographer': return <Camera size={20} className="text-blue-600" />;
      case 'videographer': return <Video size={20} className="text-red-600" />;
      case 'designer': return <Palette size={20} className="text-purple-600" />;
      case 'producer': return <Settings size={20} className="text-green-600" />;
      default: return <Camera size={20} className="text-blue-600" />;
    }
  };



  return (
    <div className="min-h-screen bg-[var(--bg)] py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Link 
              href="/join" 
              className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              العودة لاختيار نوع العضوية
            </Link>
            
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">انضم كمبدع</h1>
            <p className="text-[var(--muted)]">
              ابدأ رحلتك المهنية معنا وشارك مواهبك مع عملائنا المميزين
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-lg"
          >
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <CheckCircle size={20} />
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* الاسم الكامل */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <User size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full pr-10 pl-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                    placeholder="سارة أحمد علي"
                    required
                  />
                </div>
              </div>

              {/* التخصص والمدينة */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    التخصص *
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getRoleIcon(formData.role)}
                    </div>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'photographer' | 'videographer' | 'designer' | 'producer' }))}
                      className="w-full pr-10 pl-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all appearance-none"
                      required
                    >
                      <option value="photographer">📸 مصور</option>
                      <option value="videographer">🎥 مصور فيديو</option>
                      <option value="designer">🎨 مصمم</option>
                      <option value="producer">🎬 منتج</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    المدينة *
                  </label>
                  <div className="relative">
                    <MapPin size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full pr-10 pl-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                      placeholder="بغداد"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  البريد الإلكتروني *
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pr-10 pl-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                    placeholder="sara@email.com"
                    required
                  />
                </div>
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  رقم الهاتف/واتساب *
                </label>
                <div className="relative">
                  <Phone size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pr-10 pl-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                    placeholder="+964 770 123 4567"
                    required
                  />
                </div>
              </div>

              {/* كلمة المرور */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    كلمة المرور *
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pr-10 pl-10 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                      placeholder="كلمة مرور قوية"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-1">يجب أن تحتوي على 8 أحرف على الأقل</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">
                    تأكيد كلمة المرور *
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pr-10 pl-10 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                      placeholder="إعادة كتابة كلمة المرور"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* إمكانية السفر */}
              <div className="flex items-center gap-3 p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                <input
                  type="checkbox"
                  id="canTravel"
                  checked={formData.canTravel}
                  onChange={(e) => setFormData(prev => ({ ...prev, canTravel: e.target.checked }))}
                  className="h-4 w-4 text-[var(--accent-500)] focus:ring-[var(--accent-500)] border-[var(--border)] rounded"
                />
                <label htmlFor="canTravel" className="flex items-center gap-2 text-[var(--text)]">
                  <Plane size={18} className="text-[var(--accent-500)]" />
                  يمكنني السفر للمحافظات الأخرى
                </label>
              </div>

              {/* الموافقة على الشروط */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="creator-terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-[var(--accent-500)] focus:ring-[var(--accent-500)] border-[var(--border)] rounded"
                  required
                />
                <label htmlFor="creator-terms" className="text-sm text-[var(--text)]">
                  أوافق على <Link href="/legal#creators" className="text-[var(--accent-500)] hover:underline">شروط المبدعين</Link> و 
                  <Link href="/legal#privacy" className="text-[var(--accent-500)] hover:underline"> سياسة الخصوصية</Link>
                </label>
              </div>

              {/* أزرار التسجيل */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-base"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      جاري إنشاء الحساب...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {getRoleIcon(formData.role)}
                      إنشاء حساب المبدع
                    </div>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--card)] text-[var(--muted)]">أو</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="w-full py-3 text-base"
                >
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  التسجيل بـ Google
                </Button>
              </div>
            </form>
          </motion.div>

          {/* تسجيل الدخول */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-8"
          >
            <p className="text-[var(--muted)]">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/signin" className="text-[var(--accent-500)] hover:underline font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </motion.div>

          {/* الخطوات التالية */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200"
          >
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
              <Award className="text-[var(--accent-500)]" size={20} />
              الخطوات التالية بعد التسجيل:
            </h3>
            <ol className="space-y-3">
              <li className="flex items-center gap-3 text-[var(--text)]">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span>✅ إنشاء الحساب وتأكيد البريد الإلكتروني</span>
              </li>
              <li className="flex items-center gap-3 text-[var(--text)]">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span><FileText size={16} className="inline mr-1" /> ملء نموذج التفاصيل المهنية (المعدات، المهارات، الخبرات)</span>
              </li>
              <li className="flex items-center gap-3 text-[var(--text)]">
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span><Clock size={16} className="inline mr-1" /> انتظار المراجعة والموافقة من فريقنا</span>
              </li>
              <li className="flex items-center gap-3 text-[var(--text)]">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <span>🚀 البدء في استلام المشاريع والعمل معنا!</span>
              </li>
            </ol>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
