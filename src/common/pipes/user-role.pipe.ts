import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export const USER_ROLES = ['USER', 'ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];

@Injectable()
export class UserRolePipe implements PipeTransform {
  transform(value: unknown): UserRole | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('role must be a string');
    }

    const role = value.trim().toUpperCase();
    if (!USER_ROLES.includes(role as UserRole)) {
      throw new BadRequestException(
        `role must be one of: ${USER_ROLES.join(', ')}`,
      );
    }

    return role as UserRole;
  }
}
