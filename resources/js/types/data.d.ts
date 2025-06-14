declare namespace Room {
  interface Base {
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

  interface Addition {
    image_url?: string;
    facility?: RoomFacility.Default[];
    count_facility?: number;
  }

  interface Default extends Base, Addition {}

  type Create = Omit<Base, "id" | "room_type" | "bed_type" | "room_status" | "room_status_id"> & {
    facilities: string[];
    image?: File | null;
  };

  type Update = Partial<Omit<Base, "room_type" | "bed_type" | "room_status" | "room_status_id">> & {
    facilities?: string[];
    image?: File | null;
  };
}

declare namespace RoomStatus {
  interface Base {
    id: string;
    status: Enum.RoomStatus;
    from: Date | string;
    to: Date | string;
    employee_id: string;
    employee?: Employee.Default;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "employee">;
  type Update = Partial<Omit<Base, "employee">>;
}

declare namespace RoomType {
  interface Base {
    id: string;
    name: string;
    capacity: number | "";
    base_rate?: number | "";
  }

  interface Addition {
    rooms_count?: number;
    can_delete: boolean;
    facilities_count: number;
    room_type_facility: RoomTypeFacility.Default[];
    facility: Facility.Default[];
  }

  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "room_type_facility" | "facility"> & {
    facilities: string[];
  };
  type Update = Partial<Omit<Base, "room_type_facility" | "facility">> & {
    facilities?: string[];
  };
}

declare namespace BedType {
  interface Base {
    id: string;
    name: string;
  }

  interface Addition {
    rooms_count: number;
    can_delete: boolean;
  }

  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id">;
  type Update = Partial<Base>;
}

declare namespace RoomFacility {
  interface Base {
    id: string;
    room_id: string;
    room?: Room.Default;
    facility_id: string;
    facility?: Facility.Default;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "room" | "facility">;
  type Update = Partial<Omit<Base, "room" | "facility">>;
}

declare namespace RoomTypeFacility {
  interface Base {
    id: string;
    room_type_id: string;
    room_type?: RoomType.Default;
    facility_id: string;
    facility?: Facility.Default;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "room_type" | "facility">;
  type Update = Partial<Omit<Base, "room_type" | "facility">>;
}

declare namespace Facility {
  interface Base {
    id: string;
    name: string;
    description?: string;
  }

  interface Addition {
    rooms_count: number;
    can_delete: boolean;
  }

  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id">;
  type Update = Partial<Base>;
}

declare namespace Customer {
  interface Base {
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
  }

  interface Addition {
    name?: string;
    formatted_birthdate?: string;
    formatted_gender?: string;
  }

  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "user" | "user_id"> & {
    name: string;
    email: string;
  };
  type Update = Partial<Omit<Base, "user">> & {
    name?: string;
    email?: string;
  };
}

declare namespace Department {
  interface Base {
    id: string;
    name: string;
    employees_count: number;
  }

  interface Addition {
    can_delete?: boolean;
  }

  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id">;
  type Update = Partial<Base>;
}

declare namespace Employee {
  interface Base {
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
  }

  interface Addition {
    formatted_hire_date?: string;
    formatted_gender?: string;
  }

  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "user" | "department"> & {
    name: string;
    email: string;
    password: string;
  };
  type Update = Partial<Omit<Base, "user" | "department">> & {
    name?: string;
    email?: string;
  };
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
  interface Base {
    id: string;
    booking_number: number | "";
    adults: number | "";
    people_count: number | "";
    length_of_stay: number | "";
    total_price: number | "";
    start_date: Date | string;
    end_date?: Date | string | null;
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
  type Create = Omit<Base, "id" | "room" | "customer" | "employee"> & Customer.Create;
  type Update = Partial<Omit<Base, "room" | "customer" | "employee">>;
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
