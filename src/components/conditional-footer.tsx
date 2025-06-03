"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is in admin area with valid session
    const isAdminRoute = pathname.startsWith('/admin');
    const hasAdminSession = document.cookie.includes('admin_session=');
    
    setIsAdmin(isAdminRoute && hasAdminSession);
  }, [pathname]);

  // Don't show footer for admin routes when logged in
  if (pathname.startsWith('/admin') && isAdmin) {
    return null;
  }

  // Don't show footer on admin login page
  if (pathname === '/admin/login') {
    return null;
  }

  // Show footer for all other pages
  return <Footer />;
}