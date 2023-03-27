import { Controller, Get, Redirect, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { auth_dto } from './auth_DTO/auth_dto';
import { auth } from './auth_interfaces/interfaces';



@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signup(){
      return this.authService.signup();
    }



    @Post('signin')
    signin(){
      return this.authService.signin();
    }

    
}
