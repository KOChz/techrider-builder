"use client";

import { useProjectStore } from "@/stores/use-project-creation-store";
import {
  InstrumentSectionCardBuilder,
  TBandMemberBuilder,
} from "../../member-card-builder/member-card-builder";

export function EquipmentSetupContent() {
  const { members, addMember, updateMember, removeMember } = useProjectStore();

  const handleAddEquipmentSetup = () => {
    const newMember: TBandMemberBuilder = {
      id: crypto.randomUUID(),
      name: "",
      icon: "🎸",
      role: "",
      equipment: [],
    };
    addMember(newMember);
  };

  return (
    <div className="min-h-[360px] space-y-2">
      <h3 className="text-2xl font-semibold text-slate-900">
        Instrument Sections
      </h3>
      <p className="pb-1 text-sm text-gray-600">
        Define instrument sections and their required equipment
      </p>

      {members.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p>No equipment yet. Click &quot;Add Section&quot; to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {members.map((member) => (
            <InstrumentSectionCardBuilder
              key={member.id}
              initialMember={member}
              onChange={(updated) => updateMember(member.id, updated)}
              onRemove={() => removeMember(member.id)}
            />
          ))}
        </div>
      )}

      <div className="justify-end-safe flex w-full">
        <button
          onClick={handleAddEquipmentSetup}
          className="cursor-pointer rounded-md bg-green-600 p-3 text-sm text-white transition-colors hover:bg-green-700"
        >
          + Add Section
        </button>
      </div>
    </div>
  );
}
