import { badgeColor } from ".";

export const MIN_LENGTH_OF_STAY = 1;
export const MAX_LENGTH_OF_STAY = 30;
export const MIN_ADVANCE_AMOUNT = 100_000;
export const MIN_PAX = 1;
export const BASE_BREAKFAST_RATE = 70_000;

export const bookingTypeBadgeColor = {
  direct: badgeColor.green,
  online: badgeColor.amber,
  "walk in": badgeColor.blue,
  travel: badgeColor.purple,
  other: badgeColor.stone,
} satisfies Record<Enum.BookingType, string>;

export const roomPackageBadgeColor = {
  "bed and breakfast": badgeColor.blue,
  "half board": badgeColor.orange,
  "full board": badgeColor.green,
  honeymoon: badgeColor.purple,
  family: badgeColor.amber,
  "romantic gateway": badgeColor.pink,
  "business package": badgeColor.cyan,
  other: badgeColor.stone,
} satisfies Record<Enum.RoomPackage, string>;

export const visitPurposeBadgeColor = {
  vacation: badgeColor.green,
  business: badgeColor.cyan,
  study: badgeColor.indigo,
  family: badgeColor.amber,
  seminar: badgeColor.red,
  other: badgeColor.stone,
} satisfies Record<Enum.VisitPurpose, string>;

export const reservationStatusBadgeColor = {
  pending: badgeColor.amber,
  booked: badgeColor.blue,
  "checked in": badgeColor.green,
  "checked out": badgeColor.orange,
  "no show": badgeColor.stone,
  cancelled: badgeColor.red,
  overdue: badgeColor.purple,
} satisfies Record<Enum.ReservationStatus, string>;

export const statusAccBadgeColor = {
  approved: badgeColor.green,
  pending: badgeColor.amber,
  rejected: badgeColor.red,
} satisfies Record<Enum.StatusAcc, string>;

export const transactionStatusBadgeColor = {
  unpaid: badgeColor.amber,
  settlement: badgeColor.green,
} satisfies Record<string, string>;
