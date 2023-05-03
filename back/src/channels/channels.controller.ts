import { Controller, UseGuards, Post, Req, Res, Body, Put, Param } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ParseIntPipe } from '@nestjs/common';





@Controller('channels')
export class ChannelsController {

    constructor(
        private readonly channelsService: ChannelsService,
        private readonly jwtService: JwtService,
        ) {}

    
    //create channel
    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async createChannel(@Req() req , @Res() res, @Body() body){

        try{
            const channelName = body.channelName;
            console.log(channelName);
            const userId = req.user.id;
            const newChannel = await this.channelsService.createChannel(channelName, userId)
            res.status(200).json({ newChannel });

        }catch(error)
        {
            res.status(400).json({ message: error.message });
        }
    }

    //change channel to private 
    @Post('privacy/private')
    @UseGuards(AuthGuard('jwt'))
    async channelPrivacy(@Req() req , @Res() res, @Body() body){
        try{
            const channelName = body.channelName;
            const userId = req.user.id
            console.log(channelName)

            const updatedChannel = await this.channelsService.privateChannel(channelName, userId)
            res.status(200).json({updatedChannel });
        }catch(error){
            res.status(400).json({ message: error.message });
        }

    }

    //set password for a channel
    @Post('privacy/password')
    @UseGuards(AuthGuard('jwt'))
    async setChannelPassword(@Req() req, @Res() res, @Body() body) {
    try {
        const { channelName, password } = body;
        const userId = req.user.id;

        const updatedChannel = await this.channelsService.setChannelPassword(channelName, password, userId);
        res.status(200).json({ updatedChannel });
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
    }


    //change password for channel
    @Post('change/password')
    @UseGuards(AuthGuard('jwt'))
    async changeChannelPassword(@Req() req, @Res() res, @Body() body){
        try {
            const { channelName, oldPassword, newPassword } = body;
            const userId = req.user.id;

            const updatedChannel = await this.channelsService.changeChannelPassword(channelName, oldPassword, newPassword, userId);
            if(updatedChannel)
            {
                res.status(200).json("updated Channel Password succefuly");

            }
           
        } catch(error) {
            res.status(400).json({ message: error.message });
        }
    }


    //remove password for channel
    @Put('remove/password')
    @UseGuards(AuthGuard('jwt'))
    async removePassword(@Req() req, @Res() res, @Body() body){
        try {
            const { channelName } = body;
            const userId = req.user.id;
    
            const updatedChannel = await this.channelsService.removeChannelPassword(channelName, userId);
            if(updatedChannel)
            {
                res.status(200).json("Password removed from channel succefuly");
    
            }
           
        } catch(error) {
            res.status(400).json({ message: error.message });
        }
    }



    //set user as admin
    @Put(':channelId/addAdmin/:userId')
    @UseGuards(AuthGuard('jwt'))
    async addAdmin(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req,
        @Res() res
      ) {
        try {
            const ownerId: number = req.user.id;
            const channel = await this.channelsService.getChannelByIdAndOwner(
              channelId,
              ownerId
            );
            if (!channel) {
              return res.status(404).json({ message: 'Channel not found' });
            }
            if (channel.ownerId !== ownerId) {
              return res.status(403).json({ message: 'You are not the channel owner' });
            }
            console.log(channel)
            const updatedChannel = await this.channelsService.addAdmin(channelId, userId);
            return res.status(200).json({ message: 'Admin added successfully', updatedChannel });
          } catch (error) {
            return res.status(400).json({ message: error.message });
          }

      }

         //join channel
        @Put(':channelId/join')
        @UseGuards(AuthGuard('jwt'))
        async joinChannel(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Req() req,
        @Res() res,
        ) {
        try {
            const userId: number = req.user.id;

            await this.channelsService.joinChannel(channelId, userId);

            return res.status(200).json({ message: 'Joined the channel successfully' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
        }

        //bane user from a channel
        @Put(':channelId/banUser/:userId')
        @UseGuards(AuthGuard('jwt'))
        async banUser(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req,
        @Res() res,
        ) {
        try {
            const ownerId: number = req.user.id;
            const channel = await this.channelsService.getChannelByIdAndOwner(
            channelId,
            ownerId,
            );

            if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
            }

            if (channel.ownerId !== ownerId) {
            return res.status(403).json({ message: 'You are not the channel owner' });
            }

            await this.channelsService.banUser(channelId, userId);

            return res.status(200).json({ message: 'User banned successfully' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
        }



        //kick a user from a channel
        @Put(':channelId/kickUser/:userId')
        @UseGuards(AuthGuard('jwt'))
        async kickUser(
        @Param('channelId', ParseIntPipe) channelId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Req() req,
        @Res() res,
        ) {
            try {
                const ownerId: number = req.user.id;
                const channel = await this.channelsService.getChannelByIdAndOwner(
                channelId,
                ownerId,
                );

                if (!channel) {
                return res.status(404).json({ message: 'Channel not found' });
                }

                if (channel.ownerId !== ownerId) {
                return res.status(403).json({ message: 'You are not the channel owner' });
                }

                await this.channelsService.kickUser(channelId, userId, ownerId);

                return res.status(200).json({ message: 'User kicked successfully' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
        }



}
