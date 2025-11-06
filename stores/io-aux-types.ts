export type TPosition = "DR" | "KEY" | "GT&BASS" | "Center st" | "foh" | "";

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
  position: TPosition;
  stand: TStandType;
}

export interface IIoRoutingItem {
  id: string;
  channelPair: string;
  assignment: string;
  connectionType: TConnectionType;
}

export const POSITION_OPTIONS: TPosition[] = [
  "DR",
  "KEY",
  "GT&BASS",
  "Center st",
  "foh",
];

export const STAND_OPTIONS: TStandType[] = [
  "small",
  "norm",
  "small or clamp",
  "Clamp or mid",
  "small or cabGrab",
];

export const CONNECTION_OPTIONS: TConnectionType[] = ["wired", "wireless (RF)"];
