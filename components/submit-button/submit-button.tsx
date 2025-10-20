import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full cursor-pointer bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-3.5 px-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      aria-label={pending ? "Signing in..." : "Sign in to your account"}
    >
      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}
