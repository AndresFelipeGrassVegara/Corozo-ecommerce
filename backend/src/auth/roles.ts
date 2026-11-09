/** Roles de usuario. Se guardan como texto en la columna User.role. */
export const Role = {
  Admin: 'ADMIN',
  Customer: 'CUSTOMER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

/** Datos del usuario autenticado que viajan dentro del JWT. */
export interface AuthUser {
  sub: number;
  email: string;
  role: Role;
}
