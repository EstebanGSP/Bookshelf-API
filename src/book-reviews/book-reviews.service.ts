import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthUser } from '../common/types/auth-user';
import { BookReviewsRepository } from './book-reviews.repository';
import { BookReviewResponseDto } from './dto/book-review-response.dto';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';

@Injectable()
export class BookReviewsService {
  constructor(private readonly bookReviews: BookReviewsRepository) {}

  async findAll(clubId: string, bookId: string, actor: AuthUser) {
    await this.ensureCanRead(clubId, bookId, actor);
    const reviews = await this.bookReviews.findAllForBook(bookId);
    return reviews.map((review) => BookReviewResponseDto.fromPrisma(review));
  }

  async create(
    clubId: string,
    bookId: string,
    dto: CreateBookReviewDto,
    actor: AuthUser,
  ) {
    await this.ensureCanRead(clubId, bookId, actor);
    const existing = await this.bookReviews.findMine(actor.id, bookId);
    if (existing) {
      throw new ConflictException('You already reviewed this book');
    }

    const review = await this.bookReviews.create(actor.id, bookId, dto);
    return BookReviewResponseDto.fromPrisma(review);
  }

  async update(
    clubId: string,
    bookId: string,
    id: string,
    dto: UpdateBookReviewDto,
    actor: AuthUser,
  ) {
    await this.ensureBookExists(clubId, bookId);
    const review = await this.ensureReviewInBook(id, bookId);
    this.ensureCanManage(review.userId, actor);

    const updated = await this.bookReviews.update(id, dto);
    return BookReviewResponseDto.fromPrisma(updated);
  }

  async remove(clubId: string, bookId: string, id: string, actor: AuthUser) {
    await this.ensureBookExists(clubId, bookId);
    const review = await this.ensureReviewInBook(id, bookId);
    this.ensureCanManage(review.userId, actor);

    await this.bookReviews.delete(id);
  }

  private async ensureCanRead(clubId: string, bookId: string, actor: AuthUser) {
    await this.ensureBookExists(clubId, bookId);
    if (actor.role === 'ADMIN') {
      return;
    }

    const membership = await this.bookReviews.findMembership(clubId, actor.id);
    if (!membership) {
      throw new ForbiddenException('Only club members can access reviews');
    }
  }

  private async ensureBookExists(clubId: string, bookId: string) {
    const book = await this.bookReviews.findBookInClub(clubId, bookId);
    if (!book) {
      throw new NotFoundException(`Book ${bookId} not found in this club`);
    }
    return book;
  }

  private async ensureReviewInBook(id: string, bookId: string) {
    const review = await this.bookReviews.findById(id);
    if (!review || review.bookId !== bookId) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    return review;
  }

  private ensureCanManage(reviewUserId: string, actor: AuthUser) {
    if (actor.role === 'ADMIN' || reviewUserId === actor.id) {
      return;
    }

    throw new ForbiddenException('Only review authors and admins can do this');
  }
}
