import { AuthService } from '../auth.service';
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: any, refreshToken: any, profile: any, cb: any): Promise<void>;
}
export {};
