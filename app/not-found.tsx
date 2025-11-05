import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="bg-linear-to-r text-shadow-2xs from-emerald-400 via-green-500 to-emerald-600 bg-clip-text pb-4 text-7xl font-bold tracking-tight text-transparent md:text-8xl lg:text-9xl">
            404
          </h1>
          <h2 className="bg-linear-to-r text-shadow-2xs from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl lg:text-5xl">
            Page Not Found
          </h2>
        </div>

        <p className="mb-10 max-w-md text-lg text-gray-600 md:text-xl">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="bg-linear-to-r group relative inline-flex items-center gap-3 rounded-full from-emerald-700 to-green-700 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/50 md:text-2xl"
          aria-label="Return to home page"
        >
          <svg
            className="h-5 w-5 transition-transform group-hover:-translate-x-1 md:h-6 md:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>

          <span className="relative z-10 text-white">Return Home</span>

          <span className="bg-linear-to-r absolute inset-0 -z-10 rounded-full from-emerald-500/80 to-green-500/80 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
      </div>
    </div>
  );
}
