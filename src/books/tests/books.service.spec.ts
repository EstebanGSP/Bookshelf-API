import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ClubRole } from '../../generated/prisma/client';
import { BooksService } from '../books.service';

const now = new Date('2026-01-01T00:00:00.000Z');

const book = {
  id: 'book-1',
  clubId: 'club-1',
  title: 'Le Petit Prince',
  author: 'Antoine de Saint-Exupery',
  isbn: '9782070612758',
  genre: 'Conte',
  pageCount: 120,
  description: 'Un classique.',
  createdAt: now,
  updatedAt: now,
};

describe('BooksService', () => {
  const actor = { id: 'user-1', role: 'USER' };
  let repository: Record<string, jest.Mock>;
  let service: BooksService;

  beforeEach(() => {
    repository = {
      findClub: jest.fn().mockResolvedValue({ id: 'club-1' }),
      findMembership: jest.fn().mockResolvedValue({ role: ClubRole.EDITOR }),
      create: jest.fn().mockResolvedValue(book),
      findAll: jest.fn().mockResolvedValue([book]),
      count: jest.fn().mockResolvedValue(1),
      averageRatings: jest
        .fn()
        .mockResolvedValue([{ bookId: 'book-1', _avg: { rating: 4.5 } }]),
      findById: jest.fn().mockResolvedValue(book),
      averageRating: jest.fn().mockResolvedValue({ _avg: { rating: 4 } }),
      update: jest.fn().mockResolvedValue({ ...book, title: 'Updated' }),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    service = new BooksService(repository as never);
  });

  it('allows owners and editors to create club books', async () => {
    const result = await service.create(
      'club-1',
      {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        genre: book.genre,
        pageCount: book.pageCount,
        description: book.description,
      },
      actor,
    );

    expect(repository.create).toHaveBeenCalledWith(
      'club-1',
      expect.objectContaining({ title: book.title, pageCount: 120 }),
      'user-1',
    );
    expect(result.title).toBe(book.title);
  });

  it('forbids readers from mutating club books', async () => {
    repository.findMembership.mockResolvedValue({ role: ClubRole.READER });

    await expect(
      service.update('club-1', 'book-1', { title: 'Nope' }, actor),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('returns paginated books with average ratings', async () => {
    const result = await service.findAll(
      'club-1',
      { page: 1, limit: 10, skip: 0 },
      { title: 'Prince' },
      actor,
    );

    expect(result).toMatchObject({
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    expect(result.data[0].averageRating).toBe(4.5);
  });

  it('throws when a requested book does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('club-1', 'missing', actor)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
