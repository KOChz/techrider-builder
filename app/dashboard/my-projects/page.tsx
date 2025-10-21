import Link from "next/link";
import { FolderIcon } from "lucide-react";

export default function MyProjectsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Projects</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/techrider/headeachee"
          className="group relative bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-200 hover:border-green-500 hover:shadow-sm hover:bg-slate-50"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-green-50 p-2 text-green-700 transition-colors group-hover:bg-green-100">
              <FolderIcon className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-green-700">
                headeachee
              </h3>
              <p className="mt-1 text-sm text-slate-500">Tech rider project</p>
            </div>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
