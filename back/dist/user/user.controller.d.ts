/// <reference types="multer" />
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    private readonly jwtService;
    constructor(userService: UserService, authService: AuthService, jwtService: JwtService);
    uploadAvatar(req: any, file: Express.Multer.File): Promise<string>;
    userData(req: any): Promise<{
        hash: any;
        access_token: any;
        twofa_secret: any;
        id: number;
        email: string;
        username: string;
        twoFactorSecret: boolean;
        avatar: string;
        displayName: string;
        status: string;
    }>;
    add_displayName(req: any, body: any, res: any): Promise<any>;
}
