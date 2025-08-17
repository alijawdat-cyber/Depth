"use client";

// صفحة إدارة الملفات والمراجعة - Admin
// الوثيقة المرجعية: docs/roles/Files-and-Delivery-Spec.md
// الغرض: إدارة الملفات، المراجعة، والتسليم

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { Button } from "@/components/ui/Button";
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { 
  Folder,
  File,
  Image,
  Video,
  FileText,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  Filter,
  Search,
  Grid,
  List,
  Calendar,
  User,
  Tag,
  Archive,
  Star,
  Share2,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  Send,
  FileImage,
  FileVideo,

  HardDrive,
  Cloud,
  Database
} from "lucide-react";

// واجهات البيانات
interface FileItem {
  id: string;
  name: string;
  originalName: string;
  type: 'image' | 'video' | 'document' | 'archive' | 'other';
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  
  // معلومات المشروع
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  creatorId?: string;
  creatorName?: string;
  
  // معلومات التسليم
  status: 'draft' | 'uploaded' | 'ready_for_review' | 'changes_requested' | 'approved' | 'delivered';
  batchNumber?: number;
  assetNumber?: number;
  subcategory?: string;
  
  // المراجعة
  reviewStatus?: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  
  // التخزين
  storageLocation: 'r2' | 'archive' | 'local';
  uploadedAt: string;
  lastModified: string;
  expiresAt?: string; // للأرشفة
  
  // الأذونات
  isPublic: boolean;
  accessLevel: 'private' | 'client' | 'team' | 'public';
  
  // الإحصائيات
  downloads: number;
  views: number;
  
  // العلامات
  tags: string[];
  
  // الملاحظات
  comments: FileComment[];
}

interface FileComment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  comment: string;
  timestamp: string;
  isInternal: boolean;
}

interface FileStats {
  totalFiles: number;
  totalSize: number;
  storageUsed: {
    r2: number;
    archive: number;
    local: number;
  };
  filesByStatus: {
    draft: number;
    uploaded: number;
    ready_for_review: number;
    changes_requested: number;
    approved: number;
    delivered: number;
  };
  filesByType: {
    image: number;
    video: number;
    document: number;
    archive: number;
    other: number;
  };
  pendingReviews: number;
  expiringFiles: number;
}

