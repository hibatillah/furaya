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
    extra_bed?: number | "";
    arrival_from?: string;
    guest_type?: string;
    employee_name: string;
    employee_id: string;
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
  }

  interface Addition {
    reservation_guest?: ReservationGuest.Default;
    reservation_room?: ReservationRoom.Default;
    reservation_transaction?: ReservationTransaction.Default;
    formatted_start_date?: string;
    formatted_end_date?: string;


    check_in?: CheckIn.Default;
    check_out?: CheckOut.Default;
    is_check_in?: boolean;
    is_check_out?: boolean;
    room_status?: Enum.RoomStatus;
    formatted_check_in?: string;
    formatted_check_out?: string;
    formatted_created_at?: string;
    formatted_updated_at?: string;
  }

  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "employee"> & ReservationRoom.Create & Guest.Create;
  type Update = Partial<Omit<Base, "employee">>;
}

declare namespace ReservationGuest {
  interface Base {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    guest_id?: string;
    guest?: Guest.Default;
    nik_passport: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    nationality?: string;
    country?: string;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "reservation" | "guest" | "guest_id" | "reservation_id">;
  type Update = Partial<Omit<Base, "reservation" | "guest">>;
}

declare namespace ReservationRoom {
  interface Base {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    room_id: string;
    room?: Room.Default;
    room_number: number | "";
    room_type: string;
    room_rate: number | "";
    bed_type: string;
    meal?: string;
    view?: string;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "reservation_id" | "reservation" | "room">;
  type Update = Partial<Omit<Base, "reservation" | "room">>;
}

declare namespace ReservationTransaction {
  interface Base {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    date: Date | string;
    description: string;
    amount: number | "";
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
    checked_in_at: Date | string;
    employee_id: string;
    employee?: Employee.Default;
    notes?: string;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "reservation" | "employee" | "employee_id">;
  type Update = Partial<Omit<Base, "reservation" | "employee">>;
}

declare namespace CheckOut {
  interface Default {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    checked_out_at: Date | string;
    employee_id: string;
    employee?: Employee.Default;
    final_total: number | "";
    notes?: string;
  }

  type Create = Omit<Default, "id" | "reservation" | "employee" | "employee_id">;
  type Update = Partial<Omit<Default, "reservation" | "employee">>;
}
