import { Controller, Patch } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import { AdminService } from './admin.service';

@Controller('admin/users')
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch(':id/disable')
  disableUser(@UUIDParam('id') id: string) {
    return this.adminService.disableUser(id);
  }

  @Patch(':id/enable')
  enableUser(@UUIDParam('id') id: string) {
    return this.adminService.enableUser(id);
  }
}
