import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    private readonly auths;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signToken(username: string, twoFA_sec: boolean): Promise<string>;
    findOrCreateUser(profile: any, access_token: string): Promise<Users>;
    findByUsername(username: string): Promise<Users | null>;
    exchangeCodeForToken(code: any): Promise<any>;
    addTwoFASecret(username: string, secret: string): Promise<void>;
    enableTwoFASecret(username: string): Promise<void>;
}
