import {  ForbiddenException, Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2'
import axios from 'axios';
import { NotFoundException } from '@nestjs/common';


//handling errors
import { ConflictException, InternalServerErrorException } from '@nestjs/common';


import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {


  constructor(
    private prisma: PrismaService, 
    private jwt : JwtService,
    private config: ConfigService
    ){}

    async signToken(id: number, twoFA_sec: boolean, displayName: string): Promise<string > {
      const payload = {
        id,
        twoFA_sec,
        displayName
       
      };
    
      const secret = this.config.get('JWT_SECRET');
      const token = await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret,
      });
    
      return token
    }

    async findOrCreateUser(profile: any, access_token: string): Promise<Users> {
      const user = await this.prisma.users.findUnique({
        where: { email: profile.emails[0].value }
      });
    
      if (user) {
        return user;
      }
    
      try {
        const hash = Math.random().toString(36).slice(-8);
    
        const newUser = await this.prisma.users.create({
          data: {
            email: profile.emails[0].value,
            hash,
            username: profile.username,
            access_token,
            twoFactorSecret: false,
            avatar : profile._json.image.link,
            displayName: ""

          }
        });
    
      
        return newUser;
      } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
          throw new ConflictException('Email already exists.');
        }
        throw new InternalServerErrorException('Failed to create user.');
      }
    }

    
  async findByUsername(id: number): Promise<Users | null> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: id,
      },
    });
    delete user.hash
    return user
  }

  async addTwoFASecret(id: number, secret: string): Promise<void> {
    try {
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: { twofa_secret: secret },
      });
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to add 2FA secret');
    }
  }
  

  async enableTwoFASecret(id: number): Promise<void> {
    try {
      const updatedUser = await this.prisma.users.update({
        where: { id },
        data: { twoFactorSecret: true },
      });
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to add 2FA secret');
    }
  }

}
    



