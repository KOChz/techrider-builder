"use client";

import Image from "next/image";

export interface ITemplateItem {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  isPopular?: boolean;
  memberCount?: number;
}

export type TTemplateCategory =
  | "band"
  | "solo-artist"
  | "dj"
  | "orchestra"
  | "custom";

interface ITemplateCardProps {
  template: ITemplateItem;
  onSelect: (template: ITemplateItem) => void;
}

export function TemplateCard({ template, onSelect }: ITemplateCardProps) {
  return (
    <button
      onClick={() => onSelect(template)}
      className="min-w-40 group relative flex cursor-pointer flex-col gap-3 rounded-lg bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md md:min-w-[200px]"
      aria-label={`Select ${template.name} template`}
    >
      <div className="aspect-3/4 relative h-full overflow-hidden rounded-md bg-gray-100">
        <Image
          width={200}
          height={400}
          src={template.thumbnailUrl}
          alt={`${template.name} template preview`}
          style={{ objectFit: "cover" }}
          className="h-full w-full scale-105 object-cover transition-transform duration-200 will-change-transform group-hover:scale-110"
        />

        {template.isPopular && (
          <div className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-medium text-white">
            Popular
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 text-left">
        <h3 className="truncate text-sm font-medium text-gray-900 group-hover:text-emerald-600">
          {template.name}
        </h3>
        <p className="text-xs text-gray-500">{template.category}</p>
        {template.memberCount && (
          <p className="text-xs text-gray-400">
            {template.memberCount}{" "}
            {template.memberCount === 1 ? "member" : "members"}
          </p>
        )}
      </div>
    </button>
  );
}
