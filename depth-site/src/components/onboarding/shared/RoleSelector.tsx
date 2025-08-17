// Component مشترك لاختيار التخصص مع تصميم احترافي
'use client';

import { motion } from 'framer-motion';
import { Camera, Video, Palette, Settings, Check, AlertCircle } from 'lucide-react';
import type { CreatorRole } from '@/types/onboarding';

interface RoleSelectorProps {
  value: CreatorRole;
  onChange: (role: CreatorRole) => void;
  error?: string;
  disabled?: boolean;
}

const ROLES = [
  {
    id: 'photographer' as CreatorRole,
    title: 'مصور فوتوغرافي',
    description: 'التصوير الاحترافي للمنتجات والأشخاص والفعاليات',
    icon: Camera,
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  {
    id: 'videographer' as CreatorRole,
    title: 'مصور فيديو',
    description: 'إنتاج الفيديوهات والريلز والمحتوى المرئي',
    icon: Video,
    gradient: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700'
  },
  {
    id: 'designer' as CreatorRole,
    title: 'مصمم جرافيكي',
    description: 'التصميم الإبداعي والهوية البصرية والإعلانات',
    icon: Palette,
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  {
    id: 'producer' as CreatorRole,
    title: 'منتج محتوى',
    description: 'إدارة وتنسيق المشاريع الإبداعية والإنتاج',
    icon: Settings,
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  }
];

export default function RoleSelector({ value, onChange, error, disabled }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {ROLES.map((role, index) => {
          const isSelected = value === role.id;
          const Icon = role.icon;
          
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-pointer transition-all duration-200 ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={() => !disabled && onChange(role.id)}
            >
              <div className={`
                relative p-6 rounded-2xl border-2 transition-all duration-200
                ${isSelected 
                  ? `${role.borderColor} ${role.bgColor} shadow-lg ring-4 ring-${role.gradient.split('-')[1]}-100` 
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent-300)] hover:shadow-md'
                }
              `}>
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check size={14} className="text-white" />
                  </motion.div>
                )}

                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all
                  ${isSelected 
                    ? `bg-gradient-to-br ${role.gradient} text-white shadow-lg` 
                    : 'bg-[var(--bg-alt)] text-[var(--muted)]'
                  }
                `}>
                  <Icon size={28} />
                </div>

                {/* Content */}
                <div>
                  <h3 className={`text-lg font-bold mb-2 transition-colors ${
                    isSelected ? role.textColor : 'text-[var(--text)]'
                  }`}>
                    {role.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    isSelected ? role.textColor : 'text-[var(--muted)]'
                  }`}>
                    {role.description}
                  </p>
                </div>

                {/* Radio Button */}
                <div className="absolute top-4 left-4">
                  <div className={`
                    w-5 h-5 rounded-full border-2 transition-all
                    ${isSelected 
                      ? 'border-current bg-current' 
                      : 'border-[var(--border)]'
                    }
                  `}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-full h-full rounded-full bg-white scale-50"
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </p>
        </motion.div>
      )}

      {/* Help Text */}
      <div className="bg-[var(--accent-bg)] border border-[var(--accent-border)] rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[var(--accent-500)] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">💡</span>
          </div>
          <div className="text-sm text-[var(--accent-fg)]">
            <p className="font-medium mb-2">نصائح لاختيار التخصص:</p>
            <ul className="space-y-1 text-xs">
              <li>• يمكنك تغيير التخصص لاحقاً من لوحة التحكم</li>
              <li>• اختر التخصص الذي تتقنه أكثر</li>
              <li>• يمكن العمل في مجالات متعددة بعد الموافقة</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
