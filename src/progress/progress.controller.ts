import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import { ProgressService } from './progress.service';
import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';

@Controller('clubs/:clubId/books/:bookId/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Patch('me')
  updateMine(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @Body() dto: UpdateReadingProgressDto,
  ) {
    return this.progressService.updateMine(clubId, bookId, dto);
  }

  @Get()
  findForBook(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
  ) {
    return this.progressService.findForBook(clubId, bookId);
  }
}
