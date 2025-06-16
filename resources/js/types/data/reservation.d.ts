declare namespace Reservation {
  interface Base {
    id: string;
    booking_number: number | "";
    adults: number | "";
    pax: number | "";
    length_of_stay: number | "";
    total_price: number | "";
    start_date: Date | string;
    end_date?: Date | string | null;
    room_id: string;
    room?: Room.Default;
    customer_id: string;
    customer?: Guest.Default;
    employee_id: string;
    employee?: Employee.Default;
    booking_type: Enum.BookingType;
    purpose: Enum.VisitPurpose;
    room_package: Enum.RoomPackage;
    payment_method: Enum.Payment;
    status_acc: Enum.StatusAcc;
    arrival_from?: string;
    booked_from?: string;
    children?: number | "";
    extra_bed?: number | "";
    discount?: number | "";
    discount_reason?: string;
    commission_percentage?: number | "";
    commission_amount?: number | "";
    remarks?: string;
    advance_remarks?: string;
    advance_amount?: number | "";
  }

  interface Addition {
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
  type Create = Omit<Base, "id" | "room" | "customer" | "employee"> & Guest.Create;
  type Update = Partial<Omit<Base, "room" | "customer" | "employee">>;
}

declare namespace ReservationGuest {
  interface Base {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    guest_id: string;
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
  type Create = Omit<Base, "id" | "reservation" | "guest">;
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
  type Create = Omit<Base, "id" | "reservation" | "room">;
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
