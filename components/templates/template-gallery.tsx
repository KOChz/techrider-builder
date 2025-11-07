"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils/cn";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ITemplateItem, TemplateCard } from "./template-item";

interface ITemplateGalleryProps {
  templates: ITemplateItem[];
  onTemplateSelect: (template: ITemplateItem) => void;
  className?: string;
}

/**
 * Horizontal scrollable gallery for project templates
 *
 * @param templates - Array of template items to display
 * @param onTemplateSelect - Callback when user selects a template
 * @param className - Optional additional CSS classes
 *
 * @returns Scrollable template gallery with navigation controls
 */
export function TemplateGallery({
  templates,
  onTemplateSelect,
  className,
}: ITemplateGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (templates.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("relative w-full", className)}
      aria-label="Project templates"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Start with a template
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="cursor-pointer rounded-full border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Scroll templates left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="cursor-pointer rounded-full border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Scroll templates right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onTemplateSelect}
          />
        ))}
      </div>
    </section>
  );
}
