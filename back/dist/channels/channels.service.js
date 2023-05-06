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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const console_1 = require("console");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const common_4 = require("@nestjs/common");
const argon = require("argon2");
let ChannelsService = class ChannelsService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async getChannelById(channelId) {
        const channel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
                members: true,
                bans: true,
                kicks: true,
                admins: true,
            },
        });
        return channel;
    }
    async isUserAdmin(userId, channelId) {
        const channel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
                members: true,
                bans: true,
                kicks: true,
                admins: true,
            },
        });
        const isAdmin = channel.admins.some((admin) => admin.id === userId);
        if (isAdmin) {
            return true;
        }
        return false;
    }
    async createChannel(channelName, ownerId) {
        const channel = await this.prisma.channels.create({
            data: {
                name: channelName,
                ownerId: ownerId,
                admins: { connect: { id: ownerId } },
                members: { connect: { id: ownerId } },
            },
            include: {
                owner: true,
                admins: true,
                members: true,
            },
        });
        if (!channel)
            throw (0, console_1.error)("Error creating Channel");
        return channel;
    }
    async privateChannel(channelName, ownerId) {
        const channel = await this.prisma.channels.findUnique({ where: { name: channelName } });
        if (!channel) {
            throw new common_2.NotFoundException('Channel not found');
        }
        if (channel.ownerId !== ownerId) {
            throw new common_3.UnauthorizedException('You are not authorized to make changes to this channel');
        }
        if (channel.isPublic === true) {
            channel.isPublic = false;
        }
        else {
            channel.isPublic = true;
        }
        await this.prisma.channels.update({ where: { id: channel.id }, data: channel });
        return channel;
    }
    async setChannelPassword(channelName, password, userId) {
        const channel = await this.prisma.channels.findUnique({ where: { name: channelName } });
        if (!channel) {
            throw new common_2.NotFoundException('Channel not found');
        }
        if (channel.ownerId !== userId) {
            throw new common_3.UnauthorizedException('You are not authorized to make changes to this channel');
        }
        if (channel.password) {
            throw new common_3.UnauthorizedException('Channel has already a password');
        }
        channel.password = await argon.hash(password);
        console.log(channel.password);
        await this.prisma.channels.update({ where: { id: channel.id }, data: channel });
        return channel;
    }
    async changeChannelPassword(channelName, oldPassword, newPassword, userId) {
        const channel = await this.prisma.channels.findUnique({ where: { name: channelName } });
        const newPass = await argon.hash(newPassword);
        if (!channel) {
            throw new common_2.NotFoundException('Channel not found');
        }
        if (channel.ownerId !== userId) {
            throw new common_3.UnauthorizedException('You are not authorized to make changes to this channel');
        }
        const isPasswordValid = await argon.verify(channel.password, oldPassword);
        if (!isPasswordValid) {
            throw new common_4.BadRequestException('Invalid old password');
        }
        const isNewPasswordSameAsOld = await argon.verify(channel.password, newPassword);
        if (isNewPasswordSameAsOld) {
            throw new common_4.BadRequestException('New password cannot be the same as the old one');
        }
        channel.password = newPass;
        await this.prisma.channels.update({ where: { id: channel.id }, data: channel });
        return channel;
    }
    async removeChannelPassword(channelName, userId) {
        const channel = await this.prisma.channels.findUnique({ where: { name: channelName } });
        if (!channel) {
            throw new common_2.NotFoundException('Channel not found');
        }
        if (channel.ownerId !== userId) {
            throw new common_3.UnauthorizedException('You are not authorized to make changes to this channel');
        }
        channel.password = null;
        const updatedChannel = await this.prisma.channels.update({ where: { id: channel.id }, data: channel });
        return updatedChannel;
    }
    async getChannelByIdAndOwner(channelId, ownerId) {
        const channel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: { admins: true },
        });
        if (!channel || channel.ownerId !== ownerId) {
            throw new common_2.NotFoundException('Channel not found');
        }
        return channel;
    }
    async addAdmin(channelId, userId) {
        const existingUser = await this.prisma.users.findUnique({
            where: { id: userId },
            include: {
                bans: true,
                mutes: true,
            },
        });
        if (!existingUser) {
            throw new common_2.NotFoundException('User not found');
        }
        if (existingUser.bans.length > 0) {
            throw new common_4.BadRequestException('User is banned');
        }
        if (existingUser.mutes.length > 0) {
            throw new common_4.BadRequestException('User is muted');
        }
        const existingChannel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: { admins: true },
        });
        if (!existingChannel) {
            throw new common_2.NotFoundException('Channel not found');
        }
        if (existingChannel.admins.some((admin) => admin.id === userId)) {
            throw new common_4.BadRequestException('User is already an admin');
        }
        const updatedChannel = await this.prisma.channels.update({
            where: { id: channelId },
            data: {
                admins: {
                    connect: [{ id: userId }],
                },
            },
            include: { admins: true },
        });
        return updatedChannel;
    }
    async joinChannel(channelId, userId) {
        const channel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
                members: true,
                bans: true,
                kicks: true,
            },
        });
        if (!channel) {
            throw new common_2.NotFoundException('Channel not found');
        }
        const userBlocked = channel.bans.some((blockedUser) => blockedUser.id === userId);
        const userBanned = channel.kicks.some((bannedUser) => bannedUser.id === userId);
        if (userBlocked) {
            throw new common_4.BadRequestException('User is banned from the channel');
        }
        if (userBanned) {
            throw new common_4.BadRequestException('User is kicked from the channel');
        }
        const userAlreadyMember = channel.members.some((member) => member.id === userId);
        if (userAlreadyMember) {
            throw new common_4.BadRequestException('User is already a member of the channel');
        }
        const updatedChannel = await this.prisma.channels.update({
            where: { id: channelId },
            data: {
                members: {
                    connect: { id: userId },
                },
            },
            include: { members: true },
        });
        return updatedChannel;
    }
    async banUser(channelId, userId) {
        const existingChannel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
                members: true,
                admins: true,
                bans: true,
            },
        });
        if (!existingChannel) {
            throw new common_2.NotFoundException('Channel not found');
        }
        const isAdmin = existingChannel.admins.some((admin) => admin.id === userId);
        const isMember = existingChannel.members.some((member) => member.id === userId);
        const isBanned = existingChannel.bans.some((ban) => ban.id === userId);
        if (!isAdmin && !isMember) {
            throw new common_4.BadRequestException('User is not a member or admin of this channel');
        }
        if (isBanned) {
            throw new common_4.BadRequestException('User is already banned from this channel');
        }
        await this.prisma.channels.update({
            where: { id: channelId },
            data: {
                bans: {
                    connect: { id: userId },
                },
                members: {
                    disconnect: { id: userId },
                },
            },
        });
    }
    async kickUser(channelId, userId, requesterId) {
        const existingChannel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
                members: true,
                admins: true,
                owner: true,
            },
        });
        if (!existingChannel) {
            throw new common_2.NotFoundException('Channel not found');
        }
        const isAdmin = existingChannel.admins.some((admin) => admin.id === requesterId);
        if (!isAdmin) {
            throw new common_3.UnauthorizedException('Only admins can kick users from this channel');
        }
        const isMember = existingChannel.members.some((member) => member.id === userId);
        if (!isMember) {
            throw new common_4.BadRequestException('User is not a member of this channel');
        }
        const isOwner = existingChannel.owner.id === userId;
        if (isOwner) {
            throw new common_4.BadRequestException('You cannot kick the owner of this channel');
        }
        await this.prisma.channels.update({
            where: { id: channelId },
            data: {
                members: {
                    disconnect: { id: userId },
                },
            },
        });
    }
    async muteUser(channelId, userId, muteDurationInMinutes) {
        const existingChannel = await this.prisma.channels.findUnique({
            where: { id: channelId },
            include: {
                admins: true,
                members: true,
                mutedUsers: true,
            },
        });
        if (!existingChannel) {
            throw new common_2.NotFoundException('Channel not found');
        }
        const isAdmin = existingChannel.admins.some((admin) => admin.id === userId);
        const isMember = existingChannel.members.some((member) => member.id === userId);
        const isMuted = existingChannel.mutedUsers.some((mutedUser) => mutedUser.userId === userId);
        if (!isAdmin && !isMember) {
            throw new common_4.BadRequestException('User is not a member or admin of this channel');
        }
        if (isMuted) {
            throw new common_4.BadRequestException('User is already muted in this channel');
        }
        const muteEndTime = new Date(Date.now() + muteDurationInMinutes * 60000);
        await this.prisma.users.update({
            where: { id: userId },
            data: {
                mutes: {
                    create: {
                        channel: { connect: { id: channelId } },
                        muteEndTime,
                    },
                },
            },
        });
    }
};
ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChannelsService);
exports.ChannelsService = ChannelsService;
//# sourceMappingURL=channels.service.js.map