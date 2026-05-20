import { Club } from '../../generated/prisma/client';

export class ClubResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  isPublic!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  memberCount!: number;

  static fromPrisma(club: Club & { _count?: { members: number } }) {
    const dto = new ClubResponseDto();
    dto.id = club.id;
    dto.name = club.name;
    dto.description = club.description;
    dto.isPublic = club.isPublic;
    dto.createdAt = club.createdAt;
    dto.updatedAt = club.updatedAt;
    dto.memberCount = club._count?.members ?? 0;
    return dto;
  }
}
