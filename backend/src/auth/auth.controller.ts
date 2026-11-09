import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CookieOptions, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Env } from '../config/env.validation';
import { AUTH_COOKIE } from './auth.constants';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthUser } from './roles';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  /** Inicia sesión y guarda el JWT en una cookie httpOnly. */
  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // Máx. 5 intentos/min por IP (anti fuerza bruta)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, user } = await this.auth.login(dto);
    res.cookie(AUTH_COOKIE, accessToken, this.cookieOptions());
    return { user };
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    const { maxAge: _maxAge, ...options } = this.cookieOptions();
    res.clearCookie(AUTH_COOKIE, options);
  }

  /** Devuelve el usuario de la sesión actual (o 401). */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.auth.getProfile(user.sub);
  }

  /**
   * httpOnly  → JavaScript no puede leer la cookie (protege frente a XSS).
   * sameSite  → el navegador no la envía desde otros sitios (protege frente a CSRF).
   * secure    → solo viaja por HTTPS en producción.
   */
  private cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: 'strict',
      secure: this.config.get('NODE_ENV') === 'production',
      path: '/api',
      maxAge: this.config.get('JWT_EXPIRES_HOURS') * 60 * 60 * 1000,
    };
  }
}
