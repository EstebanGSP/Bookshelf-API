import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DeleteRoute } from '../common/decorators/delete-route.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { BookReviewsService } from './book-reviews.service';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';

@Controller('clubs/:clubId/books/:bookId/reviews')
@ApiTags('Avis')
@ApiCookieAuth('bookshelf.session_token')
export class BookReviewsController {
  constructor(private readonly bookReviewsService: BookReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les avis d un livre' })
  findAll(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookReviewsService.findAll(clubId, bookId, user);
  }

  @Post()
  @ApiOperation({ summary: 'Creer mon avis sur un livre' })
  create(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @Body() dto: CreateBookReviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookReviewsService.create(clubId, bookId, dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un avis (auteur ou ADMIN)' })
  update(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @UUIDParam('id') id: string,
    @Body() dto: UpdateBookReviewDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookReviewsService.update(clubId, bookId, id, dto, user);
  }

  @DeleteRoute()
  @ApiOperation({ summary: 'Supprimer un avis (auteur ou ADMIN)' })
  remove(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @UUIDParam('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookReviewsService.remove(clubId, bookId, id, user);
  }
}
