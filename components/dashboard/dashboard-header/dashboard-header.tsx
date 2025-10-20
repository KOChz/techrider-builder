import React from "react";
import { User } from "@supabase/supabase-js";

interface IDashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: IDashboardHeaderProps) {
  const userInitial = user.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 h-16 bg-white border-b border-slate-200 z-20">
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          TechRider Builder
        </h1>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium text-sm">
            {userInitial}
          </div>
          <span className="text-sm text-slate-700 hidden sm:inline-block">
            {user.email}
          </span>
        </div>
      </div>
    </header>
  );
}
