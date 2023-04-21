import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';





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
    
}
