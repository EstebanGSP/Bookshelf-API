import { Injectable, NotFoundException } from '@nestjs/common';
import { ClubResponseDto } from '../clubs/dto/club-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllClubs() {
    const clubs = await this.prisma.club.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { members: true, books: true } },
      },
    });

    return {
      data: clubs.map((club) => ClubResponseDto.fromPrisma(club)),
      total: clubs.length,
      page: 1,
      limit: clubs.length,
      totalPages: 1,
    };
  }

  async disableUser(id: string) {
    const user = await this.ensureUser(id);
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { banned: true },
    });
    return UserResponseDto.fromPrisma(updated);
  }

  async enableUser(id: string) {
    const user = await this.ensureUser(id);
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { banned: false, banReason: null, banExpires: null },
    });
    return UserResponseDto.fromPrisma(updated);
  }

  private async ensureUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }
}
