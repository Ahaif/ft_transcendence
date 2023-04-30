import { Controller, UseGuards, Post, Req, Res, Body, Put } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';





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
}
