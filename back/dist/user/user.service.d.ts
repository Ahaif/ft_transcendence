import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';
export declare class UserService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    updateAvatar(imageUrl: string, id: number): Promise<void>;
    addDisplayName(displayName: string, id: number): Promise<string>;
    findBydisplayName(displayName: string): Promise<Users | null>;
}
