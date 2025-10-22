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
    <div className="min-h-screen bg-slate-50 lg:ml-64">
      <DashboardHeader user={user} />
      <DashboardSidebar />

      <main className="min-h-screen bg-slate-50 pt-10">
        <div className="bg-slate-50 px-2 py-3 md:p-6">{children}</div>
      </main>
    </div>
  );
}
