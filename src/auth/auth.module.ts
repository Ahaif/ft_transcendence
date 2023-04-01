import { Module } from '@nestjs/common';


import { AuthService } from './auth.service';


import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy';




@Module({
    imports: [JwtModule.register({}), ConfigModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
  })
  export class AuthModule {}
