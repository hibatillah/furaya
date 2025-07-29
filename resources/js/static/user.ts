import { badgeColor } from ".";

export const roleBadgeColor = {
  "manager": badgeColor.purple,
  "admin": badgeColor.blue,
  "employee": badgeColor.green,
  "guest": badgeColor.rose,
} satisfies Record<Enum.Role, string>

export const genderBadgeColor = {
  "male": badgeColor.blue,
  "female": badgeColor.rose,
} satisfies Record<Enum.Gender, string>