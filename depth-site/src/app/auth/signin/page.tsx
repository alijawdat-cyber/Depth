"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Users,
  Camera
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const from = searchParams?.get('from');

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType('');

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setMessage("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setMessageType('error');
      } else if (result?.ok) {
        setMessage("تم تسجيل الدخول بنجاح، جاري التوجيه...");
        setMessageType('success');
        
        // الحصول على الجلسة لتحديد الدور والتوجيه المناسب
        const session = await getSession();
        const userRole = (session?.user as { role?: string })?.role || 'client';
        
        // التوجيه حسب الدور
        switch (userRole) {
          case 'admin':
            router.push('/admin');
            break;
          case 'creator':
            router.push('/creators');
            break;
          case 'employee':
            router.push('/employees');
            break;
          case 'client':
          default:
            router.push('/portal');
            break;
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setMessage("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage("");
    setMessageType('');
    
    try {
      await signIn("google", {
        callbackUrl: callbackUrl || "/portal",
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      setMessage("حدث خطأ أثناء تسجيل الدخول بجوجل. يرجى المحاولة مرة أخرى.");
      setMessageType('error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              العودة للصفحة الرئيسية
            </Link>
            
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">تسجيل الدخول</h1>
            <p className="text-[var(--muted)]">
              ادخل إلى حسابك للوصول لبوابتك المخصصة
            </p>
            
            {from && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  {from === 'admin' ? '🔒 يتطلب دخول المشرف للوصول لهذه الصفحة' :
                   from === 'portal' ? '🔒 يتطلب تسجيل الدخول للوصول لبوابة العميل' :
                   '🔒 يتطلب تسجيل الدخول للمتابعة'}
                </p>
              </div>
            )}
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-lg"
          >
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`flex items-center gap-2 ${
                  messageType === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {messageType === 'success' ? 
                    <CheckCircle size={20} /> : 
                    <AlertCircle size={20} />
                  }
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleCredentialsSignIn} className="space-y-6">
              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                    placeholder="example@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* كلمة المرور */}
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 pl-10 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent transition-all"
                    placeholder="كلمة المرور"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* رابط نسيان كلمة المرور */}
              <div className="text-left">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-[var(--accent-500)] hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* زر تسجيل الدخول */}
              <Button
                type="submit"
                disabled={loading || !email.trim() || !password.trim()}
                className="w-full py-3 text-base"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield size={20} />
                    تسجيل الدخول
                  </div>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[var(--card)] text-[var(--muted)]">أو</span>
              </div>
            </div>

            {/* تسجيل دخول بـ Google */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 text-base"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--accent-500)]" />
                  جاري التوجيه...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  تسجيل الدخول بـ Google
                </>
              )}
            </Button>
          </motion.div>

          {/* رابط التسجيل */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mt-8"
          >
            <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)]">
              <p className="text-[var(--text)] mb-4 font-medium">ليس لديك حساب؟</p>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/join/client">
                  <Button variant="outline" className="w-full text-sm">
                    <Users size={16} className="ml-1" />
                    انضم كعميل
                  </Button>
                </Link>
                <Link href="/creators/onboarding">
                  <Button variant="outline" className="w-full text-sm">
                    <Camera size={16} className="ml-1" />
                    انضم كمبدع
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-[var(--muted)] mt-3">
                أو <Link href="/join" className="text-[var(--accent-500)] hover:underline">اختر نوع العضوية</Link>
              </p>
            </div>
          </motion.div>

          {/* معلومات الأمان */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
              <Shield size={16} className="text-green-500" />
              <span>تسجيل دخول آمن ومحمي</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
