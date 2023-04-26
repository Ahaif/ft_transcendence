import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { FortyTwoStrategy } from 'src/strategy/FortyTwoStrategy';
import { JwtStrategy } from 'src/strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserController } from './user.controller';


@Module({
  imports: [JwtModule.register({}),ConfigModule],
  controllers: [UserController],
  providers: [UserService, FortyTwoStrategy, JwtStrategy, AuthService],
  exports: [UserService]
})
export class UserModule {}
