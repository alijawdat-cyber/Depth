"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  BarChart3, 
  CheckSquare, 
  FileText, 
  Upload,
  MessageSquare, 
  Activity,
  DollarSign,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CreatorTelemetry } from '@/lib/telemetry/creator';
import { 
  CreatorProjectOverview,
  CreatorLineItem,
  CreatorTask,
  CreatorFileUpload,
  CreatorActivity 
} from '@/types/creator-project';

type Tab = 'overview' | 'tasks' | 'lineitems' | 'files' | 'notes' | 'activity';

interface Props {
  projectId: string;
}

export default function CreatorProjectDetail({ projectId }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [project, setProject] = useState<CreatorProjectOverview | null>(null);
  const [lineItems, setLineItems] = useState<CreatorLineItem[]>([]);
  const [tasks, setTasks] = useState<CreatorTask[]>([]);
  const [files, setFiles] = useState<CreatorFileUpload[]>([]);
  const [activities, setActivities] = useState<CreatorActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metaNote, setMetaNote] = useState<string | undefined>();

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'tasks', label: 'المهام', icon: CheckSquare },
    { id: 'lineitems', label: 'السطور', icon: Package },
    { id: 'files', label: 'الملفات', icon: FileText },
    { id: 'notes', label: 'الملاحظات', icon: MessageSquare },
    { id: 'activity', label: 'النشاط', icon: Activity }
  ] as const;

  const loadProjectData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load project overview
      const projectResponse = await fetch(`/api/creators/projects/${projectId}`);
      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        setMetaNote(projectData.meta?.note);
        if (projectData.meta?.note === 'forbidden') {
          setError('ما عندك صلاحية الوصول لهذا المشروع');
        } else {
          setProject(projectData.project);
          setLineItems(projectData.lineItems || []);
          setTasks(projectData.tasks || []);
          setFiles(projectData.files || []);
          setActivities(projectData.activities || []);
        }
      } else {
        setError('فشل في تحميل بيانات المشروع');
      }
    } catch (err) {
      console.error('Error loading project data:', err);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const loadData = async () => {
      if (session?.user?.id) {
        // Track project view
        CreatorTelemetry.trackProjectView(projectId, session.user.id);
        await loadProjectData();
      }
    };
    
    loadData();
  }, [projectId, session?.user?.id, loadProjectData]);

  const handleTabChange = (newTab: Tab) => {
    if (session?.user?.id) {
      CreatorTelemetry.trackTabNavigation(projectId, session.user.id, activeTab, newTab);
    }
    
    setActiveTab(newTab);

    // Track specific tab views
    if (newTab === 'lineitems' && session?.user?.id) {
      CreatorTelemetry.trackLineItemsView(projectId, session.user.id, lineItems.length);
    }
    if (newTab === 'overview' && project && session?.user?.id) {
      CreatorTelemetry.trackEarningsView(projectId, session.user.id, project.myEarnings, lineItems.length);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' د.ع';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-muted)]">جاري تحميل تفاصيل المشروع...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'المشروع غير موجود'}</p>
          {metaNote === 'forbidden' && (
            <p className="text-sm text-[var(--text-muted)] mb-4">التحقق: تم رفض الوصول بناءً على assignedCreators/includes</p>
          )}
          <Button onClick={() => router.push('/creators/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة للمشاريع
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/creators/projects')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                المشاريع
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[var(--text)]">{project.title}</h1>
                <p className="text-[var(--text-muted)] text-sm">
                  الموعد النهائي: {formatDate(project.deadline)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--primary)]">
                  {formatCurrency(project.myEarnings)}
                </div>
                <div className="text-sm text-[var(--text-muted)]">أرباحي الإجمالية</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--text)]">
                  {project.progressPercentage}%
                </div>
                <div className="text-sm text-[var(--text-muted)]">مكتمل</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-colors
                    ${activeTab === tab.id 
                      ? 'border-[var(--primary)] text-[var(--primary)]' 
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' && (
          <CreatorProjectOverviewTab project={project} />
        )}
        
        {activeTab === 'tasks' && (
          <CreatorTasksTab tasks={tasks} onTaskUpdate={loadProjectData} />
        )}
        
        {activeTab === 'lineitems' && (
          <CreatorLineItemsTab 
            lineItems={lineItems} 
            totalEarnings={project.myEarnings}
            onUpdate={loadProjectData}
          />
        )}
        
        {activeTab === 'files' && (
          <CreatorFilesTab 
            files={files} 
            projectId={projectId}
            onFileUpload={loadProjectData}
          />
        )}
        
        {activeTab === 'notes' && (
          <CreatorNotesTab />
        )}
        
        {activeTab === 'activity' && (
          <CreatorActivityTab activities={activities} />
        )}
      </div>
    </div>
  );
}

