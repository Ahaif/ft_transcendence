import { Strategy } from 'passport-otp';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Injectable()
export class TwoFactorAuthStrategy extends PassportStrategy(Strategy, '2fa') {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {
    super({
      // configure the options for the OTP strategy as needed
      // see the documentation for passport-otp for more information
    });
  }

  async validate(token: string, done: (error: any, user?: any, info?: any) => void) {
    try {
      const user = await this.twoFactorAuthService.verifyToken(token, done);
      done(null, user);
    } catch (error) {
      done(error);
  }
  
}
}