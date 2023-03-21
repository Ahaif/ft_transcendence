import { Controller, Get, Post, Param, Redirect} from '@nestjs/common';
import { AppService} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Get('ab*cd')
    findAll() {
  return 'This route uses a wildcard';
}

}




