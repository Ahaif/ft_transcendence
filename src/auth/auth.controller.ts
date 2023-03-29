import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { auth_dto } from './dto';




@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto : auth_dto){

      console.log({
        dto,

      });
      
      return this.authService.signup();
    }



    @Post('signin')
    signin(){
      return this.authService.signin();
    }

    
}
