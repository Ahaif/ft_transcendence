import { Users } from './../users/users';
import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';


@Injectable()
export class Twofactor {
    constructor (private readonly userService: Users) {}

    public async generateSecret(intraName: string) {
        const secret = authenticator.generateSecret();
        const otpUrl = authenticator.keyuri(intraName, 'ft_transcendence', secret);
        await this.userService.setTwoFactor(intraName, secret);

        return {
            secret: secret,
            otpUrl: otpUrl
        }
        
    }

    public async verifyToken(intraName: string, token: string) {
        const secret = await this.userService.getTwoFactor(intraName);
        return authenticator.verify({ token, secret });
    }

    public async pipQrCode(stream: Response, otpUrl: string) {
        return toFileStream(stream, otpUrl);
    }

}
