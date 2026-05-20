import { Injectable, NotImplementedException } from '@nestjs/common';
import { ProgressRepository } from './progress.repository';
import { UpdateReadingProgressDto } from './dto/update-reading-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly progress: ProgressRepository) {}

  updateMine(_clubId: string, _bookId: string, _dto: UpdateReadingProgressDto) {
    throw new NotImplementedException(
      'Reading progress update is not implemented yet',
    );
  }

  findForBook(_clubId: string, _bookId: string) {
    throw new NotImplementedException(
      'Reading progress listing is not implemented yet',
    );
  }
}
