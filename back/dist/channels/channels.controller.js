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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const channels_service_1 = require("./channels.service");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const common_2 = require("@nestjs/common");
let ChannelsController = class ChannelsController {
    constructor(channelsService, jwtService) {
        this.channelsService = channelsService;
        this.jwtService = jwtService;
    }
    async createChannel(req, res, body) {
        try {
            const channelName = body.channelName;
            console.log(channelName);
            const userId = req.user.id;
            const newChannel = await this.channelsService.createChannel(channelName, userId);
            res.status(200).json({ newChannel });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async channelPrivacy(req, res, body) {
        try {
            const channelName = body.channelName;
            const userId = req.user.id;
            console.log(channelName);
            const updatedChannel = await this.channelsService.privateChannel(channelName, userId);
            res.status(200).json({ updatedChannel });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async setChannelPassword(req, res, body) {
        try {
            const { channelName, password } = body;
            const userId = req.user.id;
            const updatedChannel = await this.channelsService.setChannelPassword(channelName, password, userId);
            res.status(200).json({ updatedChannel });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async changeChannelPassword(req, res, body) {
        try {
            const { channelName, oldPassword, newPassword } = body;
            const userId = req.user.id;
            const updatedChannel = await this.channelsService.changeChannelPassword(channelName, oldPassword, newPassword, userId);
            if (updatedChannel) {
                res.status(200).json("updated Channel Password succefuly");
            }
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async removePassword(req, res, body) {
        try {
            const { channelName } = body;
            const userId = req.user.id;
            const updatedChannel = await this.channelsService.removeChannelPassword(channelName, userId);
            if (updatedChannel) {
                res.status(200).json("Password removed from channel succefuly");
            }
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async addAdmin(channelId, userId, req, res) {
        try {
            const ownerId = req.user.id;
            const channel = await this.channelsService.getChannelByIdAndOwner(channelId, ownerId);
            if (!channel) {
                return res.status(404).json({ message: 'Channel not found' });
            }
            if (channel.ownerId !== ownerId) {
                return res.status(403).json({ message: 'You are not the channel owner' });
            }
            console.log(channel);
            const updatedChannel = await this.channelsService.addAdmin(channelId, userId);
            return res.status(200).json({ message: 'Admin added successfully', updatedChannel });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async joinChannel(channelId, req, res) {
        try {
            const userId = req.user.id;
            await this.channelsService.joinChannel(channelId, userId);
            return res.status(200).json({ message: 'Joined the channel successfully' });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async banUser(channelId, userId, req, res) {
        try {
            const ownerId = req.user.id;
            const channel = await this.channelsService.getChannelByIdAndOwner(channelId, ownerId);
            if (!channel) {
                return res.status(404).json({ message: 'Channel not found' });
            }
            if (channel.ownerId !== ownerId) {
                return res.status(403).json({ message: 'You are not the channel owner' });
            }
            await this.channelsService.banUser(channelId, userId);
            return res.status(200).json({ message: 'User banned successfully' });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async kickUser(channelId, userId, req, res) {
        try {
            const ownerId = req.user.id;
            const channel = await this.channelsService.getChannelByIdAndOwner(channelId, ownerId);
            if (!channel) {
                return res.status(404).json({ message: 'Channel not found' });
            }
            if (channel.ownerId !== ownerId) {
                return res.status(403).json({ message: 'You are not the channel owner' });
            }
            await this.channelsService.kickUser(channelId, userId, ownerId);
            return res.status(200).json({ message: 'User kicked successfully' });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
};
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Post)('privacy/private'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "channelPrivacy", null);
__decorate([
    (0, common_1.Post)('privacy/password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "setChannelPassword", null);
__decorate([
    (0, common_1.Post)('change/password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "changeChannelPassword", null);
__decorate([
    (0, common_1.Put)('remove/password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "removePassword", null);
__decorate([
    (0, common_1.Put)(':channelId/addAdmin/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('channelId', common_2.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_2.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "addAdmin", null);
__decorate([
    (0, common_1.Put)(':channelId/join'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('channelId', common_2.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "joinChannel", null);
__decorate([
    (0, common_1.Put)(':channelId/banUser/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('channelId', common_2.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_2.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "banUser", null);
__decorate([
    (0, common_1.Put)(':channelId/kickUser/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('channelId', common_2.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_2.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "kickUser", null);
ChannelsController = __decorate([
    (0, common_1.Controller)('channels'),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService,
        jwt_1.JwtService])
], ChannelsController);
exports.ChannelsController = ChannelsController;
//# sourceMappingURL=channels.controller.js.map