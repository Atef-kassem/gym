import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useGetCurrentUserQuery } from '@/services/authApi';
import { useGetRoleModulesQuery } from '@/services/rolesApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userPermissions, setUserPermissions] = useState({});

  // التحقق من المستخدم الحالي - فقط إذا لم يكن لدينا بيانات مستخدم
  const { data: currentUser, isLoading, error } = useGetCurrentUserQuery(undefined, {
    skip: !token || !!user, // لا تتحقق من المستخدم إذا كان لدينا بيانات أو لم يكن هناك توكن
  });

  // جلب صلاحيات المستخدم إذا كان لديه دور
  const { data: roleModules, isLoading: isLoadingPermissions } = useGetRoleModulesQuery(
    user?.roleId, 
    { 
      skip: !user?.roleId,
      refetchOnMountOrArgChange: true
    }
  );

  // Debug: Log user roleId
  useEffect(() => {
    console.log('👤 AuthContext - User roleId:', { 
      userId: user?.id, 
      roleId: user?.roleId, 
      role: user?.role,
      hasRoleId: !!user?.roleId 
    });
  }, [user?.roleId, user?.id]);

  useEffect(() => {
    if (token) {
      console.log('🔄 AuthContext - Token changed, setting authenticated');
      setIsAuthenticated(true);
    } else {
      console.log('🔄 AuthContext - Token removed, setting unauthenticated');
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (currentUser && !user) {
      console.log('🔄 AuthContext - currentUser changed (fallback):', currentUser);
      console.log('🔄 AuthContext - currentUser structure:', {
        data: currentUser.data,
        user: currentUser.data?.user,
        directUser: currentUser,
        keys: Object.keys(currentUser)
      });
      
      // استخراج بيانات المستخدم من data.user إذا كانت موجودة
      const userData = currentUser.data?.user || currentUser;
      
      console.log('✅ AuthContext - Setting user data from fallback API:', userData);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, [currentUser, user]);

  // تحديث صلاحيات المستخدم من user.role.modules مباشرة (الأولوية)
  useEffect(() => {
    if (user?.role?.modules) {
      console.log('✅ AuthContext - Found modules in user.role.modules:', Object.keys(user.role.modules));
      
      // Debug: Log gym-management module if it exists
      if (user.role.modules['gym-management']) {
        console.log('🏋️ AuthContext - Gym management module found in user.role:', {
          moduleTitle: user.role.modules['gym-management'].moduleTitle,
          pagesCount: Object.keys(user.role.modules['gym-management'].pages || {}).length,
          pages: Object.keys(user.role.modules['gym-management'].pages || {}),
          settingsPages: Object.keys(user.role.modules['gym-management'].pages || {}).filter(p => p.includes('settings'))
        });
      }
      
      // استخدام البيانات من user.role.modules مباشرة
      if (JSON.stringify(user.role.modules) !== JSON.stringify(userPermissions)) {
        console.log('✅ AuthContext - Updating user permissions from user.role.modules');
        setUserPermissions(user.role.modules);
      }
      return; // لا نحتاج للتحقق من roleModules إذا كانت البيانات موجودة في user.role.modules
    }
  }, [user?.role?.modules, userPermissions]);

  // تحديث صلاحيات المستخدم عند تغيير الدور (fallback إذا لم تكن موجودة في user.role.modules)
  useEffect(() => {
    // فقط إذا لم تكن الصلاحيات موجودة في user.role.modules
    if (roleModules && !user?.role?.modules) {
      console.log('🔄 AuthContext - roleModules changed (fallback):', roleModules);
      console.log('🔄 AuthContext - roleModules keys:', Object.keys(roleModules));
      
      // Debug: Log gym-management module if it exists
      if (roleModules['gym-management']) {
        console.log('🏋️ AuthContext - Gym management module found:', {
          moduleTitle: roleModules['gym-management'].moduleTitle,
          pagesCount: Object.keys(roleModules['gym-management'].pages || {}).length,
          pages: Object.keys(roleModules['gym-management'].pages || {}),
          settingsPages: Object.keys(roleModules['gym-management'].pages || {}).filter(p => p.includes('settings'))
        });
      }
      
      // تحقق من أن البيانات مختلفة قبل التحديث
      if (JSON.stringify(roleModules) !== JSON.stringify(userPermissions)) {
        console.log('✅ AuthContext - Updating user permissions from API');
        setUserPermissions(roleModules);
      } else {
        console.log('⏭️ AuthContext - Permissions unchanged, skipping update');
      }
    } else if (!roleModules && !user?.role?.modules) {
      console.log('🔄 AuthContext - No roleModules data and no user.role.modules');
    }
  }, [roleModules, userPermissions, user?.role?.modules]);

  useEffect(() => {
    if (error && token && !user) {
      // إذا كان هناك خطأ في التحقق من المستخدم، قم بتسجيل الخروج
      console.log('❌ AuthContext - Error in currentUser query, logging out');
      logout();
    }
  }, [error, token, user]);

  const login = (newToken, userData = null) => {
    console.log('🔄 AuthContext - Login called with token and userData:', { newToken, userData });
    
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    
    // إذا تم تمرير بيانات المستخدم، احفظها مباشرة
    if (userData) {
      console.log('✅ AuthContext - Setting user data from login:', userData);
      setUser(userData);
    }
  };

  const logout = () => {
    console.log('🔄 AuthContext - Logout called');
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setUserPermissions({});
  };

  // دالة للتحقق من الصلاحيات
  const hasPermission = (moduleName, pageName, permission) => {
    // صفحة Dashboard (الرئيسية) متاحة دائماً للمستخدمين المسجلين
    if (moduleName === 'dashboard' || pageName === 'main-dashboard' || pageName === 'dashboard') {
      console.log('✅ AuthContext - Dashboard is always accessible');
      return true;
    }
    
    // التحقق من Super Admin - يسمح بالوصول الكامل
    const userRole = user?.role?.roleName || user?.roleName || user?.role;
    const isSuperAdmin = userRole === 'Super Admin' || userRole === 'super-admin' || userRole === 'super_admin';
    
    if (isSuperAdmin) {
      console.log('✅ AuthContext - Super Admin detected, allowing full access:', {
        moduleName,
        pageName,
        permission,
        userRole
      });
      return true;
    }
    
    // إذا لم تكن هناك أي صلاحيات محمّلة، نمنع الوصول
    if (!userPermissions || Object.keys(userPermissions).length === 0) {
      console.log('❌ AuthContext - No userPermissions loaded, denying access.', {
        moduleName,
        pageName,
        permission,
      });
      return false;
    }
    
    // الصفحات التي يجب البحث عنها في وحدة crm بدلاً من gym-management
    const crmPages = [
      'subscriptions',
      'add-subscription',
      'special-subscriptions',
      'invoices-receipts',
      'financial-reports',
      'discounts-offers',
      'subscription-transfers',
      'subscription-member-transfer',
      'subscription-refunds'
    ];
    
    // إذا كانت الصفحة من صفحات CRM، ابحث في وحدة crm أولاً
    let searchModuleName = moduleName;
    if (crmPages.includes(pageName)) {
      searchModuleName = 'crm';
      console.log('🔄 AuthContext - Page belongs to CRM module, searching in crm instead of', moduleName, ':', pageName);
    }
    
    if (!userPermissions[searchModuleName] || !userPermissions[searchModuleName].pages) {
      // إذا لم تجد الصفحة في crm، جرب البحث في الوحدة الأصلية
      if (searchModuleName === 'crm' && moduleName !== 'crm' && userPermissions[moduleName] && userPermissions[moduleName].pages) {
        console.log('⚠️ AuthContext - Page not found in crm, trying original module:', moduleName);
        searchModuleName = moduleName;
      } else {
        console.log('❌ AuthContext - No specific permissions for module, denying access:', { moduleName: searchModuleName, pageName, permission });
        return false;
      }
    }
    
    const page = userPermissions[searchModuleName].pages[pageName];
    if (!page || !page.permissions) {
      console.log('❌ AuthContext - No page entry or permissions object, denying access:', { moduleName: searchModuleName, pageName, permission, page });
      return false;
    }
    
    const permValue = page.permissions[permission];
    const hasPermission = permValue === true || permValue === 1;
    
    if (moduleName === 'gym-management' && pageName.includes('settings')) {
      console.log('🏋️ AuthContext - Gym settings permission check:', {
        moduleName: searchModuleName,
        pageName,
        permission,
        hasPermission,
        pagePermissions: page.permissions
      });
    }
    
    return hasPermission;
  };

  // دالة للتحقق من إمكانية الوصول للصفحة
  const canAccessPage = (moduleName, pageName) => {
    const result = hasPermission(moduleName, pageName, 'canView');
    return result;
  };

  // دالة للتحقق من إمكانية الإضافة
  const canCreate = (moduleName, pageName) => {
    return hasPermission(moduleName, pageName, 'canCreate');
  };

  // دالة للتحقق من إمكانية التعديل
  const canUpdate = (moduleName, pageName) => {
    return hasPermission(moduleName, pageName, 'canUpdate');
  };

  // دالة للتحقق من إمكانية الحذف
  const canDelete = (moduleName, pageName) => {
    return hasPermission(moduleName, pageName, 'canDelete');
  };

  // دالة للتحقق من إمكانية التصدير
  const canExport = (moduleName, pageName) => {
    return hasPermission(moduleName, pageName, 'canExport');
  };

  // دالة للتحقق من إمكانية الاستيراد
  const canImport = (moduleName, pageName) => {
    return hasPermission(moduleName, pageName, 'canImport');
  };

  const value = {
    isAuthenticated,
    user,
    token,
    isLoading,
    isLoadingPermissions,
    userPermissions,
    login,
    logout,
    hasPermission,
    canAccessPage,
    canCreate,
    canUpdate,
    canDelete,
    canExport,
    canImport,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
