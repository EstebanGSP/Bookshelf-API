import { Controller, Get, Patch } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('clubs')
  findAllClubs() {
    return this.adminService.findAllClubs();
  }

  @Patch('users/:id/disable')
  disableUser(@UUIDParam('id') id: string) {
    return this.adminService.disableUser(id);
  }

  @Patch('users/:id/enable')
  enableUser(@UUIDParam('id') id: string) {
    return this.adminService.enableUser(id);
  }
}
