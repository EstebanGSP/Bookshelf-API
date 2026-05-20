import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
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

  @Post('clubs/:clubId/imports/members')
  importClubMembers(
    @UUIDParam('clubId') clubId: string,
    @Body() dto: ImportCsvDto,
  ) {
    return this.importsService.importClubMembers(clubId, dto);
  }
}
