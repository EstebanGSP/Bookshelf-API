import { Injectable } from '@nestjs/common';
import { ClubRole, Prisma } from '../generated/prisma/client';
import type { OffsetPaginationParams } from '../common/pipes/offset-pagination.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { BookFiltersDto } from './dto/book-filters.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findClub(clubId: string) {
    return this.prisma.club.findUnique({ where: { id: clubId } });
  }

  findMembership(clubId: string, userId: string) {
    return this.prisma.clubMember.findUnique({
      where: { userId_clubId: { userId, clubId } },
    });
  }

  create(clubId: string, dto: CreateBookDto, createdById: string) {
    return this.prisma.book.create({
      data: {
        clubId,
        createdById,
        title: dto.title,
        author: dto.author,
        isbn: this.optionalString(dto.isbn),
        genre: this.optionalString(dto.genre),
        pageCount: dto.pageCount ?? null,
        description: this.optionalString(dto.description),
      },
    });
  }

  findAll(
    clubId: string,
    pagination: OffsetPaginationParams,
    filters: BookFiltersDto,
  ) {
    return this.prisma.book.findMany({
      where: this.buildWhere(clubId, filters),
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  count(clubId: string, filters: BookFiltersDto) {
    return this.prisma.book.count({
      where: this.buildWhere(clubId, filters),
    });
  }

  findById(clubId: string, id: string) {
    return this.prisma.book.findFirst({
      where: { id, clubId },
    });
  }

  update(clubId: string, id: string, dto: UpdateBookDto) {
    return this.prisma.book.update({
      where: { id, clubId },
      data: {
        title: dto.title,
        author: dto.author,
        isbn:
          dto.isbn === undefined ? undefined : this.optionalString(dto.isbn),
        genre:
          dto.genre === undefined ? undefined : this.optionalString(dto.genre),
        pageCount: dto.pageCount,
        description:
          dto.description === undefined
            ? undefined
            : this.optionalString(dto.description),
      },
    });
  }

  delete(clubId: string, id: string) {
    return this.prisma.book.delete({
      where: { id, clubId },
    });
  }

  averageRating(bookId: string) {
    return this.prisma.bookReview.aggregate({
      where: { bookId },
      _avg: { rating: true },
    });
  }

  async averageRatings(
    bookIds: string[],
  ): Promise<Array<{ bookId: string; _avg: { rating: number | null } }>> {
    if (bookIds.length === 0) {
      return [];
    }
    const reviews = await this.prisma.bookReview.findMany({
      where: { bookId: { in: bookIds } },
      select: { bookId: true, rating: true },
    });

    const buckets = new Map<string, { total: number; count: number }>();
    reviews.forEach((review) => {
      const bucket = buckets.get(review.bookId) ?? { total: 0, count: 0 };
      bucket.total += review.rating;
      bucket.count += 1;
      buckets.set(review.bookId, bucket);
    });

    return Array.from(buckets.entries()).map(([bookId, bucket]) => ({
      bookId,
      _avg: { rating: bucket.count ? bucket.total / bucket.count : null },
    }));
  }

  private buildWhere(
    clubId: string,
    filters: BookFiltersDto,
  ): Prisma.BookWhereInput {
    return {
      clubId,
      title: filters.title
        ? { contains: filters.title, mode: 'insensitive' }
        : undefined,
      author: filters.author
        ? { contains: filters.author, mode: 'insensitive' }
        : undefined,
      genre: filters.genre
        ? { contains: filters.genre, mode: 'insensitive' }
        : undefined,
    };
  }

  private optionalString(value?: string) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }
}
