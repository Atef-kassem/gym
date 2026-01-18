import { useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useToggleRoleStatusMutation,
  useGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation,
  useGetRoleUsersQuery,
  useGetPermissionTypesQuery,
  useGetRoleStatisticsQuery,
  useExportRolesMutation,
  useImportRolesMutation,
  useGetRolePagesQuery,
  useGetAllPagesWithRoleStatusQuery,
  useAssignPageToRoleMutation,
  useRemovePageFromRoleMutation,
  // New imports for modules system
  useGetModulesAndPagesDataQuery,
  useUpdateRoleModulesMutation,
  useGetRoleModulesQuery,
  // New imports for user management
  useGetRolesWithUserCountsQuery,
} from "@/services/rolesApi";
import { 
  useGetAuditLogsQuery,
  useExportAuditLogsMutation,
  useClearAuditLogsMutation
} from "@/services/auditApi";

export interface Role {
  id: string;
  roleName: string;
  description: string;
  color: string;
  isActive: boolean;
  userCount: number;
  createdAt: string;
  permissions: Record<string, Record<string, boolean>>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  roles: string[];
  lastLogin: string;
  branch?: string;
  device?: string;
  ipAddress?: string;
  browser?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  target: string;
  details: string;
  timestamp: string;
  type: 'role' | 'permission' | 'user';
}

export interface PageWithPermissions {
  id: number;
  pageName: string;
  permissions?: Array<{ id: number }>;
}

