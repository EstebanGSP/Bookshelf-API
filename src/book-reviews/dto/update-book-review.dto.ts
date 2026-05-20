import { PartialType } from '@nestjs/swagger';
import { CreateBookReviewDto } from './create-book-review.dto';

export class UpdateBookReviewDto extends PartialType(CreateBookReviewDto) {}
