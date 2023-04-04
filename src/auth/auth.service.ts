import {  ForbiddenException, Injectable } from '@nestjs/common';
import { auth_dto } from './dto/auth_dto';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2'

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
        where: {
          email: profile.email
        },
      });
  
      if (user) {
        return user;
      }

      try{
        const hash = Math.random().toString(36).slice(-8);
        const user = await this.prisma.users.create({
          data : {
            id: profile.id,
            email: profile.email,
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
