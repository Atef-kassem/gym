import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BranchSectionSelectProps {
  branches: any[];
  sections: any[];
  sectionsByBranch: any[];
  selectedBranch: string;
  selectedSection: string;
  onBranchChange: (value: string) => void;
  onSectionChange: (value: string) => void;
  isLoadingBranches: boolean;
  isLoadingSections: boolean;
}

export const BranchSectionSelect: React.FC<BranchSectionSelectProps> = ({
  branches,
  sections,
  sectionsByBranch,
  selectedBranch,
  selectedSection,
  onBranchChange,
  onSectionChange,
  isLoadingBranches,
  isLoadingSections,
}) => {
  // Debug: Log data
  console.log('BranchSectionSelect - branches:', branches);
  console.log('BranchSectionSelect - sections:', sections);
  console.log('BranchSectionSelect - sectionsByBranch:', sectionsByBranch);
  console.log('BranchSectionSelect - selectedBranch:', selectedBranch);
  console.log('BranchSectionSelect - selectedSection:', selectedSection);
  console.log('BranchSectionSelect - isLoadingBranches:', isLoadingBranches);
  console.log('BranchSectionSelect - isLoadingSections:', isLoadingSections);
  
  // Ensure data is arrays
  const safeBranches = Array.isArray(branches) ? branches : [];
  const safeSections = Array.isArray(sections) ? sections : [];
  const safeSectionsByBranch = Array.isArray(sectionsByBranch) ? sectionsByBranch : [];
  
  console.log('BranchSectionSelect - safeBranches:', safeBranches);
  console.log('BranchSectionSelect - safeBranches.length:', safeBranches.length);
  
  // الحصول على الأقسام المتاحة للفرع المحدد
  const availableSections = selectedBranch 
    ? safeSectionsByBranch.filter(section => section.branchId?.toString() === selectedBranch)
    : safeSections;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* اختيار الفرع */}
      <div className="space-y-2">
        <Label htmlFor="branch">الفرع *</Label>
        <Select
          value={selectedBranch}
          onValueChange={onBranchChange}
          disabled={isLoadingBranches}
        >
          <SelectTrigger id="branch" className="w-full">
            <SelectValue placeholder={isLoadingBranches ? "جاري التحميل..." : "اختر الفرع"} />
          </SelectTrigger>
          <SelectContent>
            {safeBranches.length > 0 ? (
              safeBranches
                .filter(branch => {
                  const branchValue = branch.id?.toString() || '';
                  return branchValue.trim() !== '';
                })
                .map((branch) => {
                  // التأكد من أن value ليس فارغاً
                  const branchValue = branch.id?.toString() || `branch-${branch.id || Math.random()}`;
                  // Ensure it's never an empty string
                  const safeBranchValue = branchValue.trim() !== '' ? branchValue : `branch-${branch.id || Math.random()}`;
                  return (
                    <SelectItem key={branch.id || Math.random()} value={safeBranchValue}>
                      {branch.arabicName || branch.branchName || branch.name || `فرع ${branch.id}`}
                    </SelectItem>
                  );
                })
            ) : (
              <SelectItem value="no-branches-available" disabled>
                {isLoadingBranches ? "جاري التحميل..." : "لا توجد فروع متاحة"}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* اختيار القسم */}
      <div className="space-y-2">
        <Label htmlFor="section">القسم</Label>
        <Select
          value={selectedSection}
          onValueChange={onSectionChange}
          disabled={isLoadingSections || !selectedBranch}
        >
          <SelectTrigger id="section" className="w-full">
            <SelectValue 
              placeholder={
                !selectedBranch 
                  ? "اختر الفرع أولاً" 
                  : isLoadingSections 
                    ? "جاري التحميل..." 
                    : "لا توجد أقسام متاحة"
              } 
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-section">بدون قسم</SelectItem>
            {availableSections.length > 0 ? (
              availableSections
                .filter(section => {
                  const sectionValue = section.id?.toString() || '';
                  return sectionValue.trim() !== '';
                })
                .map((section) => {
                  // التأكد من أن value ليس فارغاً
                  const sectionValue = section.id?.toString() || `section-${section.id || Math.random()}`;
                  // Ensure it's never an empty string
                  const safeSectionValue = sectionValue.trim() !== '' ? sectionValue : `section-${section.id || Math.random()}`;
                  return (
                    <SelectItem key={section.id || Math.random()} value={safeSectionValue}>
                      {section.sectionName || section.name || `قسم ${section.id}`}
                    </SelectItem>
                  );
                })
            ) : (
              <SelectItem value="no-sections-available" disabled>
                لا توجد أقسام متاحة
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
