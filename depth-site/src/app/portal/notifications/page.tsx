"use client";

import { useEffect, useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt?: string;
  read?: boolean;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  const formatDate = (v?: string) => {
    if (!v) return "-";
    try { return new Date(v).toLocaleString('ar-SA'); } catch { return v; }
  };

  const fetchNotifications = async (before?: string | null) => {
    try {
      setLoading(true);
      setError(null);
      const url = before ? `/api/portal/notifications?before=${encodeURIComponent(before)}` : '/api/portal/notifications';
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'failed');
      const list: NotificationItem[] = json?.notifications || [];
      setItems(prev => before ? [...prev, ...list] : list);
      setCursor(list.length > 0 ? list[list.length - 1].createdAt || null : null);
    } catch (e) {
      setError('فشل تحميل الإشعارات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  return (
    <PageLayout>
      <div className="py-12 md:py-20">
        <Container>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--text)]">الإشعارات</h1>
            <p className="text-[var(--slate-600)]">عرض آخر التنبيهات المتعلقة بملفاتك وموافقاتك</p>
          </div>

          {error && (
            <div className="mb-4 text-red-600">{error}</div>
          )}

          <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
            {items.length === 0 && !loading && (
              <div className="text-center py-12 text-[var(--slate-600)]">لا توجد إشعارات حالياً</div>
            )}
            <ul className="divide-y divide-[var(--elev)]">
              {items.map(n => (
                <li key={n.id} className="p-4 hover:bg-[var(--bg)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[var(--text)] font-medium">{n.title || n.type}</div>
                      <div className="text-sm text-[var(--slate-600)]">{n.message}</div>
                    </div>
                    <div className="text-xs text-[var(--slate-600)]">{formatDate(n.createdAt)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={() => fetchNotifications(cursor)} disabled={!cursor || loading}>
              {loading ? 'جاري التحميل…' : (cursor ? 'تحميل المزيد' : 'لا مزيد')}
            </Button>
          </div>
        </Container>
      </div>
    </PageLayout>
  );
}
