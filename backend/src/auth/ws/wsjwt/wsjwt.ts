import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class Wsjwt extends PassportStrategy(Strategy, 'wsjwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret',
        });

    }

    async validate(payload: any) {
        return {user: payload.user}
    }
}
