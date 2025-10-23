import { useFormStatus } from "react-dom";

export function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-3.5 font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={pending ? "Signing in..." : "Sign in to your account"}
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}
