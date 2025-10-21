import { redirect } from "next/navigation";
import { createServerClientService } from "@/lib/supabase/server";
import AuthLayout from "@/components/auth/auth-layout";
import SignUpForm from "@/components/auth/signup-form";

import "./styles.css";

export default async function SignUpPage() {
  const supabase = await createServerClientService();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
