import { ChannelsService } from './channels.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
export declare class ChannelsController {
    private readonly channelsService;
    private readonly userService;
    private readonly jwtService;
    constructor(channelsService: ChannelsService, userService: UserService, jwtService: JwtService);
    createChannel(req: any, res: any, body: any): Promise<void>;
    channelPrivacy(req: any, res: any, body: any): Promise<void>;
    setChannelPassword(req: any, res: any, body: any): Promise<void>;
    changeChannelPassword(req: any, res: any, body: any): Promise<void>;
    removePassword(req: any, res: any, body: any): Promise<void>;
    addAdmin(channelId: number, userId: number, req: any, res: any): Promise<any>;
    joinChannel(channelId: number, req: any, res: any): Promise<any>;
    banUser(channelId: number, userId: number, req: any, res: any): Promise<any>;
    kickUser(channelId: number, userId: number, req: any, res: any): Promise<any>;
    muteUser(channelId: number, userId: number, req: any, res: any, body: any): Promise<any>;
}