import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { ClubMembersService } from './club-members.service';
import { InviteClubMemberDto } from './dto/invite-club-member.dto';
import { UpdateClubMemberRoleDto } from './dto/update-club-member-role.dto';

@Controller('clubs/:clubId/members')
export class ClubMembersController {
  constructor(private readonly clubMembersService: ClubMembersService) {}

  @Get()
  findAll(@UUIDParam('clubId') clubId: string) {
    return this.clubMembersService.findAll(clubId);
  }

  @Post('invitations')
  invite(
    @UUIDParam('clubId') clubId: string,
    @Body() dto: InviteClubMemberDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.clubMembersService.invite(clubId, dto, user.id);
  }

  @Patch(':memberId')
  updateRole(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('memberId') memberId: string,
    @Body() dto: UpdateClubMemberRoleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.clubMembersService.updateRole(clubId, memberId, dto, user.id);
  }

  @Delete(':memberId')
  @HttpCode(204)
  remove(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('memberId') memberId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.clubMembersService.remove(clubId, memberId, user.id);
  }
}
