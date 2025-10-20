"use client";

import { useState } from "react";

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

interface IMemberCardBuilderProps {
  initialMember?: TBandMember;
  onChange?: (member: TBandMember) => void;
}

export function MemberCardBuilder({
  initialMember,
  onChange,
}: IMemberCardBuilderProps) {
  const [member, setMember] = useState<TBandMember>(
    initialMember || {
      id: crypto.randomUUID(),
      name: "",
      icon: "🎸",
      role: "",
      equipment: [],
    }
  );

  const updateMember = (updates: Partial<TBandMember>) => {
    const updatedMember = { ...member, ...updates };
    setMember(updatedMember);
    onChange?.(updatedMember);
  };

  const addEquipmentItem = () => {
    const newEquipment: TEquipmentItem = {
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
    updates: Partial<TEquipmentItem>
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        {/* Member Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={member.icon}
              onChange={(e) => updateMember({ icon: e.target.value })}
              className="w-16 h-16 text-3xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="🎸"
            />
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={member.name}
                onChange={(e) => updateMember({ name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Member Name"
              />
              <input
                type="text"
                value={member.role}
                onChange={(e) => updateMember({ role: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Role"
              />
            </div>
          </div>
        </div>

        {/* Equipment List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800">Equipment</h4>
            <button
              onClick={addEquipmentItem}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              + Add Equipment
            </button>
          </div>

          {member.equipment.map((item, equipmentIndex) => (
            <div
              key={equipmentIndex}
              className="p-4 border-2 border-gray-200 rounded-lg space-y-3"
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
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
                  className="w-24 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                  placeholder="Qty"
                />
                <button
                  onClick={() => removeEquipmentItem(equipmentIndex)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>

              {/* Examples Section */}
              {item.examples ? (
                <div className="pl-4 space-y-2 border-l-4 border-blue-200">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.examples.title}
                      onChange={(e) =>
                        updateExamplesTitle(equipmentIndex, e.target.value)
                      }
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      placeholder="Examples title"
                    />
                    <button
                      onClick={() => removeExamplesFromItem(equipmentIndex)}
                      className="px-2 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
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
                          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                          placeholder="Example item"
                        />
                        <button
                          onClick={() =>
                            removeExampleItem(equipmentIndex, exampleIndex)
                          }
                          className="px-2 py-1 text-sm bg-red-400 text-white rounded hover:bg-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addExampleItem(equipmentIndex)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    + Add Example
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addExamplesToItem(equipmentIndex)}
                  className="px-3 py-1 text-sm bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
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
