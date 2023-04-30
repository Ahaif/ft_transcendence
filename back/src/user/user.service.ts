import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';
import { error } from 'console';




@Injectable()
export class UserService {


    constructor(
        private prisma: PrismaService, 
        private jwt : JwtService,
        private config: ConfigService
        ){}


    async updateAvatar(imageUrl : string, id:number)
    {
        try {
            const updatedUser = await this.prisma.users.update({
              where: { id },
              data: { avatar: imageUrl },
            });
            if (!updatedUser) {
              throw new NotFoundException('User not found');
            }
          } catch (error) {
            throw new InternalServerErrorException('Failed to update avatar');
          }

    }

    async addDisplayName(displayName:string, id: number):Promise<string>
    {
      try {
        
        const updatedUser = await this.prisma.users.update({
          where: { id },
          data: { 
            displayName : displayName,
            status : "online"
           
                },
        });
        if (!updatedUser) {
          return null;
        }
        return displayName;
      } catch (error) {
        throw new InternalServerErrorException('Failed to add displayName');
      }

    }

    async findBydisplayName(displayName : string): Promise<any > {
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


    async getPlayerData(userId: number): Promise <any>{

      const user = await this.prisma.users.findUnique({ 
        where: { id: userId },
        include: {
          matches: {
            include: {
              player1: { select: { displayName: true } },
              player2: { select: { displayName: true } },
            },
          },
        },
      });
      if(!user){
        throw error ("user not found");
      }


      const stats = {
        wins: user.wins,
        losses: user.losses,
        ladderLevel: user.ladderLevel,
        achievements: user.achievements,
      };
  
      const matchHistory = user.matches.map((match) => ({
        id: match.id,
        result: match.result,
        player1: match.player1.displayName,
        player2: match.player2.displayName,
      }));

      return { stats, matchHistory };
  

    }
    
}
