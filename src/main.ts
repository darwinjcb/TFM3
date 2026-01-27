import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // ignora campos extra
      forbidNonWhitelisted: true, // lanza error si mandan campos no permitidos
      transform: true,       // transforma tipos (string -> number, etc.)
    }),
  );

  await app.listen(3000);
}
bootstrap();
