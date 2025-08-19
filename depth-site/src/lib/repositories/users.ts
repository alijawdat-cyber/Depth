/**
 * Users Repository Abstraction (النظام الموحد)
 * ------------------------------------------------------
 * هدف الملف: نقطة وصول قياسية لكل العمليات على مجموعة users
 * يقلل التكرار ويضيف طبقات (Caching / Pagination / Transactions / Guards)
 *
 * ملاحظات تصميم:
 * 1. لا نستخدم أي تبعيات خارجية (LRU بسيط داخلي) لتقليل الحجم.
 * 2. كل دوال الكتابة تضيف updatedAt تلقائياً.
 * 3. مسارات حساسة (loginAttempts) معزولة لتسهيل ضبط قيود الأمان.
 * 4. التعليقات bilingual لسهولة التعاون بين الفرق.
 */

import { adminDb } from '@/lib/firebase/admin';
import type { UnifiedUser, UserRole, Availability } from '@/types/unified-user';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreatorListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialty?: string;
  skills?: string[]; // simplified skill IDs (subcategoryId)
  tier?: string;
  modifier?: number;
  city?: string;
}

export interface ListUsersOptions {
  role?: UserRole;
  limit?: number;
  status?: string;
  orderBy?: string; // default createdAt desc
  direction?: 'asc' | 'desc';
}

export interface PaginateUsersOptions extends Omit<ListUsersOptions, 'limit'> {
  pageSize?: number;
  cursor?: string; // doc id to start after
  search?: string; // simple case-insensitive search (name/email)
}

