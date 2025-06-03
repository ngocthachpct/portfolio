"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Nav } from "./nav";
import { AdminNav } from "./admin-nav";

export function ConditionalNav() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is in admin area or has admin session
    const isAdminRoute = pathname.startsWith('/admin');
    const hasAdminSession = document.cookie.includes('admin_session=');
    
    setIsAdmin(isAdminRoute && hasAdminSession);
  }, [pathname]);

  // Don't show any nav for admin login page
  if (pathname === '/admin/login') {
    return null;
  }

  // Show AdminNav for admin routes when logged in
  if (pathname.startsWith('/admin') && isAdmin) {
    return <AdminNav />;
  }

  // Show regular Nav for non-admin routes or when not logged in as admin
  if (!pathname.startsWith('/admin')) {
    return <Nav />;
  }

  // Don't show nav for admin routes when not logged in (except login page)
  return null;
}