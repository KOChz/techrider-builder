import React from "react";
import Link from "next/link";

interface IAuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: IAuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <nav aria-label="Primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                aria-label="headachee home"
                className="text-2xl text-green-500 font-bold transition-all duration-200 hover:text-green-400"
              >
                headachee
              </Link>

              <ul className="flex items-center gap-6">
                <li>
                  <Link
                    href="/"
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#contact"
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pt-24">
        {children}
      </main>

      <footer className="border-t border-slate-700 bg-slate-900 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-400">
            © 2025 headachee. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
