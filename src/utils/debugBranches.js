/**
 * أداة تشخيص مشكلة الفروع
 * Debug tool for branches issue
 */

export const debugBranches = {
  // فحص API endpoint للفروع
  async checkBranchesAPI() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com/api/v1';
    
    try {
      console.log('🔍 فحص API الفروع...');
      console.log('URL:', `${API_BASE_URL}/tables/branches/list`);
      
      const response = await fetch(`${API_BASE_URL}/tables/branches/list`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 استجابة الخادم:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 بيانات الفروع:', data);
      
      return {
        success: true,
        data: data.data || [],
        message: `تم العثور على ${data.data?.length || 0} فرع`
      };
      
    } catch (error) {
      console.error('❌ خطأ في فحص API الفروع:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // فحص الخادم الخلفي
  async checkBackendHealth() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://metagym.metacodecx.com/api/v1';
    
    try {
      console.log('🏥 فحص صحة الخادم الخلفي...');
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 استجابة الخادم:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ الخادم الخلفي يعمل بشكل طبيعي:', data);
        return { success: true, data };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('❌ الخادم الخلفي لا يعمل:', error);
      return { success: false, error: error.message };
    }
  },

  // فحص شامل
  async fullDiagnosis() {
    console.log('🔬 بدء التشخيص الشامل...');
    console.log('='.repeat(50));
    
    // 1. فحص صحة الخادم
    const healthCheck = await this.checkBackendHealth();
    
    // 2. فحص API الفروع
    const branchesCheck = await this.checkBranchesAPI();
    
    console.log('='.repeat(50));
    console.log('📋 نتائج التشخيص:');
    console.log('🏥 صحة الخادم:', healthCheck.success ? '✅ يعمل' : '❌ لا يعمل');
    console.log('🏢 API الفروع:', branchesCheck.success ? '✅ يعمل' : '❌ لا يعمل');
    
    if (branchesCheck.success) {
      console.log(`📊 عدد الفروع: ${branchesCheck.data.length}`);
      branchesCheck.data.forEach((branch, index) => {
        console.log(`   ${index + 1}. ${branch.arabicName || branch.englishName} (ID: ${branch.id})`);
      });
    }
    
    return {
      healthCheck,
      branchesCheck
    };
  }
};

// إضافة للـ window للاستخدام في الكونسول
if (typeof window !== 'undefined') {
  window.debugBranches = debugBranches;
}
