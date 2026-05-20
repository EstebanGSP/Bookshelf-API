import { IsEnum } from 'class-validator';
import { ClubRole } from '../../common/enums/club-role.enum';

export class UpdateClubMemberRoleDto {
  @IsEnum(ClubRole)
  role: ClubRole;
}
