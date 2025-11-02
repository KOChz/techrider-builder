"use client";

import { useState } from "react";
import { TProjectMember } from "@/db/schema";

export type TEquipmentExample = {
  title: string;
  items: string[];
};

export type TEquipmentItem = {
  name: string;
  quantity?: string;
  examples?: TEquipmentExample;
};

export type TBandMember = {
  id: string;
  name: string;
  icon: string;
  role: string;
  equipment: TEquipmentItem[];
};

interface IMemberCardProps {
  member: TProjectMember;
  isOpened?: boolean;
}

export function MemberCard({ member, isOpened = false }: IMemberCardProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );

  const handleToggle = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isItemExpanded = (index: number) => expandedItems[index] ?? isOpened;

  return (
    <div className="member-card cursor-pointer" id={member.name}>
      <div className="member-header">
        <span className="member-icon">{member.icon}</span>
        <div className="member-info">
          <h3>{member.name}</h3>
          <p className="member-role">{member.role}</p>
        </div>
      </div>
      <ul className="equipment-list">
        {member.equipment.map((item: TEquipmentItem, index: number) =>
          item.examples ? (
            <li
              key={index}
              className="equipment-item rounded-xl hover:opacity-60"
            >
              <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => handleToggle(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggle(index);
                  }
                }}
                aria-expanded={isItemExpanded(index)}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                    isItemExpanded(index) ? "rotate-90" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  opacity={0.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>
                  {item.name}
                  {item.quantity && (
                    <span className="quantity"> {item.quantity}</span>
                  )}
                </span>
              </div>
              {isItemExpanded(index) && (
                <div className="examples">
                  <p className="examples-title">{item.examples.title}</p>
                  <ul className="examples-list">
                    {item.examples.items.map(
                      (example: string, exIndex: number) => (
                        <li key={exIndex}>{example}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </li>
          ) : (
            <li key={index} className="equipment-simple">
              <span>
                {item.name}
                {item.quantity && (
                  <span className="quantity"> {item.quantity}</span>
                )}
              </span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
