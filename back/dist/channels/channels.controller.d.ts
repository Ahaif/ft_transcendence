import { ChannelsService } from './channels.service';
import { JwtService } from '@nestjs/jwt';
export declare class ChannelsController {
    private readonly channelsService;
    private readonly jwtService;
    constructor(channelsService: ChannelsService, jwtService: JwtService);
    createChannel(req: any, res: any, body: any): Promise<void>;
    channelPrivacy(req: any, res: any, body: any): Promise<void>;
    setChannelPassword(req: any, res: any, body: any): Promise<void>;
    changeChannelPassword(req: any, res: any, body: any): Promise<void>;
    removePassword(req: any, res: any, body: any): Promise<void>;
    addAdmin(channelId: number, userId: number, req: any, res: any): Promise<any>;
}
