import { Injectable } from '@nestjs/common';
import { Prisma, User } from '../generated/prisma/client';
import type { CursorPaginationParams } from '../common/pipes/cursor-pagination.pipe';
import type { OffsetPaginationParams } from '../common/pipes/offset-pagination.pipe';
import type { UserRole } from '../common/pipes/user-role.pipe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(
    pagination: OffsetPaginationParams,
    role?: UserRole,
  ): Promise<User[]> {
    return this.prisma.user.findMany({
      where: this.buildRoleWhere(role),
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  findAllWithCursor(params: CursorPaginationParams): Promise<User[]> {
    return this.prisma.user.findMany({
      take: params.limit + 1,
      cursor: params.cursor ? { id: params.cursor } : undefined,
      skip: params.cursor ? 1 : 0,
      orderBy: { createdAt: 'desc' },
    });
  }

  count(role?: UserRole): Promise<number> {
    return this.prisma.user.count({ where: this.buildRoleWhere(role) });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  private buildRoleWhere(role?: UserRole): Prisma.UserWhereInput | undefined {
    return role ? { role } : undefined;
  }
}
