import React from "react";
import Link from "next/link";

interface IAuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: IAuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white backdrop-blur-sm">
        <nav aria-label="Primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              id="AuthLayoutHeader"
              className="flex h-16 items-center justify-between"
            >
              <Link
                href="/"
                aria-label="TechRider Builder home"
                className="bg-linear-to-r text-shadow-2xs animate-gradient from-emerald-600 via-green-500 to-teal-500 bg-[length:200%_auto] bg-clip-text text-3xl font-bold text-transparent"
              >
                TechRider Builder
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex flex-1 items-center justify-center bg-white px-2">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-slate-400">
            © 2025 headachee. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
