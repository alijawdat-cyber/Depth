'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Clock, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Package,
  TrendingUp
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
  creatorNetRate: number | null;
  slaHours: number;
  isRush: boolean;
  speedBonus: number;
  isEarlyDelivery: boolean;
  rating: number | null;
  feedback: string | null;
  qualityScore: number;
  
  // ✨ Sprint 3: Creator earnings (permanently enabled)
  myEarnings?: number;
  totalLineItems?: number;
  totalQuantity?: number;
  
  performanceMetrics: {
    onTimePercentage: number;
    firstPassPercentage: number;
    averageCompletionTime: number;
    totalCompletedTasks: number;
  } | null;
  lineItemsSummary?: Array<{
    id?: string; // optional for key stability
    subcategory: string;
    subcategoryName?: string; // قد يأتي من API مستقبلًا
    quantity: number;
    processing: string;
    processingLabel?: string; // وسم العرض البشري
    baseUnit: number;
    creatorUnit: number;
    lineSubtotal: number;
  }>;
}

interface CreatorProjectCardProps {
  project: CreatorProject;
  onProjectClick?: (projectId: string) => void;
  metaNote?: string; // لعرض شارة الاستعلام الاحتياطي عند غياب الفهرس
}

export default function CreatorProjectCard({ project, onProjectClick, metaNote }: CreatorProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // ✨ Sprint 3: Enhanced earnings display is permanently enabled

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review_pending': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      case 'rush': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
    return new Date(deadline) < new Date() && !['completed', 'delivered'].includes(project.status);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'currency',
      currency: 'IQD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  const formatIQD = (amount: number) => formatCurrency(amount);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const getProgressPercentage = () => {
    if (project.totalTasks === 0) return 0;
    return Math.round((project.completedTasks / project.totalTasks) * 100);
  };

  const handleCardClick = () => {
    if (onProjectClick) {
      onProjectClick(project.id);
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-lg border shadow-sm transition-all duration-200 cursor-pointer hover:shadow-lg
        ${isHovered ? 'shadow-lg border-blue-200' : 'shadow-sm border-gray-200'}
        ${isOverdue(project.deadline) ? 'border-l-4 border-l-red-500' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {project.title}
              </h3>
              {project.isRush && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  ⚡ عاجل
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              العميل: {project.clientName}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
            {project.priority !== 'normal' && !project.isRush && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                {getPriorityText(project.priority)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        <div className="space-y-4">
          {/* Progress and Timeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">التقدم</span>
              <span className="font-medium">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  project.status === 'completed' ? 'bg-green-500' : 
                  project.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                }`}
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{project.completedTasks}/{project.totalTasks} مهام</span>
              {project.deadline && (
                <div className={`flex items-center gap-1 ${isOverdue(project.deadline) ? 'text-red-600' : ''}`}>
                  <Clock size={12} />
                  {formatDate(project.deadline)}
                </div>
              )}
            </div>
          </div>

          {/* Creator Earnings Section */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">السعر الصافي</span>
              <span className="font-semibold text-emerald-600">
                {project.creatorNetRate ? formatCurrency(project.creatorNetRate) : 'غير محدد'}
              </span>
            </div>

            {/* ✨ Sprint 3: Enhanced earnings display - permanently enabled */}
            {project.myEarnings && (
              <>
                <div className="h-px bg-gray-100 my-2" />
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className="text-emerald-600" />
                      <span className="text-gray-600 font-medium">أرباحي التفصيلية</span>
                    </div>
                    <span className="font-bold text-emerald-700">
                      {formatCurrency(project.myEarnings)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    {project.totalLineItems && (
                      <div className="flex items-center gap-1">
                        <Package size={12} />
                        <span>{project.totalLineItems} بند</span>
                      </div>
                    )}
                    {project.totalQuantity && (
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>{project.totalQuantity} وحدة</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Line Items Summary + My Earnings (updated per requirements) */}
          {(project.lineItemsSummary && project.lineItemsSummary.length > 0) && (
            <div className="mt-4 pt-4 border-t">
              {/* My Earnings */}
              <div className="mt-2 font-semibold" data-testid="my-earnings">
                أرباحي: {formatIQD(project.myEarnings ?? 0)}
              </div>

              {/* Line items summary */}
              <ul className="mt-3 space-y-1" data-testid="line-items-summary">
                {project.lineItemsSummary.map((li, idx) => (
                  <li key={li.id || idx} className="text-sm flex justify-between gap-2">
                    <span className="truncate">
                      {li.subcategoryName || li.subcategory} · {li.processingLabel || li.processing} · ×{li.quantity}
                    </span>
                    <span className="whitespace-nowrap">
                      {formatIQD(li.creatorUnit)} → {formatIQD(li.lineSubtotal)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Fallback note (index) */}
              {metaNote === 'fallback-no-index' && (
                <div className="mt-3 text-xs text-amber-600" data-testid="fallback-note">
                  يعمل باستعلام احتياطي مؤقتًا – يُفضّل إنشاء فهرس Firestore المركّب.
                </div>
              )}
            </div>
          )}

          {/* Performance Metrics */}
          {project.performanceMetrics && (
            <div className="border-t pt-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  <span className="text-gray-600">في الموعد:</span>
                  <span className="font-medium">{project.performanceMetrics.onTimePercentage}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={12} className="text-blue-500" />
                  <span className="text-gray-600">جودة:</span>
                  <span className="font-medium">{project.qualityScore}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="border-t pt-3">
            <Link href={`/creators/projects/${project.id}`} passHref>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group hover:bg-blue-50 hover:border-blue-300"
              >
                <span>عرض التفاصيل</span>
                <ArrowRight size={14} className="mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Alerts and Badges */}
          {(isOverdue(project.deadline) || project.speedBonus > 0 || project.isEarlyDelivery) && (
            <div className="flex flex-wrap gap-1">
              {isOverdue(project.deadline) && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                  <AlertCircle size={10} className="ml-1" />
                  متأخر
                </span>
              )}
              {project.speedBonus > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  ⚡ مكافأة سرعة: {formatCurrency(project.speedBonus)}
                </span>
              )}
              {project.isEarlyDelivery && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  🎯 تسليم مبكر
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
