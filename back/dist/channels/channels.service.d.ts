import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Channels } from '@prisma/client';
export declare class ChannelsService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    getChannelById(channelId: number): Promise<Channels | null>;
    isUserAdmin(userId: number, channelId: number): Promise<boolean>;
    createChannel(channelName: string, ownerId: number): Promise<Channels & {
        members: import(".prisma/client").Users[];
        admins: import(".prisma/client").Users[];
        owner: import(".prisma/client").Users;
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
    joinChannel(channelId: number, userId: number): Promise<Channels & {
        members: import(".prisma/client").Users[];
    }>;
    banUser(channelId: number, userId: number): Promise<void>;
    kickUser(channelId: number, userId: number, requesterId: number): Promise<void>;
    muteUser(channelId: number, userId: number, muteDurationInMinutes: number): Promise<void>;
}
