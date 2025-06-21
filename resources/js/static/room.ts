import { badgeColor } from ".";

export const roomStatusOptions = {
  "OCC": "Occupied",
  "VC": "Vacant",
  "HU": "House Use",
  "OO": "Out of Order",
  "CO": "Check Out",
  "CI": "Check In",
  "CIP": "Check In Pagi",
  "PDU": "Part Day Use",
  "DU": "Day Use",
  "ONL": "OCC No Luggage",
  "SO": "Sleep Out",
  "DD": "Do Not Disturb",
}

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
  "Occupied",
  "Vacant",
  "House Use",
  "Out of Order",
  "Check Out",
  "Check In",
  "Check In Pagi",
  "Part Day Use",
  "Day Use",
  "OCC No Luggage",
  "Sleep Out",
  "Do Not Disturb",
].reduce((acc, roomStatus, index) => {
  acc[roomStatus as Enum.RoomStatus] = badgeColor[index];
  return acc;
}, {} as Record<Enum.RoomStatus, string>);

export const smokingTypeBadgeColor = {
  "smoking": badgeColor[0],
  "non-smoking": badgeColor[1],
}