import { useState, useEffect, useCallback, useRef } from 'react';

// Hook لإدارة الطاولات
export const useTableManagement = () => {
  const [tables, setTables] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // منع الطلبات المتكررة
  const requestTimeoutRef = useRef(null);
  const lastRequestTimeRef = useRef(0);
  const isInitializedRef = useRef(false);
  
  // Cache للبيانات
  const cacheRef = useRef({
    tables: null,
    branches: null,
    tablesLastFetchTime: 0,
    branchesLastFetchTime: 0,
    cacheDuration: 30000 // 30 ثانية
  });

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com/api/v1';

  // الحصول على جميع الطاولات
  const fetchTables = useCallback(async (filters = {}) => {
    try {
      console.log('🔄 جلب بيانات الطاولات...', filters);
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filters.branchId) queryParams.append('branchId', filters.branchId);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.search) queryParams.append('search', filters.search);
      
      const url = `${API_BASE_URL}/tables${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('🌐 URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الطاولات');
      }
      
      const data = await response.json();
      console.log('📊 Response data:', data);
      
      let tablesData = data.data || [];
      
      // تحويل البيانات لتضمين branchName من branch object
      tablesData = tablesData.map(table => ({
        ...table,
        branchName: table.branchName || table.branch?.arabicName || table.branch?.englishName || 'غير محدد'
      }));
      
      console.log('📊 بيانات الطاولات بعد التحويل:', tablesData);
      
      setTables(tablesData);
      console.log('✅ تم جلب بيانات الطاولات بنجاح:', tablesData.length, 'طاولة');
      return tablesData;
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      console.error('❌ خطأ في جلب بيانات الطاولات:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // الحصول على قائمة الفروع مع debounce و cache
  const fetchBranches = useCallback(async () => {
    const now = Date.now();
    
    // فحص الـ cache أولاً
    if (cacheRef.current.branches && 
        (now - cacheRef.current.branchesLastFetchTime) < cacheRef.current.cacheDuration) {
      console.log('📦 استخدام بيانات الفروع من الـ cache');
      setBranches(cacheRef.current.branches);
      return cacheRef.current.branches;
    }
    
    // منع الطلبات المتكررة
    if (now - lastRequestTimeRef.current < 500) { // 500ms debounce للفروع
      console.log('🛑 تم تجاهل طلب متكرر للفروع');
      return cacheRef.current.branches || []; // إرجاع البيانات من الـ cache
    }
    
    try {
      console.log('🔄 جلب بيانات الفروع...');
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/branches/active`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الفروع');
      }
      
      const data = await response.json();
      const branchesData = data.data || [];
      
      // حفظ في الـ cache
      cacheRef.current.branches = branchesData;
      cacheRef.current.branchesLastFetchTime = now;
      
      setBranches(branchesData);
      console.log('✅ تم جلب بيانات الفروع بنجاح:', branchesData.length, 'فرع');
      return branchesData;
    } catch (err) {
      setError(err.message);
      console.error('❌ خطأ في جلب بيانات الفروع:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // دالة لمسح الـ cache
  const clearCache = useCallback(() => {
    cacheRef.current.tables = null;
    cacheRef.current.branches = null;
    cacheRef.current.tablesLastFetchTime = 0;
    cacheRef.current.branchesLastFetchTime = 0;
    console.log('🗑️ تم مسح الـ cache');
  }, []);

  // إضافة طاولة جديدة
  const addTable = async (tableData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في إضافة الطاولة');
      }
      
      const data = await response.json();
      
      // تحديث قائمة الطاولات
      await fetchTables();
      
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error adding table:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // تعديل طاولة
  const updateTable = async (tableId, tableData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/tables/${tableId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في تعديل الطاولة');
      }
      
      const data = await response.json();
      
      // تحديث قائمة الطاولات
      await fetchTables();
      
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating table:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // حذف طاولة
  const deleteTable = async (tableId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/tables/${tableId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل في حذف الطاولة');
      }
      
      const data = await response.json();
      
      // تحديث قائمة الطاولات
      await fetchTables();
      
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting table:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // الحصول على إحصائيات الطاولات
  const fetchTableStats = async (branchId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (branchId) queryParams.append('branchId', branchId);
      
      const response = await fetch(`${API_BASE_URL}/tables/stats/overview?${queryParams}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب إحصائيات الطاولات');
      }
      
      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching table stats:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // الحصول على طاولة محددة
  const fetchTable = async (tableId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/tables/${tableId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الطاولة');
      }
      
      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching table:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ملاحظة: تم إزالة التحميل الأولي التلقائي لتجنب التعارض
  // سيتم استدعاء fetchTables من الصفحة نفسها
  
  // تنظيف timeouts عند إلغاء التحميل
  useEffect(() => {
    return () => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, []);

  return {
    tables,
    branches,
    loading,
    error,
    fetchTables,
    fetchBranches,
    addTable,
    updateTable,
    deleteTable,
    fetchTableStats,
    fetchTable,
    clearCache
  };
};
