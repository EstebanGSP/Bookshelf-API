import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ClubRole } from '../../common/enums/club-role.enum';

export class InviteClubMemberDto {
  @ApiProperty({ example: 'reader@test.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ enum: ClubRole, example: ClubRole.READER })
  @IsOptional()
  @IsEnum(ClubRole)
  role?: ClubRole = ClubRole.READER;
}
