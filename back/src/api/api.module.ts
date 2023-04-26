import { Module } from '@nestjs/common';

import { ApiController } from './api.controller';
import { AuthService } from 'src/auth/auth.service';

import { JwtModule} from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { FortyTwoStrategy } from 'src/strategy/FortyTwoStrategy';
import {JwtStrategy} from 'src/strategy/jwt.strategy'
import { ApiService } from './api.service';



@Module({
    imports: [JwtModule.register({}), ConfigModule],
    controllers: [ApiController],
    providers: [ApiService, AuthService, JwtStrategy, FortyTwoStrategy],
    exports: [ApiService],
  })
  export class ApiModule {}
