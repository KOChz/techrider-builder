"use client";

import { useState } from "react";
import {
  MemberCardBuilder,
  TBandMemberBuilder,
} from "../../member-card-builder/member-card-builder";

export function MembersContent() {
  const [members, setMembers] = useState<TBandMemberBuilder[]>([]);

  const handleAddMember = () => {
    const newMember: TBandMemberBuilder = {
      id: crypto.randomUUID(),
      name: "",
      icon: "🎸",
      role: "",
      equipment: [],
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== memberId));
  };

  const handleMemberChange = (updatedMember: TBandMemberBuilder) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Band Members</h3>
      <p className="text-sm text-gray-600">Add and manage your band members</p>

      <button
        onClick={handleAddMember}
        className="px-4 cursor-pointer py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        + Add Member
      </button>

      {members.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No band members yet. Click "Add Member" to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          {members.map((member) => (
            <MemberCardBuilder
              key={member.id}
              initialMember={member}
              onChange={handleMemberChange}
              onRemove={() => handleRemoveMember(member.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
