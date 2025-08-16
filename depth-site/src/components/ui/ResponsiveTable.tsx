"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Table, Grid3x3 } from "lucide-react";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  renderCard?: (item: T, index: number) => React.ReactNode;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  showViewToggle?: boolean;
  defaultView?: 'table' | 'cards';
}

export default function ResponsiveTable<T extends { id: string | number }>({
  data,
  columns,
  renderCard,
  className = "",
  loading = false,
  emptyMessage = "لا توجد بيانات",
  showViewToggle = true,
  defaultView = 'table'
}: ResponsiveTableProps<T>) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(defaultView);

  if (loading) {
    return (
      <div className={`bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-500)] mx-auto mb-4"></div>
          <p className="text-[var(--muted)]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] ${className}`}>
        <div className="p-8 text-center">
          <p className="text-[var(--muted)]">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden ${className}`}>
      {/* أزرار التبديل للشاشات الصغيرة */}
      {showViewToggle && renderCard && (
        <div className="flex items-center justify-between p-4 border-b border-[var(--elev)] lg:hidden">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={viewMode === 'table' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('table')}
            >
              <Table size={16} />
              جدول
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'cards' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('cards')}
            >
              <Grid3x3 size={16} />
              بطاقات
            </Button>
          </div>
        </div>
      )}

      {/* عرض الجدول للشاشات الكبيرة أو عند اختيار وضع الجدول */}
      <div className={`
        ${renderCard && viewMode === 'cards' ? 'hidden lg:block' : 'block'}
      `}>
        <div className="scroll-xy">
          <table className="w-full">
            <thead className="bg-[var(--elev)]">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`text-right p-4 font-medium text-[var(--text)] ${
                      column.hideOnMobile ? 'hidden md:table-cell' : ''
                    } ${column.className || ''}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t border-[var(--elev)] hover:bg-[var(--bg)] transition-colors">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`p-4 text-[var(--text)] ${
                        column.hideOnMobile ? 'hidden md:table-cell' : ''
                      } ${column.className || ''}`}
                    >
                      {column.render ? column.render(item) : String(item[column.key] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* عرض البطاقات للشاشات الصغيرة */}
      {renderCard && (
        <div className={`
          ${viewMode === 'cards' ? 'block lg:hidden' : 'hidden'}
        `}>
                  <div className="divide-y divide-[var(--elev)]">
          {data.map((item) => renderCard(item, 0))}
        </div>
        </div>
      )}
    </div>
  );
}

// مكون بطاقة افتراضية
export const DefaultCard = <T extends Record<string, unknown>>({ 
  title, 
  subtitle, 
  actions,
  fields 
}: {
  item: T;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  fields: { label: string; value: string | React.ReactNode }[];
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium text-[var(--text)]">{title}</h4>
          {subtitle && (
            <p className="text-sm text-[var(--muted)] mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-[var(--muted)]">{field.label}:</span>
            <span className="text-sm font-medium text-[var(--text)]">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
