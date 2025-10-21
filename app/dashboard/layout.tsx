import React from "react";
import { redirect } from "next/navigation";
import { createServerClientService } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClientService();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen lg:ml-64 bg-slate-50">
      <DashboardHeader user={user} />
      <DashboardSidebar />

      <main className="pt-10 min-h-screen bg-slate-50">
        <div className="p-6 bg-slate-50">{children}</div>
      </main>
    </div>
  );
}
