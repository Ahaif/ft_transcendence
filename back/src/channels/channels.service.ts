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



        async createChannel(channelName: string, ownerId: number){

            const channel = await this.prisma.channels.create({
                data: {
                  name: channelName,
                  ownerId: ownerId
                }
              });
              if(!channel)
                throw error ("Error creating Channel")
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







    
}
