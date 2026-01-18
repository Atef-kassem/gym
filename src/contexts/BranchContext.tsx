import React, { createContext, useContext, useState, useEffect } from "react";
import { useGetAllBranchesQuery } from "@/services/branchesApi";

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  manager: string;
  status: "active" | "inactive" | "maintenance";
  type: "main" | "sub";
  openingDate: string;
  workingHours: {
    start: string;
    end: string;
  };
  services: string[];
  stats: {
    dailySales: number;
    monthlySales: number;
    customers: number;
    employees: number;
    vehicles: number;
    items: number;
    assets: number;
    accounts: number;
  };
}

interface BranchContextType {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch | null) => void;
  getActiveBranches: () => Branch[];
  getBranchById: (id: string) => Branch | undefined;
  canAccessBranch: (branchId: string) => boolean;
  isMultiBranchEnabled: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isMultiBranchEnabled] = useState(true);

  // جلب الفروع الحقيقية من الـ API
  const { data: apiBranches } = useGetAllBranchesQuery(undefined);

  useEffect(() => {
    const list: any[] = (apiBranches as any)?.data ?? (apiBranches as any) ?? [];
    const mapped: Branch[] = Array.isArray(list)
      ? list.map((b: any) => ({
          id: String(b.id ?? b.branch_id ?? b.ID ?? b.Id),
          name: b.arabicName || b.englishName || b.branch_name || b.name || String(b.id),
          code: b.code || "",
          city: b.city || "",
          address: b.address || "",
          phone: b.phoneNumber || "",
          manager: b.manager || "",
          status: (b.isActive === false ? "inactive" : "active") as Branch["status"],
          type: (b.type === "main" ? "main" : "sub") as Branch["type"],
          openingDate: b.openingDate || "",
          workingHours: { start: b.working_hours_from || "", end: b.working_hours_to || "" },
          services: [],
          stats: { dailySales: 0, monthlySales: 0, customers: 0, employees: 0, vehicles: 0, items: 0, assets: 0, accounts: 0 },
        }))
      : [];

    setBranches(mapped);
    if (!selectedBranch && mapped.length > 0) {
      setSelectedBranch(mapped[0]);
    }
  }, [apiBranches]);

  const getActiveBranches = () => branches.filter((branch) => branch.status === "active");

  const getBranchById = (id: string) => {
    return branches.find((branch) => branch.id === id);
  };

  const canAccessBranch = (branchId: string) => {
    return true;
  };

  return (
    <BranchContext.Provider
      value={{
        branches,
        selectedBranch,
        setSelectedBranch,
        getActiveBranches,
        getBranchById,
        canAccessBranch,
        isMultiBranchEnabled,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
}
