import { BookReview } from '../../generated/prisma/client';

export class BookReviewResponseDto {
  id!: string;
  userId!: string;
  bookId!: string;
  rating!: number;
  comment!: string | null;
  user!: { email: string; name: string };
  createdAt!: Date;
  updatedAt!: Date;

  static fromPrisma(
    review: BookReview & { user?: { email: string; name: string } },
  ) {
    const dto = new BookReviewResponseDto();
    dto.id = review.id;
    dto.userId = review.userId;
    dto.bookId = review.bookId;
    dto.rating = review.rating;
    dto.comment = review.comment;
    dto.user = review.user ?? { email: '', name: '' };
    dto.createdAt = review.createdAt;
    dto.updatedAt = review.updatedAt;
    return dto;
  }
}
