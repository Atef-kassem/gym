/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Package, Save, X, Upload, DollarSign, Barcode, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import {
  useGetAllCategoriesQuery,
} from "@/services/categoriesApi";
import {
  useGetAllBrandsQuery,
} from "@/services/brandsApi";
import {
  useGetAllManufacturersQuery,
} from "@/services/manufacturersApi";
import {
  useGetAllSuppliersQuery,
} from "@/services/suppliersApi";
import {
  useGetAllWarehousesQuery,
} from "@/services/warehouseApi";
import {
  useGetAllBranchesQuery,
} from "@/services/branchesApi";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/services/productApi";
import {
  useCreateProductBranchMutation,
  useUpdateProductBranchMutation,
} from "@/services/productBranchesApi";
import {
  useCreateInventoryMutation,
} from "@/services/inventoryApi";

interface ProductFormProps {
  editingProduct?: Record<string, any> | null;
  onSave: () => void;
  onCancel: () => void;
}

interface DiagnosticInfo {
  categories: { count: number; error: any };
  branches: { count: number; error: any };
  warehouses: { count: number; error: any };
  brands: { count: number; error: any };
  manufacturers: { count: number;
