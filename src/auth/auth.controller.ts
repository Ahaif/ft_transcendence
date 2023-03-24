import { Controller, Get, Redirect, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { auth_dto } from './auth_DTO/auth_dto';
import { auth } from './auth_interfaces/interfaces';
import { UsersService } from 'src/users/user.service';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Get()
    async findAll(): Promise<auth[]> {
      return this.authService.findAll();
    }

    @Post()
    async create(@Body() Auth: auth_dto) {
      return 'This action adds a new cat';
    }

  
    @Get('*')
    @Redirect('localhost:3000/login', 200)
      find() : string {
      return `This action should redirect you to log in`;
    }

    
}
