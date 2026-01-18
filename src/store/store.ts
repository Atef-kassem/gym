import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "@/services/apiSlice";
import { loyaltyApi } from "@/services/loyaltyApi";
import { companyApi } from "@/services/companyApi";
import { branchesApi } from "@/services/branchesApi";
import { manufacturersApi } from "@/services/manufacturersApi";
import { brandsApi } from "@/services/brandsApi";
import { supplierPaymentsApi } from "@/store/supplierPaymentsApi";
import { suppliersApi } from "@/store/suppliersApi";
import { supplierInvoicesApi } from "@/store/supplierInvoicesApi";
import { quickPurchaseOrdersApi } from "@/store/quickPurchaseOrdersApi.js";
import { expensesApi } from "@/store/expensesApi.js";
import { revenuesApi } from "@/store/revenuesApi.js";
import { motorcycleApi } from "@/services/motorcycleApi";
import { deliveryDriverApi } from "@/services/deliveryDriverApi";
import { deliveryOrderApi } from "@/services/deliveryOrderApi";
import { maintenanceApi } from "@/services/maintenanceApi";
import { shiftApi } from "@/services/shiftApi";
import { shiftSessionApi } from "@/services/shiftSessionApi";
import { membersApi } from "@/services/membersApi";
import { subscriptionsApi } from "@/services/subscriptionsApi";
import { subscriptionTransfersApi } from "@/services/subscriptionTransfersApi";
import { subscriptionRefundsApi } from "@/services/subscriptionRefundsApi";
import { memberAttendanceApi } from "@/services/memberAttendanceApi";
import { lockersApi } from "@/services/lockersApi";
import { employeesApi } from "@/services/employeesApi";
import { appManagementApi } from "@/services/appManagementApi";
import { membershipTypesApi } from "@/services/membershipTypesApi";
import { groupsApi } from "@/services/groupsApi";
import { invoicesReceiptsApi } from "@/services/invoicesReceiptsApi";
import { trainersApi } from "@/services/trainersApi";
import { classesApi } from "@/services/classesApi";
import { accountingApi } from "@/services/accountingApi";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [loyaltyApi.reducerPath]: loyaltyApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [branchesApi.reducerPath]: branchesApi.reducer,
    [manufacturersApi.reducerPath]: manufacturersApi.reducer,
    [brandsApi.reducerPath]: brandsApi.reducer,
    [supplierPaymentsApi.reducerPath]: supplierPaymentsApi.reducer,
    [suppliersApi.reducerPath]: suppliersApi.reducer,
    [supplierInvoicesApi.reducerPath]: supplierInvoicesApi.reducer,
    [quickPurchaseOrdersApi.reducerPath]: quickPurchaseOrdersApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
    [revenuesApi.reducerPath]: revenuesApi.reducer,
    [motorcycleApi.reducerPath]: motorcycleApi.reducer,
    [deliveryDriverApi.reducerPath]: deliveryDriverApi.reducer,
    [deliveryOrderApi.reducerPath]: deliveryOrderApi.reducer,
    [maintenanceApi.reducerPath]: maintenanceApi.reducer,
    [shiftApi.reducerPath]: shiftApi.reducer,
    [shiftSessionApi.reducerPath]: shiftSessionApi.reducer,
    [membersApi.reducerPath]: membersApi.reducer,
    [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
    [subscriptionTransfersApi.reducerPath]: subscriptionTransfersApi.reducer,
    [subscriptionRefundsApi.reducerPath]: subscriptionRefundsApi.reducer,
    [memberAttendanceApi.reducerPath]: memberAttendanceApi.reducer,
    [lockersApi.reducerPath]: lockersApi.reducer,
    [employeesApi.reducerPath]: employeesApi.reducer,
    [appManagementApi.reducerPath]: appManagementApi.reducer,
    [membershipTypesApi.reducerPath]: membershipTypesApi.reducer,
    [groupsApi.reducerPath]: groupsApi.reducer,
    [invoicesReceiptsApi.reducerPath]: invoicesReceiptsApi.reducer,
    [trainersApi.reducerPath]: trainersApi.reducer,
    [classesApi.reducerPath]: classesApi.reducer,
    [accountingApi.reducerPath]: accountingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      loyaltyApi.middleware,
      companyApi.middleware,
      branchesApi.middleware,
      manufacturersApi.middleware,
      brandsApi.middleware,
      supplierPaymentsApi.middleware,
      suppliersApi.middleware,
      supplierInvoicesApi.middleware,
      quickPurchaseOrdersApi.middleware,
      expensesApi.middleware,
      revenuesApi.middleware,
      motorcycleApi.middleware,
      deliveryDriverApi.middleware,
      deliveryOrderApi.middleware,
      maintenanceApi.middleware,
      shiftApi.middleware,
      shiftSessionApi.middleware,
      membersApi.middleware,
      subscriptionsApi.middleware,
      subscriptionTransfersApi.middleware,
      subscriptionRefundsApi.middleware,
      memberAttendanceApi.middleware,
      lockersApi.middleware,
      employeesApi.middleware,
      appManagementApi.middleware,
      membershipTypesApi.middleware,
      groupsApi.middleware,
      invoicesReceiptsApi.middleware,
      trainersApi.middleware,
      classesApi.middleware,
      accountingApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
