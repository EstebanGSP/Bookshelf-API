import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClubRole } from '../generated/prisma/client';
import type { AuthUser } from '../common/types/auth-user';
import { ClubMembersRepository } from './club-members.repository';
import { ClubMemberResponseDto } from './dto/club-member-response.dto';
import { InviteClubMemberDto } from './dto/invite-club-member.dto';
import { UpdateClubMemberRoleDto } from './dto/update-club-member-role.dto';

@Injectable()
export class ClubMembersService {
  constructor(private readonly clubMembers: ClubMembersRepository) {}

  async findAll(clubId: string) {
    await this.ensureClubExists(clubId);
    const members = await this.clubMembers.findAll(clubId);
    return members.map((member) => ClubMemberResponseDto.fromPrisma(member));
  }

  async invite(clubId: string, dto: InviteClubMemberDto, actor: AuthUser) {
    await this.ensureOwner(clubId, actor);

    const invitedUser = await this.clubMembers.findUserByEmail(dto.email);
    const role = dto.role ?? ClubRole.READER;

    if (!invitedUser) {
      const invitation = await this.clubMembers.createInvitation(
        clubId,
        dto.email,
        role,
        actor.id,
      );
      return {
        status: 'PENDING_INVITATION',
        invitation,
      };
    }

    const existing = await this.clubMembers.findMembership(
      clubId,
      invitedUser.id,
    );
    if (existing) {
      throw new ConflictException('This user is already a club member');
    }

    const member = await this.clubMembers.addExistingUser(
      clubId,
      invitedUser.id,
      role,
    );
    await this.clubMembers.createInvitation(
      clubId,
      dto.email,
      role,
      actor.id,
      invitedUser.id,
      true,
    );

    return {
      status: 'ADDED_EXISTING_USER',
      member: ClubMemberResponseDto.fromPrisma(member),
    };
  }

  async updateRole(
    clubId: string,
    memberId: string,
    dto: UpdateClubMemberRoleDto,
    actor: AuthUser,
  ) {
    await this.ensureOwner(clubId, actor);
    const member = await this.ensureMemberInClub(clubId, memberId);

    if (member.role === ClubRole.OWNER && dto.role !== ClubRole.OWNER) {
      await this.ensureAnotherOwnerExists(clubId);
    }

    const updated = await this.clubMembers.updateRole(memberId, dto.role);
    return ClubMemberResponseDto.fromPrisma(updated);
  }

  async remove(clubId: string, memberId: string, actor: AuthUser) {
    await this.ensureOwner(clubId, actor);
    const member = await this.ensureMemberInClub(clubId, memberId);

    if (member.role === ClubRole.OWNER) {
      await this.ensureAnotherOwnerExists(clubId);
    }

    await this.clubMembers.delete(memberId);
  }

  private async ensureClubExists(clubId: string) {
    const club = await this.clubMembers.findClub(clubId);
    if (!club) {
      throw new NotFoundException(`Club ${clubId} not found`);
    }
    return club;
  }

  private async ensureOwner(clubId: string, actor: AuthUser) {
    await this.ensureClubExists(clubId);
    if (actor.role === 'ADMIN') {
      return;
    }

    const membership = await this.clubMembers.findMembership(clubId, actor.id);
    if (membership?.role !== ClubRole.OWNER) {
      throw new ForbiddenException('Only club owners can manage members');
    }
  }

  private async ensureMemberInClub(clubId: string, memberId: string) {
    const member = await this.clubMembers.findMembershipById(memberId);
    if (!member || member.clubId !== clubId) {
      throw new NotFoundException(`Club member ${memberId} not found`);
    }
    return member;
  }

  private async ensureAnotherOwnerExists(clubId: string) {
    const ownersCount = await this.clubMembers.countOwners(clubId);
    if (ownersCount <= 1) {
      throw new BadRequestException('A club must keep at least one owner');
    }
  }
}
