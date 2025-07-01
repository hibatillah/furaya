import { badgeColor } from ".";

export const MIN_LENGTH_OF_STAY = 1;
export const MAX_LENGTH_OF_STAY = 30;
export const MIN_ADVANCE_AMOUNT = 100000;
export const MIN_PAX = 1;

export const bookingTypeBadgeColor = [
  "direct",
  "online",
  "walk in",
  "travel",
  "other",
].reduce(
  (acc, bookingType, index) => {
    acc[bookingType as Enum.BookingType] = badgeColor[index];

    // set other badge color
    if (bookingType === "other") {
      acc[bookingType as Enum.BookingType] = badgeColor[-1];
    }

    return acc;
  },
  {} as Record<Enum.BookingType, string>,
);

export const roomPackageBadgeColor = [
  "bed and breakfast",
  "half board",
  "full board",
  "honeymoon",
  "family",
  "romantic gateway",
  "business package",
  "other",
].reduce(
  (acc, roomPackage, index) => {
    acc[roomPackage as Enum.RoomPackage] = badgeColor[index];

    // set other badge color
    if (roomPackage === "other") {
      acc[roomPackage as Enum.RoomPackage] = badgeColor[-1];
    }

    return acc;
  },
  {} as Record<Enum.RoomPackage, string>,
);

export const visitPurposeBadgeColor = [
  "vacation",
  "business",
  "study",
  "family",
  "seminar",
  "other",
].reduce(
  (acc, visitPurpose, index) => {
    acc[visitPurpose as Enum.VisitPurpose] = badgeColor[index];

    // set other badge color
    if (visitPurpose === "other") {
      acc[visitPurpose as Enum.VisitPurpose] = badgeColor[-1];
    }

    return acc;
  },
  {} as Record<Enum.VisitPurpose, string>,
);

export const paymentMethodBadgeColor = [
  "cash",
  "bank transfer",
  "debit card",
  "digital wallet",
  "credit card",
  "voucher",
  "direct billing",
  "other",
].reduce(
  (acc, paymentMethod, index) => {
    acc[paymentMethod as Enum.Payment] = badgeColor[index];

    // set other badge color
    if (paymentMethod === "other") {
      acc[paymentMethod as Enum.Payment] = badgeColor[-1];
    }

    return acc;
  },
  {} as Record<Enum.Payment, string>,
);

export const reservationStatusBadgeColor = [
  "pending",
  "booked",
  "checked in",
  "checked out",
  "no show",
  "cancelled",
  "overdue",
].reduce((acc, reservationStatus, index) => {
  acc[reservationStatus as Enum.ReservationStatus] = badgeColor[index];

  // set other badge color
  if (reservationStatus === "other") {
    acc[reservationStatus as Enum.ReservationStatus] = badgeColor[-1];
  }

  return acc;
}, {} as Record<Enum.ReservationStatus, string>);

export const statusAccBadgeColor = {
  approved: "bg-green-200 border-green-400 text-green-950 dark:bg-green-950 dark:border-green-900 dark:text-green-100",
  pending: "bg-yellow-200 border-yellow-400 text-yellow-950 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-100",
  rejected: "bg-red-200 border-red-400 text-red-950 dark:bg-red-950 dark:border-red-900 dark:text-red-100",
} as Record<Enum.StatusAcc, string>;