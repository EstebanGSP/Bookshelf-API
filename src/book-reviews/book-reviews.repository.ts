import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';

@Injectable()
export class BookReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBookInClub(clubId: string, bookId: string) {
    return this.prisma.book.findFirst({
      where: { id: bookId, clubId },
    });
  }

  findMembership(clubId: string, userId: string) {
    return this.prisma.clubMember.findUnique({
      where: { userId_clubId: { userId, clubId } },
    });
  }

  findAllForBook(bookId: string) {
    return this.prisma.bookReview.findMany({
      where: { bookId },
      orderBy: { createdAt: 'desc' },
      include: this.reviewInclude(),
    });
  }

  findById(id: string) {
    return this.prisma.bookReview.findUnique({
      where: { id },
      include: this.reviewInclude(),
    });
  }

  findMine(userId: string, bookId: string) {
    return this.prisma.bookReview.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
  }

  create(userId: string, bookId: string, dto: CreateBookReviewDto) {
    return this.prisma.bookReview.create({
      data: {
        userId,
        bookId,
        rating: dto.rating,
        comment: this.optionalString(dto.comment),
      },
      include: this.reviewInclude(),
    });
  }

  update(id: string, dto: UpdateBookReviewDto) {
    return this.prisma.bookReview.update({
      where: { id },
      data: {
        rating: dto.rating,
        comment:
          dto.comment === undefined
            ? undefined
            : this.optionalString(dto.comment),
      },
      include: this.reviewInclude(),
    });
  }

  delete(id: string) {
    return this.prisma.bookReview.delete({ where: { id } });
  }

  private reviewInclude() {
    return {
      user: { select: { email: true, name: true } },
    } satisfies Prisma.BookReviewInclude;
  }

  private optionalString(value?: string) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
  }
}
