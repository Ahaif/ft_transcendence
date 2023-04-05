import { Controller, Post, Body, ParseIntPipe, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { auth_dto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth(): Promise<void> {}

  // @Get('dashboard')
  // @UseGuards(AuthGuard('42'))
  // async fortyTwoAuthRedirect(@Req() req): Promise<void> {
  //   const user = req.user;
  //   // do something with the authenticated user
  // }

  @Get('generate-42-auth-url')
  async generate42AuthUrl(@Req() req): Promise<{ url: string }> {
    const redirectUri = 'http://localhost:3001/auth/dashboard';
    const clientId = 'u-s4u-s4t2ud-40f384fe51895192d4bcc2f8a4d4080b724c58eef637e8618a25e9f5dd8eb0f1t2ud-40f384fe51895192d4bcc2f8a4d4080b724c58eef637e8618a25e9f5dd8eb0f1';
    const scope = 'public';
    const state = '42oauth';
    // const url = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
    const url = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-40f384fe51895192d4bcc2f8a4d4080b724c58eef637e8618a25e9f5dd8eb0f1&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fdashboard&response_type=code`
    return { url };
  }

  @Post('signup')
  signup(@Body() dto: auth_dto) {
    console.log({
      dto,
    });
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: auth_dto) {
    return this.authService.signin(dto);
  }
}
