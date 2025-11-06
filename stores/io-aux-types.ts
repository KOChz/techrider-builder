export type TStandType =
  | "small"
  | "norm"
  | "small or clamp"
  | "Clamp or mid"
  | "small or cabGrab"
  | "";

export type TConnectionType = "wired" | "wireless (RF)" | "";

export interface IChannelItem {
  id: string;
  channelNumber: string;
  source: string;
  micDi: string;
  position: string;
  stand: TStandType;
}

export interface IIoRoutingItem {
  id: string;
  channelPair: string;
  assignment: string;
  connectionType: TConnectionType;
}

export const STAND_OPTIONS: TStandType[] = [
  "small",
  "norm",
  "small or clamp",
  "Clamp or mid",
  "small or cabGrab",
];

export const CONNECTION_OPTIONS: TConnectionType[] = ["wired", "wireless (RF)"];

export type TChannelListItem = {
  channelNumber: string;
  source: string;
  micAndDI: string;
  position: string;
  stand: string;
};

export type TIORoutingItem = {
  channelPair: string;
  assignment: string;
  connection: string;
};

export type TIOSetupConfig = {
  channelList: TChannelListItem[];
  ioRouting: TIORoutingItem[];
};
