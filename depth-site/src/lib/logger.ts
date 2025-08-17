// Logger utility لإدارة console statements بذكاء
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogData = string | number | boolean | object | null | undefined;

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === 'true';

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment && level === 'debug') return false;
    if (!this.isDevelopment && level === 'info' && !this.isDebugEnabled) return false;
    return true;
  }

  private formatMessage(prefix: string | undefined, message: string): string {
    const timestamp = new Date().toLocaleTimeString();
    const prefixStr = prefix ? `[${prefix}]` : '';
    return `${timestamp} ${prefixStr} ${message}`;
  }

  debug(message: string, data?: LogData, prefix?: string): void {
    if (!this.shouldLog('debug')) return;
    console.log(this.formatMessage(prefix, message), data || '');
  }

  info(message: string, data?: LogData, prefix?: string): void {
    if (!this.shouldLog('info')) return;
    console.info(this.formatMessage(prefix, message), data || '');
  }

  warn(message: string, data?: LogData, prefix?: string): void {
    if (!this.shouldLog('warn')) return;
    console.warn(this.formatMessage(prefix, message), data || '');
  }

  error(message: string, error?: Error | string | unknown, prefix?: string): void {
    if (!this.shouldLog('error')) return;
    console.error(this.formatMessage(prefix, message), error || '');
  }

  // Utility methods لحالات شائعة
  apiError(endpoint: string, error: Error | string | unknown): void {
    this.error(`API Error in ${endpoint}`, error, 'API');
  }

  authError(action: string, error: Error | string | unknown): void {
    this.error(`Auth Error during ${action}`, error, 'AUTH');
  }

  onboardingDebug(step: string, data?: LogData): void {
    this.debug(`Onboarding - ${step}`, data, 'ONBOARDING');
  }

  validationError(field: string, message: string): void {
    this.warn(`Validation failed for ${field}: ${message}`, undefined, 'VALIDATION');
  }
}

// singleton instance
export const logger = new Logger();

// Legacy console replacement helpers
export const devLog = (message: string, data?: LogData) => logger.debug(message, data);
export const devError = (message: string, error?: Error | string | unknown) => logger.error(message, error);
export const devWarn = (message: string, data?: LogData) => logger.warn(message, data);
