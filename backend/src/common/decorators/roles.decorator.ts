import { SetMetadata } from '@nestjs/common';
import { Role } from '../../auth/roles';

export const ROLES_KEY = 'roles';

/** Indica qué roles pueden acceder a una ruta. Lo lee RolesGuard. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
