import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ClubRole } from '../../common/enums/club-role.enum';

export class UpdateClubMemberRoleDto {
  @ApiProperty({ enum: ClubRole, example: ClubRole.EDITOR })
  @IsEnum(ClubRole)
  role: ClubRole;
}
