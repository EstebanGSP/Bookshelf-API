import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { ImportCsvDto } from './dto/import-csv.dto';
import { ImportsService } from './imports.service';

@Controller()
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Post('admin/imports/catalog-books')
  @Roles('ADMIN')
  importCatalogBooks(@Body() dto: ImportCsvDto) {
    return this.importsService.importCatalogBooks(dto);
  }

  @Get('admin/exports/catalog-books')
  @Roles('ADMIN')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="catalog-books.csv"')
  exportCatalogBooks() {
    return this.importsService.exportCatalogBooks();
  }

  @Post('clubs/:clubId/imports/members')
  importClubMembers(
    @UUIDParam('clubId') clubId: string,
    @Body() dto: ImportCsvDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.importsService.importClubMembers(clubId, dto, user);
  }

  @Get('clubs/:clubId/exports/books')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="club-books.csv"')
  exportClubBooks(
    @UUIDParam('clubId') clubId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.importsService.exportClubBooks(clubId, user);
  }
}
