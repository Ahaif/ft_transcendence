import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/strategy';
import { UserController } from './user.controller';

@Module({

    controllers: [UserController],
     providers: [UserController,],
})
export class UserModule {}
