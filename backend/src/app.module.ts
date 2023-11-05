import { ConfigModule, ConfigService } from '@nestjs/config';
import { FortyTwoStrategy } from './oauth.strategy';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Jwt } from './auth/jwt/jwt';
import { ApiController } from './api/api.controller';
import { Twofactor } from './twofactor/twofactor';
import { Users } from './users/users';
import { TwofactorController } from './twofactor/twofactor.controller';
import { Jwt2fa } from './auth/jwt/jwt-2fa';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Friendship } from './friendship/friendship/friendship';
import { ChatGateway } from './chat/chat.gateway';
import { Wsjwt } from './auth/ws/wsjwt/wsjwt';
import { Chat } from './chat/chat';
import { ChatGroups } from './chat/chat-groups';
import { GameService } from './game/game.service';
import { WsvalidationPipe } from './chat/ws/wsvalidation-pipe';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '24h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'avatars'),
      serveRoot: '/avatars',
      serveStaticOptions: {
        extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'],
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [
        () => ({
          port: parseInt(process.env.PORT, 10) || 3000,
          database: {
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
          },
          jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
          },
          oauth: {
            ft: {
              clientID: process.env.OAUTH_FT_CLIENT_ID,
              clientSecret: process.env.OAUTH_FT_CLIENT_SECRET,
              callbackURL: process.env.OAUTH_FT_CALLBACK_URL,
            },
          },
        }),
      ],
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    ApiController,
    TwofactorController,
  ],
  providers: [
    AppService,
    AuthService,
    FortyTwoStrategy,
    PrismaService,
    Jwt,
    Twofactor,
    Users,
    Jwt2fa,
    Friendship,
    ChatGateway,
    Wsjwt,
    Chat,
    ChatGroups,
    GameService,
    WsvalidationPipe
  ],
})
export class AppModule {}
