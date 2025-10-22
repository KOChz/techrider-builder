"use client";

import { useState } from "react";
import { MusicalInstrumentSelector } from "../musical-instrument-selector/musical-instrument-selector";
import { X } from "lucide-react";

export type TEquipmentExample = {
  title: string;
  items: string[];
};

export type TEquipmentItemBuilder = {
  name: string;
  quantity?: string;
  examples?: TEquipmentExample;
};

export type TBandMemberBuilder = {
  id: string;
  name: string;
  icon: string;
  role: string;
  equipment: TEquipmentItemBuilder[];
};

interface IMemberCardBuilderProps {
  initialMember?: TBandMemberBuilder;
  onChange?: (member: TBandMemberBuilder) => void;
  onRemove?: () => void;
}

export function MemberCardBuilder({
  initialMember,
  onChange,
  onRemove,
}: IMemberCardBuilderProps) {
  const [member, setMember] = useState<TBandMemberBuilder>(
    initialMember || {
      id: crypto.randomUUID(),
      name: "",
      icon: "🎸",
      role: "",
      equipment: [],
    }
  );

  const updateMember = (updates: Partial<TBandMemberBuilder>) => {
    const updatedMember = { ...member, ...updates };
    setMember(updatedMember);
    onChange?.(updatedMember);
  };

  const addEquipmentItem = () => {
    const newEquipment: TEquipmentItemBuilder = {
      name: "",
      quantity: "",
    };
    updateMember({
      equipment: [...member.equipment, newEquipment],
    });
  };

  const removeEquipmentItem = (index: number) => {
    updateMember({
      equipment: member.equipment.filter((_, i) => i !== index),
    });
  };

  const updateEquipmentItem = (
    index: number,
    updates: Partial<TEquipmentItemBuilder>
  ) => {
    const updatedEquipment = member.equipment.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    updateMember({ equipment: updatedEquipment });
  };

  const addExamplesToItem = (equipmentIndex: number) => {
    const newExamples: TEquipmentExample = {
      title: "Examples:",
      items: [],
    };
    updateEquipmentItem(equipmentIndex, { examples: newExamples });
  };

  const removeExamplesFromItem = (equipmentIndex: number) => {
    updateEquipmentItem(equipmentIndex, { examples: undefined });
  };

  const addExampleItem = (equipmentIndex: number) => {
    const equipment = member.equipment[equipmentIndex];
    if (!equipment.examples) return;

    updateEquipmentItem(equipmentIndex, {
      examples: {
        ...equipment.examples,
        items: [...equipment.examples.items, ""],
      },
    });
  };

  const removeExampleItem = (equipmentIndex: number, exampleIndex: number) => {
    const equipment = member.equipment[equipmentIndex];
    if (!equipment.examples) return;

    updateEquipmentItem(equipmentIndex, {
      examples: {
        ...equipment.examples,
        items: equipment.examples.items.filter((_, i) => i !== exampleIndex),
      },
    });
  };

  const updateExampleItem = (
    equipmentIndex: number,
    exampleIndex: number,
    value: string
  ) => {
    const equipment = member.equipment[equipmentIndex];
    if (!equipment.examples) return;

    updateEquipmentItem(equipmentIndex, {
      examples: {
        ...equipment.examples,
        items: equipment.examples.items.map((item, i) =>
          i === exampleIndex ? value : item
        ),
      },
    });
  };

  const updateExamplesTitle = (equipmentIndex: number, title: string) => {
    const equipment = member.equipment[equipmentIndex];
    if (!equipment.examples) return;

    updateEquipmentItem(equipmentIndex, {
      examples: {
        ...equipment.examples,
        title,
      },
    });
  };

  return (
    <div className="relative max-w-lg rounded-lg border border-gray-200 bg-white p-3 text-sm md:p-6">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-3 -top-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-lg text-white transition-colors hover:bg-red-600"
          aria-label="Remove member"
        >
          <X size={14} />
        </button>
      )}

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <MusicalInstrumentSelector
              value={member.icon}
              onChange={(icon) => updateMember({ icon })}
            />
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={member.name}
                onChange={(e) => updateMember({ name: e.target.value })}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 placeholder-slate-500 focus:border-green-500 focus:outline-none"
                placeholder="Member Name"
              />
              <input
                type="text"
                value={member.role}
                onChange={(e) => updateMember({ role: e.target.value })}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 placeholder-slate-500 focus:border-green-500 focus:outline-none"
                placeholder="Role"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800">Equipment</h4>
            <button
              type="button"
              onClick={addEquipmentItem}
              className="cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
            >
              + Add Equipment
            </button>
          </div>

          {member.equipment.map((item, equipmentIndex) => (
            <div
              key={equipmentIndex}
              className="space-y-3 rounded-lg border-2 border-gray-200 p-2 md:p-4"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    updateEquipmentItem(equipmentIndex, {
                      name: e.target.value,
                    })
                  }
                  className="flex-1 rounded border border-gray-300 px-3 py-2 placeholder-slate-500 focus:border-green-500 focus:outline-none"
                  placeholder="Equipment name"
                />
                <input
                  type="text"
                  value={item.quantity || ""}
                  onChange={(e) =>
                    updateEquipmentItem(equipmentIndex, {
                      quantity: e.target.value,
                    })
                  }
                  className="max-w-20 rounded border border-gray-300 px-3 py-2 placeholder-slate-500 focus:border-green-500 focus:outline-none md:max-w-none"
                  placeholder="Qty"
                />
                <button
                  type="button"
                  onClick={() => removeEquipmentItem(equipmentIndex)}
                  className="relative -top-4 right-2 h-5 w-5 cursor-pointer rounded-3xl bg-red-500 p-1 text-white transition-colors hover:bg-red-600 md:-right-6 md:-top-7"
                >
                  <X size={12} />
                </button>
              </div>

              {item.examples ? (
                <div className="space-y-2 border-l-4 border-green-200 pl-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.examples.title}
                      onChange={(e) =>
                        updateExamplesTitle(equipmentIndex, e.target.value)
                      }
                      className="flex-1 rounded border border-gray-300 px-3 py-1 text-sm placeholder-slate-500 focus:border-green-500 focus:outline-none"
                      placeholder="Examples title"
                    />
                    <button
                      type="button"
                      onClick={() => removeExamplesFromItem(equipmentIndex)}
                      className="scale-75 cursor-pointer rounded bg-gray-400 px-2 py-1 text-xs text-white transition-colors hover:bg-gray-500 md:scale-100 md:text-sm"
                    >
                      Remove Examples
                    </button>
                  </div>

                  <div className="space-y-2">
                    {item.examples.items.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={example}
                          onChange={(e) =>
                            updateExampleItem(
                              equipmentIndex,
                              exampleIndex,
                              e.target.value
                            )
                          }
                          className="flex-1 rounded border border-gray-300 px-3 py-1 text-sm placeholder-slate-500 focus:border-green-500 focus:outline-none"
                          placeholder="Example item"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeExampleItem(equipmentIndex, exampleIndex)
                          }
                          className="cursor-pointer rounded bg-red-400 px-2 py-1 text-sm text-white transition-colors hover:bg-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addExampleItem(equipmentIndex)}
                    className="cursor-pointer rounded bg-green-500 px-3 py-1 text-sm text-white transition-colors hover:bg-green-600"
                  >
                    + Add Example
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => addExamplesToItem(equipmentIndex)}
                  className="cursor-pointer rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
                >
                  + Add Examples Section
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
