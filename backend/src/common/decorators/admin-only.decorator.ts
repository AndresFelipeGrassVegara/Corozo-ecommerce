import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/roles';
import { Roles } from './roles.decorator';

/**
 * Protege una ruta para que solo la usen administradores.
 *
 *   @AdminOnly()
 *   @Post()
 *   create(...) {}
 */
export function AdminOnly() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.Admin),
    ApiCookieAuth('access_token'),
    ApiUnauthorizedResponse({ description: 'Sesión no iniciada o expirada' }),
    ApiForbiddenResponse({ description: 'Se requiere rol de administrador' }),
  );
}
