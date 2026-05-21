import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';
import { auth } from '../../lib/auth';

@Injectable()
export class AuthenticatedRequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(
    AuthenticatedRequestLoggerMiddleware.name,
  );

  async use(req: Request, _res: Response, next: NextFunction) {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (session?.user?.id) {
        this.logger.log(
          `${req.method} ${req.originalUrl} user=${session.user.id}`,
        );
      }
    } catch {
      // Logging must never block the request pipeline.
    }
    next();
  }
}
