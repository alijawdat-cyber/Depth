import { useState, useEffect } from 'react';
import { UserRole } from '../data/types';

// بيانات وهمية للمستخدم الحالي
const mockUser = {
  id: 'admin-001',
  name: 'محمد أحمد الإداري',
  email: 'admin@depthagency.com',
  role: 'admin' as UserRole
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthContextValue {
  user: User | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

/**
 * Hook لإدارة المصادقة وحالة المستخدم
 */
export function useAuth(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحقق من المصادقة عند تحميل التطبيق
    const initAuth = async () => {
      try {
        // في التطبيق الحقيقي، سيتم التحقق من token أو session
        const token = localStorage.getItem('auth_token');
        if (token) {
          // محاكاة طلب للخادم للحصول على بيانات المستخدم
          await new Promise(resolve => setTimeout(resolve, 500));
          setUser(mockUser);
        }
      } catch (error) {
        console.error('خطأ في تهيئة المصادقة:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // محاكاة طلب تسجيل دخول
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // في التطبيق الحقيقي، سيتم إرسال الطلب للخادم
      if (email && password) {
        localStorage.setItem('auth_token', 'mock_token_' + Date.now());
        setUser(mockUser);
      } else {
        throw new Error('بيانات غير صحيحة');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return {
    user,
    userRole: user?.role || null,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };
}
