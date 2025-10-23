"use client";

import { TProjectMember } from "@/db/schema";
import { useEffect, useRef, useState } from "react";

export function TechRiderDropdown({ members }: { members: TProjectMember[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <li className="dropdown" ref={ref} data-open={open}>
      <button
        className="dropdown-toggle"
        id="techRiderToggle"
        aria-haspopup="menu"
        aria-controls="techRiderMenu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Tech Rider
      </button>

      <div id="techRiderMenu" className="dropdown-menu" role="menu">
        {members.map((m) => (
          <a
            key={m.id}
            href={`#${m.name.replace(/\s+/g, "-").toLowerCase()}`} // avoid spaces in fragment
            className="dropdown-item"
            role="menuitem"
          >
            <span className="dropdown-icon">{m.icon}</span>
            <div className="dropdown-info">
              <span className="dropdown-name">{m.name}</span>
              <span className="dropdown-role">{m.role}</span>
            </div>
          </a>
        ))}

        <a
          href="#stage-plan"
          id="dropdown-stage-plan"
          className="dropdown-item"
          role="menuitem"
        >
          <span className="dropdown-icon">🏟️</span>
          <div className="dropdown-info">
            <span className="dropdown-name">Stage Plan</span>
          </div>
        </a>
      </div>
    </li>
  );
}
