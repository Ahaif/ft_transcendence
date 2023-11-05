import { ConfigService } from '@nestjs/config';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AuthGuard } from '@nestjs/passport';
export class SocketAdapter extends IoAdapter {
    createIOServer(port: number, options?: any): any {
        const server = super.createIOServer(port, {
            ...options,
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            }
        })
        server.on('connection', (socket) => {
            socket.use(async (packet, next) => {
              next();
            });
          });

        return server;
    }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('ft_trancendence API')
    .setDescription("ft_trancendence's API, on construction")
    .setVersion('1.0 (on construction)')
    .addTag('ft_trancendence')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  app.useWebSocketAdapter(new SocketAdapter(app));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
