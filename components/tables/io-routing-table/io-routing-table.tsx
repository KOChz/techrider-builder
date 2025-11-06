"use client";

import { cn } from "@/lib/utils/cn";
import { CONNECTION_OPTIONS, IIoRoutingItem } from "@/stores/io-aux-types";
import { X } from "lucide-react";

interface IIoRoutingTableProps {
  routing: IIoRoutingItem[];
  onUpdate?: (id: string, updates: Partial<IIoRoutingItem>) => void;
  onRemove?: (id: string) => void;
}

export function IoRoutingTable({
  routing,
  onUpdate,
  onRemove,
}: IIoRoutingTableProps) {
  return (
    <>
      {/* Desktop/Tablet Table View */}
      <div
        className={cn(
          "hidden w-fit overflow-x-auto rounded-lg border border-gray-200 md:block",
          !onUpdate && "pointer-events-none touch-none select-none"
        )}
      >
        <table className="w-full max-w-2xl border-collapse bg-white text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                Channel Pair
              </th>
              <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                Assignment
              </th>
              <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                Connection
              </th>
              <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {routing.map((route) => (
              <tr key={route.id} className="hover:bg-gray-50">
                <td className="border-b border-gray-200 px-4 py-3">
                  <input
                    data-export-input="true"
                    type="text"
                    value={route.channelPair}
                    onChange={(e) =>
                      onUpdate?.(route.id, { channelPair: e.target.value })
                    }
                    className="h-full w-20 rounded border border-gray-300 px-2 text-[16px] focus:border-green-500 focus:outline-none"
                    placeholder="1/2"
                  />
                </td>
                <td className="border-b border-gray-200 px-4 py-3">
                  <input
                    data-export-input="true"
                    type="text"
                    value={route.assignment}
                    onChange={(e) =>
                      onUpdate?.(route.id, { assignment: e.target.value })
                    }
                    className="h-full w-full min-w-[120px] rounded border border-gray-300 px-2 text-[16px] focus:border-green-500 focus:outline-none"
                    placeholder="DR"
                  />
                </td>
                <td className="border-b border-gray-200 px-4 py-3">
                  <select
                    data-export-input="true"
                    value={route.connectionType}
                    onChange={(e) =>
                      onUpdate?.(route.id, {
                        connectionType: e.target
                          .value as IIoRoutingItem["connectionType"],
                      })
                    }
                    className="w-full min-w-[120px] rounded border border-gray-300 bg-white px-2 text-[16px] focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    {CONNECTION_OPTIONS.map((conn) => (
                      <option key={conn} value={conn}>
                        {conn}
                      </option>
                    ))}
                  </select>
                </td>
                {onRemove && (
                  <td className="border-b border-gray-200 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onRemove(route.id)}
                      className="cursor-pointer rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove routing"
                    >
                      <X size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-5 md:hidden">
        {routing.map((route) => (
          <div
            key={route.id}
            className="min-h-56 relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(route.id)}
                className="absolute right-2 top-2 cursor-pointer rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                aria-label="Remove routing"
              >
                <X size={18} />
              </button>
            )}

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Channel Pair
                  </label>
                  <input
                    data-export-input="true"
                    type="text"
                    value={route.channelPair}
                    onChange={(e) =>
                      onUpdate?.(route.id, { channelPair: e.target.value })
                    }
                    className="h-full w-full rounded border border-gray-300 px-2 text-[16px] focus:border-green-500 focus:outline-none"
                    placeholder="1/2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Assignment
                  </label>
                  <input
                    data-export-input="true"
                    type="text"
                    value={route.assignment}
                    onChange={(e) =>
                      onUpdate?.(route.id, { assignment: e.target.value })
                    }
                    className="h-full w-full rounded border border-gray-300 px-2 text-[16px] focus:border-green-500 focus:outline-none"
                    placeholder="DR"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Connection
                </label>
                <select
                  data-export-input="true"
                  value={route.connectionType}
                  onChange={(e) =>
                    onUpdate?.(route.id, {
                      connectionType: e.target
                        .value as IIoRoutingItem["connectionType"],
                    })
                  }
                  className="w-full rounded border border-gray-300 bg-white px-2 text-[16px] focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select</option>
                  {CONNECTION_OPTIONS.map((conn) => (
                    <option key={conn} value={conn}>
                      {conn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
