import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DeleteRoute } from '../common/decorators/delete-route.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import { OffsetPaginationPipe } from '../common/pipes/offset-pagination.pipe';
import type { OffsetPaginationParams } from '../common/pipes/offset-pagination.pipe';
import type { AuthUser } from '../common/types/auth-user';
import { BooksService } from './books.service';
import { BookFiltersDto } from './dto/book-filters.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('clubs/:clubId/books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(
    @UUIDParam('clubId') clubId: string,
    @Body() dto: CreateBookDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.create(clubId, dto, user);
  }

  @Get()
  findAll(
    @UUIDParam('clubId') clubId: string,
    @Query(OffsetPaginationPipe) pagination: OffsetPaginationParams,
    @Query('title') title: string | undefined,
    @Query('author') author: string | undefined,
    @Query('genre') genre: string | undefined,
    @CurrentUser() user: AuthUser,
  ) {
    const filters: BookFiltersDto = { title, author, genre };
    return this.booksService.findAll(clubId, pagination, filters, user);
  }

  @Get(':id')
  findOne(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.findOne(clubId, id, user);
  }

  @Patch(':id')
  update(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('id') id: string,
    @Body() dto: UpdateBookDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.update(clubId, id, dto, user);
  }

  @DeleteRoute()
  remove(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.remove(clubId, id, user);
  }
}
