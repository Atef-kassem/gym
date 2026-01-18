import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  
  try {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
      // التحقق من حالة المصادقة
      if (!isLoading && !isAuthenticated) {
        navigate('/login');
        return;
      }
    }, [isAuthenticated, isLoading, navigate]);

    // إذا كان التحميل جارياً، اعرض شاشة تحميل
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    // إذا لم يكن المستخدم مصادق عليه، لا تعرض شيئاً
    if (!isAuthenticated) {
      return null;
    }

    // إذا كان كل شيء على ما يرام، اعرض المحتوى المحمي
    return children;
  } catch (error) {
    // إذا كان هناك خطأ في useAuth، اعرض شاشة تحميل
    console.log('ProtectedRoute - AuthContext not ready yet, showing loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
};

export default ProtectedRoute;
