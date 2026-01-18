import { useState } from "react";
import { Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UsersList } from "@/components/Users/UsersList";
import { UserForm } from "@/components/UserForm";
import { UserPermissionsForm } from "@/components/Users/UserPermissionsForm";

export default function UsersSettings() {
  const [activeTab, setActiveTab] = useState("list");
  
  const {
    users,
    editingUser,
    formData,
    branches,
    sections,
    sectionsByBranch,
    roles,
    isLoadingUsers,
    isLoadingBranches,
    isLoadingSections,
    isLoadingRoles,
    isCreatingUser,
    isUpdatingUser,
    handleInputChange,
    handleSave,
    handleEdit,
    handleDelete,
    handleToggleStatus,
    handlePermissionsSave,
    handleModulesSave,
    resetForm
  } = useUserManagement();

  const handleAddUser = () => {
    resetForm();
    setActiveTab("personal");
  };

  const handleEditUser = (user: any) => {
    handleEdit(user);
    setActiveTab("personal");
  };

  const handleSaveAndReturn = async () => {
    await handleSave();
    setActiveTab("list");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-blue bg-clip-text text-transparent">
            إدارة المستخدمين
          </h1>
          <p className="text-muted-foreground">إضافة وإدارة مستخدمي النظام</p>
        </div>
        <div className="flex gap-2">
          {activeTab !== "list" && (
            <Button 
              onClick={handleSaveAndReturn}
              className="gap-2 bg-gradient-to-r from-primary to-secondary-blue hover:from-primary/90 hover:to-secondary-blue/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-4 h-4" />
              {editingUser ? "تحديث المستخدم" : "حفظ المستخدم"}
            </Button>
          )}
          <Button 
            onClick={handleAddUser}
            variant="outline"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة مستخدم جديد
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 p-1 bg-gradient-to-r from-card to-card/80 border shadow-lg">
          <TabsTrigger 
            value="list" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            قائمة المستخدمين
          </TabsTrigger>
          <TabsTrigger 
            value="personal" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            البيانات الشخصية
          </TabsTrigger>
          <TabsTrigger 
            value="permissions" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary-blue data-[state=active]:text-white transition-all duration-300 hover:scale-105"
          >
            الصلاحيات
          </TabsTrigger>
        </TabsList>

        {/* Users List */}
        <TabsContent value="list" className="space-y-6">
          <UsersList 
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoadingUsers}
          />
        </TabsContent>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <UserForm 
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSave}
            onCancel={() => setActiveTab("list")}
            isLoading={isCreatingUser || isUpdatingUser}
            isEditing={!!editingUser}
          />
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions" className="space-y-6">
          <UserPermissionsForm userId={editingUser?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}