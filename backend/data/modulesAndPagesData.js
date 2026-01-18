// بيانات الوحدات والصفحات المستخدمة في الواجهة
const modulesAndPagesData = [
  
  {
    moduleName: "system-administration",
    moduleTitle: "إدارة النظام",
    pages: [
      {
        pageName: "company-settings",
        pageTitle: "بيانات الشركة",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "branch-management",
        pageTitle: "الفروع",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
     
      {
        pageName: "user-management",
        pageTitle: "المستخدمون",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "roles-permissions",
        pageTitle: "الأدوار والصلاحيات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      
    ]
  },
  {
    moduleName: "inventory",
    moduleTitle: "إدارة المخازن",
    pages: [
      
      {
        pageName: "inventory-settings",
        pageTitle: "الأعدادات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "product-management",
        pageTitle: "المنتجات والخدمات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      }
    ]
  },
  
  {
    moduleName: "procurement",
    moduleTitle: "إدارة المشتريات",
    pages: [
      
      {
        pageName: "quick-purchase-orders",
        pageTitle: "أمر شراء سريع",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "purchase-returns",
        pageTitle: "مرتجع المشتريات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      }
    ]
  },
  {
    moduleName: "crm",
    moduleTitle: "إدارة الاعضاء والاشتراكات",
    pages: [
      // الاشتراكات والمدفوعات
      {
        pageName: "subscriptions",
        pageTitle: "الاشتراكات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "add-subscription",
        pageTitle: "إضافة اشتراك جديد",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "special-subscriptions",
        pageTitle: "اشتراكات خاصة",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "time-based-special-subscriptions",
        pageTitle: "اشتراكات خاصة بوقت",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      
      {
        pageName: "invoices-receipts",
        pageTitle: "الإيصالات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "financial-reports",
        pageTitle: "التقارير المالية",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "discounts-offers",
        pageTitle: "الخصومات والعروض",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      
      
      {
        pageName: "subscription-transfers",
        pageTitle: "تحويلات الاشتراكات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "subscription-member-transfer",
        pageTitle: "تحويل الاشتراكات بين الأعضاء",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "subscription-refunds",
        pageTitle: "مردودات الاشتراكات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "member-form",
        pageTitle: "استمارة عضو",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      
    ]
  },
  {
    moduleName: "reception",
    moduleTitle: "إدارة البيع",
    pages: [
      {
        pageName: "booking-dashboard",
        pageTitle: "لوحة تحكم البيع",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "create-booking",
        pageTitle: "إنشاء ايصال بيع جديدة",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "bookings-list",
        pageTitle: "قائمة البيع",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "shifts-list",
        pageTitle: "إدارة الورديات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "add-shift",
        pageTitle: "إضافة وردية",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "shift-revenue",
        pageTitle: "إيرادات الوردية",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "daily-shift-report",
        pageTitle: "تقرير الورديات اليومي",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      }
    ]
  },

 
 
  {
    moduleName: "finance",
    moduleTitle: "الإدارة المالية",
    pages: [
      {
        pageName: "finance-dashboard",
        pageTitle: "لوحة تحكم المالية",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "expense-management",
        pageTitle: "إدارة المصروفات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "revenue-management",
        pageTitle: "إدارة الإيرادات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "expense-reports",
        pageTitle: "تقارير المصروفات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "revenue-reports",
        pageTitle: "تقارير الإيرادات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "financial-analysis",
        pageTitle: "التحليل المالي",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "profit-loss",
        pageTitle: "الأرباح والخسائر",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      }
    ]
  },
  {
    moduleName: "accounting",
    moduleTitle: "المحاسبة المالية",
    pages: [
      {
        pageName: "accounting-dashboard",
        pageTitle: "لوحة تحكم المحاسبة المالية",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "journal-entries",
        pageTitle: "القيود المحاسبية",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "chart-of-accounts",
        pageTitle: "شجرة الحسابات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "income-statement",
        pageTitle: "قائمة الدخل",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "balance-sheet",
        pageTitle: "الميزانية العمومية",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "cash-flow",
        pageTitle: "قائمة التدفق النقدي",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "accounting-settings",
        pageTitle: "إعدادات المحاسبة المالية",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "trial-balance",
        pageTitle: "ميزان المراجعة",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "account-statement",
        pageTitle: "كشف حساب",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "general-ledger",
        pageTitle: "دفتر الأستاذ العام",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      }
    ]
  },
 
   {
    moduleName: "gym-management",
    moduleTitle: "إدارة النادي الرياضي",
    departments: [
      {
        departmentName: "dashboard",
        departmentTitle: "لوحة التحكم",
        pages: [
          {
            pageName: "gym-dashboard",
            pageTitle: "لوحة تحكم النادي الرياضي",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          }
        ]
      },
      {
        departmentName: "membership-management",
        departmentTitle: "إدارة العضوية",
        pages: [
          {
            pageName: "membership-management",
            pageTitle: "إدارة العضوية",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "barcode-management",
            pageTitle: "إدارة الباركود",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "barcode-search",
            pageTitle: "البحث بالباركود",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          }
        ]
      },
      {
        departmentName: "locker-management",
        departmentTitle: "إدارة اللوكر",
        pages: [
          {
            pageName: "lockers-list",
            pageTitle: "قائمة اللوكر",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "add-locker",
            pageTitle: "إضافة لوكر",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "locker-settings",
            pageTitle: "إعدادات اللوكر",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          }
        ]
      },
      {
        departmentName: "training-programs",
        departmentTitle: "البرامج التدريبية",
        pages: [
          {
            pageName: "training-programs",
            pageTitle: "البرامج التدريبية",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "workout-templates",
            pageTitle: "قوالب التمارين",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "strength-training",
            pageTitle: "تمارين القوة",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "progress-tracking",
            pageTitle: "تتبع التقدم",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "fitness-assessments",
            pageTitle: "التقييمات البدنية",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          }
        ]
      },
      {
        departmentName: "scheduling",
        departmentTitle: "الجدولة والحجوزات",
        pages: [
          {
            pageName: "scheduling",
            pageTitle: "الجدولة",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "classes",
            pageTitle: "إدارة الحصص",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "class-booking",
            pageTitle: "حجز الحصص",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "room-bookings",
            pageTitle: "حجوزات القاعات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "personal-sessions",
            pageTitle: "المواعيد الشخصية",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          }
        ]
      },
      {
        departmentName: "trainer-management",
        departmentTitle: "إدارة المدربين",
        pages: [
          {
            pageName: "trainer-management",
            pageTitle: "إدارة المدربين",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "trainer-payments",
            pageTitle: "أجور المدربين",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "trainer-ratings",
            pageTitle: "تقييمات المدربين",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "trainer-search",
            pageTitle: "بحث عن المدرب",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          }
        ]
      },
      {
        departmentName: "spa-services",
        departmentTitle: "خدمات SPA",
        pages: [
          {
            pageName: "spa-services",
            pageTitle: "خدمات SPA",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          }
        ]
      },
      {
        departmentName: "settings",
        departmentTitle: "الإعدادات",
        pages: [
          {
            pageName: "membership-settings",
            pageTitle: "إعدادات العضوية",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "attendance-settings",
            pageTitle: "إعدادات الحضور",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "workout-programs-settings",
            pageTitle: "إعدادات البرامج التدريبية",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "workout-templates-settings",
            pageTitle: "إعدادات قوالب التمارين",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "trainer-settings",
            pageTitle: "إعدادات المدربين",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "trainer-payments-settings",
            pageTitle: "إعدادات أجور المدربين",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "spa-services-settings",
            pageTitle: "إعدادات خدمات SPA",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "notifications-settings",
            pageTitle: "إعدادات الإشعارات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "subscription-settings",
            pageTitle: "إعدادات الاشتراكات والمدفوعات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "locker-settings",
            pageTitle: "إعدادات اللوكر",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "facility-settings",
            pageTitle: "إعدادات المرافق والمعدات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "membership-cards-settings",
            pageTitle: "إعدادات بطاقات العضوية",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "groups-categories-settings",
            pageTitle: "إعدادات المجموعات والفئات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "surveys-settings",
            pageTitle: "إعدادات الاستبيانات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "payment-settings",
            pageTitle: "إعدادات المدفوعات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "invoice-settings",
            pageTitle: "إعدادات الإيصالات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "financial-reports-settings",
            pageTitle: "إعدادات التقارير المالية",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "discounts-settings",
            pageTitle: "إعدادات الخصومات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "progress-tracking-settings",
            pageTitle: "إعدادات تتبع التقدم",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "assessments-settings",
            pageTitle: "إعدادات التقييمات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "scheduling-settings",
            pageTitle: "إعدادات الجدولة",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "class-booking-settings",
            pageTitle: "إعدادات حجز الحصص",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "room-booking-settings",
            pageTitle: "إعدادات حجوزات القاعات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "personal-sessions-settings",
            pageTitle: "إعدادات المواعيد الشخصية",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "trainer-ratings-settings",
            pageTitle: "إعدادات تقييمات المدربين",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "equipment-inventory-settings",
            pageTitle: "إعدادات جرد المعدات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "equipment-maintenance-settings",
            pageTitle: "إعدادات صيانة المعدات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "sales-settings",
            pageTitle: "إعدادات المبيعات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "marketing-settings",
            pageTitle: "إعدادات التسويق",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "loyalty-programs-settings",
            pageTitle: "إعدادات برامج الولاء",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "reports-settings",
            pageTitle: "إعدادات التقارير",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "analytics-settings",
            pageTitle: "إعدادات التحليلات",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "mobile-app-settings",
            pageTitle: "إعدادات التطبيق المحمول",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "general-settings",
            pageTitle: "الإعدادات العامة",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "security-settings",
            pageTitle: "إعدادات الأمان",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          },
          {
            pageName: "club-settings",
            pageTitle: "إعدادات النادي",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          }
        ]
      },
      {
        departmentName: "support",
        departmentTitle: "الدعم الفني",
        pages: [
          {
            pageName: "technical-support",
            pageTitle: "الدعم الفني",
            permissions: {
              canView: false,
              canCreate: false,
              canUpdate: false,
              canDelete: false,
              canExport: false,
              canImport: false
            }
          }
        ]
      }
    ],
    // للحفاظ على التوافق مع الكود الحالي - pages سيكون مسطحاً من جميع الإدارات
    pages: []
  },
  
  // إدارة الموارد البشرية
  {
    moduleName: "hr-management",
    moduleTitle: "إدارة الموارد البشرية",
    pages: [
      {
        pageName: "hr-dashboard",
        pageTitle: "لوحة تحكم الموارد البشرية",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "employee-management",
        pageTitle: "إدارة الموظفين",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "attendance-management",
        pageTitle: "الحضور والانصراف",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "leave-management",
        pageTitle: "إدارة الإجازات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "payroll-management",
        pageTitle: "إدارة الرواتب",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "recruitment",
        pageTitle: "التوظيف والاستقطاب",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "training",
        pageTitle: "التدريب والتطوير",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "performance",
        pageTitle: "تقييم الأداء",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "benefits",
        pageTitle: "إدارة المزايا",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "contracts",
        pageTitle: "إدارة العقود",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "documents",
        pageTitle: "إدارة الوثائق",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "shifts",
        pageTitle: "إدارة المناوبات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "reports",
        pageTitle: "التقارير والتحليلات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      }
    ]
  },
  
  // إدارة المستودعات

  
  
  // إدارة التطبيق
  {
    moduleName: "app-management",
    moduleTitle: "إدارة التطبيق",
    pages: [
      {
        pageName: "about-app",
        pageTitle: "عن التطبيق",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "sent-invitations",
        pageTitle: "الدعوات المرسلة",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "accepted-invitations",
        pageTitle: "الدعوات المقبولة من قبل الإدارة",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "attended-invitations",
        pageTitle: "الدعوات المسجلة حضور بالفرع",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "rejected-invitations",
        pageTitle: "الدعوات المرفوضة",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "app-offers",
        pageTitle: "إدارة العروض",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "app-trainers",
        pageTitle: "إدارة المدربين",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "exercise-categories",
        pageTitle: "إدارة تصنيفات التمارين",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "app-exercises",
        pageTitle: "إدارة التمارين",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "app-news",
        pageTitle: "إدارة الأخبار",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      },
      {
        pageName: "app-ads",
        pageTitle: "إدارة الإعلانات",
        permissions: {
          canView: false,
          canCreate: false,
          canUpdate: false,
          canDelete: false,
          canExport: false,
          canImport: false
        }
      }
    ]
  }
 
];

// تحويل departments إلى pages مسطحة للوحدات التي تحتوي على departments (للتوافق مع الكود الحالي)
modulesAndPagesData.forEach(module => {
  if (module.departments && Array.isArray(module.departments) && module.departments.length > 0) {
    // تحويل جميع الصفحات من جميع الإدارات إلى مصفوفة pages مسطحة
    module.pages = module.departments.flatMap(dept => dept.pages || []);
  }
});






module.exports = modulesAndPagesData;
