import React, { useState } from "react";
import { NavLink, useLocation, Outlet } from "react-router-dom";
import {
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { navigation, ROUTE_PATHS } from "@/lib/index";
import { format } from "date-fns";
import { ar } from 'date-fns/locale';
import LoggedInUser from "./LoggedInUser";
import DisplayInactiveNotfication from "./InactiveNotfication";
import { useAuth } from "@/contexts/AuthContext";
import UserNotificatio from "./UserNotificatio";
interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const today = new Date();
  const location = useLocation();
  const { profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const filteredNavigation = navigation.filter(item => item.isDisplayed(profile.role));



  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-l border-sidebar-border">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
          <img src="/image.png" className="object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">مكتب  انس حلواني </h1>
          <p className="text-xs text-muted-foreground mt-1"> إدارة المشاريع</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
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

      <LoggedInUser />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-row-reverse" dir="rtl">
      {/* Desktop Sidebar */}
      <DisplayInactiveNotfication />


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

              {/* <div className="hidden md:flex items-center bg-muted rounded-full px-4 py-1.5 gap-2 w-64 lg:w-96">
                <Search size={18} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="البحث عن مشروع، عميل..."
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div> */}
            </div>

            <div className="flex items-center gap-2">
              <UserNotificatio />

              <div className="h-8 w-px bg-border mx-2"></div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs text-muted-foreground">اليوم هو</span>
                <span className="text-sm font-medium">{format(today, 'EEEE', { locale: ar }) + " - " + format(today, 'dd MMMM yyyy', { locale: ar })}</span>
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
          <p>© 2026 مكتب آنس حلواني للاستشارات الهندسية - جميع الحقوق محفوظة</p>
        </footer>
      </div>
    </div>
  );
}
