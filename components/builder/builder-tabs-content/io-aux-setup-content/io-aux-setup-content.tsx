"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { IChannelItem, IIoRoutingItem } from "@/stores/io-aux-types";
import { ChannelListTable } from "@/components/tables/channel-list-table/channel-list-table";
import { IoRoutingTable } from "@/components/tables/io-routing-table/io-routing-table";

/** Utility: scrolls target into view after layout settles (double RAF to be iOS-safe) */
function scrollIntoViewAfterLayout(el: HTMLElement | null) {
  if (!el) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

/** Hook: only scroll when count increases (i.e., on add), never on initial render */
function useScrollOnAdd(
  count: number,
  targetRef: React.RefObject<HTMLElement>
) {
  const prev = useRef(count);
  useEffect(() => {
    if (count > prev.current) {
      scrollIntoViewAfterLayout(targetRef.current);
    }
    prev.current = count;
  }, [count, targetRef]);
}

const INITIAL_CHANNELS: IChannelItem[] = [
  {
    id: crypto.randomUUID(),
    channelNumber: "01",
    source: "Kick in",
    micDi: "Shure b91; Beyer tg70",
    position: "DR",
    stand: "small",
  },
  {
    id: crypto.randomUUID(),
    channelNumber: "02",
    source: "kick out",
    micDi: "Shure b52; Audix D6",
    position: "DR",
    stand: "",
  },
];

const INITIAL_IO_ROUTING: IIoRoutingItem[] = [
  {
    id: crypto.randomUUID(),
    channelPair: "1/2",
    assignment: "DR",
    connectionType: "wired",
  },
  {
    id: crypto.randomUUID(),
    channelPair: "3/4",
    assignment: "GUIT",
    connectionType: "wired",
  },
];

export function IoAuxSetupContent() {
  const [channels, setChannels] = useState<IChannelItem[]>(INITIAL_CHANNELS);
  const [ioRouting, setIoRouting] =
    useState<IIoRoutingItem[]>(INITIAL_IO_ROUTING);

  const addButtonChannelRef = useRef<HTMLButtonElement>(null);
  const addButtonRoutingRef = useRef<HTMLButtonElement>(null);

  // Autoscroll only on "add", not on first paint
  useScrollOnAdd(
    channels.length,
    addButtonChannelRef as React.RefObject<HTMLElement>
  );
  useScrollOnAdd(
    ioRouting.length,
    addButtonRoutingRef as React.RefObject<HTMLElement>
  );

  const handleAddChannel = () => {
    const newChannel: IChannelItem = {
      id: crypto.randomUUID(),
      channelNumber: String(channels.length + 1).padStart(2, "0"),
      source: "",
      micDi: "",
      position: "",
      stand: "",
    };
    setChannels((prev) => [...prev, newChannel]);
  };

  const handleUpdateChannel = (id: string, updates: Partial<IChannelItem>) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, ...updates } : ch))
    );
  };

  const handleRemoveChannel = (id: string) => {
    setChannels((prev) => prev.filter((ch) => ch.id !== id));
  };

  const handleAddIoRouting = () => {
    const newRouting: IIoRoutingItem = {
      id: crypto.randomUUID(),
      channelPair: "",
      assignment: "",
      connectionType: "wired",
    };
    setIoRouting((prev) => [...prev, newRouting]);
  };

  const handleUpdateIoRouting = (
    id: string,
    updates: Partial<IIoRoutingItem>
  ) => {
    setIoRouting((prev) =>
      prev.map((io) => (io.id === id ? { ...io, ...updates } : io))
    );
  };

  const handleRemoveIoRouting = (id: string) => {
    setIoRouting((prev) => prev.filter((io) => io.id !== id));
  };

  return (
    <div className="min-h-[360px] space-y-8">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">
          I/O & AUX Setup
        </h3>
        <p className="pb-1 text-sm text-gray-600">
          Configure your channels and input/output routing setup
        </p>
      </div>

      <div
        className="scroll-mb-48 space-y-4"
        style={{ scrollMarginBottom: "12rem" }}
      >
        <h4 className="text-lg font-semibold text-gray-800">Channel List</h4>

        <ChannelListTable
          channels={channels}
          onUpdate={handleUpdateChannel}
          onRemove={handleRemoveChannel}
        />

        <div className="flex items-center justify-between">
          <button
            ref={addButtonChannelRef}
            type="button"
            onClick={handleAddChannel}
            className="duration-350 hover:bg-green-600/85 active:bg-green-600/85 group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg p-2 text-sm font-semibold text-slate-600 transition-all hover:text-white hover:shadow-sm active:scale-[0.98] active:text-white active:shadow-sm"
          >
            <Plus size={16} />
            Add Channel
          </button>
        </div>
      </div>

      <div
        className="scroll-mb-48 space-y-4"
        style={{ scrollMarginBottom: "12rem" }}
      >
        <h4 className="text-lg font-semibold text-gray-800">I/O Routing</h4>

        <IoRoutingTable
          routing={ioRouting}
          onUpdate={handleUpdateIoRouting}
          onRemove={handleRemoveIoRouting}
        />

        <div className="flex items-center justify-between">
          <button
            ref={addButtonRoutingRef}
            type="button"
            onClick={handleAddIoRouting}
            className="duration-350 hover:bg-green-600/85 active:bg-green-600/85 group flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg p-2 text-sm font-semibold text-slate-600 transition-all hover:text-white hover:shadow-sm active:scale-[0.98] active:text-white active:shadow-sm"
          >
            <Plus size={16} />
            Add Route
          </button>
        </div>
      </div>
    </div>
  );
}
