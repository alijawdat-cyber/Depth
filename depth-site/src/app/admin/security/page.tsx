"use client";

// صفحة الأمان والصلاحيات - Admin
// الوثيقة المرجعية: docs/roles/admin/06-Security-and-Access.md
// الغرض: إدارة الأمان، الصلاحيات، 2FA، التدقيق، والامتثال

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from 'sonner';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  Shield, 
  Key, 
  Eye,
  EyeOff,
  Users,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Settings,
  Activity,
  FileText,
  Mail,
  Phone,
  Smartphone,
  Globe,
  Database,
  Server,
  Wifi,
  WifiOff,
  Ban,
  Search,
  Filter,
  Plus,
  Edit,
  Save,
  X,
  Copy,
  Download
} from "lucide-react";

// واجهات البيانات
interface SecurityScope {
  id: string;
  name: string;
  description: string;
  category: 'pricing' | 'catalog' | 'approvals' | 'contracts' | 'projects' | 'reports' | 'system';
  level: 'read' | 'write' | 'manage' | 'admin';
  isActive: boolean;
}

interface UserPermission {
  userId: string;
  userName: string;
  userEmail: string;
  role: 'admin' | 'employee' | 'creator' | 'client';
  scopes: string[];
  twoFactorEnabled: boolean;
  lastLogin: string;
  status: 'active' | 'suspended' | 'locked';
  failedAttempts: number;
  lastFailedAttempt?: string;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'permission_change' | '2fa_enabled' | '2fa_disabled' | 'password_reset' | 'account_locked';
  userId: string;
  userName: string;
  userEmail: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    maxAge: number; // days
  };
  sessionPolicy: {
    maxDuration: number; // hours
    idleTimeout: number; // minutes
    requireReauth: boolean;
  };
  loginPolicy: {
    maxFailedAttempts: number;
    lockoutDuration: number; // minutes
    require2FA: string[]; // roles that require 2FA
  };
  auditPolicy: {
    retentionDays: number;
    logLevel: 'basic' | 'detailed' | 'verbose';
    enableRealtime: boolean;
  };
}

interface SecurityStats {
  totalUsers: number;
  activeUsers: number;
  users2FA: number;
  lockedAccounts: number;
  failedLoginsToday: number;
  securityEventsToday: number;
  criticalEvents: number;
  complianceScore: number;
}

