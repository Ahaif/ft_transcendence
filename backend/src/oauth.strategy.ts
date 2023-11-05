import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private configService: ConfigService) {
        super({
            clientID: process.env.FORTYTWO_CLIENT_ID || 'u-s4t2ud-32368b684119db2f031e3ca7c6ad9b563e860bc7bc38178dcfa60299586d441a',
            clientSecret: process.env.FORTYTWO_CLIENT_SECRET || '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',
            callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/42/callback',
            scope: ['public'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { id, username, displayName, emails,_json } = profile;
        const user = {
            id,
            username,
            displayName,
            accessToken,
            refreshToken,
            emails,
            avatar: _json.image.link
        };
        await axios.get('https://api.intra.42.fr/v2/coalitions?user_id=' + user.username, {
            headers: {
                Authorization: 'Bearer ' + user.accessToken
            }
        }).then((response) => {
            user['coalition'] = response.data[0].name;
            user['clCoverUrl'] = response.data[0].cover_url;
            user['clImageUrl'] = response.data[0].image_url;
            user['clColor'] = response.data[0].color;
        }).catch((error) => {

        });
        done(null, user);
    }
}
