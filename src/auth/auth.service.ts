import { Injectable } from '@nestjs/common';
import { auth_dto } from './auth_DTO/auth_dto';
import { UsersService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly auths: auth_dto[] = [];
  
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
    ) {}

  getHello(): string {
    return 'Hello World You should Authenticate!';
  }

  create(Auth_dto : auth_dto){
    this.auths.push(Auth_dto);
  }

  findAll(): auth_dto[]{
    return this.auths;
  }

  getTest(): string{
    return 'This is A test';
  }


  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }


  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }







}
