"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@/components/ui/Icons";
import { account } from "@/lib/appwrite";

// --- Sub-components ---

interface DropdownItemProps {
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
  variant?: "default" | "danger";
  rightElement?: React.ReactNode;
}

const DropdownItem = ({ 
  label, 
  icon: Icon, 
  onClick, 
  variant = "default",
  rightElement 
}: DropdownItemProps) => (
  <button
    onClick={onClick}
    className={`
      flex w-full items-center justify-between px-3 py-2 text-[13px] transition-all
      ${variant === "danger" 
        ? "text-rose-500/80 hover:bg-rose-500/5 hover:text-rose-500 font-medium" 
        : "text-white/60 hover:bg-white/[0.04] hover:text-white"}
    `}
  >
    <div className="flex items-center gap-3">
      <Icon className={`h-[14px] w-[14px] ${variant === "default" ? "opacity-40" : "opacity-90"}`} />
      <span>{label}</span>
    </div>
    {rightElement}
  </button>
);

// --- Main Topbar Component ---

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        
        // --- Sync Role with Backend Database ---
        try {
          const { api } = await import("@/lib/api");
          const dbUser = await api.get(`/v1/users/me?email=${currentUser.email}&name=${encodeURIComponent(currentUser.name)}`);
          if (dbUser?.role) {
            setUser((prev: any) => ({ ...prev, dbRole: dbUser.role }));
          }
        } catch (dbErr) {
          console.warn("Topbar: Failed to sync role from db", dbErr);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Optimized breadcrumb and title calculation
  const { pageTitle, breadcrumbs } = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "Dashboard";
    
    const formattedTitle = lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      pageTitle: formattedTitle,
      breadcrumbs: segments.length > 1 ? ["Dashboard", formattedTitle] : [formattedTitle],
    };
  }, [pathname]);

  const userInitials = useMemo(() => {
    if (!user?.name) return "??";
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  return (
    <header
      className="glass relative z-[100] flex h-[56px] shrink-0 items-center justify-between border-b border-white/[0.05] px-5"
      role="banner"
    >
      {/* Left: Branding & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <span className="cursor-pointer text-[14px] font-bold tracking-tight text-white select-none">
          CampusAI
        </span>
        
        <nav className="hidden items-center gap-2.5 text-[13px] font-medium text-white/30 sm:flex" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb}>
              <span>/</span>
              <span className={idx === breadcrumbs.length - 1 ? "text-white/90" : "text-white/40"}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: User Actions & Profile */}
      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-5 md:flex">
          <button className="text-[13px] font-medium text-white/50 transition-colors hover:text-white">
            Support
          </button>
          <button className="rounded-md border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11.5px] font-semibold text-white/90 shadow-sm transition-all hover:border-white/20 hover:text-white">
            Upgrade
          </button>
        </div>

        <div className="hidden h-4 w-px bg-white/10 md:block" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            aria-expanded={showDropdown}
            aria-haspopup="true"
            className={`
              flex items-center gap-3 rounded-md px-1 py-0.5 transition-all
              ${showDropdown ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}
            `}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-[10px] font-bold text-white/90 transition-all hover:border-white/20">
              {userInitials}
            </div>
            <div className="hidden flex-col items-start leading-[1.1] lg:flex">
              <span className="text-[12px] font-bold text-white/90">{user?.name || "Loading..."}</span>
              <span className="text-[10px] font-medium tracking-tight text-white/30 capitalize">
                {user?.dbRole || 'Student'}
              </span>
            </div>
            <Icons.ChevronDown 
              className={`h-2.5 w-2.5 text-white transition-all ${showDropdown ? "rotate-180 opacity-80" : "opacity-20"}`} 
            />
          </button>

          {/* Profile Dropdown */}
          {showDropdown && (
            <div 
              className="glass-dark absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-[#080809]/95 py-2 shadow-2xl backdrop-blur-3xl animate-fade-in"
              style={{ "--animation-delay": "0s" } as React.CSSProperties}
            >
              <div className="flex flex-col gap-0.5">
                <DropdownItem label="Profile" icon={Icons.User} />
                <DropdownItem label="Organizations" icon={Icons.Users} />
                
                <div className="my-1.5 h-px bg-white/[0.05]" />
                
                <DropdownItem 
                  label="Theme: Dark" 
                  icon={Icons.Moon} 
                  rightElement={
                    <div className="relative h-3.5 w-6 rounded-full bg-blue-600">
                      <div className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow-sm" />
                    </div>
                  }
                />

                <div className="my-1.5 h-px bg-white/[0.05]" />

                <DropdownItem 
                  label="Log out" 
                  icon={Icons.LogOut} 
                  variant="danger" 
                  onClick={handleLogout}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
