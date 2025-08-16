"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

type CreatorProfile = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  specialty?: string; // التصوير/التصميم/مونتاج
  portfolioUrl?: string;
  status?: string; // pending/approved/restricted
};

export default function CreatorProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<CreatorProfile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?from=creator-profile");
      return;
    }
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/creators/profile", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setProfile(data.profile || {});
    } catch {
      setMessage("تعذر تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/creators/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "خطأ");
      setMessage("تم حفظ التغييرات بنجاح");
    } catch (e) {
      setMessage((e as Error).message || "فشل الحفظ");
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
            <h1 className="text-2xl font-bold mb-1">ملفي كمبدع</h1>
            <p className="text-[var(--muted)] mb-6">تحديث بياناتك المهنية وروابط أعمالك</p>

            {message && (
              <div className="mb-4 text-sm p-3 rounded border border-[var(--elev)]">{message}</div>
            )}

            <form onSubmit={save} className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm">الاسم</span>
                <input value={profile.name || ""} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm">الهاتف</span>
                <input value={profile.phone || ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm">التخصص</span>
                <input value={profile.specialty || ""} onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} className="input" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm">رابط البورتفوليو</span>
                <input value={profile.portfolioUrl || ""} onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })} className="input" />
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


