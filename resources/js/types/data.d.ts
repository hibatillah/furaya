declare namespace Room {
  interface Default {
    id: string;
    room_number: number | '';
    floor_number: number | '';
    status: Enum.RoomStatus;
    room_type_id?: string;
    room_type?: RoomType.Default;
    bed_type_id?: string;
    bed_type?: BedType.Default;
  }

  type Create = Omit<Default, 'id' | 'room_type' | 'bed_type'>;
  type Update = Partial<Omit<Default, 'room_type' | 'bed_type'>>;
}

declare namespace RoomType {
  interface Default {
    id: string;
    name: string;
    capacity: number | '';
    base_rate?: number | '';
  }

  type Create = Omit<Default, 'id'>;

  type Update = Partial<Default>;
}

declare namespace BedType {
  interface Default {
    id: string;
    name: string;
  }

  type Create = Omit<Default, 'id'>;

  type Update = Partial<Default>;
}

declare namespace Admin {
  interface Default {
    id: string;
    user_id: string;
    user?: User.Default;
  }

  type Create = Omit<Default, 'id' | 'user'>;

  type Update = Partial<Omit<Default, 'user'>>;
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
    province?: string;
    city?: string;
  }

  type Create = Omit<Default, 'id' | 'user'>;

  type Update = Partial<Omit<Default, 'user'>>;
}

declare namespace Department {
  interface Default {
    id: string;
    name: string;
  }

  type Create = Omit<Default, 'id'>;

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
    salary?: number | '';
  }

  type Create = Omit<Default, 'id' | 'user' | 'department'>;

  type Update = Partial<Omit<Default, 'user' | 'department'>>;
}

declare namespace Manager {
  interface Default {
    id: string;
    user_id: string;
    user?: User.Default;
  }

  type Create = Omit<Default, 'id' | 'user'>;

  type Update = Partial<Omit<Default, 'user'>>;
}

declare namespace Role {
  interface Default {
    id: string;
    name: string;
  }

  type Create = Omit<Default, 'id'>;

  type Update = Partial<Default>;
}

declare namespace User {
  interface Default {
    id: string;
    name: string;
    email: string;
    password: string;
    role_id?: string;
    role?: Role.Default;
    email_verified_at?: Date | string;
  }

  type Create = Omit<Default, 'id' | 'role'>;

  type Update = Partial<Omit<Default, 'role'>>;
}

declare namespace Enum {
  export type RoomStatus = 'ready' | 'booked' | 'cleaning' | 'maintenance' | 'booked cleaning' | 'unclean' | 'blocked' | 'unreserved';

  export type Role = 'admin' | 'manager' | 'employee' | 'customer';

  export type Gender = 'male' | 'female';
}
