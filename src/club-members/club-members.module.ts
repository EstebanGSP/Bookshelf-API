import { Module } from '@nestjs/common';
import { ClubMembersController } from './club-members.controller';
import { ClubMembersRepository } from './club-members.repository';
import { ClubMembersService } from './club-members.service';

@Module({
  controllers: [ClubMembersController],
  providers: [ClubMembersService, ClubMembersRepository],
  exports: [ClubMembersService, ClubMembersRepository],
})
export class ClubMembersModule {}
