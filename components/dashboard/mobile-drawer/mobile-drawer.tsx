"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOutAction } from "@/app/actions/sign-out-action/sign-out-action";
import { cn } from "@/lib/utils/cn";
import { navigationItems } from "../dashboard-sidebar/dashboard-sidebar";

interface IMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: IMobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 transform border-r border-slate-300 bg-gray-100 transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <nav aria-label="Main navigation">
              <div className="list-none space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <div key={item.href}>
                      <div
                        onClick={() => handleNavigation(item.href)}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200",
                          isActive
                            ? "bg-green-700 text-white shadow-sm"
                            : "text-slate-700 hover:bg-green-600/15"
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.icon}
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>

          <div className="flex-shrink-0 border-t border-slate-300 bg-gray-50 p-4">
            <form action={signOutAction}>
              <input type="hidden" name="redirectTo" value="/login" />
              <button
                type="submit"
                className="hover:bg-green-600/15 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200"
              >
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
