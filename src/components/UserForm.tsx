import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserFormData } from "@/types/user";
import { UserIcon, Mail, Phone, IdCard, AlertCircle, Key } from "lucide-react";

interface UserFormProps {
  formData: UserFormData;
  onInputChange: (field: string, value: string | number | object) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  isEditing: boolean;
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
      required: true, // مطلوبة عند الإضافة
      minLength: 6,
      message: {
        required: 'كلمة المرور مطلوبة',
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


  // Handle input change with validation
  const handleInputChange = (field: string, value: string | number | object) => {
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Validate field
    const error = validateField(field, value);

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
      
      // Special handling for password: required only when adding, optional when editing
      if (field === 'password') {
        if (!isEditing) {
          // Required when adding
          const error = validateField(field, value);
          if (error) {
            newErrors[field] = error;
          }
        } else {
          // Optional when editing, but validate if provided
          if (value && value.toString().trim() !== '') {
            const error = validateField(field, value);
            if (error) {
              newErrors[field] = error;
            }
          }
        }
      } else {
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

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
                كلمة المرور {!isEditing && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="أدخل كلمة المرور"
                required={!isEditing}
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