// Tab Components (will create separate files for these)
function CreatorProjectOverviewTab({ project }: { project: CreatorProjectOverview }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Project Stats */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl p-6 border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-4">إحصائيات المشروع</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-[var(--bg)] rounded-lg">
              <div className="text-2xl font-bold text-[var(--primary)]">{project.totalLineItems}</div>
              <div className="text-sm text-[var(--text-muted)]">سطور العمل</div>
            </div>
            <div className="text-center p-4 bg-[var(--bg)] rounded-lg">
              <div className="text-2xl font-bold text-[var(--text)]">{project.totalQuantity}</div>
              <div className="text-sm text-[var(--text-muted)]">إجمالي الكمية</div>
            </div>
            <div className="text-center p-4 bg-[var(--bg)] rounded-lg">
              <div className="text-2xl font-bold text-green-600">{project.completedTasks}</div>
              <div className="text-sm text-[var(--text-muted)]">مهام مكتملة</div>
            </div>
            <div className="text-center p-4 bg-[var(--bg)] rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{project.uploadedFiles}</div>
              <div className="text-sm text-[var(--text-muted)]">ملفات مرفوعة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Summary */}
      <div>
        <div className="bg-white rounded-xl p-6 border border-[var(--border)]">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[var(--primary)]" />
            ملخص الأرباح
          </h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-lg">
              <div className="text-3xl font-bold text-[var(--primary)]">
                {new Intl.NumberFormat('ar-IQ').format(project.myEarnings)} د.ع
              </div>
              <div className="text-sm text-[var(--text-muted)]">إجمالي أرباحي</div>
            </div>
            
            <div className="text-center p-3 bg-[var(--bg)] rounded-lg">
              <div className="text-lg font-semibold text-[var(--text)]">
                {Math.round(project.myEarnings / project.totalQuantity || 0)} د.ع
              </div>
              <div className="text-sm text-[var(--text-muted)]">متوسط الربح/وحدة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder components (will implement these next)
function CreatorTasksTab({ tasks }: { tasks: CreatorTask[]; onTaskUpdate: () => void }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[var(--border)]">
      <h3 className="text-lg font-semibold mb-4">قائمة المهام</h3>
      <p className="text-[var(--text-muted)]">سيتم إضافة قائمة المهام هنا - {tasks.length} مهمة</p>
    </div>
  );
}

function CreatorLineItemsTab({ 
  lineItems, 
  totalEarnings
}: { 
  lineItems: CreatorLineItem[]; 
  totalEarnings: number;
  onUpdate: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)]">
      <div className="p-6 border-b border-[var(--border)]">
        <h3 className="text-lg font-semibold">سطور العمل والأرباح</h3>
        <p className="text-[var(--text-muted)] text-sm">تفاصيل الكميات والأسعار وأرباحي</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--bg)]">
            <tr>
              <th className="text-right p-4 text-sm font-medium text-[var(--text-muted)]">الفئة الفرعية</th>
              <th className="text-center p-4 text-sm font-medium text-[var(--text-muted)]">الكمية</th>
              <th className="text-center p-4 text-sm font-medium text-[var(--text-muted)]">المعالجة</th>
              <th className="text-center p-4 text-sm font-medium text-[var(--text-muted)]">السعر الأساس/وحدة</th>
              <th className="text-center p-4 text-sm font-medium text-[var(--text-muted)]">سعري/وحدة</th>
              <th className="text-center p-4 text-sm font-medium text-[var(--text-muted)]">المجموع الفرعي</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id} className="border-t border-[var(--border)]">
                <td className="p-4 font-medium">{item.subcategory}</td>
                <td className="p-4 text-center">{item.quantity}</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm">
                    {item.processing}
                  </span>
                </td>
                <td className="p-4 text-center">{new Intl.NumberFormat('ar-IQ').format(item.baseUnit)} د.ع</td>
                <td className="p-4 text-center font-semibold">{new Intl.NumberFormat('ar-IQ').format(item.creatorUnit)} د.ع</td>
                <td className="p-4 text-center font-bold text-[var(--primary)]">
                  {new Intl.NumberFormat('ar-IQ').format(item.lineSubtotal)} د.ع
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[var(--primary)]/5">
            <tr>
              <td colSpan={5} className="p-4 text-right font-bold">إجمالي أرباحي:</td>
              <td className="p-4 text-center font-bold text-xl text-[var(--primary)]">
                {new Intl.NumberFormat('ar-IQ').format(totalEarnings)} د.ع
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function CreatorFilesTab({ 
  files
}: { 
  files: CreatorFileUpload[]; 
  projectId: string;
  onFileUpload: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-[var(--border)]">
        <h3 className="text-lg font-semibold mb-4">رفع ملف جديد</h3>
        <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">اسحب الملفات هنا أو انقر للاختيار</p>
          <Button className="mt-4">اختيار ملفات</Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-[var(--border)]">
        <h3 className="text-lg font-semibold mb-4">الملفات المرفوعة ({files.length})</h3>
        <p className="text-[var(--text-muted)]">سيتم إضافة قائمة الملفات هنا</p>
      </div>
    </div>
  );
}

function CreatorNotesTab() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[var(--border)]">
      <h3 className="text-lg font-semibold mb-4">ملاحظات المشروع</h3>
      <p className="text-[var(--text-muted)]">سيتم إضافة نظام الملاحظات هنا</p>
    </div>
  );
}

function CreatorActivityTab({ activities }: { activities: CreatorActivity[] }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[var(--border)]">
      <h3 className="text-lg font-semibold mb-4">سجل النشاط</h3>
      <p className="text-[var(--text-muted)]">سيتم إضافة سجل النشاط هنا - {activities.length} نشاط</p>
    </div>
  );
}
