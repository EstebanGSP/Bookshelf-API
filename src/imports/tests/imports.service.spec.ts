import { ForbiddenException } from '@nestjs/common';
import { ClubRole } from '../../generated/prisma/client';
import { ImportsService } from '../imports.service';

describe('ImportsService', () => {
  let prisma: Record<string, any>;
  let service: ImportsService;

  beforeEach(() => {
    prisma = {
      catalogBook: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn((input) => input),
      },
      club: {
        findUnique: jest.fn().mockResolvedValue({ id: 'club-1' }),
      },
      clubMember: {
        findUnique: jest.fn().mockResolvedValue({ role: ClubRole.OWNER }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      clubInvitation: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn((input) => input),
      },
      user: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      book: {
        findMany: jest.fn().mockResolvedValue([
          {
            isbn: '9782070612758',
            title: 'Le Petit Prince',
            author: 'Antoine de Saint-Exupery',
            genre: 'Conte',
            pageCount: 120,
            description: 'Avec une virgule, donc echappee',
            createdAt: new Date('2026-01-01T00:00:00.000Z'),
          },
        ]),
      },
      $transaction: jest.fn(async (operation) => {
        if (Array.isArray(operation)) {
          return Promise.all(operation);
        }
        return operation(prisma);
      }),
    };
    service = new ImportsService(prisma as never);
  });

  it('imports valid catalog rows transactionally', async () => {
    const result = await service.importCatalogBooks({
      csv: [
        'isbn,title,author,genre,pageCount,description,publishedAt',
        '9782070612758,Le Petit Prince,Antoine,Conte,120,Classique,1943-04-06',
      ].join('\n'),
    });

    expect(result).toEqual({ imported: 1, errors: [] });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('reports CSV errors and does not write invalid catalog rows', async () => {
    const result = await service.importCatalogBooks({
      csv: [
        'isbn,title,author,genre,pageCount',
        '9782070612758,,Antoine,Conte,abc',
      ].join('\n'),
    });

    expect(result.imported).toBe(0);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'title is required' }),
        expect.objectContaining({
          message: 'pageCount must be a positive integer',
        }),
      ]),
    );
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('forbids non owners from importing club members', async () => {
    prisma.clubMember.findUnique.mockResolvedValue({ role: ClubRole.READER });

    await expect(
      service.importClubMembers(
        'club-1',
        { csv: 'email,role\nreader@test.com,READER' },
        { id: 'user-1', role: 'USER' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('exports only non sensitive club book fields as CSV', async () => {
    const csv = await service.exportClubBooks('club-1', {
      id: 'user-1',
      role: 'USER',
    });

    expect(csv).toContain('isbn,title,author,genre,pageCount,description,createdAt');
    expect(csv).toContain('"Avec une virgule, donc echappee"');
    expect(csv).not.toContain('reader@test.com');
  });
});
