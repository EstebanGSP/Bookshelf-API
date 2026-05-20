import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ClubRoleGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    // TODO: read required club roles metadata and compare it to the current user's membership.
    return true;
  }
}
