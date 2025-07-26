declare namespace Reservation {
  interface Base {
    id: string;
    booking_number: number | "";
    start_date: Date | string;
    end_date?: Date | string | null;
    length_of_stay: number | "";
    adults: number | "";
    pax: number | "";
    total_price: number | "";
    children?: number | "";
    arrival_from?: string;
    guest_type?: string;
    employee_name?: string;
    employee_id?: string;
    employee?: Employee.Default;
    booking_type: Enum.BookingType;
    visit_purpose: Enum.VisitPurpose;
    room_package: Enum.RoomPackage;
    payment_method: Enum.Payment;
    status_acc: Enum.StatusAcc;
    discount?: number | "";
    discount_reason?: string;
    commission_percentage?: number | "";
    commission_amount?: number | "";
    remarks?: string;
    advance_remarks?: string;
    advance_amount?: number | "";
    status: Enum.ReservationStatus;
    smoking_type?: Enum.SmokingType;
    include_breakfast?: boolean;
    snap_token?: string;
    payment_type?: string;
    transaction_id?: string;
    transaction_time?: string;
    transaction_status?: string;
    transaction_bank?: string;
    canceled_at?: Date | string;
  }

  interface Addition {
    reservation_guest?: ReservationGuest.Default;
    reservation_room?: ReservationRoom.Default;
    reservation_transaction?: ReservationTransaction.Default;
    check_in?: CheckIn.Default;
    check_out?: CheckOut.Default;
    is_finished?: boolean;
    formatted_start_date?: string;
    formatted_end_date?: string;
    formatted_check_in_at?: string;
    formatted_check_out_at?: string;
  }

  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "booking_number" | "employee"> & ReservationRoom.Create & Guest.Create;
  type Update = Partial<Omit<Base, "employee"> & ReservationRoom.Update & ReservationGuest.Update>;
}

declare namespace ReservationGuest {
  interface Base {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    guest_id?: string;
    guest?: Guest.Default;
    nik_passport?: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    nationality?: string;
    nationality_code?: string;
    country?: string;
    country_code?: string;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "reservation" | "guest" | "guest_id" | "reservation_id">;
  type Update = Partial<Omit<Base, "reservation" | "guest">> & {
    birthdate?: Date | string;
    gender?: Enum.Gender;
    profession?: string;
  };
}

declare namespace ReservationRoom {
  interface Base {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    room_id?: string;
    room?: Room.Default;
    room_type_id?: string;
    room_type?: RoomType.Default;
    room_number?: number | "";
    room_type_name?: string;
    room_rate?: number | "";
    bed_type?: string;
    view?: string;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "reservation_id" | "reservation" | "room" | "room_type">;
  type Update = Partial<Omit<Base, "reservation" | "room" | "room_type">>;
}

declare namespace ReservationTransaction {
  interface Base {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    amount: number | "";
    type: Enum.ReservationTransaction;
    is_paid: boolean;
    description: string;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "reservation">;
  type Update = Partial<Omit<Base, "reservation">>;
}

declare namespace CheckIn {
  interface Base {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    check_in_at: Date | string;
    check_in_by: string;
    employee_id: string;
    employee?: Employee.Default;
    notes?: string;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "reservation" | "employee"> & {
    room_status?: Enum.RoomStatus;
  };
  type Update = Partial<Omit<Base, "reservation" | "employee">>;
}

declare namespace CheckOut {
  interface Default {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    check_out_at: Date | string;
    employee_id: string;
    employee?: Employee.Default;
    additional_charge: number | "";
    check_out_by: string;
    notes?: string;
  }

  type Create = Omit<Default, "id" | "reservation" | "employee"> & {
    room_status?: Enum.RoomStatus;
  };
  type Update = Partial<Omit<Default, "reservation" | "employee">>;
}
