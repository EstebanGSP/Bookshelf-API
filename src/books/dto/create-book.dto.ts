import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Le Petit Prince' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Antoine de Saint-Exupery' })
  @IsString()
  @MinLength(1)
  @MaxLength(180)
  author: string;

  @ApiPropertyOptional({ example: '9782070612758' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  isbn?: string;

  @ApiPropertyOptional({ example: 'Conte' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  genre?: string;

  @ApiProperty({ example: 120, minimum: 1 })
  @IsInt()
  @Min(1)
  pageCount: number;

  @ApiPropertyOptional({ example: 'Un classique a lire ensemble.' })
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  description?: string;
}
