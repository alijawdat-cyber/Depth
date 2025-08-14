"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Bell, Check, RefreshCw } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  read: boolean;
  createdAt: string;
}

export default function PortalNotificationsPage() {
  const [list, setList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/notifications");
      const json = await res.json();
      if (json?.success) {
        setList(json.notifications);
      }
    } finally {
      setLoading(false);
    }
  };

  const markOne = async (id: string) => {
    await fetch("/api/portal/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markRead", notificationId: id }),
    });
    setList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAll = async () => {
    setMarkingAll(true);
    try {
      await fetch("/api/portal/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllRead" }),
      });
      setList((prev) => prev.map((n) => ({ ...n, read: true })));
    } finally {
      setMarkingAll(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="py-8 md:py-12">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
              <Bell size={20} /> جميع الإشعارات
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={fetchAll} disabled={loading}>
                <RefreshCw size={14} className="mr-1" /> تحديث
              </Button>
              <Button variant="primary" onClick={markAll} disabled={markingAll || list.every((n)=>n.read)}>
                <Check size={14} className="mr-1" /> تعليم الكل كمقروء
              </Button>
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius-lg)] overflow-hidden">
            {list.length === 0 ? (
              <div className="p-10 text-center text-[var(--slate-600)]">
                {loading ? "جاري التحميل..." : "لا توجد إشعارات"}
              </div>
            ) : (
              <ul>
                {list.map((n) => (
                  <li key={n.id} className={`p-4 border-b border-[var(--elev)] ${!n.read ? 'bg-blue-50/40' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-[var(--text)]">{n.title}</div>
                        <div className="text-sm text-[var(--slate-700)] mt-1">{n.message}</div>
                        <div className="text-xs text-[var(--slate-500)] mt-2">{new Date(n.createdAt).toLocaleString('ar-SA')}</div>
                      </div>
                      {!n.read && (
                        <Button variant="ghost" size="sm" onClick={() => markOne(n.id)}>
                          <Check size={12} className="mr-1" /> مقروء
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}

