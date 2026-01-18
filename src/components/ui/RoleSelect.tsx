import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RoleSelectProps {
  roles: any[];
  selectedRole: string;
  onRoleChange: (value: string) => void;
  isLoading: boolean;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({
  roles,
  selectedRole,
  onRoleChange,
  isLoading,
}) => {
  // Debug: Log roles data
  console.log('RoleSelect - roles:', roles);
  console.log('RoleSelect - roles type:', typeof roles);
  console.log('RoleSelect - roles isArray:', Array.isArray(roles));
  console.log('RoleSelect - selectedRole:', selectedRole);
  console.log('RoleSelect - isLoading:', isLoading);
  
  // Ensure roles is an array
  const safeRoles = Array.isArray(roles) ? roles : [];
  
  console.log('RoleSelect - safeRoles:', safeRoles);
  console.log('RoleSelect - safeRoles.length:', safeRoles.length);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="role">الدور *</Label>
      <Select
        value={selectedRole}
        onValueChange={onRoleChange}
        disabled={isLoading}
      >
        <SelectTrigger id="role" className="w-full">
          <SelectValue placeholder={isLoading ? "جاري التحميل..." : "اختر الدور"} />
        </SelectTrigger>
        <SelectContent>
          {safeRoles.length > 0 ? (
            safeRoles
              .filter(role => {
                const roleValue = role.roleName || role.name || role.id?.toString() || '';
                return roleValue.trim() !== '';
              })
              .map((role) => {
                // التأكد من أن value ليس فارغاً
                const roleValue = role.roleName || role.name || role.id?.toString() || `role-${role.id || Math.random()}`;
                // Ensure it's never an empty string
                const safeRoleValue = roleValue.trim() !== '' ? roleValue : `role-${role.id || Math.random()}`;
                return (
                  <SelectItem key={role.id || Math.random()} value={safeRoleValue}>
                    {role.roleName || role.name || `دور ${role.id}`}
                  </SelectItem>
                );
              })
          ) : (
            <SelectItem value="no-roles-available" disabled>
              {isLoading ? "جاري التحميل..." : "لا توجد أدوار متاحة"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
