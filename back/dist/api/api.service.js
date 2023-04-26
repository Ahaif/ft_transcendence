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
exports.ApiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let ApiService = class ApiService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async createFriend(userId, friendId) {
        const currentUser = await this.prisma.users.findUnique({ where: { id: userId } });
        const friendUser = await this.prisma.users.findUnique({ where: { id: friendId } });
        if (!currentUser || !friendUser) {
            throw new Error("Invalid user ID");
        }
        const existingFriendship = await this.prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: friendId },
                    { user1Id: friendId, user2Id: userId },
                ],
            },
        });
        if (existingFriendship) {
            throw new Error("Already friends");
        }
        const newFriendship = await this.prisma.friendship.create({
            data: {
                user1: { connect: { id: userId } },
                user2: { connect: { id: friendId } },
                status: 'pending',
            },
        });
        await this.prisma.users.update({
            where: { id: userId },
            data: { friends: { connect: { id: newFriendship.id } } },
        });
        await this.prisma.users.update({
            where: { id: friendId },
            data: { friendOf: { connect: { id: newFriendship.id } } },
        });
        return newFriendship;
    }
    async getPendingFriendRequests(userId) {
        const pendingRequests = await this.prisma.friendship.findMany({
            where: {
                user2Id: userId,
                status: "pending"
            },
            include: {
                user1: true,
                user2: true
            }
        });
        return pendingRequests;
    }
    async acceptFriendRequest(userId, friendshipId) {
        const friendship = await this.prisma.friendship.findFirst({
            where: {
                id: friendshipId,
                user2Id: userId,
                status: 'pending',
            },
        });
        console.log(friendship);
        if (!friendship) {
            throw new Error('Invalid friendship request');
        }
        const updatedFriendship = await this.prisma.friendship.update({
            where: { id: friendshipId },
            data: { status: 'accepted' },
        });
        return updatedFriendship;
    }
};
ApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ApiService);
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map