import { NotFoundException } from '@nestjs/common';
import { AdminService } from '../admin.service';

const now = new Date('2026-01-01T00:00:00.000Z');
const user = {
  id: 'user-1',
  email: 'user@test.com',
  name: 'User',
  role: 'USER',
  banned: false,
  banReason: null,
  banExpires: null,
  createdAt: now,
  updatedAt: now,
};

describe('AdminService', () => {
  let prisma: Record<string, any>;
  let service: AdminService;

  beforeEach(() => {
    prisma = {
      club: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'club-1',
            name: 'Club',
            description: null,
            isPublic: false,
            ownerId: 'user-1',
            createdAt: now,
            updatedAt: now,
          },
        ]),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue(user),
        update: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ ...user, ...data }),
        ),
      },
    };
    service = new AdminService(prisma as never);
  });

  it('lists all clubs including private ones', async () => {
    const result = await service.findAllClubs();

    expect(result.total).toBe(1);
    expect(result.data[0].id).toBe('club-1');
  });

  it('disables and enables a user', async () => {
    const disabled = await service.disableUser('user-1');
    const enabled = await service.enableUser('user-1');

    expect(disabled.banned).toBe(true);
    expect(enabled.banned).toBe(false);
    expect(prisma.user.update).toHaveBeenCalledTimes(2);
  });

  it('throws when the user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.disableUser('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
