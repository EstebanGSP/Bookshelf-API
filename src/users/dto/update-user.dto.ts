import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { USER_ROLES } from '../../common/pipes/user-role.pipe';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['firstName', 'lastName'] as const),
) {
  @ApiPropertyOptional({ enum: USER_ROLES, example: 'ADMIN' })
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  banned?: boolean;
}
