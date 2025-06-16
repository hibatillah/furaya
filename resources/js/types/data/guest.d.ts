declare namespace GuestType {
  interface Base {
    id: string;
    name: string;
    code: string;
    created_by: number;
    user?: User.Default;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "user">;
  type Update = Partial<Omit<Base, "user">>;
}

declare namespace Nationality {
  interface Base {
    id: string;
    name: string;
    code: string;
    created_by: number;
    user?: User.Default;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "user">;
  type Update = Partial<Omit<Base, "user">>;
}

declare namespace Geography {
  interface Base {
    id: string;
    name: string;
    code: string;
    created_by: number;
    user?: User.Default;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "user">;
  type Update = Partial<Omit<Base, "user">>;
}

declare namespace Country {
  interface Base {
    id: string;
    name: string;
    code: string;
    created_by: number;
    user?: User.Default;
  }

  interface Addition {}
  interface Default extends Base, Addition {}
  type Create = Omit<Base, "id" | "user">;
  type Update = Partial<Omit<Base, "user">>;
}
