import { Module } from '@nestjs/common';


import { AuthService } from './auth.service';
import { LocalStrategy } from './local_strategy';

import { UsersModule } from 'src/users/user.module';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';




@Module({
    imports: [
      UsersModule, 
      PassportModule,
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60s' },
      })
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy],
    exports: [AuthService],
  })
  export class AuthModule {}
