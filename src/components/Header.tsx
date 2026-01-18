import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Calendar,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

// Meta Codecx header palette
const LIGHT_BG = "bg-[hsl(var(--background))]/95";
const DARK_COFFEE_GRADIENT =
  "bg-gradient-to-l from-[#050608] via-[#11131b] to-[#1b2030]";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // الحصول على بيانات المستخدم
  const userName =
    user?.name || user?.username || user?.email || "المستخدم";

  // التعامل مع role كـ object أو string
  let userRole = "مستخدم";
  if (user?.role) {
    if (typeof user.role === "string") {
      userRole = user.role;
    } else if (typeof user.role === "object" && user.role.roleName) {
      userRole = user.role.roleName;
    }
  } else if (user?.roleName) {
    userRole = user.roleName;
  }

  const userEmail = user?.email || "user@example.com";
  const userInitials =
    userName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2) || "أح";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getCurrentFiscalYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    // العام المالي يبدأ من أبريل
    const fiscalYear = now.getMonth() >= 3 ? year : year - 1;
    return `${fiscalYear}/${fiscalYear + 1}`;
  };

  // Determine header background based on theme
  const headerBg =
    theme === "dark"
      ? DARK_COFFEE_GRADIENT
      : LIGHT_BG + " bg-opacity-95";

  // For text color in logo and header - ألوان البنفسجي الأزرق من اللوجو
  const logoTextGradient =
    theme === "dark"
      ? "bg-gradient-to-r from-indigo-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent"
      : "bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400 bg-clip-text text-transparent";

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-primary/25 ${headerBg} backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-[rgba(5,6,8,0.85)] shadow-elegant transition-colors duration-500`}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4 order-1">
          <SidebarTrigger className="text-foreground hover:bg-primary/15 dark:hover:bg-primary/20 hover:scale-105 transition-all duration-200 p-2 rounded-lg border border-transparent hover:border-primary/30" />

          {/* Logo and Company Name */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 mr-4 group cursor-pointer"
          >
            <div className="relative">
              <img
                src="/logo.jpeg"
                alt="Meta Codecx"
                className="w-12 h-12 rounded-xl shadow-lg ring-2 ring-primary/45 hover:ring-primary/65 transition-all duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="hidden md:block text-right">
              <h1
                className={`text-xl font-bold ${logoTextGradient} group-hover:from-indigo-400 group-hover:to-blue-300 transition-all duration-300`}
              >
                Meta Codecx
              </h1>
              <p className="text-xs text-muted-foreground font-medium group-hover:text-foreground/80 transition-colors duration-300">
                منصة إدارة نادي Meta Codecx المتكاملة
              </p>
            </div>
            {/* Show only logo on small screens */}
            <div className="md:hidden text-right">
              <h1
                className={`text-lg font-bold ${logoTextGradient}`}
              >
                Meta Codecx
              </h1>
            </div>
          </Link>

          <div className="relative w-80 max-w-sm animate-fade-in">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث..."
              className={`pr-10 pl-4 transition-all duration-300 rounded-xl border focus-visible:ring-0 focus-visible:ring-offset-0 ${
                theme === "dark"
                  ? "bg-[rgba(15,17,23,0.7)] border-sidebar-border focus:bg-[rgba(10,12,18,0.9)] focus:border-primary"
                  : "bg-indigo-50/50 border-primary/30 focus:bg-white focus:border-primary"
              }`}
            />
          </div>
        </div>

        <div className="flex items-center order-2 animate-fade-in">
          <div className="flex items-center gap-6">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                theme === "dark"
                  ? "bg-[rgba(17,19,27,0.65)] border-sidebar-border"
                  : "bg-indigo-50/60 border-primary/30"
              }`}
            >
              <Calendar className="h-4 w-4 text-primary" />
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {formatDate(currentDate)}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
                theme === "dark"
                  ? "bg-[rgba(17,19,27,0.65)] border-sidebar-border"
                  : "bg-indigo-50/60 border-primary/30"
              }`}
            >
              <Clock className="h-4 w-4 text-primary" />
              <div className="text-right">
                <p className="text-lg font-bold text-primary font-mono">
                  {formatTime(currentDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-l from-white via-indigo-100 to-blue-200 text-foreground shadow-glow dark:from-[#050608] dark:via-[#11131b] dark:to-indigo-600/80 dark:text-primary-foreground">
              <div className="text-center">
                <p className="text-xs">العام المالي</p>
                <p className="text-sm font-bold">{getCurrentFiscalYear()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 order-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hover:bg-primary/15 dark:hover:bg-primary/20 hover:scale-105 transition-all duration-200 rounded-xl border border-transparent hover:border-primary/30"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
            <span className="sr-only">تبديل الوضع</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/15 dark:hover:bg-primary/20 hover:scale-105 transition-all duration-200 rounded-xl border border-transparent hover:border-primary/30"
              >
                <Bell className="h-4 w-4 text-primary" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-tr from-indigo-300 via-blue-400 to-indigo-500 text-primary-foreground animate-bounce-gentle">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className={`w-80 ${
                theme === "dark"
                  ? "bg-[rgba(8,9,12,0.92)]"
                  : "bg-[rgba(255,255,255,0.95)]"
              } backdrop-blur-xl border border-primary/25 shadow-glass animate-scale-in`}
            >
              <div className="p-4 border-b border-primary/20">
                <h4 className="font-bold text-primary">
                  الإشعارات
                </h4>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                <div className="flex items-start gap-3 p-3 hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-105">
                  <div className="w-3 h-3 bg-gradient-to-tr from-indigo-300 via-blue-400 to-indigo-500 rounded-full mt-2 animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      تم إنجاز طلب   جديد
                    </p>
                    <p className="text-xs text-muted-foreground">
                      منذ 5 دقائق
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-105">
                  <div className="w-3 h-3 bg-warning rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      موعد جديد قيد المراجعة
                    </p>
                    <p className="text-xs text-muted-foreground">
                      منذ 15 دقيقة
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-primary/10 rounded-xl transition-all duration-200 hover:scale-105">
                  <div className="w-3 h-3 bg-success rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      تم استلام دفعة جديدة
                    </p>
                    <p className="text-xs text-muted-foreground">
                      منذ ساعة
                    </p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 hover:bg-primary/15 dark:hover:bg-primary/20 hover:scale-105 transition-all duration-200 rounded-xl p-3 border border-transparent hover:border-primary/30"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userRole}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white via-indigo-100 to-blue-300 text-foreground flex items-center justify-center shadow-brand dark:from-[#050608] dark:via-[#1b2030] dark:to-indigo-600/85 dark:text-primary-foreground">
                  <span className="text-lg font-bold">{userInitials}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className={`w-64 ${
                theme === "dark"
                  ? "bg-[rgba(8,9,12,0.92)]"
                  : "bg-[rgba(255,255,255,0.95)]"
              } backdrop-blur-xl border border-primary/25 shadow-glass animate-scale-in`}
            >
              <div className="p-4 border-b border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white via-indigo-100 to-blue-300 text-foreground flex items-center justify-center shadow-brand dark:from-[#050608] dark:via-[#1b2030] dark:to-indigo-600/85 dark:text-primary-foreground">
                    <User className="h-6 w-6 text-foreground dark:text-primary-foreground" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <DropdownMenuItem
                  asChild
                  className="gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                >
                  <Link to="/profile">
                    <User className="h-4 w-4 text-primary" />
                    الملف الشخصي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-200 cursor-pointer"
                >
                  <Link to="/user-settings">
                    <Settings className="h-4 w-4 text-primary" />
                    الإعدادات
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-primary/20" />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="gap-3 p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer flex items-center w-full"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}