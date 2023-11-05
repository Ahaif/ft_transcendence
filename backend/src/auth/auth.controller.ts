import { FtAuthGuard } from './ft.guard';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOAuth2, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('auth/42')
@Controller('auth/42')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    @UseGuards(AuthGuard('42'))
    async fortyTwoLogin(@Req() req) {
        // initiates the 42 OAuth2 login flow
    }


    @ApiOkResponse({ description: 'Returns current user in database or create it if it doesn\'t exists' })
    @Get('callback')
    @UseGuards(AuthGuard('42'))
    async fortyTwoLoginCallback(@Req() req, @Res() res) {
        let resp: any = await this.authService.login(req);
        let jwt: any = resp.access_token;
        let exists: boolean = resp.isExisting;
        let otpEnabled: boolean = resp.otpEnabled;
        let frontEndUrl = process.env.FRONTEND_CALLBACK || 'http://localhost:5173/auth/42/callback';
        res.redirect(`${frontEndUrl}?access_token=${jwt}&exists=${exists}&otp=${otpEnabled}`);
    }





    @ApiOkResponse({ description: 'Returns 200 if token is valid, 403 if not' })
    @ApiParam({ name: 'access_token', description: 'JWT token to verify' })
    @Post('jwt/verify')
    async verifyJwt(@Req() req, @Res() res) {
        const valid: boolean = await this.authService.validateJwt(req.body.access_token);
        if (valid === true) {
            res.status(200).send('');
        } else {
            res.status(403).send('');
        }
    }

}
