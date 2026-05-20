import { ReadingStatus } from '../../common/enums/reading-status.enum';

export class ReadingProgressResponseDto {
  id!: string;
  userId!: string;
  bookId!: string;
  status!: ReadingStatus;
  currentPage!: number;
  totalPages!: number | null;
  progressPercent!: number;
  updatedAt!: Date;
}
