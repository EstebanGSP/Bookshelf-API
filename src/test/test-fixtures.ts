import { TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';

export function buildFixtures(module: TestingModule) {
  const usersService = module.get(UsersService);

  return {
    user(override?: { email?: string; firstName?: string; lastName?: string }) {
      return usersService.create({
        email: override?.email ?? 'alice@test.com',
        firstName: override?.firstName ?? 'Alice',
        lastName: override?.lastName ?? 'Smith',
      });
    },
  };
}