export interface PaginatedUsersResult {
  users: UnifiedUser[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface SearchUsersOptions {
  query: string;
  role?: UserRole;
  limit?: number;
  fields?: Array<'name' | 'email' | 'phone'>; // fields to search
}

// ---------------------------------------------------------------------------
// Constants / Internal Helpers
// ---------------------------------------------------------------------------

const COLLECTION = 'users';
const DEFAULT_CACHE_TTL_MS = 60_000; // 1 min
const MAX_CACHE_ITEMS = 500;

interface CacheEntry<T> { value: T; expires: number; }

const cacheById = new Map<string, CacheEntry<UnifiedUser | null>>();
const cacheByEmail = new Map<string, CacheEntry<UnifiedUser | null>>();

function setCache(map: Map<string, CacheEntry<UnifiedUser | null>>, key: string, value: UnifiedUser | null, ttl = DEFAULT_CACHE_TTL_MS) {
  if (map.size >= MAX_CACHE_ITEMS) {
    // naive eviction: حذف أول عنصر (يمكن تحسينه لـ LRU لاحقاً)
    const first = map.keys().next().value;
    if (first) map.delete(first);
  }
  map.set(key, { value, expires: Date.now() + ttl });
}

function getCache(map: Map<string, CacheEntry<UnifiedUser | null>>, key: string): UnifiedUser | null | undefined {
  const entry = map.get(key);
  if (!entry) return undefined;
  if (entry.expires < Date.now()) { // expired
    map.delete(key);
    return undefined;
  }
  return entry.value;
}

function docToUser(doc: QueryDocumentSnapshot): UnifiedUser {
  return { id: doc.id, ...(doc.data() as Omit<UnifiedUser, 'id'>) } as UnifiedUser;
}

// ---------------------------------------------------------------------------
// Basic Fetchers
// ---------------------------------------------------------------------------

/** إحضار مستخدم بالمعرّف مع كاش قصير الأجل */
export async function getUserById(id: string, opts?: { refresh?: boolean; cacheTtlMs?: number }): Promise<UnifiedUser | null> {
  if (!opts?.refresh) {
    const cached = getCache(cacheById, id);
    if (cached !== undefined) return cached; // may be null
  }
  const snap = await adminDb.collection(COLLECTION).doc(id).get();
  if (!snap.exists) {
    setCache(cacheById, id, null, opts?.cacheTtlMs);
    return null;
  }
  const user = { id: snap.id, ...(snap.data() as Omit<UnifiedUser, 'id'>) } as UnifiedUser;
  setCache(cacheById, id, user, opts?.cacheTtlMs);
  return user;
}

/** إحضار مستخدم بالبريد مع كاش */
export async function findUserByEmail(email: string, opts?: { refresh?: boolean; cacheTtlMs?: number }): Promise<UnifiedUser | null> {
  const norm = email.toLowerCase();
  if (!opts?.refresh) {
    const cached = getCache(cacheByEmail, norm);
    if (cached !== undefined) return cached;
  }
  const snap = await adminDb.collection(COLLECTION).where('email', '==', norm).limit(1).get();
  if (snap.empty) {
    setCache(cacheByEmail, norm, null, opts?.cacheTtlMs);
    return null;
  }
  const user = docToUser(snap.docs[0]);
  setCache(cacheByEmail, norm, user, opts?.cacheTtlMs);
  return user;
}

/** قائمة بسيطة مع فلاتر أساسية */
export async function listUsers(opts: ListUsersOptions = {}): Promise<UnifiedUser[]> {
  let q: FirebaseFirestore.Query = adminDb.collection(COLLECTION);
  if (opts.role) q = q.where('role', '==', opts.role);
  if (opts.status) q = q.where('status', '==', opts.status);
  const orderField = opts.orderBy || 'createdAt';
  const direction = opts.direction || 'desc';
  q = q.orderBy(orderField, direction);
  if (opts.limit) q = q.limit(opts.limit);
  const snap = await q.get();
  return snap.docs.map(docToUser);
}

// ---------------------------------------------------------------------------
// Pagination / Search
// ---------------------------------------------------------------------------

/** بحث بسيط بالذاكرة بعد جلب الدُفعة (يصلح للواجهات الصغيرة). لو الحجم كبير استخدم فهرس إضافي. */
export async function searchUsers(options: SearchUsersOptions): Promise<UnifiedUser[]> {
  const { query, role, limit = 50, fields = ['name', 'email'] } = options;
  if (!query.trim()) return [];
  // NOTE: Firestore full-text غير متوفر هنا؛ نستعمل prefix strategy مبسطة عبر استعلام واحد + فلترة محلية
  let q: FirebaseFirestore.Query = adminDb.collection(COLLECTION);
  if (role) q = q.where('role', '==', role);
  q = q.orderBy('createdAt', 'desc').limit(300); // جلب ناعم ثم فلترة
  const snap = await q.get();
  const lower = query.toLowerCase();
  const results: UnifiedUser[] = [];
  for (const doc of snap.docs) {
    const u = docToUser(doc);
    const checks: string[] = [];
    if (fields.includes('name')) checks.push(u.name?.toLowerCase());
    if (fields.includes('email')) checks.push(u.email?.toLowerCase());
    if (fields.includes('phone') && u.phone) checks.push(u.phone.toLowerCase());
    if (checks.some(v => v && v.includes(lower))) {
      results.push(u);
      if (results.length >= limit) break;
    }
  }
  return results;
}

/** ترقيم (Cursor Pagination) آمن */
export async function paginateUsers(opts: PaginateUsersOptions = {}): Promise<PaginatedUsersResult> {
  const pageSize = opts.pageSize || 50;
  let q: FirebaseFirestore.Query = adminDb.collection(COLLECTION);
  if (opts.role) q = q.where('role', '==', opts.role);
  if (opts.status) q = q.where('status', '==', opts.status);
  const orderField = opts.orderBy || 'createdAt';
  const direction = opts.direction || 'desc';
  q = q.orderBy(orderField, direction).limit(pageSize + 1); // جلب عنصر إضافي للكشف عن hasMore

  if (opts.cursor) {
    const cursorDoc = await adminDb.collection(COLLECTION).doc(opts.cursor).get();
    if (cursorDoc.exists) {
      q = q.startAfter(cursorDoc.get(orderField));
    }
  }

  const snap = await q.get();
  let docs = snap.docs;
  // فلترة بحث نصي (محلي) إن وُجد
  if (opts.search) {
    const lower = opts.search.toLowerCase();
    docs = docs.filter(d => {
      const data = d.data() as Partial<UnifiedUser>;
      return (
        (data.name && data.name.toLowerCase().includes(lower)) ||
        (data.email && data.email.toLowerCase().includes(lower))
      );
    });
  }

  const hasMore = docs.length > pageSize;
  if (hasMore) docs = docs.slice(0, pageSize);
  const users = docs.map(docToUser);
  return {
    users,
    hasMore,
    nextCursor: hasMore ? docs[docs.length - 1].id : undefined
  };
}

// ---------------------------------------------------------------------------
// Creator Utilities
// ---------------------------------------------------------------------------

export async function listCreators(limit = 200): Promise<CreatorListItem[]> {
  const snap = await adminDb.collection(COLLECTION)
    .where('role', '==', 'creator')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
  return snap.docs.map(d => {
    const data = d.data() as UnifiedUser;
    return {
      id: d.id,
      name: data.name,
      email: data.email,
      role: data.role,
      specialty: data.creatorProfile?.specialty,
      skills: (data.creatorProfile?.skills || []).map(s => s.subcategoryId),
      tier: data.creatorProfile?.tier,
      modifier: data.creatorProfile?.modifier,
      city: data.creatorProfile?.city
    };
  });
}

/** تحديث توفر المبدع (Partial merge) */
export async function updateCreatorAvailability(userId: string, availability: Partial<Availability>): Promise<void> {
  await adminDb.collection(COLLECTION).doc(userId).update({
    'creatorProfile.availability': availability,
    updatedAt: new Date().toISOString()
  });
  // invalidate cache
  setCache(cacheById, userId, null, 0);
}

// ---------------------------------------------------------------------------
// Security / Login Attempts
// ---------------------------------------------------------------------------

export async function incrementLoginAttempts(userId: string, lockThreshold = 5, lockMinutes = 15): Promise<{ locked: boolean; attempts: number; }>{
  const result = { locked: false, attempts: 0 };
  await adminDb.runTransaction(async tx => {
    const ref = adminDb.collection(COLLECTION).doc(userId);
    const snap = await tx.get(ref);
    if (!snap.exists) return;
    const data = snap.data() as UnifiedUser;
    const attempts = (data.loginAttempts || 0) + 1;
    const updates: Record<string, unknown> = { loginAttempts: attempts, updatedAt: new Date().toISOString() };
    if (attempts >= lockThreshold && !data.lockedUntil) {
      updates.lockedUntil = new Date(Date.now() + lockMinutes * 60_000).toISOString();
      result.locked = true;
    }
    result.attempts = attempts;
    tx.update(ref, updates);
  });
  return result;
}

export async function resetLoginAttempts(userId: string): Promise<void> {
  await adminDb.collection(COLLECTION).doc(userId).update({ loginAttempts: 0, lockedUntil: null, updatedAt: new Date().toISOString() });
}

// ---------------------------------------------------------------------------
// Mutations / Upserts / Soft Delete
// ---------------------------------------------------------------------------

export async function updateUser(id: string, payload: Record<string, unknown>): Promise<void> {
  payload.updatedAt = new Date().toISOString();
  await adminDb.collection(COLLECTION).doc(id).update(payload);
  setCache(cacheById, id, null, 0);
}

/** إنشاء أو تحديث مستخدم بحسب البريد (Idempotent) */
export async function upsertUser(by: { email: string; defaults?: Record<string, unknown>; update?: Record<string, unknown>; }): Promise<UnifiedUser> {
  const existing = await findUserByEmail(by.email, { refresh: true });
  const now = new Date().toISOString();
  if (existing) {
    await updateUser(existing.id, { ...(by.update || {}), updatedAt: now });
    return (await getUserById(existing.id, { refresh: true }))!;
  }
  const ref = await adminDb.collection(COLLECTION).add({
    email: by.email.toLowerCase(),
    createdAt: now,
    updatedAt: now,
    status: 'pending',
    emailVerified: false,
    twoFactorEnabled: false,
    ...(by.defaults || {}),
    ...(by.update || {})
  });
  return (await getUserById(ref.id, { refresh: true }))!;
}

export async function softDeleteUser(id: string): Promise<void> {
  await updateUser(id, { status: 'deleted' });
}

// ---------------------------------------------------------------------------
// Aggregates / Stats (مبسطة - يمكن توسعتها لاحقاً)
// ---------------------------------------------------------------------------

export interface BasicUserStats { total: number; byRole: Record<UserRole, number>; verified: number; locked: number; }

export async function basicUserStats(): Promise<BasicUserStats> {
  const snap = await adminDb.collection(COLLECTION).get();
  const byRole: Record<UserRole, number> = { admin: 0, client: 0, creator: 0, employee: 0 };
  let verified = 0;
  let locked = 0;
  snap.docs.forEach(d => {
    const u = d.data() as UnifiedUser;
    byRole[u.role]++;
    if (u.emailVerified) verified++;
    if (u.lockedUntil && new Date(u.lockedUntil) > new Date()) locked++;
  });
  return { total: snap.size, byRole, verified, locked };
}

// ---------------------------------------------------------------------------
// Indexing Guidance (تعليمات داخلية)
// ---------------------------------------------------------------------------
/**
 * فهارس موصى بها (أضفها في firestore.indexes.json لو لم تكن موجودة):
 * 1. users: role ASC, createdAt DESC (لـ listCreators / pagination)
 * 2. users: email ASC (query equality already single-field)
 * 3. users: status ASC, createdAt DESC (لو استعلمنا حسب الحالة)
 * 4. users: role ASC, status ASC, createdAt DESC (لو احتجنا دمج) => Composite
 */

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

export function clearUserCaches() {
  cacheByEmail.clear();
  cacheById.clear();
}

// Debug helper (اختياري للاستخدام أثناء التطوير)
export function _cacheStats() {
  return {
    byIdSize: cacheById.size,
    byEmailSize: cacheByEmail.size
  };
}

