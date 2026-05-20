import { Injectable } from '@nestjs/common';
import { ClubRole, Prisma } from '../generated/prisma/client';
import type { OffsetPaginationParams } from '../common/pipes/offset-pagination.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateClubDto, ownerId: string) {
    return this.prisma.club.create({
      data: {
        name: dto.name,
        description: dto.description,
        isPublic: dto.isPublic ?? false,
        members: {
          create: {
            userId: ownerId,
            role: ClubRole.OWNER,
          },
        },
      },
      include: this.defaultInclude(),
    });
  }

  findPublic(pagination: OffsetPaginationParams) {
    return this.prisma.club.findMany({
      where: { isPublic: true },
      skip: pagination.skip,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
      include: this.defaultInclude(),
    });
  }

  countPublic() {
    return this.prisma.club.count({ where: { isPublic: true } });
  }

  findById(id: string) {
    return this.prisma.club.findUnique({
      where: { id },
      include: this.defaultInclude(),
    });
  }

  findMembership(clubId: string, userId: string) {
    return this.prisma.clubMember.findUnique({
      where: { userId_clubId: { userId, clubId } },
    });
  }

  update(id: string, dto: UpdateClubDto) {
    return this.prisma.club.update({
      where: { id },
      data: dto,
      include: this.defaultInclude(),
    });
  }

  delete(id: string) {
    return this.prisma.club.delete({ where: { id } });
  }

  private defaultInclude() {
    return {
      _count: { select: { members: true, books: true } },
    } satisfies Prisma.ClubInclude;
  }
}
