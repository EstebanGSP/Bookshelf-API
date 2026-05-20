import { Module } from '@nestjs/common';
import { BookReviewsController } from './book-reviews.controller';
import { BookReviewsRepository } from './book-reviews.repository';
import { BookReviewsService } from './book-reviews.service';

@Module({
  controllers: [BookReviewsController],
  providers: [BookReviewsService, BookReviewsRepository],
  exports: [BookReviewsService, BookReviewsRepository],
})
export class BookReviewsModule {}
