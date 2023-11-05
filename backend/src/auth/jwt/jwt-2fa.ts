import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy as PassportJwtStrategy } from 'passport-jwt';

@Injectable()
export class Jwt2fa extends PassportStrategy(PassportJwtStrategy, 'otp-verify') {
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        return {user: payload.user, otpUnauthenticated: payload.otpUnauthenticated };
    }
}
