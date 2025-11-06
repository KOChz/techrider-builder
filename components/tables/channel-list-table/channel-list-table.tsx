"use client";

import { cn } from "@/lib/utils/cn";
import { IChannelItem, STAND_OPTIONS } from "@/stores/io-aux-types";
import { X } from "lucide-react";

interface IChannelListTableProps {
  channels: IChannelItem[];
  onUpdate?: (id: string, updates: Partial<IChannelItem>) => void;
  onRemove?: (id: string) => void;
}

export function ChannelListTable({
  channels,
  onUpdate,
  onRemove,
}: IChannelListTableProps) {
  return (
    <>
      {/* Desktop/Tablet Table View */}
      <div
        className={cn(
          "hidden overflow-x-auto rounded-lg border border-gray-200 md:block",
          !onUpdate && "pointer-events-none touch-none select-none"
        )}
      >
        <table className="w-full border-collapse bg-white text-left text-[16px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                № chann
              </th>
              <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                Source
              </th>
              <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                Mic & DI
              </th>
              <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                Position
              </th>
              <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                Stand
              </th>
              <th className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {channels.map((channel) => (
              <tr key={channel.id} className="hover:bg-gray-50">
                <td className="border-b border-gray-200 px-4 py-3">
                  <input
                    data-export-input="true"
                    type="text"
                    value={channel.channelNumber}
                    onChange={(e) =>
                      onUpdate?.(channel.id, { channelNumber: e.target.value })
                    }
                    className="h-full w-16 rounded border border-gray-300 px-2 py-1 text-[16px] focus:border-green-500 focus:outline-none"
                    placeholder="01"
                  />
                </td>
                <td className="border-b border-gray-200 px-4 py-3">
                  <input
                    data-export-input="true"
                    type="text"
                    value={channel.source}
                    onChange={(e) =>
                      onUpdate?.(channel.id, { source: e.target.value })
                    }
                    className="h-full w-full min-w-[120px] rounded border border-gray-300 px-2 py-1 text-[16px] focus:border-green-500 focus:outline-none"
                    placeholder="Kick in"
                  />
                </td>
                <td className="border-b border-gray-200 px-4 py-3">
                  <input
                    data-export-input="true"
                    type="text"
                    value={channel.micDi}
                    onChange={(e) =>
                      onUpdate?.(channel.id, { micDi: e.target.value })
                    }
                    className="min-w-40 h-full w-full rounded border border-gray-300 px-2 py-1 text-[16px] focus:border-green-500 focus:outline-none"
                    placeholder="Shure b91"
                  />
                </td>
                <td className="border-b border-gray-200 px-4 py-3">
                  <input
                    data-export-input="true"
                    type="text"
                    value={channel.position}
                    onChange={(e) =>
                      onUpdate?.(channel.id, { position: e.target.value })
                    }
                    className="h-[52px] w-full min-w-[100px] rounded border border-gray-300 px-2 py-1 text-[16px] focus:border-green-500 focus:outline-none md:h-full"
                    placeholder="Stage Left"
                  />
                  {/* <select
                    value={channel.position}
                    onChange={(e) =>
                      onUpdate(channel.id, {
                        position: e.target.value as IChannelItem["position"],
                      })
                    }
                    className="w-full min-w-[100px] rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    {POSITION_OPTIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select> */}
                </td>
                <td className="border-b border-gray-200 px-4 py-3">
                  <select
                    data-export-input="true"
                    value={channel.stand}
                    onChange={(e) =>
                      onUpdate?.(channel.id, {
                        stand: e.target.value as IChannelItem["stand"],
                      })
                    }
                    className="w-full min-w-[120px] rounded border border-gray-300 bg-white px-2 py-1 text-[16px] focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    {STAND_OPTIONS.map((stand) => (
                      <option key={stand} value={stand}>
                        {stand}
                      </option>
                    ))}
                  </select>
                </td>
                {onRemove && (
                  <td className="border-b border-gray-200 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onRemove(channel.id)}
                      className="cursor-pointer rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove channel"
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
      <div className="space-y-8 md:hidden">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="min-h-72 relative h-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(channel.id)}
                className="absolute right-2 top-2 cursor-pointer rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                aria-label="Remove channel"
              >
                <X size={18} />
              </button>
            )}

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    № chann
                  </label>
                  <input
                    data-export-input="true"
                    type="text"
                    value={channel.channelNumber}
                    onChange={(e) =>
                      onUpdate?.(channel.id, { channelNumber: e.target.value })
                    }
                    className="h-full w-full rounded border border-gray-300 px-2 py-1 text-[16px] focus:border-green-500 focus:outline-none"
                    placeholder="01"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Source
                  </label>
                  <input
                    data-export-input="true"
                    type="text"
                    value={channel.source}
                    onChange={(e) =>
                      onUpdate?.(channel.id, { source: e.target.value })
                    }
                    className="h-full w-full rounded border border-gray-300 px-2 py-1 text-[16px] focus:border-green-500 focus:outline-none"
                    placeholder="Kick in"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Mic & DI
                </label>
                <input
                  data-export-input="true"
                  type="text"
                  value={channel.micDi}
                  onChange={(e) =>
                    onUpdate?.(channel.id, { micDi: e.target.value })
                  }
                  className="h-full w-full rounded border border-gray-300 px-2 py-1 text-[16px] focus:border-green-500 focus:outline-none"
                  placeholder="Shure b91; Beyer tg70"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    data-export-input="true"
                    type="text"
                    value={channel.position}
                    onChange={(e) =>
                      onUpdate?.(channel.id, { position: e.target.value })
                    }
                    className="h-[52px] w-full min-w-[100px] rounded border border-gray-300 px-2 text-[16px] focus:border-green-500 focus:outline-none md:h-full"
                    placeholder="Stage Left"
                  />
                  {/* <select
                    value={channel.position}
                    onChange={(e) =>
                      onUpdate(channel.id, {
                        position: e.target.value as IChannelItem["position"],
                      })
                    }
                    className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Select</option>
                    {POSITION_OPTIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select> */}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Stand
                  </label>
                  <select
                    data-export-input="true"
                    value={channel.stand}
                    onChange={(e) =>
                      onUpdate?.(channel.id, {
                        stand: e.target.value as IChannelItem["stand"],
                      })
                    }
                    className="h-[52px] w-full rounded border border-gray-300 bg-white px-2 py-1 text-[16px] focus:border-green-500 focus:outline-none md:h-full"
                  >
                    <option value="">Select</option>
                    {STAND_OPTIONS.map((stand) => (
                      <option key={stand} value={stand}>
                        {stand}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
