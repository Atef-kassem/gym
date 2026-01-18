import { useState, useEffect } from "react";
import { User, UserFormData, UserPermissions, UserModules } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { 
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useUpdateUserAccountMutation,
  useUploadUserSignatureMutation,
  useGetUserPermissionsQuery,
  useUpdateUserPermissionsMutation,
  useGetUserModulesQuery,
  useUpdateUserModulesMutation
} from "@/services/userApi";
import { useGetAllBranchesQuery } from "@/services/branchesApi";
import { useGetSectionsQuery, useGetSectionsByBranchQuery } from "@/services/sectionsApi";
import { useGetRolesQuery } from "@/services/rolesApi";

const initialFormData: UserFormData = {
  name: "",
  nameEn: "",
  email: "",
  phone: "",
  mobile: "",
  nationalId: "",
  role: "",
  department: "",
  position: "",
  branch: "",
  supervisor: "",
  hireDate: "",
  salary: 0,
  status: "active",
  password: "", // إضافة حقل كلمة المرور
  address: {
    country: "",
    city: "",
    district: "",
    street: "",
    postalCode: ""
  },
  emergency: {
    name: "",
    phone: "",
    relation: ""
  }
};

export function useUserManagement() {
  const { toast } = useToast();
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  
  // API hooks
  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers, error: usersError } = useGetUsersQuery({
    page: 1,
    limit: 50
  });
  
  // Force refetch if no data after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!usersData && !isLoadingUsers && !usersError) {
        console.log('=== FORCE REFETCH ===');
        console.log('No data after 2 seconds, forcing refetch...');
        refetchUsers();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [usersData, isLoadingUsers, usersError, refetchUsers]);
  
  // Branches and Sections data
  const { data: branchesData, isLoading: isLoadingBranches, error: branchesError, refetch: refetchBranches } = useGetAllBranchesQuery();
  const { data: sectionsData, isLoading: isLoadingSections, error: sectionsError, refetch: refetchSections } = useGetSectionsQuery();
  const { data: sectionsByBranchData, refetch: refetchSectionsByBranch } = useGetSectionsByBranchQuery(
    formData.branch || "1",
    { skip: !formData.branch }
  );
  
  // Roles data
  const { data: rolesData, isLoading: isLoadingRoles, error: rolesError, refetch: refetchRoles } = useGetRolesQuery({});
  
  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();
  const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();
  const [updateUserAccount, { isLoading: isUpdatingAccount }] = useUpdateUserAccountMutation();
  const [uploadUserSignature, { isLoading: isUploadingSignature }] = useUploadUserSignatureMutation();

  // Get users from API
  const users = usersData?.users || [];
  
  // Force refetch if no data
  if (!usersData && !isLoadingUsers && !usersError) {
    console.log('No data, forcing refetch...');
    console.log('Forcing refetch in 1 second...');
    setTimeout(() => {
      console.log('Executing refetch now...');
      refetchUsers();
    }, 1000);
  }
  
  // Force refetch branches, sections, and roles if no data
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!branchesData && !isLoadingBranches && !branchesError) {
        console.log('=== FORCE REFETCH BRANCHES ===');
        refetchBranches();
      }
      if (!sectionsData && !isLoadingSections && !sectionsError) {
        console.log('=== FORCE REFETCH SECTIONS ===');
        refetchSections();
      }
      if (!rolesData && !isLoadingRoles && !rolesError) {
        console.log('=== FORCE REFETCH ROLES ===');
        refetchRoles();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [branchesData, isLoadingBranches, branchesError, sectionsData, isLoadingSections, sectionsError, rolesData, isLoadingRoles, rolesError, refetchBranches, refetchSections, refetchRoles]);
  
  // Get branches and sections data
  const branches = Array.isArray(branchesData) ? branchesData : (branchesData?.data ? branchesData.data : []);
  const sections = Array.isArray(sectionsData) ? sectionsData : (sectionsData?.data ? sectionsData.data : []);
  const sectionsByBranch = Array.isArray(sectionsByBranchData) ? sectionsByBranchData : (sectionsByBranchData?.data ? sectionsByBranchData.data : []);
  const roles = Array.isArray(rolesData?.roles) ? rolesData.roles : (rolesData?.data ? rolesData.data : (Array.isArray(rolesData) ? rolesData : []));

  // Validate form data
  const validateFormData = (data: UserFormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required fields validation
    if (!data.name?.trim()) errors.push('الاسم العربي مطلوب');
    if (!data.email?.trim()) errors.push('البريد الإلكتروني مطلوب');
    if (!data.nationalId?.trim()) errors.push('رقم الهوية الوطنية مطلوب');
    if (!data.phone?.trim()) errors.push('رقم الهاتف مطلوب');
    if (!data.role?.trim()) errors.push('الدور مطلوب');
    if (!data.branch?.trim()) errors.push('الفرع مطلوب');
    if (!data.hireDate?.trim()) errors.push('تاريخ التعيين مطلوب');
    
    // Address validation
    if (!data.address.country?.trim()) errors.push('البلد مطلوب');
    if (!data.address.city?.trim()) errors.push('المدينة مطلوبة');
    if (!data.address.district?.trim()) errors.push('الحي مطلوب');
    if (!data.address.street?.trim()) errors.push('الشارع مطلوب');
    if (!data.address.postalCode?.trim()) errors.push('الرمز البريدي مطلوب');
    
    // Emergency contact validation
    if (!data.emergency.name?.trim()) errors.push('اسم شخص للاتصال في الطوارئ مطلوب');
    if (!data.emergency.phone?.trim()) errors.push('رقم الهاتف للطوارئ مطلوب');
    if (!data.emergency.relation?.trim()) errors.push('العلاقة مطلوبة');
    
    // Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push('تنسيق البريد الإلكتروني غير صحيح');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Validate form when editing user
  useEffect(() => {
    if (editingUser) {
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        console.log('Form validation errors:', validation.errors);
      }
    }
  }, [editingUser, formData]);

  const handleInputChange = (field: string, value: string | number | object) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as object,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // إذا تم تغيير الفرع، قم بتحديث الأقسام
      if (field === 'branch') {
        refetchSectionsByBranch();
        // إعادة تعيين القسم عند تغيير الفرع
        setFormData(prev => ({ ...prev, department: '' }));
      }
    }
  };

  const handleAccountInputChange = (field: string, value: string) => {
    // This function is no longer needed as accountData state is removed
    // setAccountData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Validate required fields before submission - الحقول الأساسية فقط
      const requiredFields = editingUser 
        ? ['name', 'email', 'nationalId', 'phone'] // عند التحديث، كلمة المرور اختيارية
        : ['name', 'email', 'password', 'nationalId', 'phone']; // عند الإضافة، كلمة المرور مطلوبة
      
      const missingFields: string[] = [];
      requiredFields.forEach(field => {
        if (!formData[field as keyof UserFormData] || 
            formData[field as keyof UserFormData]?.toString().trim() === '') {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        toast({
          title: "حقول مطلوبة مفقودة",
          description: `يرجى تعبئة الحقول التالية: ${missingFields.join(', ')}`,
          variant: "destructive",
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "تنسيق البريد الإلكتروني غير صحيح",
          description: "يرجى إدخال بريد إلكتروني صحيح",
          variant: "destructive",
        });
        return;
      }

      // Validate password length if provided
      if (formData.password && formData.password.trim() !== '' && formData.password.length < 6) {
        toast({
          title: "كلمة المرور قصيرة",
          description: "كلمة المرور يجب أن تكون على الأقل 6 أحرف",
          variant: "destructive",
        });
        return;
      }

      // Check for duplicate phone numbers and emails in existing users (only when creating new user)
      if (!editingUser && usersData?.users) {
        const existingUsers = usersData.users;
        
        // Check for duplicate email
        const duplicateEmail = existingUsers.find((user: User) => 
          user.email === formData.email
        );
        
        if (duplicateEmail) {
          toast({
            title: "البريد الإلكتروني مستخدم بالفعل",
            description: "البريد الإلكتروني هذا مستخدم من قبل مستخدم آخر، يرجى استخدام بريد مختلف",
            variant: "destructive",
          });
          return;
        }

        // Check for duplicate national ID
        const duplicateNationalId = existingUsers.find((user: User) => 
          user.nationalId === formData.nationalId
        );
        
        if (duplicateNationalId) {
          toast({
            title: "رقم الهوية الوطنية مستخدم بالفعل",
            description: "رقم الهوية الوطنية هذا مستخدم من قبل مستخدم آخر، يرجى التحقق من الرقم",
            variant: "destructive",
          });
          return;
        }
      }

      // Prepare data for backend - الحقول الأساسية فقط
      const backendData: any = {
        name: formData.name,
        nameEn: formData.nameEn || '',
        email: formData.email,
        nationalId: formData.nationalId,
        phone: formData.phone,
        mobile: formData.mobile || '',
      };

      // إضافة كلمة المرور فقط إذا كانت موجودة (مطلوبة عند الإضافة، اختيارية عند التحديث)
      if (formData.password && formData.password.trim() !== '') {
        backendData.password = formData.password;
      }

      // Role is optional - إضافة فقط إذا كان محدداً
      if (formData.role && formData.role.trim() !== '') {
        backendData.role = formData.role;
      }

      if (editingUser) {
        // Update existing user
        await updateUser({ id: editingUser.id, data: backendData }).unwrap();
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث بيانات المستخدم بنجاح",
        });
      } else {
        // Create new user
        await createUser(backendData).unwrap();
        toast({
          title: "تم الإضافة بنجاح",
          description: "تم إضافة المستخدم الجديد بنجاح",
        });
      }
      
      // Refresh users list
      refetchUsers();
      setEditingUser(null);
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      
      // Show more specific error message
      let errorMessage = "حدث خطأ أثناء حفظ البيانات";
      if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
        errorMessage = String(error.data.message);
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      toast({
        title: "خطأ في الحفظ",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (user: User) => {
    // Convert date format from ISO to yyyy-MM-dd for input[type="date"]
    const formattedUser = {
      ...user,
      hireDate: user.hireDate ? new Date(user.hireDate).toISOString().split('T')[0] : ''
    };
    
    setEditingUser(formattedUser);
    setFormData(formattedUser);
  };

  const handleDelete = async (id: string) => {
    try {
      // تأكيد الحذف
      const confirmed = window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.');
      if (!confirmed) {
        return;
      }

      console.log('=== DELETE USER ATTEMPT ===');
      console.log('User ID:', id);
      console.log('Current users count:', users.length);
      
      // البحث عن المستخدم قبل الحذف
      const userToDelete = users.find(u => u.id === id);
      if (userToDelete) {
        console.log('User to delete:', userToDelete.name, userToDelete.email);
      }
      
      const result = await deleteUser(id).unwrap();
      console.log('Delete API response:', result);
      
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المستخدم بنجاح",
      });
      
      // تحديث قائمة المستخدمين
      console.log('Refreshing users list...');
      await refetchUsers();
      console.log('Users list refreshed');
      
    } catch (error) {
      console.error('=== DELETE USER ERROR ===');
      console.error('Error details:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error || {}));
      
      // رسالة خطأ أكثر تفصيلاً
      let errorMessage = "حدث خطأ أثناء حذف المستخدم";
      
      if (error && typeof error === 'object') {
        if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
          errorMessage = String(error.data.message);
          console.error('Error data message:', error.data.message);
        } else if ('message' in error) {
          errorMessage = String(error.message);
          console.error('Error message:', error.message);
        } else if ('status' in error) {
          console.error('Error status:', error.status);
          if (error.status === 401) {
            errorMessage = "غير مصرح لك بحذف المستخدمين";
          } else if (error.status === 403) {
            errorMessage = "ممنوع حذف هذا المستخدم";
          } else if (error.status === 404) {
            errorMessage = "المستخدم غير موجود";
          } else if (error.status === 500) {
            errorMessage = "خطأ في الخادم، يرجى المحاولة مرة أخرى";
          }
        }
      }
      
      toast({
        title: "خطأ في الحذف",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const user = users.find((u: User) => u.id === id);
      if (user) {
        const newStatus = user.status === "active" ? "inactive" : "active";
        await toggleUserStatus({ id, status: newStatus }).unwrap();
        toast({
          title: "تم تحديث الحالة",
          description: `تم تغيير حالة المستخدم إلى ${newStatus === "active" ? "نشط" : "غير نشط"}`,
        });
        refetchUsers();
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "خطأ في تحديث الحالة",
        description: "حدث خطأ أثناء تحديث حالة المستخدم",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingUser(null);
  };

  const resetAccountForm = () => {
    // This function is no longer needed as accountData state is removed
    // setAccountData({
    //   username: "",
    //   password: "",
    //   confirmPassword: ""
    // });
  };

  const handlePermissionsSave = async (userId: string, permissions: any) => {
    try {
      // TODO: Implement permissions save
      toast({
        title: "تم حفظ الصلاحيات",
        description: "تم حفظ صلاحيات المستخدم بنجاح",
      });
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الصلاحيات",
        variant: "destructive",
      });
    }
  };

  const handleModulesSave = async (userId: string, modules: any) => {
    try {
      // TODO: Implement modules save
      toast({
        title: "تم حفظ الوحدات",
        description: "تم حفظ وحدات المستخدم بنجاح",
      });
    } catch (error) {
      console.error('Error saving modules:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الوحدات",
        variant: "destructive",
      });
    }
  };

  // Handle signature upload
  const handleSignatureUpload = async (userId: string, file: File) => {
    try {
      await uploadUserSignature({ userId, file }).unwrap();
      toast({
        title: "تم رفع التوقيع",
        description: "تم رفع التوقيع الإلكتروني بنجاح",
      });
    } catch (error) {
      console.error('Error uploading signature:', error);
      toast({
        title: "خطأ في رفع التوقيع",
        description: "حدث خطأ أثناء رفع التوقيع",
        variant: "destructive",
      });
    }
  };

  return {
    // Data
    users,
    editingUser,
    formData,
    // accountData, // Removed as per edit hint
    branches,
    sections,
    sectionsByBranch,
    roles,
    
    // Loading states
    isLoadingUsers,
    isLoadingBranches,
    isLoadingSections,
    isLoadingRoles,
    isCreatingUser,
    isUpdatingUser,
    isDeletingUser,
    isTogglingStatus,
    isUpdatingAccount,
    isUploadingSignature,
    
    // Validation
    validateFormData,
    
    // Functions
    handleInputChange,
    handleSave,
    handleEdit,
    handleDelete,
    handleToggleStatus,
    handlePermissionsSave,
    handleModulesSave,
    handleSignatureUpload,
    resetForm,
    resetAccountForm,
    setFormData,
    setEditingUser,
    // setAccountData // Removed as per edit hint
  };
}