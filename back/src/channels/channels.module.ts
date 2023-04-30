import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { JwtModule} from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { JwtStrategy } from 'src/strategy';


@Module({
  imports: [JwtModule.register({}), ConfigModule],
  controllers: [ChannelsController],
  providers: [ChannelsService, AuthService, JwtStrategy],
  exports: [ChannelsService],

})
export class ChannelsModule {}
