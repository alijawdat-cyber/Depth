'use client';

import { useState, useEffect, useCallback } from 'react';
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
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  createdAt: string;
  location?: string;
  phone?: string;
  company?: string;
  skills?: string[];
  specialization?: string;
  department?: string;
  lastActive?: string;
}

// Statistics interface
interface UserStats {
  total: number;
  pending: number;
  active: number;
  inactive: number;
  suspended: number;
  byRole: {
    creators: number;
    clients: number;
    employees: number;
    admins: number;
  };
}

export default function UnifiedUsersPage() {
  const [users, setUsers] = useState<UnifiedUser[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    pending: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    byRole: { creators: 0, clients: 0, employees: 0, admins: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters and search
  const [activeTab, setActiveTab] = useState<'all' | 'creator' | 'client' | 'employee' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'inactive' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UnifiedUser | null>(null);

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
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, statusFilter, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
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
      } else {
        setError(result.error || 'خطأ في حذف المستخدم');
      }
    } catch (err) {
      setError('خطأ في حذف المستخدم');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'inactive': return 'text-gray-600';
      case 'suspended': return 'text-red-600';
      default: return 'text-gray-600';
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
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'معلق';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المستخدمين</h1>
        <p className="text-gray-600">عرض وإدارة جميع المستخدمين في النظام</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserPlus className="h-8 w-8 text-purple-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">المبدعون</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byRole.creators}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">العملاء</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byRole.clients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">الموظفون</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byRole.employees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-yellow-600" />
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">في الانتظار</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
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
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full pr-12 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getStatusColor(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {user.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                            title="موافقة"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateUserStatus(user.id, 'inactive')}
                            className="text-red-600 hover:text-red-900"
                            title="رفض"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {user.status === 'active' && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'suspended')}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="تعليق"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      {user.status === 'suspended' && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'active')}
                          className="text-green-600 hover:text-green-900"
                          title="إلغاء التعليق"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد مستخدمين</h3>
            <p className="mt-1 text-sm text-gray-500">لم يتم العثور على مستخدمين بالمعايير المحددة.</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">تفاصيل المستخدم</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
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
                    <label className="block text-sm font-medium text-gray-700">الحالة</label>
                    <span className={`text-sm font-medium ${getStatusColor(selectedUser.status)}`}>
                      {getStatusLabel(selectedUser.status)}
                    </span>
                  </div>
                </div>

                {selectedUser.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.phone}</p>
                  </div>
                )}

                {selectedUser.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">الموقع</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.location}</p>
                  </div>
                )}

                {selectedUser.company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">الشركة</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.company}</p>
                  </div>
                )}

                {selectedUser.specialization && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">التخصص</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.specialization}</p>
                  </div>
                )}

                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">المهارات</label>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedUser.skills.map((skill, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">تاريخ التسجيل</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
