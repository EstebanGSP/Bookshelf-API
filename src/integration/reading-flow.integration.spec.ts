import { BookReviewsService } from '../book-reviews/book-reviews.service';
import { BooksService } from '../books/books.service';
import { ClubRole, ReadingStatus } from '../generated/prisma/client';
import { ProgressService } from '../progress/progress.service';

const now = new Date('2026-01-01T00:00:00.000Z');

describe('BookShelf reading flow integration', () => {
  it('creates a club book, tracks progress and publishes a review', async () => {
    const state = {
      club: { id: 'club-1' },
      membership: { id: 'member-1', role: ClubRole.OWNER },
      book: {
        id: 'book-1',
        clubId: 'club-1',
        title: 'Initial',
        author: 'Author',
        isbn: null,
        genre: null,
        pageCount: 200,
        description: null,
        createdAt: now,
        updatedAt: now,
      },
      progress: null as any,
      review: null as any,
    };

    const booksRepository = {
      findClub: jest.fn().mockResolvedValue(state.club),
      findMembership: jest.fn().mockResolvedValue(state.membership),
      create: jest.fn(async (_clubId: string, dto: any) => {
        state.book = { ...state.book, ...dto };
        return state.book;
      }),
      findById: jest.fn().mockResolvedValue(state.book),
      averageRating: jest.fn(() =>
        Promise.resolve({
          _avg: { rating: state.review ? state.review.rating : null },
        }),
      ),
    };

    const progressRepository = {
      findBookInClub: jest.fn().mockResolvedValue(state.book),
      findMembership: jest.fn().mockResolvedValue(state.membership),
      findMine: jest.fn(() => Promise.resolve(state.progress)),
      upsertMine: jest.fn(async (data: any) => {
        state.progress = {
          id: 'progress-1',
          ...data,
          updatedAt: now,
        };
        return state.progress;
      }),
    };

    const reviewsRepository = {
      findBookInClub: jest.fn().mockResolvedValue(state.book),
      findMembership: jest.fn().mockResolvedValue(state.membership),
      findMine: jest.fn(() => Promise.resolve(state.review)),
      create: jest.fn(async (userId: string, bookId: string, dto: any) => {
        state.review = {
          id: 'review-1',
          userId,
          bookId,
          rating: dto.rating,
          comment: dto.comment ?? null,
          createdAt: now,
          updatedAt: now,
          user: { email: 'owner@test.com', name: 'Owner' },
        };
        return state.review;
      }),
    };

    const books = new BooksService(booksRepository as never);
    const progress = new ProgressService(progressRepository as never);
    const reviews = new BookReviewsService(reviewsRepository as never);
    const actor = { id: 'user-1', role: 'USER' };

    const createdBook = await books.create(
      'club-1',
      {
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupery',
        pageCount: 200,
      },
      actor,
    );
    const readingProgress = await progress.updateMine(
      'club-1',
      createdBook.id,
      { currentPage: 50 },
      actor.id,
    );
    const review = await reviews.create(
      'club-1',
      createdBook.id,
      { rating: 5, comment: 'Lecture validee.' },
      actor,
    );
    const fetchedBook = await books.findOne('club-1', createdBook.id, actor);

    expect(createdBook.pageCount).toBe(200);
    expect(readingProgress.status).toBe(ReadingStatus.READING);
    expect(readingProgress.progressPercent).toBe(25);
    expect(review.rating).toBe(5);
    expect(fetchedBook.averageRating).toBe(5);
  });
});
