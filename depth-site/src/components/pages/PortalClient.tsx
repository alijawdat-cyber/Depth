"use client";

import { useState } from "react";
import { Calendar, FileText, CheckCircle, BarChart3, Download, Eye, Clock, DollarSign, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

type Tab = "summary" | "files" | "approvals" | "reports";

// بيانات وهمية واقعية لعرض النموذج
const projectData = {
  client: "مطعم In Off",
  package: "Pro Package",
  status: "نشط",
  nextPayment: "2024-12-15",
  progress: 75,
  budget: "$2,500",
  spent: "$1,875",
  monthlyMetrics: {
    reach: "45K",
    engagement: "12.8%",
    conversions: "156",
    roi: "340%"
  }
};

const recentFiles = [
  { name: "تصاميم الحملة الشتوية", type: "Design", date: "2024-11-28", status: "مراجعة", size: "2.4 MB" },
  { name: "فيديو ريلز - العروض الأسبوعية", type: "Video", date: "2024-11-27", status: "معتمد", size: "45.2 MB" },
  { name: "استراتيجية المحتوى - ديسمبر", type: "Strategy", date: "2024-11-25", status: "معتمد", size: "1.1 MB" },
  { name: "تقرير الأداء الشهري", type: "Report", date: "2024-11-22", status: "مكتمل", size: "856 KB" },
  { name: "صور المنتجات الجديدة", type: "Photography", date: "2024-11-20", status: "معتمد", size: "28.7 MB" }
];

const pendingApprovals = [
  { title: "حملة العروض الشتوية", type: "Campaign", deadline: "2024-12-02", priority: "عالية" },
  { title: "محتوى قصص الانستقرام - أسبوع 1", type: "Content", deadline: "2024-12-01", priority: "متوسطة" },
  { title: "تصميم الإعلان المدفوع", type: "Ad Design", deadline: "2024-11-30", priority: "عالية" }
];

const reports = [
  { title: "تقرير الأداء الشهري - نوفمبر", date: "2024-11-30", type: "Monthly", format: "PDF" },
  { title: "تحليل المنافسين - Q4", date: "2024-11-28", type: "Analysis", format: "PDF" },
  { title: "إحصائيات الوسائط الاجتماعية", date: "2024-11-25", type: "Social Media", format: "Dashboard" },
  { title: "ROI والعائد على الاستثمار", date: "2024-11-22", type: "Financial", format: "Excel" }
];

export default function PortalClient() {
  const [tab, setTab] = useState<Tab>("summary");

  const tabs = [
    { id: "summary", label: "ملخص", icon: BarChart3 },
    { id: "files", label: "الملفات", icon: FileText },
    { id: "approvals", label: "الموافقات", icon: CheckCircle },
    { id: "reports", label: "التقارير", icon: Calendar }
  ] as const;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "معتمد": case "مكتمل": return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "مراجعة": return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "عالية": return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "متوسطة": return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      default: return "text-[var(--slate-600)] bg-[var(--card)]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      {tab === "summary" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-[var(--accent-500)]" />
              <span className="text-sm font-medium">التقدم</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text)]">{projectData.progress}%</div>
          </div>
          
          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-green-500" />
              <span className="text-sm font-medium">المصروف</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text)]">{projectData.spent}</div>
          </div>
          
          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} className="text-blue-500" />
              <span className="text-sm font-medium">الوصول</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text)]">{projectData.monthlyMetrics.reach}</div>
          </div>
          
          <div className="bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--elev)]">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-purple-500" />
              <span className="text-sm font-medium">التفاعل</span>
            </div>
            <div className="text-2xl font-bold text-[var(--text)]">{projectData.monthlyMetrics.engagement}</div>
          </div>
        </div>
      )}

      {/* Main Portal Card */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-[var(--elev)] bg-[var(--bg)]">
          <div className="flex gap-1 p-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as Tab)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${
                    tab === t.id 
                      ? "bg-[var(--accent-500)] text-white" 
                      : "text-[var(--slate-600)] hover:bg-[var(--elev)] hover:text-[var(--text)]"
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Summary Tab */}
          {tab === "summary" && (
            <div className="space-y-6">
              {/* Project Overview */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-4">تفاصيل المشروع</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">العميل:</span>
                      <span className="font-medium text-[var(--text)]">{projectData.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">الباقة:</span>
                      <span className="font-medium text-[var(--text)]">{projectData.package}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">الحالة:</span>
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {projectData.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">الدفعة القادمة:</span>
                      <span className="font-medium text-[var(--text)]">{projectData.nextPayment}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-4">الأداء الشهري</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">الوصول:</span>
                      <span className="font-bold text-[var(--accent-500)]">{projectData.monthlyMetrics.reach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">التفاعل:</span>
                      <span className="font-bold text-blue-600">{projectData.monthlyMetrics.engagement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">التحويلات:</span>
                      <span className="font-bold text-green-600">{projectData.monthlyMetrics.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--slate-600)]">العائد على الاستثمار:</span>
                      <span className="font-bold text-purple-600">{projectData.monthlyMetrics.roi}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--text)]">تقدم المشروع</span>
                  <span className="text-sm text-[var(--slate-600)]">{projectData.progress}%</span>
                </div>
                <div className="w-full bg-[var(--elev)] rounded-full h-2">
                  <div 
                    className="bg-[var(--accent-500)] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${projectData.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-[var(--elev)] pt-6">
                <h3 className="text-lg font-semibold text-[var(--text)] mb-4">إجراءات سريعة</h3>
                <div className="flex flex-wrap gap-3">
                  <WhatsAppButton
                    messageOptions={{
                      type: 'general',
                      details: `لدي استفسار حول مشروع ${projectData.client} - ${projectData.package}`
                    }}
                    variant="ghost"
                    className="flex-1 min-w-[200px]"
                  >
                    تواصل مع الفريق
                  </WhatsAppButton>
                  
                  <Button variant="secondary" className="flex-1 min-w-[200px]">
                    <Download size={16} className="mr-2" />
                    تحميل التقرير الشهري
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Files Tab */}
          {tab === "files" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[var(--text)]">ملفات المشروع</h3>
                <Button variant="secondary" size="sm">
                  <Download size={16} className="mr-2" />
                  تحميل الكل
                </Button>
              </div>

              <div className="space-y-3">
                {recentFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[var(--bg)] rounded-[var(--radius)] border border-[var(--elev)]">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-[var(--accent-500)]" />
                      <div>
                        <div className="font-medium text-[var(--text)]">{file.name}</div>
                        <div className="text-sm text-[var(--slate-600)]">{file.type} • {file.size}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                        {file.status}
                      </span>
                      <div className="text-sm text-[var(--slate-600)]">{file.date}</div>
                      <Button variant="ghost" size="sm">
                        <Eye size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approvals Tab */}
          {tab === "approvals" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--text)]">الموافقات المطلوبة</h3>
              
              <div className="space-y-3">
                {pendingApprovals.map((approval, index) => (
                  <div key={index} className="p-4 bg-[var(--bg)] rounded-[var(--radius)] border border-[var(--elev)]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[var(--text)]">{approval.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.priority)}`}>
                        {approval.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-[var(--slate-600)]">
                        <Clock size={14} />
                        <span>الموعد النهائي: {approval.deadline}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">معاينة</Button>
                        <Button variant="primary" size="sm">موافقة</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pendingApprovals.length === 0 && (
                <div className="text-center py-8 text-[var(--slate-600)]">
                  <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                  <p>لا توجد موافقات معلقة حالياً</p>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {tab === "reports" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[var(--text)]">التقارير والتحليلات</h3>
              
              <div className="space-y-3">
                {reports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[var(--bg)] rounded-[var(--radius)] border border-[var(--elev)]">
                    <div className="flex items-center gap-3">
                      <BarChart3 size={20} className="text-[var(--accent-500)]" />
                      <div>
                        <div className="font-medium text-[var(--text)]">{report.title}</div>
                        <div className="text-sm text-[var(--slate-600)]">{report.type} • {report.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {report.format}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Download size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


