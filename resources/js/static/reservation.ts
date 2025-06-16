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
