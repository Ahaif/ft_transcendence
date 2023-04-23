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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("axios");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async signToken(username, twoFA_sec, displayName) {
        const payload = {
            username,
            twoFA_sec,
            displayName
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret,
        });
        return token;
    }
    async findOrCreateUser(profile, access_token) {
        var _a, _b;
        const user = await this.prisma.users.findUnique({
            where: { email: profile.emails[0].value }
        });
        if (user) {
            return user;
        }
        try {
            const hash = Math.random().toString(36).slice(-8);
            const newUser = await this.prisma.users.create({
                data: {
                    email: profile.emails[0].value,
                    hash,
                    username: profile.username,
                    access_token,
                    twoFactorSecret: false,
                    avatar: profile._json.image.link,
                    displayName: ""
                }
            });
            return newUser;
        }
        catch (error) {
            if (error.code === 'P2002' && ((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
                throw new common_3.ConflictException('Email already exists.');
            }
            throw new common_3.InternalServerErrorException('Failed to create user.');
        }
    }
    async findByUsername(username) {
        const user = await this.prisma.users.findUnique({
            where: {
                username: username,
            },
        });
        delete user.hash;
        return user;
    }
    async exchangeCodeForToken(code) {
        const clientId = 'u-s4t2ud-c73b0d60dab9c28bab7af6f2578a6c8c463110dd695b0818c224210eb390eb0f';
        const clientSecret = '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';
        const redirectUri = 'http://10.11.1.1:3000/auth/dashboard';
        try {
            const response = await axios_1.default.post('https://api.intra.42.fr/oauth/token', {
                grant_type: 'client_credentials',
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
            });
            return response.data.access_token;
        }
        catch (error) {
            if (error.response.data.error === 'invalid_grant') {
                throw new Error('Incorrect authorization grant: The authorization grant could be invalid, expired, revoked, or may not match the redirection URI used in the authorization request.');
            }
            throw error;
        }
    }
    async addTwoFASecret(username, secret) {
        try {
            const updatedUser = await this.prisma.users.update({
                where: { username },
                data: { twofa_secret: secret },
            });
            if (!updatedUser) {
                throw new common_2.NotFoundException('User not found');
            }
        }
        catch (error) {
            throw new common_3.InternalServerErrorException('Failed to add 2FA secret');
        }
    }
    async enableTwoFASecret(username) {
        try {
            const updatedUser = await this.prisma.users.update({
                where: { username },
                data: { twoFactorSecret: true },
            });
            if (!updatedUser) {
                throw new common_2.NotFoundException('User not found');
            }
        }
        catch (error) {
            throw new common_3.InternalServerErrorException('Failed to add 2FA secret');
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map