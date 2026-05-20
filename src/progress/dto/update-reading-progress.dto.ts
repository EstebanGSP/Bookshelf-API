import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ReadingStatus } from '../../common/enums/reading-status.enum';

export class UpdateReadingProgressDto {
  @ApiPropertyOptional({ enum: ReadingStatus, example: ReadingStatus.READING })
  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  @ApiPropertyOptional({ example: 42, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  currentPage?: number;
}
