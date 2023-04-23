import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';




@Injectable()
export class UserService {


    constructor(
        private prisma: PrismaService, 
        private jwt : JwtService,
        private config: ConfigService
        ){}


    async updateAvatar(imageUrl : string, username:string)
    {
        try {
            const updatedUser = await this.prisma.users.update({
              where: { username },
              data: { avatar: imageUrl },
            });
            if (!updatedUser) {
              throw new NotFoundException('User not found');
            }
          } catch (error) {
            throw new InternalServerErrorException('Failed to update avatar');
          }

    }

    async addDisplayName(displayName:string, username:string):Promise<string>
    {
      try {
        
        const updatedUser = await this.prisma.users.update({
          where: { username },
          data: { displayName : displayName},
        });
        if (!updatedUser) {
          return null;
        }
        return displayName;
      } catch (error) {
        throw new InternalServerErrorException('Failed to add displayName');
      }

    }

    async findBydisplayName(displayName : string): Promise<Users | null> {
      const user = await this.prisma.users.findUnique({
        where: {
          displayName: displayName,
        },
      });
      if (user) {
        delete user.hash;
      }
    
      return user;

    }
    
}
