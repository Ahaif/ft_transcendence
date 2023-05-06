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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const console_1 = require("console");
let UserService = class UserService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async updateAvatar(imageUrl, id) {
        try {
            const updatedUser = await this.prisma.users.update({
                where: { id },
                data: { avatar: imageUrl },
            });
            if (!updatedUser) {
                throw new common_1.NotFoundException('User not found');
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update avatar');
        }
    }
    async getUserById(userId) {
        const user = this.prisma.users.findUnique({ where: { id: userId } });
        if (user) {
            return true;
        }
        return false;
    }
    async addDisplayName(displayName, id) {
        try {
            const updatedUser = await this.prisma.users.update({
                where: { id },
                data: {
                    displayName: displayName,
                    status: "online"
                },
            });
            if (!updatedUser) {
                return null;
            }
            return displayName;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to add displayName');
        }
    }
    async findBydisplayName(displayName) {
        const user = await this.prisma.users.findUnique({
            where: {
                displayName: displayName,
            },
        });
        if (user) {
            delete user.hash;
        }
        return user;
    }
    async getPlayerData(userId) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            include: {
                matches: {
                    include: {
                        player1: { select: { displayName: true } },
                        player2: { select: { displayName: true } },
                    },
                },
            },
        });
        if (!user) {
            throw (0, console_1.error)("user not found");
        }
        const stats = {
            wins: user.wins,
            losses: user.losses,
            ladderLevel: user.ladderLevel,
            achievements: user.achievements,
        };
        const matchHistory = user.matches.map((match) => ({
            id: match.id,
            result: match.result,
            player1: match.player1.displayName,
            player2: match.player2.displayName,
        }));
        return { stats, matchHistory };
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map