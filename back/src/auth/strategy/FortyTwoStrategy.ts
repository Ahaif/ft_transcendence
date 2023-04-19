import { Injectable, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: 'u-s4t2ud-c73b0d60dab9c28bab7af6f2578a6c8c463110dd695b0818c224210eb390eb0f',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/dashboard',
    });
  }

  async validate(accessToken, refreshToken, profile, cb){
   
  
    const user = await this.authService.findOrCreateUser(profile, accessToken);

    const neWuser = {
      ...user,
      displayName: profile.displayName,
      hash: undefined,
      access_token: undefined,
      twofa_secret: undefined,
    };
    
    // console.log(profile.displayName);
    // console.log(profile.photos);
    
    console.log(neWuser);
    cb(null, neWuser);
    
  }

  // function(accessToken, refreshToken, profile, cb) {
  //   // User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
  //   //   return cb(err, user);
  //   // });
  //   console.log('42 strategy invoked');
  // }
}