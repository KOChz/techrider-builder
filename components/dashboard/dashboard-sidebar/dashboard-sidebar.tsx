"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOutAction } from "@/app/actions/sign-out-action/sign-out-action";

const navigationItems = [
  {
    name: "My Projects",
    href: "/dashboard/my-projects",
    icon: (
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
  },
  {
    name: "Create a New Project",
    href: "/dashboard/create-new",
    icon: (
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-100 border-r border-slate-300 hidden lg:flex lg:flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <nav aria-label="Main navigation">
          <div className="space-y-1 list-none">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <div key={item.href}>
                  <div
                    onClick={() => {
                      router.push(item.href);
                    }}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-green-700 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-200"
                    }`}
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

      <div className="flex-shrink-0 p-4 border-t border-slate-300 bg-gray-50">
        <form action={signOutAction}>
          <input type="hidden" name="redirectTo" value="/login" />
          <button
            type="submit"
            className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 font-medium text-sm"
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
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
    </aside>
  );
}
