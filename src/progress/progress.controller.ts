import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import type { AuthUser } from '../common/types/auth-user';
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
    @CurrentUser() user: AuthUser,
  ) {
    return this.progressService.updateMine(clubId, bookId, dto, user.id);
  }

  @Get()
  findForBook(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.progressService.findForBook(clubId, bookId, user);
  }
}
