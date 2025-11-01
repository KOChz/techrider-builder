"use client";

import { useProjectStore } from "@/stores/use-project-creation-store";

export function BandInfoContent() {
  const { name, notes, setName, setNotes } = useProjectStore();

  return (
    <div className="min-h-72 space-y-2">
      <h3 className="text-2xl font-semibold text-slate-900">
        Band Information
      </h3>
      <div className="space-y-3">
        <p className="pb-1 text-sm text-gray-600">Add band information</p>
        <div>
          <label
            htmlFor="band-name"
            className="mb-1 block text-sm font-medium text-slate-900"
          >
            Band Name
          </label>
          <input
            id="band-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-[16px] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter band name"
          />
        </div>

        {/* <div>
          <label
            htmlFor="band-notes"
            className="mb-1 block text-sm font-medium text-slate-900"
          >
            Notes
          </label>
          <textarea
            id="band-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="This is section for any technical stuff notes"
            rows={4}
          />
        </div> */}
      </div>
    </div>
  );
}
