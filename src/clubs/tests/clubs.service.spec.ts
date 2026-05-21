import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ClubRole } from '../../generated/prisma/client';
import { ClubsService } from '../clubs.service';

const now = new Date('2026-01-01T00:00:00.000Z');
const club = {
  id: 'club-1',
  name: 'Club',
  description: 'Description',
  isPublic: true,
  ownerId: 'owner-1',
  createdAt: now,
  updatedAt: now,
};

describe('ClubsService', () => {
  let repository: Record<string, jest.Mock>;
  let service: ClubsService;

  beforeEach(() => {
    repository = {
      create: jest.fn().mockResolvedValue(club),
      findPublic: jest.fn().mockResolvedValue([club]),
      countPublic: jest.fn().mockResolvedValue(1),
      findById: jest.fn().mockResolvedValue(club),
      findMembership: jest.fn().mockResolvedValue({ role: ClubRole.OWNER }),
      update: jest.fn().mockResolvedValue({ ...club, name: 'Updated' }),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    service = new ClubsService(repository as never);
  });

  it('creates a club for the current owner', async () => {
    const result = await service.create(
      { name: 'Club', description: 'Description', isPublic: true },
      'owner-1',
    );

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Club' }),
      'owner-1',
    );
    expect(result.name).toBe('Club');
  });

  it('paginates public clubs', async () => {
    const result = await service.findPublic({ page: 1, limit: 10, skip: 0 });

    expect(result.total).toBe(1);
    expect(result.data[0].id).toBe('club-1');
  });

  it('allows only owners or admins to update a club', async () => {
    repository.findMembership.mockResolvedValue({ role: ClubRole.READER });

    await expect(
      service.update('club-1', { name: 'Nope' }, { id: 'reader-1', role: 'USER' }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await service.update('club-1', { name: 'Admin update' }, {
      id: 'admin-1',
      role: 'ADMIN',
    });
    expect(repository.update).toHaveBeenCalledWith('club-1', {
      name: 'Admin update',
    });
  });

  it('throws when deleting an unknown club', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.remove('missing', { id: 'owner-1', role: 'USER' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
