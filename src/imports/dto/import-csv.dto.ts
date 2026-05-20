import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImportCsvDto {
  @ApiProperty({
    example:
      'isbn,title,author,genre,pageCount,description,publishedAt\n9782070612758,Le Petit Prince,Antoine de Saint-Exupery,Conte,120,Un classique,1943-04-06',
  })
  @IsString()
  @IsNotEmpty()
  csv: string;
}
