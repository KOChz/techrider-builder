"use client";

import { useState } from "react";
import { MusicalInstrumentSelector } from "../musical-instrument-selector/musical-instrument-selector";
import { ChevronDown, Trash2, X } from "lucide-react";
import { ExampleItemsList } from "./example-items-list";
import { ExampleInput } from "./example-input";

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
    <div
      id="MemberCardBuilder"
      className="relative h-fit min-w-min max-w-4xl rounded-lg border-2 border-gray-300/80 bg-white p-2 text-sm lg:max-w-none lg:p-4 xl:p-6"
    >
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute -right-3 -top-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-lg text-white transition-colors hover:bg-red-600"
          aria-label="Remove member"
        >
          <X size={16} />
        </button>
      )}

      <div className="space-y-6 transition-all duration-200">
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
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-[16px] placeholder-slate-500 focus:border-green-500 focus:outline-none"
                placeholder="Member Name"
              />
              <input
                type="text"
                value={member.role}
                onChange={(e) => updateMember({ role: e.target.value })}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-[16px] placeholder-slate-500 focus:border-green-500 focus:outline-none"
                placeholder="Role"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800">Equipment</h4>
          </div>

          {member.equipment.map((item, equipmentIndex) => {
            const title =
              (item.name?.trim() || "New equipment") +
              (item.quantity ? ` × ${item.quantity}` : "");

            return (
              <details
                key={equipmentIndex}
                className="group relative min-w-[330px] overflow-hidden rounded-lg border border-gray-200"
              >
                <summary
                  style={{ listStyle: "none" }}
                  className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 [&::-webkit-details-marker]:hidden"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-gray-700/90 opacity-80 transition-transform group-open:rotate-180"
                    />
                    <span className="truncate font-medium text-gray-700/90">
                      {title}
                    </span>
                  </div>

                  {/* Delete button remains accessible in collapsed state */}
                  <button
                    type="button"
                    onClick={() => removeEquipmentItem(equipmentIndex)}
                    className="p group cursor-pointer rounded-lg text-gray-400 transition-all duration-200 hover:text-red-500 focus:bg-red-50 focus:text-red-500 focus:outline-none"
                    aria-label="Remove this example"
                  >
                    <X className="h-4 w-4 transition-transform group-hover:scale-110" />
                  </button>
                </summary>

                {/* Expanded content */}
                <div className="space-y-3 border-t border-gray-200 p-2 md:p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateEquipmentItem(equipmentIndex, {
                          name: e.target.value,
                        })
                      }
                      className="w-min flex-1 rounded-lg border border-gray-300 px-3 py-2 text-[16px] placeholder-slate-500 focus:border-green-500 focus:outline-none"
                      placeholder="Equipment name"
                      onFocus={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <input
                      type="text"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        updateEquipmentItem(equipmentIndex, {
                          quantity: e.target.value,
                        })
                      }
                      className="w-12 rounded-lg border border-gray-300 px-2 py-2 text-[16px] placeholder-slate-500 focus:relative focus:z-10 focus:border-green-500 focus:outline-none"
                      placeholder="qty"
                      onFocus={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {item.examples ? (
                    <div className="space-y-2 border-l-4 border-green-200 pl-2">
                      <ExampleInput
                        value={item.examples.title}
                        onChange={(newValue) =>
                          updateExamplesTitle(equipmentIndex, newValue)
                        }
                        onRemove={() => removeExamplesFromItem(equipmentIndex)}
                        placeholder="Roland jazz chorus, Fender twin reverb"
                      />

                      <div className="flex flex-col gap-1.5">
                        <ExampleItemsList
                          examples={item.examples.items}
                          equipmentIndex={equipmentIndex}
                          onUpdateExample={updateExampleItem}
                          onRemoveExample={removeExampleItem}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => addExampleItem(equipmentIndex)}
                        className="cursor-pointer rounded-md bg-green-600 p-2 text-xs text-white transition-colors hover:bg-green-700"
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
              </details>
            );
          })}

          <div className="justify-end-safe flex w-full">
            <button
              type="button"
              onClick={addEquipmentItem}
              className="cursor-pointer rounded-md bg-green-600 p-2 text-xs text-white transition-colors hover:bg-green-700"
            >
              + Add Equipment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
