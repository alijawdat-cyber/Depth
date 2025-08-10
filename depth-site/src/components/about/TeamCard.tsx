"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { TeamMember } from "@/data/team";

// أفاتار احترافي بألوان متدرجة
function ProfessionalAvatar({ name, size = 120 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ألوان متدرجة مختلفة حسب الاسم
  const gradients = [
    "from-blue-500 via-purple-500 to-indigo-600",
    "from-emerald-500 via-teal-500 to-cyan-600", 
    "from-orange-500 via-red-500 to-pink-600",
    "from-violet-500 via-purple-500 to-fuchsia-600",
    "from-amber-500 via-orange-500 to-red-600",
    "from-teal-500 via-emerald-500 to-green-600",
  ];
  
  const gradientIndex = name.length % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <div 
      className={`relative flex items-center justify-center bg-gradient-to-br ${gradient} text-white font-bold text-xl shadow-lg`}
      style={{ width: size, height: size, borderRadius: '50%' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
      <span className="relative z-10 drop-shadow-sm">{initials}</span>
      
      {/* تأثير الإضاءة */}
      <div className="absolute top-1 left-1 w-6 h-6 bg-white/30 rounded-full blur-sm" />
    </div>
  );
}

export default function TeamCard({ m, index }: { m: TeamMember; index: number }) {
  const reduce = useReducedMotion();
  const fromLeft = index % 2 === 0;
  const isPlaceholder = !m.photo || m.photo === "/window.svg";

  return (
    <motion.article
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent backdrop-blur-xl 
                 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                 hover:border-[var(--accent-500)]/30 transition-all duration-500"
      initial={
        reduce
          ? undefined
          : { opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }
      }
      whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      whileHover={reduce ? undefined : { y: -8, scale: 1.02 }}
    >
      {/* خلفية متدرجة ديناميكية */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-500)]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* شريط علوي ملون */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-500)] via-purple-500 to-blue-500" />

      <div className="relative p-6">
        {/* صورة الملف الشخصي */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="relative"
            whileHover={reduce ? undefined : { scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isPlaceholder ? (
              <ProfessionalAvatar name={m.name} size={120} />
            ) : (
              <div className="relative w-30 h-30 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                {/* تأثير لمعان */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
              </div>
            )}
            
            {/* نقطة متصل */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full shadow-lg">
              <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* معلومات العضو */}
        <div className="text-center space-y-3">
          <motion.h3 
            className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {m.name}
          </motion.h3>
          
          <motion.div 
            className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[var(--accent-500)]/10 to-purple-500/10 border border-[var(--accent-500)]/20"
            initial={reduce ? undefined : { opacity: 0, scale: 0.8 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sm font-medium text-[var(--accent-500)]">
              {m.roleAr}
            </span>
          </motion.div>

          <motion.p
            className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 px-2"
            dir="rtl"
            initial={reduce ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {m.quoteAr}
          </motion.p>

          {/* الروابط */}
          {m.links?.length ? (
            <motion.div 
              className="flex flex-wrap justify-center gap-2 pt-2"
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {m.links.map((l, linkIndex) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link relative px-4 py-2 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-700 
                           hover:border-[var(--accent-500)] hover:text-[var(--accent-500)] transition-all duration-300
                           hover:shadow-lg hover:shadow-[var(--accent-500)]/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{l.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-500)]/10 to-purple-500/10 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                </motion.a>
              ))}
            </motion.div>
          ) : null}
        </div>

        {/* تأثيرات إضافية */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-[var(--accent-500)]/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
    </motion.article>
  );
}