export function useRolesManagement() {
  const { toast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState("roles");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [permissionsMatrix, setPermissionsMatrix] = useState<Record<string, Record<string, Record<string, boolean>>>>({});
  const [isRoleDetailsOpen, setIsRoleDetailsOpen] = useState(false);
  const [selectedRoleForDetails, setSelectedRoleForDetails] = useState<Role | null>(null);
  const [isSaving, setIsSaving] = useState(false); // Track saving state

  // Role form state
  const [roleForm, setRoleForm] = useState({
    roleName: "",
    description: "",
    color: "bg-gradient-to-r from-blue-500 to-indigo-500",
    isActive: true
  });

  // API hooks with optimized queries - Load only when needed
  const { data: rolesData, isLoading: isLoadingRoles, refetch: refetchRoles } = useGetRolesQuery({
    page: 1,
    limit: 50,
    search: searchTerm,
    status: filterStatus !== "all" ? filterStatus : ""
  }, {
    // Add caching and optimization but always load roles
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false
  });

  // Load modules and pages data only when permissions tab is active
  const { data: modulesAndPagesData } = useGetModulesAndPagesDataQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    skip: activeTab !== "permissions"
  });

  // Debug: Log when modules and pages data change
  useEffect(() => {
    if (modulesAndPagesData) {
      console.log('Modules and pages data updated:', modulesAndPagesData);
    }
  }, [modulesAndPagesData]);

  // Transform modules data for the new system
  const systemModules = useMemo(() => {
    if (!modulesAndPagesData) return [];
    
    return modulesAndPagesData.map((module: any) => {
      // دعم البنية الجديدة مع departments والبنية القديمة
      let pages = [];
      
      if (module.departments && Array.isArray(module.departments)) {
        // إذا كان يحتوي على departments، اجمع جميع الصفحات من جميع الإدارات
        pages = module.departments.flatMap((dept: any) => 
          (dept.pages || []).map((page: any) => ({
            pageName: page.pageName,
            pageTitle: page.pageTitle,
            departmentName: dept.departmentName,
            departmentTitle: dept.departmentTitle
          }))
        );
      } else if (module.pages && Array.isArray(module.pages)) {
        // البنية القديمة - pages مباشرة
        pages = module.pages.map((page: any) => ({
          pageName: page.pageName,
          pageTitle: page.pageTitle
        }));
      }
      
      return {
      id: module.moduleName,
      name: module.moduleTitle,
      moduleName: module.moduleName,
      moduleTitle: module.moduleTitle,
        departments: module.departments || null,
        screens: pages
      };
    });
  }, [modulesAndPagesData]);

  // Define permission types for the new system
  const permissionTypes = useMemo(() => [
    { id: "view", permissionName: "عرض", description: "إمكانية عرض البيانات" },
    { id: "create", permissionName: "إضافة", description: "إمكانية إضافة بيانات جديدة" },
    { id: "update", permissionName: "تعديل", description: "إمكانية تعديل البيانات الموجودة" },
    { id: "delete", permissionName: "حذف", description: "إمكانية حذف البيانات" },
    { id: "export", permissionName: "تصدير", description: "إمكانية تصدير البيانات" },
    { id: "import", permissionName: "استيراد", description: "إمكانية استيراد البيانات" }
  ], []);


  
  // Load role statistics only when roles tab is active
  const { data: roleStatisticsData } = useGetRoleStatisticsQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    skip: activeTab !== "roles"
  });

  // Get role pages only when a role is selected and permissions tab is active
  const { data: rolePagesData, refetch: refetchRolePages } = useGetRolePagesQuery(selectedRole || "0", {
    skip: !selectedRole || activeTab !== "permissions",
    refetchOnMountOrArgChange: false
  });

  // Get users for each role - Skip this query as we use getRolesWithUserCounts instead
  const { data: roleUsersData, refetch: refetchRoleUsers } = useGetRoleUsersQuery("", {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    skip: true // Skip this query to avoid undefined URL
  });

  // Get roles with user counts
  const { data: rolesWithUserCountsData, refetch: refetchRolesWithUserCounts } = useGetRolesWithUserCountsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false
  });

  // Debug: Log when role pages change
  useEffect(() => {
    if (rolePagesData?.data) {
      console.log('Role pages data updated:', rolePagesData.data);
      console.log('Role pages structure check:');
      rolePagesData.data.forEach((page: any) => {
        console.log(`Page: ${page.pageName}, Permissions:`, page.permissions);
      });
    }
  }, [rolePagesData?.data]);

  // Get all pages with role status only when needed
  const { data: allPagesWithStatusData, refetch: refetchAllPagesWithStatus } = useGetAllPagesWithRoleStatusQuery(selectedRole || "0", {
    skip: !selectedRole || activeTab !== "permissions",
    refetchOnMountOrArgChange: false
  });

  // Debug: Log when data changes
  useEffect(() => {
    if (allPagesWithStatusData?.data) {
      console.log('All pages with status data updated:', allPagesWithStatusData.data);
      console.log('Data structure check:');
      allPagesWithStatusData.data.forEach((page: any) => {
        console.log(`Page: ${page.pageName}, Permissions:`, page.permissions);
      });
    }
  }, [allPagesWithStatusData?.data]);

  const [createRole, { isLoading: isCreatingRole }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteRoleMutation();
  const [toggleRoleStatus, { isLoading: isTogglingStatus }] = useToggleRoleStatusMutation();
  const [updateRolePermissions, { isLoading: isUpdatingPermissions }] = useUpdateRolePermissionsMutation();
  const [updateRoleModules, { isLoading: isUpdatingModules }] = useUpdateRoleModulesMutation();
  const [exportRoles, { isLoading: isExportingRoles }] = useExportRolesMutation();
  const [importRoles, { isLoading: isImportingRoles }] = useImportRolesMutation();
  
  // Page management mutations
  const [assignPageToRole, { isLoading: isAssigningPage }] = useAssignPageToRoleMutation();
  const [removePageFromRole, { isLoading: isRemovingPage }] = useRemovePageFromRoleMutation();

  // Audit logs - Load only when audit tab is active
  const { data: auditLogsData, refetch: refetchAuditLogs } = useGetAuditLogsQuery({
    page: 1,
    limit: 50
  }, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    skip: activeTab !== "audit"
  });

  const [exportAuditLogs, { isLoading: isExportingAudit }] = useExportAuditLogsMutation();
  const [clearAuditLogs, { isLoading: isClearingAudit }] = useClearAuditLogsMutation();

  // Memoized data to prevent unnecessary re-renders
  const roles = useMemo(() => {
    const rolesList = rolesData?.roles || [];
    
    console.log('🔍 Debug - Roles data:', rolesList);
    console.log('🔍 Debug - Roles with user counts data:', rolesWithUserCountsData);
    console.log('🔍 Debug - Role users data:', roleUsersData);
    
    // Update user count for each role using the new endpoint
    if (rolesWithUserCountsData && rolesWithUserCountsData.length > 0) {
      console.log('📊 Using new endpoint for user counts');
      return rolesList.map((role: any) => {
        console.log(`🔍 Looking for role: ${role.id} (${role.roleName})`);
        
        const roleWithCounts = rolesWithUserCountsData.find((ru: any) => {
          console.log(`🔍 Comparing: ru.roleId (${ru.roleId}, type: ${typeof ru.roleId}) === role.id (${role.id}, type: ${typeof role.id})`);
          return ru.roleId == role.id; // Use loose equality for type conversion
        });
        
        console.log(`🔍 Found role with counts:`, roleWithCounts);
        
        return {
          ...role,
          userCount: roleWithCounts?.userCount || 0
        };
      });
    }
    
    // Fallback to old method if new endpoint not available
    if (roleUsersData?.roles) {
      console.log('📊 Using fallback method for user counts');
      return rolesList.map((role: any) => {
        const roleUsers = roleUsersData.roles.find((ru: any) => ru.roleId == role.id);
        return {
          ...role,
          userCount: roleUsers?.userCount || 0
        };
      });
    }
    
    console.log('📊 No user count data available, returning roles as is');
    return rolesList;
  }, [rolesData?.roles, rolesWithUserCountsData, roleUsersData?.roles]);
  
  const auditLogs = useMemo(() => auditLogsData?.logs || [], [auditLogsData?.logs]);

  const roleStatistics = useMemo(() => roleStatisticsData?.statistics || {}, [roleStatisticsData?.statistics]);
  const allPagesWithStatus = useMemo(() => {
    const data = allPagesWithStatusData?.data || [];
    console.log('All pages with status data loaded:', data);
    return data;
  }, [allPagesWithStatusData?.data]);

  // Lazy load data based on active tab
  const shouldLoadRoles = activeTab === "roles" || searchTerm || filterStatus !== "all";
  const shouldLoadPermissions = activeTab === "permissions";
  const shouldLoadAudit = activeTab === "audit";

  // Optimized filtered data
  const filteredRoles = useMemo(() => {
    if (!searchTerm && filterStatus === "all") return roles;
    
    return roles.filter((role: Role) => {
      const matchesSearch = role.roleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           role.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || 
                           (filterStatus === "active" && role.isActive) ||
                           (filterStatus === "inactive" && !role.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [roles, searchTerm, filterStatus]);

  const filteredAuditLogs = useMemo(() => {
    if (!searchTerm && filterStatus === "all") return auditLogs;
    
    return auditLogs.filter((log: AuditLog) => {
      const matchesSearch = log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.target?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterStatus === "all" || log.type === filterStatus;
      return matchesSearch && matchesType;
    });
  }, [auditLogs, searchTerm, filterStatus]);

  // Debug: Log when role changes
  useEffect(() => {
    if (selectedRole) {
      console.log('Selected role changed to:', selectedRole);
      console.log('Current permissions matrix:', permissionsMatrix);
      console.log('Available data for this role:');
      console.log('- All pages with status:', allPagesWithStatus.length);
      console.log('- Permission types:', permissionTypes.length);
      console.log('- Role pages:', rolePagesData?.data?.length || 0);
      
      // فحص تفصيلي للبيانات
      if (allPagesWithStatus.length > 0) {
        console.log('Sample page data:', allPagesWithStatus[0]);
      }
      if (permissionTypes.length > 0) {
        console.log('Sample permission data:', permissionTypes[0]);
      }
    }
  }, [selectedRole, permissionsMatrix, allPagesWithStatus, permissionTypes, rolePagesData?.data]);

  // Optimized permission matrix updates
  const updatePermission = useCallback((roleId: string, pageName: string, permissionName: string, value: boolean) => {
    setPermissionsMatrix(prev => {
      const newMatrix = { ...prev };
      if (!newMatrix[roleId]) newMatrix[roleId] = {};
      if (!newMatrix[roleId][pageName]) newMatrix[roleId][pageName] = {};
      newMatrix[roleId][pageName][permissionName] = value;
      return newMatrix;
    });
  }, []);

  const hasPermission = useCallback((roleId: string, pageName: string, permissionName: string): boolean => {
    return permissionsMatrix[roleId]?.[pageName]?.[permissionName] || false;
  }, [permissionsMatrix]);

  const toggleAllScreenPermissions = useCallback((roleId: string, pageName: string, value: boolean) => {
    const updates: Record<string, boolean> = {};
    permissionTypes.forEach((permission: any) => {
      updates[permission.permissionName] = value;
    });
    
    setPermissionsMatrix(prev => {
      const newMatrix = { ...prev };
      if (!newMatrix[roleId]) newMatrix[roleId] = {};
      newMatrix[roleId][pageName] = { ...updates };
      return newMatrix;
    });
  }, [permissionTypes]);

  // Save permissions with new modules system
  const handleSavePermissions = useCallback(async () => {
    if (!selectedRole) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار دور أولاً",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      const rolePermissions = permissionsMatrix[selectedRole] || {};
      console.log('Saving permissions for role:', selectedRole);
      console.log('Permissions matrix:', rolePermissions);
      
      // Build modules structure
      const modules: Record<string, any> = {};
      
      // Group permissions by module
      systemModules.forEach((module: any) => {
        modules[module.moduleName] = {
          moduleTitle: module.moduleTitle,
          pages: {}
        };
        
        module.screens?.forEach((screen: any) => {
          const pageName = screen.pageName;
          const pagePermissions = rolePermissions[pageName] || {};
          
          modules[module.moduleName].pages[pageName] = {
            pageTitle: screen.pageTitle,
            permissions: {
              canView: pagePermissions["عرض"] || false,
              canCreate: pagePermissions["إضافة"] || false,
              canUpdate: pagePermissions["تعديل"] || false,
              canDelete: pagePermissions["حذف"] || false,
              canExport: pagePermissions["تصدير"] || false,
              canImport: pagePermissions["استيراد"] || false
            }
          };
        });
      });

      console.log('Modules structure to save:', modules);

      // Save to backend using new API
      await updateRoleModules({
        roleId: selectedRole,
        modules
      }).unwrap();

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات الصلاحيات بنجاح",
      });

    } catch (error: any) {
      console.error('Error saving permissions:', error);
      toast({
        title: "خطأ في الحفظ",
        description: error.message || "حدث خطأ أثناء حفظ الصلاحيات",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [selectedRole, permissionsMatrix, systemModules, updateRoleModules, toast]);

  // Optimized form reset - تعريف أولاً
  const resetRoleForm = useCallback(() => {
    setRoleForm({
      roleName: "",
      description: "",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      isActive: true
    });
    setEditingRole(null);
  }, []);

  // Optimized role operations
  const handleSaveRole = useCallback(async () => {
    if (!roleForm.roleName.trim()) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال اسم الدور",
        variant: "destructive"
      });
      return;
    }

    try {
      const roleData = {
        roleName: roleForm.roleName,
        description: roleForm.description,
        Permissions: []
      };

      if (editingRole) {
        await updateRole({ id: editingRole.id, data: roleData }).unwrap();
        toast({
          title: "تم التحديث",
          description: "تم تحديث الدور بنجاح"
        });
      } else {
        await createRole(roleData).unwrap();
        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء الدور بنجاح"
        });
      }

      resetRoleForm();
      setIsRoleDialogOpen(false);
      refetchRoles();
    } catch (error) {
      console.error('Error saving role:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الدور",
        variant: "destructive"
      });
    }
  }, [roleForm, editingRole, updateRole, createRole, resetRoleForm, refetchRoles, toast]);

  const handleDeleteRole = useCallback(async (roleId: string) => {
    try {
      await deleteRole(roleId).unwrap();
      toast({
        title: "تم الحذف",
        description: "تم حذف الدور بنجاح"
      });
      refetchRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الدور",
        variant: "destructive"
      });
    }
  }, [deleteRole, refetchRoles, toast]);



  // Optimized export operations
  const handleExportRoles = useCallback(async () => {
    try {
      const blob = await exportRoles({
        format: 'excel',
        filters: {
          status: filterStatus !== 'all' ? filterStatus : undefined,
          search: searchTerm || undefined
        }
      }).unwrap();
      
      // Optimized download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roles_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      
      // Cleanup with delay to prevent blocking
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير الأدوار",
      });
    } catch (error) {
      console.error('Error exporting roles:', error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير الأدوار",
        variant: "destructive",
      });
    }
  }, [exportRoles, filterStatus, searchTerm, toast]);

  const handleImportRoles = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await importRoles(formData).unwrap();
      
      toast({
        title: "تم الاستيراد بنجاح",
        description: "تم استيراد الأدوار",
      });
      
      refetchRoles();
    } catch (error) {
      console.error('Error importing roles:', error);
      toast({
        title: "خطأ في الاستيراد",
        description: "حدث خطأ أثناء استيراد الأدوار",
        variant: "destructive",
      });
    }
  }, [importRoles, refetchRoles, toast]);

  // Optimized audit operations
  const handleExportAudit = useCallback(async () => {
    try {
      const blob = await exportAuditLogs({
        format: 'excel',
        filters: {
          type: filterStatus !== 'all' ? filterStatus : undefined,
          search: searchTerm || undefined
        }
      }).unwrap();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصديج.مجل التدقيق",
      });
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصديج.مجل التدقيق",
        variant: "destructive",
      });
    }
  }, [exportAuditLogs, filterStatus, searchTerm, toast]);

  const handleClearAudit = useCallback(async () => {
    try {
      await clearAuditLogs({}).unwrap();
      
      toast({
        title: "تم مسح السجل",
        description: "تم مسح جميع سجلات التدقيق"
      });
      
      refetchAuditLogs();
    } catch (error) {
      console.error('Error clearing audit logs:', error);
      toast({
        title: "خطأ في مسح السجل",
        description: "حدث خطأ أثناء مسح سجل التدقيق",
        variant: "destructive",
      });
    }
  }, [clearAuditLogs, refetchAuditLogs, toast]);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "permissions" && selectedRole) {
      console.log('Tab changed to permissions, loading data for role:', selectedRole);
      // Trigger permissions data load when switching to permissions tab
      refetchRolePages();
      refetchAllPagesWithStatus();
    }
  }, [activeTab, selectedRole, refetchRolePages, refetchAllPagesWithStatus]);

  // Load data when role changes
  useEffect(() => {
    if (selectedRole && activeTab === "permissions") {
      console.log('Role changed, loading permissions data for role:', selectedRole);
      // Clear existing permissions matrix when role changes
      setPermissionsMatrix(prev => {
        const newMatrix = { ...prev };
        delete newMatrix[selectedRole];
        return newMatrix;
      });
      
      // Load fresh data for the new role
      refetchRolePages();
      refetchAllPagesWithStatus();
    }
  }, [selectedRole, activeTab, refetchRolePages, refetchAllPagesWithStatus]);

  // Load data when tab becomes active
  useEffect(() => {
    if (activeTab === "roles") {
      // Load roles data when roles tab becomes active
      if (searchTerm || filterStatus !== "all") {
        refetchRoles();
      }
    }
  }, [activeTab, searchTerm, filterStatus, refetchRoles]);

  // Load role modules and build permissions matrix for new system
  const { data: roleModulesData, refetch: refetchRoleModules } = useGetRoleModulesQuery(selectedRole || "", {
    skip: !selectedRole || activeTab !== "permissions"
  });

  // State for loading permissions
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  // Function to load role permissions when role is selected
  const loadRolePermissions = useCallback(async () => {
    if (!selectedRole || !systemModules.length || !permissionTypes.length) return;
    
    console.log('Loading permissions for role:', selectedRole);
    setIsLoadingPermissions(true);
    
    try {
      // Refetch role modules to get latest data
      await refetchRoleModules();
      
      // Wait a bit for data to load
      setTimeout(() => {
        if (roleModulesData) {
          console.log('Role modules data loaded:', roleModulesData);
          
          const newPermissionsMatrix: Record<string, Record<string, Record<string, boolean>>> = {};
          
          systemModules.forEach((module: any) => {
            module.screens?.forEach((screen: any) => {
              if (!newPermissionsMatrix[selectedRole]) {
                newPermissionsMatrix[selectedRole] = {};
              }
              
              if (!newPermissionsMatrix[selectedRole][screen.pageName]) {
                newPermissionsMatrix[selectedRole][screen.pageName] = {};
              }
              
              // Load permissions from role modules data
              const moduleData = roleModulesData[module.moduleName];
              const pageData = moduleData?.pages?.[screen.pageName];
              
              permissionTypes.forEach((permission: { id: string; permissionName: string }) => {
                let serverValue = false;
                
                // Map permission types to the new structure
                if (pageData?.permissions) {
                  switch (permission.permissionName) {
                    case "عرض":
                      serverValue = pageData.permissions.canView || false;
                      break;
                    case "إضافة":
                      serverValue = pageData.permissions.canCreate || false;
                      break;
                    case "تعديل":
                      serverValue = pageData.permissions.canUpdate || false;
                      break;
                    case "حذف":
                      serverValue = pageData.permissions.canDelete || false;
                      break;
                    case "تصدير":
                      serverValue = pageData.permissions.canExport || false;
                      break;
                    case "استيراد":
                      serverValue = pageData.permissions.canImport || false;
                      break;
                  }
                }
                
                // Always use server data when loading role permissions
                newPermissionsMatrix[selectedRole][screen.pageName][permission.permissionName] = serverValue;
                
                console.log(`Loaded ${screen.pageName}.${permission.permissionName} = ${serverValue} from server`);
              });
            });
          });
          
          console.log('Final permissions matrix loaded:', newPermissionsMatrix);
          setPermissionsMatrix(newPermissionsMatrix);
          
          // Show success message
          toast({
            title: "تم تحميل الصلاحيات",
            description: `تم تحميل جميع صلاحيات الدور بنجاح`,
          });
        }
        setIsLoadingPermissions(false);
      }, 100);
      
    } catch (error) {
      console.error('Error loading role permissions:', error);
      toast({
        title: "خطأ في تحميل الصلاحيات",
        description: "حدث خطأ أثناء تحميل صلاحيات الدور",
        variant: "destructive"
      });
      setIsLoadingPermissions(false);
    }
  }, [selectedRole, systemModules, permissionTypes, roleModulesData, refetchRoleModules, toast]);

  // Load permissions when role is selected
  useEffect(() => {
    if (selectedRole && activeTab === "permissions") {
      loadRolePermissions();
    }
  }, [selectedRole, activeTab, loadRolePermissions]);

  // Optimized permission matrix initialization for new system
  useEffect(() => {
    // Don't update matrix while saving to preserve user selections
    if (isSaving) return;
    
    if (selectedRole && systemModules.length > 0 && permissionTypes.length > 0) {
      console.log('Initializing permissions matrix for role:', selectedRole);
      console.log('System modules:', systemModules);
      console.log('Role modules data:', roleModulesData);
      
      const newPermissionsMatrix: Record<string, Record<string, Record<string, boolean>>> = {};
      
      systemModules.forEach((module: any) => {
        module.screens?.forEach((screen: any) => {
        if (!newPermissionsMatrix[selectedRole]) {
          newPermissionsMatrix[selectedRole] = {};
        }
        
          if (!newPermissionsMatrix[selectedRole][screen.pageName]) {
            newPermissionsMatrix[selectedRole][screen.pageName] = {};
        }
          
          // Load permissions from role modules data
          const moduleData = roleModulesData?.[module.moduleName];
          const pageData = moduleData?.pages?.[screen.pageName];
        
        permissionTypes.forEach((permission: { id: string; permissionName: string }) => {
            let serverValue = false;
            
            // Map permission types to the new structure
            if (pageData?.permissions) {
              switch (permission.permissionName) {
                case "عرض":
                  serverValue = pageData.permissions.canView || false;
                  break;
                case "إضافة":
                  serverValue = pageData.permissions.canCreate || false;
                  break;
                case "تعديل":
                  serverValue = pageData.permissions.canUpdate || false;
                  break;
                case "حذف":
                  serverValue = pageData.permissions.canDelete || false;
                  break;
                case "تصدير":
                  serverValue = pageData.permissions.canExport || false;
                  break;
                case "استيراد":
                  serverValue = pageData.permissions.canImport || false;
                  break;
              }
            }
          
          // Preserve existing user selections or use server data
            const currentValue = permissionsMatrix[selectedRole]?.[screen.pageName]?.[permission.permissionName];
          
            newPermissionsMatrix[selectedRole][screen.pageName][permission.permissionName] = 
            currentValue !== undefined ? currentValue : serverValue;
          
            console.log(`Setting ${screen.pageName}.${permission.permissionName} = ${serverValue} (server) or ${currentValue} (current)`);
          });
        });
      });
      
      console.log('Final permissions matrix:', newPermissionsMatrix);
      setPermissionsMatrix(newPermissionsMatrix);
    }
  }, [selectedRole, systemModules, permissionTypes, roleModulesData, isSaving, permissionsMatrix]);

  return {
    // State
    activeTab,
    setActiveTab,
    selectedRole,
    setSelectedRole,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    isRoleDialogOpen,
    setIsRoleDialogOpen,
    editingRole,
    setEditingRole,
    permissionsMatrix,
    setPermissionsMatrix,
    isRoleDetailsOpen,
    setIsRoleDetailsOpen,
    selectedRoleForDetails,
    setSelectedRoleForDetails,
    roleForm,
    setRoleForm,

    // Data
    roles,
    filteredRoles,
    auditLogs,
    filteredAuditLogs,
    systemModules,
    permissionTypes,
    roleStatistics,
    rolePages: rolePagesData?.data || [],
    allPagesWithStatus: allPagesWithStatusData?.data || [],
    // For backward compatibility with existing code
    systemModulesFromHook: systemModules,
    permissionTypesFromHook: permissionTypes,

    // Loading states
    isLoadingRoles,
    isCreatingRole,
    isUpdatingRole,
    isDeletingRole,
    isTogglingStatus,
    isUpdatingPermissions,
    isLoadingPermissions,
    isExportingRoles,
    isImportingRoles,
    isAssigningPage,
    isRemovingPage,
    isExportingAudit,
    isClearingAudit,
    isSaving,

    // Functions
    handleSavePermissions,
    updatePermission,
    hasPermission,
    toggleAllScreenPermissions,
    loadRolePermissions,
    handleSaveRole,
    handleDeleteRole,
    resetRoleForm,
    handleExportRoles,
    handleImportRoles,
    handleExportAudit,
    handleClearAudit,
    refetchRoles,
    refetchAuditLogs,
    refetchRolePages,
    refetchAllPagesWithStatus,
    refetchRoleUsers,
    refetchRolesWithUserCounts,
    assignPageToRole,
    removePageFromRole
  };
}
