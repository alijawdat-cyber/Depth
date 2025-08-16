"use client";

// مكون ErrorBoundary محسن لالتقاط ومعالجة الأخطاء
// الغرض: عرض رسائل خطأ مفيدة وإتاحة استرداد التطبيق

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/admin';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius-lg)] p-8">
              <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
              
              <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
                حدث خطأ غير متوقع
              </h2>
              
              <p className="text-[var(--muted)] mb-6">
                عذراً، حدث خطأ في التطبيق. يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
              </p>

              {/* Error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-6 p-4 bg-gray-100 rounded border text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    <Bug size={16} className="inline mr-2" />
                    تفاصيل الخطأ (وضع التطوير)
                  </summary>
                  <pre className="text-red-600 text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={this.handleRetry}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  إعادة المحاولة
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Home size={16} />
                  العودة للرئيسية
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook لمعالجة الأخطاء في المكونات الوظيفية
export function useErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    
    // يمكن إضافة تسجيل الأخطاء هنا
    // مثل Sentry أو LogRocket
  };

  return { handleError };
}

// مكون مبسط لعرض رسائل الخطأ
interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onClose?: () => void;
  variant?: 'error' | 'warning';
  className?: string;
}

export function ErrorMessage({
  title = 'حدث خطأ',
  message,
  onRetry,
  onClose,
  variant = 'error',
  className = ''
}: ErrorMessageProps) {
  const isError = variant === 'error';
  
  return (
    <div className={`p-4 rounded-lg border ${
      isError 
        ? 'bg-red-50 border-red-200 text-red-800' 
        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
    } ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle 
          size={20} 
          className={`flex-shrink-0 mt-0.5 ${
            isError ? 'text-red-500' : 'text-yellow-500'
          }`} 
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-1">{title}</h4>
          <p className="text-sm">{message}</p>
        </div>

        <div className="flex gap-2">
          {onRetry && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRetry}
              className="flex items-center gap-1"
            >
              <RefreshCw size={14} />
              إعادة
            </Button>
          )}
          
          {onClose && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              إغلاق
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
