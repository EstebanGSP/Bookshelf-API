import { Injectable } from '@nestjs/common';
import { ClubRole, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClubMembersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findClub(clubId: string) {
    return this.prisma.club.findUnique({ where: { id: clubId } });
  }

  findAll(clubId: string) {
    return this.prisma.clubMember.findMany({
      where: { clubId },
      orderBy: [{ role: 'asc' }, { joinedAt: 'asc' }],
      include: this.memberInclude(),
    });
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findMembership(clubId: string, userId: string) {
    return this.prisma.clubMember.findUnique({
      where: { userId_clubId: { userId, clubId } },
      include: this.memberInclude(),
    });
  }

  findMembershipById(memberId: string) {
    return this.prisma.clubMember.findUnique({
      where: { id: memberId },
      include: this.memberInclude(),
    });
  }

  countOwners(clubId: string) {
    return this.prisma.clubMember.count({
      where: { clubId, role: ClubRole.OWNER },
    });
  }

  addExistingUser(clubId: string, userId: string, role: ClubRole) {
    return this.prisma.clubMember.create({
      data: { clubId, userId, role },
      include: this.memberInclude(),
    });
  }

  createInvitation(
    clubId: string,
    email: string,
    role: ClubRole,
    invitedById: string,
    invitedUserId?: string,
    accepted = false,
  ) {
    return this.prisma.clubInvitation.create({
      data: {
        clubId,
        email,
        role,
        invitedById,
        invitedUserId,
        accepted,
      },
    });
  }

  updateRole(memberId: string, role: ClubRole) {
    return this.prisma.clubMember.update({
      where: { id: memberId },
      data: { role },
      include: this.memberInclude(),
    });
  }

  delete(memberId: string) {
    return this.prisma.clubMember.delete({ where: { id: memberId } });
  }

  private memberInclude() {
    return {
      user: { select: { email: true, name: true } },
    } satisfies Prisma.ClubMemberInclude;
  }
}
