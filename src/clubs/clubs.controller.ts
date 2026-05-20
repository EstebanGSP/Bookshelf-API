import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
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
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  create(@Body() dto: CreateClubDto, @CurrentUser() user: AuthUser) {
    return this.clubsService.create(dto, user.id);
  }

  @Get()
  @AllowAnonymous()
  findPublic(@Query(OffsetPaginationPipe) pagination: OffsetPaginationParams) {
    return this.clubsService.findPublic(pagination);
  }

  @Get(':id')
  findOne(@UUIDParam('id') id: string) {
    return this.clubsService.findOne(id);
  }

  @Patch(':id')
  update(
    @UUIDParam('id') id: string,
    @Body() dto: UpdateClubDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.clubsService.update(id, dto, user.id);
  }

  @DeleteRoute()
  remove(@UUIDParam('id') id: string, @CurrentUser() user: AuthUser) {
    return this.clubsService.remove(id, user.id);
  }
}
