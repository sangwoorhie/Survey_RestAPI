import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.NOT_FOUND; // Use the appropriate status code

    response.status(status).json({
      statusCode: status,
      message: '해당 엔티티가 존재하지 않습니다.',
    });
  }
}
