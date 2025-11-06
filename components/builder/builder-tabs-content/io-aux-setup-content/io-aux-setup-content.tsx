"use client";

import { useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { IChannelItem, IIoRoutingItem } from "@/stores/io-aux-types";
import { ChannelListTable } from "@/components/tables/channel-list-table/channel-list-table";
import { IoRoutingTable } from "@/components/tables/io-routing-table/io-routing-table";
import { useProjectStore } from "@/stores/use-project-creation-store";

function scrollIntoViewAfterLayout(el: HTMLElement | null) {
  if (!el) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

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

export function IoAuxSetupContent() {
  const channels = useProjectStore((state) => state.ioSetupConfig.channelList);
  const ioRouting = useProjectStore((state) => state.ioSetupConfig.ioRouting);

  const addChannel = useProjectStore((state) => state.addChannel);
  const updateChannel = useProjectStore((state) => state.updateChannel);
  const removeChannel = useProjectStore((state) => state.removeChannel);

  const addIoRouting = useProjectStore((state) => state.addIoRouting);
  const updateIoRouting = useProjectStore((state) => state.updateIoRouting);
  const removeIoRouting = useProjectStore((state) => state.removeIoRouting);

  const addButtonChannelRef = useRef<HTMLButtonElement>(null);
  const addButtonRoutingRef = useRef<HTMLButtonElement>(null);

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
    addChannel(newChannel);
  };

  const handleAddIoRouting = () => {
    const newRouting: IIoRoutingItem = {
      id: crypto.randomUUID(),
      channelPair: "",
      assignment: "",
      connectionType: "wired",
    };
    addIoRouting(newRouting);
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
          onUpdate={updateChannel}
          onRemove={removeChannel}
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
          onUpdate={updateIoRouting}
          onRemove={removeIoRouting}
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
