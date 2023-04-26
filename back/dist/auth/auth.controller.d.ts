import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    dashboard(req: any, res: any): Promise<void>;
    generate42AuthUrl(): Promise<{
        url: string;
    }>;
    showEnable2FA(req: any, res: any): Promise<void>;
    check_two_fa(req: any, res: any, body: any): Promise<void>;
}
