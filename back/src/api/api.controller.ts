

import { Controller, Post, Req, Res, Get, Put, Param, Body } from '@nestjs/common';
import { ApiService } from './api.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';







@Controller('api')
export class ApiController {

    constructor(
        private readonly apiService: ApiService,
        private readonly jwtService: JwtService,
        private prisma: PrismaService,
        ) {}
        
        //add_friend
        @Post('addFriend')
        @UseGuards(AuthGuard('jwt'))
        async addFriend(@Req() req, @Res() res) {

            try {
                const UserId = req.user.id;
                //should retreive it from req body
                const friendId = 2;
                const newFriendship = await this.apiService.createFriend(UserId, friendId);
                console.log(newFriendship);
                res.status(200).json({ newFriendship });
              } catch (error) {
                console.error(error);
                res.status(400).json({ message: error.message });
              }
        }


        //return pending request for user 
        @Get('pendingFriendRequests')
        @UseGuards(AuthGuard('jwt'))
        async getPendingFriendRequests(@Req() req, @Res() res) {

            try{
        
                const  userId:number  = req.user.id
                const pendingRequests = await this.apiService.getPendingFriendRequests(userId);
                console.log(pendingRequests)
                res.status(200).json({ pendingRequests });

            }catch(error){
                console.error(error);
                res.status(400).json({ message: error.message });
            }
            
        }


        //accept friend
        @Put('acceptFriendRequest/:friendshipId')
        @UseGuards(AuthGuard('jwt'))
        async acceptFriendRequest(@Req() req, @Res() res, @Param('friendshipId') friendshipId: string) {
        const  userId: number = req.user.id
        const parsedFriendshipId = parseInt(friendshipId, 10);
        console.log(parsedFriendshipId)

        const acceptedRequest = await this.apiService.acceptFriendRequest(userId, parsedFriendshipId);
        res.status(200).json({ acceptedRequest });
        }

        //change online status
        @Put('id/status/change')
        @UseGuards(AuthGuard('jwt'))
        async setOnlineStatus(@Req() req, @Res() res, @Body() body) {
            const data:string = body
            try {
                const id = req.user.id
                const user = await this.prisma.users.update({
                where: { id },
                data: data,
                });
              res.status(200).json("status changed" );

            }catch(error)
            {
                res.status(400).json({error})
            }
            
        }

        //list connected friends
        @Get('/online/friends/list')
        @UseGuards(AuthGuard('jwt'))
        async listOnlineFriends(@Req() req , @Res() res)
        {
            try{
                const user = await this.apiService.listFriends("online", req.user.id)
                console.log("passed")
                console.log(user)
                return res.status(200).json(user);
            }catch(error){
                return res.status(500).json(error);
            }
        }

        //list all friend
        @Get('/all/friends/list')
        @UseGuards(AuthGuard('jwt'))
        async listFriendsAll(@Req() req , @Res() res)
        {
            try{
                const user = await this.apiService.listFriends("all", req.user.id )
                console.log("passed")
                console.log(user)
                return res.status(200).json(user);
            }catch(error){
                return res.status(500).json(error);
            }
        }


        
      

        


}
