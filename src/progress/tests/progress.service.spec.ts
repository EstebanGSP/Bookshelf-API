import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ClubRole, ReadingStatus } from '../../generated/prisma/client';
import { ProgressService } from '../progress.service';

const now = new Date('2026-01-01T00:00:00.000Z');

describe('ProgressService', () => {
  let repository: Record<string, jest.Mock>;
  let service: ProgressService;

  beforeEach(() => {
    repository = {
      findBookInClub: jest.fn().mockResolvedValue({
        id: 'book-1',
        clubId: 'club-1',
        pageCount: 100,
      }),
      findMembership: jest
        .fn()
        .mockResolvedValue({ id: 'member-1', role: ClubRole.OWNER }),
      findMine: jest.fn().mockResolvedValue(null),
      upsertMine: jest.fn().mockImplementation((data) =>
        Promise.resolve({
          id: 'progress-1',
          ...data,
          updatedAt: now,
        }),
      ),
      findForBook: jest.fn().mockResolvedValue([
        {
          id: 'progress-1',
          userId: 'user-1',
          bookId: 'book-1',
          status: ReadingStatus.READING,
          currentPage: 20,
          totalPages: 100,
          progressPercent: 20,
          updatedAt: now,
          user: { email: 'owner@test.com', name: 'Owner' },
        },
      ]),
    };
    service = new ProgressService(repository as never);
  });

  it('automatically switches to READING when pages are read', async () => {
    const result = await service.updateMine('club-1', 'book-1', {
      currentPage: 25,
    }, 'user-1');

    expect(repository.upsertMine).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ReadingStatus.READING,
        currentPage: 25,
        totalPages: 100,
        progressPercent: 25,
      }),
    );
    expect(result.status).toBe(ReadingStatus.READING);
  });

  it('marks progress as COMPLETED at the last page', async () => {
    const result = await service.updateMine('club-1', 'book-1', {
      currentPage: 100,
    }, 'user-1');

    expect(result.status).toBe(ReadingStatus.COMPLETED);
    expect(result.progressPercent).toBe(100);
  });

  it('rejects progress greater than the book page count', async () => {
    await expect(
      service.updateMine('club-1', 'book-1', { currentPage: 101 }, 'user-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('forbids readers from viewing global progress', async () => {
    repository.findMembership.mockResolvedValue({
      id: 'member-1',
      role: ClubRole.READER,
    });

    await expect(
      service.findForBook('club-1', 'book-1', { id: 'user-1', role: 'USER' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
