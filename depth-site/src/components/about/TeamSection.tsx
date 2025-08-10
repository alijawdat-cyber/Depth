"use client";
import { TEAM } from "@/data/team";
import TeamCard from "./TeamCard";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

function AnimatedBackground() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.2]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* خلفية متدرجة ديناميكية */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[var(--accent-500)]/5 via-purple-500/5 to-blue-500/5"
        style={{ opacity }}
      />
      
      {/* أشكال هندسية متحركة */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-[var(--accent-500)]/10 to-purple-500/10 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
      />
      
      {/* شبكة نقاط خفيفة */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
        <defs>
          <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="0.5" fill="currentColor" className="text-[var(--accent-500)]" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}

// مكون إحصائيات الفريق
function TeamStats() {
  const reduce = useReducedMotion();
  
  const stats = [
    { number: TEAM.length, label: "أعضاء الفريق" },
    { number: "5+", label: "سنوات خبرة" },
    { number: "50+", label: "مشروع مكتمل" },
    { number: "24/7", label: "دعم متواصل" },
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
      initial={reduce ? undefined : { opacity: 0, y: 30 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          initial={reduce ? undefined : { opacity: 0, scale: 0.8 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="text-2xl md:text-3xl font-bold text-[var(--accent-500)] mb-1">
            {stat.number}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function TeamSection() {
  const reduce = useReducedMotion();
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: reduce ? 0 : 0.1 },
    },
  } as const;

  // تجميع الفريق: المؤسس منفصل عن الباقي
  const founder = TEAM.find(member => member.id === "ali");
  const teamMembers = TEAM.filter(member => member.id !== "ali");

  return (
    <section 
      aria-labelledby="team-title" 
      className="relative py-20 md:py-32 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 dark:from-gray-900/50 dark:via-gray-900 dark:to-blue-950/30"
    >
      <AnimatedBackground />
      
      <Container>
        {/* عنوان القسم المحسن */}
        <motion.div 
          className="text-center mb-16"
          initial={reduce ? undefined : { opacity: 0, y: 40 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-medium text-[var(--accent-500)]">تعرف على فريقنا</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-[var(--accent-500)] to-purple-600 dark:from-white dark:via-[var(--accent-300)] dark:to-purple-400 bg-clip-text text-transparent">
            الفريق المبدع
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" dir="rtl">
            مجموعة من المبدعين والمختصين نعمل معاً لتحويل أفكارك إلى محتوى يحقق النتائج
          </p>
        </motion.div>

        {/* إحصائيات الفريق */}
        <TeamStats />

        {/* بطاقة المؤسس المميزة */}
        {founder && (
          <motion.div 
            className="mb-16"
            initial={reduce ? undefined : { opacity: 0, y: 40 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">المؤسس</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--accent-500)] to-purple-500 mx-auto rounded-full" />
            </div>
            
            <div className="max-w-2xl mx-auto">
              <TeamCard m={founder} index={0} />
            </div>
          </motion.div>
        )}

        {/* باقي أعضاء الفريق */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">أعضاء الفريق</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TeamCard m={member} index={index + 1} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* رسالة ختامية */}
        <motion.div 
          className="text-center mt-20"
          initial={reduce ? undefined : { opacity: 0, y: 30 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-[var(--accent-500)]/10 via-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-white/20 backdrop-blur-sm">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4" dir="rtl">
              نحن لسنا مجرد فريق عمل، بل شركاء في رحلة نجاحك
            </p>
            <div className="flex justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-[var(--accent-500)] via-purple-500 to-blue-500 rounded-full" />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}


