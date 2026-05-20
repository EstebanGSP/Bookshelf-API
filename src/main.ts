import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // The library will re-add the default body parsers for non-auth routes.
    bodyParser: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('BookShelf API')
    .setDescription(
      'API de lecture collaborative: clubs, livres, progressions, avis, administration et imports CSV.',
    )
    .setVersion('1.0')
    .addCookieAuth('bookshelf.session_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'bookshelf.session_token',
      description:
        'Cookie de session Better Auth obtenu via /auth/sign-in/email.',
    })
    .addTag('Clubs')
    .addTag('Membres')
    .addTag('Livres')
    .addTag('Progression')
    .addTag('Avis')
    .addTag('Administration')
    .addTag('Imports / Exports')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
