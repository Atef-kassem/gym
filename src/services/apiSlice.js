import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

// Resolve API base URL and prefix from env
const resolvedApiBaseUrl = import.meta?.env?.VITE_API_BASE_URL || "https://metagym.metacodecx.com";
const resolvedApiPrefix = import.meta?.env?.VITE_API_PREFIX || "/api/v1";

// Ensure proper URL formatting
const baseUrl = resolvedApiBaseUrl.endsWith('/') 
  ? `${resolvedApiBaseUrl}${resolvedApiPrefix.replace(/^\//, '')}` 
  : `${resolvedApiBaseUrl}/${resolvedApiPrefix.replace(/^\//, '')}`;

console.log('API Base URL:', baseUrl);

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState, endpoint, type, arg }) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    
    // إذا كان body هو FormData، لا تضع Content-Type (سيتم تعيينه تلقائياً مع boundary)
    // RTK Query will automatically handle this, but we need to make sure not to override it
    
    return headers;
  },
});

// Handle non-JSON error bodies
const baseQueryWithHandling = async (args, api, extraOptions) => {
  try {
    const result = await rawBaseQuery(args, api, extraOptions);
    
    // Log the request and response for debugging
    console.log("API Request:", args);
    console.log("API Response:", result);
    
    if (result && result.error) {
      const err = result.error;
      
      // Log error details for debugging
      console.error("API Error:", err);
      
      // Convert PARSING_ERROR from text responses into a friendly shape
      if (err.status === "PARSING_ERROR") {
        const originalStatus = err.originalStatus;
        return {
          error: {
            status: originalStatus || "PARSING_ERROR",
            data: { message: "Unexpected response from server." },
          },
        };
      }
      
      if (err.status === "FETCH_ERROR") {
        return {
          error: {
            status: "FETCH_ERROR",
            data: { message: "Network error. Check connection or backend status." },
          },
        };
      }
      
      // Handle HTTP status errors
      if (err.status >= 400) {
        let errorMessage = "Server error occurred";
        
        if (err.status === 500) {
          errorMessage = "Internal server error - please try again later";
        } else if (err.status === 400) {
          errorMessage = err.data?.message || "Bad request - check your data";
        } else if (err.status === 401) {
          errorMessage = "Unauthorized - please login again";
        } else if (err.status === 403) {
          errorMessage = "Forbidden - you don't have permission";
        } else if (err.status === 404) {
          errorMessage = "Resource not found";
        }
        
        return {
          error: {
            status: err.status,
            data: { 
              message: errorMessage,
              originalError: err.data 
            },
          },
        };
      }
    }
    
    return result;
  } catch (error) {
    console.error("Unexpected error in baseQueryWithHandling:", error);
    return {
      error: {
        status: "UNKNOWN_ERROR",
        data: { message: "An unexpected error occurred" },
      },
    };
  }
};

// Add a small retry for transient errors like 5xx
const baseQuery = retry(baseQueryWithHandling, { maxRetries: 2 });

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    // User related
    "User",
    "UserPermissions",
    "UserModules",
    "UserRoles",
    "UserAuditLog",
    "UserLoginHistory",
    
    // Role related
    "Role",
    "RolePermissions",
    "RoleUsers",
    "RoleAuditLog",
    "RoleStatistics",
    
    // System related
    "SystemModules",
    "PermissionTypes",
    
    // Audit related
    "AuditLog",
    "SystemAuditLog",
    "AuditStatistics",
    "LoginHistory",
    "FailedLogins",
    "SecurityEvents",
    "DataAccessLogs",
    "PermissionChangeLogs",
    
    // Existing types
    "Product",
    "Branch",
    "Company",
    "Category",
    "Brand",
    "Manufacturer",
    "Supplier",
    "Warehouse",
    "Storage",
    "Inventory",
    "Service",
    "UnitTemplate",
    "Permission",
    "Booking",
    "Table",
    "QuickSale",
    "QuickSaleStats",
    "Section",
    "CompositeProduct",
    "ProductBranch",
    "RolePermission",
    "Consumable",
    "OpeningStock",
    "SparePart",
    // Stock taking related
    "StockTaking",
    "CountItems",
    "Adjustments",
    "Statistics",
    // Procurement
    "RFQ",
    "Quotation",
    "Requisition",
    "Approval",
    "ProcurementSettings",
    // Invoices & payments
    "PurchaseInvoice",
    "SupplierPayment",
    // Returns
    "PurchaseReturn",
    "Customer",
    "Campaign",
    "Vehicle",
    "Feedback",
    "Survey",
    "SurveyResponse",
    "POSDevice",
    "POSPaymentMethod",
    "POSNotificationRule",
    "POSReportTemplate",
    "POSInvoiceTemplate",
    "POSInvoice",
    "POSPayment",
    
  ],
  endpoints: (builder) => ({
    // Mock data endpoints for when backend is not available
    getMockManufacturers: builder.query({
      queryFn: () => {
        return {
          data: {
            manufacturers: [
              {
                manufacturer_id: 1,
                name_ar: "شركة تويوتا",
                name_en: "Toyota",
              },
              {
                manufacturer_id: 2,
                name_ar: "شركة هوندا",
                name_en: "Honda",
              },
              {
                manufacturer_id: 3,
                name_ar: "شركة نيسان",
                name_en: "Nissan",
              },
              {
                manufacturer_id: 4,
                name_ar: "شركة فورد",
                name_en: "Ford",
              },
              {
                manufacturer_id: 5,
                name_ar: "شركة شل",
                name_en: "Shell",
              },
              {
                manufacturer_id: 6,
                name_ar: "شركة كاسترول",
                name_en: "Castrol",
              },
            ],
          },
        };
      },
      providesTags: ["Manufacturer"],
    }),

    getMockSuppliers: builder.query({
      queryFn: () => {
        return {
          data: {
            suppliers: [
              {
                supplier_id: 1,
                name_ar: "مورد  الكافية الأول",
                name_en: "First Auto Supplier",
              },
              {
                supplier_id: 2,
                name_ar: "مورد قطع   ",
                name_en: "Spare Parts Supplier",
              },
              {
                supplier_id: 3,
                name_ar: "مورد الزيوت",
                name_en: "Oil Supplier",
              },
              {
                supplier_id: 4,
                name_ar: "مورد المواد الكيميائية",
                name_en: "Chemical Supplier",
              },
              {
                supplier_id: 5,
                name_ar: "مورد الأدوات",
                name_en: "Tools Supplier",
              },
            ],
          },
        };
      },
      providesTags: ["Supplier"],
    }),
  }),
});
