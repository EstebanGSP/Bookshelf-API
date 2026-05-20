import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { ProgressService } from './progress.service';
import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';

@Controller('clubs/:clubId/books/:bookId/progress')
@ApiTags('Progression')
@ApiCookieAuth('bookshelf.session_token')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Patch('me')
  @ApiOperation({ summary: 'Mettre a jour ma progression sur un livre' })
  updateMine(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @Body() dto: UpdateReadingProgressDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.progressService.updateMine(clubId, bookId, dto, user.id);
  }

  @Get()
  @ApiOperation({
    summary:
      'Consulter la progression globale du livre (OWNER, EDITOR ou ADMIN)',
  })
  findForBook(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('bookId') bookId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.progressService.findForBook(clubId, bookId, user);
  }
}
