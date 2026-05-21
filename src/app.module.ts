import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookReviewsModule } from './book-reviews/book-reviews.module';
import { BooksModule } from './books/books.module';
import { ClubMembersModule } from './club-members/club-members.module';
import { ClubsModule } from './clubs/clubs.module';
import { AuthenticatedRequestLoggerMiddleware } from './common/middleware/authenticated-request-logger.middleware';
import { ImportsModule } from './imports/imports.module';
import { FrontendController } from './frontend.controller';
import { auth } from './lib/auth';
import { PrismaModule } from './prisma/prisma.module';
import { ProgressModule } from './progress/progress.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ClubsModule,
    ClubMembersModule,
    BooksModule,
    ProgressModule,
    BookReviewsModule,
    AdminModule,
    ImportsModule,
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
    }),
  ],
  controllers: [AppController, FrontendController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticatedRequestLoggerMiddleware).forRoutes('*');
  }
}
