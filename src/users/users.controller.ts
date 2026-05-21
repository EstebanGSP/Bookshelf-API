import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteRoute } from '../common/decorators/delete-route.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UUIDParam } from '../common/decorators/uuid-param.decorator';
import { CursorPaginationPipe } from '../common/pipes/cursor-pagination.pipe';
import type { CursorPaginationParams } from '../common/pipes/cursor-pagination.pipe';
import { OffsetPaginationPipe } from '../common/pipes/offset-pagination.pipe';
import type { OffsetPaginationParams } from '../common/pipes/offset-pagination.pipe';
import { UserRolePipe } from '../common/pipes/user-role.pipe';
import type { UserRole } from '../common/pipes/user-role.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Administration')
@ApiCookieAuth('bookshelf.session_token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Creer un utilisateur (ADMIN)' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return UserResponseDto.fromPrisma(user);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Lister les utilisateurs (ADMIN)' })
  @ApiQuery({ name: 'role', required: false, enum: ['USER', 'ADMIN'] })
  async findAll(
    @Query(OffsetPaginationPipe) pagination: OffsetPaginationParams,
    @Query('role', UserRolePipe) role?: UserRole,
  ) {
    const { data, total, page, limit, totalPages } =
      await this.usersService.findAll(pagination, role);
    return {
      data: data.map((user) => UserResponseDto.fromPrisma(user)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  @Get('cursor')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Lister les utilisateurs avec pagination cursor (ADMIN)',
  })
  async findAllWithCursor(
    @Query(CursorPaginationPipe) params: CursorPaginationParams,
  ) {
    const { data, nextCursor, hasNextPage } =
      await this.usersService.findAllWithCursor(params);
    return {
      data: data.map((user) => UserResponseDto.fromPrisma(user)),
      nextCursor,
      hasNextPage,
    };
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Consulter un utilisateur (ADMIN)' })
  async findOne(@UUIDParam('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return UserResponseDto.fromPrisma(user);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Modifier un utilisateur (ADMIN)' })
  async update(@UUIDParam('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    return UserResponseDto.fromPrisma(user);
  }

  @DeleteRoute()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Supprimer un utilisateur (ADMIN)' })
  async remove(@UUIDParam('id') id: string) {
    return this.usersService.remove(id);
  }
}
