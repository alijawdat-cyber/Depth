"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { TeamMember } from "@/data/team";

// أفاتار بسيط وأنيق
function SimpleAvatar({ name, size = 80 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ألوان بسيطة وهادئة
  const colors = [
    "bg-[var(--accent-500)]",
    "bg-blue-500", 
    "bg-emerald-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-teal-500",
  ];
  
  const colorIndex = name.length % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div 
      className={`flex items-center justify-center ${bgColor} text-white font-semibold rounded-full shadow-sm`}
      style={{ width: size, height: size, fontSize: size / 4 }}
    >
      {initials}
    </div>
  );
}

export default function TeamCard({ m, index }: { m: TeamMember; index: number }) {
  const reduce = useReducedMotion();
  const isPlaceholder = !m.photo || m.photo === "/window.svg";

  return (
    <motion.article
      className="bg-white dark:bg-[var(--card)] rounded-[var(--radius)] border border-[var(--elev)] p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={reduce ? undefined : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* صورة الملف الشخصي */}
      <div className="flex justify-center mb-4">
        {isPlaceholder ? (
          <SimpleAvatar name={m.name} size={80} />
        ) : (
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={m.photo}
              alt={m.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}
      </div>

      {/* معلومات العضو */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-1">
          {m.name}
        </h3>
        
        <p className="text-sm text-[var(--accent-500)] font-medium mb-3">
          {m.roleAr}
        </p>

        <p className="text-sm text-[var(--slate-600)] leading-relaxed mb-4" dir="rtl">
          {m.quoteAr}
        </p>

        {/* الروابط */}
        {m.links?.length ? (
          <div className="flex flex-wrap justify-center gap-2">
            {m.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 rounded-full border border-[var(--elev)] text-[var(--slate-600)] hover:border-[var(--accent-500)] hover:text-[var(--accent-500)] transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}


