import { Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';

export class SubscribeDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Correo electrónico no válido' })
  @MaxLength(254)
  email: string;
}
