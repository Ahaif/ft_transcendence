import { Controller, Get, Post, UseGuards, Request} from '@nestjs/common';



// import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
  constructor(private authService: AuthService) {}

  @Get()
  getHello(): string {
    return "hello world";
  }


}




