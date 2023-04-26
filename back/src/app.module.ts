import { Module } from '@nestjs/common';
import { AppController} from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { ApiController } from './api/api.controller';
import { ApiModule } from './api/api.module';



// @Global() When you want to provide a set of providers which should be available everywhere out-of-the-box 
// (e.g., helpers, database connections, etc.), 
@Module({
  imports: [
    ConfigModule.forRoot({}),
    JwtModule.register({}),
    PrismaModule,
    AuthModule,
    UserModule,
    ApiModule
    
  ],
  controllers: [AppController, UserController, AuthController, ApiController],
  providers: [AppService],
  // exports: [CatsService] to export any service to be use by all the modules declared 
})
export class AppModule {}
