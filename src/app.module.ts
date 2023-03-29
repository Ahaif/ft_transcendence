import { Module } from '@nestjs/common';
import { AppController} from './app.controller';

import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';


// @Global() When you want to provide a set of providers which should be available everywhere out-of-the-box 
// (e.g., helpers, database connections, etc.), 
@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   // database configuration
    // }),
    AuthModule,
    UserModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports: [CatsService] to export any service to be use by all the modules declared 
})
export class AppModule {}
