import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import LoginForm from "@/components/auth/login-form";
import AuthLayout from "@/components/auth/auth-layout";

export default async function LoginPage() {
  const supabase = await createServerClient();

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
