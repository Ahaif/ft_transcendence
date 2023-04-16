import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { jwtConstants } from './constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET')
    });
    console.log("JwtStrategy constructor called.")
  }

  async validate(payload: any) {
    console.log("passed")
    console.log(payload.email);
    console.log(payload.accessToken)

    const email = payload.email;


    // console.log(email);


    return { 
      email,
    };
  }
}
