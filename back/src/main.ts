import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // replace with the origin of your client-side code
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }))
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
