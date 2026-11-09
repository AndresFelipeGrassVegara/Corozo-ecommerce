import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

/**
 * Traduce los errores conocidos de Prisma a respuestas HTTP claras,
 * sin filtrar detalles internos de la base de datos al cliente.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(error: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const map: Record<string, [HttpStatus, string]> = {
      P2002: [HttpStatus.CONFLICT, 'Ya existe un registro con ese valor único'],
      P2003: [HttpStatus.BAD_REQUEST, 'Referencia a un registro que no existe'],
      P2025: [HttpStatus.NOT_FOUND, 'Registro no encontrado'],
    };
    const [status, message] = map[error.code] ?? [HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno'];

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(error.message, error.stack);
    }
    response.status(status).json({ statusCode: status, message });
  }
}
