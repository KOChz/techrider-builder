"use client";

import { useProjectStore } from "@/stores/use-project-creation-store";
import {
  MemberCardBuilder,
  TBandMemberBuilder,
} from "../../member-card-builder/member-card-builder";

export function MembersContent() {
  const { members, addMember, updateMember, removeMember } = useProjectStore();

  const handleAddMember = () => {
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
    <div className="space-y-2">
      <h3 className="text-2xl font-semibold text-slate-900">Band Members</h3>
      <p className="pb-1 text-sm text-gray-600">
        Add and manage your band members
      </p>

      <button
        onClick={handleAddMember}
        className="cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
      >
        + Add Member
      </button>

      {members.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p>
            No band members yet. Click &quot;Add Member&quot; to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {members.map((member) => (
            <MemberCardBuilder
              key={member.id}
              initialMember={member}
              onChange={(updated) => updateMember(member.id, updated)}
              onRemove={() => removeMember(member.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
