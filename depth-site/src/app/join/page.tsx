"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { 
  Users, 
  Camera, 
  ArrowRight, 
  CheckCircle,
  Star,
  Briefcase,
  TrendingUp,
  Award
} from "lucide-react";

interface JoinCardProps {
  title: string;
  description: string;
  features: string[];
  href: string;
  icon: React.ReactNode;
  gradient: string;
  badge?: string;
}

function JoinCard({ title, description, features, href, icon, gradient, badge }: JoinCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className={`absolute inset-0 ${gradient} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] hover:border-[var(--accent-300)] transition-all duration-300 hover:shadow-lg">
        {badge && (
          <div className="absolute -top-3 -right-3 bg-[var(--accent-500)] text-white px-3 py-1 rounded-full text-xs font-medium">
            {badge}
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 ${gradient} bg-opacity-10 rounded-xl flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-2">{title}</h2>
            <p className="text-[var(--muted)] text-sm">{description}</p>
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-[var(--text)]">
              <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Link href={href} className="block">
          <Button className="w-full group-hover:scale-105 transition-transform">
            ابدأ الآن
            <ArrowRight size={16} className="mr-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            انضم إلى Depth Agency
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-8">
            اختر نوع العضوية المناسب لك وابدأ رحلتك معنا في عالم الإبداع والتميز
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              <span>أكثر من 500+ عميل سعيد</span>
            </div>
            <div className="w-1 h-1 bg-[var(--muted)] rounded-full" />
            <div className="flex items-center gap-2">
              <Award size={16} className="text-blue-500" />
              <span>100+ مبدع محترف</span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <JoinCard
            title="انضم كعميل"
            description="احصل على خدمات التصوير والتصميم الاحترافية"
            features={[
              "مشاريع متعددة ومتنوعة",
              "فريق متخصص ومحترف",
              "تسليم سريع وفي الوقت المحدد",
              "ضمان الجودة والتميز",
              "دعم فني على مدار الساعة",
              "أسعار تنافسية ومرونة في الدفع"
            ]}
            href="/join/client"
            icon={<Users size={32} className="text-blue-600" />}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            badge="الأكثر شعبية"
          />

          <JoinCard
            title="انضم كمبدع"
            description="شارك مهاراتك واحصل على فرص عمل مميزة"
            features={[
              "دخل إضافي مستقر ومجزي",
              "مشاريع متنوعة وممتعة",
              "نمو مهني وتطوير المهارات",
              "شبكة احترافية واسعة",
              "مرونة في أوقات العمل",
              "دعم وتدريب مستمر"
            ]}
            href="/join/creator"
            icon={<Camera size={32} className="text-purple-600" />}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-[var(--text)] mb-4">
              لديك حساب بالفعل؟
            </h3>
            <p className="text-[var(--muted)] mb-6">
              سجل دخولك للوصول إلى بوابتك والاستمتاع بخدماتنا
            </p>
            <Link href="/auth/signin">
              <Button variant="secondary" className="px-8">
                <Briefcase size={16} className="ml-2" />
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* إحصائيات سريعة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--accent-500)] mb-2">500+</div>
            <div className="text-sm text-[var(--muted)]">عميل سعيد</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--accent-500)] mb-2">100+</div>
            <div className="text-sm text-[var(--muted)]">مبدع محترف</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--accent-500)] mb-2">1000+</div>
            <div className="text-sm text-[var(--muted)]">مشروع مكتمل</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--accent-500)] mb-2">99%</div>
            <div className="text-sm text-[var(--muted)]">رضا العملاء</div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