export default function AdminFilesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // States
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stats, setStats] = useState<FileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [storageFilter, setStorageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingFile, setReviewingFile] = useState<FileItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  
  // Operations
  const [uploading, setUploading] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  // التحقق من صلاحيات الإدمن
  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  // تحميل البيانات
  const loadFilesData = useCallback(async () => {
    try {
      setLoading(true);
      
      // تحميل البيانات بشكل متوازي
      const [filesRes, statsRes] = await Promise.all([
        fetch(`/api/admin/files?status=${statusFilter}&type=${typeFilter}&storage=${storageFilter}&search=${searchQuery}`),
        fetch('/api/admin/files/stats')
      ]);

      if (filesRes.ok) {
        const filesData = await filesRes.json();
        setFiles(filesData.files || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || null);
      }

    } catch (err) {
      setError('فشل في تحميل الملفات');
      console.error('Load files data error:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, storageFilter, searchQuery]);

  useEffect(() => {
    if (isAdmin) {
      loadFilesData();
    }
  }, [isAdmin, loadFilesData]);

  // مراجعة ملف
  const handleReviewFile = async (fileId: string, action: 'approve' | 'reject') => {
    try {
      setReviewing(true);
      const response = await fetch(`/api/admin/files/${fileId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action, 
          notes: reviewNotes,
          reviewedBy: session?.user?.email 
        })
      });

      if (response.ok) {
        const result = await response.json();
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, ...result.file } : f
        ));
        
        setShowReviewModal(false);
        setReviewingFile(null);
        setReviewNotes('');
        
        alert(`تم ${action === 'approve' ? 'اعتماد' : 'رفض'} الملف بنجاح`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في مراجعة الملف');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Review file error:', err);
    } finally {
      setReviewing(false);
    }
  };

  // حذف ملف
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;

    try {
      const response = await fetch(`/api/admin/files/${fileId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        alert('تم حذف الملف بنجاح');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في حذف الملف');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Delete file error:', err);
    }
  };

  // أرشفة ملفات
  const handleArchiveFiles = async (fileIds: string[]) => {
    try {
      const response = await fetch('/api/admin/files/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileIds })
      });

      if (response.ok) {
        setFiles(prev => prev.map(f => 
          fileIds.includes(f.id) 
            ? { ...f, storageLocation: 'archive' as const }
            : f
        ));
        setSelectedFiles([]);
        alert('تم أرشفة الملفات بنجاح');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في أرشفة الملفات');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Archive files error:', err);
    }
  };

  // تحميل ملف
  const handleDownloadFile = async (file: FileItem) => {
    try {
      const response = await fetch(`/api/admin/files/${file.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // تحديث عدد التحميلات
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f
        ));
      } else {
        throw new Error('Failed to download file');
      }
    } catch (err) {
      setError('فشل في تحميل الملف');
      console.error('Download file error:', err);
    }
  };

  // رفع ملفات جديدة
  const handleUploadFiles = async (files: FileList) => {
    try {
      setUploading(true);
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await fetch('/api/admin/files/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setFiles(prev => [...result.files, ...prev]);
        setShowUploadModal(false);
        alert(`تم رفع ${files.length} ملف بنجاح`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'فشل في رفع الملفات');
      }
    } catch (err) {
      setError('خطأ في الاتصال');
      console.error('Upload files error:', err);
    } finally {
      setUploading(false);
    }
  };

  // عرض تفاصيل الملف
  const handleViewFileDetails = (file: FileItem) => {
    router.push(`/admin/files/${file.id}`);
  };

  // تصفية الملفات
  const filteredFiles = files.filter(file => {
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    const matchesType = typeFilter === 'all' || file.type === typeFilter;
    const matchesStorage = storageFilter === 'all' || file.storageLocation === storageFilter;
    const matchesSearch = searchQuery === '' || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesStorage && matchesSearch;
  });

  // دوال المساعدة
  const getFileIcon = (file: FileItem) => {
    switch (file.type) {
      case 'image': return <FileImage size={20} className="text-blue-500" />;
      case 'video': return <FileVideo size={20} className="text-purple-500" />;
      case 'document': return <FileText size={20} className="text-green-500" />;
      case 'archive': return <Archive size={20} className="text-orange-500" />;
      default: return <File size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'uploaded': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'ready_for_review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'changes_requested': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'uploaded': return 'مرفوع';
      case 'ready_for_review': return 'جاهز للمراجعة';
      case 'changes_requested': return 'طلب تعديل';
      case 'approved': return 'معتمد';
      case 'delivered': return 'مُسلّم';
      default: return status;
    }
  };

  const getStorageIcon = (location: string) => {
    switch (location) {
      case 'r2': return <Cloud size={16} className="text-blue-500" />;
      case 'archive': return <Archive size={16} className="text-gray-500" />;
      case 'local': return <HardDrive size={16} className="text-green-500" />;
      default: return <Database size={16} className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatStorageSize = (bytes: number) => {
    return formatFileSize(bytes);
  };

  // دالة لإضافة علامة للملف
  const handleTagFile = (fileId: string, tagName: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, tags: [...f.tags, tagName] }
        : f
    ));
  };

  // دالة لمشاركة الملف
  const handleShareFile = (file: FileItem) => {
    const shareUrl = `${window.location.origin}/admin/files/${file.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('تم نسخ رابط الملف');
  };

  // دالة لعرض معلومات الوقت
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-EG');
  };

  // دالة لتشغيل معاينة الفيديو
  const handlePlayVideo = (file: FileItem) => {
    if (file.type === 'video' && file.url) {
      window.open(file.url, '_blank');
    }
  };

  // دالة لإضافة تعليق
  const handleAddComment = (fileId: string, comment: string) => {
    const newComment: FileComment = {
      id: Date.now().toString(),
      userId: session?.user?.email || '',
      userName: session?.user?.name || 'مستخدم',
      userRole: 'admin',
      comment,
      timestamp: new Date().toISOString(),
      isInternal: true
    };

    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, comments: [...f.comments, newComment] }
        : f
    ));
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
          <p className="text-[var(--muted)]">جاري تحميل الملفات...</p>
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
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">إدارة الملفات</h1>
          <p className="text-[var(--muted)]">إدارة الملفات، المراجعة، والتسليم</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
          </div>
          <Button 
            variant="secondary" 
            onClick={loadFilesData}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            تحديث
          </Button>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload size={16} />
            رفع ملفات
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
                <p className="text-sm text-[var(--muted)]">إجمالي الملفات</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.totalFiles.toLocaleString()}</p>
              </div>
              <Folder size={24} className="text-[var(--accent-500)]" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">حجم التخزين</p>
                <p className="text-2xl font-bold text-[var(--text)]">{formatStorageSize(stats.totalSize)}</p>
              </div>
              <Database size={24} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">في انتظار المراجعة</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.pendingReviews}</p>
              </div>
              <Eye size={24} className="text-yellow-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">ملفات منتهية الصلاحية</p>
                <p className="text-2xl font-bold text-[var(--text)]">{stats.expiringFiles}</p>
                <div className="flex items-center gap-1 text-xs text-[var(--muted)] mt-1">
                  <Clock size={12} />
                  <span>مراجعة دورية</span>
                </div>
              </div>
              <AlertTriangle size={24} className="text-red-500" />
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats Row */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">الملفات المميزة</p>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {files.filter(f => f.tags.includes('مميز')).length}
                </p>
                <div className="flex items-center gap-1 text-xs text-[var(--muted)] mt-1">
                  <Star size={12} />
                  <span>علامة خاصة</span>
                </div>
              </div>
              <Star size={24} className="text-yellow-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">الملفات المرسلة</p>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {files.filter(f => f.status === 'delivered').length}
                </p>
                <div className="flex items-center gap-1 text-xs text-[var(--muted)] mt-1">
                  <Send size={12} />
                  <span>تم التسليم</span>
                </div>
              </div>
              <Send size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted)]">عمليات الاسترداد</p>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {files.filter(f => f.status === 'changes_requested').length}
                </p>
                <div className="flex items-center gap-1 text-xs text-[var(--muted)] mt-1">
                  <RotateCcw size={12} />
                  <span>طلب تعديل</span>
                </div>
              </div>
              <RotateCcw size={24} className="text-orange-500" />
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
                placeholder="البحث في الملفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[var(--muted)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="uploaded">مرفوع</option>
              <option value="ready_for_review">جاهز للمراجعة</option>
              <option value="changes_requested">طلب تعديل</option>
              <option value="approved">معتمد</option>
              <option value="delivered">مُسلّم</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            >
              <option value="all">جميع الأنواع</option>
              <option value="image">صور</option>
              <option value="video">فيديو</option>
              <option value="document">مستندات</option>
              <option value="archive">أرشيف</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={storageFilter}
              onChange={(e) => setStorageFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)] focus:border-transparent"
            >
              <option value="all">جميع المواقع</option>
              <option value="r2">R2 Cloud</option>
              <option value="archive">أرشيف</option>
              <option value="local">محلي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedFiles.length} ملف محدد
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleArchiveFiles(selectedFiles)}
              >
                <Archive size={16} />
                أرشفة
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFiles([])}
              >
                إلغاء التحديد
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Files Grid/List */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <Folder size={64} className="text-[var(--muted)] mx-auto mb-4" />
          <h3 className="text-xl font-medium text-[var(--text)] mb-2">لا توجد ملفات</h3>
          <p className="text-[var(--muted)] mb-4">ابدأ برفع ملفات جديدة</p>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload size={16} />
            رفع ملفات
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
          {filteredFiles.map((file) => (
            <div 
              key={file.id} 
              className={`bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden ${
                viewMode === 'grid' ? 'p-4' : 'p-4'
              }`}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles(prev => [...prev, file.id]);
                        } else {
                          setSelectedFiles(prev => prev.filter(id => id !== file.id));
                        }
                      }}
                      className="rounded"
                    />
                    <div className="flex items-center gap-1">
                      {getStorageIcon(file.storageLocation)}
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(file.status)}`}>
                        {getStatusText(file.status)}
                      </span>
                    </div>
                  </div>

                  {/* File Preview */}
                  <div className="flex items-center justify-center h-32 bg-[var(--bg)] rounded-lg mb-3">
                    {file.thumbnailUrl ? (
                      <NextImage 
                        src={file.thumbnailUrl} 
                        alt={file.originalName || 'معاينة الملف'}
                        width={128}
                        height={128}
                        className="max-h-full max-w-full object-contain rounded"
                        priority={false}
                      />
                    ) : (
                      getFileIcon(file)
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-[var(--text)] truncate" title={file.originalName}>
                      {file.originalName}
                    </h4>
                    
                    <div className="text-xs text-[var(--muted)] space-y-1">
                      <div className="flex items-center justify-between">
                        <span>الحجم:</span>
                        <span>{formatFileSize(file.size)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>المشروع:</span>
                        <span className="truncate max-w-[100px]" title={file.projectName}>
                          {file.projectName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>العميل:</span>
                        <span className="truncate max-w-[100px]" title={file.clientName}>
                          {file.clientName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                        <Eye size={12} />
                        {file.views}
                        <Download size={12} className="ml-2" />
                        {file.downloads}
                        {file.type === 'video' && (
                          <div className="flex items-center gap-1 ml-2">
                            <Video size={12} />
                            <Play size={12} />
                          </div>
                        )}
                        {file.type === 'image' && (
                          <Image size={12} className="ml-2" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadFile(file)}
                          title="تحميل"
                        >
                          <Download size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareFile(file)}
                          title="مشاركة"
                        >
                          <Share2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewFileDetails(file)}
                          title="تفاصيل"
                        >
                          <Edit size={14} />
                        </Button>
                        {file.type === 'video' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayVideo(file)}
                            title="تشغيل"
                          >
                            <Play size={14} />
                          </Button>
                        )}
                        {file.type === 'video' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alert('ميزة الإيقاف المؤقت قيد التطوير')}
                            title="إيقاف مؤقت"
                          >
                            <Pause size={14} />
                          </Button>
                        )}
                        {file.status === 'ready_for_review' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReviewingFile(file);
                              setShowReviewModal(true);
                            }}
                            title="مراجعة"
                          >
                            <Eye size={14} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const tag = prompt('أدخل اسم العلامة:');
                            if (tag) handleTagFile(file.id, tag);
                          }}
                          className="text-blue-600"
                          title="إضافة علامة"
                        >
                          <Tag size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const comment = prompt('أدخل تعليقك:');
                            if (comment) handleAddComment(file.id, comment);
                          }}
                          className="text-green-600"
                          title="إضافة تعليق"
                        >
                          <MessageSquare size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-600"
                          title="حذف"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(prev => [...prev, file.id]);
                      } else {
                        setSelectedFiles(prev => prev.filter(id => id !== file.id));
                      }
                    }}
                    className="rounded"
                  />

                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(file)}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[var(--text)] truncate">
                        {file.originalName}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
                        <span>{formatFileSize(file.size)}</span>
                        <div className="flex items-center gap-1">
                          <User size={12} />
                          <span>{file.clientName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatTimeAgo(file.uploadedAt)}</span>
                        </div>
                        {file.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag size={12} />
                            <span>{file.tags.length} علامة</span>
                          </div>
                        )}
                        {file.comments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <MessageSquare size={12} />
                            <span>{file.comments.length} تعليق</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStorageIcon(file.storageLocation)}
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(file.status)}`}>
                        {getStatusText(file.status)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(file)}
                      >
                        <Download size={16} />
                      </Button>
                      {file.status === 'ready_for_review' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReviewingFile(file);
                            setShowReviewModal(true);
                          }}
                        >
                          <Eye size={16} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && reviewingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">مراجعة الملف</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-[var(--text)] mb-2">{reviewingFile.originalName}</h3>
                <div className="text-sm text-[var(--muted)] space-y-1">
                  <div>المشروع: {reviewingFile.projectName}</div>
                  <div>العميل: {reviewingFile.clientName}</div>
                  <div>الحجم: {formatFileSize(reviewingFile.size)}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1">
                  ملاحظات المراجعة
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-500)]"
                  rows={4}
                  placeholder="أضف ملاحظاتك هنا..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={() => handleReviewFile(reviewingFile.id, 'approve')}
                disabled={reviewing}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle size={16} />
                {reviewing ? 'جاري الاعتماد...' : 'اعتماد'}
              </Button>
              <Button
                onClick={() => handleReviewFile(reviewingFile.id, 'reject')}
                disabled={reviewing}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <XCircle size={16} />
                {reviewing ? 'جاري الرفض...' : 'رفض'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewingFile(null);
                  setReviewNotes('');
                }}
                disabled={reviewing}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card)] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-4">رفع ملفات جديدة</h2>
            
            {!uploading ? (
              <div>
                <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center mb-4">
                  <Upload size={48} className="text-[var(--muted)] mx-auto mb-4" />
                  <p className="text-[var(--muted)] mb-2">اسحب الملفات هنا أو انقر للاختيار</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.zip"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleUploadFiles(e.target.files);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-500)] text-white rounded-lg cursor-pointer hover:bg-[var(--accent-600)] transition-colors"
                  >
                    <Folder size={16} />
                    اختر الملفات
                  </label>
                </div>
                
                <div className="text-xs text-[var(--muted)] mb-4">
                  الأنواع المدعومة: صور، فيديو، PDF، Word، ZIP
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setShowUploadModal(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
                <p className="text-[var(--text)] mb-2">جاري رفع الملفات...</p>
                <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
                  <Clock size={16} />
                  <span>يرجى الانتظار</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
