/// <reference types="multer" />
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
export declare class UserController {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    uploadAvatar(req: any, file: Express.Multer.File): Promise<string>;
}
