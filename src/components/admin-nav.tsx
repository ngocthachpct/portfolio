"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, LogOut, Home, User, FolderOpen, FileText, BarChart3, MessageCircle } from "lucide-react";
import { useState } from "react";

const adminRoutes = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/admin/home",
    label: "Home Page",
    icon: Home,
  },
  {
    href: "/admin/about",
    label: "About Page",
    icon: User,
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderOpen,
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: FileText,
  },
  {
    href: "/admin/contact",
    label: "Contact",
    icon: MessageCircle,
  },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // Clear the admin session cookie
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/admin/dashboard" className="font-bold text-xl text-primary">
          Admin Panel
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {adminRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {route.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle admin menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg">Admin Panel</h3>
                </div>
                <nav className="flex flex-col gap-2">
                  {adminRoutes.map((route) => {
                    const Icon = route.icon;
                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                          pathname === route.href
                            ? "text-foreground bg-muted"
                            : "text-muted-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {route.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t pt-4 mt-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="w-full justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}