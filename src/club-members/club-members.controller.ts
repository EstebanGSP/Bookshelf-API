import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { ClubMembersService } from './club-members.service';
import { InviteClubMemberDto } from './dto/invite-club-member.dto';
import { UpdateClubMemberRoleDto } from './dto/update-club-member-role.dto';

@Controller('clubs/:clubId/members')
@ApiTags('Membres')
@ApiCookieAuth('bookshelf.session_token')
export class ClubMembersController {
  constructor(private readonly clubMembersService: ClubMembersService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les membres du club' })
  findAll(@UUIDParam('clubId') clubId: string) {
    return this.clubMembersService.findAll(clubId);
  }

  @Post('invitations')
  @ApiOperation({ summary: 'Inviter ou ajouter un membre (OWNER ou ADMIN)' })
  invite(
    @UUIDParam('clubId') clubId: string,
    @Body() dto: InviteClubMemberDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.clubMembersService.invite(clubId, dto, user);
  }

  @Patch(':memberId')
  @ApiOperation({
    summary: 'Modifier le role local d un membre (OWNER ou ADMIN)',
  })
  updateRole(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('memberId') memberId: string,
    @Body() dto: UpdateClubMemberRoleDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.clubMembersService.updateRole(clubId, memberId, dto, user);
  }

  @Delete(':memberId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Retirer un membre du club (OWNER ou ADMIN)' })
  remove(
    @UUIDParam('clubId') clubId: string,
    @UUIDParam('memberId') memberId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.clubMembersService.remove(clubId, memberId, user);
  }
}
