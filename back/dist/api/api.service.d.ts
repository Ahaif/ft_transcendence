import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Friendship } from "@prisma/client";
export declare class ApiService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    createFriend(userId: number, friendId: number): Promise<any>;
    getPendingFriendRequests(userId: number): Promise<Friendship[]>;
    acceptFriendRequest(userId: number, friendshipId: number): Promise<Friendship>;
}
