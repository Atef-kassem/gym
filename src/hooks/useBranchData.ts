import { useState } from 'react';
import { useBranch } from '@/contexts/BranchContext';
import { useGetAllWarehousesQuery } from '@/services/warehouseApi';

export interface BranchDataFilter {
  branchIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}

export function useBranchData() {
  const { branches, selectedBranch, getActiveBranches } = useBranch();
  const [loading, setLoading] = useState(false);

  const getFilteredData = <T>(
    data: T[],
    filter: BranchDataFilter,
    dataMapper: (item: T) => { branchId: string; date?: string; status?: string }
  ): T[] => {
    return data.filter(item => {
      const mapped = dataMapper(item);
      
      // تصفية حسب الفرع
      if (filter.branchIds && filter.branchIds.length > 0) {
        if (!filter.branchIds.includes(mapped.branchId)) {
          return false;
        }
      }
      
      // تصفية حسب التاريخ
      if (filter.dateFrom && mapped.date) {
        if (mapped.date < filter.dateFrom) {
          return false;
        }
      }
      
      if (filter.dateTo && mapped.date) {
        if (mapped.date > filter.dateTo) {
          return false;
        }
      }
      
      // تصفية حسب الحالة
      if (filter.status && mapped.status) {
        if (mapped.status !== filter.status) {
          return false;
        }
      }
      
      return true;
    });
  };

  const getBranchStats = (branchIds?: string[]) => {
    const targetBranches = branchIds 
      ? branches.filter(b => branchIds.includes(b.id))
      : [selectedBranch].filter(Boolean);

    if (targetBranches.length === 0) return null;

    const totalStats = targetBranches.reduce((acc, branch) => {
      if (!branch) return acc;
      
      return {
        dailySales: acc.dailySales + branch.stats.dailySales,
        monthlySales: acc.monthlySales + branch.stats.monthlySales,
        customers: acc.customers + branch.stats.customers,
        employees: acc.employees + branch.stats.employees,
        vehicles: acc.vehicles + branch.stats.vehicles,
        items: acc.items + branch.stats.items,
        assets: acc.assets + branch.stats.assets,
        accounts: acc.accounts + branch.stats.accounts,
      };
    }, {
      dailySales: 0,
      monthlySales: 0,
      customers: 0,
      employees: 0,
      vehicles: 0,
      items: 0,
      assets: 0,
      accounts: 0,
    });

    return {
      ...totalStats,
      branchCount: targetBranches.length,
      branches: targetBranches,
    };
  };

  const { data: apiWarehouses } = useGetAllWarehousesQuery(undefined);

  const getWarehousesByBranch = (branchId?: string) => {
    const targetBranchId = branchId || selectedBranch?.id;
    if (!targetBranchId) return [] as Array<{ id: string; name: string; isMain: boolean }>;

    const list: any[] = (apiWarehouses as any)?.data?.warehouses ?? [];
    const filtered = Array.isArray(list)
      ? list.filter((w: any) => String(w.branch_id) === String(targetBranchId))
      : [];

    return filtered.map((w: any) => ({
      id: String(w.warehouse_id ?? w.id ?? w.ID),
      name: w.name_ar || w.name_en || w.warehouse_name || w.name || String(w.warehouse_id),
      isMain: w.type === 'main',
    }));
  };

  const canPerformAction = (action: string, branchId?: string) => {
    const targetBranchId = branchId || selectedBranch?.id;
    const branch = branches.find(b => b.id === targetBranchId);
    
    if (!branch) return false;
    
    // منطق صلاحيات العمليات حسب نوع الفرع وحالته
    if (branch.status === 'maintenance') {
      // في حالة الصيانة، فقط عمليات القراءة مسموحة
      return ['view', 'read', 'export'].includes(action);
    }
    
    if (branch.type === 'sub') {
      // الفروع الفرعية قد تحتاج موافقات إضافية لبعض العمليات
      const restrictedActions = ['delete_opening_stock', 'lock_opening_stock'];
      if (restrictedActions.includes(action)) {
        return false; // يحتاج موافقة من الفرع الرئيسي
      }
    }
    
    return true;
  };

  return {
    branches,
    selectedBranch,
    getActiveBranches,
    getFilteredData,
    getBranchStats,
    getWarehousesByBranch,
    canPerformAction,
    loading,
  };
}