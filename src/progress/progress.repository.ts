import { Injectable } from '@nestjs/common';
import { Prisma, ReadingStatus } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressRepository {
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

  upsertMine(data: {
    userId: string;
    clubMemberId: string;
    bookId: string;
    status: ReadingStatus;
    currentPage: number;
    totalPages: number | null;
    progressPercent: number;
    startedAt?: Date;
    completedAt?: Date | null;
  }) {
    return this.prisma.readingProgress.upsert({
      where: {
        userId_bookId: {
          userId: data.userId,
          bookId: data.bookId,
        },
      },
      create: data,
      update: {
        status: data.status,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        progressPercent: data.progressPercent,
        startedAt: data.startedAt,
        completedAt: data.completedAt,
      },
      include: this.progressInclude(),
    });
  }

  findMine(userId: string, bookId: string) {
    return this.prisma.readingProgress.findUnique({
      where: { userId_bookId: { userId, bookId } },
    });
  }

  findForBook(bookId: string) {
    return this.prisma.readingProgress.findMany({
      where: { bookId },
      orderBy: [{ progressPercent: 'desc' }, { updatedAt: 'desc' }],
      include: this.progressInclude(),
    });
  }

  private progressInclude() {
    return {
      user: { select: { email: true, name: true } },
    } satisfies Prisma.ReadingProgressInclude;
  }
}
