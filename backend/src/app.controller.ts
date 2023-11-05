import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Prisma } from '@prisma/client';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  HomePage(@Res() res: any) {
    res.redirect('/docs')
  }
}
