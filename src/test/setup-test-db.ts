import { execSync } from 'child_process';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';

export interface TestContext {
  module: TestingModule;
  prisma: PrismaService;
  container: StartedPostgreSqlContainer;
}

export async function setupTestDb(): Promise<TestContext> {
  const container = await new PostgreSqlContainer('postgres:18-alpine')
    .withDatabase('bookshelf_test')
    .withUsername('test')
    .withPassword('test')
    .start();

  const url = container.getConnectionUri();
  process.env.DATABASE_URL = url;

  execSync('npx prisma db push', {
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'pipe',
  });

  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const prisma = module.get<PrismaService>(PrismaService);
  return { module, prisma, container };
}

export async function teardownTestDb(ctx: TestContext): Promise<void> {
  await ctx.module.close();
  await ctx.container.stop();
}

export async function cleanDatabase(prisma: PrismaService): Promise<void> {
  await prisma.$transaction([
    prisma.bookReview.deleteMany(),
    prisma.readingProgress.deleteMany(),
    prisma.book.deleteMany(),
    prisma.catalogBook.deleteMany(),
    prisma.clubInvitation.deleteMany(),
    prisma.clubMember.deleteMany(),
    prisma.club.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}
