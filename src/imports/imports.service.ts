import { Injectable, NotImplementedException } from '@nestjs/common';
import { ImportCsvDto } from './dto/import-csv.dto';

@Injectable()
export class ImportsService {
  importCatalogBooks(_dto: ImportCsvDto) {
    throw new NotImplementedException(
      'Catalog book CSV import is not implemented yet',
    );
  }

  importClubMembers(_clubId: string, _dto: ImportCsvDto) {
    throw new NotImplementedException(
      'Club member CSV import is not implemented yet',
    );
  }
}
