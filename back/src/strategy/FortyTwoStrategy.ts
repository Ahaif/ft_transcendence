import { Injectable, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: 'u-s4t2ud-c73b0d60dab9c28bab7af6f2578a6c8c463110dd695b0818c224210eb390eb0f',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/dashboard',
    });
  }

  async validate(accessToken:string, refreshToken:string, profile: any, cb){
  
   
  
    const user = await this.authService.findOrCreateUser(profile, accessToken);

    const neWuser = {
      id: 0,
      ...user,
      displayName: profile.displayName,
      hash: undefined,
      access_token: undefined,
      twofa_secret: undefined,
    };
    
    // console.log(profile.displayName);
    // console.log(profile.photos);
    
    
    cb(null, neWuser);
    
  }

}