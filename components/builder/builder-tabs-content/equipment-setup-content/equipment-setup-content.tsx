"use client";

import { useEffect, useRef } from "react";

import { useProjectStore } from "@/stores/use-project-creation-store";
import {
  InstrumentSectionCardBuilder,
  TInstrumentSectionBuilder,
} from "../../instrument-section-card-builder/instrument-section-card-builder";
import { Plus } from "lucide-react";
import { DraggableSection } from "@/components/draggable-section/draggable-section";
import { MobileReorderControls } from "../../instrument-section-card-builder/mobile-reorder-controls";
import { useDevice } from "@/hooks/use-device";

export function EquipmentSetupContent() {
  const { members, addMember, updateMember, removeMember, moveMember } =
    useProjectStore();

  const previousLengthRef = useRef(members.length);
  const lastCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (members.length > previousLengthRef.current && lastCardRef.current) {
      const timeoutId = setTimeout(() => {
        lastCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 120);

      return () => clearTimeout(timeoutId);
    }
    previousLengthRef.current = members.length;
  }, [members.length]);

  const handleAddEquipmentSetup = () => {
    const newMember: TInstrumentSectionBuilder = {
      id: crypto.randomUUID(),
      name: "",
      icon: "🎸",
      role: "",
      equipment: [],
    };
    addMember(newMember);
  };

  const { isMobile } = useDevice();

  return (
    <div className="min-h-[360px] space-y-2">
      <h3 className="text-2xl font-semibold text-slate-900">
        Equipment Sections
      </h3>
      <p className="pb-1 text-sm text-gray-600">
        Define equipment sections and their required equipment
      </p>

      {members.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <p>No equipment yet. Click &quot;Add Section&quot; to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {members.map((member, index) => {
            const card = (
              <div
                className="relative scroll-mb-48"
                style={{ scrollMarginBottom: "12rem" }}
                ref={index === members.length - 1 ? lastCardRef : null}
              >
                {/* Mobile reorder overlay */}
                <MobileReorderControls
                  index={index}
                  total={members.length}
                  onMoveUp={() => moveMember(index, index - 1)}
                  onMoveDown={() => moveMember(index, index + 1)}
                />

                <InstrumentSectionCardBuilder
                  initialMember={member}
                  onChange={(updated) => updateMember(member.id, updated)}
                  onRemove={() => removeMember(member.id)}
                />
              </div>
            );

            return isMobile ? (
              <div key={member.id}>{card}</div>
            ) : (
              <DraggableSection
                key={member.id}
                id={member.id}
                index={index}
                move={moveMember}
              >
                {card}
              </DraggableSection>
            );
          })}
        </div>
      )}

      <button
        onClick={handleAddEquipmentSetup}
        className="duration-350 hover:bg-green-600/85 active:bg-green-600/85 group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-slate-600 transition-all hover:text-white hover:shadow-sm active:scale-[0.98] active:text-white active:shadow-sm"
      >
        <Plus size={18} />
        Add Section
      </button>
    </div>
  );
}
