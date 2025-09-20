export const USER_ROLES = {
  CITIZEN: 'citizen',
  STAFF: 'staff',
  OFFICER: 'officer',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];