import { Module } from '@nestjs/common';


import { AuthService } from './auth.service';


import { AuthController } from './auth.controller';

import { JwtModule} from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategy';
import { FortyTwoStrategy} from './strategy/FortyTwoStrategy'




@Module({
    imports: [JwtModule.register({}), ConfigModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, FortyTwoStrategy],
    exports: [AuthService],
  })
  export class AuthModule {}
