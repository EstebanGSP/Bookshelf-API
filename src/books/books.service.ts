import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClubRole } from '../generated/prisma/client';
import type { OffsetPaginationParams } from '../common/pipes/offset-pagination.pipe';
import { BooksRepository } from './books.repository';
import { BookFiltersDto } from './dto/book-filters.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly books: BooksRepository) {}

  async create(clubId: string, dto: CreateBookDto, userId: string) {
    await this.ensureCanWrite(clubId, userId);
    const book = await this.books.create(clubId, dto, userId);
    return BookResponseDto.fromPrisma(book);
  }

  async findAll(
    clubId: string,
    pagination: OffsetPaginationParams,
    filters: BookFiltersDto,
    userId: string,
  ) {
    await this.ensureCanRead(clubId, userId);
    const [data, total] = await Promise.all([
      this.books.findAll(clubId, pagination, filters),
      this.books.count(clubId, filters),
    ]);
    const ratings = await this.books.averageRatings(
      data.map((book) => book.id),
    );
    const ratingByBook = new Map<string, number | null>();
    ratings.forEach((rating) => {
      ratingByBook.set(rating.bookId, rating._avg.rating);
    });

    return {
      data: data.map((book) =>
        BookResponseDto.fromPrisma(book, ratingByBook.get(book.id) ?? null),
      ),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findOne(clubId: string, id: string, userId: string) {
    await this.ensureCanRead(clubId, userId);
    const book = await this.books.findById(clubId, id);
    if (!book) {
      throw new NotFoundException(`Book ${id} not found`);
    }
    const rating = await this.books.averageRating(id);
    return BookResponseDto.fromPrisma(book, rating._avg.rating);
  }

  async update(clubId: string, id: string, dto: UpdateBookDto, userId: string) {
    await this.ensureCanWrite(clubId, userId);
    await this.ensureBookExists(clubId, id);
    const book = await this.books.update(clubId, id, dto);
    const rating = await this.books.averageRating(id);
    return BookResponseDto.fromPrisma(book, rating._avg.rating);
  }

  async remove(clubId: string, id: string, userId: string) {
    await this.ensureCanWrite(clubId, userId);
    await this.ensureBookExists(clubId, id);
    await this.books.delete(clubId, id);
  }

  private async ensureBookExists(clubId: string, id: string) {
    const book = await this.books.findById(clubId, id);
    if (!book) {
      throw new NotFoundException(`Book ${id} not found`);
    }
    return book;
  }

  private async ensureCanRead(clubId: string, userId: string) {
    const club = await this.books.findClub(clubId);
    if (!club) {
      throw new NotFoundException(`Club ${clubId} not found`);
    }

    const membership = await this.books.findMembership(clubId, userId);
    if (!membership) {
      throw new ForbiddenException('Only club members can access books');
    }

    return membership;
  }

  private async ensureCanWrite(clubId: string, userId: string) {
    const membership = await this.ensureCanRead(clubId, userId);
    if (
      !([ClubRole.OWNER, ClubRole.EDITOR] as ClubRole[]).includes(
        membership.role,
      )
    ) {
      throw new ForbiddenException(
        'Only club owners and editors can manage books',
      );
    }
  }
}
