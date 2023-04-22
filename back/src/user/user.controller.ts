import { Controller, Get,Post, UseGuards, Req } from '@nestjs/common';
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

@Controller('user')
export class UserController {

    // private readonly UPLOADS_FOLDER = './uploads';

    constructor(
        private readonly userService: UserService,
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
      console.log("invoked")
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      if (!file.fieldname) {
        throw new BadRequestException('Missing filename');
      }
  
      const url = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      await this.userService.updateAvatar(url, req.user.username);
  
      return url;
    }
  }