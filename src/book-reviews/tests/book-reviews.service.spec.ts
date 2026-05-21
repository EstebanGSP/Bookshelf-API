import { ConflictException, ForbiddenException } from '@nestjs/common';
import { BookReviewsService } from '../book-reviews.service';

const now = new Date('2026-01-01T00:00:00.000Z');

const review = {
  id: 'review-1',
  userId: 'user-1',
  bookId: 'book-1',
  rating: 5,
  comment: 'Tres bien.',
  createdAt: now,
  updatedAt: now,
  user: { email: 'reader@test.com', name: 'Reader' },
};

describe('BookReviewsService', () => {
  let repository: Record<string, jest.Mock>;
  let service: BookReviewsService;

  beforeEach(() => {
    repository = {
      findBookInClub: jest.fn().mockResolvedValue({ id: 'book-1' }),
      findMembership: jest.fn().mockResolvedValue({ id: 'member-1' }),
      findMine: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(review),
      findAllForBook: jest.fn().mockResolvedValue([review]),
      findById: jest.fn().mockResolvedValue(review),
      update: jest.fn().mockResolvedValue({ ...review, rating: 4 }),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    service = new BookReviewsService(repository as never);
  });

  it('creates one review per member and book', async () => {
    const result = await service.create(
      'club-1',
      'book-1',
      { rating: 5, comment: 'Tres bien.' },
      { id: 'user-1', role: 'USER' },
    );

    expect(repository.create).toHaveBeenCalledWith(
      'user-1',
      'book-1',
      expect.objectContaining({ rating: 5 }),
    );
    expect(result.rating).toBe(5);
  });

  it('rejects duplicate reviews for the same book', async () => {
    repository.findMine.mockResolvedValue(review);

    await expect(
      service.create(
        'club-1',
        'book-1',
        { rating: 4 },
        { id: 'user-1', role: 'USER' },
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('allows only the author or an admin to update a review', async () => {
    await expect(
      service.update(
        'club-1',
        'book-1',
        'review-1',
        { rating: 3 },
        { id: 'other-user', role: 'USER' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    await service.update(
      'club-1',
      'book-1',
      'review-1',
      { rating: 4 },
      { id: 'admin-1', role: 'ADMIN' },
    );
    expect(repository.update).toHaveBeenCalledWith('review-1', { rating: 4 });
  });
});
