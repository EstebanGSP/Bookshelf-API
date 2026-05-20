import { ReadingStatus } from '../../common/enums/reading-status.enum';
import { ReadingProgress, User } from '../../generated/prisma/client';

export class ReadingProgressResponseDto {
  id!: string;
  userId!: string;
  bookId!: string;
  status!: ReadingStatus;
  currentPage!: number;
  totalPages!: number | null;
  progressPercent!: number;
  updatedAt!: Date;
  user?: {
    email: string;
    name: string;
  };

  static fromPrisma(
    progress: ReadingProgress & { user?: Pick<User, 'email' | 'name'> },
  ) {
    const dto = new ReadingProgressResponseDto();
    dto.id = progress.id;
    dto.userId = progress.userId;
    dto.bookId = progress.bookId;
    dto.status = progress.status as ReadingStatus;
    dto.currentPage = progress.currentPage;
    dto.totalPages = progress.totalPages;
    dto.progressPercent = progress.progressPercent;
    dto.updatedAt = progress.updatedAt;
    if (progress.user) {
      dto.user = {
        email: progress.user.email,
        name: progress.user.name,
      };
    }
    return dto;
  }
}