export default function AdminSecurityPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // States
  const [activeTab, setActiveTab] = useState<'permissions' | 'events' | 'settings' | 'compliance'>('permissions');
  const [scopes, setScopes] = useState<SecurityScope[]>([]);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Modals
  const [showScopeForm, setShowScopeForm] = useState(false);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [editingScope, setEditingScope] = useState<SecurityScope | null>(null);
  
  // Form Data
  const [scopeForm, setScopeForm] = useState({
    name: '',
    description: '',
    category: 'system' as SecurityScope['category'],
    level: 'read' as SecurityScope['level']
  });

  // Operations
  const [submitting, setSubmitting] = useState(false);

  // التحقق من صلاحيات الإدمن
  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  // تحميل البيانات
  const loadSecurityData = useCallback(async () => {
    try {
      setLoading(true);
      
      // تحميل البيانات بشكل متوازي
      const [scopesRes, permissionsRes, eventsRes, settingsRes, statsRes] = await Promise.all([
        fetch('/api/admin/security/scopes'),
        fetch('/api/admin/security/permissions'),
        fetch('/api/admin/security/events'),
        fetch('/api/admin/security/settings'),
        fetch('/api/admin/security/stats')
      ]);

      if (scopesRes.ok) {
        const scopesData = await scopesRes.json();
        setScopes(scopesData.scopes || []);
      }

      if (permissionsRes.ok) {
        const permissionsData = await permissionsRes.json();
        setPermissions(permissionsData.permissions || []);
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events || []);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData.settings || null);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || null);
      }

    } catch (err) {
      setError('فشل في تحميل بيانات الأمان');
      console.error('Load security data error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadSecurityData();
    }
  }, [isAdmin, loadSecurityData]);

  // إنشاء/تحديث صلاحية
  const handleSaveScope = async () => {
    try {
      setSubmitting(true);
      
      const url = editingScope 
        ? `/api/admin/security/scopes/${editingScope.id}`
        : '/api/admin/security/scopes';
      
      const method = editingScope ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scopeForm)
      });

      if (response.ok) {
        const result = await response.json();
        
        if (editingScope) {
          setScopes(prev => prev.map(s => s.id === editingScope.id ? result.scope : s));
        } else {
          setScopes(prev => [result.scope, ...prev]);
        }
        
        setShowScopeForm(false);
        setEditingScope(null);
        setScopeForm({
          name: '',
          description: '',
          category: 'system',
          level: 'read'
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في حفظ الصلاحية');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Save scope error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // تبديل حالة الصلاحية
  const handleToggleScope = async (scopeId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/security/scopes/${scopeId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        setScopes(prev => prev.map(s => 
          s.id === scopeId ? { ...s, isActive: !isActive } : s
        ));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في تغيير حالة الصلاحية');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Toggle scope error:', err);
    }
  };

  // إعادة تعيين محاولات تسجيل الدخول الفاشلة
  const handleResetFailedAttempts = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/security/users/${userId}/reset-attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setPermissions(prev => prev.map(p => 
          p.userId === userId 
            ? { ...p, failedAttempts: 0, status: 'active', lastFailedAttempt: undefined }
            : p
        ));
        toast.success('تم إعادة تعيين محاولات تسجيل الدخول الفاشلة');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في إعادة التعيين');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Reset failed attempts error:', err);
    }
  };

  // إجبار تسجيل الخروج
  const handleForceLogout = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/security/users/${userId}/force-logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast.success('تم إجبار المستخدم على تسجيل الخروج');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في إجبار تسجيل الخروج');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Force logout error:', err);
    }
  };

  // حظر المستخدم
  const handleBanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/security/users/${userId}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast.success('تم حظر المستخدم');
        loadSecurityData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في حظر المستخدم');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Ban user error:', err);
    }
  };

  // نسخ معرف المستخدم
  const handleCopyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    toast.info('تم نسخ معرف المستخدم');
  };

  // تحميل تقرير الأمان
  const handleDownloadSecurityReport = async () => {
    try {
      const response = await fetch('/api/admin/security/report');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError('فشل في تحميل التقرير');
      console.error('Download report error:', err);
    }
  };

  // حفظ إعدادات الأمان
  const handleSaveSecuritySettings = () => {
    setShowSettingsForm(true);
  };

  // الذهاب لصفحة تفاصيل المستخدم
  const handleViewUserDetails = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  // تصفية الأحداث الأمنية
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    return matchesSearch && matchesSeverity && matchesType;
  });

  // دوال المساعدة
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pricing': return 'text-green-600 bg-green-50';
      case 'catalog': return 'text-blue-600 bg-blue-50';
      case 'approvals': return 'text-orange-600 bg-orange-50';
      case 'contracts': return 'text-purple-600 bg-purple-50';
      case 'projects': return 'text-indigo-600 bg-indigo-50';
      case 'reports': return 'text-pink-600 bg-pink-50';
      case 'system': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'login': return 'تسجيل دخول';
      case 'logout': return 'تسجيل خروج';
      case 'failed_login': return 'فشل تسجيل الدخول';
      case 'permission_change': return 'تغيير صلاحيات';
      case '2fa_enabled': return 'تفعيل 2FA';
      case '2fa_disabled': return 'إلغاء 2FA';
      case 'password_reset': return 'إعادة تعيين كلمة المرور';
      case 'account_locked': return 'قفل الحساب';
      default: return type;
    }
  };

  const getComplianceScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
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
          <p className="text-[var(--muted)]">جاري تحميل بيانات الأمان...</p>
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
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">الأمان والصلاحيات</h1>
          <p className="text-[var(--muted)]">إدارة الأمان، الصلاحيات، 2FA، التدقيق، والامتثال</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            onClick={loadSecurityData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            تحديث
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleDownloadSecurityReport}
          >
            <Download size={16} />
            تحميل تقرير
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleSaveSecuritySettings}
          >
            <Save size={16} />
            حفظ الإعدادات
          </Button>
          <Button onClick={() => setShowScopeForm(true)}>
            <Plus size={16} />
            صلاحية جديدة
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
                <p className="text-sm text-[var(--muted)]">المستخدمين النشطين</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.activeUsers}</p>
                <p className="text-xs text-[var(--muted)]">من أصل {stats.totalUsers}</p>
              </div>
              <Users size={24} className="text-[var(--accent-500)]" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">2FA مفعل</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.users2FA}</p>
                <p className="text-xs text-[var(--muted)]">
                  {Math.round((stats.users2FA / stats.totalUsers) * 100)}% من المستخدمين
                </p>
              </div>
              <Shield size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">حسابات مقفلة</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.lockedAccounts}</p>
                <p className="text-xs text-[var(--muted)]">
                  {stats.failedLoginsToday} محاولة فاشلة اليوم
                </p>
              </div>
              <Lock size={24} className="text-red-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">نقاط الامتثال</p>
                <p className={`text-2xl font-bold ${getComplianceScoreColor(stats.complianceScore)}`}>
                  {stats.complianceScore}%
                </p>
                <p className="text-xs text-[var(--muted)]">
                  {stats.criticalEvents} حدث حرج
                </p>
              </div>
              <CheckCircle size={24} className={getComplianceScoreColor(stats.complianceScore).includes('green') ? 'text-green-500' : 'text-orange-500'} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-[var(--card)] rounded-lg border border-[var(--border)]">
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'permissions'
                ? 'text-[var(--accent-500)] border-b-2 border-[var(--accent-500)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key size={16} />
              الصلاحيات
            </div>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'events'
                ? 'text-[var(--accent-500)] border-b-2 border-[var(--accent-500)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity size={16} />
              الأحداث الأمنية
            </div>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'settings'
                ? 'text-[var(--accent-500)] border-b-2 border-[var(--accent-500)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings size={16} />
              إعدادات الأمان
            </div>
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'compliance'
                ? 'text-[var(--accent-500)] border-b-2 border-[var(--accent-500)]'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              الامتثال
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              {/* Scopes Section */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">نطاقات الصلاحيات</h3>
                <div className="space-y-3">
                  {scopes.map((scope) => (
                    <div key={scope.id} className="flex items-center justify-between p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${scope.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[var(--text)]">{scope.name}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(scope.category)}`}>
                              {scope.category}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600">
                              {scope.level}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--muted)]">{scope.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleScope(scope.id, scope.isActive)}
                        >
                          {scope.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                          {scope.isActive ? 'إلغاء' : 'تفعيل'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingScope(scope);
                            setScopeForm({
                              name: scope.name,
                              description: scope.description,
                              category: scope.category,
                              level: scope.level
                            });
                            setShowScopeForm(true);
                          }}
                        >
                          <Edit size={16} />
                          تعديل
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Permissions Section */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">صلاحيات المستخدمين</h3>
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.userId} className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--accent-500)] flex items-center justify-center text-white text-sm font-semibold">
                            {permission.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[var(--text)]">{permission.userName}</span>
                              <span className="text-sm text-[var(--muted)]">({permission.role})</span>
                              {permission.twoFactorEnabled && (
                                <div title="2FA مفعل">
                                  <Shield size={14} className="text-green-500" />
                                </div>
                              )}
                              {permission.status === 'locked' && (
                                <div title="حساب مقفل">
                                  <Lock size={14} className="text-red-500" />
                                </div>
                              )}
                              {permission.status === 'active' && (
                                <div title="مستخدم نشط">
                                  <UserCheck size={14} className="text-green-500" />
                                </div>
                              )}
                              {permission.status === 'suspended' && (
                                <div title="مستخدم موقوف">
                                  <UserX size={14} className="text-red-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                              <Mail size={12} />
                              <span>{permission.userEmail}</span>
                              {permission.lastLogin && (
                                <>
                                  <Clock size={12} className="ml-2" />
                                  <span>آخر دخول: {new Date(permission.lastLogin).toLocaleDateString('ar-EG')}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {permission.status === 'locked' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResetFailedAttempts(permission.userId)}
                              className="text-green-600"
                            >
                              <Unlock size={16} />
                              إلغاء القفل
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleForceLogout(permission.userId)}
                            className="text-orange-600"
                          >
                            <WifiOff size={16} />
                            إجبار الخروج
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUserDetails(permission.userId)}
                            className="text-blue-600"
                          >
                            <Server size={16} />
                            تفاصيل
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyUserId(permission.userId)}
                            className="text-gray-600"
                          >
                            <Copy size={16} />
                            نسخ ID
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBanUser(permission.userId)}
                            className="text-red-600"
                          >
                            <Ban size={16} />
                            حظر
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {permission.scopes.map((scope, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                            {scope}
                          </span>
                        ))}
                      </div>
                      
                      {permission.failedAttempts > 0 && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                          {permission.failedAttempts} محاولة دخول فاشلة
                          {permission.lastFailedAttempt && (
                            <span className="mr-2">
                              آخر محاولة: {new Date(permission.lastFailedAttempt).toLocaleString('ar-EG')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      type="text"
                      placeholder="البحث في الأحداث الأمنية..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-[var(--muted)]" />
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                  >
                    <option value="all">جميع المستويات</option>
                    <option value="low">منخفض</option>
                    <option value="medium">متوسط</option>
                    <option value="high">عالي</option>
                    <option value="critical">حرج</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                  >
                    <option value="all">جميع الأنواع</option>
                    <option value="login">تسجيل دخول</option>
                    <option value="logout">تسجيل خروج</option>
                    <option value="failed_login">فشل تسجيل الدخول</option>
                    <option value="permission_change">تغيير صلاحيات</option>
                    <option value="2fa_enabled">تفعيل 2FA</option>
                    <option value="2fa_disabled">إلغاء 2FA</option>
                    <option value="password_reset">إعادة تعيين كلمة المرور</option>
                    <option value="account_locked">قفل الحساب</option>
                  </select>
                </div>
              </div>

              {/* Events List */}
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent-500)] flex items-center justify-center text-white text-sm font-semibold">
                          {event.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-[var(--text)]">{event.userName}</span>
                            <span className="text-sm text-[var(--muted)]">({event.userEmail})</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                              {event.severity}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-600">
                              {getEventTypeText(event.type)}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--text)] mb-2">{event.details}</p>
                                                  <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{new Date(event.timestamp).toLocaleString('ar-EG')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe size={12} />
                            <span>IP: {event.ipAddress}</span>
                          </div>
                          <div className="flex items-center gap-1" title={event.userAgent}>
                            {event.userAgent.includes('Mobile') ? (
                              <>
                                <Smartphone size={12} />
                                <span>جوال</span>
                              </>
                            ) : (
                              <>
                                <Server size={12} />
                                <span>كمبيوتر</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Wifi size={12} />
                            <span>متصل</span>
                          </div>
                          {event.type === 'failed_login' && (
                            <div className="flex items-center gap-1">
                              <Phone size={12} />
                              <span>تحقق مطلوب</span>
                            </div>
                          )}
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password Policy */}
                <div className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                  <h4 className="font-semibold text-[var(--text)] mb-3">سياسة كلمة المرور</h4>
                  <div className="space-y-2 text-sm">
                    <div>الحد الأدنى للطول: {settings.passwordPolicy.minLength} حرف</div>
                    <div>أحرف كبيرة: {settings.passwordPolicy.requireUppercase ? 'مطلوبة' : 'غير مطلوبة'}</div>
                    <div>أحرف صغيرة: {settings.passwordPolicy.requireLowercase ? 'مطلوبة' : 'غير مطلوبة'}</div>
                    <div>أرقام: {settings.passwordPolicy.requireNumbers ? 'مطلوبة' : 'غير مطلوبة'}</div>
                    <div>رموز خاصة: {settings.passwordPolicy.requireSymbols ? 'مطلوبة' : 'غير مطلوبة'}</div>
                    <div>صالحة لمدة: {settings.passwordPolicy.maxAge} يوم</div>
                  </div>
                </div>

                {/* Session Policy */}
                <div className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                  <h4 className="font-semibold text-[var(--text)] mb-3">سياسة الجلسة</h4>
                  <div className="space-y-2 text-sm">
                    <div>مدة الجلسة القصوى: {settings.sessionPolicy.maxDuration} ساعة</div>
                    <div>انتهاء الخمول: {settings.sessionPolicy.idleTimeout} دقيقة</div>
                    <div>إعادة المصادقة: {settings.sessionPolicy.requireReauth ? 'مطلوبة' : 'غير مطلوبة'}</div>
                  </div>
                </div>

                {/* Login Policy */}
                <div className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                  <h4 className="font-semibold text-[var(--text)] mb-3">سياسة تسجيل الدخول</h4>
                  <div className="space-y-2 text-sm">
                    <div>المحاولات الفاشلة المسموحة: {settings.loginPolicy.maxFailedAttempts}</div>
                    <div>مدة القفل: {settings.loginPolicy.lockoutDuration} دقيقة</div>
                    <div>2FA إلزامي لـ: {settings.loginPolicy.require2FA.join(', ')}</div>
                  </div>
                </div>

                {/* Audit Policy */}
                <div className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                  <h4 className="font-semibold text-[var(--text)] mb-3">سياسة التدقيق</h4>
                  <div className="space-y-2 text-sm">
                    <div>فترة الاحتفاظ: {settings.auditPolicy.retentionDays} يوم</div>
                    <div>مستوى التسجيل: {settings.auditPolicy.logLevel}</div>
                    <div>التسجيل الفوري: {settings.auditPolicy.enableRealtime ? 'مفعل' : 'معطل'}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setShowSettingsForm(true)}>
                  <Edit size={16} />
                  تعديل الإعدادات
                </Button>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={20} className="text-green-500" />
                    <span className="font-medium text-[var(--text)]">حماية البيانات</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">تشفير البيانات الحساسة وحماية معلومات المبدعين</p>
                  <div className="mt-2">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">متوافق</span>
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={20} className="text-blue-500" />
                    <span className="font-medium text-[var(--text)]">فصل الواجهات</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">منع كشف المبدعين للعميل (فصل واجهات)</p>
                  <div className="mt-2">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">متوافق</span>
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={20} className="text-orange-500" />
                    <span className="font-medium text-[var(--text)]">امتثال العيادات</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">Before/After يحتاج موافقة امتثال + قوالب إخلاء</p>
                  <div className="mt-2">
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">قيد المراجعة</span>
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={20} className="text-purple-500" />
                    <span className="font-medium text-[var(--text)]">تدقيق العمليات</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">تسجيل جميع العمليات الحساسة مع التفاصيل</p>
                  <div className="mt-2">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">متوافق</span>
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Database size={20} className="text-indigo-500" />
                    <span className="font-medium text-[var(--text)]">Version Snapshots</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">تثبيت FX داخل Snapshot وحفظ إصدارات الكتالوغ</p>
                  <div className="mt-2">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">متوافق</span>
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={20} className="text-red-500" />
                    <span className="font-medium text-[var(--text)]">Guardrails</span>
                  </div>
                  <p className="text-sm text-[var(--muted)]">حماية الحد الأدنى للهامش ومنع الإرسال عند الخرق</p>
                  <div className="mt-2">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">متوافق</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={24} className="text-green-600" />
                  <h3 className="text-lg font-semibold text-[var(--text)]">تقرير الامتثال الإجمالي</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-[var(--muted)]">نقاط الأمان</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-[var(--muted)]">حماية البيانات</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">98%</div>
                    <div className="text-sm text-[var(--muted)]">تدقيق العمليات</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">85%</div>
                    <div className="text-sm text-[var(--muted)]">امتثال العيادات</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Scope Modal */}
      {showScopeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">
              {editingScope ? 'تعديل الصلاحية' : 'صلاحية جديدة'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  اسم الصلاحية
                </label>
                <input
                  type="text"
                  value={scopeForm.name}
                  onChange={(e) => setScopeForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="pricing.write"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الوصف
                </label>
                <textarea
                  value={scopeForm.description}
                  onChange={(e) => setScopeForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  rows={3}
                  placeholder="وصف الصلاحية..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  الفئة
                </label>
                <select
                  value={scopeForm.category}
                  onChange={(e) => setScopeForm(prev => ({ ...prev, category: e.target.value as SecurityScope['category'] }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                >
                  <option value="pricing">التسعير</option>
                  <option value="catalog">الكتالوغ</option>
                  <option value="approvals">الموافقات</option>
                  <option value="contracts">العقود</option>
                  <option value="projects">المشاريع</option>
                  <option value="reports">التقارير</option>
                  <option value="system">النظام</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  المستوى
                </label>
                <select
                  value={scopeForm.level}
                  onChange={(e) => setScopeForm(prev => ({ ...prev, level: e.target.value as SecurityScope['level'] }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                >
                  <option value="read">قراءة</option>
                  <option value="write">كتابة</option>
                  <option value="manage">إدارة</option>
                  <option value="admin">إدمن</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={handleSaveScope}
                disabled={submitting || !scopeForm.name || !scopeForm.description}
                className="flex-1"
              >
                {submitting ? 'جاري الحفظ...' : (editingScope ? 'حفظ التعديلات' : 'إنشاء الصلاحية')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowScopeForm(false);
                  setEditingScope(null);
                  setScopeForm({
                    name: '',
                    description: '',
                    category: 'system',
                    level: 'read'
                  });
                }}
                disabled={submitting}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--text)]">إعدادات الأمان المتقدمة</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettingsForm(false)}
              >
                <X size={16} />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Server size={20} className="text-blue-500" />
                    <h3 className="font-medium text-[var(--text)]">إعدادات الخادم</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>نوع التشفير:</span>
                      <span>AES-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span>حالة الاتصال:</span>
                      <div className="flex items-center gap-1">
                        <Wifi size={12} className="text-green-500" />
                        <span>متصل</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Phone size={20} className="text-green-500" />
                    <h3 className="font-medium text-[var(--text)]">إعدادات 2FA</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>التطبيق المفضل:</span>
                      <span>Google Authenticator</span>
                    </div>
                    <div className="flex justify-between">
                      <span>نسخ احتياطي:</span>
                      <span>SMS</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-purple-500" />
                  <div>
                    <h3 className="font-medium text-[var(--text)]">الوصول العالمي</h3>
                    <p className="text-sm text-[var(--muted)]">السماح بالوصول من جميع المناطق</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowSettingsForm(false)}
                >
                  إلغاء
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Save size={16} />
                  حفظ الإعدادات
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
