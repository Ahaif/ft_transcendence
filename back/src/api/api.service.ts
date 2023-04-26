import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Users } from "@prisma/client";
import {Friendship} from "@prisma/client"
import { AuthService } from "src/auth/auth.service";





@Injectable()
export class ApiService {

    constructor(
        private prisma: PrismaService, 
        private jwt : JwtService,
        private config: ConfigService
        ){}


        async createFriend(userId: number, friendId : number): Promise<any> {
          const currentUser = await this.prisma.users.findUnique({ where: { id: userId } });
          const friendUser = await this.prisma.users.findUnique({ where: { id: friendId } });
        
          if (!currentUser || !friendUser) {
            throw new Error("Invalid user ID");
          }
        
          const existingFriendship = await this.prisma.friendship.findFirst({
            where: {
              OR: [
                { user1Id: userId, user2Id: friendId },
                { user1Id: friendId, user2Id: userId },
              ],
            },
          });
        
          if (existingFriendship) {
            throw new Error("Already friends");
          }
        
          const newFriendship = await this.prisma.friendship.create({
            data: {
              user1: { connect: { id: userId } },
              user2: { connect: { id: friendId } },
              status: 'pending',
            },
          });
        
          // Add the new friendship to both users' arrays
          await this.prisma.users.update({
            where: { id: userId },
            data: { friends: { connect: { id: newFriendship.id } } },
          });
        
          await this.prisma.users.update({
            where: { id: friendId },
            data: { friendOf: { connect: { id: newFriendship.id } } },
          });
        
          return newFriendship;
        }
        

        async getPendingFriendRequests(userId: number): Promise<Friendship[]> {
            const pendingRequests = await this.prisma.friendship.findMany({
              where: {
                user2Id: userId,
                status: "pending"
              },
              include: {
                user1: true,
                user2: true
              }
            });
            
            return pendingRequests;
          }


          async acceptFriendRequest(userId: number, friendshipId: number): Promise<Friendship> {
            const friendship = await this.prisma.friendship.findFirst({
              where: {
                id: friendshipId,
                user2Id: userId,
                status: 'pending',
              },
            });
            console.log(friendship)
          
            if (!friendship) {
              throw new Error('Invalid friendship request');
            }
          
            const updatedFriendship = await this.prisma.friendship.update({
              where: { id: friendshipId },
              data: { status: 'accepted' },
            });
          
            return updatedFriendship;
          }

}