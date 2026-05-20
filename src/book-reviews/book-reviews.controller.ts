import { Body, Controller, Patch, Post } from '@nestjs/common';
import { DeleteRoute } from '../common/decorators/delete-route.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import { BookReviewsService } from './book-reviews.service';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';

@Controller('clubs/:clubId/books/:bookId/reviews')
export class BookReviewsController {
  constructor(private readonly bookReviewsService: BookReviewsService) {}

  @Post()
  create(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @Body() dto: CreateBookReviewDto,
  ) {
    return this.bookReviewsService.create(clubId, bookId, dto);
  }

  @Patch(':id')
  update(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @UUIDParam('id') id: string,
    @Body() dto: UpdateBookReviewDto,
  ) {
    return this.bookReviewsService.update(clubId, bookId, id, dto);
  }

  @DeleteRoute()
  remove(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @UUIDParam('id') id: string,
  ) {
    return this.bookReviewsService.remove(clubId, bookId, id);
  }
}
