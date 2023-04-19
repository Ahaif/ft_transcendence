"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const common_2 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const otplib_1 = require("otplib");
const otpauth_1 = require("otpauth");
const qrcode = require("qrcode");
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async dashboard(req, res) {
        try {
            const jwt_token = await this.authService.signToken(req.user.username, req.user.twoFactorSecret, req.user.displayName);
            const displayName = req.user.displayName;
            if (req.user.twoFactorSecret) {
                res.redirect(`http://localhost:3001/dashboard?access_token=${jwt_token}&displayName=${displayName}`);
            }
            else {
                res.redirect(`http://localhost:3001/enable-2fa?access_token=${jwt_token}&displayName=${displayName}`);
            }
        }
        catch (error) {
            console.error('Error exchanging code for token:', error);
            console.log(error);
        }
    }
    async generate42AuthUrl(req) {
        const redirectUri = 'http://localhost:3000/auth/dashboard';
        const clientId = 'u-s4t2ud-c73b0d60dab9c28bab7af6f2578a6c8c463110dd695b0818c224210eb390eb0f';
        const scope = 'public';
        const state = '42oauth';
        const url = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
        return { url };
    }
    async showEnable2FA(req, res) {
        try {
            const secret = new otpauth_1.Secret({ size: 20 });
            const appName = 'ft_transcendence';
            const totpUri = new otpauth_1.TOTP({
                issuer: appName,
                secret: secret.base32,
                algorithm: 'SHA1',
                digits: 6,
                period: 30,
            }).toString();
            const qrCodeUrl = await qrcode.toDataURL(totpUri);
            await this.authService.addTwoFASecret(req.user.username, secret.base32);
            res.status(200).json({ qrCodeUrl });
        }
        catch (error) {
            console.error('Error generating 2FA:', error);
            res.status(500).send('Error generating 2FA');
        }
    }
    async check_two_fa(req, res, body) {
        const user_data = await this.authService.findByUsername(req.user.username);
        const secretFromDB = user_data.twofa_secret;
        const userEnteredCode = body.password;
        const isValid = otplib_1.authenticator.verify({
            secret: secretFromDB,
            token: userEnteredCode
        });
        if (isValid) {
            await this.authService.enableTwoFASecret(req.user.username);
            console.log("TOTP VALIDATED");
            res.status(200).json({ success: true });
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid TOTP code' });
        }
    }
};
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('42')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('generate-42-auth-url'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generate42AuthUrl", null);
__decorate([
    (0, common_1.Get)('enable-2fa'),
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "showEnable2FA", null);
__decorate([
    (0, common_1.Post)('check-2fa'),
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "check_two_fa", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map