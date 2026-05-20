import { Controller, Get, Patch } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@Roles('ADMIN')
@ApiTags('Administration')
@ApiCookieAuth('bookshelf.session_token')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('clubs')
  @ApiOperation({ summary: 'Lister tous les clubs, publics et prives (ADMIN)' })
  findAllClubs() {
    return this.adminService.findAllClubs();
  }

  @Patch('users/:id/disable')
  @ApiOperation({ summary: 'Desactiver un utilisateur (ADMIN)' })
  disableUser(@UUIDParam('id') id: string) {
    return this.adminService.disableUser(id);
  }

  @Patch('users/:id/enable')
  @ApiOperation({ summary: 'Reactiver un utilisateur (ADMIN)' })
  enableUser(@UUIDParam('id') id: string) {
    return this.adminService.enableUser(id);
  }
}
