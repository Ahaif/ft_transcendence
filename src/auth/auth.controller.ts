import { Controller, Post, Body, ParseIntPipe} from '@nestjs/common';
import { AuthService } from './auth.service';
import { auth_dto } from './dto';




@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signup(
      @Body() dto : auth_dto){

      console.log({
        dto,
      });
      
      return this.authService.signup(dto);
    }



    @Post('signin')
    signin(@Body()dto : auth_dto){
      return this.authService.signin(dto);
    }

    
}
