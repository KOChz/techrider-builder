"use server";

import { redirect } from "next/navigation";
import { createServerClientService } from "@/lib/supabase/server";
import { loginSchema, type TLoginState } from "@/types/auth";

/**
 * Authenticates user with email and password
 *
 * @param formData - Form data containing email and password
 * @returns Promise with success status and error messages if validation fails
 *
 * @example
 * const [state, formAction] = useFormState(loginAction, { success: false });
 */
export async function loginAction(
  prevState: TLoginState,
  formData: FormData
): Promise<TLoginState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerClientService();

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  redirect("/dashboard/my-projects");
}
