import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthLayout from "@/components/auth/auth-layout";
import SignUpForm from "@/components/auth/signup-form";

export default async function SignUpPage() {
  const supabase = await createClient();
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
