import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { USER_ROLES } from '../../common/pipes/user-role.pipe';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['firstName', 'lastName'] as const),
) {
  @IsOptional()
  @IsIn(USER_ROLES)
  role?: string;

  @IsOptional()
  @IsBoolean()
  banned?: boolean;
}
