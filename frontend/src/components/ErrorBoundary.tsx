'use client';

import React from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

const DefaultFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <div className={styles.errorContainer}>
    <h2 className={styles.errorTitle}>
      حدث خطأ غير متوقع 😞
    </h2>
    <p className={styles.errorMessage}>
      نعتذر، حدثت مشكلة في التطبيق. الرجاء المحاولة مرة أخرى.
    </p>
    {process.env.NODE_ENV === 'development' && error && (
      <details className={styles.errorDetails}>
        <summary className={styles.errorSummary}>
          تفاصيل الخطأ (Development)
        </summary>
        <pre className={styles.errorStack}>
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      </details>
    )}
    <button
      onClick={resetError}
      className={styles.retryButton}
    >
      إعادة المحاولة
    </button>
  </div>
);

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
      console.error('Error caught by boundary:', error, errorInfo);
    } else {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
