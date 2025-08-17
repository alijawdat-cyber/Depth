"use client";

// صفحة إدارة المستخدمين - Admin
// الوثيقة المرجعية: docs/roles/admin/06-Security-and-Access.md
// الغرض: إدارة جميع المستخدمين (العملاء، المبدعين، الموظفين) مع الصلاحيات والأدوار

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { Button } from "@/components/ui/Button";
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Shield,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Crown,
  User,
  Building,
  Camera
} from "lucide-react";

// واجهات البيانات
interface SystemUser {
  id: string;
  role: 'admin' | 'employee' | 'creator' | 'client';
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'banned';
  
  // معلومات أساسية
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  
  // معلومات الشركة (للعملاء)
  company?: string;
  industry?: string;
  
  // معلومات المبدع
  skills?: string[];
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  modifier?: number;
  portfolio?: string[];
  
  // معلومات الموظف
  department?: string;
  position?: string;
  permissions?: string[];
  
  // الإحصائيات
  stats?: {
    projectsCount: number;
    totalValue: number;
    averageRating: number;
    completionRate: number;
    lastActivity: string;
  };
  
  // التواريخ
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  
  // الأمان
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  
  // الموقع
  location?: {
    city: string;
    country: string;
  };
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  banned: number;
  
  // حسب الدور
  admins: number;
  employees: number;
  creators: number;
  clients: number;
  
