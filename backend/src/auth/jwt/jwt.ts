import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';


@Injectable()
export class Jwt extends PassportStrategy(PassportJwtStrategy) {
    constructor() {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET,
      });
    }

    async validate(payload: any) {
        if (payload.otpEnabled === false)
            return {user: payload.user };

        if (payload.otpUnauthenticated === false)
            return {user: payload.user };

    }
  }
