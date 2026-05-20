import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClubRole, ReadingStatus } from '../generated/prisma/client';
import { ProgressRepository } from './progress.repository';
import { ReadingProgressResponseDto } from './dto/reading-progress-response.dto';
import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly progress: ProgressRepository) {}

  async updateMine(
    clubId: string,
    bookId: string,
    dto: UpdateReadingProgressDto,
    userId: string,
  ) {
    const { membership, book } = await this.ensureCanRead(
      clubId,
      bookId,
      userId,
    );
    const existing = await this.progress.findMine(userId, bookId);
    const totalPages = book.pageCount;
    if (!totalPages) {
      throw new BadRequestException(
        'Book pageCount is required before tracking progress',
      );
    }

    let currentPage = dto.currentPage ?? existing?.currentPage ?? 0;
    if (dto.status === ReadingStatus.COMPLETED) {
      currentPage = totalPages;
    }

    if (currentPage > totalPages) {
      throw new BadRequestException('currentPage cannot exceed totalPages');
    }

    const progressPercent = this.computePercent(currentPage, totalPages);

    const status = this.resolveStatus(
      dto.status as ReadingStatus | undefined,
      currentPage,
      progressPercent,
      existing?.status,
    );

    const saved = await this.progress.upsertMine({
      userId,
      clubMemberId: membership.id,
      bookId,
      status,
      currentPage,
      totalPages,
      progressPercent,
      startedAt:
        status !== ReadingStatus.NOT_STARTED
          ? (existing?.startedAt ?? new Date())
          : undefined,
      completedAt:
        status === ReadingStatus.COMPLETED || progressPercent === 100
          ? (existing?.completedAt ?? new Date())
          : null,
    });

    return ReadingProgressResponseDto.fromPrisma(saved);
  }

  async findForBook(clubId: string, bookId: string, userId: string) {
    const { membership } = await this.ensureCanRead(clubId, bookId, userId);
    if (
      !([ClubRole.OWNER, ClubRole.EDITOR] as ClubRole[]).includes(
        membership.role,
      )
    ) {
      throw new ForbiddenException(
        'Only club owners and editors can view global progress',
      );
    }

    const items = await this.progress.findForBook(bookId);
    return items.map((item) => ReadingProgressResponseDto.fromPrisma(item));
  }

  private async ensureCanRead(clubId: string, bookId: string, userId: string) {
    const book = await this.progress.findBookInClub(clubId, bookId);
    if (!book) {
      throw new NotFoundException(`Book ${bookId} not found in this club`);
    }

    const membership = await this.progress.findMembership(clubId, userId);
    if (!membership) {
      throw new ForbiddenException('Only club members can access progress');
    }

    return { membership, book };
  }

  private computePercent(currentPage: number, totalPages: number) {
    return Math.min(100, Math.round((currentPage / totalPages) * 100));
  }

  private resolveStatus(
    requested: ReadingStatus | undefined,
    currentPage: number,
    progressPercent: number,
    existing?: ReadingStatus,
  ) {
    if (requested === ReadingStatus.ABANDONED) {
      return ReadingStatus.ABANDONED;
    }
    if (requested === ReadingStatus.COMPLETED || progressPercent >= 100) {
      return ReadingStatus.COMPLETED;
    }
    if (requested === ReadingStatus.READING) {
      return ReadingStatus.READING;
    }
    if (currentPage > 0 || progressPercent > 0) {
      return ReadingStatus.READING;
    }
    if (requested === ReadingStatus.NOT_STARTED) {
      return ReadingStatus.NOT_STARTED;
    }
    return existing ?? ReadingStatus.NOT_STARTED;
  }
}
