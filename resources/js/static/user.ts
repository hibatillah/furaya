import { badgeColor } from ".";

export const RoleBadgeColor = ["manager", "admin", "employee", "guest"].reduce(
  (acc, role, index) => {
    acc[role as Enum.Role] = badgeColor[index];
    return acc;
  },
  {} as Record<Enum.Role, string>,
);
