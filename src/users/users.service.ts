import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { UserRole } from '../common/pipes/user-role.pipe';
import type { CursorPaginationParams } from '../common/pipes/cursor-pagination.pipe';
import type { OffsetPaginationParams } from '../common/pipes/offset-pagination.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly user: UserRepository) {}

  async create(dto: CreateUserDto) {
    const existing = await this.user.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }
    return this.user.create({
      ...dto,
      name: `${dto.firstName} ${dto.lastName}`,
    });
  }

  async findAll(pagination: OffsetPaginationParams, role?: UserRole) {
    const [data, total] = await Promise.all([
      this.user.findAll(pagination, role),
      this.user.count(role),
    ]);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findAllWithCursor(params: CursorPaginationParams) {
    const items = await this.user.findAllWithCursor(params);
    const hasNextPage = items.length > params.limit;
    const data = hasNextPage ? items.slice(0, params.limit) : items;
    const nextCursor = hasNextPage ? (data[data.length - 1]?.id ?? null) : null;

    return { data, nextCursor, hasNextPage };
  }

  findOne(id: string) {
    return this.user.findById(id);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.user.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.user.update(id, dto);
  }

  async remove(id: string) {
    const existing = await this.user.findById(id);
    if (!existing) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return this.user.delete(id);
  }
}
