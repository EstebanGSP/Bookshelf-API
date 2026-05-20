import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DeleteRoute } from '../common/decorators/delete-route.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import { OffsetPaginationPipe } from '../common/pipes/offset-pagination.pipe';
import type { OffsetPaginationParams } from '../common/pipes/offset-pagination.pipe';
import type { AuthUser } from '../common/types/auth-user';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Controller('clubs')
@ApiTags('Clubs')
@ApiCookieAuth('bookshelf.session_token')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  @ApiOperation({ summary: 'Creer un club et devenir OWNER' })
  create(@Body() dto: CreateClubDto, @CurrentUser() user: AuthUser) {
    return this.clubsService.create(dto, user.id);
  }

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Lister les clubs publics avec pagination' })
  findPublic(@Query(OffsetPaginationPipe) pagination: OffsetPaginationParams) {
    return this.clubsService.findPublic(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un club' })
  findOne(@UUIDParam('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un club (OWNER ou ADMIN)' })
  update(
    @UUIDParam('id') id: string,
    @Body() dto: UpdateClubDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.clubsService.update(id, dto, user);
  }

  @DeleteRoute()
  @ApiOperation({ summary: 'Supprimer un club (OWNER ou ADMIN)' })
  remove(@UUIDParam('id') id: string, @CurrentUser() user: AuthUser) {
    return this.clubsService.remove(id, user);
  }
}
