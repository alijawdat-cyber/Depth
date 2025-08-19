'use client';

import { useState, useEffect, useCallback } from 'react';
import { showSuccess, showError } from '@/lib/toast';
import { 
  Users, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Trash2,
  UserPlus
} from 'lucide-react';

// Unified user interface
interface UnifiedUser {
  id: string;
  name: string;
  email: string;
  role: 'creator' | 'client' | 'employee' | 'admin';
  status: 'pending' | 'active' | 'inactive' | 'suspended' | 'onboarding_started' | 'intake_submitted' | 'under_review';
  createdAt: string;
  location?: string;
  phone?: string;
  company?: string;
  skills?: string[];
  specialization?: string;
  department?: string;
  lastActive?: string;
  adminDecision?: {
    reason?: string;
    decidedAt: string;
    decidedBy: string;
  };
}

// Statistics interface - النظام الموحد
interface UserStats {
  total: number;
  pending: number;
  active: number;
  inactive: number;
  suspended: number;
  byRole: {
    admin: number;
    creator: number;
    client: number;
    employee: number;
  };
  verified?: number;
}

export default function UnifiedUsersPage() {
  const [users, setUsers] = useState<UnifiedUser[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    pending: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    byRole: { admin: 0, creator: 0, client: 0, employee: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters and search
  const [activeTab, setActiveTab] = useState<'all' | 'creator' | 'client' | 'employee' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'inactive' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UnifiedUser | null>(null);
  const [decisionModal, setDecisionModal] = useState<{user: UnifiedUser; action: 'approve' | 'reject'} | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [openCardActions, setOpenCardActions] = useState<string | null>(null);

  // Load users data
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.append('role', activeTab);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setStats(data.stats);
      } else {
        setError(data.error || 'خطأ في تحميل البيانات');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      showError('خطأ في الاتصال بالخادم');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, statusFilter, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserStatus = async (userId: string, newStatus: string, reason?: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason })
      });

      const result = await response.json();
      if (result.success) {
        fetchUsers(); // Refresh data
      } else {
        setError(result.error || 'خطأ في تحديث الحالة');
      }
    } catch (err) {
      setError('خطأ في تحديث الحالة');
      console.error('Error updating status:', err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        fetchUsers(); // Refresh data
        showSuccess('تم حذف المستخدم بنجاح');
      } else {
        const errorMsg = result.error || 'خطأ في حذف المستخدم';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (err) {
      setError('خطأ في حذف المستخدم');
      showError('خطأ في حذف المستخدم');
      console.error('Error deleting user:', err);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'creator': return 'bg-purple-100 text-purple-800';
      case 'client': return 'bg-blue-100 text-blue-800';
      case 'employee': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string) => {
    const base = 'inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border';
    switch (status) {
      case 'active': return `${base} bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800`;
      case 'pending': return `${base} bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800`;
      case 'onboarding_started': return `${base} bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800`;
      case 'intake_submitted': return `${base} bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800`;
      case 'under_review': return `${base} bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800`;
      case 'suspended': return `${base} bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800`;
      case 'inactive':
      default:
        return `${base} bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700`;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'creator': return 'مبدع';
      case 'client': return 'عميل';
      case 'employee': return 'موظف';
      case 'admin': return 'إدمن';
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'pending': return 'في الانتظار';
      case 'onboarding_started': return 'بدأ الانضمام';
      case 'intake_submitted': return 'نموذج مكتمل';
      case 'under_review': return 'قيد المراجعة';
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'معلق';
      default: return status;
    }
  };

  const buildUserActions = (user: UnifiedUser) => {
    const actions: { key: string; label: string; color: string; onClick: () => void; icon: React.ReactNode }[] = [];
    actions.push({ key: 'view', label: 'عرض', color: 'text-blue-600', onClick: () => setSelectedUser(user), icon: <Eye className="h-4 w-4" /> });
    if (user.status === 'pending' || user.status === 'intake_submitted') {
      actions.push({ key: 'approve', label: 'اعتماد', color: 'text-green-600', onClick: () => setDecisionModal({ user, action: 'approve' }), icon: <CheckCircle className="h-4 w-4" /> });
      actions.push({ key: 'reject', label: 'رفض', color: 'text-rose-600', onClick: () => setDecisionModal({ user, action: 'reject' }), icon: <XCircle className="h-4 w-4" /> });
    }
    if (user.status === 'under_review') {
      actions.push({ key: 'finalApprove', label: 'اعتماد نهائي', color: 'text-green-600', onClick: () => setDecisionModal({ user, action: 'approve' }), icon: <CheckCircle className="h-4 w-4" /> });
    }
    if (user.status === 'onboarding_started') {
      actions.push({ key: 'moveReview', label: 'للمراجعة', color: 'text-indigo-600', onClick: () => updateUserStatus(user.id, 'under_review'), icon: <Eye className="h-4 w-4" /> });
    }
    if (user.status === 'active') {
      actions.push({ key: 'suspend', label: 'تعليق', color: 'text-yellow-600', onClick: () => updateUserStatus(user.id, 'suspended'), icon: <XCircle className="h-4 w-4" /> });
    }
    if (user.status === 'suspended') {
      actions.push({ key: 'unsuspend', label: 'رفع التعليق', color: 'text-green-600', onClick: () => updateUserStatus(user.id, 'active'), icon: <CheckCircle className="h-4 w-4" /> });
    }
    actions.push({ key: 'delete', label: 'حذف', color: 'text-red-600', onClick: () => deleteUser(user.id), icon: <Trash2 className="h-4 w-4" /> });
    return actions;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
  <div className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-gray-100">
      <div className="mb-8">
  <h1 className="text-3xl font-bold mb-2">إدارة المستخدمين</h1>
  <p className="text-gray-600 dark:text-gray-400">عرض وإدارة جميع المستخدمين في النظام</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        
  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center">
            <UserPlus className="h-8 w-8 text-purple-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">المبدعون</p>
              <p className="text-2xl font-bold">{stats.byRole.creator}</p>
            </div>
          </div>
        </div>

  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">العملاء</p>
              <p className="text-2xl font-bold">{stats.byRole.client}</p>
            </div>
          </div>
        </div>

  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الموظفون</p>
              <p className="text-2xl font-bold">{stats.byRole.employee}</p>
            </div>
          </div>
        </div>

  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-yellow-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">قيد / انتظار</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-700 mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Role Tabs */}
            <div className="flex space-x-2 rtl:space-x-reverse">
              {[
                { key: 'all', label: 'الكل' },
                { key: 'creator', label: 'المبدعون' },
                { key: 'client', label: 'العملاء' },
                { key: 'employee', label: 'الموظفون' },
                { key: 'admin', label: 'الإدمن' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'all' | 'creator' | 'client' | 'employee' | 'admin')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'active' | 'inactive' | 'suspended')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في الانتظار</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="suspended">معلق</option>
            </select>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="البحث بالاسم أو البريد الإلكتروني..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table (Desktop) */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المستخدم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الدور
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(user.status)}>{getStatusLabel(user.status)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {(user.status === 'pending' || user.status === 'intake_submitted') && (
                        <>
                          <button
                            onClick={() => setDecisionModal({user, action: 'approve'})}
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                            title="موافقة"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDecisionModal({user, action: 'reject'})}
                            className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300"
                            title="رفض"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {user.status === 'under_review' && (
                        <button
                          onClick={() => setDecisionModal({user, action: 'approve'})}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          title="اعتماد نهائي"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      {user.status === 'onboarding_started' && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'under_review')}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                          title="وضع تحت المراجعة"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      
                      {user.status === 'active' && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'suspended')}
                          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
                          title="تعليق"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      {user.status === 'suspended' && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'active')}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          title="إلغاء التعليق"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium">لا توجد مستخدمين</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">لم يتم العثور على مستخدمين بالمعايير المحددة.</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {users.map(user => {
          const actions = buildUserActions(user);
          const open = openCardActions === user.id;
          return (
            <div key={user.id} className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium leading-tight">{user.name}</div>
                    <div className="text-xs text-gray-500 break-all">{user.email}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${getRoleColor(user.role)}`}>{getRoleLabel(user.role)}</span>
                      <span className={`${getStatusBadge(user.status)} text-[10px]`}>{getStatusLabel(user.status)}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{new Date(user.createdAt).toLocaleDateString('ar-SA')}</div>
                  </div>
                </div>
                <button
                  onClick={() => setOpenCardActions(open ? null : user.id)}
                  className="px-2 py-1 text-xs rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-expanded={open}
                  aria-controls={`actions-${user.id}`}
                >
                  {open ? 'إغلاق' : 'إجراءات'}
                </button>
              </div>
              {open && (
                <div id={`actions-${user.id}`} className="mt-3 border-t pt-3 grid gap-2 sm:grid-cols-2">
                  {actions.map(a => (
                    <button
                      key={a.key}
                      onClick={a.onClick}
                      className={`flex items-center justify-center gap-1 rounded-md border text-[12px] py-2 px-2 font-medium transition-colors ${a.color.replace('text-', 'hover:bg-').split(' ')[0]} border-gray-300 dark:border-gray-600`}
                    >
                      {a.icon}
                      <span>{a.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {users.length === 0 && (
          <div className="text-center py-12 border rounded-lg">
            <Users className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">لا توجد نتائج</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">تفاصيل المستخدم</h3>
                <div className="flex items-center gap-2">
                  {selectedUser.status === 'under_review' && (
                    <button
                      onClick={() => setDecisionModal({user: selectedUser, action: 'approve'})}
                      className="px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700"
                    >اعتماد</button>
                  )}
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">الاسم</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">الدور</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                      {getRoleLabel(selectedUser.role)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">الحالة</label>
                    <span className={getStatusBadge(selectedUser.status)}>
                      {getStatusLabel(selectedUser.status)}
                    </span>
                  </div>
                </div>

        {selectedUser.phone && (
                  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">رقم الهاتف</label>
          <p className="mt-1 text-sm">{selectedUser.phone}</p>
                  </div>
                )}

        {selectedUser.location && (
                  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">الموقع</label>
          <p className="mt-1 text-sm">{selectedUser.location}</p>
                  </div>
                )}

        {selectedUser.company && (
                  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">الشركة</label>
          <p className="mt-1 text-sm">{selectedUser.company}</p>
                  </div>
                )}

        {selectedUser.specialization && (
                  <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">التخصص</label>
          <p className="mt-1 text-sm">{selectedUser.specialization}</p>
                  </div>
                )}

                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">المهارات</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedUser.skills.map((skill, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">تاريخ التسجيل</label>
                    <p className="mt-1 text-sm">{new Date(selectedUser.createdAt).toLocaleDateString('ar-SA')}</p>
                  </div>
                  {selectedUser.adminDecision?.reason && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">سبب القرار السابق</label>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">{selectedUser.adminDecision.reason}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {decisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-2">
              {decisionModal.action === 'approve' ? 'اعتماد المستخدم' : 'رفض المستخدم'}
            </h2>
            {decisionModal.action === 'reject' && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">سبب الرفض (اختياري)</label>
                <textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="اكتب ملاحظات مختصرة..."
                />
              </div>
            )}
            {decisionModal.action === 'approve' && (
              <p className="text-sm text-gray-600 dark:text-gray-400">سيتم تفعيل المستخدم ومنحه حالة نشط.</p>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { setDecisionModal(null); setDecisionReason(''); }}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              >إلغاء</button>
              <button
                onClick={async () => {
                  if (!decisionModal) return;
                  const targetStatus = decisionModal.action === 'approve' ? 'active' : 'suspended';
                  await updateUserStatus(decisionModal.user.id, targetStatus, decisionReason.trim() || undefined);
                  setDecisionModal(null);
                  setDecisionReason('');
                }}
                className={`px-4 py-2 text-sm rounded-md text-white ${decisionModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-rose-600 hover:bg-rose-700'}`}
              >{decisionModal.action === 'approve' ? 'اعتماد' : 'رفض'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
