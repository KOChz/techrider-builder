"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import type { TLoginState } from "@/types/auth";
import { loginAction } from "@/app/actions/login-action/login-action";
import { GoogleButton } from "../google-button/google-button";
import { SubmitButton } from "../submit-button/submit-button";
import { useSearchParams } from "next/navigation";

const initialState: TLoginState = { success: false };

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-300">Welcome back</h1>
        <p className="text-slate-600">
          Sign in to access your tech rider dashboard
        </p>
      </div>

      <div className="space-y-4 bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        {(state.message || oauthError) && (
          <div
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-start gap-3"
            role="alert"
            aria-live="polite"
          >
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {state.message || (oauthError && decodeURIComponent(oauthError))}
            </span>
          </div>
        )}

        <GoogleButton />

        <div className="relative" aria-hidden="true">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">
              Or continue with email
            </span>
          </div>
        </div>

        <form action={formAction} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-400"
              placeholder="you@example.com"
              aria-invalid={state.errors?.email ? "true" : "false"}
              aria-describedby={state.errors?.email ? "email-error" : undefined}
            />
            {state.errors?.email && (
              <p
                id="email-error"
                className="mt-2 text-sm text-red-600 flex items-center gap-1.5"
                role="alert"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all duration-200 outline-none text-slate-900 placeholder:text-slate-400"
              placeholder="••••••••"
              aria-invalid={state.errors?.password ? "true" : "false"}
              aria-describedby={
                state.errors?.password ? "password-error" : undefined
              }
            />
            {state.errors?.password && (
              <p
                id="password-error"
                className="mt-2 text-sm text-red-600 flex items-center gap-1.5"
                role="alert"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {state.errors.password[0]}
              </p>
            )}
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>

        <div className="relative" aria-hidden="true">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">
              New to TechRider Builder?
            </span>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 transition-all duration-200"
            prefetch={false}
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
