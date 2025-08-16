"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

type AdminProfile = {
  name?: string;
  email?: string;
  twoFactorEnabled?: boolean;
  language?: string;
  theme?: 'light' | 'dark' | 'system';
};

export default function AdminProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?from=admin-profile');
      return;
    }
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/admin/profile', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setProfile(data.profile || {});
    } catch {
      setMessage('تعذر تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'خطأ');
      setMessage('تم حفظ التغييرات بنجاح');
    } catch (e) {
      setMessage((e as Error).message || 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-[var(--accent-500)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="py-10">
        <Container>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">الملف الشخصي (أدمن)</h1>
            <p className="text-[var(--muted)] mb-6">
              إعدادات الحساب والأمان - مرحباً {session?.user?.name || session?.user?.email || 'المدير'}
            </p>

            {message && (
              <div className="mb-4 text-sm p-3 rounded border border-[var(--elev)]">{message}</div>
            )}

            <form onSubmit={save} className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm">الاسم</span>
                <input value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm">البريد</span>
                <input value={profile.email || ''} disabled className="input opacity-70" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm">اللغة</span>
                <select value={profile.language || 'ar'} onChange={(e) => setProfile({ ...profile, language: e.target.value })} className="input">
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm">السِمة</span>
                <select value={profile.theme || 'system'} onChange={(e) => setProfile({ ...profile, theme: e.target.value as 'light' | 'dark' | 'system' })} className="input">
                  <option value="light">فاتح</option>
                  <option value="dark">داكن</option>
                  <option value="system">حسب النظام</option>
                </select>
              </label>
              <div className="flex items-center gap-3">
                <button disabled={saving} className="btn-primary">{saving ? 'جارٍ الحفظ...' : 'حفظ'}</button>
              </div>
            </form>
          </div>
        </Container>
      </main>
    </div>
  );
}


