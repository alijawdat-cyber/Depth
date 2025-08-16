"use client";

// نموذج تقييم الإدارة للمبدعين - متوافق مع docs/catalog/04-Admin-Evaluation-Form.md
// الغرض: تقييم شامل للمبدع بناءً على 4 معايير رئيسية مع أوزان محددة
// المعايير: الجودة (40%) + السرعة (25%) + الموثوقية (20%) + الامتثال (15%)

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import SectionHeading from '@/components/ui/SectionHeading';
import { 
  Star, 
  Clock, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Award,
  
  Save,
  Send,
  ArrowLeft
} from 'lucide-react';

// Types based on documentation
interface AdminEvaluation {
  // Quality Assessment (40% weight)
  qualityAssessment: {
    score: number; // 0-100
    weight: 0.40;
    criteria: {
      technicalSkill: number; // 0-100
      creativity: number; // 0-100
      consistency: number; // 0-100
      attentionToDetail: number; // 0-100
    };
    portfolioReview: {
      overallRating: number; // 1-5 stars
      bestSamples: string[]; // URLs or descriptions
      improvementAreas: string[];
    };
    notes: string;
  };

  // Speed Assessment (25% weight)
  speedAssessment: {
    score: number; // 0-100
    weight: 0.25;
    criteria: {
      deliveryTime: number; // 0-100
      responsiveness: number; // 0-100
      efficiency: number; // 0-100
    };
    slaPerformance: {
      standardSLA: number; // hours
      rushSLA: number; // hours
      averageDelivery: number; // hours
      onTimePercentage: number; // 0-100
    };
    notes: string;
  };

  // Reliability Assessment (20% weight)
  reliabilityAssessment: {
    score: number; // 0-100
    weight: 0.20;
    criteria: {
      punctuality: number; // 0-100
      communication: number; // 0-100
      professionalism: number; // 0-100
      consistency: number; // 0-100
    };
    trackRecord: {
      completedProjects: number;
      cancelledProjects: number;
      clientFeedback: number; // average rating
    };
    notes: string;
  };

  // Compliance Assessment (15% weight)
  complianceAssessment: {
    score: number; // 0-100
    weight: 0.15;
    criteria: {
      ndaCompliance: boolean;
      equipmentCompliance: boolean;
      clinicsTraining: boolean;
      safetyProtocols: number; // 0-100
    };
    certifications: {
      required: string[];
      completed: string[];
      pending: string[];
    };
    notes: string;
  };

  // Overall Results
  totalScore: number; // Weighted average
  tier: 'T1' | 'T2' | 'T3';
  recommendation: 'approve' | 'reject' | 'conditional_approve';
  conditions?: string[];
  
  // Metadata
  evaluatedBy: string;
  evaluatedAt: string;
  reviewNotes: string;
}

