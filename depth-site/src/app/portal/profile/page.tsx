"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: string;
  role: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/portal/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/portal/clients');
      const data = await response.json();

      if (data.success) {
        setProfile(data.client);
        setFormData({
          name: data.client.name || '',
          company: data.client.company || '',
          phone: data.client.phone || '',
        });
      } else {
        setMessage('فشل في تحميل البيانات');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      setMessage('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/portal/clients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('تم تحديث البيانات بنجاح');
        // Update local profile state
        if (profile) {
          setProfile({ ...profile, ...formData });
        }
      } else {
        setMessage(data.error || 'فشل في تحديث البيانات');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage('حدث خطأ في تحديث البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <main className="py-12 md:py-20">
          <Container>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)]"></div>
            </div>
          </Container>
        </main>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="py-12 md:py-20">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">الملف الشخصي</h1>
              <p className="text-[var(--muted)]">
                إدارة معلوماتك الشخصية وبيانات الشركة
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg mb-6 text-sm ${
                message.includes('بنجاح') 
                  ? 'bg-[var(--success-bg)] text-[var(--success-fg)] border border-[var(--success-border)]' 
                  : 'bg-[var(--danger-bg)] text-[var(--danger-fg)] border border-[var(--danger-border)]'
              }`}>
                {message}
              </div>
            )}

            <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)]">
              {/* Status Badge */}
              {profile && (
                <div className="mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    profile.status === 'active' 
                      ? 'bg-[var(--success-bg)] text-[var(--success-fg)]' 
                      : profile.status === 'pending'
                      ? 'bg-[var(--warning-bg)] text-[var(--warning-fg)]'
                      : 'bg-[var(--danger-bg)] text-[var(--danger-fg)]'
                  }`}>
                    {profile.status === 'active' && '✓ حساب مفعل'}
                    {profile.status === 'pending' && '⏳ في انتظار التفعيل'}
                    {profile.status === 'suspended' && '⚠️ حساب معلق'}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">
                    لا يمكن تغيير البريد الإلكتروني
                  </p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
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
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                    placeholder="أدخل اسم شركتك أو مشروعك"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                    placeholder="+964 XXX XXX XXXX"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[var(--brand-500)] text-[var(--text-dark)] py-3 px-4 rounded-lg font-medium hover:bg-[var(--brand-700)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => router.push('/portal')}
                    className="px-6 py-3 border border-[var(--border)] rounded-lg font-medium hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    رجوع
                  </button>
                </div>
              </form>
            </div>

            {/* Account Actions */}
            <div className="mt-8 bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
              <h3 className="text-lg font-semibold mb-4">إعدادات الحساب</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <h4 className="font-medium">كلمة المرور</h4>
                    <p className="text-sm text-[var(--muted)]">تغيير كلمة مرور الحساب</p>
                  </div>
                  <button className="text-[var(--accent-500)] hover:underline text-sm font-medium">
                    تغيير كلمة المرور
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="font-medium">الإشعارات</h4>
                    <p className="text-sm text-[var(--muted)]">إدارة إشعارات البريد الإلكتروني</p>
                  </div>
                  <button className="text-[var(--accent-500)] hover:underline text-sm font-medium">
                    إدارة الإشعارات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
