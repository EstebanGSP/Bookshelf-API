import { ClubRole } from '../../common/enums/club-role.enum';
import { ClubMember, User } from '../../generated/prisma/client';

export class ClubMemberResponseDto {
  id!: string;
  userId!: string;
  clubId!: string;
  role!: ClubRole;
  joinedAt!: Date;
  user!: {
    email: string;
    name: string;
  };

  static fromPrisma(
    member: ClubMember & { user: Pick<User, 'email' | 'name'> },
  ) {
    const dto = new ClubMemberResponseDto();
    dto.id = member.id;
    dto.userId = member.userId;
    dto.clubId = member.clubId;
    dto.role = member.role as ClubRole;
    dto.joinedAt = member.joinedAt;
    dto.user = {
      email: member.user.email,
      name: member.user.name,
    };
    return dto;
  }
}
