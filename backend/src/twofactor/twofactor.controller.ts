import { Jwt2fa } from './../auth/jwt/jwt-2fa';
import { JwtService } from '@nestjs/jwt';
import { Users } from './../users/users';
import { Controller, Get, Post, UseGuards, Req, Res, HttpCode, Body } from '@nestjs/common';
import { Twofactor } from './twofactor';
import { TwoFactorDTO } from 'src/DTOs/TwoFactorDTO';
import { AuthGuard } from '@nestjs/passport';

@Controller('otp')
export class TwofactorController {
    constructor(private readonly twofactor: Twofactor,
                private readonly userService: Users,
                private readonly jwtService: JwtService,
                private readonly otpJwt: Jwt2fa) {}


    @Get('info')
    @UseGuards(AuthGuard('jwt'))
    async getTwoFactorInfo(@Req() req, @Res() res) {
        const intraName  = req.user.user;
        const info = await this.userService.getUserInfo(intraName);
        if (info.otpEnabled === false) {
           return res.status(200);
        }
        else if (info.otpEnabled === true) {
            if (req.user.otpUnauthenticated === false) {
                return res.status(200);
            }
            else
                return res.status(401);
        }
        return res.status(200)
    }

    @Post('enable')
    @UseGuards(AuthGuard('jwt'))
    async enableTwoFactor(@Req() req, @Res() res, @Body() body: TwoFactorDTO) {
        const { token } = body;
        const intraName = req.user.user;
        const verified = await this.twofactor.verifyToken(intraName, token);
        if (!verified) {
            return res.status(401).send('Unauthorized');
        }
        await this.userService.enableTwoFactor(intraName);
        res.status(200).send('OK');
    }

    @Post('disable')
    @UseGuards(AuthGuard('jwt'))
    async disableTwoFactor(@Req() req, @Res() res) {
        const intraName = req.user.user;
        await this.userService.disableTwoFactor(intraName);
    }

    @Post('verify')
    @UseGuards(AuthGuard('otp-verify'))
    async verifyTwoFactor(@Req() req, @Res() res, @Body() body: TwoFactorDTO) {

        const { token } = req.body;
        if (!token) {
            return res.status(401).send('Two factor token is required');
        }
        const intraName  = req.user.user;
        const verified = await this.twofactor.verifyToken(intraName, token);
        if (!verified) {
            return res.status(401).send('Unauthorized');
        }
        let access_token = this.jwtService.sign({
            user: req.user.user,
            id: req.user.id,
            otpEnabled: req.user.otpEnabled,
            otpUnauthenticated: false,
         });
        return (res.status(200).send({access_token}));
    }


    @Post('generate')
    @UseGuards(AuthGuard('jwt'))
    async generateSecret(@Req() req, @Res() res) {
        const { otpUrl } = await this.twofactor.generateSecret(req.user.user);
        return res.status(200).json({ otpUrl });
    }

}
