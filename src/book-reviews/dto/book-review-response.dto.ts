export class BookReviewResponseDto {
  id!: string;
  userId!: string;
  bookId!: string;
  rating!: number;
  comment!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
