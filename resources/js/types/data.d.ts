declare namespace Room {
  interface Default {
    id: string;
    room_number: number | "";
    floor_number: number | "";
    view?: string;
    condition: Enum.RoomCondition;
    room_type_id?: string;
    room_type?: RoomType.Default;
    bed_type_id?: string;
    bed_type?: BedType.Default;
    room_status_id?: string | null;
    room_status?: RoomStatus.Default;
    price: number | "";
    capacity: number | "";
  }

  type Create = Omit<Default, "id" | "room_type" | "bed_type" | "room_status"> & {
    facilities: string[];
  };
  type Update = Partial<
    Omit<Default, "room_type" | "bed_type" | "room_status"> & {
      facilities?: string[];
    }
  >;
}

declare namespace RoomStatus {
  interface Default {
    id: string;
    status: Enum.RoomStatus;
    from: Date | string;
    to: Date | string;
    employee_id: string;
    employee?: Employee.Default;
  }

  type Create = Omit<Default, "id" | "employee">;
  type Update = Partial<Omit<Default, "employee">>;
}

declare namespace RoomType {
  interface Default extends Additional {
    id: string;
    name: string;
    capacity: number | "";
    base_rate?: number | "";
  }

  interface Additional {
    rooms_count?: number;
    can_delete: boolean;
    facilities_count: number;
    room_type_facility: RoomTypeFacility.Default[];
    facility: Facility.Default[];
  }

  type Create = Omit<Default, "id" | "room_type_facility" | "facility"> & {
    facilities: string[];
  };

  type Update = Partial<
    Omit<Default, "room_type_facility" | "facility"> & {
      facilities?: string[];
    }
  >;
}

declare namespace BedType {
  interface Default {
    id: string;
    name: string;
    rooms_count: number;
    can_delete: boolean;
  }

  type Create = Omit<Default, "id">;
  type Update = Partial<Default>;
}

declare namespace RoomFacility {
  interface Default {
    id: string;
    room_id: string;
    room?: Room.Default;
    facility_id: string;
    facility?: Facility.Default;
  }

  type Create = Omit<Default, "id" | "room" | "facility">;
  type Update = Partial<Omit<Default, "room" | "facility">>;
}

declare namespace RoomTypeFacility {
  interface Default {
    id: string;
    room_type_id: string;
    room_type?: RoomType.Default;
    facility_id: string;
    facility?: Facility.Default;
  }

  type Create = Omit<Default, "id" | "room_type" | "facility">;
  type Update = Partial<Omit<Default, "room_type" | "facility">>;
}

declare namespace Facility {
  interface Default {
    id: string;
    name: string;
    description?: string;
    rooms_count: number;
    can_delete: boolean;
  }

  type Create = Omit<Default, "id">;
  type Update = Partial<Default>;
}

declare namespace Customer {
  interface Default {
    id: string;
    user_id: string;
    user?: User.Default;
    nik_passport: string;
    gender: Enum.Gender;
    birthdate: Date | string;
    phone?: string;
    profession?: string;
    nationality?: string;
    address?: string;
    formatted_birthdate?: string;
    formatted_gender?: string;
  }

  type Create = {
    name: string;
    email: string;
  } & Omit<Default, "id" | "user">;

  type Update = Partial<
    Omit<Default, "user"> & {
      name?: string;
      email?: string;
    }
  >;
}

declare namespace Department {
  interface Default {
    id: string;
    name: string;
    employees_count: number;
    can_delete: boolean;
  }

  type Create = Omit<Default, "id">;
  type Update = Partial<Default>;
}

declare namespace Employee {
  interface Default {
    id: string;
    user_id: string;
    user?: User.Default;
    department_id: string;
    department?: Department.Default;
    gender: Enum.Gender;
    phone?: string;
    address?: string;
    hire_date: Date | string;
    salary?: number | "";
    formatted_hire_date?: string;
    formatted_gender?: string;
  }

  type Create = {
    name: string;
    email: string;
    password: string;
  } & Omit<Default, "id" | "user" | "department">;

  type Update = Partial<
    Omit<Default, "user" | "department"> & {
      name?: string;
      email?: string;
    }
  >;
}

declare namespace User {
  interface Default {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Enum.Role;
    email_verified_at?: Date | string;
    deleted_at?: Date | string;
  }

  type Create = Omit<Default, "id" | "role">;
  type Update = Partial<Omit<Default, "role">>;
}

declare namespace Reservation {
  interface Default {
    id: string;
    booking_number: number | "";
    adults: number | "";
    people_count: number | "";
    length_of_stay: number | "";
    check_in?: Date | string;
    check_out?: Date | string;
    total_price: number | "";
    room_id: string;
    room?: Room.Default;
    customer_id: string;
    customer?: Customer.Default;
    employee_id: string;
    employee?: Employee.Default;
    booking_type: Enum.BookingType;
    purpose: Enum.VisitPurpose;
    room_package: Enum.RoomPackage;
    payment_method: Enum.Payment;
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
    formatted_check_in?: string;
    formatted_check_out?: string;
    formatted_total_price?: string;
    created_at?: Date | string;
  }

  type Create = Omit<Default, "id">;
  type Update = Partial<Omit<Default, "room" | "customer" | "employee">>;
}

declare namespace CheckIn {
  interface Default {
    id: string;
    reservation_id: string;
    reservation?: Reservation.Default;
    checked_in_at: Date | string;
    employee_id: string;
    employee?: Employee.Default;
    notes?: string;
  }

  type Create = Omit<Default, "id" | "reservation" | "employee">;
  type Update = Partial<Omit<Default, "reservation" | "employee">>;
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

  type Create = Omit<Default, "id" | "reservation" | "employee">;
  type Update = Partial<Omit<Default, "reservation" | "employee">>;
}

declare namespace Enum {
  export type BookingType = "direct" | "online" | "walk in" | "travel" | "other";
  export type RoomStatus = "OCC" | "VC" | "HU" | "OO" | "CO" | "CI" | "CIP" | "PDU" | "DU" | "ONL" | "SO" | "DD";
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
  export type Role = "admin" | "manager" | "employee" | "customer";
  export type Gender = "male" | "female";
  export type Payment = "cash" | "bank transfer" | "debit card" | "digital wallet" | "credit card" | "voucher" | "direct billing" | "other";
}
