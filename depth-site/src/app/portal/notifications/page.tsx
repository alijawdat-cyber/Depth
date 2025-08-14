"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Bell, Check, RefreshCw } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: "high" | "medium" | "low" | string;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);

  const fetchPage = async (cursor?: string | null) => {
    setLoading(true);
    try {
      const url = new URL('/api/portal/notifications', window.location.origin);
      url.searchParams.set('limit', '20');
      if (cursor) url.searchParams.set('cursor', cursor);
      const res = await fetch(url.toString(), { cache: 'no-store' });
      const j = await res.json();
      if (res.ok && j?.success) {
        if (cursor) setItems(prev => prev.concat(j.notifications || []));
        else setItems(j.notifications || []);
        setNextCursor(j.nextCursor || null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPage(); }, []);

  const markRead = async (id: string) => {
    try {
      setMarking(true);
      await fetch('/api/portal/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', notificationId: id })
      });
      setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } finally { setMarking(false); }
  };

  const markAll = async () => {
    try {
      setMarking(true);
      await fetch('/api/portal/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' })
      });
      setItems(prev => prev.map(n => ({ ...n, read: true })));
    } finally { setMarking(false); }
  };

  const getPriorityColor = (p: string) => p === 'high' ? 'text-red-600 bg-red-50' : p === 'medium' ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50';

  const formatTimeAgo = (iso: string) => {
    const now = Date.now();
    const d = new Date(iso).getTime();
    const diff = now - d;
    const m = Math.floor(diff / 60000);
    if (m < 60) return `منذ ${m} دقيقة`;
    const h = Math.floor(m / 60);
    if (h < 24) return `منذ ${h} ساعة`;
    return `منذ ${Math.floor(h / 24)} يوم`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[var(--text)] flex items-center gap-2"><Bell size={18} /> الإشعارات</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => fetchPage()} className="flex items-center gap-2">
            <RefreshCw size={14} /> تحديث
          </Button>
          <Button variant="ghost" onClick={markAll} disabled={marking}>
            تعليم الكل كمقروء
          </Button>
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)]">
        {items.length === 0 && !loading && (
          <div className="p-8 text-center text-[var(--slate-600)]">
            لا توجد إشعارات حالياً
          </div>
        )}

        {items.map(n => (
          <div key={n.id} className={`p-4 border-b border-[var(--elev)] ${!n.read ? 'bg-blue-50/50' : ''}`}>
            <div className="flex items-start gap-3">
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(n.priority)}`}>{n.priority === 'high' ? 'عالي' : n.priority === 'medium' ? 'متوسط' : 'منخفض'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-[var(--text)]">{n.title}</div>
                    <div className="text-sm text-[var(--slate-600)] mt-1">{n.message}</div>
                  </div>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="p-1 hover:bg-[var(--bg)] rounded" title="تعليم كمقروء">
                      <Check size={14} className="text-[var(--accent-500)]" />
                    </button>
                  )}
                </div>
                <div className="text-[var(--slate-500)] text-xs mt-2">{formatTimeAgo(n.createdAt)}</div>
              </div>
            </div>
          </div>
        ))}

        {nextCursor && (
          <div className="p-4 text-center">
            <Button onClick={() => fetchPage(nextCursor)} disabled={loading}>
              {loading ? 'جاري التحميل...' : 'تحميل المزيد'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

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
