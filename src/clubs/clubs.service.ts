import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClubRole } from '../generated/prisma/client';
import type { OffsetPaginationParams } from '../common/pipes/offset-pagination.pipe';
import { ClubsRepository } from './clubs.repository';
import { ClubResponseDto } from './dto/club-response.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
  constructor(private readonly clubs: ClubsRepository) {}

  async create(dto: CreateClubDto, ownerId: string) {
    const club = await this.clubs.create(dto, ownerId);
    return ClubResponseDto.fromPrisma(club);
  }

  async findPublic(pagination: OffsetPaginationParams) {
    const [data, total] = await Promise.all([
      this.clubs.findPublic(pagination),
      this.clubs.countPublic(),
    ]);

    return {
      data: data.map((club) => ClubResponseDto.fromPrisma(club)),
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit),
    };
  }

  async findOne(id: string) {
    const club = await this.clubs.findById(id);
    if (!club) {
      throw new NotFoundException(`Club ${id} not found`);
    }
    return ClubResponseDto.fromPrisma(club);
  }

  async update(id: string, dto: UpdateClubDto, userId: string) {
    await this.ensureOwner(id, userId);
    const club = await this.clubs.update(id, dto);
    return ClubResponseDto.fromPrisma(club);
  }

  async remove(id: string, userId: string) {
    await this.ensureOwner(id, userId);
    await this.clubs.delete(id);
  }

  private async ensureOwner(clubId: string, userId: string) {
    const club = await this.clubs.findById(clubId);
    if (!club) {
      throw new NotFoundException(`Club ${clubId} not found`);
    }

    const membership = await this.clubs.findMembership(clubId, userId);
    if (membership?.role !== ClubRole.OWNER) {
      throw new ForbiddenException('Only club owners can perform this action');
    }
  }
}
