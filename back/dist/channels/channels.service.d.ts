import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Channels } from '@prisma/client';
export declare class ChannelsService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    createChannel(channelName: string, ownerId: number): Promise<Channels & {
        owner: import(".prisma/client").Users;
        admins: import(".prisma/client").Users[];
        members: import(".prisma/client").Users[];
    }>;
    privateChannel(channelName: string, ownerId: number): Promise<Channels>;
    setChannelPassword(channelName: string, password: string, userId: number): Promise<Channels>;
    changeChannelPassword(channelName: string, oldPassword: string, newPassword: string, userId: number): Promise<Channels>;
    removeChannelPassword(channelName: string, userId: number): Promise<Channels>;
    getChannelByIdAndOwner(channelId: number, ownerId: number): Promise<Channels & {
        admins: import(".prisma/client").Users[];
    }>;
    addAdmin(channelId: number, userId: number): Promise<Channels & {
        admins: import(".prisma/client").Users[];
    }>;
}
