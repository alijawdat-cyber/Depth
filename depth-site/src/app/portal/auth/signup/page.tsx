"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create client profile first
      const response = await fetch('/api/portal/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          company,
          phone,
        }),
      });

      if (response.ok) {
        // Send magic link email
        const result = await signIn('email', {
          email,
          redirect: false,
          callbackUrl: '/portal',
        });

        if (result?.ok) {
          // Redirect to success page
          router.push('/portal/auth/success');
        } else {
          setMessage('حدث خطأ في إرسال البريد الإلكتروني. حاول مرة أخرى.');
        }
      } else {
        const data = await response.json();
        setMessage(data.error || 'حدث خطأ في التسجيل');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signIn('google', {
        callbackUrl: '/portal',
      });
    } catch (error) {
      console.error('Google signup error:', error);
      setMessage('حدث خطأ في تسجيل الدخول بـ Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="py-12 md:py-20">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)]">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">إنشاء حساب جديد</h1>
                <p className="text-[var(--muted)]">
                  أنشئ حسابك للوصول إلى بوابة العميل
                </p>
              </div>

              {message && (
                <div className={`p-4 rounded-lg mb-6 text-sm ${
                  message.includes('تم إرسال') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    اسم الشركة/المشروع
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    placeholder="أدخل اسم شركتك أو مشروعك"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    placeholder="+964 XXX XXX XXXX"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--accent-500)] text-[var(--text-dark)] py-3 px-4 rounded-lg font-medium hover:bg-[var(--accent-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--card)] text-[var(--muted)]">أو</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-[var(--border)] rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  التسجيل بـ Google
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-[var(--muted)]">
                لديك حساب بالفعل؟{' '}
                <button
                  onClick={() => router.push('/portal/auth/signin')}
                  className="text-[var(--accent-500)] hover:underline font-medium"
                >
                  سجل دخولك
                </button>
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
