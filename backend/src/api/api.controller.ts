import { ChatGroups } from './../chat/chat-groups';
import { UserDTO, FriendDTO } from './../DTOs/userDTO';
import { Friendship } from './../friendship/friendship/friendship';
import { Users } from './../users/users';
import { JwtService } from '@nestjs/jwt';
import { Controller, Get, Req, UseGuards, Post, Body, Res, Patch, UseInterceptors, UploadedFile, NotFoundException, Param, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomInt } from 'crypto';
import { Chat } from 'src/chat/chat';
import { GameService } from 'src/game/game.service';
@ApiTags('api')
@Controller('api')
export class ApiController {
    constructor (private prisma: PrismaService,
                 private jwtService: JwtService,
                 private userService: Users,
                 private friendService: Friendship,
                 private chatService: Chat,
                 private chatGroups: ChatGroups,
                 private gameService: GameService) {}


    @ApiOkResponse({description: 'Returns user information from database', isArray: false})
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getInformations(@Req() req) {
        let user = await this.userService.getUserInfo(req.user.user);
        user['games'] = await this.gameService.getStats(req.user.user);
        return user;
    }

    @Post('user/update')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar',  {
        storage: diskStorage({
            destination: './avatars',
            filename: (req, file, cb) => {
                const name = file.originalname.split(".");
                const ext = name[name.length - 1];
                cb(null, `${Date.now()}-avatar-${randomInt(Date.now())}.${ext}`)
            }
        })
    }))
    async updateUser(@Res() res, @Req() req, @Body() body: UserDTO, @UploadedFile() file: Express.Multer.File) {
        if (file !== null && file !== undefined) {
            await this.userService.updateAllInfo(req.user.user, body, file.path);
        }
        else {
            await this.userService.updateUserInfo(req.user.user, body);
        }
        res.status(201);
    }

    @Post('user/updateAll')
    @UseGuards(AuthGuard('jwt'))
    async updateUserInfo(@Res() res, @Req() req, @Body() body: UserDTO) {
        this.userService.updateUserInfo(req.user.user, body);
        res.status(201).send('');
    }

    @Post('user/delete')
    @UseGuards(AuthGuard('jwt'))
    async deleteUser(@Res() res, @Req() req) {
        this.userService.deleteUser(req.user.user);
        res.status(201);
    }

    @Get('user/:username')
    @UseGuards(AuthGuard('jwt'))
    async getUserInfo(@Req() req, @Param() params: UserDTO) {
        let user = await this.userService.getPublicInfo(params.username);
        let games = await this.gameService.getStats(params.username);
        if (req.user.user === user.intraName) {
            user['self'] = true;
        }
        else {
            user['self'] = false;
            if (await this.friendService.isBlockedd(req.user.user, user.intraName)) {
                user['blocked'] = true;
            }
            if (await this.friendService.blockedYou(req.user.user, user.intraName)) {
                return ({notFound: true})
            }

            const [isFriend, status] = await this.friendService.isFriend(req.user.user, user.intraName);
            user['isFriend'] = isFriend;
            user['status'] = status;
        }
        user['games'] = games;
        return user;
    }

    @Get('/search/:username')
    @UseGuards(AuthGuard('jwt'))
    async searchUsesr(@Req() req, @Param() params) {
        return await this.userService.searchUser(params.username);
    }

    @Get('users')
    @UseGuards(AuthGuard('jwt'))
    async searchUser() {
        return await this.userService.getAllUsers();
    }

    // Friendship stuff here

    @Get('friends')
    @UseGuards(AuthGuard('jwt'))
    async getFriends(@Req() req) {
        const user =  await this.friendService.getFriendship(req.user.user);
    }

    @Get('add/:friend')
    @UseGuards(AuthGuard('jwt'))
    async addFriend(@Req() req, @Param() params: FriendDTO, @Res() res) {
        try{
            const user = await this.friendService.addFriend(req.user.user, params.friend);
            if (user === null) {
                throw new NotFoundException();
            }

            res.status(201).send('Friend request sent');
        }catch(error: any)
        {
            res.status(204).send('User blocked you')
        }

    }

    @Get('cancel/:friend')
    @UseGuards(AuthGuard('jwt'))
    async cancelFriend(@Req() req, @Param() params: FriendDTO, @Res() res) {
        const user = await this.friendService.cancelRequest(req.user.user, params.friend);
        if (user === false) {
            throw new NotFoundException();
        }
        res.status(201).send('Friend request canceled');
    }

    @Get('accept/:friend')
    @UseGuards(AuthGuard('jwt'))
    async acceptFriend(@Req() req, @Param() params: FriendDTO, @Res() res) {
        const user = await this.friendService.acceptFriend(req.user.user, params.friend);
        if (user === null) {
            throw new NotFoundException();
        }
        res.status(201).send('Friend request accepted');
    }

    @Get('reject/:friend')
    @UseGuards(AuthGuard('jwt'))
    async rejectFriend(@Req() req, @Param() params: FriendDTO, @Res() res) {
        const user = await this.friendService.rejectFriend(req.user.user, params.friend);
        if (user === false) {
            throw new NotFoundException();
        }
        res.status(201).send('Friend request rejected');
    }

    @Get('myfriends')
    @UseGuards(AuthGuard('jwt'))
    async getMyFriends(@Req() req) {
        return await this.friendService.myFriends(req.user.user);
    }

    @Get('pending')
    @UseGuards(AuthGuard('jwt'))
    async getMyRequests(@Req() req) {
        return await this.friendService.myRequests(req.user.user);
    }


    @Get('delete/:friend')
    @UseGuards(AuthGuard('jwt'))
    async deleteFriend(@Req() req, @Res() res, @Param() params: FriendDTO) {
        const user = await this.friendService.deleteFriend(req.user.user, params.friend);
        if (user == null) {
            throw new NotFoundException();
        }
        res.status(201).send('Friend deleted');
    }

    @Get('block/:friend')
    @UseGuards(AuthGuard('jwt'))
    async blockFriend(@Req() req, @Res() res, @Param() params: FriendDTO) {
        const user = await this.friendService.blockUserr(req.user.user, params.friend);
        if (user === null ) {
            throw new NotFoundException();
        }
        res.status(201).send('Friend Blocked');
    }

    @Get('unblock/:friend')
    @UseGuards(AuthGuard('jwt'))
    async unblockFriend(@Req() req, @Res() res, @Param() params: FriendDTO) {
        const user = await this.friendService.unblockUserr(req.user.user, params.friend);
        if (user === null) {
            throw new NotFoundException();
        }

        res.status(201).send('Friend Unblocked');
    }

    @Get('public/friends/:username')
    @UseGuards(AuthGuard('jwt'))
    async getPublicFriends(@Req() req, @Param() params: UserDTO) {
        try {
            const user = await this.friendService.myFriends(params.username);
            return (user);
        } catch (e: any) {
            throw new NotFoundException();
        }

    }


    @Get('/messages/:username')
    @UseGuards(AuthGuard('jwt'))
    async getMessages(@Req() req, @Param() params: UserDTO) {
        try {
            let user = await this.chatService.getMessages(req.user.user, params.username);
            return (user);
        } catch(e: any) {
            throw new NotFoundException();
        }
    }

    @Get('chat/info')
    @UseGuards(AuthGuard('jwt'))
    async getChatInfo(@Req() req) {
        return await this.chatService.getLastMessages(req.user.user);
    }

    @Get('chat/groups')
    @UseGuards(AuthGuard('jwt'))
    async getGroups(@Req() req) {
        return await this.chatGroups.getGroups(req.user.user);
    }

    @Post('chat/deleteGroup')
    @UseGuards(AuthGuard('jwt'))
    async deleteGroup(@Req() req, @Body() body) {
        const {id} = body;
        if (id) {
            try {
                await this.chatGroups.deleteGroup(req.user.user, id);
                return {message: 'Group deleted'};
            }
            catch (e: any) {
                throw e;
            }
        }
        throw new BadRequestException();
    }

    @Get('chat/group/:id')
    @UseGuards(AuthGuard('jwt'))
    async getGroupMessages(@Req() req, @Param() params) {
        try {
            return await this.chatGroups.getMessages(params.id, req.user.user);
        }
        catch (e: any) {
            throw new NotFoundException();
        }
    }

    @Get('check/:username')
    @UseGuards(AuthGuard('jwt'))
    async getCheck(@Req() req, @Param() params) {
        const ret: Boolean = await this.chatGroups.isUserOrGroup(params.username);
        return {isGroup: ret};
    }

    @Get('token/check')
    @UseGuards(AuthGuard('jwt'))
    async checkToken(@Req() req) {
        return {message: 'Token is valid'};
    }

    @Get('leaderboard')
    @UseGuards(AuthGuard('jwt'))
    async getLeaderboard(@Req() req) {
        return await this.gameService.getLeaderboard();
    }

}
