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
    // console.log("passed 1", {data: ExtractJwt.fromAuthHeaderAsBearerToken()} )
  }

  async validate(payload: any) {
    console.log("passed")

    const email = payload.sub;
    const accessToken = payload.accessToken;

    console.log(email);


    return { 
      email,
      accessToken
    };
  }
}
