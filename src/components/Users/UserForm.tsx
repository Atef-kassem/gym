import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BranchSectionSelect } from "@/components/ui/BranchSectionSelect";
import { RoleSelect } from "@/components/ui/RoleSelect";
import { UserFormData } from "@/types/user";
import { UserIcon, Mail, Phone, IdCard, MapPin, UserCheck, Calendar, DollarSign, Users, AlertCircle, AlertTriangle, Key } from "lucide-react";

interface UserFormProps {
  formData: UserFormData;
  onInputChange: (field: string, value: string | number | object) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  isEditing: boolean;
  // Data from API
  branches: any[];
  sections: any[];
  sectionsByBranch: any[];
  roles: any[];
  isLoadingBranches: boolean;
  isLoadingSections: boolean;
  isLoadingRoles: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isLoading,
  isEditing,
  branches,
  sections,
  sectionsByBranch,
  roles,
  isLoadingBranches,
  isLoadingSections,
  isLoadingRoles,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Validation rules
  const validationRules: {
    [key: string]: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      min?: number;
      message: {
        required?: string;
        minLength?: string;
        maxLength?: string;
        pattern?: string;
        min?: string;
      };
    };
  } = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[\u0600-\u06FF\s]+$/,
      message: {
        required: 'الاسم العربي مطلوب',
        minLength: 'الاسم العربي يجب أن يكون على الأقل حرفين',
        maxLength: 'الاسم العربي يجب أن يكون أقل من 50 حرف',
        pattern: 'الاسم العربي يجب أن يحتوي على أحرف عربية فقط'
      }
    },
    nameEn: {
      required: false,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message: {
        minLength: 'الاسم الإنجليزي يجب أن يكون على الأقل حرفين',
        maxLength: 'الاسم الإنجليزي يجب أن يكون أقل من 50 حرف',
        pattern: 'الاسم الإنجليزي يجب أن يحتوي على أحرف إنجليزية فقط'
      }
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: {
        required: 'البريد الإلكتروني مطلوب',
        pattern: 'البريد الإلكتروني غير صحيح'
      }
    },
    password: {
      required: false, // تغيير إلى false لأن كلمة المرور قد تكون فارغة عند التحديث
      minLength: 6,
      message: {
        minLength: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'
      }
    },
    nationalId: {
      required: true,
      message: {
        required: 'رقم الهوية الوطنية مطلوب'
      }
    },
    phone: {
      required: true,
      message: {
        required: 'رقم الهاتف مطلوب'
      }
    },
    mobile: {
      required: false,
      message: {}
    },
    role: {
      required: true,
      message: {
        required: 'الدور مطلوب'
      }
    },
    branch: {
      required: true,
      message: {
        required: 'الفرع مطلوب'
      }
    },
    hireDate: {
      required: true,
      message: {
        required: 'تاريخ التعيين مطلوب'
      }
    },
    salary: {
      required: false,
      min: 0,
      message: {
        min: 'الراتب يجب أن يكون أكبر من أو يساوي صفر'
      }
    }
  };

  // Validate a single field
  const validateField = (field: string, value: any): string => {
    const rule = validationRules[field as keyof typeof validationRules];
    if (!rule) return '';

    // Check required
    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.message.required || '';
    }

    // Skip other validations if not required and empty
    if (!rule.required && (!value || value.toString().trim() === '')) {
      return '';
    }

    // Check minLength
    if (rule.minLength && value && value.toString().length < rule.minLength) {
      return rule.message.minLength || '';
    }

    // Check maxLength
    if (rule.maxLength && value && value.toString().length > rule.maxLength) {
      return rule.message.maxLength || '';
    }

    // Check min value
    if (rule.min !== undefined && value !== undefined && parseFloat(value) < rule.min) {
      return rule.message.min || '';
    }

    // Check pattern
    if (rule.pattern && value && !rule.pattern.test(value.toString())) {
      return rule.message.pattern || '';
    }

    return '';
  };

  // Validate nested field (e.g., address.country)
  const validateNestedField = (field: string, value: any): string => {
    const rule = validationRules[field as keyof typeof validationRules];
    if (!rule) return '';

    // Check required
    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.message.required || '';
    }

    // Skip other validations if not required and empty
    if (!rule.required && (!value || value.toString().trim() === '')) {
      return '';
    }

    // Check minLength
    if (rule.minLength && value && value.toString().length < rule.minLength) {
      return rule.message.minLength || '';
    }

    // Check pattern
    if (rule.pattern && value && !rule.pattern.test(value.toString())) {
      return rule.message.pattern || '';
    }

    return '';
  };

  // Handle input change with validation
  const handleInputChange = (field: string, value: string | number | object) => {
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Validate field
    let error = '';
    if (field.includes('.')) {
      // For nested fields, validate the specific nested field
      const [parent, child] = field.split('.');
      const parentValue = formData[parent as keyof UserFormData];
      if (typeof parentValue === 'object' && parentValue !== null) {
        const nestedValue = (parentValue as any)[child];
        error = validateNestedField(field, nestedValue);
      }
    } else {
      error = validateField(field, value);
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }

    // Call parent handler
    onInputChange(field, value);
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate basic fields from validationRules
    Object.keys(validationRules).forEach(field => {
      const value = formData[field as keyof UserFormData];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validate address fields
    if (!formData.address.country?.trim()) {
      newErrors['address.country'] = 'البلد مطلوب';
    }
    if (!formData.address.city?.trim()) {
      newErrors['address.city'] = 'المدينة مطلوبة';
    }
    if (!formData.address.district?.trim()) {
      newErrors['address.district'] = 'الحي مطلوب';
    }
    if (!formData.address.street?.trim()) {
      newErrors['address.street'] = 'الشارع مطلوب';
    }
    if (!formData.address.postalCode?.trim()) {
      newErrors['address.postalCode'] = 'الرمز البريدي مطلوب';
    }

    // Validate emergency fields
    if (!formData.emergency.name?.trim()) {
      newErrors['emergency.name'] = 'اسم شخص للاتصال في الطوارئ مطلوب';
    } else if (formData.emergency.name.trim().length < 2) {
      newErrors['emergency.name'] = 'الاسم يجب أن يكون على الأقل حرفين';
    }
    if (!formData.emergency.phone?.trim()) {
      newErrors['emergency.phone'] = 'رقم الهاتف للطوارئ مطلوب';
    }
    if (!formData.emergency.relation?.trim()) {
      newErrors['emergency.relation'] = 'العلاقة مطلوبة';
    } else if (formData.emergency.relation.trim().length < 2) {
      newErrors['emergency.relation'] = 'العلاقة يجب أن تكون على الأقل حرفين';
    }

    // Special validation for password when editing
    if (isEditing && formData.password && formData.password.trim() !== '') {
      // Only validate password if it's provided during edit
      if (formData.password.trim().length < 6) {
        newErrors['password'] = 'كلمة المرور يجب أن تكون على الأقل 6 أحرف';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    } else {
      // Mark all fields as touched to show errors
      const allTouched: { [key: string]: boolean } = {};
      
      // Mark basic fields as touched
      Object.keys(validationRules).forEach(field => {
        allTouched[field] = true;
      });
      
      // Mark nested fields as touched
      allTouched['address.country'] = true;
      allTouched['address.city'] = true;
      allTouched['address.district'] = true;
      allTouched['address.street'] = true;
      allTouched['address.postalCode'] = true;
      allTouched['emergency.name'] = true;
      allTouched['emergency.phone'] = true;
      allTouched['emergency.relation'] = true;
      
      setTouched(allTouched);
    }
  };

  // Check if form has errors
  const hasErrors = Object.keys(errors).length > 0;

  // Get error for a field
  const getFieldError = (field: string): string => {
    return errors[field] || '';
  };

  // Check if field should show error
  const shouldShowError = (field: string): boolean => {
    return touched[field] && !!errors[field];
  };

  // Get input className with error state
  const getInputClassName = (field: string): string => {
    const baseClass = "rounded-lg shadow-sm transition-all duration-200";
    if (shouldShowError(field)) {
      return `${baseClass} border-destructive focus:ring-2 focus:ring-destructive/20`;
    }
    return `${baseClass} focus:ring-2 focus:ring-primary/20`;
  };

  return (
    <Card className="w-full mx-auto mt-10 shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <CardHeader className="flex flex-col items-center gap-2 pb-2 w-full">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shadow-lg mb-2">
          <UserIcon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-extrabold text-center text-primary">
          {isEditing ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          يرجى تعبئة جميع الحقول المطلوبة بدقة
        </CardDescription>
        
        {/* Form Validation Summary */}
        
      </CardHeader>
      <CardContent className="space-y-8">
        {/* المعلومات الأساسية */}
        <section className="rounded-xl bg-white/80 dark:bg-gray-900/60 shadow p-6 space-y-6 border border-blue-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">المعلومات الأساسية</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="flex items-center gap-1 font-medium">
                <UserIcon className="w-4 h-4 text-primary" />
                الاسم العربي <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="أدخل الاسم العربي"
                required
                className={getInputClassName("name")}
              />
              {shouldShowError("name") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("name")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="nameEn" className="flex items-center gap-1 font-medium">
                <UserIcon className="w-4 h-4 text-blue-400" />
                الاسم الإنجليزي
              </Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => handleInputChange("nameEn", e.target.value)}
                placeholder="Enter English Name"
                className={getInputClassName("nameEn")}
              />
              {shouldShowError("nameEn") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("nameEn")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-1 font-medium">
                <Mail className="w-4 h-4 text-primary" />
                البريد الإلكتروني <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="أدخل البريد الإلكتروني"
                required
                className={getInputClassName("email")}
              />
              {shouldShowError("email") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("email")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="flex items-center gap-1 font-medium">
                <Key className="w-4 h-4 text-primary" />
                كلمة المرور <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                className={getInputClassName("password")}
              />
              {shouldShowError("password") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("password")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="nationalId" className="flex items-center gap-1 font-medium">
                <IdCard className="w-4 h-4 text-primary" />
                رقم الهوية الوطنية <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nationalId"
                value={formData.nationalId}
                onChange={(e) => handleInputChange("nationalId", e.target.value)}
                placeholder="أدخل رقم الهوية الوطنية"
                required
                className={getInputClassName("nationalId")}
              />
              {shouldShowError("nationalId") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("nationalId")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-1 font-medium">
                <Phone className="w-4 h-4 text-primary" />
                رقم الهاتف <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="أدخل رقم الهاتف"
                required
                className={getInputClassName("phone")}
              />
              {shouldShowError("phone") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("phone")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="mobile" className="flex items-center gap-1 font-medium">
                <Phone className="w-4 h-4 text-blue-400" />
                رقم الجوال
              </Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                placeholder="أدخل رقم الجوال"
                className={getInputClassName("mobile")}
              />
              {shouldShowError("mobile") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("mobile")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* الفرع والقسم */}
        <section className="rounded-xl bg-white/80 dark:bg-gray-900/60 shadow p-6 space-y-6 border border-blue-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">الفرع والقسم</h3>
          </div>
          <BranchSectionSelect
            branches={branches}
            sections={sections}
            sectionsByBranch={sectionsByBranch}
            selectedBranch={formData.branch}
            selectedSection={formData.department}
            onBranchChange={(value) => handleInputChange("branch", value)}
            onSectionChange={(value) => handleInputChange("department", value)}
            isLoadingBranches={isLoadingBranches}
            isLoadingSections={isLoadingSections}
          />
          {shouldShowError("branch") && (
            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {getFieldError("branch")}
            </p>
          )}
        </section>

        {/* الدور والمنصب */}
        <section className="rounded-xl bg-white/80 dark:bg-gray-900/60 shadow p-6 space-y-6 border border-blue-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">الدور والمنصب</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoleSelect
              roles={roles}
              selectedRole={formData.role}
              onRoleChange={(value) => handleInputChange("role", value)}
              isLoading={isLoadingRoles}
            />
            {shouldShowError("role") && (
              <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {getFieldError("role")}
              </p>
            )}
            <div>
              <Label htmlFor="position" className="font-medium">المنصب</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                placeholder="أدخل المنصب"
                className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <Label htmlFor="supervisor" className="font-medium">المشرف المباشر</Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => handleInputChange("supervisor", e.target.value)}
                placeholder="أدخل اسم المشرف المباشر"
                className="rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <Label htmlFor="hireDate" className="font-medium">
                تاريخ التعيين <span className="text-destructive">*</span>
              </Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange("hireDate", e.target.value)}
                className={getInputClassName("hireDate")}
              />
              {shouldShowError("hireDate") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("hireDate")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* الراتب والحالة */}
        <section className="rounded-xl bg-white/80 dark:bg-gray-900/60 shadow p-6 space-y-6 border border-blue-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">الراتب والحالة</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="salary" className="font-medium">الراتب</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", parseFloat(e.target.value) || 0)}
                placeholder="أدخل الراتب"
                min="0"
                className={getInputClassName("salary")}
              />
              {shouldShowError("salary") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("salary")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="status" className="font-medium">الحالة</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white dark:bg-gray-800 shadow-sm"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
          </div>
        </section>

        {/* العنوان */}
        <section className="rounded-xl bg-white/80 dark:bg-gray-900/60 shadow p-6 space-y-6 border border-blue-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">العنوان</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="country" className="font-medium">
                البلد <span className="text-destructive">*</span>
              </Label>
              <Input
                id="country"
                value={formData.address.country}
                onChange={(e) => handleInputChange("address.country", e.target.value)}
                placeholder="أدخل البلد"
                className={getInputClassName("address.country")}
              />
              {shouldShowError("address.country") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("address.country")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="city" className="font-medium">
                المدينة <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => handleInputChange("address.city", e.target.value)}
                placeholder="أدخل المدينة"
                className={getInputClassName("address.city")}
              />
              {shouldShowError("address.city") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("address.city")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="district" className="font-medium">
                الحي <span className="text-destructive">*</span>
              </Label>
              <Input
                id="district"
                value={formData.address.district}
                onChange={(e) => handleInputChange("address.district", e.target.value)}
                placeholder="أدخل الحي"
                className={getInputClassName("address.district")}
              />
              {shouldShowError("address.district") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("address.district")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="street" className="font-medium">
                الشارع <span className="text-destructive">*</span>
              </Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => handleInputChange("address.street", e.target.value)}
                placeholder="أدخل الشارع"
                className={getInputClassName("address.street")}
              />
              {shouldShowError("address.street") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("address.street")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="postalCode" className="font-medium">
                الرمز البريدي <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postalCode"
                value={formData.address.postalCode}
                onChange={(e) => handleInputChange("address.postalCode", e.target.value)}
                placeholder="أدخل الرمز البريدي"
                className={getInputClassName("address.postalCode")}
              />
              {shouldShowError("address.postalCode") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("address.postalCode")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* معلومات الطوارئ */}
        <section className="rounded-xl bg-white/80 dark:bg-gray-900/60 shadow p-6 space-y-6 border border-blue-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">معلومات الطوارئ</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="emergencyName" className="font-medium">
                اسم شخص للاتصال في الطوارئ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="emergencyName"
                value={formData.emergency.name}
                onChange={(e) => handleInputChange("emergency.name", e.target.value)}
                placeholder="أدخل الاسم"
                className={getInputClassName("emergency.name")}
              />
              {shouldShowError("emergency.name") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("emergency.name")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="emergencyPhone" className="font-medium">
                رقم الهاتف <span className="text-destructive">*</span>
              </Label>
              <Input
                id="emergencyPhone"
                value={formData.emergency.phone}
                onChange={(e) => handleInputChange("emergency.phone", e.target.value)}
                placeholder="أدخل رقم الهاتف"
                className={getInputClassName("emergency.phone")}
              />
              {shouldShowError("emergency.phone") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("emergency.phone")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="emergencyRelation" className="font-medium">
                العلاقة <span className="text-destructive">*</span>
              </Label>
              <Input
                id="emergencyRelation"
                value={formData.emergency.relation}
                onChange={(e) => handleInputChange("emergency.relation", e.target.value)}
                placeholder="أدخل العلاقة"
                className={getInputClassName("emergency.relation")}
              />
              {shouldShowError("emergency.relation") && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {getFieldError("emergency.relation")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* أزرار التحكم */}
        <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full md:w-auto text-base font-semibold"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || hasErrors}
            className="w-full md:w-auto bg-gradient-to-l from-primary to-blue-600 hover:from-blue-700 hover:to-primary text-base font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "جاري الحفظ..." : isEditing ? "تحديث" : "إضافة"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
