import { Book } from '../../generated/prisma/client';

export class BookResponseDto {
  id!: string;
  clubId!: string;
  title!: string;
  author!: string;
  isbn!: string | null;
  genre!: string | null;
  pageCount!: number | null;
  description!: string | null;
  averageRating!: number | null;
  createdAt!: Date;
  updatedAt!: Date;

  static fromPrisma(book: Book, averageRating: number | null = null) {
    const dto = new BookResponseDto();
    dto.id = book.id;
    dto.clubId = book.clubId;
    dto.title = book.title;
    dto.author = book.author;
    dto.isbn = book.isbn;
    dto.genre = book.genre;
    dto.pageCount = book.pageCount;
    dto.description = book.description;
    dto.averageRating = averageRating;
    dto.createdAt = book.createdAt;
    dto.updatedAt = book.updatedAt;
    return dto;
  }
}