  // إحصائيات أخرى
  verifiedUsers: number;
  twoFactorUsers: number;
  newUsersThisMonth: number;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // States
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // User Management
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    role: 'client' as SystemUser['role'],
    name: '',
    email: '',
    phone: '',
    company: '',
    department: '',
    position: ''
  });
  
  // Operations
  const [submitting, setSubmitting] = useState(false);

  // التحقق من صلاحيات الإدمن
  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  // تحميل البيانات
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setStats(data.stats || null);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      setError('فشل في تحميل المستخدمين');
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin, loadUsers]);

  // إنشاء مستخدم جديد
  const handleCreateUser = async () => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setUsers(prev => [result.user, ...prev]);
        setShowCreateForm(false);
        setFormData({
          role: 'client',
          name: '',
          email: '',
          phone: '',
          company: '',
          department: '',
          position: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في إنشاء المستخدم');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Create user error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // تغيير حالة المستخدم
  const handleUserStatusChange = async (userId: string, newStatus: SystemUser['status']) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setUsers(prev => prev.map(u => 
          u.id === userId 
            ? { ...u, status: newStatus }
            : u
        ));
        
        const statusText = getStatusText(newStatus);
        alert(`تم تغيير حالة المستخدم إلى: ${statusText}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في تغيير حالة المستخدم');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Change user status error:', err);
    }
  };

  // إعادة تعيين كلمة المرور
  const handlePasswordReset = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        alert(`تم إرسال رابط إعادة تعيين كلمة المرور إلى: ${result.email}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في إعادة تعيين كلمة المرور');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Password reset error:', err);
    }
  };

  // تصفية المستخدمين
  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesRole && matchesStatus && matchesSearch;
  });

  // دوال المساعدة
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'إدمن';
      case 'employee': return 'موظف';
      case 'creator': return 'مبدع';
      case 'client': return 'عميل';
      default: return role;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'في الانتظار';
      case 'suspended': return 'معلق';
      case 'banned': return 'محظور';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'pending': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'suspended': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'banned': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown size={16} className="text-purple-600" />;
      case 'employee': return <User size={16} className="text-blue-600" />;
      case 'creator': return <Camera size={16} className="text-green-600" />;
      case 'client': return <Building size={16} className="text-orange-600" />;
      default: return <User size={16} className="text-gray-600" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-600 bg-purple-50';
      case 'gold': return 'text-yellow-600 bg-yellow-50';
      case 'silver': return 'text-gray-600 bg-gray-50';
      case 'bronze': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ').format(amount) + ' د.ع';
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text)] mb-2">غير مسموح</h2>
          <p className="text-[var(--muted)]">هذه الصفحة مخصصة للإدمن فقط</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">جاري تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">إدارة المستخدمين</h1>
          <p className="text-[var(--muted)]">إدارة العملاء والمبدعين والموظفين مع الصلاحيات والأدوار</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            onClick={loadUsers}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            تحديث
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus size={16} />
            مستخدم جديد
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-800">{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
              className="mr-auto"
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.total}</p>
              </div>
              <Users size={24} className="text-[var(--accent-500)]" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">نشط</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.active}</p>
              </div>
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">المبدعين</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.creators}</p>
              </div>
              <Camera size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">العملاء</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.clients}</p>
              </div>
              <Building size={24} className="text-orange-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="البحث في المستخدمين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--muted)]" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            >
              <option value="all">جميع الأدوار</option>
              <option value="admin">إدمن</option>
              <option value="employee">موظف</option>
              <option value="creator">مبدع</option>
              <option value="client">عميل</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[var(--muted)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="pending">في الانتظار</option>
              <option value="suspended">معلق</option>
              <option value="banned">محظور</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users size={64} className="text-[var(--muted)] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[var(--text)] mb-2">لا توجد مستخدمين</h3>
          <p className="text-[var(--muted)] mb-4">ابدأ بإضافة مستخدم جديد</p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus size={16} />
            إضافة مستخدم جديد
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-500)] flex items-center justify-center text-white font-semibold">
                    {user.avatar ? (
                      <NextImage 
                        src={user.avatar} 
                        alt={user.name || 'صورة المستخدم'} 
                        width={48}
                        height={48}
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getRoleIcon(user.role)}
                      <h3 className="text-xl font-semibold text-[var(--text)]">{user.name}</h3>
                      
                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>

                      {/* Role Badge */}
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600">
                        {getRoleText(user.role)}
                      </span>

                      {/* Tier Badge for Creators */}
                      {user.role === 'creator' && user.tier && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTierColor(user.tier)}`}>
                          {user.tier.toUpperCase()}
                        </span>
                      )}

                      {/* Performance Indicator */}
                      {user.status === 'active' && user.role === 'creator' && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-50 text-green-600">
                          <TrendingUp size={12} />
                          <span>أداء متميز</span>
                        </div>
                      )}

                      {/* Verification Badges */}
                      {user.emailVerified && (
                        <div title="البريد موثق">
                          <CheckCircle size={16} className="text-green-500" />
                        </div>
                      )}
                      {user.twoFactorEnabled && (
                        <div title="المصادقة الثنائية مفعلة">
                          <Shield size={16} className="text-blue-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-2">
                      <div className="flex items-center gap-1">
                        <Mail size={16} />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1">
                          <Phone size={16} />
                          {user.phone}
                        </div>
                      )}
                      {user.company && (
                        <div className="flex items-center gap-1">
                          <Building size={16} />
                          {user.company}
                        </div>
                      )}
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          {user.location.city}, {user.location.country}
                        </div>
                      )}
                    </div>

                    {/* Skills for Creators */}
                    {user.role === 'creator' && user.skills && user.skills.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-[var(--muted)]">المهارات:</span>
                        <div className="flex gap-1">
                          {user.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                              +{user.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        انضم: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                      </div>
                      {user.lastLoginAt && (
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          آخر دخول: {new Date(user.lastLoginAt).toLocaleDateString('ar-EG')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    <Eye size={16} />
                    عرض
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                  >
                    <Edit size={16} />
                    تعديل
                  </Button>
                </div>
              </div>

              {/* Stats for Users */}
              {user.stats && (
                <div className="bg-[var(--bg)] rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-[var(--muted)]">المشاريع</p>
                      <p className="text-lg font-semibold text-[var(--text)]">
                        {user.stats.projectsCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--muted)]">القيمة الإجمالية</p>
                      <p className="text-lg font-semibold text-[var(--text)]">
                        {formatCurrency(user.stats.totalValue)}
                      </p>
                    </div>
                    {user.stats.averageRating > 0 && (
                      <div>
                        <p className="text-sm text-[var(--muted)]">التقييم</p>
                        <div className="flex items-center justify-center gap-1">
                          <Star size={16} className="text-yellow-500" />
                          <p className="text-lg font-semibold text-[var(--text)]">
                            {user.stats.averageRating.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-[var(--muted)]">معدل الإكمال</p>
                      <p className="text-lg font-semibold text-[var(--text)]">
                        {user.stats.completionRate}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {user.status === 'active' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUserStatusChange(user.id, 'suspended')}
                    className="flex items-center gap-1 text-orange-600"
                  >
                    <UserX size={16} />
                    تعليق
                  </Button>
                )}

                {user.status === 'suspended' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUserStatusChange(user.id, 'active')}
                    className="flex items-center gap-1 text-green-600"
                  >
                    <UserCheck size={16} />
                    تفعيل
                  </Button>
                )}

                {user.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUserStatusChange(user.id, 'active')}
                    className="flex items-center gap-1 text-green-600"
                  >
                    <CheckCircle size={16} />
                    اعتماد
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePasswordReset(user.id)}
                  className="flex items-center gap-1"
                >
                  <Shield size={16} />
                  إعادة تعيين كلمة المرور
                </Button>

                {user.status !== 'banned' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUserStatusChange(user.id, 'banned')}
                    className="flex items-center gap-1 text-red-600"
                  >
                    <AlertTriangle size={16} />
                    حظر
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">إضافة مستخدم جديد</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الدور
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as SystemUser['role'] }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                >
                  <option value="client">عميل</option>
                  <option value="creator">مبدع</option>
                  <option value="employee">موظف</option>
                  <option value="admin">إدمن</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="أحمد محمد"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  رقم الهاتف (اختياري)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="+964 XXX XXX XXXX"
                />
              </div>

              {formData.role === 'client' && (
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1">
                    اسم الشركة (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                    placeholder="شركة ABC"
                  />
                </div>
              )}

              {formData.role === 'employee' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1">
                      القسم
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                      placeholder="التسويق"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1">
                      المنصب
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                      placeholder="مدير التسويق"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={handleCreateUser}
                disabled={submitting || !formData.name || !formData.email}
                className="flex-1"
              >
                {submitting ? 'جاري الإضافة...' : 'إضافة المستخدم'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
                disabled={submitting}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
