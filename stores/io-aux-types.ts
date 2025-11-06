export type TConnectionType = "wired" | "wireless (RF)" | "";

export interface IChannelItem {
  id: string;
  channelNumber: string;
  source: string;
  micDi: string;
  position: string;
  stand: string;
}

export interface IIoRoutingItem {
  id: string;
  channelPair: string;
  assignment: string;
  connectionType: string;
}

export const STAND_OPTIONS = [
  "small",
  "norm",
  "small or clamp",
  "Clamp or mid",
  "small or cabGrab",
];

export const CONNECTION_OPTIONS: TConnectionType[] = ["wired", "wireless (RF)"];

export type TChannelListItem = {
  id: string;
  channelNumber: string;
  source: string;
  micDi: string;
  position: string;
  stand: string;
};

export type TIORoutingItem = {
  id: string;
  channelPair: string;
  assignment: string;
  connectionType: string;
};

export type TIOSetupConfig = {
  channelList: TChannelListItem[];
  ioRouting: TIORoutingItem[];
};
