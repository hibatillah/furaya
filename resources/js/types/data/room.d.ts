declare namespace Room {
  interface Base {
    id: string;
    room_number: number | "";
    floor_number: number | "";
    view?: string;
    price: number | "";
    capacity: number | "";
    size: number | "";
    smoking_type: Enum.SmokingType;
    condition: Enum.RoomCondition;
    status: Enum.RoomStatus;
    room_layout?: string;
    images?: string[];
    room_type_id?: string;
    room_type?: RoomType.Default;
    bed_type_id?: string;
    bed_type?: BedType.Default;
    rate_type_id?: string;
    rate_type?: RateType.Default;
  }

  interface Addition {
    facility?: RoomFacility.Default[];
    count_facility?: number;
    formatted_images?: string[];
    image_files?: FileWithPreview[];
    formatted_room_layout_image?: string;
  }

  interface Default extends Base, Addition {}

  type Create = Omit<Base, "id" | "room_type" | "bed_type" | "rate_type" | "images" | "room_layout"> & {
    facilities: string[];
    images?: File[] | null;
    room_layout?: File | null;
  };

  type Update = Partial<Omit<Base, "room_type" | "bed_type" | "rate_type" | "images" | "room_layout">> & {
    facilities?: string[];
    images?: File[] | null;
    room_layout?: File | null;
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
    code: string;
    name: string;
    capacity: number | "";
    size: number | "";
    base_rate?: number | "";
    images?: string[];
    facility?: Facility.Default[];
    rate_type_id?: string;
    rate_type?: RateType.Default;
    bed_type_id?: string;
    bed_type?: BedType.Default;
  }

  interface Addition {
    rooms_count?: number;
    available_rooms_count?: number;
    can_delete: boolean;
    facilities_count: number;
    formatted_images?: string[];
    image_files?: FileMetadata[];
  }

  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "facility" | "rate_type" | "bed_type" | "images"> & {
    facilities: string[];
    images?: File[] | null;
  };
  type Update = Partial<Omit<Base, "facility" | "rate_type" | "bed_type" | "images">> & {
    facilities?: string[];
    images?: File[] | null;
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

declare namespace RateType {
  interface Base {
    id: string;
    code: string;
    name: string;
    rate: number | "";
  }

  interface Addition {
    rooms_count?: number;
  }
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id">;
  type Update = Partial<Base>;
}

declare namespace Meal {
  interface Base {
    id: string;
    name: string;
    code: string;
    created_by: number;
    created_by_user?: User.Default;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "user">;
  type Update = Partial<Omit<Base, "user">>;
}
