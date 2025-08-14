"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Mail, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/portal",
      });

      if (result?.error) {
        setMessage("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
      } else {
        setMessage("تم إرسال رابط تسجيل الدخول إلى بريدك الإلكتروني. يرجى فحص صندوق الوارد.");
      }
    } catch {
      setMessage("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/portal",
      });
    } catch {
      setMessage("حدث خطأ أثناء تسجيل الدخول بجوجل. يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="py-12">
        <Container>
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm text-[var(--slate-600)] hover:text-[var(--text)] transition-colors duration-200 mb-6"
              >
                <ArrowLeft size={16} />
                رجوع
              </button>
              
              <h1 className="text-3xl font-bold text-[var(--text)] mb-2">تسجيل الدخول</h1>
              <p className="text-[var(--slate-600)]">ادخل إلى بوابة العميل الخاصة بك</p>
            </div>

            {/* Sign In Form */}
            <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--elev)] rounded-[var(--radius)] text-[var(--text)] hover:bg-[var(--elev)] transition-colors duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? "جاري التحميل..." : "تسجيل الدخول بجوجل"}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--elev)]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[var(--card)] text-[var(--slate-600)]">أو</span>
                </div>
              </div>

              {/* Email Sign In */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text)] mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@example.com"
                      required
                      className="w-full px-4 py-3 pr-12 border border-[var(--elev)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)] placeholder-[var(--slate-400)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--slate-400)]" size={20} />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading || !email}
                >
                  {loading ? "جاري الإرسال..." : "إرسال رابط تسجيل الدخول"}
                </Button>
              </form>

              {/* Message */}
              {message && (
                <div className={`mt-4 p-3 rounded-[var(--radius)] text-sm ${
                  message.includes("تم إرسال")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {message}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="text-center mt-6 space-y-3">
              <p className="text-sm text-[var(--slate-600)]">
                ليس لديك حساب؟{' '}
                <button
                  onClick={() => router.push('/portal/auth/signup')}
                  className="text-[var(--accent-500)] hover:underline font-medium"
                >
                  أنشئ حساباً جديداً
                </button>
              </p>
              
              <p className="text-sm text-[var(--slate-600)]">
                هل تواجه مشكلة في تسجيل الدخول؟{" "}
                <a
                  href="mailto:admin@depth-agency.com"
                  className="text-[var(--accent-500)] hover:underline"
                >
                  تواصل مع الدعم
                </a>
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
