declare namespace Enum {
  export type BookingType = "direct" | "online" | "walk in" | "travel" | "other";

  export type StatusAcc = "pending" | "approved" | "rejected";

  export type RoomStatus = "OCC" | "VC" | "HU" | "OO" | "CO" | "CI" | "CIP" | "PDU" | "DU" | "ONL" | "SO" | "DD";

  export type RoomStatusValue =
    | "Occupied"
    | "Vacant"
    | "House Use"
    | "Out of Order"
    | "Check Out"
    | "Check In"
    | "Check In Pagi"
    | "Part Day Use"
    | "Day Use"
    | "OCC No Luggage"
    | "Sleep Out"
    | "Do Not Disturb";

  export type RoomCondition = "ready" | "booked" | "cleaning" | "maintenance" | "booked cleaning" | "unclean" | "blocked" | "unreserved";

  export type RoomPackage =
    | "bed and breakfast"
    | "half board"
    | "full board"
    | "honeymoon"
    | "family"
    | "romantic gateway"
    | "business package"
    | "other";

  export type VisitPurpose = "vacation" | "business" | "study" | "family" | "seminar" | "other";

  export type Role = "admin" | "manager" | "employee" | "guest";

  export type Gender = "male" | "female";

  export type Payment = "cash" | "bank transfer" | "debit card" | "digital wallet" | "credit card" | "voucher" | "direct billing" | "other";

  export type ReservationStatus = "pending" | "booked" | "checked in" | "checked out" | "no show" | "cancelled" | "overdue";
}
