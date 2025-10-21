import { redirect } from "next/navigation";
import { createServerClientService } from "@/lib/supabase/server";
import LoginForm from "@/components/auth/login-form";
import AuthLayout from "@/components/auth/auth-layout";

import "./styles.css";

export default async function LoginPage() {
  const supabase = await createServerClientService();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
