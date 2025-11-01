import React from "react";
import { User } from "@supabase/supabase-js";

interface IDashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: IDashboardHeaderProps) {
  const userInitial = user.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <h1 className="bg-linear-to-r text-shadow-2xs animate-gradient from-emerald-600 via-green-500 to-teal-500 bg-[length:200%_auto] bg-clip-text text-3xl font-bold text-transparent">
          TechRider Builder
        </h1>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
            {userInitial}
          </div>
          <span className="hidden text-sm text-slate-700 sm:inline-block">
            {user.email}
          </span>
        </div>
      </div>
    </header>
  );
}
