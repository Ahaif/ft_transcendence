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
let UserService = class UserService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async updateAvatar(imageUrl, username) {
        try {
            const updatedUser = await this.prisma.users.update({
                where: { username },
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
    async addDisplayName(displayName, username) {
        try {
            const updatedUser = await this.prisma.users.update({
                where: { username },
                data: { displayName: displayName },
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
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map