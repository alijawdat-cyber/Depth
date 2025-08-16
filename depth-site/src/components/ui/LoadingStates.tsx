"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className = "",
  color = "var(--accent-500)" 
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <Loader2 
      size={sizeMap[size]} 
      className={`animate-spin ${className}`}
      style={{ color }}
    />
  );
}

interface LoadingCardProps {
  className?: string;
  showPulse?: boolean;
}

export function LoadingCard({ className = "", showPulse = true }: LoadingCardProps) {
  return (
    <div className={`bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6 ${className}`}>
      <div className={`space-y-4 ${showPulse ? 'animate-pulse' : ''}`}>
        <div className="h-4 bg-[var(--elev)] rounded w-3/4"></div>
        <div className="h-3 bg-[var(--elev)] rounded w-1/2"></div>
        <div className="h-3 bg-[var(--elev)] rounded w-2/3"></div>
      </div>
    </div>
  );
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function LoadingTable({ 
  rows = 5, 
  columns = 4, 
  className = "" 
}: LoadingTableProps) {
  return (
    <div className={`bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-[var(--elev)] p-4">
        <div className="flex gap-4 animate-pulse">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-[var(--bg)] rounded flex-1"></div>
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-[var(--elev)]">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="flex gap-4 animate-pulse">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-3 bg-[var(--elev)] rounded flex-1"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LoadingPageProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  className?: string;
}

export function LoadingPage({ 
  title = "جاري التحميل...", 
  description = "يرجى الانتظار",
  showBackButton = false,
  className = "" 
}: LoadingPageProps) {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div>
          <h3 className="text-lg font-medium text-[var(--text)]">{title}</h3>
          <p className="text-[var(--muted)] mt-1">{description}</p>
        </div>
        {showBackButton && (
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            العودة
          </button>
        )}
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({ 
  className = "", 
  width = "100%", 
  height = "1rem",
  rounded = true 
}: SkeletonProps) {
  return (
    <div 
      className={`bg-[var(--elev)] animate-pulse ${rounded ? 'rounded' : ''} ${className}`}
      style={{ width, height }}
    />
  );
}

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function LoadingButton({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = "",
  onClick
}: LoadingButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)] focus:ring-[var(--accent-500)]",
    secondary: "bg-[var(--card)] text-[var(--text)] border border-[var(--elev)] hover:bg-[var(--elev)] focus:ring-[var(--accent-500)]",
    ghost: "text-[var(--text)] hover:bg-[var(--elev)] focus:ring-[var(--accent-500)]"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-[var(--radius)]",
    md: "px-4 py-2 text-sm rounded-[var(--radius)]",
    lg: "px-6 py-3 text-base rounded-[var(--radius-lg)]"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}

// مكونات تحميل متخصصة للصفحات المختلفة

export function LoadingDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
      
      {/* Chart Area */}
      <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[var(--elev)] rounded w-1/4"></div>
          <div className="h-64 bg-[var(--elev)] rounded"></div>
        </div>
      </div>
      
      {/* Table */}
      <LoadingTable />
    </div>
  );
}

export function LoadingCreators() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function LoadingRateCard() {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 animate-pulse">
        <div className="h-10 bg-[var(--elev)] rounded flex-1 max-w-xs"></div>
        <div className="h-10 bg-[var(--elev)] rounded w-32"></div>
      </div>
      
      {/* Table */}
      <LoadingTable rows={10} columns={6} />
    </div>
  );
}
