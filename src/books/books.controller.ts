import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
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
@ApiTags('Livres')
@ApiCookieAuth('bookshelf.session_token')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({
    summary: 'Ajouter un livre au club (OWNER, EDITOR ou ADMIN)',
  })
  create(
    @UUIDParam('clubId') clubId: string,
    @Body() dto: CreateBookDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.create(clubId, dto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les livres du club avec filtres et pagination',
  })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'author', required: false })
  @ApiQuery({ name: 'genre', required: false })
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
  @ApiOperation({ summary: 'Consulter un livre du club' })
  findOne(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.findOne(clubId, id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un livre (OWNER, EDITOR ou ADMIN)' })
  update(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('id') id: string,
    @Body() dto: UpdateBookDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.update(clubId, id, dto, user);
  }

  @DeleteRoute()
  @ApiOperation({ summary: 'Supprimer un livre (OWNER, EDITOR ou ADMIN)' })
  remove(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.booksService.remove(clubId, id, user);
  }
}
