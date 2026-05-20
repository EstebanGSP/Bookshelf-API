export interface ImportRowErrorDto {
  row: number;
  message: string;
}

export class ImportReportDto {
  imported!: number;
  errors!: ImportRowErrorDto[];
}
