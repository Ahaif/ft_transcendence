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
exports.ApiController = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("./api.service");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const passport_1 = require("@nestjs/passport");
const common_2 = require("@nestjs/common");
let ApiController = class ApiController {
    constructor(apiService, jwtService, prisma) {
        this.apiService = apiService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async addFriend(req, res) {
        try {
            const UserId = req.user.id;
            const friendId = 9;
            const newFriendship = await this.apiService.createFriend(UserId, friendId);
            console.log(newFriendship);
            res.status(200).json({ newFriendship });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }
    async getPendingFriendRequests(req, res) {
        try {
            const userId = req.user.id;
            const pendingRequests = await this.apiService.getPendingFriendRequests(userId);
            console.log(pendingRequests);
            res.status(200).json({ pendingRequests });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: error.message });
        }
    }
    async acceptFriendRequest(req, res, friendshipId) {
        const userId = req.user.id;
        const parsedFriendshipId = parseInt(friendshipId, 10);
        console.log(parsedFriendshipId);
        const acceptedRequest = await this.apiService.acceptFriendRequest(userId, parsedFriendshipId);
        res.status(200).json({ acceptedRequest });
    }
    async setOnlineStatus(req, res, body) {
        const data = body;
        console.log(body);
        try {
            const id = req.user.id;
            const user = await this.prisma.users.update({
                where: { id },
                data: data,
            });
            res.status(200).json("status changed");
        }
        catch (error) {
            res.status(400).json({ error });
        }
    }
};
__decorate([
    (0, common_1.Post)('addFriend'),
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Get)('pendingFriendRequests'),
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "getPendingFriendRequests", null);
__decorate([
    (0, common_1.Put)('acceptFriendRequest/:friendshipId'),
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('friendshipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "acceptFriendRequest", null);
__decorate([
    (0, common_1.Put)('id/status/change'),
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "setOnlineStatus", null);
ApiController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [api_service_1.ApiService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], ApiController);
exports.ApiController = ApiController;
//# sourceMappingURL=api.controller.js.map