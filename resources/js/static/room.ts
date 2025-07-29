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

export const roomConditionBadgeColor = {
  "ready": badgeColor.green,
  "booked": badgeColor.red,
  "cleaning": badgeColor.blue,
  "maintenance": badgeColor.indigo,
  "booked cleaning": badgeColor.sky,
  "unclean": badgeColor.purple,
  "blocked": badgeColor.stone,
  "unreserved": badgeColor.amber,
} satisfies Record<Enum.RoomCondition, string>

export const roomStatusBadgeColor = {
  "Occupied": badgeColor.purple,
  "Vacant": badgeColor.blue,
  "House Use": badgeColor.red,
  "Out of Order": badgeColor.stone,
  "Check Out": badgeColor.amber,
  "Check In": badgeColor.green,
  "Check In Pagi": badgeColor.sky,
  "Part Day Use": badgeColor.pink,
  "Day Use": badgeColor.teal,
  "OCC No Luggage": badgeColor.lime,
  "Sleep Out": badgeColor.fuchsia,
  "Do Not Disturb": badgeColor.rose,
} satisfies Record<Enum.RoomStatusValue, string>;

export const smokingTypeBadgeColor = {
  "smoking": badgeColor.green,
  "non smoking": badgeColor.red,
} satisfies Record<Enum.SmokingType, string>