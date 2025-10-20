"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? "An unknown error occurred";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Authentication Error
        </h1>
        <p className="text-gray-600">{message}</p>
        <Link
          href="/auth/login"
          className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}
