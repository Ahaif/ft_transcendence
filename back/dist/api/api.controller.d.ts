import { ApiService } from './api.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ApiController {
    private readonly apiService;
    private readonly jwtService;
    private prisma;
    constructor(apiService: ApiService, jwtService: JwtService, prisma: PrismaService);
    addFriend(req: any, res: any): Promise<void>;
    getPendingFriendRequests(req: any, res: any): Promise<void>;
    acceptFriendRequest(req: any, res: any, friendshipId: string): Promise<void>;
    setOnlineStatus(req: any, res: any, body: any): Promise<void>;
    listOnlineFriends(req: any, res: any): Promise<any>;
    listFriendsAll(req: any, res: any): Promise<any>;
}
