

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

        @Post('addFriend')
        @UseGuards(AuthGuard('jwt'))
        async addFriend(@Req() req, @Res() res) {

            try {
                const UserId = req.user.id;
                const friendId = 9;
                const newFriendship = await this.apiService.createFriend(UserId, friendId);
                console.log(newFriendship);
                res.status(200).json({ newFriendship });
              } catch (error) {
                console.error(error);
                res.status(400).json({ message: error.message });
              }
        }


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


        @Put('acceptFriendRequest/:friendshipId')
        @UseGuards(AuthGuard('jwt'))
        async acceptFriendRequest(@Req() req, @Res() res, @Param('friendshipId') friendshipId: string) {
        // const userId = req.user.id;
        const  userId: number = req.user.id
        const parsedFriendshipId = parseInt(friendshipId, 10);
        console.log(parsedFriendshipId)

        const acceptedRequest = await this.apiService.acceptFriendRequest(userId, parsedFriendshipId);
        res.status(200).json({ acceptedRequest });
        }


        @Put('id/status/change')
        @UseGuards(AuthGuard('jwt'))
        async setOnlineStatus(@Req() req, @Res() res, @Body() body) {
            const data:string = body
            console.log(body)
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

        
      

        


}
