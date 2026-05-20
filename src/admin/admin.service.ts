import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AdminService {
  disableUser(_id: string) {
    throw new NotImplementedException('User disabling is not implemented yet');
  }

  enableUser(_id: string) {
    throw new NotImplementedException('User enabling is not implemented yet');
  }
}
