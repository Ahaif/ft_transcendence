import { Injectable } from '@nestjs/common';
import { auth_dto } from './auth_DTO/auth_dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly auths: auth_dto[] = [];
  
  constructor(
  
    private jwtService: JwtService
    ) {}



    signup(){
      return 'i Have signed up';
    }

    signin(){
      return 'i Have sign in';
    }


    

 


  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   if (user && user.password === pass) {
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }


  // async login(user: any) {
  //   const payload = { username: user.username, sub: user.userId };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }







}
