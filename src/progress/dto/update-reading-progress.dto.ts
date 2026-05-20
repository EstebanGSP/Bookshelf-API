import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ReadingStatus } from '../../common/enums/reading-status.enum';

export class UpdateReadingProgressDto {
  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentPage?: number;
}
