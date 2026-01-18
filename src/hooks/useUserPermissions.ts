import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Permission {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  export: boolean;
  import: boolean;
}

interface UserPage {
  pageName: string;
  pageTitle: string;
  moduleName: string;
  moduleTitle: string;
  permissions: Permission;
}

interface UserModule {
  moduleTitle: string;
  pages: UserPage[];
}

interface UserPermissions {
  [moduleName: string]: UserModule;
}

export const useUserPermissions = () => {
  const [userPermissions, setUserPermissions] = useState<UserPermissions>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user: currentUserData, token, isLoading: isLoadingUser } = useAuth();

  useEffect(() => {
    const fetchUserPermissions = async () => {
      console.log('🚀 fetchUserPermissions called');
      console.log('👤 Current user data:', currentUserData);
      console.log('🔑 Token:', token);
      console.log('📋 Current user data keys:', currentUserData ? Object.keys(currentUserData) : 'No user data');
      console.log('👑 User role from currentUserData:', currentUserData?.role);
      
      // إذا لم يكن هناك بيانات مستخدم أو إذا كانت البيانات غير مكتملة، استخدم الصلاحيات الافتراضية
      if (!currentUserData?.id && currentUserData?.token) {
        console.log('🔄 Using token-based fallback for Super Admin');
        // استخدام صلاحيات افتراضية للمدير
        const isSuperAdmin = true; // نفترض أنه Super Admin بناءً على التوكن
        console.log('👑 Assuming Super Admin based on token:', isSuperAdmin);
        
        setUserPermissions({
          system: {
            moduleTitle: 'إدارة النظام',
            pages: [
              { pageName: 'dashboard', pageTitle: 'الرئيسية', moduleName: 'system', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'company', pageTitle: 'بيانات الشركة', moduleName: 'system', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'branches', pageTitle: 'الفروع', moduleName: 'system', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'users', pageTitle: 'المستخدمون', moduleName: 'system', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'roles', pageTitle: 'الأدوار والصلاحيات', moduleName: 'system', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'warehouses', pageTitle: 'المستودعات', moduleName: 'system', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'themes', pageTitle: 'إعدادات الثيمات', moduleName: 'system', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'system', pageTitle: 'إعدادات النظام العامة', moduleName: 'system', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'devices', pageTitle: 'إعدادات الأجهزة الخارجية', moduleName: 'system', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'advanced', pageTitle: 'إعدادات متقدمة والأمان', moduleName: 'system', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
            ]
          },
          inventory: {
            moduleTitle: 'إدارة المخازن',
            pages: [
                  { pageName: 'inventory-dashboard', pageTitle: 'لوحة تحكم المخزون', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'inventory-settings', pageTitle: 'إعدادات المخازن', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'product-management', pageTitle: 'المنتجات والخدمات', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'price-management', pageTitle: 'قائمة الأسعار', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'opening-stock', pageTitle: 'بضاعة أول المدة', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'inventory-transactions', pageTitle: 'الحركات المخزنية', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'movement-log', pageTitle: 'سجل الحركات', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'stocktaking', pageTitle: 'الجرد والتسويات', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'inventory-policies', pageTitle: 'السياسات والأجراءات', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'inventory-analytics', pageTitle: 'البيانات والتحليل الذكي', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
            ]
          },
          crm: {
            moduleTitle: 'إدارة علاقات العملاء (CRM)',
            pages: [
              { pageName: 'crm_dashboard', pageTitle: 'لوحة تحكم CRM', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'customers', pageTitle: 'إدارة العملاء', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
            ]
          },
          pos: {
            moduleTitle: 'نقاط البيع (POS)',
            pages: [
              { pageName: 'pos_dashboard', pageTitle: 'لوحة تحكم نقاط البيع', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
              { pageName: 'pos_system', pageTitle: 'نظام نقاط البيع', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
            ]
          }
        });
        setIsLoading(false);
        console.log('✅ Fallback permissions set successfully');
        return;
      }
      
      if (!currentUserData?.id) {
        console.log('❌ No current user data, returning');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('📡 Fetching permissions from API...');
        const response = await fetch(`/api/v1/users/permissions`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 API Response status:', response.status);
        console.log('📡 API Response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('📋 API Response data:', data);
          
          // تنظيم الصلاحيات حسب الوحدات
          const organizedPermissions: UserPermissions = {};
          
          data.data.forEach((item: any) => {
            const { moduleName, moduleTitle, pageName, pageTitle, permissions } = item;
            
            if (!organizedPermissions[moduleName]) {
              organizedPermissions[moduleName] = {
                moduleTitle,
                pages: []
              };
            }
            
            organizedPermissions[moduleName].pages.push({
              pageName,
              pageTitle,
              moduleName,
              moduleTitle,
              permissions
            });
          });
          
          console.log('📋 Organized permissions:', organizedPermissions);
          setUserPermissions(organizedPermissions);
        } else {
          console.error('❌ Failed to fetch user permissions');
          // استخدام صلاحيات افتراضية للمدير
          if (currentUserData.role === 'admin' || currentUserData.role === 'manager' || currentUserData.role === 'Super Admin') {
            console.log('🔄 Using fallback permissions for role:', currentUserData.role);
            // صلاحيات خاصة للمستخدم superadmin
            const isSuperAdmin = currentUserData.role === 'Super Admin';
            console.log('👑 Is Super Admin:', isSuperAdmin);
            
            setUserPermissions({
              dashboard: {
                moduleTitle: 'لوحة التحكم',
                pages: [
                  { pageName: 'main-dashboard', pageTitle: 'الرئيسية', moduleName: 'dashboard', moduleTitle: 'لوحة التحكم', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              'system-administration': {
                moduleTitle: 'إدارة النظام',
                pages: [
                  { pageName: 'company-settings', pageTitle: 'بيانات الشركة', moduleName: 'system-administration', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'branch-management', pageTitle: 'الفروع', moduleName: 'system-administration', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'warehouse-management', pageTitle: 'المستودعات', moduleName: 'system-administration', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'user-management', pageTitle: 'المستخدمون', moduleName: 'system-administration', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'roles-permissions', pageTitle: 'الأدوار والصلاحيات', moduleName: 'system-administration', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  // صلاحيات إضافية للمستخدم superadmin
                  ...(isSuperAdmin ? [
                    { pageName: 'theme-settings', pageTitle: 'إعدادات الثيمات', moduleName: 'system-administration', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'system-settings', pageTitle: 'إعدادات النظام العامة', moduleName: 'system-administration', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'device-settings', pageTitle: 'إعدادات الأجهزة الخارجية', moduleName: 'system-administration', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'advanced-settings', pageTitle: 'إعدادات متقدمة والأمان', moduleName: 'system-administration', moduleTitle: 'إدارة النظام', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  ] : []),
                ]
              },
              inventory: {
                moduleTitle: 'إدارة المخازن',
                pages: [
                  { pageName: 'inventory-dashboard', pageTitle: 'لوحة تحكم المخزون', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'inventory-settings', pageTitle: 'إعدادات المخازن', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'product-management', pageTitle: 'المنتجات والخدمات', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'price-management', pageTitle: 'قائمة الأسعار', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'opening-stock', pageTitle: 'بضاعة أول المدة', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'inventory-transactions', pageTitle: 'الحركات المخزنية', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'movement-log', pageTitle: 'سجل الحركات', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'stocktaking', pageTitle: 'الجرد والتسويات', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'inventory-policies', pageTitle: 'السياسات والأجراءات', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'inventory-analytics', pageTitle: 'البيانات والتحليل الذكي', moduleName: 'inventory', moduleTitle: 'إدارة المخازن', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              suppliers: {
                moduleTitle: 'إدارة الموردين',
                pages: [
                  { pageName: 'suppliers-dashboard', pageTitle: 'لوحة تحكم الموردين', moduleName: 'suppliers', moduleTitle: 'إدارة الموردين', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'suppliers-settings', pageTitle: 'إعدادات الموردين', moduleName: 'suppliers', moduleTitle: 'إدارة الموردين', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'suppliers-management', pageTitle: 'إضافة موردين', moduleName: 'suppliers', moduleTitle: 'إدارة الموردين', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'suppliers-payments', pageTitle: 'مدفوعات الموردين', moduleName: 'suppliers', moduleTitle: 'إدارة الموردين', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'suppliers-evaluation', pageTitle: 'تقييم الموردين', moduleName: 'suppliers', moduleTitle: 'إدارة الموردين', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'suppliers-contracts', pageTitle: 'عقود الموردين', moduleName: 'suppliers', moduleTitle: 'إدارة الموردين', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'suppliers-reports', pageTitle: 'تقارير الموردين', moduleName: 'suppliers', moduleTitle: 'إدارة الموردين', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              procurement: {
                moduleTitle: 'إدارة المشتريات',
                pages: [
                  { pageName: 'procurement-settings', pageTitle: 'إعدادات المشتريات', moduleName: 'procurement', moduleTitle: 'إدارة المشتريات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'purchase-requisition', pageTitle: 'طلبات الشراء', moduleName: 'procurement', moduleTitle: 'إدارة المشتريات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'approval-workflow', pageTitle: 'دورة الموافقات', moduleName: 'procurement', moduleTitle: 'إدارة المشتريات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'rfq-management', pageTitle: 'طلب عروض الأسعار', moduleName: 'procurement', moduleTitle: 'إدارة المشتريات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'purchase-orders', pageTitle: 'أوامر الشراء', moduleName: 'procurement', moduleTitle: 'إدارة المشتريات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'goods-receipt', pageTitle: 'استلام البضائع', moduleName: 'procurement', moduleTitle: 'إدارة المشتريات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'invoice-processing', pageTitle: 'معالجة الإيصالات', moduleName: 'procurement', moduleTitle: 'إدارة المشتريات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'purchase-returns', pageTitle: 'مرتجع المشتريات', moduleName: 'procurement', moduleTitle: 'إدارة المشتريات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'debit-note', pageTitle: 'إشعار مدين', moduleName: 'procurement', moduleTitle: 'إدارة المشتريات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              crm: {
                moduleTitle: 'إدارة علاقات العملاء (CRM)',
                pages: [
                  { pageName: 'crm-dashboard', pageTitle: 'لوحة تحكم CRM', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'customer-management', pageTitle: 'إدارة العملاء', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'campaign-management', pageTitle: 'الحملات التسويقية', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'feedback-management', pageTitle: 'تقييمات العملاء', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'survey-management', pageTitle: 'إدارة الاستبيانات', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'coupon-management', pageTitle: 'إدارة الكوبونات', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'subscription-management', pageTitle: 'إدارة الاشتراكات', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'loyalty-management', pageTitle: 'إدارة نقاط الولاء', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'card-management', pageTitle: 'إدارة البطاقات', moduleName: 'crm', moduleTitle: 'إدارة علاقات العملاء (CRM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              reception: {
                moduleTitle: 'إدارة البيع',
                pages: [
                  { pageName: 'booking-dashboard', pageTitle: 'لوحة تحكم البيع', moduleName: 'reception', moduleTitle: 'إدارة البيع', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'create-booking', pageTitle: 'إنشاء حجز جديد', moduleName: 'reception', moduleTitle: 'إدارة البيع', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'bookings-list', pageTitle: 'قائمة البيع', moduleName: 'reception', moduleTitle: 'إدارة البيع', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'booking-calendar', pageTitle: 'تقويم البيع', moduleName: 'reception', moduleTitle: 'إدارة البيع', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'booking-analytics', pageTitle: 'التحليلات والتقارير', moduleName: 'reception', moduleTitle: 'إدارة البيع', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'table-management', pageTitle: 'إدارة الطاولات', moduleName: 'reception', moduleTitle: 'إدارة البيع', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              'reception-service': {
                moduleTitle: 'إدارة الاستقبال وخدمة العملاء',
                pages: [
                  { pageName: 'reception-dashboard', pageTitle: 'لوحة تحكم الاستقبال المتكاملة', moduleName: 'reception-service', moduleTitle: 'إدارة الاستقبال وخدمة العملاء', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'live-control-center', pageTitle: 'مركز التحكم المباشر', moduleName: 'reception-service', moduleTitle: 'إدارة الاستقبال وخدمة العملاء', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'customer-service', pageTitle: 'خدمة العملاء', moduleName: 'reception-service', moduleTitle: 'إدارة الاستقبال وخدمة العملاء', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'reception-reports', pageTitle: 'تقارير الاستقبال', moduleName: 'reception-service', moduleTitle: 'إدارة الاستقبال وخدمة العملاء', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'system-integration', pageTitle: 'تكامل الأنظمة', moduleName: 'reception-service', moduleTitle: 'إدارة الاستقبال وخدمة العملاء', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'customer-notifications', pageTitle: 'إشعارات العملاء', moduleName: 'reception-service', moduleTitle: 'إدارة الاستقبال وخدمة العملاء', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              'mobile-wash': {
                moduleTitle: 'إدارة الكافية المتنقلة',
                pages: [
                  { pageName: 'mobile-wash-dashboard', pageTitle: 'لوحة تحكم الكافية المتنقلة', moduleName: 'mobile-wash', moduleTitle: 'إدارة الكافية المتنقلة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'mobile-wash-bookings', pageTitle: 'إدارة البيع', moduleName: 'mobile-wash', moduleTitle: 'إدارة الكافية المتنقلة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'fleet-management', pageTitle: 'إدارة الأسطول', moduleName: 'mobile-wash', moduleTitle: 'إدارة الكافية المتنقلة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'live-tracking', pageTitle: 'التتبع المباشر', moduleName: 'mobile-wash', moduleTitle: 'إدارة الكافية المتنقلة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'quality-management', pageTitle: 'إدارة الجودة', moduleName: 'mobile-wash', moduleTitle: 'إدارة الكافية المتنقلة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'mobile-app-management', pageTitle: 'التطبيق المحمول', moduleName: 'mobile-wash', moduleTitle: 'إدارة الكافية المتنقلة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              operations: {
                moduleTitle: 'إدارة العمليات والمسارات',
                pages: [
                  { pageName: 'operations-management', pageTitle: 'إدارة العمليات والمسارات', moduleName: 'operations', moduleTitle: 'إدارة العمليات والمسارات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'work-orders', pageTitle: 'أوامر العمل', moduleName: 'operations', moduleTitle: 'إدارة العمليات والمسارات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              pos: {
                moduleTitle: 'نقاط البيع (POS)',
                pages: [
                  { pageName: 'pos-dashboard', pageTitle: 'لوحة تحكم نقاط البيع', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'pos-system', pageTitle: 'نظام نقاط البيع', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'active-orders', pageTitle: 'الطلبات الجارية', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'shift-management', pageTitle: 'إدارة الورديات', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'outstanding-invoices', pageTitle: 'الإيصالات غير المسددة', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'customer-payments', pageTitle: 'تسديدات العملاء', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'operations-log', pageTitle: 'سجل العمليات', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'pos-reports', pageTitle: 'التقارير والتحليلات', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'pos-settings', pageTitle: 'إعدادات نقاط البيع', moduleName: 'pos', moduleTitle: 'نقاط البيع (POS)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              hcm: {
                moduleTitle: 'إدارة الموارد البشرية (HCM)',
                pages: [
                  { pageName: 'hcm-dashboard', pageTitle: 'لوحة تحكم الموارد البشرية', moduleName: 'hcm', moduleTitle: 'إدارة الموارد البشرية (HCM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'recruitment-management', pageTitle: 'إدارة التوظيف', moduleName: 'hcm', moduleTitle: 'إدارة الموارد البشرية (HCM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'contract-management', pageTitle: 'إدارة العقود', moduleName: 'hcm', moduleTitle: 'إدارة الموارد البشرية (HCM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'employee-files', pageTitle: 'ملفات الموظفين', moduleName: 'hcm', moduleTitle: 'إدارة الموارد البشرية (HCM)', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              accounting: {
                moduleTitle: 'إدارة الحسابات والمالية',
                pages: [
                  { pageName: 'accounts', pageTitle: 'إدارة الحسابات', moduleName: 'accounting', moduleTitle: 'إدارة الحسابات والمالية', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'fixed-assets', pageTitle: 'الأصول الثابتة', moduleName: 'accounting', moduleTitle: 'إدارة الحسابات والمالية', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'accounting-operations', pageTitle: 'العمليات المحاسبية', moduleName: 'accounting', moduleTitle: 'إدارة الحسابات والمالية', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'financial-reports', pageTitle: 'التقارير المالية', moduleName: 'accounting', moduleTitle: 'إدارة الحسابات والمالية', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              administration: {
                moduleTitle: 'الإدارة العامة',
                pages: [
                  { pageName: 'administration', pageTitle: 'الإدارة العامة', moduleName: 'administration', moduleTitle: 'الإدارة العامة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              'quality-development': {
                moduleTitle: 'إدارة الجودة والتطوير',
                pages: [
                  { pageName: 'quality-development', pageTitle: 'إدارة الجودة والتطوير', moduleName: 'quality-development', moduleTitle: 'إدارة الجودة والتطوير', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                ]
              },
              reports: {
                moduleTitle: 'التقارير والتحليلات',
                pages: [
                  { pageName: 'sales_reports', pageTitle: 'تقارير المبيعات', moduleName: 'reports', moduleTitle: 'التقارير والتحليلات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'inventory_reports', pageTitle: 'تقارير المخزون', moduleName: 'reports', moduleTitle: 'التقارير والتحليلات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'crm_reports', pageTitle: 'تقارير العملاء', moduleName: 'reports', moduleTitle: 'التقارير والتحليلات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'hcm_reports', pageTitle: 'تقارير الموارد البشرية', moduleName: 'reports', moduleTitle: 'التقارير والتحليلات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'financial_reports', pageTitle: 'تقارير مالية', moduleName: 'reports', moduleTitle: 'التقارير والتحليلات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  { pageName: 'quality_reports', pageTitle: 'تقارير الجودة', moduleName: 'reports', moduleTitle: 'التقارير والتحليلات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  // صلاحيات إضافية للمستخدم superadmin
                  ...(isSuperAdmin ? [
                    { pageName: 'system_audit', pageTitle: 'تدقيق النظام', moduleName: 'reports', moduleTitle: 'التقارير والتحليلات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'security_reports', pageTitle: 'تقارير الأمان', moduleName: 'reports', moduleTitle: 'التقارير والتحليلات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'performance_analytics', pageTitle: 'تحليلات الأداء المتقدمة', moduleName: 'reports', moduleTitle: 'التقارير والتحليلات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'predictive_analytics', pageTitle: 'التحليلات التنبؤية', moduleName: 'reports', moduleTitle: 'التقارير والتحليلات', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  ] : []),
                ]
              },
              // وحدة خاصة للمستخدم superadmin
              ...(isSuperAdmin ? {
                superadmin: {
                  moduleTitle: 'إدارة النظام المتقدمة',
                  pages: [
                    { pageName: 'system_overview', pageTitle: 'نظرة عامة على النظام', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'user_management', pageTitle: 'إدارة المستخدمين المتقدمة', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'role_management', pageTitle: 'إدارة الأدوار المتقدمة', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'permission_management', pageTitle: 'إدارة الصلاحيات المتقدمة', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'system_configuration', pageTitle: 'تكوين النظام', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'database_management', pageTitle: 'إدارة قاعدة البيانات', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'backup_restore', pageTitle: 'النسخ الاحتياطية والاستعادة', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'system_monitoring', pageTitle: 'مراقبة النظام', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'log_management', pageTitle: 'إدارة السجلات', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'api_management', pageTitle: 'إدارة واجهات البرمجة', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'integration_management', pageTitle: 'إدارة التكامل', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                    { pageName: 'system_health', pageTitle: 'صحة النظام', moduleName: 'superadmin', moduleTitle: 'إدارة النظام المتقدمة', permissions: { view: true, create: true, update: true, delete: true, export: true, import: true } },
                  ]
                }
              } : {})
            });
          }
        }
      } catch (error) {
        console.error('❌ Error fetching user permissions:', error);
        setError('Failed to fetch user permissions');
      } finally {
        setIsLoading(false);
        console.log('🏁 fetchUserPermissions completed');
      }
    };

    console.log('🔄 useEffect triggered, calling fetchUserPermissions');
    fetchUserPermissions();
  }, [currentUserData?.id, currentUserData?.role, currentUserData?.token]);

  // دالة للتحقق من وجود صلاحية معينة
  const hasPermission = useCallback((moduleName: string, pageName: string, permission: keyof Permission): boolean => {
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
      console.log('🔄 useUserPermissions - Page belongs to CRM module, searching in crm instead of', moduleName, ':', pageName);
    }
    
    const module = userPermissions[searchModuleName];
    if (!module) {
      // إذا لم تجد الصفحة في crm، جرب البحث في الوحدة الأصلية
      if (searchModuleName === 'crm' && moduleName !== 'crm') {
        console.log('⚠️ useUserPermissions - Page not found in crm, trying original module:', moduleName);
        const originalModule = userPermissions[moduleName];
        if (!originalModule) return false;
        const page = originalModule.pages.find(p => p.pageName === pageName);
        if (!page) return false;
        return page.permissions[permission] || false;
      }
      return false;
    }
    
    const page = module.pages.find(p => p.pageName === pageName);
    if (!page) {
      // إذا لم تجد الصفحة في crm، جرب البحث في الوحدة الأصلية
      if (searchModuleName === 'crm' && moduleName !== 'crm') {
        console.log('⚠️ useUserPermissions - Page not found in crm, trying original module:', moduleName);
        const originalModule = userPermissions[moduleName];
        if (!originalModule) return false;
        const originalPage = originalModule.pages.find(p => p.pageName === pageName);
        if (!originalPage) return false;
        return originalPage.permissions[permission] || false;
      }
      return false;
    }
    
    return page.permissions[permission] || false;
  }, [userPermissions]);

  // دالة للتحقق من إمكانية رؤية الوحدة
  const canViewModule = useMemo(() => {
    return (moduleName: string) => {
      console.log('🔍 canViewModule called for:', moduleName);
      console.log('👤 Current user data:', currentUserData);
      console.log('📋 User permissions:', userPermissions);
      
      // إذا كان المستخدم Super Admin أو إذا كان لديه توكن (مؤقتاً)، يمكنه رؤية كل شيء
      if (currentUserData?.role === 'Super Admin' || currentUserData?.token) {
        console.log('✅ Super Admin or token-based user - can view everything');
        return true;
      }
      
      const module = userPermissions[moduleName];
      if (!module) {
        console.log('❌ Module not found:', moduleName);
        return false;
      }
      
      const canView = module.pages.some(page => page.permissions.view);
      console.log('📄 Module pages with view permission:', canView);
      return canView;
    };
  }, [userPermissions, currentUserData]);

  // دالة للتحقق من إمكانية رؤية الصفحة
  const canViewPage = useMemo(() => {
    return (moduleName: string, pageName: string) => {
      console.log('🔍 canViewPage called for:', moduleName, pageName);
      console.log('👤 Current user data:', currentUserData);
      
      // إذا كان المستخدم Super Admin أو إذا كان لديه توكن (مؤقتاً)، يمكنه رؤية كل شيء
      if (currentUserData?.role === 'Super Admin' || currentUserData?.token) {
        console.log('✅ Super Admin or token-based user - can view everything');
        return true;
      }
      
      const result = hasPermission(moduleName, pageName, 'view');
      console.log('📄 Page view permission result:', result);
      return result;
    };
  }, [hasPermission, currentUserData]);

  // دالة للحصول على صفحات الوحدة
  const getModulePages = useMemo(() => {
    return (moduleName: string) => {
      // إذا كان المستخدم Super Admin أو إذا كان لديه توكن (مؤقتاً)، يمكنه رؤية كل شيء
      if (currentUserData?.role === 'Super Admin' || currentUserData?.token) {
        const module = userPermissions[moduleName];
        if (!module) return [];
        return module.pages; // إرجاع جميع الصفحات
      }
      
      const module = userPermissions[moduleName];
      if (!module) return [];
      return module.pages.filter(page => page.permissions.view);
    };
  }, [userPermissions, currentUserData]);

  // دالة خاصة للمستخدم Super Admin - يرى دائماً الصفحة الرئيسية وإدارة النظام
  const isAlwaysVisibleForSuperAdmin = useMemo(() => {
    return (moduleName: string, pageName?: string) => {
      // إذا لم يكن Super Admin أو لديه توكن، قم بإرجاع false
      if (currentUserData?.role !== 'Super Admin' && !currentUserData?.token) return false;
      
      // الصفحة الرئيسية وإدارة النظام دائماً مرئية للمستخدم Super Admin
      if (moduleName === 'system-administration' || moduleName === 'dashboard') return true;
      if (pageName === 'main-dashboard' || pageName === 'company-settings' || pageName === 'branch-management' || pageName === 'user-management' || pageName === 'roles-permissions') return true;
      
      return false;
    };
  }, [currentUserData]);


  return {
    userPermissions,
    isLoading: isLoading || isLoadingUser,
    error,
    hasPermission,
    canViewModule,
    canViewPage,
    getModulePages,
    isAlwaysVisibleForSuperAdmin,
    isSuperAdmin: currentUserData?.role === 'Super Admin' || Boolean(currentUserData?.token)
  };
};
