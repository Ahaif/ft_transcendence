import { Module } from '@nestjs/common';


import { AuthService } from './auth.service';


import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';




@Module({
    // imports: [PrismaModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
  })
  export class AuthModule {}
