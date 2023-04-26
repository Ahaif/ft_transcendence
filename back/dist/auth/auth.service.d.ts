import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signToken(id: number, twoFA_sec: boolean, displayName: string): Promise<string>;
    findOrCreateUser(profile: any, access_token: string): Promise<Users>;
    findByUsername(id: number): Promise<Users | null>;
    addTwoFASecret(id: number, secret: string): Promise<void>;
    enableTwoFASecret(id: number): Promise<void>;
}
