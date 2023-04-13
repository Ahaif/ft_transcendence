import { Controller, Post, Body, ParseIntPipe, Get, Req,Res, Query, Param} from '@nestjs/common';
import { Response} from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { auth_dto } from './dto';

import { TOTP,  Secret } from 'otpauth'; // import the classes you need
import * as qrcode from 'qrcode';

import speakeasy from 'speakeasy'


import { log } from 'console';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth(): Promise<void> {}

  @Get('dashboard')
  @UseGuards(AuthGuard('42'))
  async dashboard(@Req() req, @Res() res) {

    const code = req.query.code;
    console.log(code);

    try {

      // const acc = req.cookies['access_token'];
      // console.log(acc)

      const userEmail = req.user.email
      console.log(userEmail)
      const accessToken = await this.authService.exchangeCodeForToken(code);
       const user = await this.authService.findByUsername(userEmail);
       console.log(user);
       if (user.twoFactorSecret) {
        // Redirect to the 2FA page if the user has enabled 2FA
        res.redirect(`http://localhost:3001/dashboard?access_token=${accessToken}`);
      }
      else{
        res.redirect(`http://localhost:3001/enable-2fa`);
        // console.log("-------passed------")
      }
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


    
// Route for displaying the enable 2FA page

@Get('enable-2fa')
async showEnable2FA(@Req() req, @Res() res) {
  try {
    // Generate a secret key
    const secret = new Secret({ size: 20 });

    // Generate a QR code for the user to scan with a 2FA app
    const appName = 'ft_transcendence';
    const totpUri = new TOTP({
      issuer: appName,
      secret: secret.base32,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    }).toString();
    const qrCodeUrl = await qrcode.toDataURL(totpUri);

    // Set the QR code URL in the response
    res.status(200).json({ qrCodeUrl });
  } catch (error) {
    console.error('Error generating 2FA:', error);
    res.status(500).send('Error generating 2FA');
  }
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
