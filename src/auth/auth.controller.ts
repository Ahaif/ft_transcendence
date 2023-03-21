import { Controller, Get, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Get()
    findAll(): string {
      return this.authService.getHello();
    }
  
    @Get('*')
    @Redirect('http://localhost:3000/login', 200)
      find() : string {
      return `This action should redirect you to log in`;
    }

    
}
