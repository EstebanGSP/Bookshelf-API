import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ReadingStatus } from '../../common/enums/reading-status.enum';

export class UpdateReadingProgressDto {
  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentPage?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalPages?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercent?: number;
}
