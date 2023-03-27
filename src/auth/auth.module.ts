import { Module } from '@nestjs/common';


import { AuthService } from './auth.service';


import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';




@Module({
    imports: [
      PassportModule,
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60s' },
      })
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
  })
  export class AuthModule {}
