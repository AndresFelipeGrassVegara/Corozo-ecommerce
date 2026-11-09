import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthUser, Role } from './roles';

// Hash ficticio para comparar cuando el email no existe: así la respuesta
// tarda lo mismo y no revela qué correos están registrados.
const DUMMY_HASH = bcrypt.hashSync('coroso-dummy-password', 12);

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

    if (!user || !valid) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const payload: AuthUser = { sub: user.id, email: user.email, role: user.role as Role };
    return {
      accessToken: await this.jwt.signAsync(payload),
      user: this.toPublicUser(user),
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.toPublicUser(user);
  }

  /** Nunca devolvemos el hash de la contraseña al cliente. */
  private toPublicUser(user: { id: number; email: string; name: string; role: string }) {
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
