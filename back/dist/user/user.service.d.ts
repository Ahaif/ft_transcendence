import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';
export declare class UserService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    updateAvatar(imageUrl: string, username: string): Promise<void>;
    addDisplayName(displayName: string, username: string): Promise<string>;
    findBydisplayName(displayName: string): Promise<Users | null>;
}
