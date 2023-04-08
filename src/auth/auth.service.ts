import {  ForbiddenException, Injectable } from '@nestjs/common';
import { auth_dto } from './dto/auth_dto';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2'
import axios from 'axios';


//handling errors
import { ConflictException, InternalServerErrorException } from '@nestjs/common';


import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  private readonly auths: auth_dto[] = [];

  constructor(
    private prisma: PrismaService, 
    private jwt : JwtService,
    private config: ConfigService
    ){}


  async signup(dto : auth_dto){
      // generate pw hash
      const hash = await argon.hash(dto.password);

      // save the new user in db 
    try{
      const user = await this.prisma.users.create({
        data : {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;
      return this.signToken(user.id, user.email);
    }
    catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Email already exists.');
      }
      throw new InternalServerErrorException('Failed to create user.');
    }
  }


   async signin(dto : auth_dto){
      //find the user by email
      const user = await this.prisma.users.findUnique({
        where: {
          email: dto.email
        },
      });

       //if user does not exist throw exceptiom 
      if(!user) throw new ForbiddenException('Credentials inccorect');

      //if pw incorrect throw exception
      const pwMatches = await argon.verify(user.hash, dto.password)
      if(!pwMatches) throw new ForbiddenException('Credentials inccorect');

      // //send back 
      // delete user.hash
      return this.signToken(user.id, user.email);

    }



   async signToken(userId: number, email: string): Promise<{access_token: string}>
    {
      const payload = {
        sub: userId,
        email
      }
      const secret = this.config.get('JWT_SECRET')
      const token =  await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: secret,
      });

      return{
        access_token: token,
      };

    }


    async findOrCreateUser(profile: any): Promise<Users> {

      
      const user = await this.prisma.users.findUnique({ 
        where: { email: profile.emails[0].value
         } 
      });
  
      if (user) {
        return user;
      }

      try{
        const hash = Math.random().toString(36).slice(-8);
        const user = await this.prisma.users.create({
          data : {
            // id: profile.id,
            email: profile.emails[0].value,
            hash,
          },
        });
        delete user.hash;
        return user;
      }
      catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
          throw new ConflictException('Email already exists.');
        }
        throw new InternalServerErrorException('Failed to create user.');
      }


    }



 

    async exchangeCodeForToken(code: any) {
      const clientId = 'u-s4t2ud-c73b0d60dab9c28bab7af6f2578a6c8c463110dd695b0818c224210eb390eb0f';
      const clientSecret = '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';
      const redirectUri = 'http://localhost:3000/auth/dashboard';
      
      try {
        const response = await axios.post('https://api.intra.42.fr/oauth/token', {
          grant_type: 'client_credentials',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        });
    
        return response.data.access_token;
      } catch (error) {
        if (error.response.data.error === 'invalid_grant') {
          throw new Error('Incorrect authorization grant: The authorization grant could be invalid, expired, revoked, or may not match the redirection URI used in the authorization request.');
        }
        throw error;
      }
  }
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






