"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { 
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Star,
  Upload,
  MessageSquare,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  Eye,
  DollarSign,
  Timer,
  Target
} from 'lucide-react';

interface CreatorProject {
  id: string;
  title: string;
  description: string;
  clientName: string;
  status: 'assigned' | 'in_progress' | 'review_pending' | 'completed' | 'delivered';
  priority: 'low' | 'normal' | 'high' | 'rush';
  deadline: string;
  createdAt: string;
  updatedAt: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  creatorNetRate: number | null; // السعر الصافي للمبدع فقط
  slaHours: number;
  isRush: boolean;
  speedBonus: number; // مكافأة السرعة
  isEarlyDelivery: boolean; // تسليم مبكر
  rating: number | null;
  feedback: string | null;
  qualityScore: number; // نقاط الجودة
  performanceMetrics: {
    onTimePercentage: number;
    firstPassPercentage: number;
    averageCompletionTime: number;
    totalCompletedTasks: number;
  } | null;
}

interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  overdue: number;
}

export default function CreatorProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [projects, setProjects] = useState<CreatorProject[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    total: 0,
    active: 0,
    completed: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // فلاتر
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'created' | 'priority'>('deadline');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('limit', '50');
      
      const response = await fetch(`/api/creators/projects?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        setStats(data.stats || { total: 0, active: 0, completed: 0, overdue: 0 });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في جلب المشاريع');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال');
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // التحقق من الجلسة
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin?from=creators/projects');
      return;
    }

    if (session.user.role !== 'creator') {
      router.push('/portal');
      return;
    }

    loadProjects();
  }, [session, status, router, statusFilter, loadProjects]);

  // فلترة وترتيب المشاريع
  const filteredProjects = projects
    .filter(project => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return project.title.toLowerCase().includes(searchLower) ||
               project.clientName.toLowerCase().includes(searchLower) ||
               project.description.toLowerCase().includes(searchLower);
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority':
          const priorityOrder = { rush: 4, high: 3, normal: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'review_pending': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'delivered': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'assigned': return 'مُسند';
      case 'in_progress': return 'قيد التنفيذ';
      case 'review_pending': return 'قيد المراجعة';
      case 'completed': return 'مكتمل';
      case 'delivered': return 'مُسلم';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'rush': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'normal': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'rush': return 'عاجل';
      case 'high': return 'عالي';
      case 'normal': return 'عادي';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  const isOverdue = (deadline: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] py-8">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
            <p className="text-[var(--muted)]">جاري تحميل المشاريع...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <Container>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text)] mb-2">مشاريعي</h1>
                <p className="text-[var(--muted)]">إدارة المشاريع والمهام المُسندة</p>
              </div>
              <Button
                variant="ghost"
                onClick={loadProjects}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                تحديث
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <Briefcase size={24} className="text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{stats.total}</p>
                    <p className="text-sm text-[var(--muted)]">إجمالي المشاريع</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <Clock size={24} className="text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{stats.active}</p>
                    <p className="text-sm text-[var(--muted)]">نشطة</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <CheckCircle size={24} className="text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{stats.completed}</p>
                    <p className="text-sm text-[var(--muted)]">مكتملة</p>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--card)] p-4 rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <AlertCircle size={24} className="text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-[var(--text)]">{stats.overdue}</p>
                    <p className="text-sm text-[var(--muted)]">متأخرة</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-[var(--muted)]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">النشطة</option>
                  <option value="assigned">المُسندة</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="review_pending">قيد المراجعة</option>
                  <option value="completed">مكتملة</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Search size={20} className="text-[var(--muted)]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                  placeholder="البحث في المشاريع..."
                />
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-[var(--muted)]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'deadline' | 'created' | 'priority')}
                  className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
                >
                  <option value="deadline">ترتيب حسب الموعد</option>
                  <option value="created">الأحدث أولاً</option>
                  <option value="priority">حسب الأولوية</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle size={20} />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase size={64} className="text-[var(--muted)] mx-auto mb-4" />
              <h3 className="text-xl font-medium text-[var(--text)] mb-2">لا توجد مشاريع</h3>
              <p className="text-[var(--muted)]">
                {statusFilter === 'all' 
                  ? 'لم يتم تكليفك بأي مشاريع بعد'
                  : `لا توجد مشاريع ${getStatusText(statusFilter)}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[var(--text)]">{project.title}</h3>
                        
                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>

                        {/* Priority Badge */}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {getPriorityText(project.priority)}
                        </span>

                        {/* Overdue Warning */}
                        {isOverdue(project.deadline) && !['completed', 'delivered'].includes(project.status) && (
                          <span className="px-2 py-1 rounded text-xs font-medium text-red-600 bg-red-50">
                            متأخر
                          </span>
                        )}
                      </div>

                      <p className="text-[var(--muted)] mb-3">{project.description}</p>

                      <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          {project.clientName}
                        </div>
                        
                        {project.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            {formatDate(project.deadline)}
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Timer size={16} />
                          SLA: {project.slaHours}ساعة
                        </div>

                        {project.creatorNetRate && (
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} />
                            {formatCurrency(project.creatorNetRate)} (سعر صافي)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/creators/projects/${project.id}`)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={16} />
                        عرض
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--muted)]">تقدم المهام</span>
                      <span className="text-sm text-[var(--text)] font-medium">
                        {project.completedTasks} / {project.totalTasks}
                      </span>
                    </div>
                    <div className="w-full bg-[var(--border)] rounded-full h-2">
                      <div 
                        className="bg-[var(--accent-500)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.totalTasks > 0 ? (project.completedTasks / project.totalTasks) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  {(project.speedBonus > 0 || project.qualityScore > 0 || project.performanceMetrics) && (
                    <div className="mb-4 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        
                        {/* Speed Bonus */}
                        {project.speedBonus > 0 && (
                          <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-green-500" />
                            <div>
                              <div className="text-[var(--muted)]">مكافأة السرعة</div>
                              <div className="text-green-600 font-medium">
                                {project.speedBonus.toLocaleString('ar-IQ')} د.ع
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Early Delivery Badge */}
                        {project.isEarlyDelivery && (
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            <div>
                              <div className="text-blue-600 font-medium">تسليم مبكر</div>
                              <div className="text-[var(--muted)]">قبل الموعد</div>
                            </div>
                          </div>
                        )}

                        {/* Quality Score */}
                        {project.qualityScore > 0 && (
                          <div className="flex items-center gap-2">
                            <Star size={16} className="text-yellow-500" />
                            <div>
                              <div className="text-[var(--muted)]">نقاط الجودة</div>
                              <div className="text-yellow-600 font-medium">{project.qualityScore}%</div>
                            </div>
                          </div>
                        )}

                        {/* Performance Metrics */}
                        {project.performanceMetrics && (
                          <div className="flex items-center gap-2">
                            <Target size={16} className="text-purple-500" />
                            <div>
                              <div className="text-[var(--muted)]">في الوقت المحدد</div>
                              <div className="text-purple-600 font-medium">
                                {project.performanceMetrics.onTimePercentage}%
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {['assigned', 'in_progress'].includes(project.status) && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push(`/creators/projects/${project.id}/tasks`)}
                        className="flex items-center gap-1"
                      >
                        <Target size={16} />
                        المهام ({project.pendingTasks})
                      </Button>
                    )}

                    {project.status === 'in_progress' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/creators/projects/${project.id}/upload`)}
                        className="flex items-center gap-1"
                      >
                        <Upload size={16} />
                        رفع الملفات
                      </Button>
                    )}

                    {project.feedback && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/creators/projects/${project.id}/feedback`)}
                        className="flex items-center gap-1"
                      >
                        <MessageSquare size={16} />
                        التقييم
                      </Button>
                    )}
                  </div>

                  {/* Rating Display */}
                  {project.rating && (
                    <div className="mt-3 pt-3 border-t border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--muted)]">التقييم:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              size={16} 
                              className={star <= project.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
                            />
                          ))}
                          <span className="text-sm text-[var(--text)] ml-2">{project.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