interface Creator {
  id: string;
  fullName: string;
  role: string;
  contact: {
    email: string;
    phone: string;
  };
  status: string;
  intakeForm?: unknown;
  evaluation?: AdminEvaluation;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CreatorEvaluationPage({ params }: PageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [creatorId, setCreatorId] = useState<string>('');

  // Resolve params Promise
  useEffect(() => {
    params.then(resolvedParams => {
      setCreatorId(resolvedParams.id);
    });
  }, [params]);

  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Evaluation form state
  const [evaluation, setEvaluation] = useState<AdminEvaluation>({
    qualityAssessment: {
      score: 0,
      weight: 0.40,
      criteria: {
        technicalSkill: 0,
        creativity: 0,
        consistency: 0,
        attentionToDetail: 0
      },
      portfolioReview: {
        overallRating: 0,
        bestSamples: [],
        improvementAreas: []
      },
      notes: ''
    },
    speedAssessment: {
      score: 0,
      weight: 0.25,
      criteria: {
        deliveryTime: 0,
        responsiveness: 0,
        efficiency: 0
      },
      slaPerformance: {
        standardSLA: 48,
        rushSLA: 24,
        averageDelivery: 0,
        onTimePercentage: 0
      },
      notes: ''
    },
    reliabilityAssessment: {
      score: 0,
      weight: 0.20,
      criteria: {
        punctuality: 0,
        communication: 0,
        professionalism: 0,
        consistency: 0
      },
      trackRecord: {
        completedProjects: 0,
        cancelledProjects: 0,
        clientFeedback: 0
      },
      notes: ''
    },
    complianceAssessment: {
      score: 0,
      weight: 0.15,
      criteria: {
        ndaCompliance: false,
        equipmentCompliance: false,
        clinicsTraining: false,
        safetyProtocols: 0
      },
      certifications: {
        required: ['NDA', 'Equipment Agreement'],
        completed: [],
        pending: []
      },
      notes: ''
    },
    totalScore: 0,
    tier: 'T1',
    recommendation: 'approve',
    conditions: [],
    evaluatedBy: session?.user?.email || '',
    evaluatedAt: new Date().toISOString(),
    reviewNotes: ''
  });

  const loadCreatorData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/creators/${creatorId}`);
      if (!response.ok) {
        throw new Error('فشل في تحميل بيانات المبدع');
      }
      
      const data = await response.json();
      setCreator(data.creator);
      
      // Load existing evaluation if available
      if (data.creator.evaluation) {
        setEvaluation(data.creator.evaluation);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في التحميل');
    } finally {
      setLoading(false);
    }
  }, [creatorId]);

  // Load creator data
  useEffect(() => {
    if (creatorId) {
      loadCreatorData();
    }
  }, [creatorId, loadCreatorData]);

  // Calculate scores automatically
  const calculateScores = useCallback(() => {
    // Calculate Quality Score (average of criteria)
    const qualityScore = Object.values(evaluation.qualityAssessment.criteria)
      .reduce((sum, score) => sum + score, 0) / 4;

    // Calculate Speed Score
    const speedScore = Object.values(evaluation.speedAssessment.criteria)
      .reduce((sum, score) => sum + score, 0) / 3;

    // Calculate Reliability Score
    const reliabilityScore = Object.values(evaluation.reliabilityAssessment.criteria)
      .reduce((sum, score) => sum + score, 0) / 4;

    // Calculate Compliance Score
    const complianceScore = (
      (evaluation.complianceAssessment.criteria.ndaCompliance ? 25 : 0) +
      (evaluation.complianceAssessment.criteria.equipmentCompliance ? 25 : 0) +
      (evaluation.complianceAssessment.criteria.clinicsTraining ? 25 : 0) +
      (evaluation.complianceAssessment.criteria.safetyProtocols * 0.25)
    );

    // Calculate weighted total score
    const totalScore = (
      qualityScore * 0.40 +
      speedScore * 0.25 +
      reliabilityScore * 0.20 +
      complianceScore * 0.15
    );

    // Determine tier
    let tier: 'T1' | 'T2' | 'T3' = 'T1';
    if (totalScore >= 90) tier = 'T3';
    else if (totalScore >= 75) tier = 'T2';

    // Update evaluation
    setEvaluation(prev => ({
      ...prev,
      qualityAssessment: { ...prev.qualityAssessment, score: qualityScore },
      speedAssessment: { ...prev.speedAssessment, score: speedScore },
      reliabilityAssessment: { ...prev.reliabilityAssessment, score: reliabilityScore },
      complianceAssessment: { ...prev.complianceAssessment, score: complianceScore },
      totalScore,
      tier
    }));
  }, [evaluation]);

  useEffect(() => {
    calculateScores();
  }, [
    evaluation.qualityAssessment.criteria,
    evaluation.speedAssessment.criteria,
    evaluation.reliabilityAssessment.criteria,
    evaluation.complianceAssessment.criteria,
    calculateScores
  ]);



  const handleSave = async (isDraft = true) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/admin/creators/${creatorId}/evaluate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluation,
          status: isDraft ? 'under_review' : 'evaluated',
          updateTier: !isDraft
        })
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ التقييم');
      }

      setSuccess(isDraft ? 'تم حفظ التقييم' : 'تم إكمال التقييم');

      if (!isDraft) {
        setTimeout(() => {
          router.push('/admin/creators');
        }, 2000);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const renderScoreInput = (
    value: number, 
    onChange: (value: number) => void, 
    label: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text)]">{label}</label>
        <span className="text-sm text-[var(--muted)]">{value}/100</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-[var(--elev)] rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-[var(--muted)]">
        <span>ضعيف</span>
        <span>متوسط</span>
        <span>ممتاز</span>
      </div>
    </div>
  );

  const renderStarRating = (
    value: number,
    onChange: (value: number) => void,
    label: string
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text)]">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`p-1 ${star <= value ? 'text-yellow-400' : 'text-[var(--muted)]'}`}
          >
            <Star size={20} fill={star <= value ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">جاري تحميل بيانات المبدع...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto text-[var(--danger)] mb-4" />
        <h3 className="text-lg font-medium text-[var(--text)] mb-2">المبدع غير موجود</h3>
        <Button onClick={() => router.push('/admin/creators')}>
          <ArrowLeft size={16} />
          العودة للقائمة
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <SectionHeading
        title={`تقييم المبدع: ${creator.fullName}`}
        description="تقييم شامل بناءً على الجودة والسرعة والموثوقية والامتثال"
        actions={
          <Button variant="secondary" onClick={() => router.push('/admin/creators')}>
            <ArrowLeft size={16} />
            العودة
          </Button>
        }
      />

      {/* Creator Info Card */}
      <div className="mb-6 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)]">{creator.fullName}</h3>
            <p className="text-[var(--muted)]">{creator.contact.email}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-[var(--muted)]">الدور</div>
            <div className="font-medium text-[var(--text)]">{creator.role}</div>
          </div>
        </div>
        
        {/* Current Score Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-[var(--bg)] rounded-[var(--radius)]">
            <div className="text-2xl font-bold text-[var(--text)]">{evaluation.totalScore.toFixed(1)}</div>
            <div className="text-xs text-[var(--muted)]">النقاط الإجمالية</div>
          </div>
          <div className="text-center p-3 bg-[var(--bg)] rounded-[var(--radius)]">
            <div className="text-2xl font-bold text-[var(--accent-500)]">{evaluation.tier}</div>
            <div className="text-xs text-[var(--muted)]">الدرجة</div>
          </div>
          <div className="text-center p-3 bg-[var(--bg)] rounded-[var(--radius)]">
            <div className="text-2xl font-bold text-green-600">{evaluation.qualityAssessment.score.toFixed(0)}</div>
            <div className="text-xs text-[var(--muted)]">الجودة (40%)</div>
          </div>
          <div className="text-center p-3 bg-[var(--bg)] rounded-[var(--radius)]">
            <div className="text-2xl font-bold text-blue-600">{evaluation.speedAssessment.score.toFixed(0)}</div>
            <div className="text-xs text-[var(--muted)]">السرعة (25%)</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-[var(--radius)]">
          <div className="flex items-center gap-2 text-[var(--danger-fg)]">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-[var(--success-bg)] border border-[var(--success-border)] rounded-[var(--radius)]">
          <div className="flex items-center gap-2 text-[var(--success-fg)]">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Evaluation Sections */}
      <div className="space-y-6">
        
        {/* 1. Quality Assessment (40%) */}
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Star className="text-yellow-500" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">تقييم الجودة</h3>
              <p className="text-sm text-[var(--muted)]">الوزن: 40% | النقاط: {evaluation.qualityAssessment.score.toFixed(1)}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {renderScoreInput(
                evaluation.qualityAssessment.criteria.technicalSkill,
                (value) => setEvaluation(prev => ({
                  ...prev,
                  qualityAssessment: {
                    ...prev.qualityAssessment,
                    criteria: { ...prev.qualityAssessment.criteria, technicalSkill: value }
                  }
                })),
                'المهارة التقنية'
              )}

              {renderScoreInput(
                evaluation.qualityAssessment.criteria.creativity,
                (value) => setEvaluation(prev => ({
                  ...prev,
                  qualityAssessment: {
                    ...prev.qualityAssessment,
                    criteria: { ...prev.qualityAssessment.criteria, creativity: value }
                  }
                })),
                'الإبداع والابتكار'
              )}
            </div>

            <div className="space-y-4">
              {renderScoreInput(
                evaluation.qualityAssessment.criteria.consistency,
                (value) => setEvaluation(prev => ({
                  ...prev,
                  qualityAssessment: {
                    ...prev.qualityAssessment,
                    criteria: { ...prev.qualityAssessment.criteria, consistency: value }
                  }
                })),
                'الثبات في الجودة'
              )}

              {renderScoreInput(
                evaluation.qualityAssessment.criteria.attentionToDetail,
                (value) => setEvaluation(prev => ({
                  ...prev,
                  qualityAssessment: {
                    ...prev.qualityAssessment,
                    criteria: { ...prev.qualityAssessment.criteria, attentionToDetail: value }
                  }
                })),
                'الاهتمام بالتفاصيل'
              )}
            </div>
          </div>

          <div className="mt-6">
            {renderStarRating(
              evaluation.qualityAssessment.portfolioReview.overallRating,
              (value) => setEvaluation(prev => ({
                ...prev,
                qualityAssessment: {
                  ...prev.qualityAssessment,
                  portfolioReview: { ...prev.qualityAssessment.portfolioReview, overallRating: value }
                }
              })),
              'تقييم المعرض العام'
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[var(--text)] mb-2">ملاحظات الجودة</label>
            <textarea
              value={evaluation.qualityAssessment.notes}
              onChange={(e) => setEvaluation(prev => ({
                ...prev,
                qualityAssessment: { ...prev.qualityAssessment, notes: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
              rows={3}
              placeholder="اكتب ملاحظاتك حول جودة أعمال المبدع..."
            />
          </div>
        </div>

        {/* 2. Speed Assessment (25%) */}
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-blue-500" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">تقييم السرعة</h3>
              <p className="text-sm text-[var(--muted)]">الوزن: 25% | النقاط: {evaluation.speedAssessment.score.toFixed(1)}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderScoreInput(
              evaluation.speedAssessment.criteria.deliveryTime,
              (value) => setEvaluation(prev => ({
                ...prev,
                speedAssessment: {
                  ...prev.speedAssessment,
                  criteria: { ...prev.speedAssessment.criteria, deliveryTime: value }
                }
              })),
              'سرعة التسليم'
            )}

            {renderScoreInput(
              evaluation.speedAssessment.criteria.responsiveness,
              (value) => setEvaluation(prev => ({
                ...prev,
                speedAssessment: {
                  ...prev.speedAssessment,
                  criteria: { ...prev.speedAssessment.criteria, responsiveness: value }
                }
              })),
              'سرعة الاستجابة'
            )}

            {renderScoreInput(
              evaluation.speedAssessment.criteria.efficiency,
              (value) => setEvaluation(prev => ({
                ...prev,
                speedAssessment: {
                  ...prev.speedAssessment,
                  criteria: { ...prev.speedAssessment.criteria, efficiency: value }
                }
              })),
              'الكفاءة في العمل'
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[var(--text)] mb-2">ملاحظات السرعة</label>
            <textarea
              value={evaluation.speedAssessment.notes}
              onChange={(e) => setEvaluation(prev => ({
                ...prev,
                speedAssessment: { ...prev.speedAssessment, notes: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
              rows={2}
              placeholder="ملاحظات حول الالتزام بالمواعيد والسرعة..."
            />
          </div>
        </div>

        {/* 3. Reliability Assessment (20%) */}
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-green-500" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">تقييم الموثوقية</h3>
              <p className="text-sm text-[var(--muted)]">الوزن: 20% | النقاط: {evaluation.reliabilityAssessment.score.toFixed(1)}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {renderScoreInput(
                evaluation.reliabilityAssessment.criteria.punctuality,
                (value) => setEvaluation(prev => ({
                  ...prev,
                  reliabilityAssessment: {
                    ...prev.reliabilityAssessment,
                    criteria: { ...prev.reliabilityAssessment.criteria, punctuality: value }
                  }
                })),
                'الالتزام بالمواعيد'
              )}

              {renderScoreInput(
                evaluation.reliabilityAssessment.criteria.communication,
                (value) => setEvaluation(prev => ({
                  ...prev,
                  reliabilityAssessment: {
                    ...prev.reliabilityAssessment,
                    criteria: { ...prev.reliabilityAssessment.criteria, communication: value }
                  }
                })),
                'جودة التواصل'
              )}
            </div>

            <div className="space-y-4">
              {renderScoreInput(
                evaluation.reliabilityAssessment.criteria.professionalism,
                (value) => setEvaluation(prev => ({
                  ...prev,
                  reliabilityAssessment: {
                    ...prev.reliabilityAssessment,
                    criteria: { ...prev.reliabilityAssessment.criteria, professionalism: value }
                  }
                })),
                'الاحترافية'
              )}

              {renderScoreInput(
                evaluation.reliabilityAssessment.criteria.consistency,
                (value) => setEvaluation(prev => ({
                  ...prev,
                  reliabilityAssessment: {
                    ...prev.reliabilityAssessment,
                    criteria: { ...prev.reliabilityAssessment.criteria, consistency: value }
                  }
                })),
                'ثبات الأداء'
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[var(--text)] mb-2">ملاحظات الموثوقية</label>
            <textarea
              value={evaluation.reliabilityAssessment.notes}
              onChange={(e) => setEvaluation(prev => ({
                ...prev,
                reliabilityAssessment: { ...prev.reliabilityAssessment, notes: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
              rows={2}
              placeholder="ملاحظات حول موثوقية المبدع والتزامه..."
            />
          </div>
        </div>

        {/* 4. Compliance Assessment (15%) */}
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="text-purple-500" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">تقييم الامتثال</h3>
              <p className="text-sm text-[var(--muted)]">الوزن: 15% | النقاط: {evaluation.complianceAssessment.score.toFixed(1)}/100</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ndaCompliance"
                  checked={evaluation.complianceAssessment.criteria.ndaCompliance}
                  onChange={(e) => setEvaluation(prev => ({
                    ...prev,
                    complianceAssessment: {
                      ...prev.complianceAssessment,
                      criteria: { ...prev.complianceAssessment.criteria, ndaCompliance: e.target.checked }
                    }
                  }))}
                  className="w-4 h-4 text-[var(--accent-500)]"
                />
                <label htmlFor="ndaCompliance" className="text-sm text-[var(--text)]">
                  التزام باتفاقية عدم الإفشاء
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="equipmentCompliance"
                  checked={evaluation.complianceAssessment.criteria.equipmentCompliance}
                  onChange={(e) => setEvaluation(prev => ({
                    ...prev,
                    complianceAssessment: {
                      ...prev.complianceAssessment,
                      criteria: { ...prev.complianceAssessment.criteria, equipmentCompliance: e.target.checked }
                    }
                  }))}
                  className="w-4 h-4 text-[var(--accent-500)]"
                />
                <label htmlFor="equipmentCompliance" className="text-sm text-[var(--text)]">
                  التزام باتفاقية المعدات
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="clinicsTraining"
                  checked={evaluation.complianceAssessment.criteria.clinicsTraining}
                  onChange={(e) => setEvaluation(prev => ({
                    ...prev,
                    complianceAssessment: {
                      ...prev.complianceAssessment,
                      criteria: { ...prev.complianceAssessment.criteria, clinicsTraining: e.target.checked }
                    }
                  }))}
                  className="w-4 h-4 text-[var(--accent-500)]"
                />
                <label htmlFor="clinicsTraining" className="text-sm text-[var(--text)]">
                  إكمال تدريب العيادات
                </label>
              </div>
            </div>

            <div>
              {renderScoreInput(
                evaluation.complianceAssessment.criteria.safetyProtocols,
                (value) => setEvaluation(prev => ({
                  ...prev,
                  complianceAssessment: {
                    ...prev.complianceAssessment,
                    criteria: { ...prev.complianceAssessment.criteria, safetyProtocols: value }
                  }
                })),
                'بروتوكولات السلامة'
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[var(--text)] mb-2">ملاحظات الامتثال</label>
            <textarea
              value={evaluation.complianceAssessment.notes}
              onChange={(e) => setEvaluation(prev => ({
                ...prev,
                complianceAssessment: { ...prev.complianceAssessment, notes: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
              rows={2}
              placeholder="ملاحظات حول التزام المبدع بالقوانين والبروتوكولات..."
            />
          </div>
        </div>

        {/* Final Review */}
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-[var(--accent-500)]" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">المراجعة النهائية</h3>
              <p className="text-sm text-[var(--muted)]">النقاط الإجمالية: {evaluation.totalScore.toFixed(1)}/100 | الدرجة: {evaluation.tier}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">التوصية</label>
              <Dropdown
                value={evaluation.recommendation}
                onChange={(v) => setEvaluation(prev => ({ ...prev, recommendation: v as 'approve' | 'reject' | 'conditional_approve' }))}
                options={[
                  { value: 'approve', label: 'الموافقة' },
                  { value: 'conditional_approve', label: 'الموافقة المشروطة' },
                  { value: 'reject', label: 'الرفض' },
                ]}
                placeholder="اختر التوصية"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2">ملاحظات المراجعة</label>
              <textarea
                value={evaluation.reviewNotes}
                onChange={(e) => setEvaluation(prev => ({ ...prev, reviewNotes: e.target.value }))}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] text-[var(--text)]"
                rows={4}
                placeholder="اكتب ملاحظاتك النهائية وأي توصيات إضافية..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--elev)]">
        <Button variant="secondary" onClick={() => router.push('/admin/creators')}>
          <ArrowLeft size={16} />
          العودة للقائمة
        </Button>

        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'جاري الحفظ...' : 'حفظ مسودة'}
          </Button>
          
          <Button 
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Send size={16} />
            {saving ? 'جاري الحفظ...' : 'إكمال التقييم'}
          </Button>
        </div>
      </div>
    </div>
  );
}
