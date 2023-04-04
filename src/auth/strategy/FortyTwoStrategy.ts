import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: 'u-s4t2ud-40f384fe51895192d4bcc2f8a4d4080b724c58eef637e8618a25e9f5dd8eb0f1',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/dashboard',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const user = await this.authService.findOrCreateUser(profile);
    done(null, user);
  }
}