import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthenticatedRequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(
    AuthenticatedRequestLoggerMiddleware.name,
  );

  use(req: Request, _res: Response, next: NextFunction) {
    const userId = (req as Request & { user?: { id?: string } }).user?.id;
    if (userId) {
      this.logger.log(`${req.method} ${req.originalUrl} user=${userId}`);
    }
    next();
  }
}
