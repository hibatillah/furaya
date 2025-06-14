import { badgeColor } from ".";

export const roomConditionBadgeColor = [
  "ready",
  "booked",
  "cleaning",
  "maintenance",
  "booked cleaning",
  "unclean",
  "blocked",
  "unreserved",
].reduce((acc, roomCondition, index) => {
  acc[roomCondition as Enum.RoomCondition] = badgeColor[index];

  // set other badge color
  if (roomCondition === "other") {
    acc[roomCondition as Enum.RoomCondition] = badgeColor[-1];
  }

  return acc;
}, {} as Record<Enum.RoomCondition, string>);

export const roomStatusBadgeColor = [
  "OCC",
  "VC",
  "HU",
  "OO",
  "CO",
  "CI",
  "CIP",
  "PDU",
  "DU",
  "ONL",
  "SO",
  "DD",
].reduce((acc, roomStatus, index) => {
  acc[roomStatus as Enum.RoomStatus] = badgeColor[index];
  return acc;
}, {} as Record<Enum.RoomStatus, string>);