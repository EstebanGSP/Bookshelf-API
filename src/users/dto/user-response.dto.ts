import { User } from '../../generated/prisma/client';

export class UserResponseDto {
  id!: string;
  email!: string;
  firstName!: string | null;
  lastName!: string | null;
  name!: string;
  role!: string;
  banned!: boolean;
  createdAt!: Date;

  static fromPrisma(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.name = user.name;
    dto.role = user.role;
    dto.banned = user.banned;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
