import { Injectable, NotImplementedException } from '@nestjs/common';
import { BookReviewsRepository } from './book-reviews.repository';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';

@Injectable()
export class BookReviewsService {
  constructor(private readonly bookReviews: BookReviewsRepository) {}

  create(_clubId: string, _bookId: string, _dto: CreateBookReviewDto) {
    throw new NotImplementedException(
      'Book review creation is not implemented yet',
    );
  }

  update(
    _clubId: string,
    _bookId: string,
    _id: string,
    _dto: UpdateBookReviewDto,
  ) {
    throw new NotImplementedException(
      'Book review update is not implemented yet',
    );
  }

  remove(_clubId: string, _bookId: string, _id: string) {
    throw new NotImplementedException(
      'Book review deletion is not implemented yet',
    );
  }
}
