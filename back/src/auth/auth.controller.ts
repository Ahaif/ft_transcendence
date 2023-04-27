import { Controller, Post, Body, Get, Req ,Res} from '@nestjs/common';
import { Response} from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { TOTP,  Secret} from 'otpauth'; 
import * as qrcode from 'qrcode';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    ) {}

  @Get('dashboard')
  @UseGuards(AuthGuard('42'))
  async dashboard(@Req() req, @Res() res) {

    try {
       const jwt_token:string = await this.authService.signToken(req.user.id, req.user.twoFactorSecret, req.user.displayName);
       const displayName:string = req.user.displayName
       const avatar:string = req.user.avatar
       if (req.user.twoFactorSecret) {
        res.redirect(`http://localhost:3001/dashboard?access_token=${jwt_token}&displayName=${displayName}&avatar=${avatar}`);

      }
      else{
        res.redirect(`http://localhost:3001/Enable2FA?access_token=${jwt_token}&displayName=${displayName}&avatar=${avatar}`);
      }
    } catch (error) {
    console.error('Error exchanging code for token:', error);
    console.log(error)
  }
  }

  
  @Get('generate-42-auth-url')
  async generate42AuthUrl(): Promise<{ url: string }> {

      const redirectUri = 'http://localhost:3000/auth/dashboard';
      const clientId = 'u-s4t2ud-c73b0d60dab9c28bab7af6f2578a6c8c463110dd695b0818c224210eb390eb0f';
      const scope = 'public';
      const state = '42oauth';
      const url = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
      return { url };

  }




  @Get('enable-2fa')
  @UseGuards(AuthGuard('jwt'))
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

      //update user secret
      await this.authService.addTwoFASecret(req.user.id, secret.base32);

      res.status(200).json({ qrCodeUrl });
    } catch (error) {
      console.error('Error generating 2FA:', error);
      res.status(500).send('Error generating 2FA');
    }
  }



  @Post('check-2fa')
  @UseGuards(AuthGuard('jwt'))
  async check_two_fa(@Req() req, @Res() res, @Body() body) {

    try{

      const user_data = await this.authService.findByUsername(req.user.id)

      const secretFromDB = user_data.twofa_secret;
      const userEnteredCode = body.password;
  
      const isValid = authenticator.verify({
        secret: secretFromDB,
        token: userEnteredCode
      });
  
      if (isValid) {
  
        await this.authService.enableTwoFASecret(req.user.id);
      
        console.log("TOTP VALIDATED");
        res.status(200).json({ success: true }); 
      } else {
        // the user entered an invalid TOTP code, do something else
        res.status(401).json({ success: false, message: 'Invalid TOTP code' });
      }

    }catch(error)
    {
      console.error('Error validating  Pswd:', error);
      res.status(500).send('Error validating PSW');
    }
  }

 
}
