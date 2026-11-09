import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthUser } from '../roles';
import { AUTH_COOKIE } from '../auth.constants';

/**
 * Verifica el JWT de la petición.
 * Lo busca primero en la cookie httpOnly (navegador) y, si no existe,
 * en la cabecera `Authorization: Bearer <token>` (curl, Postman, scripts).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Debes iniciar sesión');

    try {
      request.user = await this.jwt.verifyAsync<AuthUser>(token);
      return true;
    } catch {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }
  }

  private extractToken(request: Request): string | undefined {
    const fromCookie = request.cookies?.[AUTH_COOKIE];
    if (fromCookie) return fromCookie;

    const [type, value] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? value : undefined;
  }
}
