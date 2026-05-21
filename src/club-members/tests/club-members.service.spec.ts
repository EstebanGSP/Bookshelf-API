import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ClubRole } from '../../generated/prisma/client';
import { ClubMembersService } from '../club-members.service';

const now = new Date('2026-01-01T00:00:00.000Z');
const member = {
  id: 'member-1',
  clubId: 'club-1',
  userId: 'user-2',
  role: ClubRole.READER,
  joinedAt: now,
  user: { email: 'reader@test.com', name: 'Reader' },
};

describe('ClubMembersService', () => {
  let repository: Record<string, jest.Mock>;
  let service: ClubMembersService;

  beforeEach(() => {
    repository = {
      findClub: jest.fn().mockResolvedValue({ id: 'club-1' }),
      findAll: jest.fn().mockResolvedValue([member]),
      findMembership: jest.fn().mockResolvedValue({ role: ClubRole.OWNER }),
      findUserByEmail: jest.fn().mockResolvedValue(null),
      createInvitation: jest.fn().mockResolvedValue({ id: 'invitation-1' }),
      addExistingUser: jest.fn().mockResolvedValue(member),
      findMembershipById: jest.fn().mockResolvedValue(member),
      updateRole: jest.fn().mockResolvedValue({ ...member, role: ClubRole.EDITOR }),
      countOwners: jest.fn().mockResolvedValue(2),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    service = new ClubMembersService(repository as never);
  });

  it('lists members after checking the club exists', async () => {
    const result = await service.findAll('club-1');

    expect(repository.findClub).toHaveBeenCalledWith('club-1');
    expect(result[0].user.email).toBe('reader@test.com');
  });

  it('creates a pending invitation for an unknown email', async () => {
    const result = await service.invite(
      'club-1',
      { email: 'new@test.com', role: ClubRole.READER },
      { id: 'owner-1', role: 'USER' },
    );

    expect(result.status).toBe('PENDING_INVITATION');
    expect(repository.createInvitation).toHaveBeenCalledWith(
      'club-1',
      'new@test.com',
      ClubRole.READER,
      'owner-1',
    );
  });

  it('rejects invitations from non owners', async () => {
    repository.findMembership.mockResolvedValue({ role: ClubRole.EDITOR });

    await expect(
      service.invite(
        'club-1',
        { email: 'new@test.com' },
        { id: 'editor-1', role: 'USER' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects inviting a user who is already a member', async () => {
    repository.findUserByEmail.mockResolvedValue({ id: 'user-2' });
    repository.findMembership.mockImplementation((_clubId, userId) =>
      Promise.resolve(userId === 'owner-1' ? { role: ClubRole.OWNER } : member),
    );

    await expect(
      service.invite(
        'club-1',
        { email: 'reader@test.com' },
        { id: 'owner-1', role: 'USER' },
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('prevents removing the last owner', async () => {
    repository.findMembershipById.mockResolvedValue({
      ...member,
      role: ClubRole.OWNER,
    });
    repository.countOwners.mockResolvedValue(1);

    await expect(
      service.remove('club-1', 'member-1', { id: 'owner-1', role: 'USER' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
