import { Controller, Get,Post, UseGuards, Req, Body, Res } from '@nestjs/common';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    @Post('avatar')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const randomName = uuidv4().replace(/-/g, '');
            const extension = file.originalname.split('.').pop();
            cb(null, `${randomName}.${extension}`);
          },
        }),
      }),
    )

    async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      if (!file.fieldname) {
        throw new BadRequestException('Missing filename');
      }
  
      const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      await this.userService.updateAvatar(url, req.user.id);
  
      return url;
    }

    @Get('data')
    @UseGuards(AuthGuard('jwt'))
    async userData(@Req() req){
    const userData = await this.authService.findByUsername(req.user.id)
    const neWuser = {
      ...userData,
      hash: undefined,
      access_token: undefined,
      twofa_secret: undefined,
    };
    
    return(neWuser)
  }

  @Post('displayName')
  @UseGuards(AuthGuard('jwt'))
  async add_displayName(@Req() req,@Body() body, @Res() res){
    try{
      const displayName = body.displayName;
      console.log("displayName")

      const existingUser = await this.userService.findBydisplayName(displayName);
      if(existingUser) {
        return res.status(400).json({ message: 'Display name already exists' });
      }

      await this.userService.addDisplayName(displayName, req.user.id);

    
      res.status(200).json({ displayName,});
    } catch (error) {
      console.error('Error Saving displayName :', error);
      res.status(500).send('Error Saving displayName');
    }
  }

  }

  