import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  cleanDatabase,
  setupTestDb,
  teardownTestDb,
  TestContext,
} from '../../test/setup-test-db';
import { buildFixtures } from '../../test/test-fixtures';
import { UsersService } from '../users.service';

jest.setTimeout(60_000);

describe('UsersService (integration)', () => {
  let ctx: TestContext;
  let service: UsersService;
  let prisma: PrismaService;
  let fixtures: ReturnType<typeof buildFixtures>;

  beforeAll(async () => {
    ctx = await setupTestDb();
    service = ctx.module.get(UsersService);
    prisma = ctx.prisma;
    fixtures = buildFixtures(ctx.module);
  });

  afterAll(() => teardownTestDb(ctx));
  beforeEach(() => cleanDatabase(prisma));

  it('creates a user', async () => {
    const user = await service.create({
      email: 'bob@test.com',
      firstName: 'Bob',
      lastName: 'Martin',
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('bob@test.com');
  });

  it('throws ConflictException when email is already taken', async () => {
    await fixtures.user();

    await expect(
      service.create({
        email: 'alice@test.com',
        firstName: 'Alice',
        lastName: 'Two',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('filters users by global role', async () => {
    await fixtures.user({ email: 'user@test.com' });
    const admin = await fixtures.user({ email: 'admin@test.com' });
    await prisma.user.update({
      where: { id: admin.id },
      data: { role: 'ADMIN' },
    });

    const result = await service.findAll(
      { page: 1, limit: 10, skip: 0 },
      'ADMIN',
    );

    expect(result.total).toBe(1);
    expect(result.data[0].email).toBe('admin@test.com');
  });

  it('throws NotFoundException when updating a missing user', async () => {
    await expect(
      service.update('00000000-0000-0000-0000-000000000000', {
        firstName: 'Missing',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
