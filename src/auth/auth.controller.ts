import { Controller, Post, Body, ParseIntPipe, Get, Req,Res, Query, Param} from '@nestjs/common';
import { Response} from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { auth_dto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Get('42')
  // @UseGuards(AuthGuard('42'))
  // async fortyTwoAuth(): Promise<void> {}

  @Get('dashboard')
  @UseGuards(AuthGuard('42'))
  async dashboard(@Req() req, @Res() res) {

    const code = req.query.code;
    try {
      const accessToken = await this.authService.exchangeCodeForToken(code);

    // Send the access token to the front-end
      res.redirect(`http://localhost:3001/dashboard?access_token=${accessToken}`);
   
    } catch (error) {
    console.error('Error exchanging code for token:', error);
    console.log(error)
  }
    
  }

  @Get('generate-42-auth-url')
  async generate42AuthUrl(@Req() req): Promise<{ url: string }> {
    const redirectUri = 'http://localhost:3000/auth/dashboard';
    const clientId = 'u-s4t2ud-c73b0d60dab9c28bab7af6f2578a6c8c463110dd695b0818c224210eb390eb0f';
    const scope = 'public';
    const state = '42oauth';
    const url = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
    return { url };
  }

  @Post('signup')
  signup(@Body() dto: auth_dto) {
    console.log({
      dto,
    });
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: auth_dto) {
    return this.authService.signin(dto);
  }
}
