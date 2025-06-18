declare namespace Guest {
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
    country?: string;
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
