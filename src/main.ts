import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // replace with the origin of your client-side code
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }))
  await app.listen(3000);
}
bootstrap();
