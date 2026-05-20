import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ClubRole } from '../../common/enums/club-role.enum';

export class InviteClubMemberDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(ClubRole)
  role?: ClubRole = ClubRole.READER;
}
