import React from "react";

export default function Loading(): React.JSX.Element {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="status"
      aria-label="Loading content"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />

          {/* Animated spinner with dark green accent */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-700" />
        </div>

        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      </div>
    </div>
  );
}
