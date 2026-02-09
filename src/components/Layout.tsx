import React, { useState } from "react";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserSquare,
  Menu,
  X,
  Bell,
  Search,
  ChevronLeft,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTE_PATHS, getRoleLabel } from "@/lib/index";

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTE_PATHS.LOGIN);
  };

  const navigation = [
    {
      name: "لوحة التحكم",
      href: ROUTE_PATHS.DASHBOARD,
      icon: LayoutDashboard,
    },
    {
      name: "المشاريع الهندسية",
      href: ROUTE_PATHS.PROJECTS,
      icon: Briefcase,
    },
    {
      name: "قاعدة العملاء",
      href: ROUTE_PATHS.CLIENTS,
      icon: UserSquare,
    },
    {
      name: "إدارة الموظفين",
      href: ROUTE_PATHS.USERS,
      icon: Users,
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-l border-sidebar-border">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
          <Briefcase size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">إتقان الهندسي</h1>
          <p className="text-xs text-muted-foreground mt-1">نظام إدارة المشاريع</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "size-5",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                )}
              />
              <span className="font-medium">{item.name}</span>
              {isActive && <ChevronLeft className="mr-auto size-4" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar className="size-10 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-accent text-accent-foreground font-bold">
              {profile?.name?.charAt(0) || "م"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{profile?.name || "المستخدم"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.role ? getRoleLabel(profile.role) : "مدير المكتب"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-row-reverse" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 fixed inset-y-0 right-0 z-50">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:mr-72">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8">
          <div className="h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-72">
                  <SidebarContent />
                </SheetContent>
              </Sheet>

              <div className="hidden md:flex items-center bg-muted rounded-full px-4 py-1.5 gap-2 w-64 lg:w-96">
                <Search size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="البحث عن مشروع، عميل..."
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
              </Button>
              <div className="h-8 w-px bg-border mx-2"></div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-muted-foreground">اليوم هو</span>
                <span className="text-sm font-medium">الخميس، 6 فبراير 2026</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children ?? <Outlet />}
        </main>

        {/* Footer */}
        <footer className="py-6 px-8 border-t border-border bg-card text-center text-sm text-muted-foreground">
          <p>© 2026 مكتب إتقان للاستشارات الهندسية - جميع الحقوق محفوظة</p>
        </footer>
      </div>
    </div>
  );
}
