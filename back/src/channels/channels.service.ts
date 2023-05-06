import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { error } from 'console';
import { Channels } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import * as argon from 'argon2'



@Injectable()
export class ChannelsService {

    constructor(
        private prisma: PrismaService, 
        private jwt : JwtService,
        private config: ConfigService
        ){}


        async getChannelById(channelId : number): Promise<Channels| null>{

          const channel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
              members: true,
              bans: true,
              kicks: true,
              admins: true,
            },
          });

          return channel;
        }

        async isUserAdmin(userId: number, channelId: number):Promise<boolean>{

          const channel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
              members: true,
              bans: true,
              kicks: true,
              admins: true,
            },
          });
          const isAdmin = channel.admins.some((admin) => admin.id === userId);
          if(isAdmin)
          {
            return true;
          }
          return false;
        }

        

      



        async createChannel(channelName: string, ownerId: number){
          const channel = await this.prisma.channels.create({
            data: {
              name: channelName,
              ownerId: ownerId,
              admins: { connect: { id: ownerId } },
              members: { connect: { id: ownerId } },
            },
            include: {
              owner: true,
              admins: true,
              members: true,
            },
          });
          
          if(!channel)
            throw error ("Error creating Channel");
        
          return channel;
        }

        async privateChannel(channelName: string, ownerId: number): Promise<Channels> {
            const channel = await this.prisma.channels.findUnique({ where: { name: channelName } });
            if (!channel) {
              throw new NotFoundException('Channel not found');
            }
            if (channel.ownerId !== ownerId) {
              throw new UnauthorizedException('You are not authorized to make changes to this channel');
            }
            if(channel.isPublic === true){
                channel.isPublic = false;
            }
            else
            {
                channel.isPublic = true
            }
            
            await this.prisma.channels.update({ where: { id: channel.id }, data: channel });
            return channel;
          }


          async setChannelPassword(channelName:string, password:string, userId:number): Promise<Channels>{
            

            const channel = await this.prisma.channels.findUnique({ where: { name: channelName } });
            if (!channel) {
              throw new NotFoundException('Channel not found');
            }
            if (channel.ownerId !== userId) {
              throw new UnauthorizedException('You are not authorized to make changes to this channel');
            }
            if(channel.password)
            {
                throw new UnauthorizedException('Channel has already a password');
            }
            channel.password = await argon.hash(password);
            console.log(channel.password)
            await this.prisma.channels.update({ where: { id: channel.id }, data: channel });
            return channel;
          }


          async changeChannelPassword(channelName: string, oldPassword: string, newPassword: string, userId: number): Promise<Channels> {
            const channel = await this.prisma.channels.findUnique({ where: { name: channelName } });
            const newPass = await argon.hash(newPassword)
            if (!channel) {
                throw new NotFoundException('Channel not found');
            }
            if (channel.ownerId !== userId) {
                throw new UnauthorizedException('You are not authorized to make changes to this channel');
            }
          
            const isPasswordValid = await argon.verify(channel.password, oldPassword);
            if (!isPasswordValid) {
                throw new BadRequestException('Invalid old password');
            }

            const isNewPasswordSameAsOld = await argon.verify(channel.password, newPassword);
            if (isNewPasswordSameAsOld) {
                throw new BadRequestException('New password cannot be the same as the old one');
            }
            
        
            channel.password = newPass;
            await this.prisma.channels.update({ where: { id: channel.id }, data: channel });
            return channel;
        }


        async removeChannelPassword(channelName: string, userId: number): Promise<Channels> {
            const channel = await this.prisma.channels.findUnique({ where: { name: channelName } });
          
            if (!channel) {
              throw new NotFoundException('Channel not found');
            }
            if (channel.ownerId !== userId) {
              throw new UnauthorizedException('You are not authorized to make changes to this channel');
            }
          
            channel.password = null;
            const updatedChannel = await this.prisma.channels.update({ where: { id: channel.id }, data: channel });
            return updatedChannel;
          }

          //get channels owned
          async getChannelByIdAndOwner(channelId: number, ownerId: number) {
            const channel = await this.prisma.channels.findUnique({
              where: { id: channelId },
              include: { admins: true },
            });
          
            if (!channel || channel.ownerId !== ownerId) {
              throw new NotFoundException('Channel not found');
            }
          
            return channel;
          }
        
          async addAdmin(channelId: number, userId: number) {
            const existingUser = await this.prisma.users.findUnique({
              where: { id: userId },
              include: {
                bans: true,
                mutes: true,
              },
            });
            
            if (!existingUser) {
              throw new NotFoundException('User not found');
            }
            
            if (existingUser.bans.length > 0) {
              throw new BadRequestException('User is banned');
            }
            
            if (existingUser.mutes.length > 0) {
              throw new BadRequestException('User is muted');
            }
            
            const existingChannel = await this.prisma.channels.findUnique({
              where: { id: channelId },
              include: { admins: true },
            });
            
            if (!existingChannel) {
              throw new NotFoundException('Channel not found');
            }
            
            if (existingChannel.admins.some((admin) => admin.id === userId)) {
              throw new BadRequestException('User is already an admin');
            }
            
            const updatedChannel = await this.prisma.channels.update({
              where: { id: channelId },
              data: {
                admins: {
                  connect: [{ id: userId }],
                },
              },
              include: { admins: true },
            });
            
            return updatedChannel;
        }


        async joinChannel(channelId: number, userId: number) {
          const channel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
              members: true,
              bans: true,
              kicks: true,
            },
          });
        
          if (!channel) {
            throw new NotFoundException('Channel not found');
          }
        
          const userBlocked = channel.bans.some(
            (blockedUser) => blockedUser.id === userId
          );
          const userBanned = channel.kicks.some(
            (bannedUser) => bannedUser.id === userId
          );
        
          if (userBlocked) {
            throw new BadRequestException('User is banned from the channel');
          }
        
          if (userBanned) {
            throw new BadRequestException('User is kicked from the channel');
          }
        
          const userAlreadyMember = channel.members.some(
            (member) => member.id === userId
          );
        
          if (userAlreadyMember) {
            throw new BadRequestException('User is already a member of the channel');
          }

        
          const updatedChannel = await this.prisma.channels.update({
            where: { id: channelId },
            data: {
              members: {
                connect: { id: userId },
              },
            },
            include: { members: true },
          });
        
          return updatedChannel;
        }



        async banUser(channelId: number, userId: number): Promise<void> {
          const existingChannel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
              members: true,
              admins: true,
              bans: true,
            },
          });
        
          if (!existingChannel) {
            throw new NotFoundException('Channel not found');
          }
        
          const isAdmin = existingChannel.admins.some((admin) => admin.id === userId);
          const isMember = existingChannel.members.some((member) => member.id === userId);
          const isBanned = existingChannel.bans.some((ban) => ban.id === userId);
        
          if (!isAdmin && !isMember) {
            throw new BadRequestException('User is not a member or admin of this channel');
          }
        
          if (isBanned) {
            throw new BadRequestException('User is already banned from this channel');
          }
        
          await this.prisma.channels.update({
            where: { id: channelId },
            data: {
              bans: {
                connect: { id: userId },
              },
              members: {
                disconnect: { id: userId },
              },
            },
          });
        }
        

        async kickUser(channelId: number, userId: number, requesterId: number): Promise<void> {
          const existingChannel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
              members: true,
              admins: true,
              owner: true,
            },
          });
        
          if (!existingChannel) {
            throw new NotFoundException('Channel not found');
          }
        
          const isAdmin = existingChannel.admins.some((admin) => admin.id === requesterId);
          if (!isAdmin) {
            throw new UnauthorizedException('Only admins can kick users from this channel');
          }
        
          const isMember = existingChannel.members.some((member) => member.id === userId);
          if (!isMember) {
            throw new BadRequestException('User is not a member of this channel');
          }
        
          const isOwner = existingChannel.owner.id === userId;
          if (isOwner) {
            throw new BadRequestException('You cannot kick the owner of this channel');
          }
        
          await this.prisma.channels.update({
            where: { id: channelId },
            data: {
              members: {
                disconnect: { id: userId },
              },
            },
          });
        }
        

















      }







    